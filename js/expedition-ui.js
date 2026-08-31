/**
 * THE LAST EXPEDITION: UI CONTROLLER
 * Renders the 10 sequential narrative scenes, 30s discussion timer,
 * prediction selections, evidence verifications, CLIL diagrams, and final debrief.
 */

class ExpeditionUIController {
  constructor() {
    this.discussionTimer = null;
    this.discussionSecondsLeft = 30;
    this.selectedPredictionId = null;
    this.selectedEvidenceId = null;
  }

  init() {
    // Initialized globally
  }

  updateHeader() {
    const scores = window.expeditionEngine.scores;
    const scoreEl = document.getElementById("expedition-score-val");
    if (scoreEl) scoreEl.textContent = scores.total;

    const stormEl = document.getElementById("storm-time-val");
    if (stormEl) stormEl.textContent = `${window.expeditionEngine.stormMinutesLeft} MIN`;
  }

  // =========================================================================
  // MAIN VIEWPORT RENDERER
  // =========================================================================

  showScene(sceneIndex = null) {
    if (sceneIndex !== null) {
      window.expeditionEngine.currentSceneIndex = sceneIndex;
    }

    if (this.discussionTimer) {
      clearInterval(this.discussionTimer);
      this.discussionTimer = null;
    }

    this.selectedPredictionId = null;
    this.selectedEvidenceId = null;

    const container = document.getElementById("expedition-main-view");
    if (!container) return;

    const scene = window.expeditionEngine.getCurrentScene();
    const explorers = EXPEDITION_DATA.explorers;

    container.innerHTML = `
      <div class="expedition-master-viewport">
        <!-- Top Expedition Status & Storm Warning -->
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
            <div style="font-family: 'Bungee', cursive; color: #d97706; font-size: 1.1rem;">
              ⭐ <span id="expedition-score-val">${window.expeditionEngine.scores.total}</span>
            </div>
          </div>
        </div>

        <!-- 4 Explorers Roster Bar -->
        <div class="explorers-strip-row">
          ${explorers.map(exp => `
            <div class="explorer-mini-card">
              ${EXPEDITION_SVG.getExplorerAvatarSvg(exp.avatarClass, 48)}
              <div>
                <div class="explorer-mini-name">${exp.name}</div>
                <div class="explorer-mini-role">${exp.role}</div>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Scene Content Body -->
        <div class="adventure-card" style="max-width: 1200px; padding: 20px;">
          ${this.renderSceneBody(scene)}
        </div>
      </div>
    `;

    this.updateHeader();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // =========================================================================
  // SCENE BODY RENDERERS
  // =========================================================================

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
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
        <!-- Story Narrative Box -->
        <div class="alarm-banner" style="background: #fff; border-color: #0284c7; color: #1e293b; max-width: 900px;">
          “${scene.storyText}”
          <button class="speak-icon-btn" onclick="soundEngine.speak('${scene.spokenStory}')" style="margin-left: 8px;">🔊</button>
        </div>

        <!-- Island Scene Canvas -->
        <div style="width: 100%; max-width: 900px; height: 380px; border-radius: 16px; overflow: hidden; border: 4px solid #1e293b;">
          ${EXPEDITION_SVG.getIslandMapSvg(1)}
        </div>

        <!-- 30-Second Discussion Spotlight -->
        <div class="discussion-timer-box">
          <div class="discussion-countdown-pill" id="exp-disc-timer-pill">⏱️ DISCUSS WITH YOUR TEAM: 30s</div>
          <div style="font-size: 1.2rem; font-weight: 800; color: #78350f;">
            “${scene.discussionPrompt}”
          </div>
          <div class="expedition-frame-card">
            🗣️ Sentence Frame: “I think <span style="color: #2563eb;">heavy rain</span> will <span style="color: #2563eb;">start</span> because <span style="color: #2563eb;">there are dark clouds</span>.”
          </div>
        </div>

        <!-- Prediction Options -->
        <div style="width: 100%; max-width: 900px;">
          <h3 style="font-family: 'Bungee', cursive; color: #1e293b; font-size: 1.2rem; margin-bottom: 10px;">
            🔮 Step 1: Select Your Prediction
          </h3>
          <div class="prediction-choices-grid">
            ${scene.predictionOptions.map(opt => `
              <div class="prediction-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectPrediction('${opt.id}')">
                <div style="font-weight: 900; font-size: 1.2rem; color: #1e293b;">${opt.text}</div>
                <div style="font-size: 0.85rem; color: #64748b; margin-top: 6px;">Reasoning: ${opt.reason}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Evidence Question -->
        <div style="width: 100%; max-width: 900px;">
          <h3 style="font-family: 'Bungee', cursive; color: #1e293b; font-size: 1.2rem; margin-bottom: 10px;">
            🔎 Step 2: What Evidence Supports Your Prediction?
          </h3>
          <div class="prediction-choices-grid">
            ${scene.evidenceOptions.map(ev => `
              <div class="prediction-choice-card" id="opt-ev-${ev.id}" onclick="expeditionUI.selectEvidence('${ev.id}')">
                <div style="font-weight: 900; font-size: 1.15rem; color: #1e293b;">${ev.text}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <button class="jumbo-btn btn-gold" style="font-size: 1.3rem; padding: 14px 36px; margin-top: 10px;" onclick="expeditionUI.submitScene1()">
          CONFIRM PREDICTION & REVEAL SCENE 2 ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%; max-width: 900px;"></div>
      </div>
    `;
  }

  // Scene 2: The Storm Begins
  renderScene2(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
        <div class="alarm-banner" style="background: #eff6ff; border-color: #2563eb; color: #1e3a8a; max-width: 900px;">
          “${scene.storyText}”
          <button class="speak-icon-btn" onclick="soundEngine.speak('${scene.spokenStory}')" style="margin-left: 8px;">🔊</button>
        </div>

        <!-- CLIL Vocabulary Spotlight -->
        <div class="clil-concept-banner">
          <div class="clil-badge-icon">${scene.clilVocab.icon}</div>
          <div>
            <div style="font-family: 'Bungee', cursive; font-size: 1.1rem; color: #15803d;">CLIL CONCEPT: ${scene.clilVocab.word}</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #1e293b;">${scene.clilVocab.definition}</div>
          </div>
        </div>

        <div style="width: 100%; max-width: 900px; height: 380px; border-radius: 16px; overflow: hidden; border: 4px solid #1e293b;">
          ${EXPEDITION_SVG.getIslandMapSvg(2)}
        </div>

        <div class="discussion-timer-box">
          <div style="font-size: 1.2rem; font-weight: 800; color: #78350f;">
            “${scene.discussionPrompt}”
          </div>
          <div class="expedition-frame-card">
            🗣️ Sentence Frame: “They should go to <span style="color: #2563eb;">the cave</span> because <span style="color: #2563eb;">it protects them from heavy rain</span>.”
          </div>
        </div>

        <div class="prediction-choices-grid" style="max-width: 900px;">
          ${scene.decisionOptions.map(opt => `
            <div class="prediction-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectPrediction('${opt.id}')">
              <div style="font-weight: 900; font-size: 1.2rem; color: #1e293b;">${opt.text}</div>
              <div style="font-size: 0.85rem; color: #64748b; margin-top: 6px;">${opt.reason}</div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-emerald" style="font-size: 1.3rem; padding: 14px 36px;" onclick="expeditionUI.submitScene2()">
          CONFIRM DECISION & ENTER CAVE ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%; max-width: 900px;"></div>
      </div>
    `;
  }

  // Scene 3: The Cave Riddle & Compass
  renderScene3(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto;">
        <div class="alarm-banner" style="background: #fff; border-color: #ca8a04; color: #1e293b; width: 100%;">
          “${scene.storyText}”
        </div>

        <div class="question-spotlight-box" style="width: 100%; border-color: #eab308;">
          <span class="card-tag" style="background: #ca8a04; color: #fff;">CAVE RIDDLE</span>
          <div class="spotlight-question-text" style="font-size: 1.5rem; white-space: pre-line;">
            "${scene.riddle.text}"
          </div>
          <button class="speak-icon-btn" onclick="soundEngine.speak('${scene.riddle.spoken}')">🔊</button>
        </div>

        <div style="display: flex; gap: 10px; width: 100%; max-width: 600px;">
          <input type="text" id="exp-riddle-input" placeholder="Type answer here (e.g. compass)..." 
                 style="flex: 1; padding: 14px; border-radius: 12px; border: 3px solid #cbd5e1; font-size: 1.2rem; font-weight: 800; font-family: 'Fredoka', sans-serif;"
                 onkeydown="if (event.key === 'Enter') expeditionUI.submitScene3Riddle()">
          <button class="jumbo-btn btn-gold" style="padding: 12px 24px; font-size: 1.1rem;" onclick="expeditionUI.submitScene3Riddle()">
            UNLOCK 🧭
          </button>
        </div>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 4: Swelling River & Hydrology Science
  renderScene4(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto;">
        <div class="alarm-banner" style="background: #eff6ff; border-color: #0284c7; color: #0369a1; width: 100%;">
          “${scene.storyText}”
          <button class="speak-icon-btn" onclick="soundEngine.speak('${scene.spokenStory}')" style="margin-left: 8px;">🔊</button>
        </div>

        <!-- CLIL Hydrology Diagram -->
        <div style="width: 100%;">
          <h3 style="font-family: 'Bungee', cursive; color: #1e40af; font-size: 1.1rem; margin-bottom: 8px;">
            🌊 CLIL SCIENCE: HYDROLOGY & FLOOD CYCLE
          </h3>
          ${EXPEDITION_SVG.getHydrologyDiagramSvg()}
        </div>

        <div class="question-spotlight-box" style="width: 100%;">
          <span class="card-tag">SCIENCE PREDICTION</span>
          <div class="spotlight-question-text" style="font-size: 1.4rem;">
            "${scene.predictionQuestion}"
          </div>
        </div>

        <div class="prediction-choices-grid" style="width: 100%;">
          ${scene.predictionOptions.map(opt => `
            <div class="prediction-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectPrediction('${opt.id}')">
              <div style="font-weight: 900; font-size: 1.15rem; color: #1e293b;">${opt.text}</div>
              <div style="font-size: 0.85rem; color: #64748b; margin-top: 6px;">${opt.reason}</div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-emerald" style="font-size: 1.3rem; padding: 14px 36px;" onclick="expeditionUI.submitScene4()">
          CONFIRM PREDICTION ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 5: Route Decision
  renderScene5(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto;">
        <div class="alarm-banner" style="background: #fff; border-color: #f59e0b; color: #1e293b; width: 100%;">
          “${scene.storyText}”
        </div>

        <div class="discussion-timer-box">
          <div style="font-size: 1.2rem; font-weight: 800; color: #78350f;">
            “${scene.discussionPrompt}”
          </div>
          <div class="expedition-frame-card">
            🗣️ “They should choose Route B because the forest is high ground and safe from river flooding.”
          </div>
        </div>

        <div class="prediction-choices-grid" style="width: 100%;">
          ${scene.routes.map(r => `
            <div class="prediction-choice-card ${r.isSafe ? 'card-safe-route' : ''}" id="opt-pred-${r.id}" onclick="expeditionUI.selectPrediction('${r.id}')">
              <div style="font-weight: 900; font-size: 1.2rem; color: #1e293b;">${r.name}</div>
              <div style="font-size: 0.9rem; font-weight: 800; color: ${r.isSafe ? '#15803d' : '#b91c1c'}; margin-top: 6px;">
                ${r.danger}
              </div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-emerald" style="font-size: 1.3rem; padding: 14px 36px;" onclick="expeditionUI.submitScene5()">
          TAKE CHOSEN ROUTE ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 6: Forest & Animal Habitat
  renderScene6(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto;">
        <div class="alarm-banner" style="background: #f0fdf4; border-color: #16a34a; color: #14532d; width: 100%;">
          “${scene.storyText}”
        </div>

        <div class="clil-concept-banner">
          <div class="clil-badge-icon">🐾 🌳</div>
          <div>
            <div style="font-family: 'Bungee', cursive; color: #15803d;">CLIL CONCEPT: ${scene.clilVocab.word}</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #1e293b;">${scene.clilVocab.definition}</div>
          </div>
        </div>

        <div class="question-spotlight-box" style="width: 100%;">
          <span class="card-tag">HABITAT PREDICTION</span>
          <div class="spotlight-question-text" style="font-size: 1.4rem;">
            "${scene.predictionQuestion}"
          </div>
        </div>

        <div class="prediction-choices-grid" style="width: 100%;">
          ${scene.predictionOptions.map(opt => `
            <div class="prediction-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectPrediction('${opt.id}')">
              <div style="font-weight: 900; font-size: 1.2rem; color: #1e293b;">${opt.text}</div>
              <div style="font-size: 0.85rem; color: #64748b; margin-top: 6px;">${opt.reason}</div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-emerald" style="font-size: 1.3rem; padding: 14px 36px;" onclick="expeditionUI.submitScene6()">
          CONFIRM PREDICTION ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 7: Natural Navigation
  renderScene7(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto;">
        <div class="alarm-banner" style="background: #fef2f2; border-color: #ef4444; color: #991b1b; width: 100%;">
          “${scene.storyText}”
        </div>

        <div style="background: #fff; border: 3px solid #ca8a04; border-radius: var(--radius-lg); padding: 16px; width: 100%;">
          <strong style="color: #b45309; font-size: 1.1rem;">🧭 ${scene.navigationClue}</strong>
        </div>

        <div class="question-spotlight-box" style="width: 100%;">
          <span class="card-tag">GEOGRAPHY DECISION</span>
          <div class="spotlight-question-text" style="font-size: 1.4rem;">
            "${scene.decisionQuestion}"
          </div>
        </div>

        <div class="prediction-choices-grid" style="width: 100%;">
          ${scene.decisionOptions.map(opt => `
            <div class="prediction-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectPrediction('${opt.id}')">
              <div style="font-weight: 900; font-size: 1.2rem; color: #1e293b;">${opt.text}</div>
              <div style="font-size: 0.85rem; color: #64748b; margin-top: 6px;">${opt.reason}</div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-emerald" style="font-size: 1.3rem; padding: 14px 36px;" onclick="expeditionUI.submitScene7()">
          NAVIGATE USING NATURE ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 8: The Volcano & Magma vs Lava
  renderScene8(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto;">
        <div class="alarm-banner" style="background: #fef2f2; border-color: #dc2626; color: #991b1b; width: 100%;">
          “${scene.storyText}”
        </div>

        <!-- Volcano Cross-Section Diagram -->
        <div style="width: 100%;">
          <h3 style="font-family: 'Bungee', cursive; color: #991b1b; font-size: 1.1rem; margin-bottom: 8px;">
            🌋 CLIL EARTH SCIENCE: MAGMA VS LAVA
          </h3>
          ${EXPEDITION_SVG.getVolcanoCrossSectionSvg()}
        </div>

        <div class="question-spotlight-box" style="width: 100%;">
          <span class="card-tag">VOLCANO PREDICTION</span>
          <div class="spotlight-question-text" style="font-size: 1.4rem;">
            "${scene.predictionQuestion}"
          </div>
        </div>

        <div class="prediction-choices-grid" style="width: 100%;">
          ${scene.predictionOptions.map(opt => `
            <div class="prediction-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectPrediction('${opt.id}')">
              <div style="font-weight: 900; font-size: 1.2rem; color: #1e293b;">${opt.text}</div>
              <div style="font-size: 0.85rem; color: #64748b; margin-top: 6px;">${opt.reason}</div>
            </div>
          `).join("")}
        </div>

        <button class="jumbo-btn btn-emerald" style="font-size: 1.3rem; padding: 14px 36px;" onclick="expeditionUI.submitScene8()">
          CONFIRM PREDICTION ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 9: Secret Path & Memory Check
  renderScene9(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto;">
        <div class="alarm-banner" style="background: #fff; border-color: #d97706; color: #1e293b; width: 100%;">
          “${scene.storyText}”
        </div>

        <div class="question-spotlight-box" style="width: 100%; border-color: #dc2626;">
          <span class="card-tag" style="background: #fee2e2; color: #991b1b;">🧠 MEMORY CHECK</span>
          <div class="spotlight-question-text" style="font-size: 1.4rem;">
            "${scene.memoryCheck.question}"
          </div>
        </div>

        <div class="prediction-choices-grid" style="width: 100%;">
          ${scene.memoryCheck.options.map((opt, i) => `
            <button class="choice-card-btn" id="mem-opt-${i}" onclick="expeditionUI.handleScene9Memory(${i})">
              <span class="choice-text" style="font-size: 1.2rem;">${opt.text}</span>
            </button>
          `).join("")}
        </div>

        <div id="scene9-path-choice" style="display: none; width: 100%; flex-direction: column; align-items: center; gap: 14px;">
          <h3 style="font-family: 'Bungee', cursive; color: #1e293b;">Which path should the team take?</h3>
          <div class="prediction-choices-grid" style="width: 100%;">
            ${scene.decisionOptions.map(opt => `
              <div class="prediction-choice-card" id="opt-pred-${opt.id}" onclick="expeditionUI.selectPrediction('${opt.id}')">
                <div style="font-weight: 900; font-size: 1.2rem; color: #1e293b;">${opt.text}</div>
                <div style="font-size: 0.85rem; color: #64748b; margin-top: 6px;">${opt.reason}</div>
              </div>
            `).join("")}
          </div>

          <button class="jumbo-btn btn-gold" style="font-size: 1.3rem; padding: 14px 36px;" onclick="expeditionUI.submitScene9()">
            REACH RESEARCH STATION ➔
          </button>
        </div>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // Scene 10: Research Station Alpha
  renderScene10(scene) {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto;">
        <div class="alarm-banner" style="background: #1e293b; border-color: #38bdf8; color: #f8fafc; width: 100%;">
          ⚡ “${scene.storyText}”
        </div>

        <div style="width: 100%; background: #fff; border: 4px solid #1e293b; border-radius: var(--radius-lg); padding: 20px;">
          <h3 style="font-family: 'Bungee', cursive; color: #0284c7; font-size: 1.3rem; margin-bottom: 12px;">
            🔐 STATION ALPHA: CLUE SYNTHESIS KEYPAD
          </h3>
          <p style="font-weight: 800; color: #334155; margin-bottom: 14px;">
            The blast doors require 4 key concepts discovered throughout your expedition:
          </p>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            ${scene.clueKeys.map(k => `
              <div style="background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 10px; padding: 12px;">
                <div style="font-family: 'Bungee', cursive; font-size: 0.9rem; color: #2563eb;">${k.label}</div>
                <strong style="font-size: 1.2rem; color: #065f46;">KEY: ${k.val}</strong>
                <div style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">${k.desc}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <button class="jumbo-btn btn-gold" style="font-size: 1.4rem; padding: 16px 42px; margin-top: 14px;" onclick="expeditionUI.completeExpedition()">
          ⚡ UNLOCK BLAST DOORS & ENTER STATION 🏛️ ➔
        </button>

        <div id="scene-feedback-area" style="width: 100%;"></div>
      </div>
    `;
  }

  // =========================================================================
  // INTERACTION HANDLERS
  // =========================================================================

  selectPrediction(predId) {
    this.selectedPredictionId = predId;
    document.querySelectorAll(".prediction-choice-card").forEach(c => {
      if (c.id.startsWith("opt-pred-")) c.classList.remove("selected-prediction");
    });
    const card = document.getElementById(`opt-pred-${predId}`);
    if (card) card.classList.add("selected-prediction");
    if (window.soundEngine) window.soundEngine.playClick();
  }

  selectEvidence(evId) {
    this.selectedEvidenceId = evId;
    document.querySelectorAll(".prediction-choice-card").forEach(c => {
      if (c.id.startsWith("opt-ev-")) c.classList.remove("selected-prediction");
    });
    const card = document.getElementById(`opt-ev-${evId}`);
    if (card) card.classList.add("selected-prediction");
    if (window.soundEngine) window.soundEngine.playClick();
  }

  submitScene1() {
    const feedback = document.getElementById("scene-feedback-area");
    if (!this.selectedPredictionId) {
      if (feedback) feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Please choose a prediction!</div></div>`;
      return;
    }

    const res = window.expeditionEngine.recordPrediction(this.selectedPredictionId, "Dark clouds over mountain");
    if (this.selectedEvidenceId === "ev_clouds") {
      window.expeditionEngine.addScore("evidence", 2);
    }
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Great prediction backed by cloud evidence! (+5 Stars). The storm is starting!");
    }

    feedback.innerHTML = `
      <div class="feedback-box">
        <div>
          <div class="feedback-text">🎉 PREDICTION VERIFIED! (+${res.points + 2} Stars)</div>
          <div style="font-weight: 800; color: #065f46; margin-top: 4px;">Rain is starting to fall! The explorers must find shelter.</div>
        </div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(1)">
          GO TO SCENE 2: FIND SHELTER ➔
        </button>
      </div>
    `;
  }

  submitScene2() {
    const feedback = document.getElementById("scene-feedback-area");
    if (!this.selectedPredictionId) return;

    const res = window.expeditionEngine.recordPrediction(this.selectedPredictionId, "Cave protects from storm");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("The cave provides dry stone shelter! (+5 Stars)");
    }

    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🎉 SHELTER SECURED! (+${res.points} Stars)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(2)">
          GO TO SCENE 3: CAVE RIDDLE ➔
        </button>
      </div>
    `;
  }

  submitScene3Riddle() {
    const input = document.getElementById("exp-riddle-input");
    const val = input ? input.value : "";
    const res = window.expeditionEngine.checkRiddle(val);
    const feedback = document.getElementById("scene-feedback-area");

    if (res.success) {
      if (window.soundEngine) {
        window.soundEngine.playFanfare();
        window.soundEngine.speak("Compass unlocked! You know North, South, East, and West!");
      }
      this.updateHeader();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">🧭 COMPASS UNLOCKED! (+3 Stars)</div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(3)">
            GO TO SCENE 4: SWELLING RIVER ➔
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Try again (Hint: C-O-M-P-A-S-S)!</div></div>`;
    }
  }

  submitScene4() {
    if (!this.selectedPredictionId) return;
    const res = window.expeditionEngine.recordPrediction(this.selectedPredictionId, "Heavy rain causes river flooding");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Hydrology prediction correct! The river is flooding the bridge!");
    }

    const feedback = document.getElementById("scene-feedback-area");
    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🌊 SCIENCE PREDICTION VERIFIED! (+${res.points} Stars)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(4)">
          GO TO SCENE 5: ROUTE SELECTION ➔
        </button>
      </div>
    `;
  }

  submitScene5() {
    if (!this.selectedPredictionId) return;
    const res = window.expeditionEngine.recordPrediction(this.selectedPredictionId, "Forest ridge is safe from floods");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Forest trail chosen! High ground keeps the team safe from the flood!");
    }

    const feedback = document.getElementById("scene-feedback-area");
    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🌲 SAFE ROUTE CHOSEN! (+${res.points} Stars)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(5)">
          GO TO SCENE 6: FOREST HABITAT ➔
        </button>
      </div>
    `;
  }

  submitScene6() {
    if (!this.selectedPredictionId) return;
    const res = window.expeditionEngine.recordPrediction(this.selectedPredictionId, "Tracks and berries indicate an animal habitat");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Habitat prediction confirmed! A golden lemur is nearby!");
    }

    const feedback = document.getElementById("scene-feedback-area");
    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🐾 HABITAT DISCOVERED! (+${res.points} Stars)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(6)">
          GO TO SCENE 7: LOST COMPASS ➔
        </button>
      </div>
    `;
  }

  submitScene7() {
    if (!this.selectedPredictionId) return;
    const res = window.expeditionEngine.recordPrediction(this.selectedPredictionId, "Sun position and tree moss indicate North");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Natural navigation successful! The team reaches the mountain plateau!");
    }

    const feedback = document.getElementById("scene-feedback-area");
    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🧭 NATURAL NAVIGATION SUCCESS! (+${res.points} Stars)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(7)">
          GO TO SCENE 8: VOLCANO SIGNS ➔
        </button>
      </div>
    `;
  }

  submitScene8() {
    if (!this.selectedPredictionId) return;
    const res = window.expeditionEngine.recordPrediction(this.selectedPredictionId, "Rising temperature indicates underground magma heat");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Volcano prediction correct! The team must move carefully around the magma vents!");
    }

    const feedback = document.getElementById("scene-feedback-area");
    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🌋 VOLCANO SCIENCE VERIFIED! (+${res.points} Stars)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(8)">
          GO TO SCENE 9: THE SECRET PATH ➔
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
        window.soundEngine.speak("Correct! You remembered the volcanic magma danger!");
      }
      window.expeditionEngine.addScore("clil", 2);
      this.updateHeader();
      if (pathChoice) pathChoice.style.display = "flex";

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">🧠 MEMORY VERIFIED! (+2 Stars) Now select your path!</div>
        </div>
      `;
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Recall what we learned about magma and hot rocks!</div></div>`;
    }
  }

  submitScene9() {
    if (!this.selectedPredictionId) return;
    const res = window.expeditionEngine.recordPrediction(this.selectedPredictionId, "Path B avoids hot magma vents");
    this.updateHeader();

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak("Path B safely reached the research station ridge!");
    }

    const feedback = document.getElementById("scene-feedback-area");
    feedback.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🏛️ STATION REACHED! (+${res.points} Stars)</div>
        <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="expeditionUI.showScene(9)">
          GO TO SCENE 10: FINAL UNLOCK ➔
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
          <p class="sub-heading">The team unlocked the research station blast doors before the storm hit!</p>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 5rem; animation: bounce-success 1s infinite alternate;">🏛️ ⚡ 🧭 🌧️ 👧 👦</div>
          <h2 style="font-family: 'Bungee', cursive; font-size: 1.8rem; color: #1e293b; margin: 12px 0;">
            TOTAL EXPEDITION STARS: ${scores.total} ⭐
          </h2>
        </div>

        <!-- Score Category Breakdown -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0;">
          <div style="background: #eff6ff; border: 3px solid #3b82f6; border-radius: 12px; padding: 14px; text-align: center;">
            <div style="font-family: 'Bungee', cursive; color: #1d4ed8; font-size: 0.9rem;">PREDICTIONS</div>
            <strong style="font-size: 1.5rem; color: #1e40af;">${scores.predictions} ⭐</strong>
          </div>
          <div style="background: #ecfdf5; border: 3px solid #10b981; border-radius: 12px; padding: 14px; text-align: center;">
            <div style="font-family: 'Bungee', cursive; color: #047857; font-size: 0.9rem;">EVIDENCE USE</div>
            <strong style="font-size: 1.5rem; color: #065f46;">${scores.evidence} ⭐</strong>
          </div>
          <div style="background: #fefce8; border: 3px solid #ca8a04; border-radius: 12px; padding: 14px; text-align: center;">
            <div style="font-family: 'Bungee', cursive; color: #854d0e; font-size: 0.9rem;">CLIL SCIENCE</div>
            <strong style="font-size: 1.5rem; color: #a16207;">${scores.clil} ⭐</strong>
          </div>
          <div style="background: #fdf2f8; border: 3px solid #db2777; border-radius: 12px; padding: 14px; text-align: center;">
            <div style="font-family: 'Bungee', cursive; color: #9d174d; font-size: 0.9rem;">REASONING</div>
            <strong style="font-size: 1.5rem; color: #be185d;">${scores.reasoning} ⭐</strong>
          </div>
        </div>

        <!-- Certificate Badge -->
        <div class="award-badge-card" style="border-color: #0284c7; background: #f0f9ff; max-width: 650px; margin: 0 auto 24px;">
          <div class="award-icon">🏆</div>
          <div class="award-title" style="color: #0369a1; font-size: 1.4rem;">GOLDEN EXPLORER COMPASS AWARD</div>
          <p style="font-weight: 800; color: #075985; margin-top: 6px;">
            For predicting weather fronts, understanding flood hydrology, mastering magma vs lava, and navigating using natural landmarks!
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
    this.showScene(0);
  }
}

window.expeditionUI = new ExpeditionUIController();
