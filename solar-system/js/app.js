/**
 * SOLAR SYSTEM EXPLORER: PLANETARY COMPARATIVES LAB — CORE APPLICATION
 * Reactive playerSession state machine, 3D Card Flips, Rubber-Stamp Impact Physics, and Confetti Engine
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

  // Phase 2 Elements
  const arenaCardAnchor = document.getElementById('arena-card-anchor');
  const arenaHeroZone = document.getElementById('arena-hero-zone');
  const arenaCaptionComparative = document.getElementById('arena-caption-comparative');
  const arenaCaptionStatement = document.getElementById('arena-caption-statement');
  const arenaCaptionHint = document.getElementById('arena-caption-hint');
  const arenaCardAudioBtn = document.getElementById('arena-card-audio-btn');
  const stampCorrect = document.getElementById('stamp-correct');
  const stampIncorrect = document.getElementById('stamp-incorrect');
  const btnChooseTrue = document.getElementById('btn-choose-true');
  const btnChooseFalse = document.getElementById('btn-choose-false');
  const arenaCounter = document.getElementById('arena-counter');

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
    cardIndex: 0,
    scoreXP: 0,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    totalAttempts: 0,
    isLocked: false,
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
    const colors = ['#38bdf8', '#0284c7', '#f59e0b', '#10b981', '#ef4444', '#fbbf24', '#ffffff'];
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: window.innerWidth * (0.25 + Math.random() * 0.5),
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
     INITIALIZATION & NAVIGATION
     ========================================================================== */
  function init() {
    initConfetti();
    renderPhase1Scanner();
    loadArenaCard(0);
    renderPhase3Teleprompter(0);
    setupEventListeners();
    updateHUD();
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
     PHASE 1: 3D DISCOVERY SCANNER (3D FLIP CARDS)
     ========================================================================== */
  function renderPhase1Scanner() {
    if (!scannerGrid || !window.SOLAR_DATA) return;
    scannerGrid.innerHTML = '';

    window.SOLAR_DATA.scannerPlanets.forEach(planet => {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'flip-card-container';
      cardContainer.setAttribute('tabindex', '0');
      cardContainer.setAttribute('role', 'button');
      cardContainer.setAttribute('aria-label', `3D Planet Card: ${planet.name}`);

      cardContainer.innerHTML = `
        <div class="flip-card-inner">
          
          <!-- Front Face -->
          <div class="flip-card-front">
            <div class="hero-art">
              ${planet.svg}
            </div>
            <div class="card-info">
              <span class="planet-name">${planet.emoji} ${planet.name}</span>
              <span class="planet-tagline">${planet.tagline}</span>
              <span class="flip-hint-badge">🔄 Click to Flip Spec Sheet</span>
            </div>
          </div>

          <!-- Back Face -->
          <div class="flip-card-back">
            <div class="back-header">
              <span class="back-planet-title">${planet.name} Specs</span>
              <span class="back-badge-chip">🏅 ${planet.badge}</span>
            </div>

            <div class="spec-grid">
              <div class="spec-item">
                <span class="spec-label">Diameter</span>
                <div class="spec-value">${planet.diameter}</div>
              </div>
              <div class="spec-item">
                <span class="spec-label">Temperature</span>
                <div class="spec-value">${planet.temp}</div>
              </div>
              <div class="spec-item">
                <span class="spec-label">Solar Order</span>
                <div class="spec-value">${planet.distanceRank}</div>
              </div>
              <div class="spec-item">
                <span class="spec-label">Classification</span>
                <div class="spec-value">Core World</div>
              </div>
            </div>

            <p class="back-fact-text">"${planet.keyFact}"</p>

            <button class="btn-card-listen" data-speech="${planet.speechPhrase}">
              🔊 Pronounce &amp; Collect Badge
            </button>
          </div>

        </div>
      `;

      // 3D Flip on Click
      cardContainer.addEventListener('click', (e) => {
        if (e.target.closest('.btn-card-listen')) return;
        window.SolarAudio.playSnap();
        cardContainer.classList.toggle('flipped');
      });

      // Keyboard support for Enter/Space
      cardContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.SolarAudio.playSnap();
          cardContainer.classList.toggle('flipped');
        }
      });

      // Audio narration button on back
      const listenBtn = cardContainer.querySelector('.btn-card-listen');
      listenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.SolarAudio.playXP(1);
        window.SolarAudio.speak(planet.speechPhrase);
      });

      scannerGrid.appendChild(cardContainer);
    });
  }

  /* ==========================================================================
     PHASE 2: ARENA SHOWDOWN (TACTILE WORKBENCH)
     ========================================================================== */
  function loadArenaCard(index) {
    const list = window.SOLAR_DATA.showdownChallenges;
    if (index >= list.length) {
      triggerVictory();
      return;
    }

    playerSession.cardIndex = index;
    playerSession.isLocked = false;
    const item = list[index];

    // Reset Stamps & Feedback
    stampCorrect.classList.remove('active');
    stampIncorrect.classList.remove('active');
    const cardEl = arenaCardAnchor.querySelector('.arena-card');
    cardEl.classList.remove('card-wobble', 'card-lift');

    // Populate Data
    arenaHeroZone.innerHTML = `
      <div class="card-hero-svg-wrap">
        ${item.svg}
      </div>
    `;

    arenaCaptionComparative.textContent = `Pattern: "${item.comparative}"`;
    arenaCaptionStatement.textContent = item.statement;
    arenaCaptionHint.innerHTML = `💡 Clue: ${item.hint}`;

    if (arenaCounter) {
      arenaCounter.textContent = `Round ${index + 1} of ${list.length}`;
    }

    // Pronounce audio button on card
    arenaCardAudioBtn.onclick = () => {
      window.SolarAudio.playSnap();
      window.SolarAudio.speak(item.statement);
    };
  }

  function handleDecision(userChoiceBool) {
    if (playerSession.isLocked) return;
    playerSession.isLocked = true;
    playerSession.totalAttempts++;

    const item = window.SOLAR_DATA.showdownChallenges[playerSession.cardIndex];
    const cardEl = arenaCardAnchor.querySelector('.arena-card');
    const isCorrect = (userChoiceBool === item.isTrue);

    if (isCorrect) {
      // 1. Physical Impact Stamp Slam (DO / CORRECT)
      window.SolarAudio.playSlam();
      stampCorrect.classList.add('active');

      // 2. Lift Animation & Streak
      cardEl.classList.add('card-lift');
      playerSession.streak++;
      if (playerSession.streak > playerSession.bestStreak) {
        playerSession.bestStreak = playerSession.streak;
      }
      playerSession.correctCount++;

      // Streak scaling score
      const bonusMult = playerSession.streak >= 3 ? 1.5 : 1.0;
      const earnedXP = Math.round(item.xp * bonusMult);
      playerSession.scoreXP = Math.min(150, playerSession.scoreXP + earnedXP);

      window.SolarAudio.playXP(playerSession.streak);

      if (playerSession.streak % 3 === 0) {
        spawnConfetti(30);
      }

      updateHUD();

      // Read audio confirmation
      setTimeout(() => {
        window.SolarAudio.speak(`Correct! ${item.explanation}`, null, () => {
          advanceNextCard();
        });
      }, 350);

    } else {
      // Non-Punitive Soft-Fail Protocol
      window.SolarAudio.playSoftFail();
      cardEl.classList.add('card-wobble');

      // Impact Stamp (DON'T / TRY AGAIN)
      stampIncorrect.classList.add('active');

      playerSession.streak = 0;
      updateHUD();

      // Speak supportive clue without penalty
      window.SolarAudio.speak(`Notice: ${item.hint}`, null, () => {
        playerSession.isLocked = false;
        cardEl.classList.remove('card-wobble');
        stampIncorrect.classList.remove('active');
      });
    }
  }

  function advanceNextCard() {
    window.SolarAudio.playWhoosh();
    setTimeout(() => {
      loadArenaCard(playerSession.cardIndex + 1);
    }, 280);
  }

  /* ==========================================================================
     PHASE 3: LIVE TELEPROMPTER STUDIO
     ========================================================================== */
  function renderPhase3Teleprompter(index) {
    const archetypes = window.SOLAR_DATA.teleprompterArchetypes;
    if (!archetypes || archetypes.length === 0) return;

    playerSession.teleprompterIndex = index % archetypes.length;
    const arch = archetypes[playerSession.teleprompterIndex];

    teleprompterBadgeTag.textContent = `${arch.icon} ${arch.title} — ${arch.badge}`;
    teleprompterArtPodium.innerHTML = arch.svg;

    // Strict 3-sentence speaking template
    const fullText = `${arch.sentence1} ${arch.sentence2} ${arch.sentence3}`;
    
    // Split into individual words for real-time karaoke highlight
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
      window.SolarAudio.stopSpeech();
      playerSession.teleprompterSpeaking = false;
      btnSpeakTeleprompter.innerHTML = '🎙️ Read With Me';
      return;
    }

    playerSession.teleprompterSpeaking = true;
    btnSpeakTeleprompter.innerHTML = '⏹️ Stop Voice';
    window.SolarAudio.playSnap();

    // Reset karaoke words
    const spans = teleprompterScript.querySelectorAll('.karaoke-word');
    spans.forEach(s => s.classList.remove('active', 'read-done'));

    window.SolarAudio.speak(
      playerSession.teleprompterText,
      (charIndex) => {
        // Approximate current word based on character index
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
        // On completion
        playerSession.teleprompterSpeaking = false;
        btnSpeakTeleprompter.innerHTML = '🎙️ Read With Me';
        spans.forEach(s => {
          s.classList.remove('active');
          s.classList.add('read-done');
        });
        window.SolarAudio.playFanfare();
        spawnConfetti(40);
      }
    );
  }

  /* ==========================================================================
     HUD & PROGRESS TRACKING (SCALES 20% -> 100%)
     ========================================================================== */
  function updateHUD() {
    // Energy meter starts at 20% baseline and scales up to 100%
    const progressFrac = Math.min(1, playerSession.scoreXP / 150);
    const scaledPct = Math.round(20 + (progressFrac * 80));

    hudEnergyFill.style.width = `${scaledPct}%`;
    hudXpLabel.textContent = `${playerSession.scoreXP} / 150 XP`;
    hudStreakCount.textContent = `${playerSession.streak}x`;
  }

  function triggerVictory() {
    window.SolarAudio.playFanfare();
    spawnConfetti(120, true);

    modalXpVal.textContent = `${playerSession.scoreXP} XP`;
    modalStreakVal.textContent = `${playerSession.bestStreak}x`;
    const acc = playerSession.totalAttempts > 0 
      ? Math.round((playerSession.correctCount / playerSession.totalAttempts) * 100) 
      : 100;
    modalAccuracyVal.textContent = `${acc}%`;

    victoryModal.classList.add('active');
  }

  /* ==========================================================================
     EVENT LISTENERS & HOTKEYS
     ========================================================================== */
  function setupEventListeners() {
    // Phase Navigation Tabs
    phaseTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const phaseNum = parseInt(tab.dataset.phase, 10);
        window.SolarAudio.playSnap();
        setPhase(phaseNum);
      });
    });

    // 3D Push Decision Buttons (TRUE / FALSE)
    btnChooseTrue.addEventListener('click', () => handleDecision(true));
    btnChooseFalse.addEventListener('click', () => handleDecision(false));

    // Keyboard Shortcuts: [T]/[Y] for True, [F]/[N] for False
    window.addEventListener('keydown', (e) => {
      if (playerSession.currentPhase !== 2) return;
      if (e.target.tagName === 'INPUT') return;

      const key = e.key.toUpperCase();
      if (key === 'T' || key === 'Y') {
        handleDecision(true);
      } else if (key === 'F' || key === 'N') {
        handleDecision(false);
      }
    });

    // Audio Mute Toggle
    hudSoundBtn.addEventListener('click', () => {
      const isMuted = window.SolarAudio.toggleMute();
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
      window.SolarAudio.stopSpeech();
      playerSession.teleprompterSpeaking = false;
      btnSpeakTeleprompter.innerHTML = '🎙️ Read With Me';
      renderPhase3Teleprompter(playerSession.teleprompterIndex + 1);
    });

    // Victory Modal Passport & Replay
    btnPrintPassport.addEventListener('click', () => {
      const studentName = encodeURIComponent(studentNameInput.value.trim() || 'Space Cadet');
      window.open(`worksheet.html?name=${studentName}`, '_blank');
    });

    btnReplayGame.addEventListener('click', () => {
      victoryModal.classList.remove('active');
      playerSession.scoreXP = 0;
      playerSession.streak = 0;
      playerSession.cardIndex = 0;
      playerSession.correctCount = 0;
      playerSession.totalAttempts = 0;
      updateHUD();
      setPhase(2);
      loadArenaCard(0);
    });
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
