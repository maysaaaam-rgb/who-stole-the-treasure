/**
 * THE LAST EXPEDITION: UI CONTROLLER (SIMPLIFIED & HIGH VISUAL)
 * 70%+ Visual presentation, short English sentences, big picture cards,
 * permanent sentence starter chips, and visual science diagrams.
 */

class ExpeditionUIController {
  constructor() {
    this.selectedChoiceId = null;
    this.selectedEvidenceId = null;
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

    this.selectedChoiceId = null;
    this.selectedEvidenceId = null;

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

        <!-- Permanent Sentence Starters Bar (Click to Speak) -->
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
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px;">
        <!-- Visual Story Lines -->
        <div class="visual-story-box">
          ${scene.shortLines.map(line => `
            <div class="story-line-item">
              <span>${line}</span>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${line.replace(/[^\w\s]/gi, '')}')">🔊</button>
            </div>
          `).join("")}
        </div>

        <!-- Big Island Map Canvas -->
        <div style="width: 100%; max-width: 900px; height: 320px; border-radius: 14px; overflow: hidden; border: 4px solid #1e293b;">
          ${EXPEDITION_SVG.getIslandMapSvg(1)}
        </div>

        <!-- Sentence Frame Banner -->
        <div class="discussion-simple-banner">
          <div style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #78350f;">
            🔮 WHAT WILL HAPPEN NEXT?
          </div>
          <div class="sentence-builder-display">
            🗣️ “I think <span style="color: #2563eb;">rain</span> will <span style="color: #2563eb;">start</span> because <span style="color: #2563eb;">dark clouds 🌥️</span>.”
          </div>
        </div>

        <!-- Big Picture Choices -->
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

        <!-- Big Visual Riddle Card -->
        <div class="question-spotlight-box" style="width: 100%; border-color: #eab308; text-align: center;">
          <span class="card-tag" style="background: #ca8a04; color: #fff;">SHORT RIDDLE</span>
          <div class="spotlight-question-text" style="font-size: 1.6rem; white-space: pre-line; margin: 10px 0;">
            "${scene.riddle.text}"
          </div>
          <button class="speak-icon-btn" onclick="soundEngine.speak('${scene.riddle.spoken}')">🔊 Listen</button>
        </div>

        <!-- Visual Choices for Riddle -->
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

        <!-- Big Visual Hydrology Diagram -->
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

        <!-- Big Volcano Cross-Section Diagram -->
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

        <!-- 4 Clues Keys Grid -->
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
  // USER ACTIONS & HANDLERS
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
            For predicting weather, flood water, magma vs lava, and finding North!
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
