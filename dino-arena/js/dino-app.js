/**
 * DINO ARENA: TOP TRUMPS PALEONTOLOGY CLASH — CORE APPLICATION
 * Reactive state machine, 1v1 Clash Physics, Hotspot Discovery, Teleprompter Karaoke, and Confetti Engine
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

  // Phase 1 Elements
  const scannerGrid = document.getElementById('scanner-grid');
  const scannerBadgeAlert = document.getElementById('scanner-badge-alert');

  // Phase 2 Elements
  const clashQuestion = document.getElementById('clash-question');
  const clashSubtext = document.getElementById('clash-subtext');
  const clashCounter = document.getElementById('clash-counter');
  const cardLeftContainer = document.getElementById('card-left-container');
  const cardRightContainer = document.getElementById('card-right-container');
  const btnPickLeft = document.getElementById('btn-pick-left');
  const btnPickRight = document.getElementById('btn-pick-right');

  // Phase 3 Elements
  const teleprompterBadgeTag = document.getElementById('teleprompter-badge-tag');
  const teleprompterArtPodium = document.getElementById('teleprompter-art-podium');
  const teleprompterScript = document.getElementById('teleprompter-script');
  const btnSpeakTeleprompter = document.getElementById('btn-speak-teleprompter');
  const btnNextTeleprompter = document.getElementById('btn-next-teleprompter');

  // Victory Modal Elements
  const victoryModal = document.getElementById('victory-modal');
  const modalXpVal = document.getElementById('modal-xp-val');
  const modalStreakVal = document.getElementById('modal-streak-val');
  const modalAccuracyVal = document.getElementById('modal-accuracy-val');
  const studentNameInput = document.getElementById('student-name-input');
  const btnPrintPassport = document.getElementById('btn-print-passport');
  const btnReplayGame = document.getElementById('btn-replay-game');

  // Confetti Canvas
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  // Reactive playerSession State
  const playerSession = {
    currentPhase: 2, // Start at Arena Showdown
    scannedDinos: new Set(),
    roundIndex: 0,
    scoreXP: 0,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    totalAttempts: 0,
    isLocked: false,
    championDinoId: 'trex',
    teleprompterIndex: 0,
    teleprompterSpeaking: false
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

  function spawnConfetti(count = 60, continuous = false) {
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

  function animateConfetti(continuous) {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.008;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.globalAlpha = Math.max(0, p.opacity);
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();

      if (p.opacity <= 0 || p.y > window.innerHeight) {
        confettiParticles.splice(i, 1);
      }
    }

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(() => animateConfetti(continuous));
    } else {
      confettiAnimationId = null;
    }
  }

  /* ==========================================================================
     CARD BUILDER COMPONENT (65/35 TOP TRUMPS RATIO)
     ========================================================================== */
  function createDinoCardHtml(dino, sideKey = 'card') {
    const isCarnivore = (dino.diet === 'Carnivore');
    const dietBadgeClass = isCarnivore ? 'card-diet-carnivore' : 'card-diet-herbivore';
    
    // Normalized Stat Percentages
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

          <!-- Resilient Primary Image with Automatic SVG Fallback -->
          <img class="card-hero-img" src="${dino.img}" alt="${dino.name}" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="card-hero-svg-fallback">
            ${dino.svg}
          </div>
        </div>

        <!-- Dynamic Stamp Overlays -->
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
     PHASE 1: HOLOGRAPHIC FOSSIL SCANNER
     ========================================================================== */
  function renderPhase1Scanner() {
    if (!scannerGrid || !window.DINO_ARENA_DATA) return;
    scannerGrid.innerHTML = '';

    window.DINO_ARENA_DATA.dinosaurs.forEach(dino => {
      const col = document.createElement('div');
      col.className = 'scanner-item-col';
      col.innerHTML = createDinoCardHtml(dino, `scan-${dino.id}`);

      // Add Hotspot Chips
      const hudEl = col.querySelector('.card-stat-hud');
      const chipGroup = document.createElement('div');
      chipGroup.className = 'hotspot-chip-group';

      dino.hotspots.forEach(spot => {
        const btn = document.createElement('button');
        btn.className = 'btn-hotspot';
        btn.textContent = `🔍 ${spot.label}`;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.DinoArenaAudio.playCardSnap();
          window.DinoArenaAudio.speak(spot.phrase);

          playerSession.scannedDinos.add(dino.id);
          checkScannerProgress();
        });
        chipGroup.appendChild(btn);
      });

      hudEl.appendChild(chipGroup);

      // Card audio button listener
      const audioBtn = col.querySelector('.card-audio-btn');
      audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.DinoArenaAudio.playCardSnap();
        window.DinoArenaAudio.speak(audioBtn.dataset.audioPhrase);
      });

      scannerGrid.appendChild(col);
    });
  }

  function checkScannerProgress() {
    const total = window.DINO_ARENA_DATA.dinosaurs.length;
    if (playerSession.scannedDinos.size >= total) {
      if (scannerBadgeAlert) {
        scannerBadgeAlert.style.display = 'flex';
        scannerBadgeAlert.innerHTML = `🏆 Master Paleontologist Badge Unlocked! All ${total} Dinosaurs Scanned (+50 XP Earned!)`;
      }
      playerSession.scoreXP = Math.min(150, playerSession.scoreXP + 50);
      updateHUD();
      window.DinoArenaAudio.playVictory();
      spawnConfetti(50);
    }
  }

  /* ==========================================================================
     PHASE 2: DINO CLASH 1v1 SHOWDOWN (HEAD-TO-HEAD BATTLE ARENA)
     ========================================================================== */
  function loadClashRound(index) {
    const battles = window.DINO_ARENA_DATA.battles;
    if (index >= battles.length) {
      triggerVictory();
      return;
    }

    playerSession.roundIndex = index;
    playerSession.isLocked = false;
    const battle = battles[index];

    const dino1 = window.DINO_ARENA_DATA.dinosaurs.find(d => d.id === battle.dino1);
    const dino2 = window.DINO_ARENA_DATA.dinosaurs.find(d => d.id === battle.dino2);

    // Update Announcer Board
    clashQuestion.textContent = battle.question;
    clashSubtext.textContent = `Battle ${index + 1} of ${battles.length} • Click the winning champion!`;
    if (clashCounter) {
      clashCounter.textContent = `Round ${index + 1} / ${battles.length}`;
    }

    // Populate Left & Right Cards
    cardLeftContainer.innerHTML = createDinoCardHtml(dino1, 'left');
    cardRightContainer.innerHTML = createDinoCardHtml(dino2, 'right');

    // Update 3D Decision Buttons
    btnPickLeft.innerHTML = `
      <span class="btn-main-text">👈 ${dino1.name} <span class="hotkey-hint">[1]</span></span>
      <span class="btn-sub-text">${dino1.diet} • ${dino1.speedKmh} km/h • ${dino1.weightKg.toLocaleString()} kg</span>
    `;

    btnPickRight.innerHTML = `
      <span class="btn-main-text">👉 ${dino2.name} <span class="hotkey-hint">[2]</span></span>
      <span class="btn-sub-text">${dino2.diet} • ${dino2.speedKmh} km/h • ${dino2.weightKg.toLocaleString()} kg</span>
    `;

    // Click on Card directly
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

    const battle = window.DINO_ARENA_DATA.battles[playerSession.roundIndex];
    const isWinner = (chosenId === battle.winnerId);

    const leftCard = cardLeftContainer.querySelector('.dino-card');
    const rightCard = cardRightContainer.querySelector('.dino-card');

    const leftStampWin = document.getElementById('left-stamp-win');
    const leftStampLose = document.getElementById('left-stamp-lose');
    const rightStampWin = document.getElementById('right-stamp-win');
    const rightStampLose = document.getElementById('right-stamp-lose');

    if (isWinner) {
      playerSession.championDinoId = chosenId;

      // 1. Clash Collision Animation & Sound
      window.DinoArenaAudio.playClashImpact();
      leftCard.classList.add('clash-left-active');
      rightCard.classList.add('clash-right-active');

      // 2. Slams Winner & Defeated Stamps
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

        // Streak & Score
        playerSession.streak++;
        if (playerSession.streak > playerSession.bestStreak) {
          playerSession.bestStreak = playerSession.streak;
        }
        playerSession.correctCount++;

        const earnedXP = Math.round(15 * (playerSession.streak >= 3 ? 1.5 : 1.0));
        playerSession.scoreXP = Math.min(150, playerSession.scoreXP + earnedXP);
        window.DinoArenaAudio.playXP(playerSession.streak);

        if (playerSession.streak % 3 === 0) {
          spawnConfetti(35);
        }

        updateHUD();

        // 3. Announce Comparative Rule via Speech
        window.DinoArenaAudio.speak(`Correct! ${battle.comparativeFrame}`, null, () => {
          setTimeout(advanceClashRound, 600);
        });

      }, 240);

    } else {
      // Soft-Fail Non-Punitive Protocol
      window.DinoArenaAudio.playSoftFail();
      
      const chosenCard = (chosenId === battle.dino1) ? leftCard : rightCard;
      chosenCard.classList.add('card-wobble');

      playerSession.streak = 0;
      updateHUD();

      // Speak supportive comparison without penalty
      window.DinoArenaAudio.speak(`Notice the stats: ${battle.statComparison}. Try again!`, null, () => {
        playerSession.isLocked = false;
        chosenCard.classList.remove('card-wobble');
      });
    }
  }

  function advanceClashRound() {
    window.DinoArenaAudio.playCardSnap();
    loadClashRound(playerSession.roundIndex + 1);
  }

  /* ==========================================================================
     PHASE 3: PALEONTOLOGIST TELEPROMPTER STUDIO
     ========================================================================== */
  function renderPhase3Teleprompter(index) {
    const teleList = window.DINO_ARENA_DATA.teleprompter;
    if (!teleList || teleList.length === 0) return;

    playerSession.teleprompterIndex = index % teleList.length;
    const arch = teleList[playerSession.teleprompterIndex];
    const dino = window.DINO_ARENA_DATA.dinosaurs.find(d => d.id === arch.dinoId) || window.DINO_ARENA_DATA.dinosaurs[0];

    teleprompterBadgeTag.textContent = `🎙️ ${dino.fallbackIcon} ${dino.name} — ${arch.title}`;
    teleprompterArtPodium.innerHTML = dino.svg;

    // Strict 3-sentence speaking template
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
      btnSpeakTeleprompter.innerHTML = '📢 BROADCAST DISCOVERY';
      return;
    }

    playerSession.teleprompterSpeaking = true;
    btnSpeakTeleprompter.innerHTML = '⏹️ Stop Broadcast';
    window.DinoArenaAudio.playCardSnap();

    // Reset karaoke words
    const spans = teleprompterScript.querySelectorAll('.karaoke-word');
    spans.forEach(s => s.classList.remove('active', 'read-done'));

    window.DinoArenaAudio.speak(
      playerSession.teleprompterText,
      (charIndex) => {
        const textUpToChar = playerSession.teleprompterText.substring(0, charIndex);
        const currentWordIndex = textUpToChar.trim().split(/\s+/).length - 1;
        
        spans.forEach((s, idx) => {
          if (idx < currentWordIndex) {
            s.classList.add('read-done');
            s.classList.remove('active');
          } else if (idx === currentWordIndex) {
            s.classList.add('active');
            s.classList.remove('read-done');
          } else {
            s.classList.remove('active', 'read-done');
          }
        });
      },
      () => {
        playerSession.teleprompterSpeaking = false;
        btnSpeakTeleprompter.innerHTML = '📢 BROADCAST DISCOVERY';
        spans.forEach(s => {
          s.classList.remove('active');
          s.classList.add('read-done');
        });
        window.DinoArenaAudio.playVictory();
        spawnConfetti(50);
      }
    );
  }

  /* ==========================================================================
     HUD & PROGRESS TRACKING
     ========================================================================== */
  function updateHUD() {
    const progressFrac = Math.min(1, playerSession.scoreXP / 150);
    const scaledPct = Math.round(20 + (progressFrac * 80));

    hudEnergyFill.style.width = `${scaledPct}%`;
    hudXpLabel.textContent = `${playerSession.scoreXP} / 150 XP`;
    hudStreakCount.textContent = `${playerSession.streak}x`;
  }

  function triggerVictory() {
    window.DinoArenaAudio.playVictory();
    spawnConfetti(120, true);

    modalXpVal.textContent = `${playerSession.scoreXP} XP`;
    modalStreakVal.textContent = `${playerSession.bestStreak}x`;
    const acc = playerSession.totalAttempts > 0 
      ? Math.round((playerSession.correctCount / playerSession.totalAttempts) * 100) 
      : 100;
    modalAccuracyVal.textContent = `${acc}%`;

    victoryModal.classList.add('active');
  }

  function setPhase(phaseNum) {
    playerSession.currentPhase = phaseNum;
    phaseTabs.forEach(tab => {
      tab.classList.toggle('active', parseInt(tab.dataset.phase, 10) === phaseNum);
    });
    phasePanels.forEach(panel => {
      panel.classList.toggle('active', parseInt(panel.dataset.phase, 10) === phaseNum);
    });

    if (phaseNum === 3) {
      renderPhase3Teleprompter(playerSession.teleprompterIndex);
    }
  }

  /* ==========================================================================
     EVENT LISTENERS & HOTKEYS
     ========================================================================== */
  function setupEventListeners() {
    // Phase Navigation Tabs
    phaseTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const phaseNum = parseInt(tab.dataset.phase, 10);
        window.DinoArenaAudio.playCardSnap();
        setPhase(phaseNum);
      });
    });

    // 3D Push Decision Action Buttons
    btnPickLeft.addEventListener('click', () => {
      const battle = window.DINO_ARENA_DATA.battles[playerSession.roundIndex];
      if (battle) handleClashPick(battle.dino1);
    });

    btnPickRight.addEventListener('click', () => {
      const battle = window.DINO_ARENA_DATA.battles[playerSession.roundIndex];
      if (battle) handleClashPick(battle.dino2);
    });

    // Keyboard Shortcuts: [1]/[A] for Left, [2]/[B] for Right
    window.addEventListener('keydown', (e) => {
      if (playerSession.currentPhase !== 2) return;
      if (e.target.tagName === 'INPUT') return;

      const key = e.key.toUpperCase();
      const battle = window.DINO_ARENA_DATA.battles[playerSession.roundIndex];
      if (!battle) return;

      if (key === '1' || key === 'A') {
        handleClashPick(battle.dino1);
      } else if (key === '2' || key === 'B') {
        handleClashPick(battle.dino2);
      }
    });

    // Audio Mute Toggle
    hudSoundBtn.addEventListener('click', () => {
      const isMuted = window.DinoArenaAudio.toggleMute();
      hudSoundBtn.innerHTML = isMuted ? '🔇 Audio Muted' : '🔊 Audio Active';
    });

    // Fullscreen Toggle
    hudFullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        hudFullscreenBtn.innerHTML = '⛶ Exit Fullscreen';
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          hudFullscreenBtn.innerHTML = '⛶ Fullscreen';
        }
      }
    });

    // Phase 3 Teleprompter Controls
    btnSpeakTeleprompter.addEventListener('click', startTeleprompterSpeech);
    btnNextTeleprompter.addEventListener('click', () => {
      window.DinoArenaAudio.stopSpeech();
      playerSession.teleprompterSpeaking = false;
      btnSpeakTeleprompter.innerHTML = '📢 BROADCAST DISCOVERY';
      renderPhase3Teleprompter(playerSession.teleprompterIndex + 1);
    });

    // Victory Modal Buttons
    btnPrintPassport.addEventListener('click', () => {
      const studentName = encodeURIComponent(studentNameInput.value.trim() || 'Paleontology Cadet');
      window.open(`worksheet.html?name=${studentName}`, '_blank');
    });

    btnReplayGame.addEventListener('click', () => {
      victoryModal.classList.remove('active');
      playerSession.scoreXP = 0;
      playerSession.streak = 0;
      playerSession.roundIndex = 0;
      playerSession.correctCount = 0;
      playerSession.totalAttempts = 0;
      updateHUD();
      setPhase(2);
      loadClashRound(0);
    });
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initConfetti();
    renderPhase1Scanner();
    loadClashRound(0);
    renderPhase3Teleprompter(0);
    setupEventListeners();
    updateHUD();
  }
})();
