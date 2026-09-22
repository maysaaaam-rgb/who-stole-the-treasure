/**
 * DINO ARENA: TOP TRUMPS PALEONTOLOGY CLASH — MASTER APPLICATION
 * Full 6-Stage Interactive CLIL Lesson Engine:
 * 1. Mystery Silhouette & Roar Guessing Game
 * 2. CLIL Diet & Adaptation Lab
 * 3. Comparative Adjective Balance Gym
 * 4. 1v1 Dino Top Trumps Battle Arena
 * 5. Paleontologist Teleprompter Broadcast Studio
 * 6. Exit Diagnostic Checkpoint & Field Passport
 */
(function() {
  'use strict';

  // HUD Elements
  const hudEnergyFill = document.getElementById('hud-energy-fill');
  const hudXpLabel = document.getElementById('hud-xp-label');
  const hudStreakCount = document.getElementById('hud-streak-count');
  const hudSoundBtn = document.getElementById('btn-sound-toggle');
  const hudFullscreenBtn = document.getElementById('btn-fullscreen-toggle');
  const phaseTabs = document.querySelectorAll('.phase-tab');
  const phasePanels = document.querySelectorAll('.phase-panel');

  // Confetti Canvas
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  // Master Reactive playerSession State
  const playerSession = {
    currentPhase: 1,
    scoreXP: 0,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    totalAttempts: 0,
    isLocked: false,

    // Stage 1 State
    stage1Index: 0,
    stage1Solved: new Set(),

    // Stage 2 State
    stage2Index: 0,
    stage2Sorted: { Carnivore: [], Herbivore: [] },

    // Stage 3 State
    stage3Index: 0,
    stage3SlottedTokens: [],
    stage3AvailableTokens: [],

    // Stage 4 State
    stage4RoundIndex: 0,
    championDinoId: 'trex',

    // Stage 5 State
    teleprompterIndex: 0,
    teleprompterSpeaking: false,

    // Stage 6 State
    quizIndex: 0,
    quizCorrectCount: 0,
    quizAnswers: []
  };

  /* ==========================================================================
     CONFETTI PARTICLE ENGINE (ZERO DEPENDENCY)
     ========================================================================== */
  function initConfetti() {
    if (!confettiCanvas) return;
    confettiCtx = confettiCanvas.getContext('2d');
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);
  }

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  function spawnConfetti(count = 50, continuous = false) {
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#38bdf8', '#fbbf24', '#ffffff'];
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: window.innerWidth * (0.2 + Math.random() * 0.6),
        y: window.innerHeight * 0.45,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 15 - 4,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.38,
        opacity: 1
      });
    }

    if (!confettiAnimationId) {
      animateConfetti(continuous);
    }
  }

  function animateConfetti(continuous = false) {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.012;

      if (p.opacity <= 0 || p.y > confettiCanvas.height) {
        confettiParticles.splice(i, 1);
        continue;
      }

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.globalAlpha = Math.max(0, p.opacity);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();
    }

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(() => animateConfetti(continuous));
    } else {
      confettiAnimationId = null;
    }
  }

  /* ==========================================================================
     HUD & REVENUE XP MANAGEMENT
     ========================================================================== */
  function updateHUD() {
    const maxXP = 200;
    const pct = Math.min(100, Math.round((playerSession.scoreXP / maxXP) * 100));
    if (hudEnergyFill) hudEnergyFill.style.width = `${pct}%`;
    if (hudXpLabel) hudXpLabel.textContent = `${playerSession.scoreXP} / ${maxXP} XP`;
    if (hudStreakCount) hudStreakCount.textContent = `${playerSession.streak}x`;
  }

  function addXP(amount) {
    playerSession.scoreXP = Math.min(200, playerSession.scoreXP + amount);
    updateHUD();
    window.DinoArenaAudio.playXP(Math.max(1, playerSession.streak));
  }

  function switchPhase(phaseNum) {
    playerSession.currentPhase = phaseNum;
    phaseTabs.forEach(tab => {
      tab.classList.toggle('active', parseInt(tab.dataset.phase, 10) === phaseNum);
    });

    phasePanels.forEach(panel => {
      panel.classList.toggle('active', parseInt(panel.dataset.phase, 10) === phaseNum);
    });

    window.DinoArenaAudio.playCardSnap();

    // Trigger phase initialization
    if (phaseNum === 1) renderStage1Mystery();
    else if (phaseNum === 2) renderStage2DietLab();
    else if (phaseNum === 3) renderStage3GrammarGym();
    else if (phaseNum === 4) loadClashRound(playerSession.stage4RoundIndex);
    else if (phaseNum === 5) renderStage5Teleprompter(playerSession.teleprompterIndex);
    else if (phaseNum === 6) renderStage6Quiz();
  }

  /* ==========================================================================
     CARD BUILDER COMPONENT (65/35 TOP TRUMPS RATIO FOR BATTLES)
     ========================================================================== */
  function createDinoCardHtml(dino, sideKey = 'card') {
    const isCarnivore = (dino.diet === 'Carnivore');
    const dietBadgeClass = isCarnivore ? 'card-diet-carnivore' : 'card-diet-herbivore';
    
    const speedPct = Math.min(100, Math.round((dino.speedKmh / 60) * 100));
    const weightPct = Math.min(100, Math.round((dino.weightKg / 40000) * 100));
    const armorPct = Math.min(100, dino.armorRating * 10);
    const lengthPct = Math.min(100, Math.round((dino.lengthMeters / 26) * 100));

    return `
      <div class="dino-card" id="${sideKey}-${dino.id}" data-id="${dino.id}">
        
        <!-- Top 65% Hero Visual Zone -->
        <div class="card-hero-zone">
          <div class="card-diet-badge ${dietBadgeClass}">
            <span>${dino.dietIcon}</span>
            <span>${dino.diet}</span>
          </div>

          <button class="card-audio-btn" data-audio-phrase="${dino.name}! ${dino.weaponDesc}" title="Listen to Dinosaur Adaptation">
            🔊
          </button>

          <!-- 100% Self-Contained Multi-Layered Anatomical Vector Artwork with Breathing Physics -->
          <div class="card-vector-stage">
            ${dino.svgArtwork}
          </div>
        </div>

        <!-- Dynamic Physical Rubber Stamp Overlays -->
        <div class="stamp-overlay stamp-winner" id="${sideKey}-stamp-win">
          WINNER!
        </div>
        <div class="stamp-overlay stamp-defeated" id="${sideKey}-stamp-lose">
          DEFEATED
        </div>

        <!-- Bottom 38% Stat HUD -->
        <div class="card-stat-hud">
          <div class="card-dino-name">
            <span>${dino.fallbackIcon} ${dino.name}</span>
            <span class="card-dino-period">${dino.period}</span>
          </div>

          <div class="stat-bars-grid">
            <div class="stat-row">
              <div class="stat-label-row">
                <span>Speed</span>
                <span class="stat-val-text">${dino.speedKmh} km/h</span>
              </div>
              <div class="stat-meter-track">
                <div class="stat-meter-fill stat-fill-speed" style="width: ${speedPct}%"></div>
              </div>
            </div>

            <div class="stat-row">
              <div class="stat-label-row">
                <span>Weight</span>
                <span class="stat-val-text">${dino.weightKg.toLocaleString()} kg</span>
              </div>
              <div class="stat-meter-track">
                <div class="stat-meter-fill stat-fill-weight" style="width: ${weightPct}%"></div>
              </div>
            </div>

            <div class="stat-row">
              <div class="stat-label-row">
                <span>Armor</span>
                <span class="stat-val-text">${dino.armorRating} / 10</span>
              </div>
              <div class="stat-meter-track">
                <div class="stat-meter-fill stat-fill-armor" style="width: ${armorPct}%"></div>
              </div>
            </div>

            <div class="stat-row">
              <div class="stat-label-row">
                <span>Length</span>
                <span class="stat-val-text">${dino.lengthMeters} m</span>
              </div>
              <div class="stat-meter-track">
                <div class="stat-meter-fill stat-fill-length" style="width: ${lengthPct}%"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  /* ==========================================================================
     STAGE 1: MYSTERY SILHOUETTE & ROAR GUESSING GAME
     ========================================================================== */
  const mysteryArtStage = document.getElementById('mystery-art-stage');
  const mysteryCluesList = document.getElementById('mystery-clues-list');
  const mysteryOptionsGrid = document.getElementById('mystery-options-grid');
  const mysteryRoundIndicator = document.getElementById('mystery-round-indicator');
  const mysteryStatusBanner = document.getElementById('mystery-status-banner');
  const btnNextMystery = document.getElementById('btn-next-mystery');
  const btnFootsteps = document.getElementById('btn-mystery-footsteps');
  const btnRoar = document.getElementById('btn-mystery-roar');

  if (btnFootsteps) {
    btnFootsteps.onclick = () => window.DinoArenaAudio.playFootsteps();
  }
  if (btnRoar) {
    btnRoar.onclick = () => window.DinoArenaAudio.playRoar();
  }

  function renderStage1Mystery() {
    const rounds = window.DINO_ARENA_DATA.mysteryRounds;
    if (playerSession.stage1Index >= rounds.length) {
      playerSession.stage1Index = 0;
    }

    const currentMystery = rounds[playerSession.stage1Index];
    const targetDino = window.DINO_ARENA_DATA.dinosaurs.find(d => d.id === currentMystery.dinoId);

    mysteryRoundIndicator.textContent = `Specimen ${playerSession.stage1Index + 1} / ${rounds.length}`;
    mysteryStatusBanner.textContent = "Listen to the audio hints and match the 3 paleontological clues below:";
    btnNextMystery.style.display = 'none';

    // Reset Silhouette Stage to Dark Fog with Pure Vector Silhouette
    mysteryArtStage.className = 'mystery-art-stage';
    mysteryArtStage.innerHTML = `
      <div class="mystery-vector-art-wrap">
        ${targetDino.svgArtwork}
      </div>
    `;

    // Populate Clues with staggered animation
    mysteryCluesList.innerHTML = '';
    currentMystery.clues.forEach((clue, idx) => {
      const clueDiv = document.createElement('div');
      clueDiv.className = 'mystery-clue-item';
      clueDiv.style.animationDelay = `${idx * 0.12}s`;
      clueDiv.innerHTML = `
        <span style="font-size:20px;">${clue.icon}</span>
        <div>
          <strong style="color:#f59e0b; font-size:12px; text-transform:uppercase;">${clue.label}:</strong>
          <span style="color:#f8fafc; font-weight:600; margin-left:6px;">${clue.text}</span>
        </div>
      `;
      mysteryCluesList.appendChild(clueDiv);
    });

    // Populate 4 3D Option Buttons
    mysteryOptionsGrid.innerHTML = '';
    currentMystery.options.forEach(optId => {
      const dinoObj = window.DINO_ARENA_DATA.dinosaurs.find(d => d.id === optId);
      const btn = document.createElement('button');
      btn.className = 'btn-mystery-option';
      btn.innerHTML = `<span>${dinoObj.fallbackIcon}</span> ${dinoObj.name}`;
      btn.onclick = () => handleMysteryGuess(optId, currentMystery.dinoId, btn, targetDino);
      mysteryOptionsGrid.appendChild(btn);
    });

    // Auto-play footsteps to stimulate immersion
    setTimeout(() => {
      window.DinoArenaAudio.playFootsteps();
    }, 350);
  }

  function handleMysteryGuess(chosenId, correctId, btnEl, targetDino) {
    if (playerSession.isLocked) return;

    if (chosenId === correctId) {
      playerSession.isLocked = true;
      btnEl.classList.add('correct');

      // Unmask Silhouette to full vibrant color & elemental aura
      mysteryArtStage.classList.add('revealed');

      // Celebratory Audio & Confetti
      window.DinoArenaAudio.playRoar();
      window.DinoArenaAudio.playVictory();
      spawnConfetti(45);

      // Streak & XP
      playerSession.streak++;
      if (playerSession.streak > playerSession.bestStreak) playerSession.bestStreak = playerSession.streak;
      addXP(25);

      mysteryStatusBanner.innerHTML = `<span style="color:#34d399; font-weight:800;">✓ BRILLIANT! Identified ${targetDino.name}! (+25 XP)</span>`;

      window.DinoArenaAudio.speak(`Correct! That is ${targetDino.name}. ${targetDino.clue}`, null, () => {
        playerSession.isLocked = false;
        btnNextMystery.style.display = 'block';
      });

      playerSession.stage1Solved.add(correctId);

    } else {
      // Soft-fail
      btnEl.classList.add('wrong');
      window.DinoArenaAudio.playSoftFail();
      playerSession.streak = 0;
      updateHUD();

      mysteryStatusBanner.innerHTML = `<span style="color:#f87171; font-weight:700;">✗ Not quite! Review the clues and try again.</span>`;
      setTimeout(() => {
        btnEl.classList.remove('wrong');
      }, 1200);
    }
  }

  if (btnNextMystery) {
    btnNextMystery.onclick = () => {
      playerSession.stage1Index++;
      const total = window.DINO_ARENA_DATA.mysteryRounds.length;
      if (playerSession.stage1Index >= total) {
        // Complete Stage 1 -> Advance to Stage 2
        window.DinoArenaAudio.playVictory();
        spawnConfetti(70);
        setTimeout(() => {
          switchPhase(2);
        }, 800);
      } else {
        renderStage1Mystery();
      }
    };
  }

  /* ==========================================================================
     STAGE 2: CLIL DIET & ADAPTATION LAB
     ========================================================================== */
  const dietSpecimenCard = document.getElementById('diet-specimen-card');
  const dietBeltProgress = document.getElementById('diet-belt-progress');
  const btnSortCarnivore = document.getElementById('btn-sort-carnivore');
  const btnSortHerbivore = document.getElementById('btn-sort-herbivore');
  const dropCarnivore = document.getElementById('drop-carnivore');
  const dropHerbivore = document.getElementById('drop-herbivore');
  const dietFeedbackBanner = document.getElementById('diet-feedback-banner');

  function renderStage2DietLab() {
    const dinos = window.DINO_ARENA_DATA.dinosaurs;
    if (playerSession.stage2Index >= dinos.length) {
      dietBeltProgress.textContent = "All 6 Prehistoric Specimens Classified! Master CLIL Badge Earned!";
      dietSpecimenCard.innerHTML = `
        <div style="font-size:54px; margin-bottom:12px;">🏆</div>
        <h3 style="color:#34d399; font-size:22px; font-weight:800;">DIET LAB CERTIFIED</h3>
        <p style="color:#94a3b8; font-size:14px; margin-top:6px;">All carnivores and herbivores accurately categorized by anatomical adaptations.</p>
        <button class="btn-builder-next" style="margin-top:16px;" onclick="window.switchDinoPhase(3)">
          Advance to Comparative Gym ➔
        </button>
      `;
      return;
    }

    const currentDino = dinos[playerSession.stage2Index];
    dietBeltProgress.textContent = `Specimen ${playerSession.stage2Index + 1} of ${dinos.length} on Airlock Belt`;
    dietFeedbackBanner.style.display = 'none';

    dietSpecimenCard.innerHTML = `
      <div class="diet-vector-stage">
        ${currentDino.svgArtwork}
      </div>
      <h3 class="diet-specimen-title">${currentDino.fallbackIcon} ${currentDino.name}</h3>
      <div class="diet-tooth-callout">
        🦷 <strong>Anatomy &amp; Teeth:</strong> ${currentDino.teeth}
      </div>
    `;

    // Hook Drag & Drop
    dietSpecimenCard.setAttribute('draggable', 'true');
    dietSpecimenCard.ondragstart = (e) => {
      e.dataTransfer.setData('text/plain', currentDino.id);
    };
  }

  function handleDietSort(chosenDiet) {
    if (playerSession.isLocked) return;
    const dinos = window.DINO_ARENA_DATA.dinosaurs;
    if (playerSession.stage2Index >= dinos.length) return;

    const currentDino = dinos[playerSession.stage2Index];
    const isCorrect = (currentDino.diet === chosenDiet);

    if (isCorrect) {
      playerSession.isLocked = true;
      playerSession.stage2Sorted[chosenDiet].push(currentDino.id);

      // Add sorted chip to container
      const targetDrop = (chosenDiet === 'Carnivore') ? dropCarnivore : dropHerbivore;
      const emptyHint = targetDrop.querySelector('.crate-empty-hint');
      if (emptyHint) emptyHint.style.display = 'none';

      const chip = document.createElement('div');
      chip.className = 'sorted-dino-chip';
      chip.innerHTML = `<span>${currentDino.fallbackIcon}</span> <span>${currentDino.name}</span>`;
      targetDrop.appendChild(chip);

      window.DinoArenaAudio.playCardSnap();
      addXP(15);

      dietFeedbackBanner.style.display = 'block';
      dietFeedbackBanner.innerHTML = `✓ ${currentDino.dietFact}`;

      window.DinoArenaAudio.speak(currentDino.dietFact, null, () => {
        playerSession.isLocked = false;
        playerSession.stage2Index++;
        if (playerSession.stage2Index >= dinos.length) {
          spawnConfetti(50);
          addXP(20);
        }
        renderStage2DietLab();
      });

    } else {
      window.DinoArenaAudio.playSoftFail();
      dietSpecimenCard.classList.add('card-wobble');
      dietFeedbackBanner.style.display = 'block';
      dietFeedbackBanner.innerHTML = `✗ Notice the teeth: ${currentDino.teeth}. Does it eat meat or plants?`;

      window.DinoArenaAudio.speak(`Notice the teeth: ${currentDino.teeth}. Try sorting again!`, null, () => {
        dietSpecimenCard.classList.remove('card-wobble');
      });
    }
  }

  if (btnSortCarnivore) btnSortCarnivore.onclick = () => handleDietSort('Carnivore');
  if (btnSortHerbivore) btnSortHerbivore.onclick = () => handleDietSort('Herbivore');

  // Drag over dropzones
  [dropCarnivore, dropHerbivore].forEach(dropZone => {
    if (!dropZone) return;
    dropZone.ondragover = (e) => {
      e.preventDefault();
      dropZone.parentElement.classList.add('dragover');
    };
    dropZone.ondragleave = () => {
      dropZone.parentElement.classList.remove('dragover');
    };
    dropZone.ondrop = (e) => {
      e.preventDefault();
      dropZone.parentElement.classList.remove('dragover');
      const diet = dropZone.parentElement.dataset.diet;
      handleDietSort(diet);
    };
  });

  /* ==========================================================================
     STAGE 3: THE COMPARATIVE ADJECTIVE BALANCE GYM
     ========================================================================== */
  const scaleBeam = document.getElementById('scale-beam');
  const dishLeft = document.getElementById('dish-left');
  const dishRight = document.getElementById('dish-right');
  const panStatLeft = document.getElementById('pan-stat-left');
  const panStatRight = document.getElementById('pan-stat-right');
  const builderPromptLabel = document.getElementById('builder-prompt-label');
  const formulaSlotBar = document.getElementById('formula-slot-bar');
  const wordTokenBank = document.getElementById('word-token-bank');
  const btnBuilderReset = document.getElementById('btn-builder-reset');
  const btnBuilderCheck = document.getElementById('btn-builder-check');
  const btnBuilderNext = document.getElementById('btn-builder-next');
  const builderFeedbackBanner = document.getElementById('builder-feedback-banner');

  function renderStage3GrammarGym() {
    const gymRounds = window.DINO_ARENA_DATA.grammarGymRounds;
    if (playerSession.stage3Index >= gymRounds.length) {
      playerSession.stage3Index = 0;
    }

    const round = gymRounds[playerSession.stage3Index];
    const dinoA = window.DINO_ARENA_DATA.dinosaurs.find(d => d.id === round.dinoA);
    const dinoB = window.DINO_ARENA_DATA.dinosaurs.find(d => d.id === round.dinoB);

    builderPromptLabel.textContent = `Challenge ${playerSession.stage3Index + 1} of ${gymRounds.length}: Compare their ${round.statLabel} on the Digital Scale!`;
    builderFeedbackBanner.style.display = 'none';
    btnBuilderNext.style.display = 'none';

    // Populate Scale Dishes with Vector Art
    dishLeft.innerHTML = `
      <div class="dish-vector-stage">
        ${dinoA.svgArtwork}
      </div>
    `;
    dishRight.innerHTML = `
      <div class="dish-vector-stage">
        ${dinoB.svgArtwork}
      </div>
    `;

    panStatLeft.textContent = `${dinoA.fallbackIcon} ${round.statA}`;
    panStatRight.textContent = `${dinoB.fallbackIcon} ${round.statB}`;

    // Reset Scale Beam to center, then drop with physical thud
    scaleBeam.className = 'scale-beam';
    setTimeout(() => {
      scaleBeam.classList.add(round.tilt === 'left' ? 'tilt-left' : 'tilt-right');
      window.DinoArenaAudio.playThud();
    }, 280);

    // Initialize Tokens & Slots
    playerSession.stage3SlottedTokens = [];
    const allTokens = [...round.formulaTokens, ...round.distractors];
    // Shuffle tokens deterministically
    allTokens.sort(() => Math.random() - 0.5);
    playerSession.stage3AvailableTokens = allTokens;

    renderBuilderSlots(round.formulaTokens.length);
    renderBuilderTokens();
  }

  function renderBuilderSlots(slotCount) {
    formulaSlotBar.innerHTML = '';
    for (let i = 0; i < slotCount; i++) {
      const slot = document.createElement('div');
      const slottedWord = playerSession.stage3SlottedTokens[i];

      if (slottedWord) {
        slot.className = 'formula-slot filled';
        slot.textContent = slottedWord;
        slot.title = 'Click to return word to bank';
        slot.onclick = () => {
          playerSession.stage3SlottedTokens.splice(i, 1);
          renderBuilderSlots(slotCount);
          renderBuilderTokens();
          window.DinoArenaAudio.playCardSnap();
        };
      } else {
        slot.className = 'formula-slot';
        slot.textContent = `[ Word ${i + 1} ]`;
      }
      formulaSlotBar.appendChild(slot);
    }
  }

  function renderBuilderTokens() {
    wordTokenBank.innerHTML = '';
    const round = window.DINO_ARENA_DATA.grammarGymRounds[playerSession.stage3Index];
    const maxSlots = round.formulaTokens.length;

    // Count how many times each token is currently slotted
    const slottedCounts = {};
    playerSession.stage3SlottedTokens.forEach(w => {
      slottedCounts[w] = (slottedCounts[w] || 0) + 1;
    });

    playerSession.stage3AvailableTokens.forEach(token => {
      const isUsed = (slottedCounts[token] && slottedCounts[token] > 0);
      if (isUsed) {
        slottedCounts[token]--;
      }

      const btn = document.createElement('button');
      btn.className = `word-token-chip ${isUsed ? 'used' : ''}`;
      btn.textContent = token;

      if (!isUsed) {
        btn.onclick = () => {
          if (playerSession.stage3SlottedTokens.length < maxSlots) {
            playerSession.stage3SlottedTokens.push(token);
            renderBuilderSlots(maxSlots);
            renderBuilderTokens();
            window.DinoArenaAudio.playCardSnap();
          }
        };
      }

      wordTokenBank.appendChild(btn);
    });
  }

  if (btnBuilderReset) {
    btnBuilderReset.onclick = () => {
      playerSession.stage3SlottedTokens = [];
      const round = window.DINO_ARENA_DATA.grammarGymRounds[playerSession.stage3Index];
      renderBuilderSlots(round.formulaTokens.length);
      renderBuilderTokens();
      window.DinoArenaAudio.playCardSnap();
    };
  }

  if (btnBuilderCheck) {
    btnBuilderCheck.onclick = () => {
      const round = window.DINO_ARENA_DATA.grammarGymRounds[playerSession.stage3Index];
      const builtString = playerSession.stage3SlottedTokens.join(' ').trim();
      const targetString = round.formulaTokens.join(' ').trim();

      if (builtString === targetString) {
        window.DinoArenaAudio.playVictory();
        spawnConfetti(40);
        addXP(30);

        builderFeedbackBanner.style.display = 'block';
        builderFeedbackBanner.style.background = '#064e3b';
        builderFeedbackBanner.style.border = '2px solid #10b981';
        builderFeedbackBanner.style.color = '#a7f3d0';
        builderFeedbackBanner.innerHTML = `✓ EXCELLENT! "${round.voiceText}" (+30 XP)`;

        window.DinoArenaAudio.speak(round.voiceText, null, () => {
          btnBuilderNext.style.display = 'inline-block';
        });

      } else {
        window.DinoArenaAudio.playSoftFail();
        formulaSlotBar.classList.add('card-wobble');
        setTimeout(() => formulaSlotBar.classList.remove('card-wobble'), 500);

        builderFeedbackBanner.style.display = 'block';
        builderFeedbackBanner.style.background = '#7f1d1d';
        builderFeedbackBanner.style.border = '2px solid #ef4444';
        builderFeedbackBanner.style.color = '#fecaca';
        builderFeedbackBanner.innerHTML = `✗ Check the formula: [Subject Dinosaur] + [Comparative Verb/Adjective] + [Object Dinosaur] + [.]`;

        window.DinoArenaAudio.speak('Check the formula and order of words! Try again.');
      }
    };
  }

  if (btnBuilderNext) {
    btnBuilderNext.onclick = () => {
      playerSession.stage3Index++;
      const total = window.DINO_ARENA_DATA.grammarGymRounds.length;
      if (playerSession.stage3Index >= total) {
        window.DinoArenaAudio.playVictory();
        spawnConfetti(70);
        setTimeout(() => switchPhase(4), 800);
      } else {
        renderStage3GrammarGym();
      }
    };
  }

  /* ==========================================================================
     STAGE 4: 1v1 DINO BATTLE ARENA (THE MAIN SHOWDOWN)
     ========================================================================== */
  const clashQuestion = document.getElementById('clash-question');
  const clashSubtext = document.getElementById('clash-subtext');
  const clashCounter = document.getElementById('clash-counter');
  const cardLeftContainer = document.getElementById('card-left-container');
  const cardRightContainer = document.getElementById('card-right-container');
  const btnPickLeft = document.getElementById('btn-pick-left');
  const btnPickRight = document.getElementById('btn-pick-right');

  function loadClashRound(index) {
    const battles = window.DINO_ARENA_DATA.battles;
    if (index >= battles.length) {
      // Completed all battle rounds -> Advance to Teleprompter Showcase
      window.DinoArenaAudio.playVictory();
      spawnConfetti(65);
      setTimeout(() => switchPhase(5), 900);
      return;
    }

    playerSession.stage4RoundIndex = index;
    playerSession.isLocked = false;
    const battle = battles[index];

    const dino1 = window.DINO_ARENA_DATA.dinosaurs.find(d => d.id === battle.dino1);
    const dino2 = window.DINO_ARENA_DATA.dinosaurs.find(d => d.id === battle.dino2);

    clashQuestion.textContent = battle.question;
    clashSubtext.textContent = `Battle ${index + 1} of ${battles.length} • Click the winning champion or use hotkeys [1] / [2]!`;
    if (clashCounter) clashCounter.textContent = `Round ${index + 1} / ${battles.length}`;

    cardLeftContainer.innerHTML = createDinoCardHtml(dino1, 'left');
    cardRightContainer.innerHTML = createDinoCardHtml(dino2, 'right');

    btnPickLeft.innerHTML = `
      <span class="btn-main-text">👈 ${dino1.name} <span class="hotkey-hint">[1]</span></span>
      <span class="btn-sub-text">${dino1.diet} • ${dino1.speedKmh} km/h • ${dino1.weightKg.toLocaleString()} kg</span>
    `;

    btnPickRight.innerHTML = `
      <span class="btn-main-text">👉 ${dino2.name} <span class="hotkey-hint">[2]</span></span>
      <span class="btn-sub-text">${dino2.diet} • ${dino2.speedKmh} km/h • ${dino2.weightKg.toLocaleString()} kg</span>
    `;

    const leftCard = cardLeftContainer.querySelector('.dino-card');
    const rightCard = cardRightContainer.querySelector('.dino-card');

    leftCard.addEventListener('click', () => handleClashPick(dino1.id));
    rightCard.addEventListener('click', () => handleClashPick(dino2.id));

    // Audio preview buttons on cards
    leftCard.querySelector('.card-audio-btn').onclick = (e) => {
      e.stopPropagation();
      window.DinoArenaAudio.playCardSnap();
      window.DinoArenaAudio.speak(`${dino1.name}. ${dino1.weaponDesc}`);
    };

    rightCard.querySelector('.card-audio-btn').onclick = (e) => {
      e.stopPropagation();
      window.DinoArenaAudio.playCardSnap();
      window.DinoArenaAudio.speak(`${dino2.name}. ${dino2.weaponDesc}`);
    };
  }

  function handleClashPick(chosenId) {
    if (playerSession.isLocked) return;
    playerSession.isLocked = true;
    playerSession.totalAttempts++;

    const battle = window.DINO_ARENA_DATA.battles[playerSession.stage4RoundIndex];
    const isWinner = (chosenId === battle.winnerId);

    const leftCard = cardLeftContainer.querySelector('.dino-card');
    const rightCard = cardRightContainer.querySelector('.dino-card');

    const leftStampWin = document.getElementById('left-stamp-win');
    const leftStampLose = document.getElementById('left-stamp-lose');
    const rightStampWin = document.getElementById('right-stamp-win');
    const rightStampLose = document.getElementById('right-stamp-lose');

    if (isWinner) {
      playerSession.championDinoId = chosenId;

      window.DinoArenaAudio.playClashImpact();
      leftCard.classList.add('clash-left-active');
      rightCard.classList.add('clash-right-active');

      setTimeout(() => {
        if (chosenId === battle.dino1) {
          leftStampWin.textContent = battle.stampText;
          leftStampWin.classList.add('active');
          rightStampLose.classList.add('active');
        } else {
          rightStampWin.textContent = battle.stampText;
          rightStampWin.classList.add('active');
          leftStampLose.classList.add('active');
        }

        playerSession.streak++;
        if (playerSession.streak > playerSession.bestStreak) playerSession.bestStreak = playerSession.streak;
        playerSession.correctCount++;

        const earnedXP = Math.round(15 * (playerSession.streak >= 3 ? 1.5 : 1.0));
        addXP(earnedXP);

        if (playerSession.streak % 3 === 0) spawnConfetti(35);

        window.DinoArenaAudio.speak(`Correct! ${battle.comparativeFrame}`, null, () => {
          setTimeout(advanceClashRound, 600);
        });

      }, 240);

    } else {
      window.DinoArenaAudio.playSoftFail();
      const chosenCard = (chosenId === battle.dino1) ? leftCard : rightCard;
      chosenCard.classList.add('card-wobble');

      playerSession.streak = 0;
      updateHUD();

      window.DinoArenaAudio.speak(`Notice the stats: ${battle.statComparison}. Try again!`, null, () => {
        playerSession.isLocked = false;
        chosenCard.classList.remove('card-wobble');
      });
    }
  }

  function advanceClashRound() {
    window.DinoArenaAudio.playCardSnap();
    loadClashRound(playerSession.stage4RoundIndex + 1);
  }

  if (btnPickLeft) {
    btnPickLeft.onclick = () => {
      const battle = window.DINO_ARENA_DATA.battles[playerSession.stage4RoundIndex];
      if (battle) handleClashPick(battle.dino1);
    };
  }

  if (btnPickRight) {
    btnPickRight.onclick = () => {
      const battle = window.DINO_ARENA_DATA.battles[playerSession.stage4RoundIndex];
      if (battle) handleClashPick(battle.dino2);
    };
  }

  // Keyboard Hotkeys [1] and [2] for Stage 4
  window.addEventListener('keydown', (e) => {
    if (playerSession.currentPhase !== 4 || playerSession.isLocked) return;
    const battle = window.DINO_ARENA_DATA.battles[playerSession.stage4RoundIndex];
    if (!battle) return;

    if (e.key === '1') {
      handleClashPick(battle.dino1);
    } else if (e.key === '2') {
      handleClashPick(battle.dino2);
    }
  });

  /* ==========================================================================
     STAGE 5: PALEONTOLOGIST TELEPROMPTER STUDIO
     ========================================================================== */
  const teleprompterBadgeTag = document.getElementById('teleprompter-badge-tag');
  const teleprompterArtPodium = document.getElementById('teleprompter-art-podium');
  const teleprompterScript = document.getElementById('teleprompter-script');
  const btnSpeakTeleprompter = document.getElementById('btn-speak-teleprompter');
  const btnNextTeleprompter = document.getElementById('btn-next-teleprompter');

  function renderStage5Teleprompter(index) {
    const teleList = window.DINO_ARENA_DATA.teleprompter;
    if (!teleList || teleList.length === 0) return;

    playerSession.teleprompterIndex = index % teleList.length;
    const arch = teleList[playerSession.teleprompterIndex];
    const dino = window.DINO_ARENA_DATA.dinosaurs.find(d => d.id === arch.dinoId) || window.DINO_ARENA_DATA.dinosaurs[0];

    teleprompterBadgeTag.textContent = `🎙️ ${dino.fallbackIcon} ${dino.name} — ${arch.title}`;
    
    // Podium with dedicated 3D vector artwork stage
    teleprompterArtPodium.innerHTML = `
      <div class="teleprompter-vector-stage">
        ${dino.svgArtwork}
      </div>
    `;

    // 3-part oral report template
    const fullText = `${arch.sentence1} ${arch.sentence2} ${arch.sentence3}`;
    const words = fullText.split(/\s+/);
    teleprompterScript.innerHTML = '';

    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'karaoke-word';
      span.id = `tele-word-${i}`;
      span.textContent = w;
      teleprompterScript.appendChild(span);
    });

    playerSession.teleprompterText = fullText;
    playerSession.teleprompterWords = words;
  }

  function startTeleprompterSpeech() {
    if (playerSession.teleprompterSpeaking) {
      window.DinoArenaAudio.stopSpeech();
      playerSession.teleprompterSpeaking = false;
      btnSpeakTeleprompter.innerHTML = '📢 BROADCAST REPORT';
      btnSpeakTeleprompter.classList.remove('broadcasting');
      return;
    }

    playerSession.teleprompterSpeaking = true;
    btnSpeakTeleprompter.innerHTML = '⏹️ STOPPING BROADCAST...';
    btnSpeakTeleprompter.classList.add('broadcasting');

    let currentWordIndex = 0;
    const wordSpans = teleprompterScript.querySelectorAll('.karaoke-word');
    wordSpans.forEach(s => s.classList.remove('highlight', 'passed'));

    window.DinoArenaAudio.speak(
      playerSession.teleprompterText,
      (charIndex) => {
        let accumulated = 0;
        for (let i = 0; i < playerSession.teleprompterWords.length; i++) {
          accumulated += playerSession.teleprompterWords[i].length + 1;
          if (charIndex < accumulated) {
            currentWordIndex = i;
            break;
          }
        }

        wordSpans.forEach((span, idx) => {
          if (idx === currentWordIndex) {
            span.classList.add('highlight');
            span.classList.remove('passed');
          } else if (idx < currentWordIndex) {
            span.classList.remove('highlight');
            span.classList.add('passed');
          } else {
            span.classList.remove('highlight', 'passed');
          }
        });
      },
      () => {
        playerSession.teleprompterSpeaking = false;
        btnSpeakTeleprompter.innerHTML = '📢 BROADCAST AGAIN';
        btnSpeakTeleprompter.classList.remove('broadcasting');

        wordSpans.forEach(s => {
          s.classList.remove('highlight');
          s.classList.add('passed');
        });

        window.DinoArenaAudio.playVictory();
        spawnConfetti(45);
        addXP(25);
      }
    );
  }

  if (btnSpeakTeleprompter) btnSpeakTeleprompter.onclick = startTeleprompterSpeech;
  if (btnNextTeleprompter) {
    btnNextTeleprompter.onclick = () => {
      window.DinoArenaAudio.stopSpeech();
      playerSession.teleprompterSpeaking = false;
      btnSpeakTeleprompter.innerHTML = '📢 BROADCAST REPORT';
      btnSpeakTeleprompter.classList.remove('broadcasting');
      window.DinoArenaAudio.playCardSnap();

      playerSession.teleprompterIndex++;
      const total = window.DINO_ARENA_DATA.teleprompter.length;
      if (playerSession.teleprompterIndex >= total) {
        // Broadcasts explored -> Advance to Exit Checkpoint
        switchPhase(6);
      } else {
        renderStage5Teleprompter(playerSession.teleprompterIndex);
      }
    };
  }

  /* ==========================================================================
     STAGE 6: EXIT CHECKPOINT & FIELD PASSPORT
     ========================================================================== */
  const quizContainerCard = document.getElementById('quiz-container-card');
  const quizProgressFill = document.getElementById('quiz-progress-fill');
  const quizQNum = document.getElementById('quiz-q-num');
  const quizQuestionText = document.getElementById('quiz-question-text');
  const quizOptionsList = document.getElementById('quiz-options-list');
  const quizExplanationBox = document.getElementById('quiz-explanation-box');
  const btnQuizNext = document.getElementById('btn-quiz-next');
  const passportPreviewCard = document.getElementById('passport-preview-card');
  const passportXpVal = document.getElementById('passport-xp-val');
  const passportStreakVal = document.getElementById('passport-streak-val');
  const passportAccuracyVal = document.getElementById('passport-accuracy-val');
  const btnReplayGame = document.getElementById('btn-replay-game');

  function renderStage6Quiz() {
    const questions = window.DINO_ARENA_DATA.exitQuiz;
    if (playerSession.quizIndex >= questions.length) {
      // Show Passport Certificate Card
      quizContainerCard.style.display = 'none';
      passportPreviewCard.style.display = 'flex';

      const accuracy = (playerSession.totalAttempts > 0)
        ? Math.round((playerSession.correctCount / playerSession.totalAttempts) * 100)
        : 100;

      passportXpVal.textContent = `${playerSession.scoreXP} XP`;
      passportStreakVal.textContent = `${playerSession.bestStreak}x`;
      passportAccuracyVal.textContent = `${accuracy}%`;

      window.DinoArenaAudio.playVictory();
      spawnConfetti(70);
      return;
    }

    quizContainerCard.style.display = 'flex';
    passportPreviewCard.style.display = 'none';
    quizExplanationBox.style.display = 'none';
    btnQuizNext.style.display = 'none';

    const q = questions[playerSession.quizIndex];
    quizQNum.textContent = `Diagnostic Question ${playerSession.quizIndex + 1} / ${questions.length}`;
    quizProgressFill.style.width = `${((playerSession.quizIndex + 1) / questions.length) * 100}%`;
    quizQuestionText.textContent = q.question;

    quizOptionsList.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-quiz-option';
      btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt.text}`;
      btn.onclick = () => handleQuizOption(opt, q, btn);
      quizOptionsList.appendChild(btn);
    });
  }

  function handleQuizOption(selectedOpt, question, btnEl) {
    if (playerSession.isLocked) return;
    playerSession.isLocked = true;

    const allButtons = quizOptionsList.querySelectorAll('.btn-quiz-option');
    allButtons.forEach(b => b.style.pointerEvents = 'none');

    if (selectedOpt.isCorrect) {
      btnEl.classList.add('correct');
      window.DinoArenaAudio.playVictory();
      playerSession.quizCorrectCount++;
      addXP(25);
    } else {
      btnEl.classList.add('wrong');
      window.DinoArenaAudio.playSoftFail();
    }

    quizExplanationBox.style.display = 'block';
    quizExplanationBox.textContent = `💡 Explanation: ${question.explanation}`;
    btnQuizNext.style.display = 'inline-block';
    playerSession.isLocked = false;
  }

  if (btnQuizNext) {
    btnQuizNext.onclick = () => {
      playerSession.quizIndex++;
      window.DinoArenaAudio.playCardSnap();
      renderStage6Quiz();
    };
  }

  if (btnReplayGame) {
    btnReplayGame.onclick = () => {
      playerSession.scoreXP = 0;
      playerSession.streak = 0;
      playerSession.stage1Index = 0;
      playerSession.stage2Index = 0;
      playerSession.stage3Index = 0;
      playerSession.stage4RoundIndex = 0;
      playerSession.teleprompterIndex = 0;
      playerSession.quizIndex = 0;
      updateHUD();
      switchPhase(1);
    };
  }

  /* ==========================================================================
     GLOBAL HUD INITIALIZATION
     ========================================================================== */
  phaseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const phaseNum = parseInt(tab.dataset.phase, 10);
      switchPhase(phaseNum);
    });
  });

  window.switchDinoPhase = switchPhase;

  if (hudSoundBtn) {
    hudSoundBtn.onclick = () => {
      const muted = window.DinoArenaAudio.toggleMute();
      hudSoundBtn.innerHTML = muted ? '🔇 <span>Audio Muted</span>' : '🔊 <span>Audio Active</span>';
    };
  }

  if (hudFullscreenBtn) {
    hudFullscreenBtn.onclick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        hudFullscreenBtn.innerHTML = '🗗 <span>Exit Fullscreen</span>';
      } else {
        document.exitFullscreen().catch(() => {});
        hudFullscreenBtn.innerHTML = '⛶ <span>Fullscreen</span>';
      }
    };
  }

  // Initialize on Load
  window.addEventListener('DOMContentLoaded', () => {
    initConfetti();
    updateHUD();
    switchPhase(1);
  });

})();
