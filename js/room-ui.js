/**
 * Room Rescue: UI & Interactive Controller
 * Handles interactive cartoon room rendering, drag-and-drop / tap-to-place mechanics,
 * audio clues, search zones, sequencing, and teacher controls.
 */

class RoomUIController {
  constructor() {
    this.selectedItemForMove = null;
    this.memoryTimer = null;
    this.memorySecondsLeft = 8;
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Teacher panel shortcut or button
  }

  // Update header progress & score for Room Rescue
  updateHeader() {
    const scoreEl = document.getElementById("room-score-val");
    if (scoreEl) {
      scoreEl.textContent = window.roomGameEngine.score;
    }

    const progressEl = document.getElementById("room-progress-bar");
    const progressTextEl = document.getElementById("room-progress-text");
    const pct = window.roomGameEngine.getProgressPercentage();
    if (progressEl) progressEl.style.width = `${pct}%`;
    if (progressTextEl) progressTextEl.textContent = `🧹 ROOM RESCUE: ${pct}%`;
  }

  // Render the interactive 2D cartoon room canvas/DOM
  getRoomHtml(options = {}) {
    const {
      interactiveMode = "move", // "move", "search", "view", "tidy"
      highlightZoneId = null,
      activeItemId = null,
      showClean = false
    } = options;

    const furniture = ROOM_DATA.furniture;
    const items = ROOM_DATA.items;
    const engine = window.roomGameEngine;

    return `
      <div class="cartoon-room-canvas ${showClean ? 'room-sparkle-clean' : ''}" id="cartoon-room-stage">
        <!-- Room Wall & Floor Graphic Elements -->
        <div class="room-wall-bg">
          <div class="room-window-art">🪟 ☀️</div>
          <div class="room-picture-art">🖼️ 🏔️</div>
        </div>
        <div class="room-floor-bg"></div>

        <!-- Furniture & Drop / Search Targets -->
        ${furniture.map(f => `
          <div class="furniture-zone zone-${f.id} ${highlightZoneId === f.id ? 'highlight-target' : ''}" 
               data-zone-id="${f.id}" 
               onclick="roomUI.handleZoneClick('${f.id}', '${interactiveMode}')"
               style="left: ${f.x}%; top: ${f.y}%; width: ${f.w}%; height: ${f.h}%;">
            <div class="zone-icon-art">${f.icon}</div>
            <div class="zone-label-tag">${f.label}</div>
            ${interactiveMode === 'search' ? '<div class="search-magnifier-badge">🔎 SEARCH</div>' : ''}
          </div>
        `).join("")}

        <!-- Active Movable Objects in Room -->
        ${interactiveMode === 'move' || interactiveMode === 'tidy' ? `
          <div class="room-floor-items-tray">
            ${activeItemId ? `
              <div class="draggable-item-chip active-selection" id="drag-item-${activeItemId}">
                <span style="font-size: 2.2rem;">${items.find(i => i.id === activeItemId)?.icon || '📦'}</span>
                <strong>${items.find(i => i.id === activeItemId)?.name}</strong>
                <span style="font-size: 0.75rem; color: #64748b;">(Click a furniture target!)</span>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  handleZoneClick(zoneId, mode) {
    if (mode === "move" && this.selectedItemForMove) {
      this.executeMove(this.selectedItemForMove, zoneId);
    } else if (mode === "search") {
      this.executeSearch(zoneId);
    }
  }

  // =========================================================================
  // LEVEL NAVIGATION
  // =========================================================================

  showLevel(levelKey) {
    window.roomGameEngine.currentLevel = levelKey;
    this.updateHeader();

    if (window.soundEngine) window.soundEngine.stopSpeech();
    if (this.memoryTimer) {
      clearInterval(this.memoryTimer);
      this.memoryTimer = null;
    }

    const container = document.getElementById("room-main-view");
    if (!container) return;

    switch (levelKey) {
      case "intro":
        this.renderIntro(container);
        break;
      case 1:
        this.renderLevel1(container);
        break;
      case 2:
        this.renderLevel2(container);
        break;
      case 3:
        this.renderLevel3(container);
        break;
      case 4:
        this.renderLevel4(container);
        break;
      case 5:
        this.renderLevel5(container);
        break;
      case 6:
        this.renderLevel6(container);
        break;
      case 7:
        this.renderLevel7(container);
        break;
      case 8:
        this.renderLevel8(container);
        break;
      case 9:
        this.renderLevel9(container);
        break;
      case "final":
        this.renderFinalMission(container);
        break;
      case "victory":
        this.renderVictory(container);
        break;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // =========================================================================
  // INTRO / STORY SCREEN
  // =========================================================================

  renderIntro(container) {
    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1100px;">
        <div class="card-header-banner">
          <span class="card-tag" style="background: #e0f2fe; color: #0369a1;">4TH GRADE ENGLISH MISSION</span>
          <h1 class="main-heading">🏠 ROOM RESCUE</h1>
          <p class="sub-heading">The Lost Things Mission</p>
        </div>

        <div class="intro-chest-container" style="background: radial-gradient(circle, rgba(224, 242, 254, 0.5) 0%, rgba(255,255,255,0) 70%);">
          <div style="font-size: 4.5rem; margin-bottom: 8px;">👧 🏠 🧸 🎒 📚</div>
          <div class="alarm-banner" style="background: #fef3c7; border-color: #f59e0b; color: #92400e;">
            “Oh no! My room is a mess! I can't find my things! Can you help me?”
          </div>
          <p style="font-size: 1.3rem; font-weight: 800; color: #334155; text-align: center; max-width: 750px; margin: 14px 0;">
            Help organize the room, follow preposition instructions, and search for lost objects!
          </p>
        </div>

        <div class="mission-brief-steps">
          <div class="step-card">
            <div class="step-icon">🧹</div>
            <div class="step-text">1. Make Room Tidy</div>
            <p style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">Listen & read preposition directions</p>
          </div>
          <div class="step-card">
            <div class="step-icon">🔎</div>
            <div class="step-text">2. Find Lost Things</div>
            <p style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">Search under, in, on & behind furniture</p>
          </div>
          <div class="step-card">
            <div class="step-icon">🔢</div>
            <div class="step-text">3. Sequence & Solve</div>
            <p style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">Order steps: First, Then, Next, Finally</p>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 14px; margin-top: 24px;">
          <button class="jumbo-btn btn-ocean" style="font-size: 1.1rem; padding: 14px 28px;" onclick="uiController.showScreen('hub')">
            🏠 MAIN MENU
          </button>
          <button class="jumbo-btn btn-emerald" style="font-size: 1.5rem; padding: 18px 42px;" onclick="roomUI.showLevel(1)">
            🚀 START MISSION ➔
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) {
        window.soundEngine.speak("Oh no! My room is a mess! I can't find my things! Can you help me make the room tidy and find the lost things?");
      }
    }, 400);
  }

  // =========================================================================
  // LEVEL 1: LISTEN & MOVE
  // =========================================================================

  renderLevel1(container) {
    const taskIdx = window.roomGameEngine.level1TaskIndex;
    const total = ROOM_DATA.level1.tasks.length;
    const task = ROOM_DATA.level1.tasks[taskIdx];
    this.selectedItemForMove = task.itemId;

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 1: LISTEN & MOVE (${taskIdx + 1}/${total})</span>
          <h2 class="main-heading">🎧 Listen to the Direction</h2>
          <p class="sub-heading">Click 🔊 to hear the audio, then click the correct furniture target in the room!</p>
        </div>

        <!-- Audio Instruction Box (Written text hidden initially) -->
        <div class="audio-instruction-box">
          <button class="jumbo-btn btn-ocean" onclick="soundEngine.speak('${task.spoken}')" style="font-size: 1.1rem; padding: 10px 20px;">
            🔊 PLAY AUDIO
          </button>
          <div id="level1-written-text" style="display: none; font-size: 1.5rem; font-family: 'Bungee', cursive; color: #1e293b;">
            "${task.written}"
          </div>
          <button class="teacher-small-btn" onclick="document.getElementById('level1-written-text').style.display = 'block'">
            👁️ SHOW TEXT
          </button>
        </div>

        <div class="speaking-prompt-bar">
          🗣️ <strong>SAY IT ALOUD:</strong> "[Team] says: '${task.written}'"
        </div>

        <!-- Interactive Cartoon Room -->
        ${this.getRoomHtml({ interactiveMode: "move", activeItemId: task.itemId })}

        <div id="level1-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(task.spoken);
    }, 400);
  }

  executeMove(itemId, targetZoneId) {
    const currentLvl = window.roomGameEngine.currentLevel;

    if (currentLvl === 1) {
      const isCorrect = window.roomGameEngine.checkLevel1Move(targetZoneId);
      const feedback = document.getElementById("level1-feedback-area");
      const task = ROOM_DATA.level1.tasks[window.roomGameEngine.level1TaskIndex];

      if (isCorrect) {
        if (window.soundEngine) {
          window.soundEngine.playCorrect();
          window.soundEngine.speak(`Great job! ${task.written}`);
        }
        window.roomGameEngine.addScore(1);
        this.updateHeader();

        feedback.innerHTML = `
          <div class="feedback-box">
            <div>
              <div class="feedback-text">⭐ PERFECT PLACEMENT! (+1 Star)</div>
              <div style="font-weight: 800; color: #065f46; margin-top: 4px;">"${task.written}"</div>
            </div>
            <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.nextLevel1Task()">
              ${window.roomGameEngine.level1TaskIndex + 1 < ROOM_DATA.level1.tasks.length ? 'NEXT OBJECT ➔' : 'COMPLETE LEVEL 1 ➔'}
            </button>
          </div>
        `;
      } else {
        if (window.soundEngine) {
          window.soundEngine.playWrong();
          window.soundEngine.speak("Hmm... listen again!");
        }
        feedback.innerHTML = `
          <div class="feedback-box error-mode">
            <div class="feedback-text" style="color: #b91c1c;">🤔 Hmm... listen again! Where does it belong?</div>
          </div>
        `;
      }
    } else if (currentLvl === 2) {
      this.executeLevel2Move(itemId, targetZoneId);
    } else if (currentLvl === 9) {
      this.executeLevel9Move(itemId, targetZoneId);
    }
  }

  nextLevel1Task() {
    if (window.roomGameEngine.level1TaskIndex + 1 < ROOM_DATA.level1.tasks.length) {
      window.roomGameEngine.level1TaskIndex++;
      this.showLevel(1);
    } else {
      this.showLevel(2);
    }
  }

  // =========================================================================
  // LEVEL 2: READ & ORGANIZE
  // =========================================================================

  renderLevel2(container) {
    const instructions = ROOM_DATA.level2.instructions;
    const completed = window.roomGameEngine.level2CompletedItems;

    // Pick first uncompleted item
    const nextItem = instructions.find(i => !completed.has(i.itemId));
    if (!nextItem) {
      this.showLevel(3);
      return;
    }
    this.selectedItemForMove = nextItem.itemId;

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 2: READ & ORGANIZE (${completed.size} / ${instructions.length} Done)</span>
          <h2 class="main-heading">📖 Read & Clean the Room</h2>
          <p class="sub-heading">Read the checklist, then click the correct place for each object!</p>
        </div>

        <div class="checklist-tasks-grid">
          ${instructions.map(inst => `
            <div class="checklist-item-card ${completed.has(inst.itemId) ? 'item-done' : ''} ${nextItem.itemId === inst.itemId ? 'item-active' : ''}">
              <span class="check-box-icon">${completed.has(inst.itemId) ? '✅' : '⬜'}</span>
              <span style="font-weight: 900; font-size: 1.15rem;">${inst.text}</span>
            </div>
          `).join("")}
        </div>

        <!-- Interactive Room -->
        ${this.getRoomHtml({ interactiveMode: "move", activeItemId: nextItem.itemId })}

        <div id="level2-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;
  }

  executeLevel2Move(itemId, targetZoneId) {
    const isCorrect = window.roomGameEngine.checkLevel2Move(itemId, targetZoneId);
    const feedback = document.getElementById("level2-feedback-area");

    if (isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
      }
      window.roomGameEngine.addScore(1);
      this.updateHeader();

      const total = ROOM_DATA.level2.instructions.length;
      const done = window.roomGameEngine.level2CompletedItems.size;

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">⭐ ITEM ORGANIZED! (+1 Star)</div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel(2)">
            ${done < total ? 'NEXT ITEM ➔' : 'GO TO MEMORY CHALLENGE ➔'}
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Read the instruction carefully!");
      }
      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Look at the written checklist. Try placing it again!</div>
        </div>
      `;
    }
  }

  // =========================================================================
  // LEVEL 3: SPATIAL MEMORY
  // =========================================================================

  renderLevel3(container) {
    const qIdx = window.roomGameEngine.level3QuestionIndex;
    const questions = ROOM_DATA.level3.questions;
    const currentQ = questions[qIdx];
    this.memorySecondsLeft = ROOM_DATA.level3.timeLimit;

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1200px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 3: SPATIAL MEMORY (Question ${qIdx + 1}/${questions.length})</span>
          <h2 class="main-heading">🧠 Remember Where Everything Is!</h2>
          <p class="sub-heading">Look at the tidy room for 8 seconds. Then answer from memory!</p>
        </div>

        <div class="memory-timer-container">
          <div class="memory-timer-pill" id="room-memory-timer-pill">⏱️ TIME LEFT: 8s</div>
          <div class="memory-progress-track">
            <div class="memory-progress-bar" id="room-memory-progress-bar"></div>
          </div>
        </div>

        <!-- Tidy Room Display -->
        <div id="room-memory-stage-view">
          ${this.getRoomHtml({ interactiveMode: "view", showClean: true })}
        </div>

        <!-- Question View (Hidden initially) -->
        <div id="room-memory-question-view" style="display: none; flex-direction: column; align-items: center; gap: 16px; width: 100%;">
          <div class="question-spotlight-box" style="text-align: center; justify-content: center; flex-direction: column;">
            <span class="card-tag" style="background: #fee2e2; color: #b91c1c;">ROOM HIDDEN!</span>
            <div class="spotlight-question-text" style="font-size: 2rem;">"${currentQ.question}"</div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${currentQ.spoken}')" style="margin-top: 6px;">🔊</button>
          </div>

          <div class="choices-grid">
            ${currentQ.options.map((opt, i) => `
              <button class="choice-card-btn" id="room-l3-opt-${i}" onclick="roomUI.handleLevel3Answer(${i})">
                <span class="choice-text" style="font-size: 1.35rem;">"${opt.text}"</span>
              </button>
            `).join("")}
          </div>

          <div id="level3-feedback-area" style="width: 100%; max-width: 850px;"></div>
        </div>
      </div>
    `;

    this.startMemoryTimer();
  }

  startMemoryTimer() {
    if (this.memoryTimer) clearInterval(this.memoryTimer);

    const timerPill = document.getElementById("room-memory-timer-pill");
    const progBar = document.getElementById("room-memory-progress-bar");
    const stageView = document.getElementById("room-memory-stage-view");
    const qView = document.getElementById("room-memory-question-view");

    if (progBar) progBar.style.width = "100%";

    this.memoryTimer = setInterval(() => {
      this.memorySecondsLeft--;
      if (timerPill) timerPill.textContent = `⏱️ TIME LEFT: ${this.memorySecondsLeft}s`;
      if (progBar) progBar.style.width = `${(this.memorySecondsLeft / 8) * 100}%`;

      if (this.memorySecondsLeft <= 0) {
        clearInterval(this.memoryTimer);
        this.memoryTimer = null;

        if (stageView) stageView.style.display = "none";
        if (qView) {
          qView.style.display = "flex";
          const currentQ = ROOM_DATA.level3.questions[window.roomGameEngine.level3QuestionIndex];
          if (window.soundEngine) {
            window.soundEngine.playLockClick();
            window.soundEngine.speak(currentQ.spoken);
          }
        }
      }
    }, 1000);
  }

  handleLevel3Answer(choiceIdx) {
    const qIdx = window.roomGameEngine.level3QuestionIndex;
    const currentQ = ROOM_DATA.level3.questions[qIdx];
    const selected = currentQ.options[choiceIdx];
    const feedback = document.getElementById("level3-feedback-area");
    const btn = document.getElementById(`room-l3-opt-${choiceIdx}`);

    if (selected.isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(selected.speech);
      }
      btn.classList.add("correct-choice");
      window.roomGameEngine.addScore(2);
      this.updateHeader();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">🎉 MEMORY MASTER! (+2 Stars)</div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.nextLevel3Question()">
            ${qIdx + 1 < ROOM_DATA.level3.questions.length ? 'NEXT QUESTION ➔' : 'GO TO LOST OBJECTS SEARCH ➔'}
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Try to remember!");
      }
      btn.classList.add("wrong-choice");
      setTimeout(() => btn.classList.remove("wrong-choice"), 600);

      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Think back to the tidy room! Try again!</div>
        </div>
      `;
    }
  }

  nextLevel3Question() {
    if (window.roomGameEngine.level3QuestionIndex + 1 < ROOM_DATA.level3.questions.length) {
      window.roomGameEngine.level3QuestionIndex++;
      this.showLevel(3);
    } else {
      this.showLevel(4);
    }
  }

  // =========================================================================
  // LEVEL 4: FIND THE LOST OBJECTS
  // =========================================================================

  renderLevel4(container) {
    const lostItems = ROOM_DATA.level4.lostItems;
    const foundSet = window.roomGameEngine.level4FoundItems;
    const searches = window.roomGameEngine.searchesLeft;

    // Active lost item to find
    const activeTarget = lostItems.find(i => !foundSet.has(i.id));

    if (!activeTarget) {
      this.showLevel(5);
      return;
    }

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 4: FIND THE LOST OBJECTS (${foundSet.size}/3 Found)</span>
          <h2 class="main-heading">🔎 Find the Lost Items!</h2>
          <p class="sub-heading">Read the clue and search the correct spot in the room!</p>
        </div>

        <div class="search-clue-ribbon">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <span style="font-size: 3rem;">${activeTarget.icon}</span>
            <div>
              <div style="font-family: 'Bungee', cursive; font-size: 1.3rem; color: #1e293b;">TARGET: ${activeTarget.name}</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #b45309;">"${activeTarget.clue}"</div>
            </div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${activeTarget.spokenClue}')">🔊</button>
          </div>
          <div class="searches-counter-pill ${searches <= 2 ? 'low-searches' : ''}">
            <span>🔎 SEARCHES LEFT:</span>
            <strong>${searches}</strong>
          </div>
        </div>

        <!-- Interactive Search Room -->
        ${this.getRoomHtml({ interactiveMode: "search" })}

        <div id="level4-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(activeTarget.spokenClue);
    }, 400);
  }

  executeSearch(zoneId) {
    const currentLvl = window.roomGameEngine.currentLevel;

    if (currentLvl === 4) {
      if (window.roomGameEngine.searchesLeft <= 0) {
        alert("Out of searches! Teacher can grant extra searches in the Teacher panel.");
        return;
      }
      window.roomGameEngine.useSearch();
      this.updateHeader();

      const result = window.roomGameEngine.checkLevel4Search(zoneId);
      const feedback = document.getElementById("level4-feedback-area");

      if (result.success) {
        if (window.soundEngine) {
          window.soundEngine.playFanfare();
          window.soundEngine.speak(result.item.spokenFound);
        }
        window.roomGameEngine.addScore(2);
        this.updateHeader();

        feedback.innerHTML = `
          <div class="feedback-box">
            <div>
              <div class="feedback-text">🎉 FOUND! (+2 Stars)</div>
              <div style="font-weight: 800; color: #065f46; margin-top: 4px;">${result.item.foundText}</div>
            </div>
            <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel(4)">
              ${window.roomGameEngine.level4FoundItems.size < 3 ? 'FIND NEXT ITEM ➔' : 'GO TO MULTI-STEP CLUES ➔'}
            </button>
          </div>
        `;
      } else {
        if (window.soundEngine) {
          window.soundEngine.playWrong();
          window.soundEngine.speak("Nothing here! Read the clue again.");
        }
        feedback.innerHTML = `
          <div class="feedback-box error-mode">
            <div class="feedback-text" style="color: #b91c1c;">❌ Nothing here! Understand the clue before searching! (${window.roomGameEngine.searchesLeft} searches left)</div>
          </div>
        `;
      }
    } else if (currentLvl === 5) {
      this.executeLevel5Search(zoneId);
    } else if (currentLvl === 6) {
      this.executeLevel6Search(zoneId);
    } else if (currentLvl === 7) {
      this.executeLevel7Search(zoneId);
    } else if (currentLvl === "final") {
      this.executeFinalMissionSearch(zoneId);
    }
  }

  // =========================================================================
  // LEVEL 5: MULTI-STEP CLUES
  // =========================================================================

  renderLevel5(container) {
    const clues = ROOM_DATA.level5.clues;
    const currentStep = window.roomGameEngine.level5CurrentStep;

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 5: MULTI-STEP DEDUCTION</span>
          <h2 class="main-heading">🔴 Find the Red Notebook</h2>
          <p class="sub-heading">Follow the 3 sequential clues to locate the missing notebook!</p>
        </div>

        <div class="multi-step-clues-box">
          ${clues.map(c => `
            <div class="clue-step-card ${c.step <= currentStep ? 'step-unlocked' : 'step-locked'}">
              <span class="step-pill">STEP ${c.step}</span>
              <span style="font-weight: 800; font-size: 1.15rem;">${c.text}</span>
              ${c.step <= currentStep ? `<button class="speak-icon-btn" onclick="soundEngine.speak('${c.spoken}')" style="width: 32px; height: 32px; font-size: 0.9rem;">🔊</button>` : ''}
            </div>
          `).join("")}
        </div>

        ${currentStep < 3 ? `
          <div style="text-align: center; margin: 12px 0;">
            <button class="jumbo-btn btn-gold" style="font-size: 1rem; padding: 10px 24px;" onclick="roomUI.unlockNextLevel5Clue()">
              📜 REVEAL CLUE ${currentStep + 1} ➔
            </button>
          </div>
        ` : ''}

        <!-- Interactive Search Room -->
        ${this.getRoomHtml({ interactiveMode: "search" })}

        <div id="level5-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;
  }

  unlockNextLevel5Clue() {
    if (window.roomGameEngine.level5CurrentStep < 3) {
      window.roomGameEngine.level5CurrentStep++;
      if (window.soundEngine) {
        const c = ROOM_DATA.level5.clues[window.roomGameEngine.level5CurrentStep - 1];
        window.soundEngine.playClue();
        window.soundEngine.speak(c.spoken);
      }
      this.showLevel(5);
    }
  }

  executeLevel5Search(zoneId) {
    const isCorrect = window.roomGameEngine.checkLevel5Search(zoneId);
    const feedback = document.getElementById("level5-feedback-area");

    if (isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playFanfare();
        window.soundEngine.speak("Amazing deduction! You found the red notebook behind the books!");
      }
      window.roomGameEngine.addScore(3);
      this.updateHeader();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div>
            <div class="feedback-text">🎉 3-STEP DEDUCTION SOLVED! (+3 Stars)</div>
            <div style="font-weight: 800; color: #065f46; margin-top: 4px;">${ROOM_DATA.level5.foundMessage}</div>
          </div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel(6)">
            GO TO LISTENING SEARCH ➔
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Think about all 3 clues! Not on floor, near books!");
      }
      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">❌ Not there! Remember: not on the floor, near reading books!</div>
        </div>
      `;
    }
  }

  // =========================================================================
  // LEVEL 6: LISTENING SEARCH
  // =========================================================================

  renderLevel6(container) {
    const chIdx = window.roomGameEngine.level6ChallengeIndex;
    const challenge = ROOM_DATA.level6.challenges[chIdx];

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 6: LISTENING SEARCH (${chIdx + 1}/${ROOM_DATA.level6.challenges.length})</span>
          <h2 class="main-heading">🎧 Audio Clue Investigation</h2>
          <p class="sub-heading">Listen to the audio clue and search the correct container or place!</p>
        </div>

        <div class="audio-instruction-box">
          <button class="jumbo-btn btn-ocean" onclick="soundEngine.speak('${challenge.spokenClue}')" style="font-size: 1.1rem; padding: 10px 20px;">
            🔊 PLAY AUDIO CLUE
          </button>
          <div id="level6-written-text" style="display: none; font-size: 1.4rem; font-family: 'Bungee', cursive; color: #1e293b;">
            "${challenge.writtenClue}"
          </div>
          <button class="teacher-small-btn" onclick="document.getElementById('level6-written-text').style.display = 'block'">
            👁️ SHOW TEXT
          </button>
        </div>

        <!-- Interactive Search Room -->
        ${this.getRoomHtml({ interactiveMode: "search" })}

        <div id="level6-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(challenge.spokenClue);
    }, 400);
  }

  executeLevel6Search(zoneId) {
    const result = window.roomGameEngine.checkLevel6Search(zoneId);
    const feedback = document.getElementById("level6-feedback-area");

    if (result.success) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(`Found! ${result.challenge.explanation}`);
      }
      window.roomGameEngine.addScore(2);
      this.updateHeader();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">🎉 CORRECT SEARCH! (+2 Stars)</div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.nextLevel6()">
            ${window.roomGameEngine.level6ChallengeIndex + 1 < ROOM_DATA.level6.challenges.length ? 'NEXT AUDIO CLUE ➔' : 'GO TO READING SEARCH ➔'}
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Listen carefully to the audio clue!");
      }
      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">❌ Not in that container! Listen to the clue again!</div>
        </div>
      `;
    }
  }

  nextLevel6() {
    if (window.roomGameEngine.level6ChallengeIndex + 1 < ROOM_DATA.level6.challenges.length) {
      window.roomGameEngine.level6ChallengeIndex++;
      this.showLevel(6);
    } else {
      this.showLevel(7);
    }
  }

  // =========================================================================
  // LEVEL 7: READING SEARCH (COMPLEX PREPOSITIONS)
  // =========================================================================

  renderLevel7(container) {
    const chIdx = window.roomGameEngine.level7ChallengeIndex;
    const challenge = ROOM_DATA.level7.challenges[chIdx];

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 7: COMPLEX PREPOSITIONS (${chIdx + 1}/${ROOM_DATA.level7.challenges.length})</span>
          <h2 class="main-heading">📖 Complex Preposition Search</h2>
          <p class="sub-heading">Read the detailed clue and click the exact spot!</p>
        </div>

        <div class="search-clue-ribbon">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <span style="font-size: 3rem;">${challenge.targetItem.icon}</span>
            <div>
              <div style="font-family: 'Bungee', cursive; font-size: 1.3rem; color: #1e293b;">TARGET: ${challenge.targetItem.name}</div>
              <div style="font-size: 1.3rem; font-weight: 800; color: #1d4ed8;">"${challenge.textClue}"</div>
            </div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${challenge.spokenClue}')">🔊</button>
          </div>
        </div>

        <!-- Interactive Search Room -->
        ${this.getRoomHtml({ interactiveMode: "search" })}

        <div id="level7-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;
  }

  executeLevel7Search(zoneId) {
    const result = window.roomGameEngine.checkLevel7Search(zoneId);
    const feedback = document.getElementById("level7-feedback-area");

    if (result.success) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(result.challenge.explanation);
      }
      window.roomGameEngine.addScore(2);
      this.updateHeader();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">⭐ COMPLEX PREPOSITIONS SOLVED! (+2 Stars)</div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.nextLevel7()">
            ${window.roomGameEngine.level7ChallengeIndex + 1 < ROOM_DATA.level7.challenges.length ? 'NEXT SEARCH ➔' : 'GO TO CLEAN-UP SEQUENCING ➔'}
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Check both prepositions in the sentence!");
      }
      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">❌ Read all prepositions carefully! (e.g. inside + box + under desk)</div>
        </div>
      `;
    }
  }

  nextLevel7() {
    if (window.roomGameEngine.level7ChallengeIndex + 1 < ROOM_DATA.level7.challenges.length) {
      window.roomGameEngine.level7ChallengeIndex++;
      this.showLevel(7);
    } else {
      this.showLevel(8);
    }
  }

  // =========================================================================
  // LEVEL 8: SEQUENCE THE CLEAN-UP
  // =========================================================================

  renderLevel8(container) {
    const cards = [...ROOM_DATA.level8.cards];
    // Shuffle cards for challenge if empty
    if (window.roomGameEngine.level8UserOrder.length === 0) {
      window.roomGameEngine.level8UserOrder = cards.map(c => c.id).sort(() => Math.random() - 0.5);
    }
    const currentOrder = window.roomGameEngine.level8UserOrder;

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1100px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 8: SEQUENCING</span>
          <h2 class="main-heading">🔢 Sequence the Clean-Up!</h2>
          <p class="sub-heading">Arrange the 5 steps into the correct order: First ➔ Then ➔ Next ➔ After that ➔ Finally!</p>
        </div>

        <div class="sequence-cards-container" id="sequence-slots-list">
          ${currentOrder.map((cardId, idx) => {
            const card = cards.find(c => c.id === cardId);
            return `
              <div class="sequence-step-card" draggable="true" data-card-id="${card.id}">
                <div class="sequence-number-badge">${idx + 1}</div>
                <div style="font-size: 2rem;">${card.icon}</div>
                <div style="flex: 1;">
                  <strong style="font-family: 'Bungee', cursive; color: #4338ca; font-size: 1.1rem;">${card.seqWord}:</strong>
                  <span style="font-size: 1.15rem; font-weight: 800; color: #1e293b;">${card.text}</span>
                </div>
                <div style="display: flex; gap: 4px;">
                  ${idx > 0 ? `<button class="teacher-small-btn" onclick="roomUI.moveSeqCard(${idx}, -1)">⬆️ UP</button>` : ''}
                  ${idx < currentOrder.length - 1 ? `<button class="teacher-small-btn" onclick="roomUI.moveSeqCard(${idx}, 1)">⬇️ DOWN</button>` : ''}
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <button class="jumbo-btn btn-gold" style="font-size: 1.4rem; padding: 16px 36px;" onclick="roomUI.checkLevel8Sequence()">
            ✅ CHECK SEQUENCE ➔
          </button>
        </div>

        <div id="level8-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;
  }

  moveSeqCard(index, delta) {
    const list = window.roomGameEngine.level8UserOrder;
    const targetIdx = index + delta;
    if (targetIdx >= 0 && targetIdx < list.length) {
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      this.renderLevel8(document.getElementById("room-main-view"));
    }
  }

  checkLevel8Sequence() {
    const isCorrect = window.roomGameEngine.checkLevel8Sequence(window.roomGameEngine.level8UserOrder);
    const feedback = document.getElementById("level8-feedback-area");

    if (isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playFanfare();
        window.soundEngine.speak("Perfect sequencing! First, then, next, after that, and finally!");
      }
      window.roomGameEngine.addScore(3);
      this.updateHeader();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div>
            <div class="feedback-text">🎉 100% CORRECT SEQUENCE! (+3 Stars)</div>
            <div style="font-weight: 800; color: #065f46; margin-top: 4px;">
              First (Toys in box) ➔ Then (Books on shelf) ➔ Next (Clothes in basket) ➔ After that (Shoes near door) ➔ Finally (Clean floor)
            </div>
          </div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel(9)">
            GO TO EFFICIENT ROOM ➔
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Look at the sequence words: First, Then, Next, After that, Finally!");
      }
      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Look at the sequence words (First ➔ Then ➔ Next ➔ After that ➔ Finally). Try reordering!</div>
        </div>
      `;
    }
  }

  // =========================================================================
  // LEVEL 9: THE EFFICIENT ROOM
  // =========================================================================

  renderLevel9(container) {
    const tasks = ROOM_DATA.level9.tasks;
    const completed = window.roomGameEngine.level9CompletedItems;
    const nextTask = tasks.find(t => !completed.has(t.itemId));

    if (!nextTask) {
      this.showLevel("final");
      return;
    }
    this.selectedItemForMove = nextTask.itemId;

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag">LEVEL 9: SPATIAL OPTIMIZATION (${completed.size}/${tasks.length} Done)</span>
          <h2 class="main-heading">🧠 The Efficient Room</h2>
          <p class="sub-heading">“It's tidy... but difficult to use!” Move items to their most practical locations!</p>
        </div>

        <div class="search-clue-ribbon" style="background: linear-gradient(135deg, #fef3c7, #fde68a); color: #78350f;">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <span style="font-size: 2.8rem;">💡</span>
            <div>
              <div style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #78350f;">OPTIMIZATION TASK:</div>
              <div style="font-size: 1.3rem; font-weight: 900; color: #92400e;">"${nextTask.text}"</div>
            </div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${nextTask.spoken}')">🔊</button>
          </div>
        </div>

        <!-- Interactive Room -->
        ${this.getRoomHtml({ interactiveMode: "tidy", activeItemId: nextTask.itemId })}

        <div id="level9-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;
  }

  executeLevel9Move(itemId, targetZoneId) {
    const isCorrect = window.roomGameEngine.checkLevel9Move(itemId, targetZoneId);
    const feedback = document.getElementById("level9-feedback-area");

    if (isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
      }
      window.roomGameEngine.addScore(2);
      this.updateHeader();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">⭐ OPTIMIZATION COMPLETE! (+2 Stars)</div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel(9)">
            ${window.roomGameEngine.level9CompletedItems.size < ROOM_DATA.level9.tasks.length ? 'NEXT OPTIMIZATION ➔' : 'GO TO GRAND FINAL MISSION 🔥 ➔'}
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Move it to the convenient spot near the desk or door!");
      }
      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Where makes the most sense? Check the instruction!</div>
        </div>
      `;
    }
  }

  // =========================================================================
  // FINAL MISSION: GRAND ROOM RESCUE
  // =========================================================================

  renderFinalMission(container) {
    const stepIdx = window.roomGameEngine.finalMissionStepIndex;
    const step = ROOM_DATA.finalMission.steps[stepIdx];

    if (!step) {
      this.showLevel("victory");
      return;
    }

    if (step.type === "move") {
      this.selectedItemForMove = step.itemId;
    }

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px;">
        <div class="card-header-banner">
          <span class="card-tag" style="background: #fee2e2; color: #991b1b; border-color: #ef4444;">
            🔥 FINAL CLIMAX MISSION (Step ${stepIdx + 1}/5)
          </span>
          <h2 class="main-heading">🏠 Grand Room Rescue!</h2>
          <p class="sub-heading">Complete all final instructions to transform the messy room into a sparkling room!</p>
        </div>

        <div class="search-clue-ribbon" style="background: #1e293b; color: #fff;">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <span style="font-size: 2.8rem;">⚡</span>
            <div>
              <div style="font-family: 'Bungee', cursive; font-size: 1.1rem; color: #38bdf8;">FINAL STEP ${stepIdx + 1}:</div>
              <div style="font-size: 1.35rem; font-weight: 900; color: #fef08a;">"${step.instruction}"</div>
            </div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${step.spoken}')">🔊</button>
          </div>
        </div>

        <!-- Interactive Final Room -->
        ${this.getRoomHtml({ 
          interactiveMode: step.type === 'move' ? 'move' : 'search', 
          activeItemId: step.itemId 
        })}

        <div id="final-feedback-area" style="width: 100%; max-width: 850px; margin: 16px auto 0;"></div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(step.spoken);
    }, 400);
  }

  executeFinalMissionSearch(zoneId) {
    const isCorrect = window.roomGameEngine.checkFinalMissionAction("search", zoneId);
    const feedback = document.getElementById("final-feedback-area");

    if (isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
      }
      window.roomGameEngine.addScore(3);
      window.roomGameEngine.finalMissionStepIndex++;
      this.updateHeader();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">🎉 STEP COMPLETE! (+3 Stars)</div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="roomUI.showLevel('final')">
            NEXT FINAL STEP ➔
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Read the final clue carefully!");
      }
      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">❌ Not there! Check the final clue!</div>
        </div>
      `;
    }
  }

  // =========================================================================
  // VICTORY CEREMONY
  // =========================================================================

  renderVictory(container) {
    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1100px;">
        <div class="card-header-banner">
          <span class="card-tag" style="background: #fef08a; color: #854d0e;">✨ 🏠 ✨ MISSION ACCOMPLISHED</span>
          <h1 class="main-heading" style="color: #059669;">ROOM RESCUE COMPLETE!</h1>
          <p class="sub-heading">The room is 100% clean, organized, and all lost objects were found!</p>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 5.5rem; animation: bounce-success 1s infinite alternate;">🏠 ✨ 🏆 ✨ 👧</div>
          <h2 style="font-family: 'Bungee', cursive; font-size: 2.2rem; color: #1e293b; margin: 12px 0;">
            “You found everything! My room is tidy, and now it's much easier to use!”
          </h2>
          <div style="font-family: 'Bungee', cursive; font-size: 1.8rem; color: var(--primary-gold); margin-bottom: 20px;">
            TOTAL STARS EARNED: ${window.roomGameEngine.score} ⭐
          </div>
        </div>

        <div class="award-badge-card" style="border-color: #10b981; background: #ecfdf5; max-width: 600px; margin: 0 auto 24px;">
          <div class="award-icon">🏆</div>
          <div class="award-title" style="color: #065f46; font-size: 1.4rem;">CERTIFIED ROOM RESCUE EXPERT</div>
          <p style="font-weight: 800; color: #047857; margin-top: 6px;">
            For mastering prepositions (in, on, under, behind, next to), following audio/reading directions, and solving spatial clues!
          </p>
        </div>

        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <button class="jumbo-btn btn-ocean" style="font-size: 1.2rem; padding: 14px 28px;" onclick="uiController.showScreen('hub')">
            🏠 MAIN MENU
          </button>
          <button class="jumbo-btn btn-gold" style="font-size: 1.2rem; padding: 14px 28px;" onclick="roomUI.restartGame()">
            🔄 PLAY AGAIN (New Variations)
          </button>
        </div>
      </div>
    `;

    if (window.uiController) window.uiController.triggerConfetti(6000);
    if (window.soundEngine) {
      window.soundEngine.playFanfare();
      window.soundEngine.speak("Room Rescue Complete! You found everything and made the room tidy!");
    }
  }

  restartGame() {
    window.roomGameEngine.resetAll();
    this.showLevel("intro");
  }

  // =========================================================================
  // ROOM TEACHER HUB
  // =========================================================================

  openTeacherPanel() {
    const modal = document.getElementById("room-teacher-modal");
    const container = document.getElementById("room-teacher-body");
    if (!modal || !container) return;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #475569; padding-bottom: 12px; margin-bottom: 16px;">
        <h2 style="font-family: 'Bungee', cursive; color: #38bdf8; font-size: 1.5rem;">🧑‍🏫 Room Rescue Teacher Controls</h2>
        <button class="icon-btn" onclick="roomUI.closeTeacherPanel()">✕</button>
      </div>

      <div class="teacher-grid-section">
        <div class="teacher-card-mini" style="grid-column: 1 / -1;">
          <h4>🚀 Jump to Level</h4>
          <div class="teacher-actions-row">
            <button class="teacher-small-btn" onclick="roomUI.showLevel('intro'); roomUI.closeTeacherPanel();">Intro</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(1); roomUI.closeTeacherPanel();">L1: Listen & Move</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(2); roomUI.closeTeacherPanel();">L2: Read & Organize</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(3); roomUI.closeTeacherPanel();">L3: Spatial Memory</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(4); roomUI.closeTeacherPanel();">L4: Lost Objects</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(5); roomUI.closeTeacherPanel();">L5: Multi-Step</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(6); roomUI.closeTeacherPanel();">L6: Listening Search</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(7); roomUI.closeTeacherPanel();">L7: Reading Search</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(8); roomUI.closeTeacherPanel();">L8: Sequence Clean</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel(9); roomUI.closeTeacherPanel();">L9: Efficient Room</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel('final'); roomUI.closeTeacherPanel();">🔥 Final Climax</button>
            <button class="teacher-small-btn" onclick="roomUI.showLevel('victory'); roomUI.closeTeacherPanel();">🏆 Victory Ceremony</button>
          </div>
        </div>

        <div class="teacher-card-mini">
          <h4>⭐ Manage Searches & Stars</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>Searches Left: <strong>${window.roomGameEngine.searchesLeft}</strong></span>
              <div style="display: flex; gap: 4px;">
                <button class="teacher-small-btn" onclick="roomGameEngine.addSearches(-1); roomUI.openTeacherPanel();">-1</button>
                <button class="teacher-small-btn" onclick="roomGameEngine.addSearches(2); roomUI.openTeacherPanel();">+2 🔎</button>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>Stars Earned: <strong>${window.roomGameEngine.score} ⭐</strong></span>
              <div style="display: flex; gap: 4px;">
                <button class="teacher-small-btn" onclick="roomGameEngine.addScore(1); roomUI.updateHeader(); roomUI.openTeacherPanel();">+1 ⭐</button>
                <button class="teacher-small-btn" onclick="roomGameEngine.addScore(5); roomUI.updateHeader(); roomUI.openTeacherPanel();">+5 ⭐</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");
  }

  closeTeacherPanel() {
    const modal = document.getElementById("room-teacher-modal");
    if (modal) modal.classList.remove("active");
  }
}

window.roomUI = new RoomUIController();
