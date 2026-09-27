/**
 * CREATURE CAFÉ: MYTHICAL LIKES & DISLIKES
 * Reactive Arcade Controller, 3-Phase Router, Kitchen Workbench, and Live Teleprompter
 * Grade 3–4 ESL / CLIL (CEFR A1–A1+)
 */

(function () {
  "use strict";

  // --- Central Reactive Player State ---
  const playerSession = {
    currentPhase: 1,
    currentOrderIdx: 0,
    totalXP: 0,
    happiness: 25,
    discoveredCreatures: new Set(),
    ordersCompleted: 0,
    selectedKaraokeId: "ember-dragon",
    isSpeaking: false,
    audioInitialized: false
  };

  // DOM Elements Cache
  const elements = {
    // HUD
    xpVal: document.getElementById("hud-xp-val"),
    happinessFill: document.getElementById("happiness-fill"),
    happinessVal: document.getElementById("happiness-val"),
    btnSoundToggle: document.getElementById("btn-sound-toggle"),
    
    // Tabs & Views
    tabPhase1: document.getElementById("tab-phase-1"),
    tabPhase2: document.getElementById("tab-phase-2"),
    tabPhase3: document.getElementById("tab-phase-3"),
    phase1View: document.getElementById("phase-1-view"),
    phase2View: document.getElementById("phase-2-view"),
    phase3View: document.getElementById("phase-3-view"),

    // Phase 1
    menuCardsContainer: document.getElementById("menu-cards-container"),

    // Phase 2: Workbench
    workbenchRoundPill: document.getElementById("workbench-round-pill"),
    workbenchElementBadge: document.getElementById("workbench-element-badge"),
    workbenchCreatureImg: document.getElementById("workbench-creature-img"),
    workbenchCreatureName: document.getElementById("workbench-creature-name"),
    workbenchCreatureSpecies: document.getElementById("workbench-creature-species"),
    workbenchPedestal: document.getElementById("workbench-pedestal"),
    orderPromptText: document.getElementById("order-prompt-text"),
    orderHelperBadge: document.getElementById("order-helper-badge"),
    sentencePrefixText: document.getElementById("sentence-prefix-text"),
    workbenchTargetSlot: document.getElementById("workbench-target-slot"),
    workbenchOptionsGrid: document.getElementById("workbench-options-grid"),
    workbenchFeedbackBox: document.getElementById("workbench-feedback-box"),
    stampSlamToast: document.getElementById("stamp-slam-toast"),
    stampToastMsg: document.getElementById("stamp-toast-msg"),

    // Phase 3: Teleprompter
    teleprompterTabs: document.getElementById("teleprompter-tabs"),
    karaokeBadge: document.getElementById("karaoke-badge"),
    karaokePedestal: document.getElementById("karaoke-pedestal"),
    karaokeCreatureImg: document.getElementById("karaoke-creature-img"),
    karaokeCreatureName: document.getElementById("karaoke-creature-name"),
    karaokeCreatureDesc: document.getElementById("karaoke-creature-desc"),
    teleprompterScript: document.getElementById("teleprompter-script"),
    btnStartKaraoke: document.getElementById("btn-start-karaoke"),
    btnCompleteKaraoke: document.getElementById("btn-complete-karaoke"),
    btnStopKaraoke: document.getElementById("btn-stop-karaoke"),
    btnKaraokeListen: document.getElementById("btn-karaoke-listen"),

    // Victory Modal
    victoryModal: document.getElementById("victory-modal"),
    btnReplayGame: document.getElementById("btn-replay-game"),
    confettiCanvas: document.getElementById("confetti-canvas")
  };

  // Safe Audio Singleton Reference
  const audio = window.cafeAudio || window.SoundAudio || {
    init: () => {},
    playSnap: () => {},
    playXP: () => {},
    playSoftFail: () => {},
    playFanfare: () => {},
    playStampSlam: () => {},
    speak: (t, cb) => { if (cb) cb(); },
    speakText: (t, b, e) => { if (e) e(); },
    stopSpeech: () => {},
    toggleMute: () => false
  };

  // --- Autoplay & First Gesture Guard ---
  function ensureAudio() {
    if (!playerSession.audioInitialized) {
      audio.init();
      playerSession.audioInitialized = true;
    }
  }
  document.addEventListener("click", ensureAudio, { once: true });
  document.addEventListener("keydown", ensureAudio, { once: true });

  // --- XP & Happiness Engine ---
  function awardXP(points, reason = "") {
    playerSession.totalXP += points;
    if (elements.xpVal) {
      elements.xpVal.textContent = playerSession.totalXP;
    }
    // Update platform state if available
    if (window.AdventureAcademy && typeof window.AdventureAcademy.awardXP === "function") {
      window.AdventureAcademy.awardXP(points);
    } else {
      try {
        const storedXP = parseInt(localStorage.getItem("adventure_academy_xp") || "0", 10);
        localStorage.setItem("adventure_academy_xp", (storedXP + points).toString());
      } catch (e) {}
    }
  }

  function adjustHappiness(amount) {
    playerSession.happiness = Math.max(10, Math.min(100, playerSession.happiness + amount));
    if (elements.happinessFill) {
      elements.happinessFill.style.width = playerSession.happiness + "%";
    }
    if (elements.happinessVal) {
      elements.happinessVal.textContent = playerSession.happiness + "%";
    }
  }

  // --- Phase Switcher ---
  function switchPhase(phaseNum) {
    ensureAudio();
    audio.playSnap();
    audio.stopSpeech();
    playerSession.currentPhase = phaseNum;

    // Update Tab UI
    [elements.tabPhase1, elements.tabPhase2, elements.tabPhase3].forEach((tab, idx) => {
      if (tab) {
        tab.classList.toggle("active", idx + 1 === phaseNum);
      }
    });

    // Update Views
    [elements.phase1View, elements.phase2View, elements.phase3View].forEach((view, idx) => {
      if (view) {
        view.classList.toggle("active", idx + 1 === phaseNum);
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (phaseNum === 2) {
      loadWorkbenchRound(playerSession.currentOrderIdx);
    } else if (phaseNum === 3) {
      loadKaraokeCreature(playerSession.selectedKaraokeId);
    }
  }

  // ==========================================================================
  // PHASE 1: MENU SCANNER (65% Full-Bleed Artwork Standard)
  // ==========================================================================
  function initMenuScanner() {
    if (!elements.menuCardsContainer) return;
    elements.menuCardsContainer.innerHTML = "";

    CREATURE_CAFE_DATA.creatures.forEach((creature) => {
      const card = document.createElement("div");
      card.className = "specimen-card";
      card.setAttribute("data-creature-id", creature.id);

      // Upper 65% Full-Bleed Media Viewport
      const stage = document.createElement("div");
      stage.className = "card-hero-stage";
      stage.style.background = `radial-gradient(circle at 50% 55%, ${creature.glowColor} 0%, rgba(15, 23, 42, 0.95) 100%)`;

      const badge = document.createElement("span");
      badge.className = "card-badge";
      badge.textContent = creature.badge;

      const audioBtn = document.createElement("button");
      audioBtn.className = "btn-card-audio";
      audioBtn.setAttribute("title", `Listen to ${creature.name}`);
      audioBtn.innerHTML = "🔊";
      audioBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        ensureAudio();
        audio.playSnap();
        const speechSentence = `${creature.name} likes ${creature.likesFood} and ${creature.likesAction}. It doesn't like ${creature.dislikesFood}!`;
        audio.speak(speechSentence);
        
        // Discovery XP
        if (!playerSession.discoveredCreatures.has(creature.id)) {
          playerSession.discoveredCreatures.add(creature.id);
          awardXP(15, "Discovered Creature");
          adjustHappiness(8);
          audio.playXP();
        }
      });

      const pedestal = document.createElement("div");
      pedestal.className = "isometric-pedestal";
      pedestal.style.borderColor = creature.accentColor;
      pedestal.style.boxShadow = `0 0 24px ${creature.glowColor}`;

      const sprite = document.createElement("img");
      sprite.className = "hero-3d-sprite";
      sprite.src = creature.asset;
      sprite.alt = creature.name;
      sprite.loading = "lazy";

      stage.appendChild(badge);
      stage.appendChild(audioBtn);
      stage.appendChild(pedestal);
      stage.appendChild(sprite);

      // Lower 35% Glassmorphic Caption Tray
      const tray = document.createElement("div");
      tray.className = "card-info-tray";

      const titleRow = document.createElement("div");
      titleRow.className = "card-title-row";
      titleRow.innerHTML = `
        <span class="card-creature-name">${creature.name}</span>
        <span class="card-species-tag">${creature.species}</span>
      `;

      const prefBox = document.createElement("div");
      prefBox.className = "card-preference-box";
      prefBox.innerHTML = `
        <div class="pref-row like">
          <span class="pref-icon">❤️</span>
          <span class="pref-text">Likes: <strong>${creature.likesFood}</strong> &amp; <strong>${creature.likesAction}</strong></span>
        </div>
        <div class="pref-row dislike">
          <span class="pref-icon">💔</span>
          <span class="pref-text">Dislikes: <strong>${creature.dislikesFood}</strong> &amp; <strong>${creature.dislikesAction}</strong></span>
        </div>
      `;

      const discoverBtn = document.createElement("button");
      discoverBtn.className = "btn-3d btn-primary btn-sm";
      discoverBtn.style.marginTop = "4px";
      discoverBtn.innerHTML = `<span>💬 Hear Greeting</span>`;
      discoverBtn.addEventListener("click", () => {
        ensureAudio();
        audio.playSnap();
        audio.speak(`${creature.name} says: ${creature.greeting}`);
        if (!playerSession.discoveredCreatures.has(creature.id)) {
          playerSession.discoveredCreatures.add(creature.id);
          awardXP(15);
          adjustHappiness(8);
          audio.playXP();
        }
      });

      tray.appendChild(titleRow);
      tray.appendChild(prefBox);
      tray.appendChild(discoverBtn);

      card.appendChild(stage);
      card.appendChild(tray);
      elements.menuCardsContainer.appendChild(card);
    });
  }

  // ==========================================================================
  // PHASE 2: CAFÉ KITCHEN WORKBENCH
  // ==========================================================================
  function loadWorkbenchRound(index) {
    if (index >= CREATURE_CAFE_DATA.orders.length) {
      // Completed all orders!
      triggerOrderVictory();
      return;
    }

    const order = CREATURE_CAFE_DATA.orders[index];
    const creature = CREATURE_CAFE_DATA.creatures.find(c => c.id === order.creatureId);
    if (!creature) return;

    // Update customer visuals
    if (elements.workbenchRoundPill) {
      elements.workbenchRoundPill.textContent = `ROUND ${index + 1} / ${CREATURE_CAFE_DATA.orders.length}`;
    }
    if (elements.workbenchElementBadge) {
      elements.workbenchElementBadge.textContent = creature.badge;
    }
    if (elements.workbenchCreatureImg) {
      elements.workbenchCreatureImg.src = creature.asset;
      elements.workbenchCreatureImg.alt = creature.name;
    }
    if (elements.workbenchCreatureName) {
      elements.workbenchCreatureName.textContent = creature.name;
    }
    if (elements.workbenchCreatureSpecies) {
      elements.workbenchCreatureSpecies.textContent = `${creature.species} • Table Guest`;
    }
    if (elements.workbenchPedestal) {
      elements.workbenchPedestal.style.borderColor = creature.accentColor;
      elements.workbenchPedestal.style.boxShadow = `0 0 24px ${creature.glowColor}`;
    }

    // Update order prompt & grammar target
    if (elements.orderPromptText) {
      elements.orderPromptText.textContent = order.prompt;
    }
    if (elements.orderHelperBadge) {
      elements.orderHelperBadge.innerHTML = `💡 ${order.explanation.split("—")[0] || "Match the correct taste!"}`;
    }

    // Grammar Formula Prefix
    if (elements.sentencePrefixText) {
      if (order.questionType.startsWith("dislike")) {
        elements.sentencePrefixText.textContent = `${creature.name} doesn't like`;
      } else {
        elements.sentencePrefixText.textContent = `${creature.name} likes`;
      }
    }

    // Reset target slot
    if (elements.workbenchTargetSlot) {
      elements.workbenchTargetSlot.textContent = "???";
      elements.workbenchTargetSlot.classList.remove("filled");
    }

    // Hide feedback box
    if (elements.workbenchFeedbackBox) {
      elements.workbenchFeedbackBox.style.display = "none";
    }

    // Render options
    renderWorkbenchOptions(order, creature);
  }

  function getOptionMeta(optionName) {
    const food = CREATURE_CAFE_DATA.foods.find(f => f.name.toLowerCase() === optionName.toLowerCase());
    if (food) return food;
    const action = CREATURE_CAFE_DATA.actions.find(a => a.name.toLowerCase() === optionName.toLowerCase());
    if (action) return { emoji: action.emoji, label: action.label, taste: "Activity" };
    return { emoji: "✨", label: optionName, taste: "Special" };
  }

  function renderWorkbenchOptions(order, creature) {
    if (!elements.workbenchOptionsGrid) return;
    elements.workbenchOptionsGrid.innerHTML = "";

    // Shuffle options array copy
    const shuffled = [...order.options].sort(() => Math.random() - 0.5);

    shuffled.forEach((optName) => {
      const meta = getOptionMeta(optName);
      const btn = document.createElement("button");
      btn.className = "treat-option-card";
      btn.innerHTML = `
        <span class="treat-emoji">${meta.emoji}</span>
        <div class="treat-details">
          <span class="treat-name">${meta.label || optName}</span>
          <span class="treat-flavor">${meta.taste || "Café Special"}</span>
        </div>
      `;

      btn.addEventListener("click", () => {
        handleOptionSelect(btn, optName, order, creature);
      });

      elements.workbenchOptionsGrid.appendChild(btn);
    });
  }

  function handleOptionSelect(buttonElem, selectedAnswer, order, creature) {
    ensureAudio();

    if (selectedAnswer.toLowerCase() === order.correctAnswer.toLowerCase()) {
      // --- CORRECT ANSWER ---
      audio.playStampSlam();
      audio.playXP();

      // Lock buttons
      const allButtons = elements.workbenchOptionsGrid.querySelectorAll("button");
      allButtons.forEach(b => b.style.pointerEvents = "none");

      buttonElem.style.borderColor = "#10b981";
      buttonElem.style.background = "rgba(16, 185, 129, 0.25)";

      // Fill slot
      if (elements.workbenchTargetSlot) {
        elements.workbenchTargetSlot.textContent = selectedAnswer;
        elements.workbenchTargetSlot.classList.add("filled");
      }

      // Stamp slam toast
      if (elements.stampSlamToast) {
        elements.stampSlamToast.classList.add("show");
        setTimeout(() => {
          elements.stampSlamToast.classList.remove("show");
        }, 1200);
      }

      awardXP(25, "Correct Order Match");
      adjustHappiness(10);
      playerSession.ordersCompleted++;

      // Speak target grammar formula
      audio.speak(order.targetGrammar, () => {
        // Advance round after audio finishes
        setTimeout(() => {
          playerSession.currentOrderIdx++;
          loadWorkbenchRound(playerSession.currentOrderIdx);
        }, 600);
      });

    } else {
      // --- SOFT-FAIL (Encouraging Wobble, Zero Penalty) ---
      audio.playSoftFail();
      buttonElem.classList.remove("wobble");
      void buttonElem.offsetWidth; // Trigger reflow
      buttonElem.classList.add("wobble");

      const softClue = `Oops! Check the menu. What does ${creature.name} really like?`;
      audio.speak(softClue);

      setTimeout(() => {
        buttonElem.classList.remove("wobble");
      }, 500);
    }
  }

  function triggerOrderVictory() {
    audio.playFanfare();
    launchConfetti();

    if (elements.orderPromptText) {
      elements.orderPromptText.textContent = "🎉 All orders served! Every mythical creature is smiling!";
    }
    if (elements.workbenchOptionsGrid) {
      elements.workbenchOptionsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 24px;">
          <h3 style="font-size: 1.4rem; color: #34d399; margin-bottom: 12px;">Kitchen Service 100% Complete!</h3>
          <p style="color: #94a3b8; margin-bottom: 20px;">Ready to deliver your 3-sentence speaking review on the teleprompter?</p>
          <button class="btn-3d btn-primary" id="btn-goto-teleprompter">
            <span>🎤</span>
            <span>Go to Live Karaoke Stage</span>
          </button>
        </div>
      `;
      const gotoBtn = document.getElementById("btn-goto-teleprompter");
      if (gotoBtn) {
        gotoBtn.addEventListener("click", () => switchPhase(3));
      }
    }
  }

  // ==========================================================================
  // PHASE 3: LIVE KARAOKE TELEPROMPTER
  // ==========================================================================
  function initKaraokeTabs() {
    if (!elements.teleprompterTabs) return;
    elements.teleprompterTabs.innerHTML = "";

    CREATURE_CAFE_DATA.creatures.forEach((creature) => {
      const tab = document.createElement("button");
      tab.className = `creature-select-tab ${creature.id === playerSession.selectedKaraokeId ? "active" : ""}`;
      tab.innerHTML = `<span>${creature.badge.split(" ")[0]}</span> <span>${creature.name}</span>`;
      tab.addEventListener("click", () => {
        ensureAudio();
        audio.playSnap();
        playerSession.selectedKaraokeId = creature.id;
        document.querySelectorAll(".creature-select-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        loadKaraokeCreature(creature.id);
      });
      elements.teleprompterTabs.appendChild(tab);
    });
  }

  function loadKaraokeCreature(creatureId) {
    const creature = CREATURE_CAFE_DATA.creatures.find(c => c.id === creatureId);
    if (!creature) return;

    if (elements.karaokeBadge) elements.karaokeBadge.textContent = creature.badge;
    if (elements.karaokeCreatureImg) elements.karaokeCreatureImg.src = creature.asset;
    if (elements.karaokeCreatureName) elements.karaokeCreatureName.textContent = creature.name;
    if (elements.karaokeCreatureDesc) elements.karaokeCreatureDesc.textContent = `${creature.species} • Customer Review`;
    if (elements.karaokePedestal) {
      elements.karaokePedestal.style.borderColor = creature.accentColor;
      elements.karaokePedestal.style.boxShadow = `0 0 24px ${creature.glowColor}`;
    }

    renderTeleprompterScript(creature.teleprompter);
  }

  function renderTeleprompterScript(lines) {
    if (!elements.teleprompterScript) return;
    elements.teleprompterScript.innerHTML = "";

    lines.forEach((lineText, lineIdx) => {
      const lineDiv = document.createElement("div");
      lineDiv.className = "teleprompter-line";
      lineDiv.id = `karaoke-line-${lineIdx}`;

      // Wrap each word into a span for live highlighting
      const words = lineText.split(" ");
      words.forEach((word, wordIdx) => {
        const span = document.createElement("span");
        span.className = "karaoke-word";
        span.id = `karaoke-word-${lineIdx}-${wordIdx}`;
        span.textContent = word + " ";
        lineDiv.appendChild(span);
      });

      elements.teleprompterScript.appendChild(lineDiv);
    });
  }

  function playKaraokeTeleprompter() {
    ensureAudio();
    audio.playSnap();
    audio.stopSpeech();

    const creature = CREATURE_CAFE_DATA.creatures.find(c => c.id === playerSession.selectedKaraokeId);
    if (!creature) return;

    const lines = creature.teleprompter;
    let currentLineIdx = 0;

    function playNextLine() {
      if (currentLineIdx >= lines.length) {
        // Finished read-along
        audio.playXP();
        document.querySelectorAll(".teleprompter-line").forEach(l => l.classList.remove("active"));
        document.querySelectorAll(".karaoke-word").forEach(w => w.classList.remove("highlight"));
        return;
      }

      document.querySelectorAll(".teleprompter-line").forEach((l, idx) => {
        l.classList.toggle("active", idx === currentLineIdx);
      });

      const lineText = lines[currentLineIdx];
      const wordSpans = document.querySelectorAll(`#karaoke-line-${currentLineIdx} .karaoke-word`);
      let wordCursor = 0;

      // Highlight first word
      if (wordSpans.length > 0) wordSpans[0].classList.add("highlight");

      audio.speakText(
        lineText,
        () => {
          // Boundary callback
          if (wordCursor < wordSpans.length) {
            wordSpans.forEach(w => w.classList.remove("highlight"));
            wordSpans[wordCursor].classList.add("highlight");
            wordCursor++;
          }
        },
        () => {
          // Line complete
          if (wordCursor < wordSpans.length) {
            wordSpans.forEach(w => w.classList.add("highlight"));
          }
          currentLineIdx++;
          setTimeout(playNextLine, 500);
        }
      );
    }

    playNextLine();
  }

  // Complete Karaoke and trigger modal
  function completeKaraokeDebrief() {
    ensureAudio();
    audio.playSnap();
    audio.playFanfare();
    launchConfetti();
    awardXP(50, "Teleprompter Speaking Production");
    adjustHappiness(20);

    setTimeout(() => {
      if (elements.victoryModal) {
        elements.victoryModal.classList.add("show");
      }
    }, 600);
  }

  // ==========================================================================
  // CONFETTI CANVAS PARTICLES
  // ==========================================================================
  function launchConfetti() {
    const canvas = elements.confettiCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#38bdf8", "#10b981", "#f59e0b", "#a855f7", "#ef4444", "#f43f5e"];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.2) * 12,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.28,
        opacity: 1
      });
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.009;

        if (p.opacity > 0) {
          alive++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive > 0) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    render();
  }

  // ==========================================================================
  // EVENT LISTENERS & BOOTSTRAP
  // ==========================================================================
  function setupEventListeners() {
    // Sound Toggle
    if (elements.btnSoundToggle) {
      elements.btnSoundToggle.addEventListener("click", () => {
        ensureAudio();
        const muted = audio.toggleMute();
        elements.btnSoundToggle.textContent = muted ? "🔇" : "🔊";
      });
    }

    // Phase Navigation Tabs
    if (elements.tabPhase1) elements.tabPhase1.addEventListener("click", () => switchPhase(1));
    if (elements.tabPhase2) elements.tabPhase2.addEventListener("click", () => switchPhase(2));
    if (elements.tabPhase3) elements.tabPhase3.addEventListener("click", () => switchPhase(3));

    // Teleprompter Controls
    if (elements.btnStartKaraoke) {
      elements.btnStartKaraoke.addEventListener("click", playKaraokeTeleprompter);
    }
    if (elements.btnCompleteKaraoke) {
      elements.btnCompleteKaraoke.addEventListener("click", completeKaraokeDebrief);
    }
    if (elements.btnStopKaraoke) {
      elements.btnStopKaraoke.addEventListener("click", () => {
        ensureAudio();
        audio.stopSpeech();
        document.querySelectorAll(".teleprompter-line").forEach(l => l.classList.remove("active"));
        document.querySelectorAll(".karaoke-word").forEach(w => w.classList.remove("highlight"));
      });
    }
    if (elements.btnKaraokeListen) {
      elements.btnKaraokeListen.addEventListener("click", playKaraokeTeleprompter);
    }

    // Victory Modal Replay
    if (elements.btnReplayGame) {
      elements.btnReplayGame.addEventListener("click", () => {
        if (elements.victoryModal) elements.victoryModal.classList.remove("show");
        playerSession.currentOrderIdx = 0;
        switchPhase(1);
      });
    }
  }

  // App Initialize
  function init() {
    setupEventListeners();
    initMenuScanner();
    initKaraokeTabs();
    loadKaraokeCreature(playerSession.selectedKaraokeId);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
