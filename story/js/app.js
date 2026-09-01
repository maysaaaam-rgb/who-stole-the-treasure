/**
 * MAIN INTERACTIVE CLASSROOM APPLICATION CONTROLLER
 * STEP INTO THE STORY: THE WIZARD OF OZ (CEFR A1+)
 */

import { STORY_DATA } from './storyData.js';
import { sound } from './audio.js';
import { SceneRenderer } from './scenes.js';
import { AppState } from './state.js';

class StoryApplication {
  constructor() {
    this.stageContainer = null;
    this.teacherDrawer = null;
    this.timerInterval = null;
    this.timerSeconds = 60;
  }

  init() {
    AppState.init();
    this.cacheDom();
    this.bindEvents();
    this.renderCurrentView();
    this.updateTeacherPanel();
  }

  cacheDom() {
    this.stageContainer = document.getElementById('classroom-stage');
    this.teacherDrawer = document.getElementById('teacher-drawer');
    this.navTitle = document.getElementById('nav-lesson-title');
    this.navStepIndicator = document.getElementById('nav-step-indicator');
    this.soundToggleBtn = document.getElementById('btn-sound-toggle');
  }

  bindEvents() {
    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          this.handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.handlePrev();
          break;
        case 't':
        case 'T':
          this.toggleTeacherDrawer();
          break;
        case 'm':
        case 'M':
          this.toggleSound();
          break;
        case 'f':
        case 'F':
          this.toggleFullscreen();
          break;
        case 'h':
        case 'H':
          this.navigateMode('enter_story');
          break;
        case '1':
          sound.play('wind');
          break;
        case '2':
          sound.play('tornado');
          break;
        case '3':
          sound.play('knock');
          break;
        case '4':
          sound.play('lion_roar');
          break;
        case '5':
          sound.play('magic');
          break;
        case '6':
          sound.play('bark');
          break;
        case '7':
          sound.play('fanfare');
          break;
      }
    });

    // Window click for first audio context unlock
    window.addEventListener('click', () => {
      sound.ensureContext();
    }, { once: true });
  }

  // ==========================================
  // NAVIGATION & ROUTING
  // ==========================================

  navigateMode(modeKey) {
    sound.play('pop');
    AppState.setMode(modeKey);
    this.renderCurrentView();
    this.updateTeacherPanel();
    this.updateNavPills();
  }

  handleNext() {
    if (AppState.currentMode === 'story_mode') {
      if (AppState.nextScene()) {
        const currentScene = STORY_DATA.scenes[AppState.currentSceneIndex];
        if (currentScene.soundFx) sound.play(currentScene.soundFx);
        else sound.play('pop');
        this.renderCurrentView();
        this.updateTeacherPanel();
      } else {
        // End of story mode -> jump to Post-Story Activities Hub
        this.navigateMode('activity_memory');
      }
    } else if (AppState.currentMode === 'enter_story') {
      this.navigateMode('prediction_intro');
    } else if (AppState.currentMode === 'prediction_intro') {
      AppState.setSceneIndex(0);
      this.navigateMode('story_mode');
    } else if (AppState.currentMode === 'activity_memory') {
      this.navigateMode('activity_retell');
    } else if (AppState.currentMode === 'activity_retell') {
      this.navigateMode('activity_hotseat');
    } else if (AppState.currentMode === 'activity_hotseat') {
      this.navigateMode('activity_whatif');
    } else if (AppState.currentMode === 'activity_whatif') {
      this.navigateMode('mini_theatre');
    } else if (AppState.currentMode === 'mini_theatre') {
      this.navigateMode('teacher_assessment');
    }
  }

  handlePrev() {
    if (AppState.currentMode === 'story_mode') {
      if (AppState.prevScene()) {
        sound.play('pop');
        this.renderCurrentView();
        this.updateTeacherPanel();
      } else {
        this.navigateMode('prediction_intro');
      }
    } else if (AppState.currentMode === 'prediction_intro') {
      this.navigateMode('enter_story');
    } else if (AppState.currentMode === 'activity_retell') {
      this.navigateMode('activity_memory');
    } else if (AppState.currentMode === 'activity_hotseat') {
      this.navigateMode('activity_retell');
    } else if (AppState.currentMode === 'activity_whatif') {
      this.navigateMode('activity_hotseat');
    } else if (AppState.currentMode === 'mini_theatre') {
      this.navigateMode('activity_whatif');
    } else if (AppState.currentMode === 'teacher_assessment') {
      this.navigateMode('mini_theatre');
    }
  }

  jumpToScene(index) {
    sound.play('pop');
    AppState.setSceneIndex(index);
    AppState.setMode('story_mode');
    const scene = STORY_DATA.scenes[index];
    if (scene.soundFx) sound.play(scene.soundFx);
    this.renderCurrentView();
    this.updateTeacherPanel();
    this.updateNavPills();
  }

  // ==========================================
  // VIEW RENDERING ENGINE
  // ==========================================

  renderCurrentView() {
    if (!this.stageContainer) return;

    switch (AppState.currentMode) {
      case 'enter_story':
        this.renderEnterStory();
        break;
      case 'prediction_intro':
        this.renderPredictionIntro();
        break;
      case 'story_mode':
        this.renderStoryMode();
        break;
      case 'character_mode':
        this.renderCharacterMode();
        break;
      case 'pair_interaction':
        this.renderPairInteraction();
        break;
      case 'story_decisions':
        this.renderStoryDecisions();
        break;
      case 'activity_memory':
        this.renderStoryMemory();
        break;
      case 'activity_retell':
        this.renderRetellMode();
        break;
      case 'activity_hotseat':
        this.renderHotSeat();
        break;
      case 'activity_whatif':
        this.renderWhatIf();
        break;
      case 'mini_theatre':
        this.renderMiniTheatre();
        break;
      case 'teacher_assessment':
        this.renderAssessment();
        break;
      default:
        this.renderEnterStory();
    }
  }

  // --- 1. ENTER THE STORY (PART 1) ---
  renderEnterStory() {
    const data = STORY_DATA.enterTheStory;
    this.navStepIndicator.innerText = "PART 1: ENTER THE STORY";

    this.stageContainer.innerHTML = `
      <div class="view-container enter-story-view">
        <div class="theatre-proscenium">
          <div class="theatre-banner">
            <span class="stage-icon">✨</span>
            <span class="banner-title">STEP INTO THE STORY: THE WIZARD OF OZ</span>
          </div>

          <!-- Section 1A: 5 Visual Clues -->
          <div class="clues-section">
            <h3 class="section-prompt-title">👀 Look at the clues! What can you see?</h3>
            <div class="clues-grid">
              ${data.clues.map(c => `
                <div class="clue-card ${AppState.enterCluesRevealed.has(c.id) ? 'revealed' : ''}" onclick="window.StoryApp.revealClue('${c.id}')">
                  <div class="clue-icon">${c.icon}</div>
                  <div class="clue-name">${c.name}</div>
                  <div class="clue-prompt">${c.prompt}</div>
                  <div class="clue-tap-tag">${AppState.enterCluesRevealed.has(c.id) ? '✅ SEEN' : '👆 TAP TO REVEAL'}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Section 1B: 5 Key Vocabulary with TPR Physical Action Prompts -->
          <div class="vocab-section">
            <h3 class="section-prompt-title">🌟 5 Key Words & Physical Actions</h3>
            <div class="vocab-cards-grid">
              ${data.vocabulary.map((v, i) => `
                <div class="vocab-card ${AppState.activeVocabIndex === i ? 'active-vocab' : ''}" onclick="window.StoryApp.selectVocabCard(${i})">
                  <div class="vocab-top">
                    <span class="vocab-icon">${v.icon}</span>
                    <span class="vocab-word">${v.word}</span>
                  </div>
                  <div class="vocab-action-badge">🤸 ACTION: ${v.action}</div>
                  <div class="vocab-tpr-prompt">"${v.tprPrompt}"</div>
                  <div class="vocab-sentence"><strong>Sentence:</strong> ${v.sentence}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Action Footbar -->
          <div class="view-footbar">
            <button class="primary-action-btn" onclick="window.StoryApp.navigateMode('prediction_intro')">
              🔮 GO TO PREDICTION INTRODUCTION ➔
            </button>
          </div>
        </div>
      </div>
    `;
  }

  revealClue(clueId) {
    sound.play('magic');
    AppState.enterCluesRevealed.add(clueId);
    this.renderEnterStory();
  }

  selectVocabCard(index) {
    sound.play('pop');
    AppState.activeVocabIndex = index;
    this.renderEnterStory();
  }

  // --- 2. PREDICTION INTRODUCTION (PART 2) ---
  renderPredictionIntro() {
    const data = STORY_DATA.predictionIntro;
    this.navStepIndicator.innerText = "PART 2: PREDICTION";

    this.stageContainer.innerHTML = `
      <div class="view-container prediction-view">
        <div class="theatre-proscenium">
          <div class="theatre-banner">
            <span class="stage-icon">🔮</span>
            <span class="banner-title">BEFORE WE READ: MAKE A PREDICTION</span>
          </div>

          <div class="prediction-main-card">
            <div class="prediction-hero-banner">
              <div class="hero-icon-cluster">🌪️ 👧 🏡</div>
              <h2 class="prediction-question">${data.question}</h2>
              <p class="prediction-prompt-text">${data.prompt}</p>
            </div>

            <!-- 3 Visual Choices -->
            <div class="prediction-choices-grid">
              ${data.choices.map(choice => `
                <button class="prediction-btn ${AppState.selectedPrediction === choice.id ? 'selected' : ''}" onclick="window.StoryApp.votePrediction('${choice.id}')">
                  <div class="choice-letter">${choice.id}</div>
                  <div class="choice-icon">${choice.icon}</div>
                  <div class="choice-text">${choice.text}</div>
                  <div class="choice-vote-counter">Votes: <strong>${AppState.predictionVotes[choice.id] || 0}</strong></div>
                </button>
              `).join('')}
            </div>

            <!-- Sentence Frame Support for Partner Discussion -->
            <div class="sentence-frame-container">
              <div class="partner-prompt-bubble">
                <span class="partner-icon">🗣️</span>
                <span><strong>Partner Discussion:</strong> ${data.partnerPrompt}</span>
              </div>
              <div class="sentence-frame-display">
                <span class="frame-label">Say:</span>
                <span class="frame-content">"${data.sentenceFrame}"</span>
              </div>
            </div>

            <!-- Teacher Reveal Banner (Kept hidden until teacher triggers) -->
            ${AppState.predictionRevealed ? `
              <div class="reveal-result-banner anim-bounce-quick">
                <span class="reveal-star">✨</span>
                <span><strong>Story Secret:</strong> Dorothy runs to the house when the storm begins! Let's step into Scene 1 to find out!</span>
              </div>
            ` : ''}

            <div class="view-footbar">
              <button class="secondary-action-btn" onclick="window.StoryApp.togglePredictionReveal()">
                ${AppState.predictionRevealed ? '🔒 HIDE REVEAL' : '✨ REVEAL PREDICTION'}
              </button>
              <button class="primary-action-btn" onclick="window.StoryApp.jumpToScene(0)">
                📖 OPEN THE STORYBOOK (SCENE 1) ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  votePrediction(choiceId) {
    sound.play('pop');
    AppState.selectedPrediction = choiceId;
    AppState.predictionVotes[choiceId] = (AppState.predictionVotes[choiceId] || 0) + 1;
    this.renderPredictionIntro();
  }

  togglePredictionReveal() {
    sound.play('fanfare');
    AppState.predictionRevealed = !AppState.predictionRevealed;
    this.renderPredictionIntro();
  }

  // --- 3. STORY MODE (11 SCENES & 3 STORY STOPS) ---
  renderStoryMode() {
    const scene = STORY_DATA.scenes[AppState.currentSceneIndex];
    const isStop = scene.isStoryStop;

    this.navStepIndicator.innerText = isStop
      ? `🛑 STORY STOP #${scene.stopNumber}`
      : `SCENE ${scene.id} OF 11: ${scene.title.toUpperCase()}`;

    // Generate Stage Visual via SceneRenderer
    const stageVisualHtml = SceneRenderer.renderScene(scene);

    // Build Dialogue / Role cue prompt if present
    let dialoguePromptHtml = '';
    if (scene.dialogueExchange && scene.dialogueExchange.length > 0) {
      dialoguePromptHtml = `
        <div class="scene-dialogue-box">
          <div class="dialogue-header">🎭 CHARACTER LINES</div>
          <div class="dialogue-lines-list">
            ${scene.dialogueExchange.map(d => `
              <div class="dialogue-bubble">
                <span class="actor-avatar">${d.avatar}</span>
                <span class="actor-speaker"><strong>${d.speaker}:</strong></span>
                <span class="actor-text">"${d.text}"</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (scene.characterRole) {
      dialoguePromptHtml = `
        <div class="scene-dialogue-box">
          <div class="dialogue-header">🎭 YOUR TURN: ${scene.characterRole.speaker.toUpperCase()}</div>
          <div class="dialogue-single-cue">
            <span class="actor-avatar">${scene.characterRole.avatar}</span>
            <span class="actor-text-large">"${scene.characterRole.line}"</span>
          </div>
        </div>
      `;
    }

    this.stageContainer.innerHTML = `
      <div class="view-container story-scene-view">
        <div class="theatre-stage-wrapper">
          <!-- Top Scene Header Ribbon -->
          <div class="scene-top-ribbon">
            <div class="scene-location-pill">
              <span class="pill-dot"></span>
              <span>${scene.location || scene.title}</span>
            </div>
            <div class="scene-controls-mini">
              <button class="mini-sound-btn" onclick="window.StoryApp.triggerSceneSound()">
                🔊 PLAY SCENE SOUND
              </button>
            </div>
          </div>

          <!-- Main SVG Stage -->
          <div class="main-svg-viewport" id="svg-viewport-wrapper">
            ${stageVisualHtml}
          </div>

          <!-- Student-facing Role Dialogue Cue (Clean, large text, not full narration) -->
          ${dialoguePromptHtml}

          <!-- Floating Stage Control Toolbar -->
          <div class="stage-nav-toolbar">
            <button class="stage-nav-btn btn-prev" onclick="window.StoryApp.handlePrev()">
              ⬅ BACK
            </button>
            <div class="scene-progress-dots">
              ${STORY_DATA.scenes.map((s, idx) => `
                <div class="dot ${idx === AppState.currentSceneIndex ? 'active' : ''} ${s.isStoryStop ? 'stop-dot' : ''}" title="${s.title}" onclick="window.StoryApp.jumpToScene(${idx})"></div>
              `).join('')}
            </div>
            <button class="stage-nav-btn btn-next" onclick="window.StoryApp.handleNext()">
              NEXT ➔
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind interactive elements inside SVG (like Scene 5 Oil Can)
    this.bindSceneInteractiveProps(scene);
  }

  bindSceneInteractiveProps(scene) {
    if (scene.id === 5) {
      const oilCanEl = document.getElementById('oil-can-interactive');
      if (oilCanEl) {
        oilCanEl.addEventListener('click', () => {
          sound.play('oil');
          const tinman = document.getElementById('tinman-character');
          if (tinman) {
            tinman.classList.remove('anim-stiff');
            tinman.classList.add('anim-breath');
          }
          const leftArm = document.getElementById('tin-left-arm');
          const rightArm = document.getElementById('tin-right-arm');
          if (leftArm) leftArm.style.transform = 'rotate(45deg)';
          if (rightArm) rightArm.style.transform = 'rotate(-45deg)';
          sound.play('success');
        });
      }
    }
  }

  triggerSceneSound() {
    const scene = STORY_DATA.scenes[AppState.currentSceneIndex];
    if (scene.soundFx) sound.play(scene.soundFx);
    else sound.play('magic');
  }

  handleStoryStopChoice(buttonEl, isCorrect) {
    const container = document.getElementById('stop-options-container');
    if (container) {
      container.querySelectorAll('.choice-card-btn').forEach(btn => btn.classList.remove('selected', 'correct-pick'));
    }
    buttonEl.classList.add('selected');
    if (isCorrect) {
      sound.play('success');
      buttonEl.classList.add('correct-pick');
    } else {
      sound.play('pop');
    }
  }

  revealStoryStopAnswer(stopNum) {
    sound.play('fanfare');
    const container = document.getElementById('stop-options-container');
    if (container) {
      container.querySelectorAll('.choice-card-btn').forEach(btn => {
        if (btn.dataset.correct === "true") {
          btn.classList.add('revealed-correct');
        }
      });
    }
  }

  // --- 4. CHARACTER MODE (PART 4) ---
  renderCharacterMode() {
    this.navStepIndicator.innerText = "CHARACTER BADGES & SCRIPT CARDS";
    const selectedChar = STORY_DATA.characters.find(c => c.id === AppState.selectedCharacterId) || STORY_DATA.characters[0];

    this.stageContainer.innerHTML = `
      <div class="view-container character-mode-view">
        <div class="theatre-proscenium">
          <div class="theatre-banner">
            <span class="stage-icon">🎭</span>
            <span class="banner-title">CHARACTER MODE: BECOME THE STORY</span>
          </div>

          <!-- Character Selector Badges -->
          <div class="character-badges-row">
            ${STORY_DATA.characters.map(char => `
              <button class="char-tab-btn ${char.id === selectedChar.id ? 'active-char' : ''}" onclick="window.StoryApp.selectCharacter('${char.id}')">
                <span class="char-avatar">${char.avatar}</span>
                <span class="char-name">${char.name}</span>
              </button>
            `).join('')}
          </div>

          <!-- Big Character Card -->
          <div class="character-card-display" style="border-top-color: ${selectedChar.color};">
            <div class="char-card-header">
              <div class="char-hero-avatar">${selectedChar.avatar}</div>
              <div class="char-identity-info">
                <h2 class="char-display-name">${selectedChar.name}</h2>
                <div class="char-attributes-row">
                  <div class="attribute-pill feeling-pill">
                    <span class="attr-label">FEELING:</span>
                    <span class="attr-val">${selectedChar.feeling}</span>
                  </div>
                  <div class="attribute-pill goal-pill">
                    <span class="attr-label">GOAL:</span>
                    <span class="attr-val">${selectedChar.goal}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Character Lines Prompter -->
            <div class="char-lines-section">
              <div class="lines-title">🗣️ SHORT CHARACTER LINES (A1+):</div>
              <div class="char-lines-grid">
                ${selectedChar.lines.map((line, idx) => `
                  <div class="character-line-card" onclick="window.StoryApp.cueCharacterTurn('${selectedChar.name}', '${line}')">
                    <span class="line-num">${idx + 1}</span>
                    <span class="line-quote">"${line}"</span>
                    <span class="line-cue-btn">🎭 CUE</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Classroom Props Suggestion -->
            <div class="char-props-box">
              <span class="props-icon">👒</span>
              <span><strong>Classroom Prop / Gesture:</strong> ${selectedChar.props}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  selectCharacter(charId) {
    sound.play('pop');
    AppState.selectedCharacterId = charId;
    this.renderCharacterMode();
    this.updateTeacherPanel();
  }

  cueCharacterTurn(name, line) {
    sound.play('magic');
    this.showFloatingCueModal(name, line);
  }

  showFloatingCueModal(name, line) {
    const modal = document.createElement('div');
    modal.className = 'cue-banner-modal anim-bounce-quick';
    modal.innerHTML = `
      <div class="cue-modal-card">
        <div class="cue-tag">🎭 YOUR TURN: ${name.toUpperCase()}</div>
        <div class="cue-line">"${line}"</div>
        <button class="cue-close-btn" onclick="this.parentElement.parentElement.remove()">DONE ✨</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // --- 5. STUDENT-TO-STUDENT PAIR TALK ---
  renderPairInteraction() {
    this.navStepIndicator.innerText = "STUDENT-TO-STUDENT INTERACTION";
    const dialogue = STORY_DATA.studentDialogues[AppState.activeDialogueIndex];

    this.stageContainer.innerHTML = `
      <div class="view-container pair-talk-view">
        <div class="theatre-proscenium">
          <div class="theatre-banner">
            <span class="stage-icon">💬</span>
            <span class="banner-title">PAIR TALK: TALK WITH YOUR PARTNER</span>
          </div>

          <!-- Dialogue Selector Tabs -->
          <div class="dialogue-tabs-row">
            ${STORY_DATA.studentDialogues.map((d, i) => `
              <button class="tab-btn ${i === AppState.activeDialogueIndex ? 'active-tab' : ''}" onclick="window.StoryApp.selectDialogue(${i})">
                ${d.title}
              </button>
            `).join('')}
          </div>

          <div class="dialogue-exchange-stage">
            <div class="pair-speakers-layout">
              <!-- Student A -->
              <div class="pair-card student-a-card">
                <div class="speaker-tag">STUDENT A (${dialogue.speakerA.role})</div>
                <div class="speaker-speech-bubble">
                  "${dialogue.speakerA.prompt}"
                </div>
              </div>

              <!-- Interactive Exchange Arrow -->
              <div class="exchange-arrow-icon">➔</div>

              <!-- Student B -->
              <div class="pair-card student-b-card">
                <div class="speaker-tag">STUDENT B (${dialogue.speakerB.role})</div>
                <div class="speaker-speech-bubble">
                  "${dialogue.speakerB.prompt}"
                </div>
              </div>
            </div>

            <!-- Follow-up or Response Frames -->
            ${dialogue.followUpA ? `
              <div class="pair-speakers-layout follow-up-layout">
                <div class="pair-card student-a-card">
                  <div class="speaker-tag">STUDENT A: Follow-up</div>
                  <div class="speaker-speech-bubble">"${dialogue.followUpA.prompt}"</div>
                </div>
                <div class="exchange-arrow-icon">➔</div>
                <div class="pair-card student-b-card">
                  <div class="speaker-tag">STUDENT B: Answer</div>
                  <div class="speaker-speech-bubble">"${dialogue.followUpB.prompt}"</div>
                </div>
              </div>
            ` : ''}

            ${dialogue.responses ? `
              <div class="response-chips-row">
                <span class="chips-title">Agree / Disagree options:</span>
                ${dialogue.responses.map(r => `<span class="resp-chip">${r}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  selectDialogue(index) {
    sound.play('pop');
    AppState.activeDialogueIndex = index;
    this.renderPairInteraction();
  }

  // --- 6. CHOOSE THE STORY (DECISION POINTS) ---
  renderStoryDecisions() {
    this.navStepIndicator.innerText = "CHOOSE THE STORY: DECISION POINTS";
    const decision = STORY_DATA.storyDecisions[AppState.activeDecisionIndex];

    this.stageContainer.innerHTML = `
      <div class="view-container story-decision-view">
        <div class="theatre-proscenium">
          <div class="theatre-banner">
            <span class="stage-icon">🗺️</span>
            <span class="banner-title">DECISION POINT: ${decision.sceneTitle.toUpperCase()}</span>
          </div>

          <div class="decision-main-card">
            <!-- 1. The Problem -->
            <div class="decision-problem-box">
              <span class="problem-tag">1. THE PROBLEM</span>
              <h2 class="problem-heading">${decision.problem}</h2>
            </div>

            <!-- 2. The Choices -->
            <div class="decision-choices-grid">
              ${decision.options.map(opt => `
                <div class="decision-choice-card ${AppState.decisionChoices[decision.id] === opt.id ? 'active-choice' : ''}" onclick="window.StoryApp.selectDecisionChoice('${decision.id}', '${opt.id}')">
                  <div class="opt-letter">${opt.id}</div>
                  <div class="opt-icon">${opt.icon}</div>
                  <div class="opt-text">${opt.text}</div>
                  <div class="opt-frame">Say: "${opt.sentence}"</div>
                  ${AppState.decisionRevealed && AppState.decisionChoices[decision.id] === opt.id ? `
                    <div class="opt-outcome anim-bounce-quick">
                      <strong>Outcome:</strong> ${opt.outcome}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>

            <!-- Action Footbar -->
            <div class="view-footbar">
              <button class="secondary-action-btn" onclick="window.StoryApp.toggleDecisionReveal()">
                ${AppState.decisionRevealed ? '🔒 HIDE OUTCOME' : '✨ REVEAL THE STORY OUTCOME'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  selectDecisionChoice(decisionId, optId) {
    sound.play('pop');
    AppState.decisionChoices[decisionId] = optId;
    this.renderStoryDecisions();
  }

  toggleDecisionReveal() {
    sound.play('fanfare');
    AppState.decisionRevealed = !AppState.decisionRevealed;
    this.renderStoryDecisions();
  }

  // --- 7. POST-STORY ACTIVITY 1: STORY MEMORY (8 CARDS) ---
  renderStoryMemory() {
    this.navStepIndicator.innerText = "POST-STORY 1: STORY MEMORY SEQUENCING";

    this.stageContainer.innerHTML = `
      <div class="view-container memory-view">
        <div class="theatre-proscenium">
          <div class="theatre-banner">
            <span class="stage-icon">🧩</span>
            <span class="banner-title">POST-STORY 1: PUT THE STORY IN ORDER (1 ➔ 8)</span>
          </div>

          <!-- Sentence Starters Bar -->
          <div class="memory-frames-bar">
            ${STORY_DATA.storyMemory.sentenceFrames.map(f => `
              <span class="memory-frame-tag">"${f}"</span>
            `).join('')}
          </div>

          <!-- 8 Sequence Slots -->
          <div class="memory-slots-row">
            ${AppState.memorySlots.map((card, idx) => `
              <div class="memory-slot ${card ? 'filled' : 'empty'}" onclick="window.StoryApp.removeMemoryCardFromSlot(${idx})">
                <div class="slot-num">${idx + 1}</div>
                ${card ? `
                  <div class="slotted-card">
                    <div class="slotted-mini-img">${SceneRenderer.getMemoryCardSvg(card.id)}</div>
                    <div class="slotted-title">${card.title}</div>
                  </div>
                ` : `
                  <div class="slot-placeholder">Tap card below</div>
                `}
              </div>
            `).join('')}
          </div>

          <!-- Available Card Deck Pool -->
          <div class="memory-deck-section">
            <div class="deck-title">🎴 AVAILABLE STORY EVENT CARDS (Click to place in next slot):</div>
            <div class="memory-deck-grid">
              ${AppState.memoryDeck.map(card => `
                <button class="deck-card-btn" onclick="window.StoryApp.placeMemoryCardInSlot(${card.id})">
                  <div class="deck-card-thumb">${SceneRenderer.getMemoryCardSvg(card.id)}</div>
                  <span class="card-title">${card.title}</span>
                  <span class="card-desc">${card.desc}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Feedback & Controls -->
          <div class="view-footbar">
            <button class="secondary-action-btn" onclick="window.StoryApp.resetMemoryBoard()">
              🔄 RESET CARDS
            </button>
            <button class="primary-action-btn" onclick="window.StoryApp.checkMemoryOrder()">
              ✅ CHECK SEQUENCE ORDER
            </button>
          </div>

          ${AppState.memoryFeedback ? `
            <div class="memory-feedback-banner ${AppState.memoryFeedback.isSuccess ? 'success' : 'retry'} anim-bounce-quick">
              ${AppState.memoryFeedback.message}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  placeMemoryCardInSlot(cardId) {
    const cardIdx = AppState.memoryDeck.findIndex(c => c.id === cardId);
    if (cardIdx === -1) return;
    const nextSlotIdx = AppState.memorySlots.findIndex(s => s === null);
    if (nextSlotIdx === -1) return;

    sound.play('pop');
    const [card] = AppState.memoryDeck.splice(cardIdx, 1);
    AppState.memorySlots[nextSlotIdx] = card;
    this.renderStoryMemory();
  }

  removeMemoryCardFromSlot(slotIdx) {
    const card = AppState.memorySlots[slotIdx];
    if (!card) return;

    sound.play('pop');
    AppState.memorySlots[slotIdx] = null;
    AppState.memoryDeck.push(card);
    this.renderStoryMemory();
  }

  resetMemoryBoard() {
    sound.play('pop');
    AppState.resetMemoryDeck();
    this.renderStoryMemory();
  }

  checkMemoryOrder() {
    const slots = AppState.memorySlots;
    const isComplete = slots.every(s => s !== null);
    if (!isComplete) {
      sound.play('pop');
      AppState.memoryFeedback = {
        isSuccess: false,
        message: "⚠️ Please place all 8 cards into the slots before checking!"
      };
      this.renderStoryMemory();
      return;
    }

    const isCorrect = slots.every((card, idx) => card.order === (idx + 1));
    if (isCorrect) {
      sound.play('fanfare');
      AppState.memoryFeedback = {
        isSuccess: true,
        message: "🎉 PERFECT ORDER! Great memory, storytellers! Now practice saying: 'First... Then... Next... Finally...'"
      };
    } else {
      sound.play('pop');
      AppState.memoryFeedback = {
        isSuccess: false,
        message: "🤔 Not quite in order yet! Check the sequence and try again."
      };
    }
    this.renderStoryMemory();
  }

  // --- 8. POST-STORY ACTIVITY 2: RETELL MODE (IMAGE-ONLY + HINT PROMPTS) ---
  renderRetellMode() {
    this.navStepIndicator.innerText = "POST-STORY 2: PICTURE RETELL";
    const prompt = STORY_DATA.retellPrompts[AppState.retellIndex];
    const hintLevel = AppState.retellHintsRevealed[AppState.retellIndex] || 0;

    this.stageContainer.innerHTML = `
      <div class="view-container retell-view">
        <div class="theatre-proscenium">
          <div class="theatre-banner">
            <span class="stage-icon">🎨</span>
            <span class="banner-title">POST-STORY 2: LOOK AT THE PICTURE & RETELL</span>
          </div>

          <!-- Retell Scene Step Selector -->
          <div class="retell-nav-steps">
            ${STORY_DATA.retellPrompts.map((p, i) => `
              <button class="retell-step-btn ${i === AppState.retellIndex ? 'active-retell' : ''}" onclick="window.StoryApp.selectRetellScene(${i})">
                <span class="retell-icon">${p.icon}</span>
                <span class="retell-title">${p.title}</span>
              </button>
            `).join('')}
          </div>

          <!-- Main Image-Only Retell Visual Card -->
          <div class="retell-stage-card">
            <div class="retell-scene-badge">SCENE ${prompt.sceneNum}: ${prompt.title}</div>

            <!-- Hint Revealer Box -->
            <div class="retell-hint-box">
              <div class="hint-header">
                <span class="hint-icon">💡</span>
                <span>TEACHER HINT SYSTEM:</span>
                <button class="hint-toggle-btn" onclick="window.StoryApp.advanceRetellHint()">
                  ${hintLevel === 0 ? '➕ REVEAL KEYWORDS (HINT 1)' : hintLevel === 1 ? '➕ REVEAL SENTENCE STARTER (HINT 2)' : hintLevel === 2 ? '➕ REVEAL MODEL OUTPUT' : '🔄 RESET HINTS'}
                </button>
              </div>

              <div class="hints-content">
                ${hintLevel >= 1 ? `
                  <div class="hint-item keywords-hint anim-bounce-quick">
                    <strong>Key Words:</strong>
                    <div class="keyword-tags">
                      ${prompt.keywords.map(k => `<span class="kw-tag">${k}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${hintLevel >= 2 ? `
                  <div class="hint-item starter-hint anim-bounce-quick">
                    <strong>Sentence Starter:</strong> "${prompt.starter}"
                  </div>
                ` : ''}

                ${hintLevel >= 3 ? `
                  <div class="hint-item target-hint anim-bounce-quick">
                    <strong>Expected A1+ Retell:</strong> "${prompt.targetOutput}"
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  selectRetellScene(index) {
    sound.play('pop');
    AppState.retellIndex = index;
    this.renderRetellMode();
  }

  advanceRetellHint() {
    sound.play('magic');
    const current = AppState.retellHintsRevealed[AppState.retellIndex] || 0;
    AppState.retellHintsRevealed[AppState.retellIndex] = (current + 1) % 4;
    this.renderRetellMode();
  }

  // --- 9. POST-STORY ACTIVITY 3: CHARACTER HOT SEAT ---
  renderHotSeat() {
    this.navStepIndicator.innerText = "POST-STORY 3: CHARACTER HOT SEAT";
    const char = STORY_DATA.hotSeat.characters.find(c => c.id === AppState.hotSeatCharId) || STORY_DATA.hotSeat.characters[0];

    this.stageContainer.innerHTML = `
      <div class="view-container hotseat-view">
        <div class="theatre-proscenium">
          <div class="theatre-banner">
            <span class="stage-icon">🪑</span>
            <span class="banner-title">POST-STORY 3: CHARACTER HOT SEAT</span>
          </div>

          <!-- Hot Seat Character Picker -->
          <div class="hotseat-char-picker">
            <span class="picker-label">Choose Character in Hot Seat:</span>
            <div class="picker-buttons">
              ${STORY_DATA.hotSeat.characters.map(c => `
                <button class="hotseat-char-btn ${c.id === char.id ? 'active' : ''}" onclick="window.StoryApp.selectHotSeatCharacter('${c.id}')">
                  ${c.avatar} ${c.name}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="hotseat-interactive-grid">
            <!-- Left: Hot Seat Stage Actor -->
            <div class="hotseat-actor-card">
              <div class="actor-throne-icon">🪑</div>
              <div class="actor-avatar-giant">${char.avatar}</div>
              <h2 class="actor-name">${char.name}</h2>
              <div class="actor-tip">One student sits here and answers questions in English!</div>
            </div>

            <!-- Right: Question Menu for the Class -->
            <div class="hotseat-questions-panel">
              <div class="questions-header">🙋 CLASS QUESTION MENU (Click to ask):</div>
              <div class="questions-list">
                ${STORY_DATA.hotSeat.questionList.map(q => `
                  <div class="hotseat-q-card ${AppState.revealedQuestions.has(q.id) ? 'active-q' : ''}" onclick="window.StoryApp.toggleHotSeatQuestion('${q.id}')">
                    <div class="q-main-row">
                      <span class="q-icon">${q.icon}</span>
                      <span class="q-text">${q.text}</span>
                      <span class="q-ask-btn">${AppState.revealedQuestions.has(q.id) ? 'ANSWER ▾' : 'ASK ➔'}</span>
                    </div>
                    ${AppState.revealedQuestions.has(q.id) ? `
                      <div class="character-response-bubble anim-bounce-quick">
                        <span class="resp-avatar">${char.avatar}</span>
                        <span class="resp-text">"${char.sampleAnswers[q.id]}"</span>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  selectHotSeatCharacter(charId) {
    sound.play('pop');
    AppState.hotSeatCharId = charId;
    AppState.revealedQuestions.clear();
    this.renderHotSeat();
  }

  toggleHotSeatQuestion(qId) {
    sound.play('magic');
    if (AppState.revealedQuestions.has(qId)) {
      AppState.revealedQuestions.delete(qId);
    } else {
      AppState.revealedQuestions.add(qId);
    }
    this.renderHotSeat();
  }

  // --- 10. POST-STORY ACTIVITY 4: WHAT IF...? (ALTERNATIVE STORY) ---
  renderWhatIf() {
    this.navStepIndicator.innerText = "POST-STORY 4: WHAT IF...?";
    const scenario = STORY_DATA.whatIfScenarios[AppState.whatIfIndex];

    this.stageContainer.innerHTML = `
      <div class="view-container whatif-view">
        <div class="theatre-proscenium">
          <div class="theatre-banner">
            <span class="stage-icon">💡</span>
            <span class="banner-title">POST-STORY 4: CHANGE THE STORY (WHAT IF...?)</span>
          </div>

          <!-- Scenario Tabs -->
          <div class="whatif-tabs-row">
            ${STORY_DATA.whatIfScenarios.map((s, idx) => `
              <button class="whatif-tab-btn ${idx === AppState.whatIfIndex ? 'active' : ''}" onclick="window.StoryApp.selectWhatIfScenario(${idx})">
                Scenario ${idx + 1}
              </button>
            `).join('')}
          </div>

          <div class="whatif-main-card">
            <h2 class="whatif-prompt-title">❓ "${scenario.prompt}"</h2>

            <!-- Choices Grid -->
            <div class="whatif-choices-grid">
              ${scenario.choices.map((c, i) => `
                <div class="whatif-choice-card ${AppState.selectedWhatIfChoice === i ? 'selected' : ''}" onclick="window.StoryApp.selectWhatIfChoice(${i})">
                  <div class="choice-icon-lg">${c.icon}</div>
                  <div class="choice-text-lg">${c.text}</div>
                  ${AppState.selectedWhatIfChoice === i ? `
                    <div class="whatif-result-box anim-bounce-quick">
                      <strong>New Story Line:</strong> "${c.resultSentence}"
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  selectWhatIfScenario(idx) {
    sound.play('pop');
    AppState.whatIfIndex = idx;
    AppState.selectedWhatIfChoice = null;
    this.renderWhatIf();
  }

  selectWhatIfChoice(choiceIdx) {
    sound.play('fanfare');
    AppState.selectedWhatIfChoice = choiceIdx;
    this.renderWhatIf();
  }

  // --- 11. FINAL PERFORMANCE: MINI-THEATRE ---
  renderMiniTheatre() {
    this.navStepIndicator.innerText = "FINAL PERFORMANCE: MINI-THEATRE";
    const group = STORY_DATA.miniTheatreGroups[AppState.miniTheatreGroupIndex];

    this.stageContainer.innerHTML = `
      <div class="view-container mini-theatre-view">
        <div class="theatre-proscenium">
          <div class="theatre-banner">
            <span class="stage-icon">🎬</span>
            <span class="banner-title">FINAL PERFORMANCE: CLASSROOM MINI-THEATRE</span>
          </div>

          <!-- Group Scene Tabs -->
          <div class="theatre-groups-row">
            ${STORY_DATA.miniTheatreGroups.map((g, i) => `
              <button class="theatre-group-btn ${i === AppState.miniTheatreGroupIndex ? 'active' : ''}" onclick="window.StoryApp.selectMiniTheatreGroup(${i})">
                Group ${g.groupNum}: ${g.title}
              </button>
            `).join('')}
          </div>

          <div class="theatre-performance-card">
            <div class="perf-top-bar">
              <div class="group-actors-roster">
                <strong>Actors in this Scene:</strong>
                ${group.characters.map(c => `<span class="actor-badge">${c}</span>`).join(' ')}
              </div>

              <!-- Rehearsal Timer (30-60 seconds) -->
              <div class="rehearsal-timer-widget">
                <span class="timer-display">⏱️ <strong id="timer-text">${this.timerSeconds}s</strong></span>
                <button class="timer-btn" onclick="window.StoryApp.toggleTimer()">
                  ${this.timerInterval ? '⏸️ PAUSE' : '▶️ START PREP TIMER'}
                </button>
                <button class="timer-reset-btn" onclick="window.StoryApp.resetTimer()">🔄</button>
              </div>
            </div>

            <!-- Group Scene Script Prompter -->
            <div class="perf-script-box">
              <div class="script-title">📜 ACTING SCRIPT:</div>
              <div class="script-lines">
                ${group.lines.map(line => `
                  <div class="script-line-item">
                    <span class="script-star">⭐</span>
                    <span class="script-text">${line}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Finale Celebration Trigger -->
            <div class="perf-actions-row">
              <button class="celebrate-btn" onclick="window.StoryApp.triggerGrandCelebration()">
                🎉 CELEBRATE PERFORMANCE: GREAT STORYTELLERS!
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  selectMiniTheatreGroup(idx) {
    sound.play('pop');
    AppState.miniTheatreGroupIndex = idx;
    this.resetTimer();
    this.renderMiniTheatre();
  }

  toggleTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    } else {
      this.timerInterval = setInterval(() => {
        if (this.timerSeconds > 0) {
          this.timerSeconds--;
          const el = document.getElementById('timer-text');
          if (el) el.innerText = `${this.timerSeconds}s`;
        } else {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
          sound.play('fanfare');
        }
      }, 1000);
    }
    this.renderMiniTheatre();
  }

  resetTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerSeconds = 60;
    const el = document.getElementById('timer-text');
    if (el) el.innerText = '60s';
  }

  triggerGrandCelebration() {
    sound.play('fanfare');
    const modal = document.createElement('div');
    modal.className = 'celebration-modal anim-bounce-quick';
    modal.innerHTML = `
      <div class="celebration-modal-card">
        <div class="celeb-trophy">🏆🎭🌟</div>
        <h1 class="celeb-heading">GREAT STORYTELLERS!</h1>
        <p class="celeb-subtext">You entered the story, spoke with courage, helped your friends, and brought The Wizard of Oz to life!</p>
        <div class="celeb-badges-row">
          <div class="badge-item">🗣️ Brave Speakers</div>
          <div class="badge-item">🤝 Great Teamwork</div>
          <div class="badge-item">✨ Fantastic Imagination</div>
        </div>
        <button class="celeb-close-btn" onclick="this.parentElement.parentElement.remove()">🌟 HURRAY!</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // --- 12. TEACHER ASSESSMENT & OBSERVATION ---
  renderAssessment() {
    this.navStepIndicator.innerText = "TEACHER OBSERVATION & ASSESSMENT";

    this.stageContainer.innerHTML = `
      <div class="view-container assessment-view">
        <div class="theatre-proscenium">
          <div class="theatre-banner">
            <span class="stage-icon">📋</span>
            <span class="banner-title">TEACHER OBSERVATION PANEL (Non-Intrusive)</span>
          </div>

          <div class="assessment-card">
            <div class="rubric-legend">
              <span class="legend-title">Rating Legend (Tap to cycle):</span>
              <span class="legend-tag tag-indep">⭐ Independent</span>
              <span class="legend-tag tag-supp">🟡 With Support</span>
              <span class="legend-tag tag-prac">🔴 Needs Practice</span>
            </div>

            <!-- Student Roster Grid -->
            <div class="assessment-table-wrapper">
              <table class="assessment-table">
                <thead>
                  <tr>
                    <th>Student / Group</th>
                    ${STORY_DATA.assessmentRubric.map(r => `
                      <th title="${r.desc}">${r.name}</th>
                    `).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${AppState.students.map((st, stIdx) => `
                    <tr>
                      <td class="student-name-cell">
                        <input type="text" value="${st.name}" class="student-name-input" onchange="window.StoryApp.updateStudentName(${stIdx}, this.value)">
                      </td>
                      ${STORY_DATA.assessmentRubric.map(r => `
                        <td class="rating-cell" onclick="window.StoryApp.cycleRating(${stIdx}, '${r.id}')">
                          ${this.renderRatingSymbol(st.ratings[r.id] || 1)}
                        </td>
                      `).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Footer Actions -->
            <div class="view-footbar">
              <button class="secondary-action-btn" onclick="window.StoryApp.addStudentRow()">
                ➕ ADD STUDENT / GROUP ROW
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderRatingSymbol(val) {
    if (val === 1) return '<span class="score-badge star-indep">⭐ Independent</span>';
    if (val === 2) return '<span class="score-badge star-supp">🟡 With Support</span>';
    return '<span class="score-badge star-prac">🔴 Needs Practice</span>';
  }

  cycleRating(stIdx, rubricId) {
    sound.play('pop');
    const current = AppState.students[stIdx].ratings[rubricId] || 1;
    AppState.students[stIdx].ratings[rubricId] = (current % 3) + 1;
    this.renderAssessment();
  }

  updateStudentName(stIdx, newName) {
    AppState.students[stIdx].name = newName;
  }

  addStudentRow() {
    sound.play('pop');
    const newId = AppState.students.length + 1;
    AppState.students.push({
      id: newId,
      name: `Student ${newId}`,
      ratings: { listening: 1, speaking: 1, interaction: 1, prediction: 1, roleplay: 1, retelling: 1 }
    });
    this.renderAssessment();
  }

  // ==========================================
  // TEACHER HUD / DRAWER MANAGEMENT
  // ==========================================

  updateTeacherPanel() {
    const drawerEl = document.getElementById('teacher-drawer-body');
    if (!drawerEl) return;

    let guide = { say: "", do: "", next: "" };

    if (AppState.currentMode === 'enter_story') {
      guide = STORY_DATA.enterTheStory.teacherGuide;
    } else if (AppState.currentMode === 'prediction_intro') {
      guide = STORY_DATA.predictionIntro.teacherGuide;
    } else if (AppState.currentMode === 'story_mode') {
      const scene = STORY_DATA.scenes[AppState.currentSceneIndex];
      guide = scene.teacherGuide || { say: "Read the story aloud with passion.", do: "Have students listen and interact.", next: "Proceed to next scene." };
    } else {
      guide = {
        say: "Facilitate student participation and encourage whole-class/pair engagement.",
        do: "Point to sentence starters and prompt student characters.",
        next: "Celebrate learner effort and move to the next activity when ready."
      };
    }

    // Optional scene full narration script for the teacher to read aloud
    let scriptHtml = '';
    if (AppState.currentMode === 'story_mode') {
      const scene = STORY_DATA.scenes[AppState.currentSceneIndex];
      if (scene.narration) {
        scriptHtml = `
          <div class="teacher-script-card">
            <div class="script-header">📖 TEACHER NARRATION SCRIPT (Read Aloud):</div>
            <div class="script-body">
              ${scene.narration.map(p => `<p class="narration-paragraph">${p}</p>`).join('')}
            </div>
          </div>
        `;
      }
    }

    drawerEl.innerHTML = `
      <div class="teacher-hud-container">
        <!-- 3-Pillar 2-Second Clarity -->
        <div class="clarity-pillars-grid">
          <div class="pillar-box pillar-say">
            <div class="pillar-title">🗣️ WHAT DO I SAY?</div>
            <div class="pillar-content">"${guide.say}"</div>
          </div>
          <div class="pillar-box pillar-do">
            <div class="pillar-title">🙌 WHAT DO STUDENTS DO?</div>
            <div class="pillar-content">${guide.do}</div>
          </div>
          <div class="pillar-box pillar-next">
            <div class="pillar-title">➡️ WHAT HAPPENS NEXT?</div>
            <div class="pillar-content">${guide.next}</div>
          </div>
        </div>

        <!-- Full Teacher Narration Script (Story mode only) -->
        ${scriptHtml}

        <!-- Quick Soundboard for Teacher -->
        <div class="quick-soundboard-widget">
          <div class="soundboard-header">🔊 INSTANT SOUNDBOARD (Click anytime):</div>
          <div class="soundboard-grid">
            <button class="sfx-btn" onclick="window.StoryApp.playSound('wind')">🌪️ Wind</button>
            <button class="sfx-btn" onclick="window.StoryApp.playSound('tornado')">🌀 Tornado</button>
            <button class="sfx-btn" onclick="window.StoryApp.playSound('knock')">🚪 Knock</button>
            <button class="sfx-btn" onclick="window.StoryApp.playSound('lion_roar')">🦁 Roar</button>
            <button class="sfx-btn" onclick="window.StoryApp.playSound('magic')">✨ Magic</button>
            <button class="sfx-btn" onclick="window.StoryApp.playSound('bark')">🐕 Bark</button>
            <button class="sfx-btn" onclick="window.StoryApp.playSound('fanfare')">🎺 Fanfare</button>
            <button class="sfx-btn" onclick="window.StoryApp.playSound('crash')">💥 Crash</button>
          </div>
        </div>
      </div>
    `;
  }

  toggleTeacherDrawer() {
    AppState.isTeacherDrawerOpen = !AppState.isTeacherDrawerOpen;
    if (this.teacherDrawer) {
      this.teacherDrawer.classList.toggle('drawer-open', AppState.isTeacherDrawerOpen);
    }
    const toggleBtn = document.getElementById('btn-teacher-toggle');
    if (toggleBtn) {
      toggleBtn.classList.toggle('active-toggle', AppState.isTeacherDrawerOpen);
    }
  }

  toggleSound() {
    const isMuted = sound.toggleMute();
    AppState.isMuted = isMuted;
    if (this.soundToggleBtn) {
      this.soundToggleBtn.innerHTML = isMuted ? '🔇 SOUND OFF' : '🔊 SOUND ON';
      this.soundToggleBtn.classList.toggle('muted', isMuted);
    }
  }

  playSound(sfx) {
    sound.play(sfx);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen error:", err);
      });
      AppState.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        AppState.isFullscreen = false;
      }
    }
  }

  updateNavPills() {
    document.querySelectorAll('.nav-menu-btn').forEach(btn => {
      btn.classList.toggle('active-mode', btn.dataset.mode === AppState.currentMode);
    });
  }
}

// Instantiate and attach to window for HTML event handlers
window.StoryApp = new StoryApplication();
document.addEventListener('DOMContentLoaded', () => {
  window.StoryApp.init();
});
