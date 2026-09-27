/**
 * TWIN GATES: ESCAPE THE SKY CASTLE
 * Reactive State Controller & 3-Layer Narrative Engine
 * Primary ESL / CEFR A1 | 35–40 Minute Narrative Loop • Total XP: 150
 */

(function(root) {
  'use strict';

  // =========================================================================
  // REACTIVE PLAYER SESSION STATE
  // =========================================================================
  const playerSession = {
    currentScene: 1,
    scene1Lit: false,
    scene2Fed: false,
    scene3BridgeSolved: false,
    scene4Unlocked: false,
    stoneStepIndex: 0,
    inventory: {
      torch: true,
      bread: true,
      key: true
    },
    xp: 0,
    isOpeningDoor: false,
    isKaraokeRunning: false
  };

  // Sequence for Scene 3: 0 (Blue) -> 1 (Yellow) -> 2 (Green)
  const STONE_SEQUENCE = [0, 1, 2];

  // =========================================================================
  // CONFETTI CELEBRATION ENGINE
  // =========================================================================
  const ConfettiEngine = {
    canvas: null,
    ctx: null,
    particles: [],
    animId: null,

    init() {
      this.canvas = document.getElementById('confettiCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    burst(count = 110) {
      if (!this.canvas || !this.ctx) this.init();
      if (!this.canvas || !this.ctx) return;

      const colors = ['#f59e0b', '#38bdf8', '#10b981', '#fbbf24', '#f43f5e', '#a855f7', '#ffffff'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: this.canvas.width / 2 + (Math.random() * 260 - 130),
          y: this.canvas.height * 0.42 + (Math.random() * 80 - 40),
          vx: (Math.random() - 0.5) * 15,
          vy: Math.random() * -12 - 4,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 10,
          opacity: 1,
          decay: Math.random() * 0.015 + 0.008
        });
      }

      if (!this.animId) {
        this.render();
      }
    },

    render() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rotation += p.rotSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > this.canvas.height + 20) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.render());
      } else {
        this.animId = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  };

  // =========================================================================
  // HUD & XP HELPERS
  // =========================================================================
  function addXP(amount) {
    playerSession.xp += amount;
    if (playerSession.xp > 150) playerSession.xp = 150;
    updateHUD();

    if (typeof root.AdventureAcademy !== 'undefined' && typeof root.AdventureAcademy.awardXP === 'function') {
      root.AdventureAcademy.awardXP(amount);
    } else if (typeof root.schoolStore !== 'undefined' && typeof root.schoolStore.addXP === 'function') {
      root.schoolStore.addXP(amount);
    }
  }

  function updateHUD() {
    const xpEl = document.getElementById('hudXP');
    if (xpEl) xpEl.textContent = `⭐ +${playerSession.xp} XP`;

    const sceneText = document.getElementById('hudSceneText');
    if (sceneText) sceneText.textContent = `Scene ${playerSession.currentScene} of 5`;

    for (let i = 1; i <= 5; i++) {
      const dot = document.getElementById(`sDot${i}`);
      if (dot) {
        dot.classList.toggle('is-passed', i < playerSession.currentScene);
        dot.classList.toggle('is-active', i === playerSession.currentScene);
      }
    }

    const slotTorch = document.getElementById('slotTorch');
    const slotBread = document.getElementById('slotBread');
    const slotKey = document.getElementById('slotKey');

    if (slotTorch) slotTorch.classList.toggle('is-filled', !!playerSession.inventory.torch);
    if (slotBread) slotBread.classList.toggle('is-filled', !!playerSession.inventory.bread);
    if (slotKey) slotKey.classList.toggle('is-filled', !!playerSession.inventory.key);
  }

  function toggleMuteAudio() {
    if (!root.TwinGatesAudio) return;
    const isMuted = root.TwinGatesAudio.toggleMute();
    const btn = document.getElementById('btnMuteToggle');
    if (btn) {
      btn.textContent = isMuted ? '🔇 Muted' : '🔊 Sound';
      btn.style.borderColor = isMuted ? '#ef4444' : '#f59e0b';
    }
  }

  // =========================================================================
  // SCENE 1: THE DARK CELLAR
  // =========================================================================
  function handleLightTorch() {
    if (playerSession.scene1Lit) return;
    playerSession.scene1Lit = true;
    addXP(30);

    const mask = document.getElementById('darkCellarMask');
    if (mask) mask.classList.add('is-lit');

    const sconce = document.getElementById('wallSconce');
    if (sconce) sconce.classList.add('is-lit');

    const btn = document.getElementById('btnLightTorch');
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.innerHTML = '<span>✓ Room Illuminated!</span>';
    }

    const promptText = document.getElementById('scene1PromptText');
    if (promptText) {
      promptText.innerHTML = '✨ <span style="color:#fbbf24;">The cellar is bright and warm!</span> Open a colossal door!';
    }

    root.TwinGatesAudio.playTorchLight();
    setTimeout(() => root.TwinGatesAudio.playXP(), 250);

    // Reveal Colossal Doors with active rumble
    const arena = document.getElementById('scene1DoorsArena');
    if (arena) arena.style.display = 'flex';

    root.TwinGatesAudio.speak("The room is bright and warm! Open the left ice door or right wood door!");
  }

  // =========================================================================
  // DOOR SELECTION & SCENE ROUTING
  // =========================================================================
  function chooseDoor(doorSide, sceneNum) {
    if (playerSession.isOpeningDoor) return;

    if (sceneNum === 1 && !playerSession.scene1Lit) {
      root.TwinGatesAudio.playSoftFail();
      root.TwinGatesAudio.speak("It is too dark! Light the wall sconce first.");
      return;
    }

    if (sceneNum === 2 && !playerSession.scene2Fed) {
      root.TwinGatesAudio.playSoftFail();
      root.TwinGatesAudio.speak("The beast is hungry! Feed the beast warm bread.");
      return;
    }

    if (sceneNum === 3 && !playerSession.scene3BridgeSolved) {
      root.TwinGatesAudio.playSoftFail();
      root.TwinGatesAudio.speak("The bridge is broken! Step on the stones in order.");
      return;
    }

    playerSession.isOpeningDoor = true;

    // Open door animation
    const card = document.getElementById(`s${sceneNum}Door${doorSide === 'left' ? 'Left' : 'Right'}`);
    if (card) card.classList.add('opened');

    root.TwinGatesAudio.playDoorCreak();
    setTimeout(() => root.TwinGatesAudio.playXP(), 220);

    setTimeout(() => {
      transitionToScene(sceneNum + 1);
      playerSession.isOpeningDoor = false;
    }, 850);
  }

  function transitionToScene(nextSceneNum) {
    playerSession.currentScene = nextSceneNum;

    for (let i = 1; i <= 5; i++) {
      const view = document.getElementById(`scenePhase${i}`);
      if (view) {
        view.classList.toggle('is-visible', i === nextSceneNum);
      }
    }

    updateHUD();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (nextSceneNum === 2) {
      setupScene2();
    } else if (nextSceneNum === 3) {
      setupScene3();
    } else if (nextSceneNum === 4) {
      setupScene4();
    } else if (nextSceneNum === 5) {
      setupScene5();
    }
  }

  function jumpToScene(targetSceneNum) {
    transitionToScene(targetSceneNum);
  }

  // =========================================================================
  // SCENE 2: THE BEAST DEN
  // =========================================================================
  function setupScene2() {
    root.TwinGatesAudio.playBeastSnore();
    root.TwinGatesAudio.speak("The beast is hungry! Give the beast warm bread!");
  }

  function handleFeedBeast() {
    if (playerSession.scene2Fed) return;
    playerSession.scene2Fed = true;
    addXP(30);

    root.TwinGatesAudio.playSnap();
    setTimeout(() => root.TwinGatesAudio.playBeastSnore(), 180);
    setTimeout(() => root.TwinGatesAudio.playXP(), 350);

    const sealBox = document.getElementById('scene2Seal');
    if (sealBox) {
      sealBox.innerHTML = '<span class="rubber-stamp-seal">❤️ Beast Fed!</span>';
    }

    const btn = document.getElementById('btnFeedBeast');
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.innerHTML = '<span>✓ Beast Happy &amp; Asleep!</span>';
    }

    const promptText = document.getElementById('scene2PromptText');
    if (promptText) {
      promptText.innerHTML = '💤 <span style="color:#10b981;">The furry beast is sleeping peacefully!</span> Choose your door!';
    }

    // Reveal Colossal Doors
    const arena = document.getElementById('scene2DoorsArena');
    if (arena) arena.style.display = 'flex';

    root.TwinGatesAudio.speak("The beast is happy and falls asleep! Choose the rock arch or cloud arch!");
  }

  // =========================================================================
  // SCENE 3: THE COLLAPSING STEPPING STONES
  // =========================================================================
  function setupScene3() {
    playerSession.stoneStepIndex = 0;
    for (let i = 0; i < 3; i++) {
      const stone = document.getElementById(`stone${i}`);
      if (stone) stone.classList.remove('is-stepped');
    }
    const feedback = document.getElementById('bridgeFeedback');
    if (feedback) feedback.textContent = '';

    root.TwinGatesAudio.speak("The bridge is broken! Step on Blue, then Yellow, then Green!");
  }

  function handleStoneStep(index) {
    if (playerSession.scene3BridgeSolved) return;

    if (index === playerSession.stoneStepIndex) {
      const stone = document.getElementById(`stone${index}`);
      if (stone) stone.classList.add('is-stepped');
      root.TwinGatesAudio.playSnap();

      playerSession.stoneStepIndex++;

      if (playerSession.stoneStepIndex === 3) {
        playerSession.scene3BridgeSolved = true;
        addXP(30);
        root.TwinGatesAudio.playXP();

        const feedback = document.getElementById('bridgeFeedback');
        if (feedback) {
          feedback.innerHTML = '🌉 <span style="color:#34d399;">Bridge Formed!</span> You crossed the abyss safely!';
        }

        const seal = document.getElementById('scene3Seal');
        if (seal) seal.innerHTML = '<span class="rubber-stamp-seal">🌉 Bridge Safe!</span>';

        const arena = document.getElementById('scene3DoorsArena');
        if (arena) arena.style.display = 'flex';

        root.TwinGatesAudio.speak("You crossed the abyss bridge safely! Choose the sky path or tower path!");
      }
    } else {
      root.TwinGatesAudio.playSoftFail();
      playerSession.stoneStepIndex = 0;
      for (let i = 0; i < 3; i++) {
        const stone = document.getElementById(`stone${i}`);
        if (stone) stone.classList.remove('is-stepped');
      }

      const feedback = document.getElementById('bridgeFeedback');
      if (feedback) {
        feedback.innerHTML = '⚠️ <span style="color:#f87171;">The stone cracked!</span> Step in order: 1. Blue ➔ 2. Yellow ➔ 3. Green!';
      }
      root.TwinGatesAudio.speak("Step in order: Blue, then Yellow, then Green!");
    }
  }

  // =========================================================================
  // SCENE 4: THE GRAND SKY GATE
  // =========================================================================
  function setupScene4() {
    root.TwinGatesAudio.speak("The giant golden gate is locked! Put the Golden Key into the lock!");
  }

  function handleUnlockKey() {
    if (playerSession.scene4Unlocked) return;
    playerSession.scene4Unlocked = true;
    addXP(30);

    root.TwinGatesAudio.playSnap();
    setTimeout(() => root.TwinGatesAudio.playDoorCreak(), 200);
    setTimeout(() => root.TwinGatesAudio.playXP(), 400);

    const sealBox = document.getElementById('scene4Seal');
    if (sealBox) sealBox.innerHTML = '<span class="rubber-stamp-seal">🗝️ Gate Unlocked!</span>';

    const btn = document.getElementById('btnUnlockSkyGate');
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.innerHTML = '<span>✓ Golden Gate Unlocked!</span>';
    }

    root.TwinGatesAudio.speak("The Golden Gate is unlocked! Step out onto the airship launchpad!");

    setTimeout(() => {
      transitionToScene(5);
    }, 900);
  }

  // =========================================================================
  // SCENE 5: AIRSHIP ESCAPE & TELEPROMPTER STUDIO
  // =========================================================================
  function setupScene5() {
    root.TwinGatesAudio.speak(
      "We reached the Golden Airship! Speak into the microphone to launch!"
    );
  }

  function startFinalKaraokeBroadcast() {
    if (playerSession.isKaraokeRunning) return;
    playerSession.isKaraokeRunning = true;

    const lines = [
      { id: 'teleLine1', text: "We entered the Sky Castle and lit the dark room!" },
      { id: 'teleLine2', text: "We fed the friendly beast and crossed the magic bridge." },
      { id: 'teleLine3', text: "We unlocked the Golden Gate and escaped on the airship!" }
    ];

    let lineIndex = 0;

    function playNextLine() {
      if (lineIndex >= lines.length) {
        playerSession.isKaraokeRunning = false;
        root.TwinGatesAudio.playXP();
        return;
      }

      const item = lines[lineIndex];
      const el = document.getElementById(item.id);
      if (!el) {
        lineIndex++;
        playNextLine();
        return;
      }

      const words = item.text.split(' ');
      el.innerHTML = words.map(w => `<span class="tp-word">${w}</span>`).join(' ');
      const wordSpans = el.querySelectorAll('.tp-word');

      let wordIdx = 0;
      const wordInterval = setInterval(() => {
        if (wordIdx < wordSpans.length) {
          wordSpans.forEach(s => s.classList.remove('is-active'));
          wordSpans[wordIdx].classList.add('is-active');
          wordSpans[wordIdx].classList.add('is-spoken');
          root.TwinGatesAudio.playSnap();
          wordIdx++;
        } else {
          clearInterval(wordInterval);
        }
      }, 290);

      root.TwinGatesAudio.speak(item.text, () => {
        clearInterval(wordInterval);
        wordSpans.forEach(s => {
          s.classList.remove('is-active');
          s.classList.add('is-spoken');
        });
        lineIndex++;
        setTimeout(playNextLine, 400);
      });
    }

    playNextLine();
  }

  function finishSkyCastleQuest() {
    addXP(30); // 120 + 30 = 150 Total XP
    root.TwinGatesAudio.playVictoryFanfare();
    ConfettiEngine.burst(140);

    setTimeout(() => {
      const modal = document.getElementById('completionModal');
      if (modal) modal.classList.add('is-open');
    }, 600);
  }

  function closeCompletionModal() {
    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.remove('is-open');
  }

  function replaySceneNarration(sceneNum) {
    if (!root.TwinGatesAudio) return;
    if (sceneNum === 1) {
      root.TwinGatesAudio.speak("The Sky Castle is shaking! It is too dark! Use the torch to light the room!");
    } else if (sceneNum === 2) {
      root.TwinGatesAudio.speak("The beast is hungry! Give the beast warm bread!");
    } else if (sceneNum === 3) {
      root.TwinGatesAudio.speak("The bridge is broken! Step on Blue, then Yellow, then Green!");
    } else if (sceneNum === 4) {
      root.TwinGatesAudio.speak("The giant golden gate is locked! Put the Golden Key into the lock!");
    }
  }

  // =========================================================================
  // BOOTSTRAP INITIALIZATION
  // =========================================================================
  function initApp() {
    ConfettiEngine.init();
    updateHUD();
  }

  window.addEventListener('DOMContentLoaded', initApp);

  // Expose global controller API
  root.handleLightTorch = handleLightTorch;
  root.handleFeedBeast = handleFeedBeast;
  root.handleStoneStep = handleStoneStep;
  root.handleUnlockKey = handleUnlockKey;
  root.chooseDoor = chooseDoor;
  root.jumpToScene = jumpToScene;
  root.startFinalKaraokeBroadcast = startFinalKaraokeBroadcast;
  root.finishSkyCastleQuest = finishSkyCastleQuest;
  root.closeCompletionModal = closeCompletionModal;
  root.replaySceneNarration = replaySceneNarration;
  root.toggleMuteAudio = toggleMuteAudio;
  root.playerSession = playerSession;

})(typeof window !== 'undefined' ? window : global);
