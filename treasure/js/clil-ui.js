/**
 * CLIL CRIME LAB: UI CONTROLLER
 * Renders the 4 distinct case files, interactive vector crime scenes,
 * question token loggers, progressive hints, memory challenges,
 * evidence boards, and sentence-builder accusation arenas.
 */

class ClilUIController {
  constructor() {
    this.selectedSuspectId = null;
    this.selectedEvidenceIds = new Set();
    this.memoryTimer = null;
    this.memorySecondsLeft = 8;
  }

  init() {
    // Global initialization
  }

  updateScoreboard() {
    const scores = window.clilEngine.scores;
    const sRed = document.getElementById("clil-score-red");
    const sBlue = document.getElementById("clil-score-blue");
    const sGreen = document.getElementById("clil-score-green");
    const sYellow = document.getElementById("clil-score-yellow");

    if (sRed) sRed.textContent = scores.red;
    if (sBlue) sBlue.textContent = scores.blue;
    if (sGreen) sGreen.textContent = scores.green;
    if (sYellow) sYellow.textContent = scores.yellow;
  }

  // =========================================================================
  // SCREEN ROUTING
  // =========================================================================

  showMainHub() {
    const container = document.getElementById("clil-main-view");
    if (!container) return;

    if (window.clilEngine.isAllCasesSolved()) {
      this.renderGrandFinale(container);
      return;
    }

    const cases = CLIL_DATA.cases;
    const status = window.clilEngine.caseStatus;

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1300px;">
        <div class="card-header-banner">
          <span class="card-tag" style="background: #e0e7ff; color: #3730a3;">4TH GRADE CLIL ENGLISH INVESTIGATION</span>
          <h1 class="main-heading">🕵️ CLIL CRIME LAB</h1>
          <p class="sub-heading">Four mysteries happened today across the school! Four teams. Four distinct investigations.</p>
        </div>

        <!-- 4 Team Case Files Grid -->
        <div class="clil-cases-grid-4">
          <!-- 1. Case Red -->
          <div class="case-file-card case-card-red" onclick="clilUI.openCase('red')">
            <span class="case-seal-badge ${status.red.solved ? 'case-seal-solved' : ''}">
              ${status.red.solved ? '✅ SOLVED' : '🔴 CASE 1'}
            </span>
            ${CLIL_SVG.getCaseBadgeSvg('red', 100)}
            <h3 style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #991b1b; margin: 12px 0 4px;">THE MISSING TROPHY</h3>
            <span class="card-tag" style="background: #fee2e2; color: #b91c1c; font-size: 0.75rem;">TEAM RED</span>
            <p style="font-size: 0.85rem; font-weight: 800; color: #475569; margin: 8px 0;">History of Sports + Time</p>
            <div style="font-size: 0.8rem; color: #64748b;">Past Simple Grammar</div>
            <button class="jumbo-btn btn-ruby" style="padding: 8px 18px; font-size: 0.9rem; margin-top: 12px;">
              ${status.red.solved ? 'REVIEW CASE ➔' : 'START INVESTIGATION ➔'}
            </button>
          </div>

          <!-- 2. Case Blue -->
          <div class="case-file-card case-card-blue" onclick="clilUI.openCase('blue')">
            <span class="case-seal-badge ${status.blue.solved ? 'case-seal-solved' : ''}">
              ${status.blue.solved ? '✅ SOLVED' : '🔵 CASE 2'}
            </span>
            ${CLIL_SVG.getCaseBadgeSvg('blue', 100)}
            <h3 style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #1e40af; margin: 12px 0 4px;">SCIENCE LAB MISHAP</h3>
            <span class="card-tag" style="background: #dbeafe; color: #1d4ed8; font-size: 0.75rem;">TEAM BLUE</span>
            <p style="font-size: 0.85rem; font-weight: 800; color: #475569; margin: 8px 0;">States of Matter (Solid/Liquid/Gas)</p>
            <div style="font-size: 0.8rem; color: #64748b;">Past Continuous Grammar</div>
            <button class="jumbo-btn btn-ocean" style="padding: 8px 18px; font-size: 0.9rem; margin-top: 12px;">
              ${status.blue.solved ? 'REVIEW CASE ➔' : 'START INVESTIGATION ➔'}
            </button>
          </div>

          <!-- 3. Case Green -->
          <div class="case-file-card case-card-green" onclick="clilUI.openCase('green')">
            <span class="case-seal-badge ${status.green.solved ? 'case-seal-solved' : ''}">
              ${status.green.solved ? '✅ SOLVED' : '🟢 CASE 3'}
            </span>
            ${CLIL_SVG.getCaseBadgeSvg('green', 100)}
            <h3 style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #065f46; margin: 12px 0 4px;">VANISHING PAINTING</h3>
            <span class="card-tag" style="background: #d1fae5; color: #047857; font-size: 0.75rem;">TEAM GREEN</span>
            <p style="font-size: 0.85rem; font-weight: 800; color: #475569; margin: 8px 0;">Art — Color Mixing</p>
            <div style="font-size: 0.8rem; color: #64748b;">Comparatives Grammar</div>
            <button class="jumbo-btn btn-emerald" style="padding: 8px 18px; font-size: 0.9rem; margin-top: 12px;">
              ${status.green.solved ? 'REVIEW CASE ➔' : 'START INVESTIGATION ➔'}
            </button>
          </div>

          <!-- 4. Case Yellow -->
          <div class="case-file-card case-card-yellow" onclick="clilUI.openCase('yellow')">
            <span class="case-seal-badge ${status.yellow.solved ? 'case-seal-solved' : ''}">
              ${status.yellow.solved ? '✅ SOLVED' : '🟡 CASE 4'}
            </span>
            ${CLIL_SVG.getCaseBadgeSvg('yellow', 100)}
            <h3 style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #854d0e; margin: 12px 0 4px;">LOST EXPLORER'S MAP</h3>
            <span class="card-tag" style="background: #fef9c3; color: #a16207; font-size: 0.75rem;">TEAM YELLOW</span>
            <p style="font-size: 0.85rem; font-weight: 800; color: #475569; margin: 8px 0;">Geography & Compass Directions</p>
            <div style="font-size: 0.8rem; color: #64748b;">Imperatives & Prepositions</div>
            <button class="jumbo-btn btn-gold" style="padding: 8px 18px; font-size: 0.9rem; margin-top: 12px;">
              ${status.yellow.solved ? 'REVIEW CASE ➔' : 'START INVESTIGATION ➔'}
            </button>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 14px; margin-top: 16px;">
          <button class="jumbo-btn btn-ocean" style="font-size: 1.1rem; padding: 12px 28px;" onclick="uiController.showScreen('hub')">
            🏠 ACADEMY MAIN MENU
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) {
        window.soundEngine.speak("Welcome to the CLIL Crime Lab. Four mysteries happened today. Select your team's case file to begin!");
      }
    }, 400);
  }

  // Open specific case
  openCase(caseId, stage = "story") {
    window.clilEngine.setActiveCase(caseId);
    window.clilEngine.caseStatus[caseId].stage = stage;
    this.selectedSuspectId = null;
    this.selectedEvidenceIds.clear();

    const container = document.getElementById("clil-main-view");
    if (!container) return;

    const caseData = window.clilEngine.getActiveCase();
    const state = window.clilEngine.getActiveState();

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1250px; background: ${caseData.bgGradient};">
        <!-- Top Case Ribbon -->
        <div class="card-header-banner" style="background: #fff; border: 4px solid ${caseData.colorCode};">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <div>
              <span class="card-tag" style="background: ${caseData.colorCode}; color: #fff;">${caseData.team} — ${caseData.clilTopic}</span>
              <h2 class="main-heading" style="color: #1e293b; font-size: 1.8rem; margin-top: 4px;">${caseData.title}</h2>
              <div style="font-size: 0.95rem; font-weight: 800; color: #64748b;">Grammar Focus: ${caseData.grammarFocus}</div>
            </div>
            <button class="jumbo-btn btn-ocean" style="padding: 8px 16px; font-size: 0.9rem;" onclick="clilUI.showMainHub()">
              📁 ALL CASES
            </button>
          </div>
        </div>

        <!-- Chief Detective Tokens & Actions Bar -->
        <div class="clil-ribbon-bar">
          <div style="display: flex; gap: 8px; align-items: center;">
            <div class="token-pill-box" title="Questions you can ask the Chief Detective (Teacher)">
              <span>❓ QUESTIONS:</span>
              <strong style="color: ${caseData.colorCode}; font-size: 1.2rem;">${state.questionsLeft}</strong>
            </div>
            <button class="jumbo-btn btn-gold" style="padding: 6px 14px; font-size: 0.85rem;" onclick="clilUI.openQuestionModal()">
              🙋 ASK CHIEF DETECTIVE
            </button>
          </div>

          <div style="display: flex; gap: 8px; align-items: center;">
            <div class="token-pill-box">
              <span>📋 EVIDENCE:</span>
              <strong style="color: #059669; font-size: 1.2rem;">${state.evidence.size}</strong>
            </div>
            <button class="jumbo-btn btn-ruby" style="padding: 6px 14px; font-size: 0.85rem;" onclick="clilUI.openHintModal()">
              💡 REQUEST HINT
            </button>
          </div>
        </div>

        <!-- Investigation Sub-Tabs -->
        <div class="clil-nav-tabs">
          <button class="clil-tab-btn ${stage === 'story' ? 'active-tab' : ''}" onclick="clilUI.openCase('${caseId}', 'story')">
            📖 1. Story & Scene
          </button>
          <button class="clil-tab-btn ${stage === 'riddle1' ? 'active-tab' : ''}" onclick="clilUI.openCase('${caseId}', 'riddle1')">
            🧩 2. Riddle 1
          </button>
          <button class="clil-tab-btn ${stage === 'inspect' ? 'active-tab' : ''}" onclick="clilUI.openCase('${caseId}', 'inspect')">
            🔎 3. Inspect Scene
          </button>
          <button class="clil-tab-btn ${stage === 'riddle2' ? 'active-tab' : ''}" onclick="clilUI.openCase('${caseId}', 'riddle2')">
            🧩 4. Riddle 2
          </button>
          <button class="clil-tab-btn ${stage === 'witness' ? 'active-tab' : ''}" onclick="clilUI.openCase('${caseId}', 'witness')">
            🗣️ 5. Witness
          </button>
          <button class="clil-tab-btn ${stage === 'memory' ? 'active-tab' : ''}" onclick="clilUI.openCase('${caseId}', 'memory')">
            🧠 6. Memory Check
          </button>
          <button class="clil-tab-btn ${stage === 'evidence' ? 'active-tab' : ''}" onclick="clilUI.openCase('${caseId}', 'evidence')">
            📋 7. Evidence Board
          </button>
          <button class="clil-tab-btn ${stage === 'accuse' ? 'active-tab' : ''}" onclick="clilUI.openCase('${caseId}', 'accuse')">
            🚨 8. Accuse & Explain
          </button>
        </div>

        <!-- Stage Body Dynamic Container -->
        <div id="clil-stage-content" style="width: 100%;">
          ${this.renderStageContent(caseId, stage)}
        </div>
      </div>
    `;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // =========================================================================
  // STAGE CONTENT RENDERERS
  // =========================================================================

  renderStageContent(caseId, stage) {
    const caseData = CLIL_DATA.cases[caseId];

    switch (stage) {
      case "story":
        return `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
            <div class="alarm-banner" style="background: #fff; border-color: ${caseData.colorCode}; color: #1e293b; max-width: 850px;">
              “${caseData.story.intro}”
              <button class="speak-icon-btn" onclick="soundEngine.speak('${caseData.story.spokenIntro}')" style="margin-left: 8px;">🔊</button>
            </div>

            <div class="clil-scene-container">
              ${this.getSceneSvgForCase(caseId)}
            </div>

            <div style="display: flex; gap: 12px; margin-top: 12px;">
              <button class="jumbo-btn btn-gold" style="font-size: 1.2rem; padding: 12px 32px;" onclick="clilUI.openCase('${caseId}', 'riddle1')">
                SOLVE RIDDLE 1 ➔
              </button>
            </div>
          </div>
        `;

      case "riddle1":
        return `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto;">
            <div class="question-spotlight-box" style="width: 100%; border-color: ${caseData.colorCode};">
              <span class="card-tag" style="background: ${caseData.colorCode}; color: #fff;">RIDDLE 1</span>
              <div class="spotlight-question-text" style="font-size: 1.5rem; white-space: pre-line;">
                "${caseData.riddle1.text}"
              </div>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${caseData.riddle1.spoken}')">🔊</button>
            </div>

            <div style="display: flex; gap: 10px; width: 100%; max-width: 600px;">
              <input type="text" id="clil-riddle1-input" placeholder="Type your answer here (e.g. clock)..." 
                     style="flex: 1; padding: 14px 18px; border-radius: 12px; border: 3px solid #cbd5e1; font-size: 1.2rem; font-weight: 800; font-family: 'Fredoka', sans-serif;"
                     onkeydown="if (event.key === 'Enter') clilUI.submitRiddle1()">
              <button class="jumbo-btn btn-emerald" style="padding: 12px 24px; font-size: 1.1rem;" onclick="clilUI.submitRiddle1()">
                CHECK ✅
              </button>
            </div>

            <div id="clil-riddle1-feedback" style="width: 100%;"></div>
          </div>
        `;

      case "inspect":
        return `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
            <div class="spotlight-instruction-banner" style="max-width: 850px;">
              🔍 Click on the highlighted crime scene objects to uncover clues!
            </div>

            <div class="clil-scene-container">
              ${this.getSceneSvgForCase(caseId)}
            </div>

            <div id="clil-inspect-feedback" style="width: 100%; max-width: 850px;"></div>

            <button class="jumbo-btn btn-gold" style="font-size: 1.1rem; padding: 10px 24px;" onclick="clilUI.openCase('${caseId}', 'riddle2')">
              GO TO RIDDLE 2 ➔
            </button>
          </div>
        `;

      case "riddle2":
        return `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto;">
            <div class="question-spotlight-box" style="width: 100%; border-color: ${caseData.colorCode};">
              <span class="card-tag" style="background: ${caseData.colorCode}; color: #fff;">RIDDLE 2</span>
              <div class="spotlight-question-text" style="font-size: 1.5rem; white-space: pre-line;">
                "${caseData.riddle2.text}"
              </div>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${caseData.riddle2.spoken}')">🔊</button>
            </div>

            <div style="display: flex; gap: 10px; width: 100%; max-width: 600px;">
              <input type="text" id="clil-riddle2-input" placeholder="Type your answer here..." 
                     style="flex: 1; padding: 14px 18px; border-radius: 12px; border: 3px solid #cbd5e1; font-size: 1.2rem; font-weight: 800; font-family: 'Fredoka', sans-serif;"
                     onkeydown="if (event.key === 'Enter') clilUI.submitRiddle2()">
              <button class="jumbo-btn btn-emerald" style="padding: 12px 24px; font-size: 1.1rem;" onclick="clilUI.submitRiddle2()">
                CHECK ✅
              </button>
            </div>

            <div id="clil-riddle2-feedback" style="width: 100%;"></div>
          </div>
        `;

      case "witness":
        return `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto;">
            <div class="alarm-banner" style="background: #fff; border-color: #3b82f6; width: 100%; text-align: left; padding: 20px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <span style="font-size: 2.5rem;">🎙️</span>
                <div>
                  <h3 style="font-family: 'Bungee', cursive; color: #1e3a8a; font-size: 1.2rem;">${caseData.witnessStatement.speaker}</h3>
                  <p style="font-size: 1.25rem; font-weight: 800; color: #1e293b; margin-top: 4px;">
                    “${caseData.witnessStatement.audioText}”
                  </p>
                </div>
                <button class="speak-icon-btn" onclick="soundEngine.speak('${caseData.witnessStatement.spoken}')">🔊</button>
              </div>

              <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 10px 14px; border-radius: 6px; margin-top: 12px;">
                <strong style="color: #1e40af;">🔑 Key Witness Points:</strong>
                <ul style="margin: 6px 0 0 20px; font-weight: 800; color: #334155;">
                  ${caseData.witnessStatement.keyFacts.map(f => `<li>${f}</li>`).join("")}
                </ul>
              </div>
            </div>

            <button class="jumbo-btn btn-gold" style="font-size: 1.2rem; padding: 12px 32px;" onclick="clilUI.openCase('${caseId}', 'memory')">
              START 8-SECOND MEMORY CHALLENGE ➔
            </button>
          </div>
        `;

      case "memory":
        return `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto;">
            <div class="memory-timer-container" style="width: 100%;">
              <div class="memory-timer-pill" id="clil-mem-timer-pill">⏱️ MEMORY COUNTDOWN: 8s</div>
              <div class="memory-progress-track">
                <div class="memory-progress-bar" id="clil-mem-prog-bar"></div>
              </div>
            </div>

            <div id="clil-mem-question-card" style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 14px;">
              <div class="question-spotlight-box" style="width: 100%; border-color: ${caseData.colorCode};">
                <span class="card-tag">MEMORY QUESTION</span>
                <div class="spotlight-question-text" style="font-size: 1.6rem;">
                  "${caseData.memoryChallenge.question}"
                </div>
                <button class="speak-icon-btn" onclick="soundEngine.speak('${caseData.memoryChallenge.spoken}')">🔊</button>
              </div>

              <div class="choices-grid">
                ${caseData.memoryChallenge.options.map((opt, i) => `
                  <button class="choice-card-btn" id="clil-mem-opt-${i}" onclick="clilUI.handleMemoryAnswer(${i})">
                    <span class="choice-text" style="font-size: 1.25rem;">"${opt.text}"</span>
                  </button>
                `).join("")}
              </div>

              <div id="clil-memory-feedback" style="width: 100%;"></div>
            </div>
          </div>
        `;

      case "evidence":
        const evidenceSet = window.clilEngine.getActiveState().evidence;
        const allEv = [caseData.riddle1.revealedEvidence, caseData.riddle2.revealedEvidence];

        return `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%;">
            <div class="spotlight-instruction-banner">
              📋 Team Evidence Pinboard — Collected clues and forensic proof
            </div>

            <div class="evidence-pinboard-grid">
              ${allEv.map(ev => {
                const isUnlocked = evidenceSet.has(ev.id);
                return `
                  <div class="pinned-evidence-card" style="opacity: ${isUnlocked ? '1' : '0.5'};">
                    <div class="evidence-pin-head"></div>
                    <h4 style="font-family: 'Bungee', cursive; font-size: 1.1rem; color: #78350f; margin-bottom: 6px;">
                      ${isUnlocked ? ev.title : '🔒 UNLOCK VIA RIDDLE'}
                    </h4>
                    <p style="font-size: 0.95rem; font-weight: 800; color: #334155;">
                      ${isUnlocked ? ev.description : 'Solve the case riddles to pin this evidence to your board!'}
                    </p>
                  </div>
                `;
              }).join("")}
            </div>

            <button class="jumbo-btn btn-ruby" style="font-size: 1.3rem; padding: 14px 36px; margin-top: 14px;" onclick="clilUI.openCase('${caseId}', 'accuse')">
              🚨 MAKE FINAL ACCUSATION ➔
            </button>
          </div>
        `;

      case "accuse":
        return `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%;">
            <div class="alarm-banner" style="background: #fee2e2; border-color: #ef4444; color: #991b1b; width: 100%;">
              🚨 FINAL ACCUSATION ARENA: Who is responsible? Select suspect and 2 pieces of evidence!
            </div>

            <!-- Suspects Lineup -->
            <div class="suspects-lineup-grid">
              ${caseData.suspects.map(s => `
                <div class="suspect-lineup-card ${this.selectedSuspectId === s.id ? 'suspect-selected' : ''}" 
                     id="suspect-card-${s.id}" onclick="clilUI.selectSuspect('${s.id}')">
                  ${CLIL_SVG.getSuspectAvatarSvg(s.avatarClass, 90)}
                  <h4 style="font-family: 'Bungee', cursive; font-size: 1.15rem; color: #1e293b; margin: 8px 0 4px;">${s.name}</h4>
                  <p style="font-size: 0.85rem; font-weight: 800; color: #475569;">${s.statement}</p>
                </div>
              `).join("")}
            </div>

            <!-- Evidence Selector Checks -->
            <div style="background: #fff; border: 3px solid #cbd5e1; border-radius: var(--radius-lg); padding: 16px; width: 100%; max-width: 850px;">
              <h4 style="font-family: 'Bungee', cursive; color: #1e293b; margin-bottom: 10px;">Select Supporting Evidence (Must select 2):</h4>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="display: flex; align-items: center; gap: 8px; font-weight: 800; cursor: pointer;">
                  <input type="checkbox" value="${caseData.riddle1.revealedEvidence.id}" onchange="clilUI.toggleEvidence('${caseData.riddle1.revealedEvidence.id}')">
                  <span>${caseData.riddle1.revealedEvidence.title} (${caseData.riddle1.revealedEvidence.shortText})</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; font-weight: 800; cursor: pointer;">
                  <input type="checkbox" value="${caseData.riddle2.revealedEvidence.id}" onchange="clilUI.toggleEvidence('${caseData.riddle2.revealedEvidence.id}')">
                  <span>${caseData.riddle2.revealedEvidence.title} (${caseData.riddle2.revealedEvidence.shortText})</span>
                </label>
              </div>
            </div>

            <!-- Sentence Frame Builder -->
            <div class="sentence-builder-box">
              <div class="sentence-frame-text">
                “We think <span class="sentence-slot-highlight" id="slot-suspect">[Select Suspect]</span> is responsible because of <span class="sentence-slot-highlight" id="slot-evidence">[Select Evidence]</span>.”
              </div>
            </div>

            <div style="display: flex; gap: 12px;">
              <button class="jumbo-btn btn-ruby" style="font-size: 1.4rem; padding: 16px 42px;" onclick="clilUI.submitAccusation()">
                ⚖️ CONFIRM ACCUSATION ➔
              </button>
            </div>

            <div id="clil-accusation-feedback" style="width: 100%; max-width: 850px; margin-top: 14px;"></div>
          </div>
        `;
    }
  }

  getSceneSvgForCase(caseId) {
    switch (caseId) {
      case "red": return CLIL_SVG.getSportsRoomSceneSvg();
      case "blue": return CLIL_SVG.getScienceLabSceneSvg();
      case "green": return CLIL_SVG.getArtStudioSceneSvg();
      case "yellow": return CLIL_SVG.getSchoolMapSceneSvg();
    }
  }

  // =========================================================================
  // INTERACTION HANDLERS
  // =========================================================================

  submitRiddle1() {
    const input = document.getElementById("clil-riddle1-input");
    const val = input ? input.value : "";
    const res = window.clilEngine.checkRiddle1(val);
    const feedback = document.getElementById("clil-riddle1-feedback");

    if (res.success) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(`Correct! You earned ${res.points} stars and unlocked new evidence!`);
      }
      this.updateScoreboard();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div>
            <div class="feedback-text">🎉 RIDDLE 1 SOLVED! (+${res.points} Stars)</div>
            <div style="font-weight: 800; color: #065f46; margin-top: 4px;">Unlocked: ${res.evidence.title}</div>
          </div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="clilUI.openCase('${window.clilEngine.activeCaseId}', 'inspect')">
            INSPECT CRIME SCENE ➔
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Not quite! Try again or ask for a hint!");
      }
      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Hmm... try again or request a hint!</div>
        </div>
      `;
    }
  }

  submitRiddle2() {
    const input = document.getElementById("clil-riddle2-input");
    const val = input ? input.value : "";
    const res = window.clilEngine.checkRiddle2(val);
    const feedback = document.getElementById("clil-riddle2-feedback");

    if (res.success) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(`Correct! You earned ${res.points} stars and pinned new evidence!`);
      }
      this.updateScoreboard();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div>
            <div class="feedback-text">🎉 RIDDLE 2 SOLVED! (+${res.points} Stars)</div>
            <div style="font-weight: 800; color: #065f46; margin-top: 4px;">Unlocked: ${res.evidence.title}</div>
          </div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="clilUI.openCase('${window.clilEngine.activeCaseId}', 'witness')">
            HEAR WITNESS STATEMENT ➔
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Try again or ask for a hint!");
      }
      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Check your spelling or request a hint from the Chief Detective!</div>
        </div>
      `;
    }
  }

  inspectSceneObject(objectId) {
    const res = window.clilEngine.inspectObject(objectId);
    const feedback = document.getElementById("clil-inspect-feedback");
    if (res.success && feedback) {
      if (window.soundEngine) {
        window.soundEngine.playClue();
        window.soundEngine.speak(res.object.hint);
      }
      this.updateScoreboard();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">🔍 INSPECTED: ${res.object.name} (+1 Star)</div>
          <div style="font-weight: 800; color: #065f46; margin-top: 4px;">${res.object.hint}</div>
        </div>
      `;
    }
  }

  handleMemoryAnswer(choiceIdx) {
    const caseData = window.clilEngine.getActiveCase();
    const opt = caseData.memoryChallenge.options[choiceIdx];
    const feedback = document.getElementById("clil-memory-feedback");
    const btn = document.getElementById(`clil-mem-opt-${choiceIdx}`);

    if (opt.isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak("Correct! You remembered the key detail!");
      }
      btn.classList.add("correct-choice");
      window.clilEngine.addScore(2);
      this.updateScoreboard();

      feedback.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">🧠 MEMORY VERIFIED! (+2 Stars)</div>
          <button class="jumbo-btn btn-emerald" style="padding: 10px 20px; font-size: 1rem;" onclick="clilUI.openCase('${window.clilEngine.activeCaseId}', 'evidence')">
            VIEW EVIDENCE BOARD ➔
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Try to remember what the witness said!");
      }
      btn.classList.add("wrong-choice");
      setTimeout(() => btn.classList.remove("wrong-choice"), 600);

      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Recall the witness statement! Try again!</div>
        </div>
      `;
    }
  }

  selectSuspect(suspectId) {
    this.selectedSuspectId = suspectId;
    document.querySelectorAll(".suspect-lineup-card").forEach(c => c.classList.remove("suspect-selected"));
    const card = document.getElementById(`suspect-card-${suspectId}`);
    if (card) card.classList.add("suspect-selected");

    const caseData = window.clilEngine.getActiveCase();
    const suspect = caseData.suspects.find(s => s.id === suspectId);
    const slot = document.getElementById("slot-suspect");
    if (slot && suspect) slot.textContent = suspect.name;
  }

  toggleEvidence(evId) {
    if (this.selectedEvidenceIds.has(evId)) {
      this.selectedEvidenceIds.delete(evId);
    } else {
      this.selectedEvidenceIds.add(evId);
    }

    const slot = document.getElementById("slot-evidence");
    if (slot) {
      slot.textContent = Array.from(this.selectedEvidenceIds).join(" + ") || "[Select Evidence]";
    }
  }

  submitAccusation() {
    const feedback = document.getElementById("clil-accusation-feedback");
    if (!this.selectedSuspectId) {
      if (feedback) feedback.innerHTML = `<div class="feedback-box error-mode"><div class="feedback-text" style="color: #b91c1c;">Please select a suspect first!</div></div>`;
      return;
    }

    const res = window.clilEngine.evaluateAccusation(this.selectedSuspectId, Array.from(this.selectedEvidenceIds));
    this.updateScoreboard();

    if (res.success) {
      if (window.uiController) window.uiController.triggerConfetti(5000);
      if (window.soundEngine) {
        window.soundEngine.playFanfare();
        window.soundEngine.speak("Case Solved! Outstanding detective work!");
      }

      feedback.innerHTML = `
        <div class="feedback-box" style="background: #ecfdf5; border-color: #10b981;">
          <div>
            <div class="feedback-text" style="color: #065f46; font-size: 1.5rem;">🎉 CASE SOLVED! (+7 Stars)</div>
            <div style="font-weight: 900; color: #047857; font-size: 1.2rem; margin-top: 6px;">
              ${res.suspect.name} was proven responsible through forensic evidence and timeline analysis!
            </div>
          </div>
          <button class="jumbo-btn btn-gold" style="padding: 12px 28px; font-size: 1.1rem;" onclick="clilUI.showMainHub()">
            ${window.clilEngine.isAllCasesSolved() ? '🏆 GRAND FINALE PODIUM ➔' : 'BACK TO CASE FILES ➔'}
          </button>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Your evidence isn't strong enough yet! (-2 Stars). Discuss with your team and review the clues!");
      }

      feedback.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c; font-size: 1.2rem;">
            ❌ ${res.message} (-2 Stars)
          </div>
        </div>
      `;
    }
  }

  // =========================================================================
  // CHIEF DETECTIVE QUESTION MODAL & PROGRESSIVE HINTS
  // =========================================================================

  openQuestionModal() {
    const modal = document.getElementById("clil-question-modal");
    const body = document.getElementById("clil-question-modal-body");
    if (!modal || !body) return;

    const state = window.clilEngine.getActiveState();

    body.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 12px; margin-bottom: 14px;">
        <h3 style="font-family: 'Bungee', cursive; color: #1e293b; font-size: 1.3rem;">🙋 Chief Detective Inquiry</h3>
        <button class="icon-btn" onclick="clilUI.closeQuestionModal()">✕</button>
      </div>

      <div style="margin-bottom: 14px;">
        <p style="font-weight: 800; color: #334155;">
          Ask the teacher (Chief Detective) a YES/NO question in English! (Tokens remaining: <strong>${state.questionsLeft}</strong>)
        </p>
      </div>

      ${state.questionsLeft > 0 ? `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <input type="text" id="clil-ask-input" placeholder="e.g. Is it an object in the sports room?" 
                 style="padding: 12px; border-radius: 8px; border: 2px solid #cbd5e1; font-weight: 800; font-size: 1rem;">
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button class="jumbo-btn btn-emerald" style="padding: 8px 18px; font-size: 0.95rem;" onclick="clilUI.recordTeacherAnswer('YES')">
              ✅ TEACHER SAYS YES
            </button>
            <button class="jumbo-btn btn-ruby" style="padding: 8px 18px; font-size: 0.95rem;" onclick="clilUI.recordTeacherAnswer('NO')">
              ❌ TEACHER SAYS NO
            </button>
          </div>
        </div>
      ` : `
        <div class="alarm-banner" style="background: #fee2e2; color: #991b1b;">
          No question tokens remaining for this case!
        </div>
      `}

      <div style="margin-top: 18px; border-top: 2px solid #e2e8f0; padding-top: 10px;">
        <h4 style="font-family: 'Bungee', cursive; font-size: 1rem; color: #475569;">Inquiry History:</h4>
        <ul style="font-weight: 800; color: #334155; margin-top: 6px;">
          ${window.clilEngine.questionLogs[window.clilEngine.activeCaseId].map(q => `
            <li>“${q.question}” ➔ <strong>${q.answer}</strong></li>
          `).join("") || "<li>No questions asked yet.</li>"}
        </ul>
      </div>
    `;

    modal.classList.add("active");
  }

  recordTeacherAnswer(answer) {
    const input = document.getElementById("clil-ask-input");
    const qText = input ? input.value : "General Inquiry";
    window.clilEngine.recordQuestion(qText, answer);
    this.openQuestionModal();
  }

  closeQuestionModal() {
    const modal = document.getElementById("clil-question-modal");
    if (modal) modal.classList.remove("active");
  }

  openHintModal() {
    const modal = document.getElementById("clil-hint-modal");
    const body = document.getElementById("clil-hint-modal-body");
    if (!modal || !body) return;

    const caseData = window.clilEngine.getActiveCase();
    const state = window.clilEngine.getActiveState();

    body.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 12px; margin-bottom: 14px;">
        <h3 style="font-family: 'Bungee', cursive; color: #b45309; font-size: 1.3rem;">💡 Chief Detective Hints</h3>
        <button class="icon-btn" onclick="clilUI.closeHintModal()">✕</button>
      </div>

      <p style="font-weight: 800; color: #475569; margin-bottom: 12px;">
        Using hints reduces your maximum stars for this riddle (+3 ➔ +2 ➔ +1). Discuss with your team first!
      </p>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button class="jumbo-btn btn-gold" style="padding: 10px 16px; font-size: 0.95rem; text-align: left;" onclick="clilUI.revealHint(1)">
          💡 HINT 1: Small Clue (+2 Stars max)
        </button>
        <div id="clil-hint-1-text" style="display: none; padding: 10px; background: #fefce8; border-radius: 8px; font-weight: 800; color: #854d0e;">
          ${caseData.riddle1.hints[0]}
        </div>

        <button class="jumbo-btn btn-gold" style="padding: 10px 16px; font-size: 0.95rem; text-align: left;" onclick="clilUI.revealHint(2)">
          💡 HINT 2: Strong Clue (+1 Star max)
        </button>
        <div id="clil-hint-2-text" style="display: none; padding: 10px; background: #fefce8; border-radius: 8px; font-weight: 800; color: #854d0e;">
          ${caseData.riddle1.hints[1]}
        </div>

        <button class="jumbo-btn btn-ruby" style="padding: 10px 16px; font-size: 0.95rem; text-align: left;" onclick="clilUI.revealHint(3)">
          🚨 HINT 3: Very Strong Clue (+1 Star max)
        </button>
        <div id="clil-hint-3-text" style="display: none; padding: 10px; background: #fee2e2; border-radius: 8px; font-weight: 800; color: #991b1b;">
          ${caseData.riddle1.hints[2]}
        </div>
      </div>
    `;

    modal.classList.add("active");
  }

  revealHint(hintLevel) {
    window.clilEngine.useHint("r1");
    const el = document.getElementById(`clil-hint-${hintLevel}-text`);
    if (el) el.style.display = "block";
  }

  closeHintModal() {
    const modal = document.getElementById("clil-hint-modal");
    if (modal) modal.classList.remove("active");
  }

  // =========================================================================
  // GRAND FINALE PODIUM
  // =========================================================================

  renderGrandFinale(container) {
    const scores = window.clilEngine.scores;

    container.innerHTML = `
      <div class="adventure-card" style="max-width: 1200px;">
        <div class="card-header-banner">
          <span class="card-tag" style="background: #fef08a; color: #854d0e;">🏆 ACADEMY GRADUATION</span>
          <h1 class="main-heading" style="color: #059669; font-size: 2.2rem;">THE FOUR CASES ARE SOLVED!</h1>
          <p class="sub-heading">All four detective teams solved their mysteries using CLIL science, art, geography, and sports evidence!</p>
        </div>

        <!-- 4 Team Solved Podium -->
        <div class="grand-finale-podium">
          <div class="podium-team-col" style="border-color: #ef4444;">
            <span style="font-size: 3rem;">🏃 🏆</span>
            <h4 style="font-family: 'Bungee', cursive; color: #dc2626;">TEAM RED</h4>
            <div style="font-size: 0.85rem; font-weight: 800; color: #334155; margin: 6px 0;">Case 1 Solved!</div>
            <div style="font-family: 'Bungee', cursive; font-size: 1.4rem; color: #f59e0b;">${scores.red} ⭐</div>
            <span class="card-tag" style="background: #fee2e2; color: #b91c1c; font-size: 0.75rem; margin-top: 8px;">BEST DETECTIVES</span>
          </div>

          <div class="podium-team-col" style="border-color: #3b82f6;">
            <span style="font-size: 3rem;">🧪 🧊</span>
            <h4 style="font-family: 'Bungee', cursive; color: #2563eb;">TEAM BLUE</h4>
            <div style="font-size: 0.85rem; font-weight: 800; color: #334155; margin: 6px 0;">Case 2 Solved!</div>
            <div style="font-family: 'Bungee', cursive; font-size: 1.4rem; color: #f59e0b;">${scores.blue} ⭐</div>
            <span class="card-tag" style="background: #dbeafe; color: #1d4ed8; font-size: 0.75rem; margin-top: 8px;">SCIENCE EXPERTS</span>
          </div>

          <div class="podium-team-col" style="border-color: #10b981;">
            <span style="font-size: 3rem;">🎨 🖌️</span>
            <h4 style="font-family: 'Bungee', cursive; color: #059669;">TEAM GREEN</h4>
            <div style="font-size: 0.85rem; font-weight: 800; color: #334155; margin: 6px 0;">Case 3 Solved!</div>
            <div style="font-family: 'Bungee', cursive; font-size: 1.4rem; color: #f59e0b;">${scores.green} ⭐</div>
            <span class="card-tag" style="background: #d1fae5; color: #047857; font-size: 0.75rem; margin-top: 8px;">RIDDLE SOLVERS</span>
          </div>

          <div class="podium-team-col" style="border-color: #eab308;">
            <span style="font-size: 3rem;">🧭 🗺️</span>
            <h4 style="font-family: 'Bungee', cursive; color: #ca8a04;">TEAM YELLOW</h4>
            <div style="font-size: 0.85rem; font-weight: 800; color: #334155; margin: 6px 0;">Case 4 Solved!</div>
            <div style="font-family: 'Bungee', cursive; font-size: 1.4rem; color: #f59e0b;">${scores.yellow} ⭐</div>
            <span class="card-tag" style="background: #fef9c3; color: #a16207; font-size: 0.75rem; margin-top: 8px;">MASTER NAVIGATORS</span>
          </div>
        </div>

        <div style="display: flex; gap: 14px; justify-content: center; margin-top: 20px;">
          <button class="jumbo-btn btn-ocean" style="font-size: 1.2rem; padding: 14px 28px;" onclick="uiController.showScreen('hub')">
            🏠 MAIN MENU
          </button>
          <button class="jumbo-btn btn-gold" style="font-size: 1.2rem; padding: 14px 28px;" onclick="clilUI.restartAllCases()">
            🔄 RESET ALL CASES
          </button>
        </div>
      </div>
    `;

    if (window.uiController) window.uiController.triggerConfetti(6000);
    if (window.soundEngine) {
      window.soundEngine.playFanfare();
      window.soundEngine.speak("All four cases are solved! Congratulations to all four detective teams!");
    }
  }

  restartAllCases() {
    window.clilEngine.resetAll();
    this.showMainHub();
  }
}

window.clilUI = new ClilUIController();
