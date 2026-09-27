/**
 * DINO ARENA: CRETACEOUS ADAPTATIONS & CLASH — MASTER ARCADE CONTROLLER
 * 70-Minute (2-Lesson) 7-Stage Interactive Game Controller
 * 1. Mystery Silhouette & Roar Chamber
 * 2. 3D Hologram Anatomy Scanner
 * 3. Diet Airlock Sorter
 * 4. Comparative Balance Scale Gym
 * 5. 1v1 Cretaceous Showdown Arena
 * 6. Teleprompter Studio
 * 7. Exit Diagnostic & Printable Field Passport
 */

(function() {
  'use strict';

  // --- Master Reactive Player State ---
  const playerSession = {
    currentStage: 1,
    scoreXP: 0,
    maxXP: 200,
    streak: 0,
    isLocked: false,
    audioInitialized: false,

    // Stage 1: Mystery
    stage1Index: 0,
    stage1Solved: new Set(),

    // Stage 2: Scanner
    selectedScannerDinoId: 'trex',

    // Stage 3: Diet Sorter
    stage3Index: 0,
    stage3SortedCount: 0,

    // Stage 4: Balance Gym
    stage4Index: 0,
    slottedTokens: [],
    availableTokens: [],

    // Stage 5: 1v1 Arena
    stage5Index: 0,
    championDinoId: 'trex',

    // Stage 6: Teleprompter
    teleprompterSpeaking: false,

    // Stage 7: Exit Quiz
    quizIndex: 0,
    quizCorrectCount: 0
  };

  // Safe Audio Reference
  const audio = window.DinoArenaAudio || window.dinoAudio || {
    initCtx: () => {},
    playCardSnap: () => {},
    playClashImpact: () => {},
    playStampSlam: () => {},
    playXPChime: () => {},
    playSoftFail: () => {},
    playVictoryFanfare: () => {},
    playRoar: () => {},
    playFootstep: () => {},
    playThud: () => {},
    speak: (t, b, e) => { if (e) e(); },
    stopSpeech: () => {},
    toggleMute: () => false
  };

  function ensureAudio() {
    if (!playerSession.audioInitialized) {
      audio.initCtx();
      playerSession.audioInitialized = true;
    }
  }
  document.addEventListener('click', ensureAudio, { once: true });
  document.addEventListener('keydown', ensureAudio, { once: true });

  // DOM Elements Cache
  const elements = {
    // HUD
    xpLabel: document.getElementById('hud-xp-label'),
    energyFill: document.getElementById('hud-energy-fill'),
    energyPct: document.getElementById('hud-energy-pct'),
    streakCount: document.getElementById('hud-streak-count'),
    btnSoundToggle: document.getElementById('btn-sound-toggle'),
    btnFullscreenToggle: document.getElementById('btn-fullscreen-toggle'),

    // Nav Tabs & Panels
    stageTabs: document.querySelectorAll('.stage-tab'),
    phasePanels: document.querySelectorAll('.phase-panel'),

    // Confetti
    confettiCanvas: document.getElementById('confetti-canvas'),

    // Stage 1
    stage1Title: document.getElementById('stage1-title'),
    mysteryArtStage: document.getElementById('mystery-art-stage'),
    mysteryDinoSprite: document.getElementById('mystery-dino-sprite'),
    btnMysteryFootsteps: document.getElementById('btn-mystery-footsteps'),
    btnMysteryRoar: document.getElementById('btn-mystery-roar'),
    mysteryRoundIndicator: document.getElementById('mystery-round-indicator'),
    mysteryCluesList: document.getElementById('mystery-clues-list'),
    mysteryOptionsGrid: document.getElementById('mystery-options-grid'),
    btnNextMystery: document.getElementById('btn-next-mystery'),

    // Stage 2
    scannerCardsContainer: document.getElementById('scanner-cards-container'),

    // Stage 3
    dietBeltProgress: document.getElementById('diet-belt-progress'),
    dietDinoSprite: document.getElementById('diet-dino-sprite'),
    dietDinoName: document.getElementById('diet-dino-name'),
    dietDinoHint: document.getElementById('diet-dino-hint'),
    btnSortCarnivore: document.getElementById('btn-sort-carnivore'),
    btnSortHerbivore: document.getElementById('btn-sort-herbivore'),
    dietStampToast: document.getElementById('diet-stamp-toast'),

    // Stage 4
    scaleBeam: document.getElementById('scale-beam'),
    scaleDinoLeft: document.getElementById('scale-dino-left'),
    scaleDinoRight: document.getElementById('scale-dino-right'),
    panStatLeft: document.getElementById('pan-stat-left'),
    panStatRight: document.getElementById('pan-stat-right'),
    builderPromptLabel: document.getElementById('builder-prompt-label'),
    formulaSlotBar: document.getElementById('formula-slot-bar'),
    wordTokenBank: document.getElementById('word-token-bank'),
    btnBuilderReset: document.getElementById('btn-builder-reset'),
    btnBuilderCheck: document.getElementById('btn-builder-check'),
    btnBuilderNext: document.getElementById('btn-builder-next'),

    // Stage 5
    clashQuestionTitle: document.getElementById('clash-question-title'),
    cardClashLeft: document.getElementById('card-clash-left'),
    cardClashRight: document.getElementById('card-clash-right'),
    clashImgLeft: document.getElementById('clash-img-left'),
    clashImgRight: document.getElementById('clash-img-right'),
    clashNameLeft: document.getElementById('clash-name-left'),
    clashNameRight: document.getElementById('clash-name-right'),
    clashStatsLeft: document.getElementById('clash-stats-left'),
    clashStatsRight: document.getElementById('clash-stats-right'),
    clashStampToast: document.getElementById('clash-stamp-toast'),

    // Stage 6
    teleprompterDinoSprite: document.getElementById('teleprompter-dino-sprite'),
    teleprompterDinoName: document.getElementById('teleprompter-dino-name'),
    teleprompterDinoTitle: document.getElementById('teleprompter-dino-title'),
    teleprompterScriptBox: document.getElementById('teleprompter-script-box'),
    btnBroadcastTeleprompter: document.getElementById('btn-broadcast-teleprompter'),
    btnClaimTeleprompter: document.getElementById('btn-claim-teleprompter'),

    // Stage 7
    quizQuestionNumber: document.getElementById('quiz-question-number'),
    quizScoreDisplay: document.getElementById('quiz-score-display'),
    quizQuestionText: document.getElementById('quiz-question-text'),
    quizOptionsList: document.getElementById('quiz-options-list'),
    quizFeedbackBox: document.getElementById('quiz-feedback-box')
  };

  // --- XP & Evolution Energy Routing ---
  function awardXP(amount) {
    playerSession.scoreXP = Math.min(playerSession.maxXP, playerSession.scoreXP + amount);
    const pct = Math.round((playerSession.scoreXP / playerSession.maxXP) * 100);

    if (elements.xpLabel) {
      elements.xpLabel.textContent = `${playerSession.scoreXP} / ${playerSession.maxXP} XP`;
    }
    if (elements.energyFill) {
      elements.energyFill.style.width = `${pct}%`;
    }
    if (elements.energyPct) {
      elements.energyPct.textContent = `${pct}%`;
    }

    if (window.AdventureAcademy && typeof window.AdventureAcademy.awardXP === 'function') {
      window.AdventureAcademy.awardXP(amount);
    } else {
      try {
        const storedXP = parseInt(localStorage.getItem('adventure_academy_xp') || '0', 10);
        localStorage.setItem('adventure_academy_xp', (storedXP + amount).toString());
      } catch (e) {}
    }
  }

  function updateStreak(increment = true) {
    if (increment) {
      playerSession.streak++;
    } else {
      playerSession.streak = 0;
    }
    if (elements.streakCount) {
      elements.streakCount.textContent = `${playerSession.streak}x`;
    }
  }

  // --- Stage Navigation Router ---
  function switchStage(stageNum) {
    ensureAudio();
    audio.playCardSnap();
    audio.stopSpeech();
    playerSession.currentStage = stageNum;

    elements.stageTabs.forEach(tab => {
      const s = parseInt(tab.getAttribute('data-stage'), 10);
      tab.classList.toggle('active', s === stageNum);
    });

    elements.phasePanels.forEach(panel => {
      const s = parseInt(panel.getAttribute('data-stage'), 10);
      panel.classList.toggle('active', s === stageNum);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Stage Bootstraps
    if (stageNum === 1) loadStage1Round(playerSession.stage1Index);
    else if (stageNum === 2) initStage2Scanner();
    else if (stageNum === 3) loadStage3Dino(playerSession.stage3Index);
    else if (stageNum === 4) loadStage4GymRound(playerSession.stage4Index);
    else if (stageNum === 5) loadStage5Battle(playerSession.stage5Index);
    else if (stageNum === 6) loadStage6Teleprompter(playerSession.championDinoId);
    else if (stageNum === 7) loadStage7Quiz(playerSession.quizIndex);
  }

  // ==========================================================================
  // STAGE 1: MYSTERY SILHOUETTE & ROAR CHAMBER
  // ==========================================================================
  function loadStage1Round(roundIdx) {
    if (roundIdx >= DINO_ARENA_DATA.mysteryRounds.length) {
      // Completed all mysteries, auto-suggest Stage 2
      switchStage(2);
      return;
    }

    const round = DINO_ARENA_DATA.mysteryRounds[roundIdx];
    const dino = DINO_ARENA_DATA.dinosaurs.find(d => d.id === round.dinoId);
    if (!dino) return;

    if (elements.stage1Title) elements.stage1Title.textContent = `🔍 ${round.title.toUpperCase()}`;
    if (elements.mysteryRoundIndicator) elements.mysteryRoundIndicator.textContent = `Specimen ${roundIdx + 1} / ${DINO_ARENA_DATA.mysteryRounds.length}`;

    // Reset silhouette
    if (elements.mysteryArtStage) elements.mysteryArtStage.classList.remove('revealed');
    if (elements.mysteryDinoSprite) {
      elements.mysteryDinoSprite.src = dino.asset;
      elements.mysteryDinoSprite.alt = dino.name;
    }
    if (elements.btnNextMystery) elements.btnNextMystery.style.display = 'none';

    // Render Clues
    if (elements.mysteryCluesList) {
      elements.mysteryCluesList.innerHTML = '';
      round.clues.forEach(c => {
        const chip = document.createElement('div');
        chip.className = 'mystery-clue-chip';
        chip.innerHTML = `<span>${c.icon}</span> <span><strong>${c.label}:</strong> ${c.text}</span>`;
        elements.mysteryCluesList.appendChild(chip);
      });
    }

    // Render 4 Options
    if (elements.mysteryOptionsGrid) {
      elements.mysteryOptionsGrid.innerHTML = '';
      round.options.forEach(optId => {
        const targetDino = DINO_ARENA_DATA.dinosaurs.find(d => d.id === optId);
        if (!targetDino) return;

        const btn = document.createElement('button');
        btn.className = 'btn-3d btn-ghost';
        btn.textContent = targetDino.name;
        btn.addEventListener('click', () => handleMysteryGuess(btn, optId, round.dinoId, dino));
        elements.mysteryOptionsGrid.appendChild(btn);
      });
    }
  }

  function handleMysteryGuess(btnElem, guessedId, correctId, dino) {
    ensureAudio();

    if (guessedId === correctId) {
      // Correct!
      audio.playRoar();
      audio.playXPChime();
      spawnConfetti(45);
      awardXP(20);
      updateStreak(true);

      if (elements.mysteryArtStage) {
        elements.mysteryArtStage.classList.add('revealed');
      }

      btnElem.classList.remove('btn-ghost');
      btnElem.classList.add('btn-emerald');
      btnElem.style.borderColor = '#10b981';

      // Disable other buttons
      elements.mysteryOptionsGrid.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');

      // Voice modeling
      audio.speak(`That's right! It is ${dino.name}! ${dino.clue}`);

      if (elements.btnNextMystery) {
        elements.btnNextMystery.style.display = 'inline-flex';
      }
    } else {
      // Soft-fail
      audio.playSoftFail();
      updateStreak(false);
      btnElem.classList.remove('wobble');
      void btnElem.offsetWidth;
      btnElem.classList.add('wobble');
      audio.speak('Not quite! Check the weight and diet clues again.');
    }
  }

  // ==========================================================================
  // STAGE 2: 3D HOLOGRAM ANATOMY SCANNER
  // ==========================================================================
  function initStage2Scanner() {
    if (!elements.scannerCardsContainer) return;
    elements.scannerCardsContainer.innerHTML = '';

    DINO_ARENA_DATA.dinosaurs.forEach(dino => {
      const card = document.createElement('div');
      card.className = 'scanner-flip-card';
      card.setAttribute('data-id', dino.id);

      card.innerHTML = `
        <div class="scanner-card-inner">
          <!-- Front View (65% Full-Bleed Artwork) -->
          <div class="scanner-card-front">
            <div class="card-hero-stage">
              <span class="hud-pill" style="position: absolute; top: 12px; left: 12px; z-index: 10;">${dino.badge}</span>
              <div class="isometric-pedestal" style="border-color: ${dino.accentColor}; box-shadow: 0 0 24px ${dino.glowColor};"></div>
              <img class="hero-3d-sprite" src="${dino.asset}" alt="${dino.name}">
            </div>
            <div class="scanner-info-tray">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #ffffff;">${dino.name}</h3>
                <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 700;">${dino.period}</span>
              </div>
              <p style="font-size: 0.85rem; color: #cbd5e1;">${dino.weaponDesc}</p>
              <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.75rem; color: #f59e0b; font-weight: 800;">🔄 TAP TO FLIP</span>
                <span style="font-size: 0.85rem; font-family: 'JetBrains Mono', monospace; color: #38bdf8;">${dino.weightKg.toLocaleString()} kg</span>
              </div>
            </div>
          </div>

          <!-- Back View (Anatomy Hotspots) -->
          <div class="scanner-card-back">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 8px;">
              <h4 style="font-size: 1rem; font-weight: 800; color: #fbbf24;">${dino.name} Anatomy</h4>
              <span style="font-size: 0.75rem; color: #94a3b8;">🔄 Click to Flip Back</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px; font-size: 0.85rem;">
              <div><strong>Diet:</strong> ${dino.diet} (${dino.dietIcon})</div>
              <div><strong>Teeth:</strong> ${dino.teeth}</div>
              <div><strong>Speed:</strong> ${dino.speedKmh} km/h</div>
              <div><strong>Armor Rating:</strong> ${dino.armorRating} / 10</div>
            </div>
            <div style="margin-top: auto;">
              <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 700;">MODEL AUDIO PINS:</span>
              <div class="hotspot-pins-row">
                ${dino.hotspots.map(h => `<button class="hotspot-pin" data-phrase="${h.phrase}">📍 ${h.label}</button>`).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      // Flip toggle
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('hotspot-pin')) {
          e.stopPropagation();
          ensureAudio();
          audio.playCardSnap();
          const phrase = e.target.getAttribute('data-phrase');
          audio.speak(phrase);
          return;
        }
        ensureAudio();
        audio.playCardSnap();
        card.classList.toggle('flipped');
      });

      elements.scannerCardsContainer.appendChild(card);
    });
  }

  // ==========================================================================
  // STAGE 3: DIET AIRLOCK SORTER
  // ==========================================================================
  function loadStage3Dino(index) {
    if (index >= DINO_ARENA_DATA.dinosaurs.length) {
      // Completed all 6 sorter rounds
      audio.playVictoryFanfare();
      spawnConfetti(50);
      switchStage(4);
      return;
    }

    const dino = DINO_ARENA_DATA.dinosaurs[index];
    if (elements.dietBeltProgress) {
      elements.dietBeltProgress.textContent = `Specimen ${index + 1} of ${DINO_ARENA_DATA.dinosaurs.length} on Airlock Conveyor`;
    }
    if (elements.dietDinoSprite) {
      elements.dietDinoSprite.src = dino.asset;
      elements.dietDinoSprite.alt = dino.name;
    }
    if (elements.dietDinoName) {
      elements.dietDinoName.textContent = dino.name;
    }
    if (elements.dietDinoHint) {
      elements.dietDinoHint.textContent = `Dental Adaptation: ${dino.teeth}`;
    }
  }

  function handleDietSort(selectedDiet) {
    ensureAudio();
    const dino = DINO_ARENA_DATA.dinosaurs[playerSession.stage3Index];
    if (!dino) return;

    if (selectedDiet.toLowerCase() === dino.diet.toLowerCase()) {
      // Correct!
      audio.playStampSlam();
      audio.playXPChime();
      awardXP(15);
      updateStreak(true);

      if (elements.dietStampToast) {
        elements.dietStampToast.classList.add('show');
        setTimeout(() => elements.dietStampToast.classList.remove('show'), 1100);
      }

      audio.speak(`${dino.name} is a ${dino.diet.toLowerCase()}! ${dino.dietFact}`);

      setTimeout(() => {
        playerSession.stage3Index++;
        loadStage3Dino(playerSession.stage3Index);
      }, 1200);
    } else {
      // Soft-fail
      audio.playSoftFail();
      updateStreak(false);
      const card = elements.dietSpecimenCard;
      if (card) {
        card.classList.remove('wobble');
        void card.offsetWidth;
        card.classList.add('wobble');
      }
      audio.speak(`Not quite! Look at its teeth: ${dino.teeth}`);
    }
  }

  // ==========================================================================
  // STAGE 4: COMPARATIVE BALANCE SCALE GYM
  // ==========================================================================
  function loadStage4GymRound(index) {
    if (index >= DINO_ARENA_DATA.grammarGymRounds.length) {
      audio.playVictoryFanfare();
      spawnConfetti(50);
      switchStage(5);
      return;
    }

    const round = DINO_ARENA_DATA.grammarGymRounds[index];
    const dinoA = DINO_ARENA_DATA.dinosaurs.find(d => d.id === round.dinoA);
    const dinoB = DINO_ARENA_DATA.dinosaurs.find(d => d.id === round.dinoB);
    if (!dinoA || !dinoB) return;

    if (elements.scaleDinoLeft) elements.scaleDinoLeft.src = dinoA.asset;
    if (elements.scaleDinoRight) elements.scaleDinoRight.src = dinoB.asset;
    if (elements.panStatLeft) elements.panStatLeft.textContent = round.statA;
    if (elements.panStatRight) elements.panStatRight.textContent = round.statB;

    // Tilt beam physically with thud
    if (elements.scaleBeam) {
      elements.scaleBeam.className = 'scale-beam';
      setTimeout(() => {
        elements.scaleBeam.classList.add(round.tilt === 'left' ? 'tilt-left' : 'tilt-right');
        audio.playThud();
      }, 150);
    }

    if (elements.builderPromptLabel) {
      elements.builderPromptLabel.textContent = `Challenge ${index + 1} of ${DINO_ARENA_DATA.grammarGymRounds.length}: Compare ${round.statLabel}!`;
    }

    // Reset Slots
    playerSession.slottedTokens = new Array(round.formulaTokens.length).fill(null);
    renderGymSlots(round);

    // Tokens Bank
    const allTokens = [...round.formulaTokens, ...round.distractors].sort(() => Math.random() - 0.5);
    playerSession.availableTokens = allTokens;
    renderTokenBank();

    if (elements.btnBuilderNext) elements.btnBuilderNext.style.display = 'none';
  }

  function renderGymSlots(round) {
    if (!elements.formulaSlotBar) return;
    elements.formulaSlotBar.innerHTML = '';

    playerSession.slottedTokens.forEach((token, idx) => {
      const slot = document.createElement('div');
      slot.className = `sentence-slot-box ${token ? 'filled' : ''}`;
      slot.textContent = token || `[ Word ${idx + 1} ]`;
      slot.addEventListener('click', () => {
        if (playerSession.slottedTokens[idx]) {
          playerSession.availableTokens.push(playerSession.slottedTokens[idx]);
          playerSession.slottedTokens[idx] = null;
          audio.playCardSnap();
          renderGymSlots(round);
          renderTokenBank();
        }
      });
      elements.formulaSlotBar.appendChild(slot);
    });
  }

  function renderTokenBank() {
    if (!elements.wordTokenBank) return;
    elements.wordTokenBank.innerHTML = '';

    playerSession.availableTokens.forEach((word, idx) => {
      const chip = document.createElement('button');
      chip.className = 'word-token-chip';
      chip.textContent = word;
      chip.addEventListener('click', () => {
        const emptySlotIdx = playerSession.slottedTokens.indexOf(null);
        if (emptySlotIdx !== -1) {
          playerSession.slottedTokens[emptySlotIdx] = word;
          playerSession.availableTokens.splice(idx, 1);
          audio.playCardSnap();
          const round = DINO_ARENA_DATA.grammarGymRounds[playerSession.stage4Index];
          renderGymSlots(round);
          renderTokenBank();
        }
      });
      elements.wordTokenBank.appendChild(chip);
    });
  }

  function checkGymSentence() {
    ensureAudio();
    const round = DINO_ARENA_DATA.grammarGymRounds[playerSession.stage4Index];
    if (!round) return;

    const built = playerSession.slottedTokens.join(' ');
    const target = round.formulaTokens.join(' ');

    if (built === target) {
      // Verified!
      audio.playXPChime();
      audio.speak(round.voiceText);
      awardXP(25);
      updateStreak(true);
      if (elements.btnBuilderNext) elements.btnBuilderNext.style.display = 'inline-flex';
    } else {
      audio.playSoftFail();
      updateStreak(false);
      if (elements.formulaSlotBar) {
        elements.formulaSlotBar.classList.remove('wobble');
        void elements.formulaSlotBar.offsetWidth;
        elements.formulaSlotBar.classList.add('wobble');
      }
      audio.speak('Not quite the right sentence order! Try again.');
    }
  }

  // ==========================================================================
  // STAGE 5: 1v1 CRETACEOUS SHOWDOWN ARENA
  // ==========================================================================
  function loadStage5Battle(index) {
    if (index >= DINO_ARENA_DATA.battles.length) {
      audio.playVictoryFanfare();
      spawnConfetti(60);
      switchStage(6);
      return;
    }

    const battle = DINO_ARENA_DATA.battles[index];
    const dino1 = DINO_ARENA_DATA.dinosaurs.find(d => d.id === battle.dino1);
    const dino2 = DINO_ARENA_DATA.dinosaurs.find(d => d.id === battle.dino2);
    if (!dino1 || !dino2) return;

    if (elements.clashQuestionTitle) elements.clashQuestionTitle.textContent = `⚔️ ${battle.question}`;

    // Left Dino Card
    if (elements.cardClashLeft) elements.cardClashLeft.setAttribute('data-dino', dino1.id);
    if (elements.clashImgLeft) elements.clashImgLeft.src = dino1.asset;
    if (elements.clashNameLeft) elements.clashNameLeft.textContent = dino1.name;
    if (elements.clashStatsLeft) elements.clashStatsLeft.textContent = `Speed: ${dino1.speedKmh} km/h | Weight: ${dino1.weightKg.toLocaleString()} kg | Armor: ${dino1.armorRating}/10`;

    // Right Dino Card
    if (elements.cardClashRight) elements.cardClashRight.setAttribute('data-dino', dino2.id);
    if (elements.clashImgRight) elements.clashImgRight.src = dino2.asset;
    if (elements.clashNameRight) elements.clashNameRight.textContent = dino2.name;
    if (elements.clashStatsRight) elements.clashStatsRight.textContent = `Speed: ${dino2.speedKmh} km/h | Weight: ${dino2.weightKg.toLocaleString()} kg | Armor: ${dino2.armorRating}/10`;
  }

  function handleClashChoice(chosenDinoId, cardElement) {
    ensureAudio();
    const battle = DINO_ARENA_DATA.battles[playerSession.stage5Index];
    if (!battle) return;

    if (chosenDinoId === battle.winnerId) {
      // Winner!
      audio.playClashImpact();
      audio.playXPChime();
      spawnConfetti(45);
      awardXP(25);
      updateStreak(true);

      // Card surge animation
      cardElement.classList.add(cardElement.id.includes('left') ? 'surge-left' : 'surge-right');

      // Stamp slam
      if (elements.clashStampToast) {
        elements.clashStampToast.textContent = `⭐ ${battle.stampText} WINNER!`;
        elements.clashStampToast.classList.add('show');
        setTimeout(() => elements.clashStampToast.classList.remove('show'), 1200);
      }

      // Voice comparative formula
      audio.speak(battle.comparativeFrame);

      // Record champion dino for teleprompter
      playerSession.championDinoId = battle.winnerId;

      setTimeout(() => {
        cardElement.classList.remove('surge-left', 'surge-right');
        playerSession.stage5Index++;
        loadStage5Battle(playerSession.stage5Index);
      }, 1600);
    } else {
      // Soft-fail
      audio.playSoftFail();
      updateStreak(false);
      cardElement.classList.remove('wobble');
      void cardElement.offsetWidth;
      cardElement.classList.add('wobble');
      audio.speak(`Check the stats! ${battle.statComparison}`);
    }
  }

  // ==========================================================================
  // STAGE 6: TELEPROMPTER STUDIO
  // ==========================================================================
  function loadStage6Teleprompter(dinoId) {
    const scriptObj = DINO_ARENA_DATA.teleprompter.find(t => t.dinoId === dinoId) || DINO_ARENA_DATA.teleprompter[0];
    const dino = DINO_ARENA_DATA.dinosaurs.find(d => d.id === scriptObj.dinoId);
    if (!dino) return;

    if (elements.teleprompterDinoSprite) elements.teleprompterDinoSprite.src = dino.asset;
    if (elements.teleprompterDinoName) elements.teleprompterDinoName.textContent = dino.name;
    if (elements.teleprompterDinoTitle) elements.teleprompterDinoTitle.textContent = scriptObj.title;

    if (elements.teleprompterScriptBox) {
      elements.teleprompterScriptBox.innerHTML = '';
      [scriptObj.sentence1, scriptObj.sentence2, scriptObj.sentence3].forEach((sentence, sIdx) => {
        const div = document.createElement('div');
        div.className = 'teleprompter-sentence';
        div.id = `tele-line-${sIdx}`;

        const words = sentence.split(' ');
        words.forEach(w => {
          const span = document.createElement('span');
          span.className = 'karaoke-word';
          span.textContent = w + ' ';
          div.appendChild(span);
        });

        elements.teleprompterScriptBox.appendChild(div);
      });
    }
  }

  function broadcastTeleprompter() {
    ensureAudio();
    audio.playCardSnap();
    audio.stopSpeech();

    const scriptObj = DINO_ARENA_DATA.teleprompter.find(t => t.dinoId === playerSession.championDinoId) || DINO_ARENA_DATA.teleprompter[0];
    const sentences = [scriptObj.sentence1, scriptObj.sentence2, scriptObj.sentence3];
    let currentIdx = 0;

    function playSentence() {
      if (currentIdx >= sentences.length) {
        audio.playVictoryFanfare();
        spawnConfetti(50);
        return;
      }

      document.querySelectorAll('.teleprompter-sentence').forEach((el, idx) => {
        el.classList.toggle('active', idx === currentIdx);
      });

      const lineText = sentences[currentIdx];
      const spans = document.querySelectorAll(`#tele-line-${currentIdx} .karaoke-word`);
      let wordCursor = 0;

      if (spans.length > 0) spans[0].classList.add('highlight');

      audio.speak(
        lineText,
        () => {
          if (wordCursor < spans.length) {
            spans.forEach(s => s.classList.remove('highlight'));
            spans[wordCursor].classList.add('highlight');
            wordCursor++;
          }
        },
        () => {
          if (wordCursor < spans.length) {
            spans.forEach(s => s.classList.add('highlight'));
          }
          currentIdx++;
          setTimeout(playSentence, 600);
        }
      );
    }

    playSentence();
  }

  // ==========================================================================
  // STAGE 7: EXIT DIAGNOSTIC CHECKPOINT
  // ==========================================================================
  function loadStage7Quiz(qIdx) {
    if (qIdx >= DINO_ARENA_DATA.exitQuiz.length) {
      // Completed!
      awardXP(40);
      audio.playVictoryFanfare();
      spawnConfetti(70);

      if (elements.quizQuestionNumber) elements.quizQuestionNumber.textContent = '🎓 PALEONTOLOGIST DIPLOMA UNLOCKED!';
      if (elements.quizQuestionText) {
        elements.quizQuestionText.textContent = 'Congratulations! You mastered Cretaceous anatomy, diet classification, and comparative grammar rules!';
      }
      if (elements.quizOptionsList) {
        elements.quizOptionsList.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 3rem; margin-bottom: 8px;">🏆</div>
            <h3 style="color: #34d399; font-size: 1.4rem; margin-bottom: 8px;">Certified Arena Grandmaster</h3>
            <p style="color: #94a3b8; margin-bottom: 16px;">200 / 200 XP Awarded • Field Passport Ready for Printing!</p>
            <a href="worksheet.html" target="_blank" class="btn-3d btn-amber">
              📄 Open Printable Field Passport
            </a>
          </div>
        `;
      }
      return;
    }

    const q = DINO_ARENA_DATA.exitQuiz[qIdx];
    if (elements.quizQuestionNumber) elements.quizQuestionNumber.textContent = `Question ${qIdx + 1} of ${DINO_ARENA_DATA.exitQuiz.length}`;
    if (elements.quizScoreDisplay) elements.quizScoreDisplay.textContent = `Score: ${playerSession.quizCorrectCount} / ${DINO_ARENA_DATA.exitQuiz.length}`;
    if (elements.quizQuestionText) elements.quizQuestionText.textContent = q.question;

    if (elements.quizOptionsList) {
      elements.quizOptionsList.innerHTML = '';
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.textContent = opt.text;
        btn.addEventListener('click', () => {
          ensureAudio();
          if (opt.isCorrect) {
            audio.playXPChime();
            playerSession.quizCorrectCount++;
            btn.style.borderColor = '#10b981';
            btn.style.background = 'rgba(16, 185, 129, 0.25)';
            audio.speak('Correct! ' + q.explanation);
          } else {
            audio.playSoftFail();
            btn.classList.add('wobble');
            audio.speak(q.explanation);
          }
          setTimeout(() => {
            playerSession.quizIndex++;
            loadStage7Quiz(playerSession.quizIndex);
          }, 1400);
        });
        elements.quizOptionsList.appendChild(btn);
      });
    }
  }

  // ==========================================================================
  // CONFETTI ENGINE (Zero-Dependency Canvas)
  // ==========================================================================
  let confettiCtx = null;
  let particles = [];
  function spawnConfetti(count = 50) {
    const canvas = elements.confettiCanvas;
    if (!canvas) return;
    confettiCtx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f59e0b', '#ef4444', '#10b981', '#38bdf8', '#ffffff'];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.32,
        opacity: 1
      });
    }

    function render() {
      confettiCtx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive++;
          confettiCtx.save();
          confettiCtx.globalAlpha = Math.max(0, p.opacity);
          confettiCtx.translate(p.x, p.y);
          confettiCtx.rotate((p.rotation * Math.PI) / 180);
          confettiCtx.fillStyle = p.color;
          confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          confettiCtx.restore();
        }
      });

      if (alive > 0) {
        requestAnimationFrame(render);
      } else {
        confettiCtx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    render();
  }

  // ==========================================================================
  // EVENT LISTENERS & BOOTSTRAP
  // ==========================================================================
  function setupEventListeners() {
    // Stage Tabs
    elements.stageTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const stageNum = parseInt(tab.getAttribute('data-stage'), 10);
        switchStage(stageNum);
      });
    });

    // Sound Toggle
    if (elements.btnSoundToggle) {
      elements.btnSoundToggle.addEventListener('click', () => {
        ensureAudio();
        const muted = audio.toggleMute();
        elements.btnSoundToggle.textContent = muted ? '🔇' : '🔊';
      });
    }

    // Fullscreen Toggle
    if (elements.btnFullscreenToggle) {
      elements.btnFullscreenToggle.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // Stage 1 Mystery Audio
    if (elements.btnMysteryFootsteps) {
      elements.btnMysteryFootsteps.addEventListener('click', () => {
        ensureAudio();
        audio.playFootstep();
      });
    }
    if (elements.btnMysteryRoar) {
      elements.btnMysteryRoar.addEventListener('click', () => {
        ensureAudio();
        audio.playRoar();
      });
    }
    if (elements.btnNextMystery) {
      elements.btnNextMystery.addEventListener('click', () => {
        playerSession.stage1Index++;
        loadStage1Round(playerSession.stage1Index);
      });
    }

    // Stage 3 Sorter
    if (elements.btnSortCarnivore) {
      elements.btnSortCarnivore.addEventListener('click', () => handleDietSort('Carnivore'));
    }
    if (elements.btnSortHerbivore) {
      elements.btnSortHerbivore.addEventListener('click', () => handleDietSort('Herbivore'));
    }

    // Stage 4 Gym
    if (elements.btnBuilderReset) {
      elements.btnBuilderReset.addEventListener('click', () => {
        ensureAudio();
        audio.playCardSnap();
        loadStage4GymRound(playerSession.stage4Index);
      });
    }
    if (elements.btnBuilderCheck) {
      elements.btnBuilderCheck.addEventListener('click', checkGymSentence);
    }
    if (elements.btnBuilderNext) {
      elements.btnBuilderNext.addEventListener('click', () => {
        playerSession.stage4Index++;
        loadStage4GymRound(playerSession.stage4Index);
      });
    }

    // Stage 5 Battle Cards
    if (elements.cardClashLeft) {
      elements.cardClashLeft.addEventListener('click', () => {
        const id = elements.cardClashLeft.getAttribute('data-dino');
        handleClashChoice(id, elements.cardClashLeft);
      });
    }
    if (elements.cardClashRight) {
      elements.cardClashRight.addEventListener('click', () => {
        const id = elements.cardClashRight.getAttribute('data-dino');
        handleClashChoice(id, elements.cardClashRight);
      });
    }

    // Stage 6 Teleprompter
    if (elements.btnBroadcastTeleprompter) {
      elements.btnBroadcastTeleprompter.addEventListener('click', broadcastTeleprompter);
    }
    if (elements.btnClaimTeleprompter) {
      elements.btnClaimTeleprompter.addEventListener('click', () => {
        awardXP(40);
        audio.playVictoryFanfare();
        spawnConfetti(60);
        switchStage(7);
      });
    }
  }

  function init() {
    setupEventListeners();
    switchStage(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
