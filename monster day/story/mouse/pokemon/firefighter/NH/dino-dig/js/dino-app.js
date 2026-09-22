/**
 * DINO DIG: PREHISTORIC PAST TENSE LAB — CORE GAME APPLICATION
 * Manages Arena State Machine, Rubber-Stamp Physics, Calibrated TTS Karaoke, and Confetti Engine
 */
(function() {
  'use strict';

  // DOM Elements
  const hudEnergyFill = document.getElementById('hud-energy-fill');
  const hudXpLabel = document.getElementById('hud-xp-label');
  const hudStreakCount = document.getElementById('hud-streak-count');
  const hudSoundBtn = document.getElementById('btn-sound-toggle');
  const hudFullscreenBtn = document.getElementById('btn-fullscreen-toggle');

  const phaseTabs = document.querySelectorAll('.phase-tab');
  const phasePanels = document.querySelectorAll('.phase-panel');

  // Phase 1 Elements
  const speciesCarousel = document.getElementById('species-carousel');

  // Phase 2 Elements
  const arenaCardAnchor = document.getElementById('arena-card-anchor');
  const arenaHeroZone = document.getElementById('arena-hero-zone');
  const arenaCaptionVerb = document.getElementById('arena-caption-verb');
  const arenaCaptionBase = document.getElementById('arena-caption-base');
  const arenaCaptionSentence = document.getElementById('arena-caption-sentence');
  const arenaCaptionHint = document.getElementById('arena-caption-hint');
  const arenaCardAudioBtn = document.getElementById('arena-card-audio-btn');
  const stampRegular = document.getElementById('stamp-regular');
  const stampIrregular = document.getElementById('stamp-irregular');
  const btnChooseRegular = document.getElementById('btn-choose-regular');
  const btnChooseIrregular = document.getElementById('btn-choose-irregular');
  const arenaCounter = document.getElementById('arena-counter');

  // Phase 3 Elements
  const holoSpeciesBadge = document.getElementById('holo-species-badge');
  const holoArtPodium = document.getElementById('holo-art-podium');
  const teleprompterScript = document.getElementById('teleprompter-script');
  const btnSpeakHolo = document.getElementById('btn-speak-holo');
  const btnNextHolo = document.getElementById('btn-next-holo');

  // Victory Modal Elements
  const victoryModal = document.getElementById('victory-modal');
  const modalXpVal = document.getElementById('modal-xp-val');
  const modalStreakVal = document.getElementById('modal-streak-val');
  const modalAccuracyVal = document.getElementById('modal-accuracy-val');
  const studentNameInput = document.getElementById('student-name-input');
  const btnPrintDossier = document.getElementById('btn-print-dossier');
  const btnReplayGame = document.getElementById('btn-replay-game');

  // Confetti Canvas
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  // Game State
  const state = {
    currentPhase: 2, // Start at Showdown Arena
    cardIndex: 0,
    scoreXP: 0,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    totalAttempts: 0,
    isLocked: false,
    holoIndex: 0,
    holoSpeaking: false
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
    const colors = ['#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#fbbf24', '#38bdf8', '#ffffff'];
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: window.innerWidth * (0.2 + Math.random() * 0.6),
        y: window.innerHeight * 0.45,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
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
    renderPhase1Species();
    loadArenaCard(0);
    renderPhase3Hologram(0);
    setupEventListeners();
    updateHUD();
  }

  function setPhase(phaseNum) {
    state.currentPhase = phaseNum;
    phaseTabs.forEach(tab => {
      tab.classList.toggle('active', parseInt(tab.dataset.phase, 10) === phaseNum);
    });
    phasePanels.forEach(panel => {
      panel.classList.toggle('active', parseInt(panel.dataset.phase, 10) === phaseNum);
    });

    if (phaseNum === 3) {
      renderPhase3Hologram(state.holoIndex);
    }
  }

  /* ==========================================================================
     PHASE 1: FOSSIL RESONANCE SCANNER
     ========================================================================== */
  function renderPhase1Species() {
    if (!speciesCarousel || !window.DINO_DATA) return;
    speciesCarousel.innerHTML = '';

    window.DINO_DATA.scannerSpecies.forEach(sp => {
      const card = document.createElement('div');
      card.className = 'species-card';
      card.innerHTML = `
        <div class="species-art">
          ${sp.svg}
        </div>
        <div class="species-info">
          <div class="species-name-row">
            <span class="species-name">${sp.name}</span>
            <span class="species-period-badge">${sp.period}</span>
          </div>
          <div class="species-verb-pill">
            <span>${sp.verbType === 'REGULAR' ? '✨ Regular (-ed)' : '⚡ Irregular'}</span>
            <strong>${sp.coreVerb}</strong>
          </div>
          <p class="species-sentence">"${sp.sentence}"</p>
          <button class="species-listen-btn" data-sound="${sp.soundPhrase}">
            🔊 Listen Specimen Data
          </button>
        </div>
      `;

      card.querySelector('.species-listen-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        window.DinoAudio.playChime(659.25, 0.25);
        window.DinoAudio.speakPhrase(sp.soundPhrase);
      });

      speciesCarousel.appendChild(card);
    });
  }

  /* ==========================================================================
     PHASE 2: THE SHOWDOWN ARENA
     ========================================================================== */
  function loadArenaCard(index) {
    const list = window.DINO_DATA.relayFossils;
    if (index >= list.length) {
      triggerVictory();
      return;
    }

    state.cardIndex = index;
    state.isLocked = false;
    const item = list[index];

    // Reset Stamp & Shakes
    stampRegular.classList.remove('active');
    stampIrregular.classList.remove('active');
    arenaCardAnchor.querySelector('.arena-card').classList.remove('card-shake', 'card-lift');

    // Populate Data
    arenaHeroZone.innerHTML = `
      <div class="card-hero-svg-wrap">
        ${item.svg}
      </div>
    `;

    arenaCaptionVerb.textContent = item.verb;
    arenaCaptionBase.textContent = `Base: "${item.base}"`;
    arenaCaptionSentence.textContent = `"${item.ruleText}"`;
    arenaCaptionHint.innerHTML = `💡 Clue: ${item.hint}`;

    if (arenaCounter) {
      arenaCounter.textContent = `Fossil ${index + 1} of ${list.length}`;
    }

    // Sound button on card
    arenaCardAudioBtn.onclick = () => {
      window.DinoAudio.playChime(587.33, 0.2);
      window.DinoAudio.speakPhrase(`${item.verb}. ${item.ruleText}`);
    };
  }

  function handleDecision(chosenType) {
    if (state.isLocked) return;
    state.isLocked = true;
    state.totalAttempts++;

    const item = window.DINO_DATA.relayFossils[state.cardIndex];
    const cardEl = arenaCardAnchor.querySelector('.arena-card');
    const isCorrect = (chosenType === item.type);

    if (isCorrect) {
      // 1. Physical Stamp Slam
      window.DinoAudio.playSlam();
      if (chosenType === 'REGULAR') {
        stampRegular.classList.add('active');
      } else {
        stampIrregular.classList.add('active');
      }

      // 2. Lift Animation & Streak
      cardEl.classList.add('card-lift');
      state.streak++;
      if (state.streak > state.bestStreak) state.bestStreak = state.streak;
      state.correctCount++;

      // Streak scaling score
      const bonusMult = state.streak >= 3 ? 1.5 : 1.0;
      const earnedXP = Math.round(item.xp * bonusMult);
      state.scoreXP = Math.min(200, state.scoreXP + earnedXP);

      window.DinoAudio.playStreakChime(state.streak);

      if (state.streak % 3 === 0) {
        spawnConfetti(25);
      }

      updateHUD();

      // Read audio confirmation
      setTimeout(() => {
        window.DinoAudio.speakPhrase(`Correct! ${item.verb}. ${item.ruleText}`, null, () => {
          advanceNextCard();
        });
      }, 350);

    } else {
      // Soft-Fail Non-Punitive Protocol
      window.DinoAudio.playSoftFail();
      cardEl.classList.add('card-shake');
      state.streak = 0;
      updateHUD();

      // Speak supportive guidance
      window.DinoAudio.speakPhrase(`Notice: ${item.hint}`, null, () => {
        state.isLocked = false;
        cardEl.classList.remove('card-shake');
      });
    }
  }

  function advanceNextCard() {
    window.DinoAudio.playWhoosh();
    setTimeout(() => {
      loadArenaCard(state.cardIndex + 1);
    }, 280);
  }

  /* ==========================================================================
     PHASE 3: MUSEUM HOLOGRAM TELEPROMPTER
     ========================================================================== */
  function renderPhase3Hologram(index) {
    const archetypes = window.DINO_DATA.teleprompterArchetypes;
    if (!archetypes || archetypes.length === 0) return;

    state.holoIndex = index % archetypes.length;
    const arch = archetypes[state.holoIndex];

    holoSpeciesBadge.textContent = `${arch.icon} ${arch.name} — ${arch.badge}`;
    holoArtPodium.innerHTML = arch.svg;

    // Full exhibit paragraph
    const fullText = `${arch.sentence1} ${arch.sentence2} ${arch.sentence3} ${arch.sentence4}`;
    
    // Split into individual words for karaoke highlight
    const words = fullText.split(/\s+/);
    teleprompterScript.innerHTML = '';

    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'karaoke-word';
      span.id = `holo-word-${i}`;
      span.textContent = w;
      teleprompterScript.appendChild(span);
    });

    state.holoText = fullText;
    state.holoWords = words;
  }

  function startTeleprompterSpeech() {
    if (state.holoSpeaking) {
      window.DinoAudio.stopSpeech();
      state.holoSpeaking = false;
      btnSpeakHolo.innerHTML = '🎙️ Read With Me';
      return;
    }

    state.holoSpeaking = true;
    btnSpeakHolo.innerHTML = '⏹️ Stop Voice';
    window.DinoAudio.playChime(659.25, 0.3);

    // Reset karaoke words
    const spans = teleprompterScript.querySelectorAll('.karaoke-word');
    spans.forEach(s => s.classList.remove('active', 'read-done'));

    let wordIdx = 0;
    const totalWords = state.holoWords.length;

    window.DinoAudio.speakPhrase(
      state.holoText,
      (charIndex) => {
        // Approximate current word based on character index
        const textUpToChar = state.holoText.substring(0, charIndex);
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
        state.holoSpeaking = false;
        btnSpeakHolo.innerHTML = '🎙️ Read With Me';
        spans.forEach(s => {
          s.classList.remove('active');
          s.classList.add('read-done');
        });
        window.DinoAudio.playFanfare();
        spawnConfetti(35);
      }
    );
  }

  /* ==========================================================================
     HUD & PROGRESS TRACKING
     ========================================================================== */
  function updateHUD() {
    const pct = Math.min(100, Math.round((state.scoreXP / 200) * 100));
    hudEnergyFill.style.width = `${pct}%`;
    hudXpLabel.textContent = `${state.scoreXP} / 200 XP`;
    hudStreakCount.textContent = `${state.streak}x`;
  }

  function triggerVictory() {
    window.DinoAudio.playFanfare();
    spawnConfetti(120, true);

    modalXpVal.textContent = `${state.scoreXP} XP`;
    modalStreakVal.textContent = `${state.bestStreak}x`;
    const acc = state.totalAttempts > 0 ? Math.round((state.correctCount / state.totalAttempts) * 100) : 100;
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
        window.DinoAudio.playChime(523.25, 0.2);
        setPhase(phaseNum);
      });
    });

    // 3D Push Decision Buttons
    btnChooseRegular.addEventListener('click', () => handleDecision('REGULAR'));
    btnChooseIrregular.addEventListener('click', () => handleDecision('IRREGULAR'));

    // Keyboard Shortcuts: [R] for Regular, [I] for Irregular
    window.addEventListener('keydown', (e) => {
      if (state.currentPhase !== 2) return;
      if (e.target.tagName === 'INPUT') return;

      const key = e.key.toUpperCase();
      if (key === 'R') {
        handleDecision('REGULAR');
      } else if (key === 'I') {
        handleDecision('IRREGULAR');
      }
    });

    // Audio Toggle
    hudSoundBtn.addEventListener('click', () => {
      const isMuted = window.DinoAudio.toggleMute();
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

    // Phase 3 Teleprompter Buttons
    btnSpeakHolo.addEventListener('click', startTeleprompterSpeech);
    btnNextHolo.addEventListener('click', () => {
      window.DinoAudio.stopSpeech();
      state.holoSpeaking = false;
      btnSpeakHolo.innerHTML = '🎙️ Read With Me';
      renderPhase3Hologram(state.holoIndex + 1);
    });

    // Victory Modal Buttons
    btnPrintDossier.addEventListener('click', () => {
      const studentName = encodeURIComponent(studentNameInput.value.trim() || 'Paleontologist Cadet');
      window.open(`worksheet.html?name=${studentName}`, '_blank');
    });

    btnReplayGame.addEventListener('click', () => {
      victoryModal.classList.remove('active');
      state.scoreXP = 0;
      state.streak = 0;
      state.cardIndex = 0;
      state.correctCount = 0;
      state.totalAttempts = 0;
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
