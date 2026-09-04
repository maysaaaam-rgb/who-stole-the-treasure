/**
 * THE LAST EXPEDITION: UI CONTROLLER
 * Section 0: Expedition Training (7 Mini-Games)
 * + 10 Sequential Main Story Scenes with High-Visual Simple English.
 */

class ExpeditionUIController {
  constructor() {
    this.selectedChoiceId = null;
    this.memoryTimerInterval = null;
  }

  updateHeader() {
    const scores = window.expeditionEngine.scores;
    const scoreEl = document.getElementById("expedition-score-val");
    if (scoreEl) scoreEl.textContent = scores.total;

    const stormEl = document.getElementById("storm-time-val");
    if (stormEl) {
      if (window.expeditionEngine.mode === "training") {
        stormEl.textContent = "TRAINING 🎒";
      } else {
        stormEl.textContent = `${window.expeditionEngine.stormMinutesLeft} MIN`;
      }
    }
  }

  // =========================================================================
  // SECTION 0: EXPEDITION TRAINING RENDERERS
  // =========================================================================

  showTrainingIntro() {
    window.expeditionEngine.mode = "training";
    const container = document.getElementById("expedition-main-view");
    if (!container) return;

    const intro = EXPEDITION_TRAINING_DATA.intro;
    const explorers = EXPEDITION_DATA.explorers;

    container.innerHTML = `
      <div class="expedition-master-viewport">
        <!-- Top Status Bar -->
        <div class="expedition-status-bar">
          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="jumbo-btn btn-ocean" style="padding: 6px 14px; font-size: 0.85rem;" onclick="uiController.showScreen('hub')">
              🏠 MAIN MENU
            </button>
            <div style="font-family: 'Bungee', cursive; font-size: 1.1rem; color: #1e293b;">
              🎒 SECTION 0: EXPEDITION TRAINING
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="storm-timer-pill" style="background: #e0f2fe; border-color: #0284c7; color: #0369a1;">
              <span>🎒</span> <strong>TRAINING READY</strong>
            </div>
            <div style="font-family: 'Bungee', cursive; color: #d97706; font-size: 1.15rem;">
              ⭐ <span id="expedition-score-val">${window.expeditionEngine.scores.total}</span>
            </div>
          </div>
        </div>

        <!-- Training Banner -->
        <div class="adventure-card" style="max-width: 1000px; padding: 24px; text-align: center;">
          <div class="card-header-banner">
            <span class="card-tag" style="background: #e0f2fe; color: #0369a1;">🎒 7-10 MIN WARM-UP</span>
            <h1 class="main-heading" style="color: #0284c7; font-size: 2.4rem;">${intro.title}</h1>
            <p class="sub-heading" style="font-size: 1.3rem;">“${intro.tagline}”</p>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${intro.spoken}')" style="margin-top: 6px;">🔊 Listen</button>
          </div>

          <!-- 4 Explorers with Backpacks -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0;">
            ${explorers.map(exp => `
              <div class="explorer-mini-card" style="flex-direction: column; text-align: center; padding: 14px 10px;">
                ${EXPEDITION_SVG.getExplorerAvatarSvg(exp.avatarClass, 60)}
                <div class="explorer-mini-name" style="margin-top: 8px;">${exp.name}</div>
                <div class="explorer-mini-role">🎒 Backpack Ready</div>
              </div>
            `).join("")}
          </div>

          <!-- Target Words Preview -->
          <div style="background: #f8fafc; border: 3px solid #cbd5e1; border-radius: var(--radius-lg); padding: 16px; margin-bottom: 20px;">
            <h3 style="font-family: 'Bungee', cursive; color: #1e293b; font-size: 1.1rem; margin-bottom: 12px;">
              🌟 12 EXPLORER WORDS TO LEARN:
            </h3>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">
              ${EXPEDITION_TRAINING_DATA.targetWords.map(w => `
                <span class="starter-chip" style="font-size: 0.95rem; cursor: default;">
                  ${w.icon} ${w.word}
                </span>
              `).join("")}
            </div>
          </div>

          <button class="jumbo-btn btn-gold" style="font-size: 1.4rem; padding: 16px 42px;" onclick="expeditionUI.startTraining()">
            START EXPEDITION TRAINING 🎮 ➔
          </button>
        </div>
      </div>
    `;

    this.updateHeader();
  }

  startTraining() {
    window.expeditionEngine.trainingGameIndex = 0;
    this.renderTrainingGame();
  }

  renderTrainingGame() {
    const gameIdx = window.expeditionEngine.trainingGameIndex;
    switch (gameIdx) {
      case 0: this.renderGame1_LookFind(); break;
      case 1: this.renderGame2_MatchWord(); break;
      case 2: this.renderGame3_WhatAmI(); break;
      case 3: this.renderGame4_VisualMemory(); break;
      case 4: this.renderGame5_Backpack(); break;
      case 5: this.renderGame6_WhichOne(); break;
      case 6: this.renderGame7_UseTheWord(); break;
      default: this.showTrainingReady(); break;
    }
  }

  renderTrainingNav(activeIdx) {
    return `
      <div class="training-nav-pill-row">
        ${[1, 2, 3, 4, 5, 6, 7].map((num, i) => `
          <div class="training-step-dot ${i === activeIdx ? 'active-step' : (i < activeIdx ? 'completed-step' : '')}"
               onclick="expeditionUI.jumpToTrainingGame(${i})">
            ${i < activeIdx ? '✓' : num}
          </div>
        `).join("")}
      </div>
    `;
  }

  jumpToTrainingGame(idx) {
    window.expeditionEngine.trainingGameIndex = idx;
    this.renderTrainingGame();
  }

  // =========================================================================
  // MINI-GAME 1: LOOK & FIND
  // =========================================================================
  renderGame1_LookFind() {
    const data = EXPEDITION_TRAINING_DATA.lookAndFind;
    const targetIdx = window.expeditionEngine.lookFindIndex;
    const target = data.targets[targetIdx];

    const container = document.getElementById("expedition-main-view");
    if (!container) return;

    container.innerHTML = `
      <div class="expedition-master-viewport">
        ${this.renderTrainingHeader(data.title)}
        ${this.renderTrainingNav(0)}

        <div class="adventure-card" style="max-width: 1000px; padding: 18px; text-align: center;">
          <!-- Target Prompt Banner -->
          <div class="alarm-banner" style="background: #eff6ff; border-color: #3b82f6; color: #1e3a8a; max-width: 800px; margin: 0 auto 14px;">
            <span style="font-size: 2rem;">🔎</span>
            <span style="font-family: 'Bungee', cursive; font-size: 1.4rem;">
              FIND THE <span style="color: #dc2626;">${target.label}</span> ON THE MAP!
            </span>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${target.spoken}')">🔊</button>
          </div>

          <!-- Interactive Island Map with Clickable Hot Zones -->
          <div style="width: 100%; max-width: 900px; height: 360px; margin: 0 auto; border-radius: 14px; overflow: hidden; border: 4px solid #1e293b;">
            ${EXPEDITION_SVG.getTrainingIslandSvg()}
          </div>

          <div id="training-feedback-area" style="margin-top: 14px;"></div>
        </div>
      </div>
    `;

    if (window.soundEngine) window.soundEngine.speak(target.spoken);
  }

  handleTrainingIslandClick(clickedId) {
    const data = EXPEDITION_TRAINING_DATA.lookAndFind;
    const targetIdx = window.expeditionEngine.lookFindIndex;
    const target = data.targets[targetIdx];
    const feedback = document.getElementById("training-feedback-area");

    if (clickedId === target.id) {
      window.expeditionEngine.addScore("training", 1);
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(`Correct! ${target.label}!`);
      }

      if (targetIdx < data.targets.length - 1) {
        window.expeditionEngine.lookFindIndex++;
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 CORRECT! ${target.label} (+1 Star ⭐)</div>
            <button class="jumbo-btn btn-emerald" style="padding: 8px 18px; font-size: 1rem;" onclick="expeditionUI.renderGame1_LookFind()">
              NEXT TARGET ➔
            </button>
          </div>
        `;
      } else {
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 GAME 1 COMPLETE! You found all landmarks! (+1 Star ⭐)</div>
            <button class="jumbo-btn btn-gold" style="padding: 10px 22px; font-size: 1.1rem;" onclick="expeditionUI.jumpToTrainingGame(1)">
              GAME 2: MATCH THE WORD ➔
            </button>
          </div>
        `;
      }
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Look again for ${target.label}!</div></div>`;
    }
  }

  // =========================================================================
  // MINI-GAME 2: MATCH THE WORD
  // =========================================================================
  renderGame2_MatchWord() {
    const data = EXPEDITION_TRAINING_DATA.matchWord;
    const roundIdx = window.expeditionEngine.matchWordIndex;
    const round = data.rounds[roundIdx];

    const container = document.getElementById("expedition-main-view");
    if (!container) return;

    container.innerHTML = `
      <div class="expedition-master-viewport">
        ${this.renderTrainingHeader(data.title)}
        ${this.renderTrainingNav(1)}

        <div class="adventure-card" style="max-width: 900px; padding: 20px; text-align: center;">
          <div style="font-size: 1.1rem; font-weight: 800; color: #64748b; margin-bottom: 6px;">ROUND ${roundIdx + 1} OF ${data.rounds.length}</div>
          <div class="question-spotlight-box" style="margin-bottom: 18px;">
            <span class="card-tag">MATCH THE WORD</span>
            <div class="spotlight-question-text" style="font-size: 2.2rem; color: #1e3a8a;">
              ${round.word}
            </div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${round.spoken}')">🔊</button>
          </div>

          <div class="visual-choices-grid" style="margin: 0 auto 16px;">
            ${round.options.map(opt => `
              <div class="visual-choice-card" id="match-opt-${opt.id}" onclick="expeditionUI.handleMatchWordChoice('${opt.id}')">
                <div class="choice-icon-hero">${opt.icon}</div>
                <div class="choice-label-main">${opt.text}</div>
              </div>
            `).join("")}
          </div>

          <div id="training-feedback-area"></div>
        </div>
      </div>
    `;

    if (window.soundEngine) window.soundEngine.speak(round.spoken);
  }

  handleMatchWordChoice(chosenId) {
    const data = EXPEDITION_TRAINING_DATA.matchWord;
    const roundIdx = window.expeditionEngine.matchWordIndex;
    const round = data.rounds[roundIdx];
    const feedback = document.getElementById("training-feedback-area");

    if (chosenId === round.correctId) {
      window.expeditionEngine.addScore("training", 1);
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(`Great match! ${round.word}`);
      }

      if (roundIdx < data.rounds.length - 1) {
        window.expeditionEngine.matchWordIndex++;
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 CORRECT! (+1 Star ⭐)</div>
            <button class="jumbo-btn btn-emerald" style="padding: 8px 18px; font-size: 1rem;" onclick="expeditionUI.renderGame2_MatchWord()">
              NEXT WORD ➔
            </button>
          </div>
        `;
      } else {
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 GAME 2 COMPLETE! (+1 Star ⭐)</div>
            <button class="jumbo-btn btn-gold" style="padding: 10px 22px; font-size: 1.1rem;" onclick="expeditionUI.jumpToTrainingGame(2)">
              GAME 3: WHAT AM I? ➔
            </button>
          </div>
        `;
      }
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Try again! Look at the word ${round.word}!</div></div>`;
    }
  }

  // =========================================================================
  // MINI-GAME 3: WHAT AM I? (SHORT RIDDLES)
  // =========================================================================
  renderGame3_WhatAmI() {
    const data = EXPEDITION_TRAINING_DATA.whatAmI;
    const idx = window.expeditionEngine.whatAmIIndex;
    const item = data.riddles[idx];

    const container = document.getElementById("expedition-main-view");
    if (!container) return;

    container.innerHTML = `
      <div class="expedition-master-viewport">
        ${this.renderTrainingHeader(data.title)}
        ${this.renderTrainingNav(2)}

        <div class="adventure-card" style="max-width: 900px; padding: 20px; text-align: center;">
          <div style="font-size: 1.1rem; font-weight: 800; color: #64748b; margin-bottom: 6px;">RIDDLE ${idx + 1} OF ${data.riddles.length}</div>
          <div class="question-spotlight-box" style="margin-bottom: 18px;">
            <span class="card-tag">WHAT AM I?</span>
            <div class="spotlight-question-text" style="font-size: 1.6rem; color: #1e293b;">
              “${item.clue}”
            </div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${item.spoken}')">🔊</button>
          </div>

          <div class="visual-choices-grid" style="margin: 0 auto 16px;">
            ${item.options.map(opt => `
              <div class="visual-choice-card" id="riddle-opt-${opt.id}" onclick="expeditionUI.handleWhatAmIChoice('${opt.id}')">
                <div class="choice-icon-hero">${opt.icon}</div>
                <div class="choice-label-main">${opt.text}</div>
              </div>
            `).join("")}
          </div>

          <div id="training-feedback-area"></div>
        </div>
      </div>
    `;

    if (window.soundEngine) window.soundEngine.speak(item.spoken);
  }

  handleWhatAmIChoice(chosenId) {
    const data = EXPEDITION_TRAINING_DATA.whatAmI;
    const idx = window.expeditionEngine.whatAmIIndex;
    const item = data.riddles[idx];
    const feedback = document.getElementById("training-feedback-area");

    if (chosenId === item.correct) {
      window.expeditionEngine.addScore("training", 1);
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(`Yes! That is right!`);
      }

      if (idx < data.riddles.length - 1) {
        window.expeditionEngine.whatAmIIndex++;
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 CORRECT! (+1 Star ⭐)</div>
            <button class="jumbo-btn btn-emerald" style="padding: 8px 18px; font-size: 1rem;" onclick="expeditionUI.renderGame3_WhatAmI()">
              NEXT RIDDLE ➔
            </button>
          </div>
        `;
      } else {
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 GAME 3 COMPLETE! (+1 Star ⭐)</div>
            <button class="jumbo-btn btn-gold" style="padding: 10px 22px; font-size: 1.1rem;" onclick="expeditionUI.jumpToTrainingGame(3)">
              GAME 4: 8-SECOND MEMORY ➔
            </button>
          </div>
        `;
      }
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Try again! Read the clue carefully!</div></div>`;
    }
  }

  // =========================================================================
  // MINI-GAME 4: 8-SECOND VISUAL MEMORY
  // =========================================================================
  renderGame4_VisualMemory() {
    const data = EXPEDITION_TRAINING_DATA.visualMemory;
    window.expeditionEngine.memoryState = "countdown";
    window.expeditionEngine.selectedMemoryItems = [];

    const container = document.getElementById("expedition-main-view");
    if (!container) return;

    container.innerHTML = `
      <div class="expedition-master-viewport">
        ${this.renderTrainingHeader(data.title)}
        ${this.renderTrainingNav(3)}

        <div class="adventure-card" style="max-width: 900px; padding: 20px; text-align: center;" id="memory-stage-box">
          <div class="training-memory-timer" id="mem-countdown-pill">
            ⏱️ REMEMBER THE 6 OBJECTS: <span id="mem-sec-left">8</span>s
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 16px 0;" id="mem-cards-grid">
            ${data.targetItems.map(item => `
              <div class="visual-choice-card" style="cursor: default;">
                <div class="choice-icon-hero">${item.icon}</div>
                <div class="choice-label-main">${item.text}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    let seconds = data.displayTime;
    if (this.memoryTimerInterval) clearInterval(this.memoryTimerInterval);

    this.memoryTimerInterval = setInterval(() => {
      seconds--;
      const secEl = document.getElementById("mem-sec-left");
      if (secEl) secEl.textContent = seconds;

      if (seconds <= 0) {
        clearInterval(this.memoryTimerInterval);
        this.renderGame4_MemoryQuestion();
      }
    }, 1000);
  }

  renderGame4_MemoryQuestion() {
    const data = EXPEDITION_TRAINING_DATA.visualMemory;
    window.expeditionEngine.memoryState = "guessing";
    const stage = document.getElementById("memory-stage-box");
    if (!stage) return;

    if (window.soundEngine) window.soundEngine.speak("What did you see? Click the six objects you remember!");

    stage.innerHTML = `
      <div class="alarm-banner" style="background: #eff6ff; border-color: #3b82f6; color: #1e3a8a; margin-bottom: 14px;">
        <span style="font-size: 2rem;">🧠</span>
        <span style="font-family: 'Bungee', cursive; font-size: 1.3rem;">WHAT DID YOU SEE? SELECT THE 6 OBJECTS!</span>
      </div>

      <div class="visual-choices-grid" style="grid-template-columns: repeat(4, 1fr); gap: 10px;">
        ${data.allItems.map(item => `
          <div class="visual-choice-card" id="mem-guess-${item.id}" onclick="expeditionUI.handleMemoryGuess('${item.id}')">
            <div class="choice-icon-hero" style="font-size: 2.8rem;">${item.icon}</div>
            <div class="choice-label-main" style="font-size: 1rem;">${item.text}</div>
          </div>
        `).join("")}
      </div>

      <div id="training-feedback-area" style="margin-top: 14px;"></div>
    `;
  }

  handleMemoryGuess(itemId) {
    const data = EXPEDITION_TRAINING_DATA.visualMemory;
    const item = data.allItems.find(i => i.id === itemId);
    const sel = window.expeditionEngine.selectedMemoryItems;
    const card = document.getElementById(`mem-guess-${itemId}`);
    const feedback = document.getElementById("training-feedback-area");

    if (sel.includes(itemId)) return;

    if (item.isTarget) {
      sel.push(itemId);
      if (card) card.classList.add("selected-choice");
      if (window.soundEngine) window.soundEngine.playCorrect();

      if (sel.length === 6) {
        window.expeditionEngine.addScore("training", 2);
        if (window.soundEngine) {
          window.soundEngine.playFanfare();
          window.soundEngine.speak("Great memory! You remembered all six objects!");
        }

        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 EXCELLENT MEMORY! (+2 Stars ⭐)</div>
            <button class="jumbo-btn btn-gold" style="padding: 10px 22px; font-size: 1.1rem;" onclick="expeditionUI.jumpToTrainingGame(4)">
              GAME 5: PACK THE BACKPACK ➔
            </button>
          </div>
        `;
      }
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Oops! ${item.text} was not in the 6 objects!</div></div>`;
    }
  }

  // =========================================================================
  // MINI-GAME 5: THE EXPLORER'S BACKPACK
  // =========================================================================
  renderGame5_Backpack() {
    const data = EXPEDITION_TRAINING_DATA.backpack;
    const packed = window.expeditionEngine.packedItems;

    const container = document.getElementById("expedition-main-view");
    if (!container) return;

    const packedIcons = packed.map(id => {
      const it = data.items.find(i => i.id === id);
      return it ? it.icon : "";
    });

    container.innerHTML = `
      <div class="expedition-master-viewport">
        ${this.renderTrainingHeader(data.title)}
        ${this.renderTrainingNav(4)}

        <div class="adventure-card" style="max-width: 1000px; padding: 20px; text-align: center;">
          <div class="alarm-banner" style="background: #fef3c7; border-color: #f59e0b; color: #78350f; margin-bottom: 14px;">
            <span style="font-size: 2rem;">🎒</span>
            <span style="font-family: 'Bungee', cursive; font-size: 1.25rem;">
              WHAT DOES AN EXPLORER NEED? PACK 4 USEFUL ITEMS (${packed.length}/4)!
            </span>
          </div>

          <div class="backpack-stage-container">
            <!-- Backpack Visual Graphic -->
            <div>
              ${EXPEDITION_SVG.getBackpackSvg(packedIcons)}
            </div>

            <!-- Items Choice Grid -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; flex: 1;">
              ${data.items.map(it => {
                const isPacked = packed.includes(it.id);
                return `
                  <div class="visual-choice-card ${isPacked ? 'packed-item' : ''}" onclick="expeditionUI.handlePackItem('${it.id}')">
                    <div class="choice-icon-hero" style="font-size: 2.8rem;">${it.icon}</div>
                    <div class="choice-label-main" style="font-size: 0.95rem;">${it.text}</div>
                    <div style="font-size: 0.8rem; font-weight: 800; color: ${isPacked ? '#059669' : '#64748b'};">
                      ${isPacked ? 'PACKED ✅' : '+ PACK'}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <div id="training-feedback-area"></div>
        </div>
      </div>
    `;

    if (window.soundEngine && packed.length === 0) window.soundEngine.speak(data.spoken);
  }

  handlePackItem(itemId) {
    const data = EXPEDITION_TRAINING_DATA.backpack;
    const item = data.items.find(i => i.id === itemId);
    const packed = window.expeditionEngine.packedItems;
    const feedback = document.getElementById("training-feedback-area");

    if (packed.includes(itemId)) {
      window.expeditionEngine.packedItems = packed.filter(id => id !== itemId);
      this.renderGame5_Backpack();
      return;
    }

    if (!item.isNeeded) {
      if (window.soundEngine) window.soundEngine.playWrong();
      feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">${item.text}: ${item.reason}</div></div>`;
      return;
    }

    if (packed.length < 4) {
      packed.push(itemId);
      if (window.soundEngine) window.soundEngine.playCorrect();
      this.renderGame5_Backpack();

      if (packed.length === 4) {
        window.expeditionEngine.addScore("training", 2);
        if (window.soundEngine) {
          window.soundEngine.playFanfare();
          window.soundEngine.speak("Backpack packed! You have Compass, Map, Flashlight, and Water!");
        }

        const fb = document.getElementById("training-feedback-area");
        if (fb) {
          fb.innerHTML = `
            <div class="feedback-box">
              <div class="feedback-text">🎒 BACKPACK PACKED! (+2 Stars ⭐)</div>
              <button class="jumbo-btn btn-gold" style="padding: 10px 22px; font-size: 1.1rem;" onclick="expeditionUI.jumpToTrainingGame(5)">
                GAME 6: WHICH ONE? ➔
              </button>
            </div>
          `;
        }
      }
    }
  }

  // =========================================================================
  // MINI-GAME 6: WHICH ONE?
  // =========================================================================
  renderGame6_WhichOne() {
    const data = EXPEDITION_TRAINING_DATA.whichOne;
    const qIdx = window.expeditionEngine.whichOneIndex;
    const q = data.questions[qIdx];

    const container = document.getElementById("expedition-main-view");
    if (!container) return;

    container.innerHTML = `
      <div class="expedition-master-viewport">
        ${this.renderTrainingHeader(data.title)}
        ${this.renderTrainingNav(5)}

        <div class="adventure-card" style="max-width: 900px; padding: 20px; text-align: center;">
          <div style="font-size: 1.1rem; font-weight: 800; color: #64748b; margin-bottom: 6px;">QUESTION ${qIdx + 1} OF ${data.questions.length}</div>
          <div class="question-spotlight-box" style="margin-bottom: 18px;">
            <span class="card-tag">WHICH ONE?</span>
            <div class="spotlight-question-text" style="font-size: 1.8rem; color: #1e3a8a;">
              ${q.prompt}
            </div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${q.spoken}')">🔊</button>
          </div>

          <div class="visual-choices-grid" style="margin: 0 auto 16px;">
            ${q.options.map(opt => `
              <div class="visual-choice-card" id="which-opt-${opt.id}" onclick="expeditionUI.handleWhichOneChoice('${opt.id}')">
                <div class="choice-icon-hero">${opt.icon}</div>
                <div class="choice-label-main">${opt.text}</div>
              </div>
            `).join("")}
          </div>

          <div id="training-feedback-area"></div>
        </div>
      </div>
    `;

    if (window.soundEngine) window.soundEngine.speak(q.spoken);
  }

  handleWhichOneChoice(chosenId) {
    const data = EXPEDITION_TRAINING_DATA.whichOne;
    const qIdx = window.expeditionEngine.whichOneIndex;
    const q = data.questions[qIdx];
    const feedback = document.getElementById("training-feedback-area");

    if (chosenId === q.correctId) {
      window.expeditionEngine.addScore("training", 1);
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak("Correct visual identification!");
      }

      if (qIdx < data.questions.length - 1) {
        window.expeditionEngine.whichOneIndex++;
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 CORRECT! (+1 Star ⭐)</div>
            <button class="jumbo-btn btn-emerald" style="padding: 8px 18px; font-size: 1rem;" onclick="expeditionUI.renderGame6_WhichOne()">
              NEXT QUESTION ➔
            </button>
          </div>
        `;
      } else {
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 GAME 6 COMPLETE! (+1 Star ⭐)</div>
            <button class="jumbo-btn btn-gold" style="padding: 10px 22px; font-size: 1.1rem;" onclick="expeditionUI.jumpToTrainingGame(6)">
              GAME 7: USE THE WORD ➔
            </button>
          </div>
        `;
      }
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Look closely at the pictures!</div></div>`;
    }
  }

  // =========================================================================
  // MINI-GAME 7: USE THE WORD & PREDICT
  // =========================================================================
  renderGame7_UseTheWord() {
    const data = EXPEDITION_TRAINING_DATA.useTheWord;
    const cIdx = window.expeditionEngine.useWordIndex;
    const ch = data.challenges[cIdx];

    const container = document.getElementById("expedition-main-view");
    if (!container) return;

    container.innerHTML = `
      <div class="expedition-master-viewport">
        ${this.renderTrainingHeader(data.title)}
        ${this.renderTrainingNav(6)}

        <div class="adventure-card" style="max-width: 900px; padding: 20px; text-align: center;">
          <div style="font-size: 1.1rem; font-weight: 800; color: #64748b; margin-bottom: 6px;">PREDICTION ${cIdx + 1} OF ${data.challenges.length}</div>
          <div class="question-spotlight-box" style="margin-bottom: 18px;">
            <div style="font-size: 3rem; margin-bottom: 8px;">${ch.icons}</div>
            <span class="card-tag">CAUSE & EFFECT PREDICTION</span>
            <div class="spotlight-question-text" style="font-size: 1.6rem; color: #1e3a8a;">
              “${ch.prompt}”
            </div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${ch.spoken}')">🔊</button>
          </div>

          <div class="visual-choices-grid" style="margin: 0 auto 16px;">
            ${ch.options.map(opt => `
              <div class="visual-choice-card" id="use-opt-${opt.id}" onclick="expeditionUI.handleUseWordChoice('${opt.id}')">
                <div class="choice-icon-hero">${opt.icon}</div>
                <div class="choice-label-main">${opt.text}</div>
              </div>
            `).join("")}
          </div>

          <div id="training-feedback-area"></div>
        </div>
      </div>
    `;

    if (window.soundEngine) window.soundEngine.speak(ch.spoken);
  }

  handleUseWordChoice(chosenId) {
    const data = EXPEDITION_TRAINING_DATA.useTheWord;
    const cIdx = window.expeditionEngine.useWordIndex;
    const ch = data.challenges[cIdx];
    const feedback = document.getElementById("training-feedback-area");

    if (chosenId === ch.correctId) {
      window.expeditionEngine.addScore("training", 2);
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak("Great reasoning and prediction!");
      }

      if (cIdx < data.challenges.length - 1) {
        window.expeditionEngine.useWordIndex++;
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 PREDICTION CORRECT! (+2 Stars ⭐)</div>
            <button class="jumbo-btn btn-emerald" style="padding: 8px 18px; font-size: 1rem;" onclick="expeditionUI.renderGame7_UseTheWord()">
              NEXT PREDICTION ➔
            </button>
          </div>
        `;
      } else {
        feedback.innerHTML = `
          <div class="feedback-box">
            <div class="feedback-text">🎉 ALL 7 TRAINING MINI-GAMES COMPLETE! (+2 Stars ⭐)</div>
            <button class="jumbo-btn btn-gold" style="padding: 10px 22px; font-size: 1.15rem;" onclick="expeditionUI.showTrainingReady()">
              EXPEDITION READY 🎒 ➔
            </button>
          </div>
        `;
      }
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Think about cause and effect!</div></div>`;
    }
  }

  // =========================================================================
  // TRANSITION: EXPEDITION READY!
  // =========================================================================
  showTrainingReady() {
    const container = document.getElementById("expedition-main-view");
    if (!container) return;

    if (window.uiController) window.uiController.triggerConfetti(4000);
    if (window.soundEngine) {
      window.soundEngine.playFanfare();
      window.soundEngine.speak("Expedition Ready! You know the words. You know the map. Now let's begin the expedition!");
    }

    container.innerHTML = `
      <div class="expedition-master-viewport">
        <div class="adventure-card" style="max-width: 1000px; padding: 26px; text-align: center;">
          <div class="card-header-banner">
            <span class="card-tag" style="background: #fef08a; color: #854d0e;">✨ TRAINING COMPLETE</span>
            <h1 class="main-heading" style="color: #059669; font-size: 2.6rem;">🎒 EXPEDITION READY!</h1>
            <p class="sub-heading" style="font-size: 1.35rem;">
              You know the words. You know the map. Now let's begin the mission!
            </p>
          </div>

          <div style="font-size: 5rem; margin: 18px 0; animation: bounce-success 1s infinite alternate;">
            🧭 🗺️ 🔦 🧃 🌋 🌧️
          </div>

          <div style="background: #ecfdf5; border: 3px solid #10b981; border-radius: var(--radius-lg); padding: 16px; max-width: 700px; margin: 0 auto 24px;">
            <div style="font-family: 'Bungee', cursive; color: #065f46; font-size: 1.2rem; margin-bottom: 8px;">
              🎯 MISSION: REACH STATION ALPHA BEFORE THE STORM!
            </div>
            <p style="font-weight: 800; color: #047857; font-size: 1.1rem;">
              Use what you learned in training to make good predictions with evidence!
            </p>
          </div>

          <button class="jumbo-btn btn-gold" style="font-size: 1.5rem; padding: 18px 48px;" onclick="expeditionUI.startMainStory()">
            START THE LAST EXPEDITION 🧭 ➔
          </button>
        </div>
      </div>
    `;
  }

  startMainStory() {
    window.expeditionEngine.startMainStory();
    this.showScene(0);
  }

  renderTrainingHeader(title) {
    return `
      <div class="expedition-status-bar">
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="jumbo-btn btn-ocean" style="padding: 6px 14px; font-size: 0.85rem;" onclick="expeditionUI.showTrainingIntro()">
            🎒 TRAINING MENU
          </button>
          <div style="font-family: 'Bungee', cursive; font-size: 1.1rem; color: #1e293b;">
            ${title}
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="storm-timer-pill" style="background: #e0f2fe; border-color: #0284c7; color: #0369a1;">
            <span>🎒</span> <strong>TRAINING</strong>
          </div>
          <div style="font-family: 'Bungee', cursive; color: #d97706; font-size: 1.15rem;">
            ⭐ <span id="expedition-score-val">${window.expeditionEngine.scores.total}</span>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // MAIN STORY SCENES RENDERER (10 SEQUENTIAL SCENES)
  // =========================================================================

  showScene(sceneIndex = null) {
    if (sceneIndex !== null) {
      window.expeditionEngine.currentSceneIndex = sceneIndex;
    }
    window.expeditionEngine.mode = "story";

    this.selectedChoiceId = null;
    const container = document.getElementById("expedition-main-view");
    if (!container) return;

    const scene = window.expeditionEngine.getCurrentScene();
    const explorers = EXPEDITION_DATA.explorers;

    container.innerHTML = `
      <div class="expedition-master-viewport">
        <!-- Top Status Bar -->
        <div class="expedition-status-bar">
          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="jumbo-btn btn-ocean" style="padding: 6px 14px; font-size: 0.85rem;" onclick="uiController.showScreen('hub')">
              🏠 MAIN MENU
            </button>
            <div style="font-family: 'Bungee', cursive; font-size: 1.1rem; color: #1e293b;">
              🧭 ${scene.title}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="storm-timer-pill">
              <span>⛈️ STORM IN:</span>
              <strong id="storm-time-val">${scene.stormMinutesLeft} MIN</strong>
            </div>
            <div style="font-family: 'Bungee', cursive; color: #d97706; font-size: 1.15rem;">
              ⭐ <span id="expedition-score-val">${window.expeditionEngine.scores.total}</span>
            </div>
          </div>
        </div>

        <!-- Permanent Sentence Starters Bar -->
        <div class="sentence-starters-bar">
          <button class="starter-chip" onclick="soundEngine.speak('I think...')">💭 I think...</button>
          <button class="starter-chip" onclick="soundEngine.speak('...will...')">🔮 ...will...</button>
          <button class="starter-chip" onclick="soundEngine.speak('...might...')">🤔 ...might...</button>
          <button class="starter-chip" onclick="soundEngine.speak('...because...')">🔎 because...</button>
          <button class="starter-chip" onclick="soundEngine.speak('They should...')">🧭 They should...</button>
          <button class="starter-chip" onclick="soundEngine.speak('I agree!')">👍 I agree</button>
          <button class="starter-chip" onclick="soundEngine.speak('I do not agree!')">👎 I don't agree</button>
        </div>

        <!-- 4 Explorers Roster Bar -->
        <div class="explorers-strip-row">
          ${explorers.map(exp => `
            <div class="explorer-mini-card" onclick="soundEngine.speak('${exp.name}: ${exp.quote}')" style="cursor: pointer;" title="Click to hear ${exp.name}">
              ${EXPEDITION_SVG.getExplorerAvatarSvg(exp.avatarClass, 42)}
              <div>
                <div class="explorer-mini-name">${exp.name}</div>
                <div class="explorer-mini-role">${exp.trait}</div>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Scene Content Body -->
        <div class="adventure-card" style="max-width: 1200px; padding: 18px;">
          ${this.renderSceneBody(scene)}
        </div>
      </div>
    `;

    this.updateHeader();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  renderSceneBody(scene) {
    switch (scene.sceneNum) {
      case 1: return this.renderScene1(scene);
      case 2: return this.renderScene2(scene);
      case 3: return this.renderScene3(scene);
      case 4: return this.renderScene4(scene);
      case 5: return this.renderScene5(scene);
      case 6: return this.renderScene6(scene);
      case 7: return this.renderScene7(scene);
      case 8: return this.renderScene8(scene);
      case 9: return this.renderScene9(scene);
      case 10: return this.renderScene10(scene);
      default: return this.renderScene1(scene);
    }
  }

  // Scene 1: The Dark Clouds
  renderScene1(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px;">
        <div class="visual-story-box">
          ${scene.shortLines.map(line => `
            <div class="story-line-item">
              <span>${line}</span>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${line.replace(/[^\w\s]/gi, '')}')">🔊</button>
            </div>
          `).join("")}
        </div>

        <div style="width: 100%; max-width: 900px; height: 320px; border-radius: 14px; overflow: hidden; border: 4px solid #1e293b;">
          ${EXPEDITION_SVG.getIslandMapSvg(1)}
        </div>

        <div class="discussion-simple-banner">
          <div style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #78350f;">
            🔮 WHAT WILL HAPPEN NEXT?
          </div>
          <div class="sentence-builder-display">
            🗣️ “I think <span style="color: #2563eb;">rain</span> will <span style="color: #2563eb;">start</span> because <span style="color: #2563eb;">dark clouds 🌥️</span>.”
          </div>
        </div>

        <div class="visual-choices-grid">
          ${scene.predictionOptions.map(opt => `
            <div class="visual-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectChoice('${opt.id}')">
              <div class="choice-icon-hero">${opt.icon}</div>
              <div class="choice-label-main">${opt.text}</div>
              <div class="choice-sub-clue">${opt.clue}</div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-gold" style="font-size: 1.3rem; padding: 12px 36px;" onclick="expeditionUI.submitScene1()">
          CONFIRM PREDICTION ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%; max-width: 900px;"></div>
      </div>
    `;
  }

  // Scene 2: The Storm Begins
  renderScene2(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px;">
        <div class="visual-story-box" style="border-color: #2563eb;">
          ${scene.shortLines.map(line => `
            <div class="story-line-item">
              <span>${line}</span>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${line.replace(/[^\w\s]/gi, '')}')">🔊</button>
            </div>
          `).join("")}
        </div>

        <div class="clil-visual-pill">
          <span style="font-size: 2.2rem;">🕳️</span>
          <div>
            <strong style="font-family: 'Bungee', cursive; color: #15803d; font-size: 1.1rem;">CLIL: ${scene.clilBadge.word}</strong>
            <div style="font-size: 1.1rem; font-weight: 800; color: #1e293b;">${scene.clilBadge.shortDef}</div>
          </div>
        </div>

        <div style="width: 100%; max-width: 900px; height: 320px; border-radius: 14px; overflow: hidden; border: 4px solid #1e293b;">
          ${EXPEDITION_SVG.getIslandMapSvg(2)}
        </div>

        <div class="discussion-simple-banner">
          <div style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #78350f;">
            🧭 WHERE SHOULD THEY GO?
          </div>
          <div class="sentence-builder-display">
            🗣️ “They should go to <span style="color: #2563eb;">the cave 🕳️</span> because <span style="color: #2563eb;">it is dry</span>.”
          </div>
        </div>

        <div class="visual-choices-grid">
          ${scene.decisionOptions.map(opt => `
            <div class="visual-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectChoice('${opt.id}')">
              <div class="choice-icon-hero">${opt.icon}</div>
              <div class="choice-label-main">${opt.text}</div>
              <div class="choice-sub-clue">${opt.reason}</div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-emerald" style="font-size: 1.3rem; padding: 12px 36px;" onclick="expeditionUI.submitScene2()">
          ENTER CAVE ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%; max-width: 900px;"></div>
      </div>
    `;
  }

  // Scene 3: Cave Riddle & Compass
  renderScene3(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 900px; margin: 0 auto;">
        <div class="visual-story-box" style="border-color: #ca8a04;">
          ${scene.shortLines.map(line => `
            <div class="story-line-item">
              <span>${line}</span>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${line.replace(/[^\w\s]/gi, '')}')">🔊</button>
            </div>
          `).join("")}
        </div>

        <div class="question-spotlight-box" style="width: 100%; border-color: #eab308; text-align: center;">
          <span class="card-tag" style="background: #ca8a04; color: #fff;">SHORT RIDDLE</span>
          <div class="spotlight-question-text" style="font-size: 1.6rem; white-space: pre-line; margin: 10px 0;">
            "${scene.riddle.text}"
          </div>
          <button class="speak-icon-btn" onclick="soundEngine.speak('${scene.riddle.spoken}')">🔊 Listen</button>
        </div>

        <div class="visual-choices-grid" style="width: 100%;">
          <div class="visual-choice-card" id="riddle-opt-compass" onclick="expeditionUI.selectRiddleChoice('compass')">
            <div class="choice-icon-hero">🧭</div>
            <div class="choice-label-main">COMPASS</div>
            <div class="choice-sub-clue">Points North (⬆️), South, East, West</div>
          </div>
          <div class="visual-choice-card" id="riddle-opt-clock" onclick="expeditionUI.selectRiddleChoice('clock')">
            <div class="choice-icon-hero">⏰</div>
            <div class="choice-label-main">CLOCK</div>
            <div class="choice-sub-clue">Shows time, not directions</div>
          </div>
          <div class="visual-choice-card" id="riddle-opt-shoe" onclick="expeditionUI.selectRiddleChoice('shoe')">
            <div class="choice-icon-hero">👟</div>
            <div class="choice-label-main">SHOE</div>
            <div class="choice-sub-clue">Used for walking</div>
          </div>
        </div>

        <button class="jumbo-btn btn-gold" style="font-size: 1.3rem; padding: 12px 36px;" onclick="expeditionUI.submitScene3Choice()">
          UNLOCK COMPASS 🧭 ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 4: High River & Flood Diagram
  renderScene4(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 900px; margin: 0 auto;">
        <div class="visual-story-box" style="border-color: #0284c7;">
          ${scene.shortLines.map(line => `
            <div class="story-line-item">
              <span>${line}</span>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${line.replace(/[^\w\s]/gi, '')}')">🔊</button>
            </div>
          `).join("")}
        </div>

        <div style="width: 100%;">
          ${EXPEDITION_SVG.getHydrologyDiagramSvg()}
        </div>

        <div class="discussion-simple-banner">
          <div style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #1e40af;">
            🔮 WHAT WILL HAPPEN TO THE RIVER?
          </div>
          <div class="sentence-builder-display">
            🗣️ “The river will <span style="color: #2563eb;">rise and flood 🌊</span> because <span style="color: #2563eb;">it is raining heavily 🌧️</span>.”
          </div>
        </div>

        <div class="visual-choices-grid" style="width: 100%;">
          ${scene.predictionOptions.map(opt => `
            <div class="visual-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectChoice('${opt.id}')">
              <div class="choice-icon-hero">${opt.icon}</div>
              <div class="choice-label-main">${opt.text}</div>
              <div class="choice-sub-clue">${opt.reason}</div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-emerald" style="font-size: 1.3rem; padding: 12px 36px;" onclick="expeditionUI.submitScene4()">
          CONFIRM PREDICTION ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 5: Route Decision
  renderScene5(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 900px; margin: 0 auto;">
        <div class="visual-story-box" style="border-color: #f59e0b;">
          ${scene.shortLines.map(line => `
            <div class="story-line-item">
              <span>${line}</span>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${line.replace(/[^\w\s]/gi, '')}')">🔊</button>
            </div>
          `).join("")}
        </div>

        <div class="discussion-simple-banner">
          <div style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #78350f;">
            🧭 WHICH ROUTE IS SAFEST?
          </div>
          <div class="sentence-builder-display">
            🗣️ “They should choose <span style="color: #15803d;">Route B (Forest) 🌲</span> because <span style="color: #15803d;">it is high ground</span>.”
          </div>
        </div>

        <div class="visual-choices-grid" style="width: 100%;">
          ${scene.routes.map(r => `
            <div class="visual-choice-card" id="opt-pred-${r.id}" onclick="expeditionUI.selectChoice('${r.id}')">
              <div class="choice-icon-hero">${r.icon}</div>
              <div class="choice-label-main">${r.text}</div>
              <div class="choice-sub-clue" style="color: ${r.isSafe ? '#15803d' : '#b91c1c'}; font-weight: 900;">
                ${r.reason}
              </div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-emerald" style="font-size: 1.3rem; padding: 12px 36px;" onclick="expeditionUI.submitScene5()">
          TAKE ROUTE ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 6: Forest & Animal Habitat
  renderScene6(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 900px; margin: 0 auto;">
        <div class="visual-story-box" style="border-color: #16a34a;">
          ${scene.shortLines.map(line => `
            <div class="story-line-item">
              <span>${line}</span>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${line.replace(/[^\w\s]/gi, '')}')">🔊</button>
            </div>
          `).join("")}
        </div>

        <div class="clil-visual-pill">
          <span style="font-size: 2.2rem;">🐾</span>
          <div>
            <strong style="font-family: 'Bungee', cursive; color: #15803d; font-size: 1.1rem;">CLIL: ${scene.clilBadge.word}</strong>
            <div style="font-size: 1.1rem; font-weight: 800; color: #1e293b;">${scene.clilBadge.shortDef}</div>
          </div>
        </div>

        <div class="discussion-simple-banner">
          <div style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #15803d;">
            🐾 WHAT WILL THEY FIND NEARBY?
          </div>
          <div class="sentence-builder-display">
            🗣️ “I think they will find <span style="color: #15803d;">an animal 🐒</span> because <span style="color: #15803d;">tracks and berries 🐾</span>.”
          </div>
        </div>

        <div class="visual-choices-grid" style="width: 100%;">
          ${scene.predictionOptions.map(opt => `
            <div class="visual-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectChoice('${opt.id}')">
              <div class="choice-icon-hero">${opt.icon}</div>
              <div class="choice-label-main">${opt.text}</div>
              <div class="choice-sub-clue">${opt.reason}</div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-emerald" style="font-size: 1.3rem; padding: 12px 36px;" onclick="expeditionUI.submitScene6()">
          CONFIRM PREDICTION ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 7: Lost Compass & Sun Navigation
  renderScene7(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 900px; margin: 0 auto;">
        <div class="visual-story-box" style="border-color: #ef4444;">
          ${scene.shortLines.map(line => `
            <div class="story-line-item">
              <span>${line}</span>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${line.replace(/[^\w\s]/gi, '')}')">🔊</button>
            </div>
          `).join("")}
        </div>

        <div style="background: #fff; border: 3px solid #ca8a04; border-radius: var(--radius-lg); padding: 12px 18px; width: 100%; text-align: center;">
          <strong style="color: #b45309; font-size: 1.25rem;">${scene.natureFact}</strong>
        </div>

        <div class="discussion-simple-banner">
          <div style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #78350f;">
            🧭 HOW CAN WE FIND NORTH?
          </div>
          <div class="sentence-builder-display">
            🗣️ “We can look at <span style="color: #2563eb;">tree moss (North) 🌲</span> because <span style="color: #2563eb;">it grows on the cool side</span>.”
          </div>
        </div>

        <div class="visual-choices-grid" style="width: 100%;">
          ${scene.decisionOptions.map(opt => `
            <div class="visual-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectChoice('${opt.id}')">
              <div class="choice-icon-hero">${opt.icon}</div>
              <div class="choice-label-main">${opt.text}</div>
              <div class="choice-sub-clue">${opt.reason}</div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-emerald" style="font-size: 1.3rem; padding: 12px 36px;" onclick="expeditionUI.submitScene7()">
          FOLLOW NATURE ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 8: The Volcano & Magma vs Lava
  renderScene8(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 900px; margin: 0 auto;">
        <div class="visual-story-box" style="border-color: #dc2626;">
          ${scene.shortLines.map(line => `
            <div class="story-line-item">
              <span>${line}</span>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${line.replace(/[^\w\s]/gi, '')}')">🔊</button>
            </div>
          `).join("")}
        </div>

        <div style="width: 100%;">
          ${EXPEDITION_SVG.getVolcanoCrossSectionSvg()}
        </div>

        <div class="discussion-simple-banner">
          <div style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #991b1b;">
            🌋 WHAT MIGHT HAPPEN NEAR THE VOLCANO?
          </div>
          <div class="sentence-builder-display">
            🗣️ “The volcano might <span style="color: #dc2626;">release hot smoke 💨</span> because <span style="color: #dc2626;">magma is hot 🔥</span>.”
          </div>
        </div>

        <div class="visual-choices-grid" style="width: 100%;">
          ${scene.predictionOptions.map(opt => `
            <div class="visual-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectChoice('${opt.id}')">
              <div class="choice-icon-hero">${opt.icon}</div>
              <div class="choice-label-main">${opt.text}</div>
              <div class="choice-sub-clue">${opt.reason}</div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-emerald" style="font-size: 1.3rem; padding: 12px 36px;" onclick="expeditionUI.submitScene8()">
          CONFIRM PREDICTION ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 9: Secret Path & Memory Check
  renderScene9(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 900px; margin: 0 auto;">
        <div class="visual-story-box" style="border-color: #d97706;">
          ${scene.shortLines.map(line => `
            <div class="story-line-item">
              <span>${line}</span>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${line.replace(/[^\w\s]/gi, '')}')">🔊</button>
            </div>
          `).join("")}
        </div>

        <div class="question-spotlight-box" style="width: 100%; border-color: #dc2626; text-align: center;">
          <span class="card-tag" style="background: #fee2e2; color: #991b1b;">🧠 VISUAL MEMORY CHECK</span>
          <div class="spotlight-question-text" style="font-size: 1.5rem; margin: 10px 0;">
            "${scene.memoryCheck.question}"
          </div>
        </div>

        <div class="visual-choices-grid" style="width: 100%;">
          ${scene.memoryCheck.options.map((opt, i) => `
            <div class="visual-choice-card" id="mem-opt-${i}" onclick="expeditionUI.handleScene9Memory(${i})">
              <div class="choice-icon-hero">${opt.icon}</div>
              <div class="choice-label-main" style="font-size: 1.1rem;">${opt.text}</div>
            </div>
          `).join("")}
        </div>

        <div id="scene9-path-choice" style="display: none; width: 100%; flex-direction: column; align-items: center; gap: 12px;">
          <h3 style="font-family: 'Bungee', cursive; color: #1e293b; font-size: 1.3rem;">Which path is safe?</h3>
          <div class="visual-choices-grid" style="width: 100%;">
            ${scene.decisionOptions.map(opt => `
              <div class="visual-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectChoice('${opt.id}')">
                <div class="choice-icon-hero">${opt.icon}</div>
                <div class="choice-label-main">${opt.text}</div>
                <div class="choice-sub-clue">${opt.reason}</div>
              </div>
            `).join("")}
          </div>

          <button class="jumbo-btn btn-gold" style="font-size: 1.3rem; padding: 12px 36px;" onclick="expeditionUI.submitScene9()">
            REACH STATION ALPHA 🏛️ ➔
          </button>
        </div>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 10: Station Alpha!
  renderScene10(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 900px; margin: 0 auto;">
        <div class="visual-story-box" style="background: #1e293b; border-color: #38bdf8;">
          ${scene.shortLines.map(line => `
            <div class="story-line-item" style="color: #f8fafc;">
              <span>${line}</span>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${line.replace(/[^\w\s]/gi, '')}')">🔊</button>
            </div>
          `).join("")}
        </div>

        <div style="width: 100%; background: #fff; border: 4px solid #1e293b; border-radius: var(--radius-lg); padding: 18px;">
          <h3 style="font-family: 'Bungee', cursive; color: #0284c7; font-size: 1.3rem; margin-bottom: 12px; text-align: center;">
            🔐 STATION ALPHA: 4 CLUE KEYS
          </h3>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            ${scene.clueKeys.map(k => `
              <div style="background: #eff6ff; border: 3px solid #3b82f6; border-radius: 12px; padding: 12px; text-align: center;">
                <div style="font-size: 2.5rem;">${k.icon}</div>
                <div style="font-family: 'Bungee', cursive; font-size: 0.9rem; color: #1e40af;">${k.label}</div>
                <strong style="font-size: 1.2rem; color: #065f46;">${k.val}</strong>
              </div>
            `).join("")}
          </div>
        </div>

        <button class="jumbo-btn btn-gold" style="font-size: 1.4rem; padding: 16px 42px; margin-top: 10px;" onclick="expeditionUI.completeExpedition()">
          ⚡ UNLOCK STATION ALPHA & ENTER! 🏛️ ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // =========================================================================
  // STORY ACTIONS & HANDLERS
  // =========================================================================

  selectChoice(choiceId) {
    this.selectedChoiceId = choiceId;
    document.querySelectorAll(".visual-choice-card").forEach(c => {
      if (c.id.startsWith("opt-pred-")) c.classList.remove("selected-choice");
    });
    const card = document.getElementById(`opt-pred-${choiceId}`);
    if (card) card.classList.add("selected-choice");
    if (window.soundEngine) window.soundEngine.playClick();
  }

  selectRiddleChoice(choiceId) {
    this.selectedChoiceId = choiceId;
    document.querySelectorAll(".visual-choice-card").forEach(c => {
      if (c.id.startsWith("riddle-opt-")) c.classList.remove("selected-choice");
    });
    const card = document.getElementById(`riddle-opt-${choiceId}`);
    if (card) card.classList.add("selected-choice");
    if (window.soundEngine) window.soundEngine.playClick();
  }

  submitScene1() {
    const feedback = document.getElementById("scene-feedback-area");
    if (!this.selectedChoiceId) {
      if (feedback) feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Choose a picture card!</div></div>`;
      return;
    }

    const res = window.expeditionEngine.recordPrediction(this.selectedChoiceId, "Dark clouds");
    window.expeditionEngine.addScore("evidence", 2);
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Rain is starting! Dark clouds brought rain!");
    }

    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🎉 PREDICTION CORRECT! (+5 Stars ⭐)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(1)">
          SCENE 2: FIND SHELTER ➔
        </button>
      </div>
    `;
  }

  submitScene2() {
    const feedback = document.getElementById("scene-feedback-area");
    if (!this.selectedChoiceId) return;

    const res = window.expeditionEngine.recordPrediction(this.selectedChoiceId, "Cave is dry shelter");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("The cave is a safe, dry shelter! (+5 Stars)");
    }

    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🎉 SHELTER FOUND! (+${res.points} Stars ⭐)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(2)">
          SCENE 3: CAVE RIDDLE ➔
        </button>
      </div>
    `;
  }

  submitScene3Choice() {
    const feedback = document.getElementById("scene-feedback-area");
    if (this.selectedChoiceId === "compass") {
      window.expeditionEngine.addScore("clil", 3);
      this.updateHeader();
      if (window.soundEngine) {
        window.soundEngine.playFanfare();
        window.soundEngine.speak("Compass unlocked! North, South, East, West!");
      }

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">🧭 COMPASS UNLOCKED! (+3 Stars ⭐)</div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(3)">
            SCENE 4: THE RIVER ➔
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Try again! Look at the Compass 🧭!</div></div>`;
    }
  }

  submitScene4() {
    if (!this.selectedChoiceId) return;
    const res = window.expeditionEngine.recordPrediction(this.selectedChoiceId, "Heavy rain causes river flooding");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Hydrology prediction correct! The river is rising!");
    }

    const feedback = document.getElementById("scene-feedback-area");
    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🌊 SCIENCE PREDICTION VERIFIED! (+${res.points} Stars ⭐)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(4)">
          SCENE 5: WHICH WAY IS SAFE? ➔
        </button>
      </div>
    `;
  }

  submitScene5() {
    if (!this.selectedChoiceId) return;
    const res = window.expeditionEngine.recordPrediction(this.selectedChoiceId, "Forest path is safe from river flooding");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Forest trail chosen! High ground keeps the team safe!");
    }

    const feedback = document.getElementById("scene-feedback-area");
    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🌲 SAFE ROUTE CHOSEN! (+${res.points} Stars ⭐)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(5)">
          SCENE 6: FOREST HABITAT ➔
        </button>
      </div>
    `;
  }

  submitScene6() {
    if (!this.selectedChoiceId) return;
    const res = window.expeditionEngine.recordPrediction(this.selectedChoiceId, "Tracks and berries mean an animal habitat");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Habitat prediction correct! A small lemur lives here!");
    }

    const feedback = document.getElementById("scene-feedback-area");
    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🐾 HABITAT DISCOVERED! (+${res.points} Stars ⭐)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(6)">
          SCENE 7: LOST COMPASS ➔
        </button>
      </div>
    `;
  }

  submitScene7() {
    if (!this.selectedChoiceId) return;
    const res = window.expeditionEngine.recordPrediction(this.selectedChoiceId, "Sun and tree moss show North");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Natural navigation success! Tree moss points North!");
    }

    const feedback = document.getElementById("scene-feedback-area");
    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🧭 NATURAL NAVIGATION SUCCESS! (+${res.points} Stars ⭐)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(7)">
          SCENE 8: VOLCANO SIGNS ➔
        </button>
      </div>
    `;
  }

  submitScene8() {
    if (!this.selectedChoiceId) return;
    const res = window.expeditionEngine.recordPrediction(this.selectedChoiceId, "Hot magma under ground creates smoke");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Volcano prediction correct! Hot magma creates gas and smoke!");
    }

    const feedback = document.getElementById("scene-feedback-area");
    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🌋 VOLCANO SCIENCE VERIFIED! (+${res.points} Stars ⭐)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(8)">
          SCENE 9: THE SECRET PATH ➔
        </button>
      </div>
    `;
  }

  handleScene9Memory(idx) {
    const scene = EXPEDITION_DATA.scenes[8];
    const opt = scene.memoryCheck.options[idx];
    const feedback = document.getElementById("scene-feedback-area");
    const pathChoice = document.getElementById("scene9-path-choice");

    if (opt.isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak("Correct! You remembered the hot magma vents!");
      }
      window.expeditionEngine.addScore("clil", 2);
      this.updateHeader();
      if (pathChoice) pathChoice.style.display = "flex";

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">🧠 MEMORY VERIFIED! (+2 Stars ⭐) Choose your path below!</div>
        </div>
      `;
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Look at the picture with hot volcano magma!</div></div>`;
    }
  }

  submitScene9() {
    if (!this.selectedChoiceId) return;
    const res = window.expeditionEngine.recordPrediction(this.selectedChoiceId, "Path B is cool and safe");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Path B safely reached Station Alpha!");
    }

    const feedback = document.getElementById("scene-feedback-area");
    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🏛️ STATION ALPHA REACHED! (+${res.points} Stars ⭐)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(9)">
          SCENE 10: FINAL UNLOCK ➔
        </button>
      </div>
    `;
  }

  completeExpedition() {
    window.expeditionEngine.addScore("clil", 5);
    window.expeditionEngine.addScore("reasoning", 5);
    this.renderDebrief();
  }

  // =========================================================================
  // EXPEDITION DEBRIEF & PODIUM
  // =========================================================================

  renderDebrief() {
    const container = document.getElementById("expedition-main-view");
    if (!container) return;

    const scores = window.expeditionEngine.scores;

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1100px;">
        <div class="card-header-banner">
          <span class="card-tag" style="background: #fef08a; color: #854d0e;">✨ 🏆 MISSION ACCOMPLISHED</span>
          <h1 class="main-heading" style="color: #059669; font-size: 2.2rem;">STATION ALPHA REACHED!</h1>
          <p class="sub-heading">The team reached safety before the storm!</p>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 5rem; animation: bounce-success 1s infinite alternate;">🏛️ ⚡ 🧭 🌧️ 👧 👦</div>
          <h2 style="font-family: 'Bungee', cursive; font-size: 1.8rem; color: #1e293b; margin: 12px 0;">
            TOTAL EXPEDITION STARS: ${scores.total} ⭐
          </h2>
        </div>

        <!-- Score Category Breakdown -->
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin: 20px 0;">
          <div style="background: #e0f2fe; border: 3px solid #0284c7; border-radius: 12px; padding: 12px; text-align: center;">
            <div style="font-family: 'Bungee', cursive; color: #0369a1; font-size: 0.85rem;">TRAINING</div>
            <strong style="font-size: 1.4rem; color: #0284c7;">${scores.training} ⭐</strong>
          </div>
          <div style="background: #eff6ff; border: 3px solid #3b82f6; border-radius: 12px; padding: 12px; text-align: center;">
            <div style="font-family: 'Bungee', cursive; color: #1d4ed8; font-size: 0.85rem;">PREDICTIONS</div>
            <strong style="font-size: 1.4rem; color: #1e40af;">${scores.predictions} ⭐</strong>
          </div>
          <div style="background: #ecfdf5; border: 3px solid #10b981; border-radius: 12px; padding: 12px; text-align: center;">
            <div style="font-family: 'Bungee', cursive; color: #047857; font-size: 0.85rem;">EVIDENCE</div>
            <strong style="font-size: 1.4rem; color: #065f46;">${scores.evidence} ⭐</strong>
          </div>
          <div style="background: #fefce8; border: 3px solid #ca8a04; border-radius: 12px; padding: 12px; text-align: center;">
            <div style="font-family: 'Bungee', cursive; color: #854d0e; font-size: 0.85rem;">CLIL SCIENCE</div>
            <strong style="font-size: 1.4rem; color: #a16207;">${scores.clil} ⭐</strong>
          </div>
          <div style="background: #fdf2f8; border: 3px solid #db2777; border-radius: 12px; padding: 12px; text-align: center;">
            <div style="font-family: 'Bungee', cursive; color: #9d174d; font-size: 0.85rem;">REASONING</div>
            <strong style="font-size: 1.4rem; color: #be185d;">${scores.reasoning} ⭐</strong>
          </div>
        </div>

        <!-- Certificate Badge -->
        <div class="award-badge-card" style="border-color: #0284c7; background: #f0f9ff; max-width: 650px; margin: 0 auto 24px;">
          <div class="award-icon">🏆</div>
          <div class="award-title" style="color: #0369a1; font-size: 1.4rem;">GOLDEN EXPLORER COMPASS AWARD</div>
          <p style="font-weight: 800; color: #075985; margin-top: 6px;">
            For training vocabulary, predicting weather, understanding flood water, magma vs lava, and finding North!
          </p>
        </div>

        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <button class="jumbo-btn btn-ocean" style="font-size: 1.2rem; padding: 14px 28px;" onclick="uiController.showScreen('hub')">
            🏠 MAIN MENU
          </button>
          <button class="jumbo-btn btn-gold" style="font-size: 1.2rem; padding: 14px 28px;" onclick="expeditionUI.restartExpedition()">
            🔄 REPLAY EXPEDITION
          </button>
        </div>
      </div>
    `;

    if (window.uiController) window.uiController.triggerConfetti(6000);
    if (window.soundEngine) {
      window.soundEngine.playFanfare();
      window.soundEngine.speak("Mission Accomplished! You reached Station Alpha before the storm!");
    }
  }

  restartExpedition() {
    window.expeditionEngine.resetAll();
    this.showTrainingIntro();
  }
}

window.expeditionUI = new ExpeditionUIController();
