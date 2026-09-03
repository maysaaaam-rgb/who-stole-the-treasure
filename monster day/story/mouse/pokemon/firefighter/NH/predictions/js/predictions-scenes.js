/**
 * Predictions Scenes Renderer: High-Impact SVG Comic Illustrations & Dramatic Reveals
 */

const PredictionsScenes = {
  /**
   * 1. INTRO: The Freeze Frame Cliffhanger
   */
  renderIntroFreeze(state) {
    const data = window.PREDICTIONS_DATA.introFreeze;
    const isRevealed = state.introRevealed || false;
    const userChoice = state.introChoice;

    return `
      <div class="pred-scene-container scene-freeze-view">
        <div class="pred-header">
          <div class="pred-title-pill cliff-pill">
            <span class="icon">🔮</span>
            <div class="text-block">
              <h2>Look Carefully! What Will Happen Next?</h2>
              <p class="sub">Observe the clues! The scene is frozen in time. Make your prediction before the reveal!</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Prediction Language ⏳ ➔
          </button>
        </div>

        <div class="freeze-stage-layout">
          <!-- Frozen Comic Scene (SVG) -->
          <div class="comic-freeze-box">
            <div class="freeze-stamp-tag">❄️ FROZEN MOMENT!</div>
            <svg viewBox="0 0 700 400" class="freeze-svg">
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#bae6fd" />
                  <stop offset="100%" stop-color="#e0f2fe" />
                </linearGradient>
              </defs>
              <!-- Background -->
              <rect x="0" y="0" width="700" height="280" fill="url(#skyGrad)" />
              <rect x="0" y="280" width="700" height="120" fill="#86efac" />
              <!-- Pavement -->
              <rect x="0" y="320" width="700" height="80" fill="#cbd5e1" stroke="#94a3b8" stroke-width="4" />

              <!-- Yellow Banana Peel on Sidewalk -->
              <g transform="translate(390, 325)">
                <path d="M 0 15 Q 15 0 35 12 Q 25 30 10 32 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
                <path d="M 12 10 Q 25 -5 40 5" stroke="#ca8a04" stroke-width="2" fill="none" />
                <circle cx="20" cy="8" r="4" fill="#854d0e" />
                <!-- Attention Warning Lines -->
                <line x1="-5" y1="0" x2="-15" y2="-10" stroke="#ef4444" stroke-width="3" />
                <line x1="20" y1="-5" x2="20" y2="-18" stroke="#ef4444" stroke-width="3" />
                <line x1="45" y1="0" x2="55" y2="-10" stroke="#ef4444" stroke-width="3" />
              </g>

              <!-- Running Boy (Mid-Stride) -->
              ${!isRevealed ? `
                <g transform="translate(230, 110)">
                  <!-- Head & Wide Eyes -->
                  <circle cx="60" cy="50" r="30" fill="#fde047" stroke="#eab308" stroke-width="2" />
                  <circle cx="50" cy="45" r="7" fill="#ffffff" />
                  <circle cx="70" cy="45" r="7" fill="#ffffff" />
                  <circle cx="52" cy="45" r="3" fill="#0f172a" />
                  <circle cx="68" cy="45" r="3" fill="#0f172a" />
                  <!-- Open Mouth Shock -->
                  <ellipse cx="60" cy="65" rx="8" ry="10" fill="#b91c1c" />
                  <!-- Running Cap -->
                  <path d="M 30 40 Q 60 15 90 40 L 110 45 Z" fill="#3b82f6" />
                  <!-- Body & Arms -->
                  <rect x="40" y="80" width="40" height="70" rx="8" fill="#ef4444" />
                  <line x1="40" y1="95" x2="0" y2="70" stroke="#ef4444" stroke-width="12" stroke-linecap="round" />
                  <line x1="80" y1="95" x2="130" y2="80" stroke="#ef4444" stroke-width="12" stroke-linecap="round" />
                  <!-- Legs Running Forward Over Banana -->
                  <line x1="50" y1="150" x2="20" y2="210" stroke="#1e3a8a" stroke-width="14" stroke-linecap="round" />
                  <line x1="70" y1="150" x2="150" y2="205" stroke="#1e3a8a" stroke-width="14" stroke-linecap="round" />
                  <!-- Shoes -->
                  <ellipse cx="15" cy="215" rx="14" ry="8" fill="#0f172a" />
                  <ellipse cx="155" cy="210" rx="16" ry="9" fill="#0f172a" />
                </g>
              ` : `
                <!-- REVEALED: Slid & Fallen on Grass! -->
                <g transform="translate(320, 240)">
                  <!-- Impact Stars -->
                  <text x="30" y="-30" font-size="36">💥 ⭐ 💫</text>
                  <!-- Boy Slipping on Back -->
                  <ellipse cx="80" cy="60" rx="60" ry="25" fill="#ef4444" />
                  <circle cx="150" cy="30" r="28" fill="#fde047" stroke="#eab308" stroke-width="2" />
                  <line x1="135" y1="25" x2="145" y2="35" stroke="#000" stroke-width="3" />
                  <line x1="145" y1="25" x2="135" y2="35" stroke="#000" stroke-width="3" />
                  <line x1="155" y1="25" x2="165" y2="35" stroke="#000" stroke-width="3" />
                  <line x1="165" y1="25" x2="155" y2="35" stroke="#000" stroke-width="3" />
                  <!-- Legs Flying in Air -->
                  <line x1="40" y1="50" x2="0" y2="-10" stroke="#1e3a8a" stroke-width="14" stroke-linecap="round" />
                  <line x1="30" y1="50" x2="-20" y2="10" stroke="#1e3a8a" stroke-width="14" stroke-linecap="round" />
                </g>
              `}

              <!-- Chasing Puppy Behind -->
              <g transform="translate(60, 260)">
                <text x="0" y="0" font-size="52">🐶 💨</text>
                <text x="20" y="-20" font-size="16" font-weight="900" fill="#713f12">WOOF!</text>
              </g>
            </svg>
          </div>

          <!-- Prediction Voting & Reveal Controls -->
          <div class="freeze-controls-box">
            <div class="question-banner-card">
              <span class="q-tag">🔮 PREDICTION QUESTION:</span>
              <h2 class="q-title">What will happen next?</h2>
            </div>

            <div class="prediction-choices-list">
              ${data.choices.map(c => `
                <button class="pred-choice-btn ${userChoice === c.id ? 'active' : ''}" onclick="window.predictionsApp.chooseIntroChoice('${c.id}')">
                  <span class="c-text">${c.text}</span>
                  ${userChoice === c.id ? '<span class="c-badge">MY GUESS!</span>' : ''}
                </button>
              `).join('')}
            </div>

            <div class="reveal-action-panel">
              <button class="big-reveal-btn ${!isRevealed ? 'pulse' : 'done'}" onclick="window.predictionsApp.revealIntroEvent()">
                🎬 ${!isRevealed ? 'REVEAL WHAT HAPPENS!' : 'REPLAY THE MOMENT!'}
              </button>
            </div>

            ${isRevealed ? `
              <div class="outcome-pill correct">
                🎉 <strong>REVEAL:</strong> "${data.revealText}"
              </div>
            ` : ''}
          </div>
        </div>

        <div class="pred-action-footer">
          <div class="pred-speech-bubble highlight">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text">
              Say your prediction aloud: <strong>"He will fall!"</strong>
            </span>
          </div>
          <button class="pred-action-btn large primary" onclick="window.predictionsApp.nextStage()">
            Next: Learn the Future Language ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 2. TEACH THE PREDICTION LANGUAGE: Timeline & Formula
   */
  renderPredictionLanguage(state) {
    return `
      <div class="pred-scene-container scene-language-view">
        <div class="pred-header">
          <div class="pred-title-pill lang-pill">
            <span class="icon">⏳</span>
            <div class="text-block">
              <h2>Language of the Future: WILL + VERB</h2>
              <p class="sub">How to predict what will happen in English!</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Look & Predict 👀 ➔
          </button>
        </div>

        <div class="language-timeline-stage">
          <!-- Visual Timeline: NOW vs FUTURE -->
          <div class="timeline-visual-row">
            <div class="timeline-node now-node">
              <span class="node-label">1. NOW</span>
              <div class="node-icon">👦 🍌</div>
              <span class="node-desc">Running toward banana</span>
            </div>

            <div class="timeline-arrow-bridge">
              <span class="arrow-text">TIME MOVES FORWARD</span>
              <span class="bridge-arrow">━━━━━━ 🔮 ━━━━━━➔</span>
            </div>

            <div class="timeline-node future-node">
              <span class="node-label">2. FUTURE (PREDICTION)</span>
              <div class="node-icon">💥 💦</div>
              <span class="node-desc">"He WILL fall!"</span>
            </div>
          </div>

          <!-- Formula Blocks -->
          <div class="formula-banner-card">
            <span class="form-tag">THE PREDICTION FORMULA:</span>
            <div class="formula-blocks-row">
              <div class="f-block blue">
                <span class="f-sub">Subject</span>
                <span class="f-main">He / She / It / They</span>
              </div>
              <span class="f-plus">+</span>
              <div class="f-block purple">
                <span class="f-sub">Future Word</span>
                <span class="f-main">WILL</span>
              </div>
              <span class="f-plus">+</span>
              <div class="f-block green">
                <span class="f-sub">Action (Verb)</span>
                <span class="f-main">fall / run / rain / laugh</span>
              </div>
            </div>
          </div>

          <!-- Example Chips Grid -->
          <div class="prediction-starters-grid">
            <button class="starter-chip" onclick="window.predictionsSound.speak('He will fall.')">
              🔊 "He will fall."
            </button>
            <button class="starter-chip" onclick="window.predictionsSound.speak('She will run.')">
              🔊 "She will run."
            </button>
            <button class="starter-chip" onclick="window.predictionsSound.speak('It will rain.')">
              🔊 "It will rain."
            </button>
            <button class="starter-chip" onclick="window.predictionsSound.speak('They will laugh.')">
              🔊 "They will laugh."
            </button>
          </div>
        </div>

        <div class="adv-action-footer">
          <div class="pred-speech-bubble">
            <span class="bubble-icon">💡</span>
            <span class="bubble-text">Stronger students can add: <strong>"I think..."</strong> or <strong>"Maybe..."</strong></span>
          </div>
          <button class="pred-action-btn large primary" onclick="window.predictionsApp.nextStage()">
            Start Look & Predict ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 3. LOOK & PREDICT: 3 Visual Cases (Melting Ice Cream, Falling Cake, Cupcakes)
   */
  renderLookAndPredict(state) {
    const caseIdx = state.lookPredictIndex || 0;
    const cases = window.PREDICTIONS_DATA.lookPredictCases;
    const curCase = cases[caseIdx];
    const isRevealed = state.lookPredictRevealed || false;

    return `
      <div class="pred-scene-container scene-lookpredict-view">
        <div class="pred-header">
          <div class="pred-title-pill look-pill">
            <span class="icon">👀</span>
            <div class="text-block">
              <h2>Look & Predict (${caseIdx + 1}/${cases.length})</h2>
              <p class="sub">Observe the picture clues carefully. What will happen next?</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Listen & Guess 🎧 ➔
          </button>
        </div>

        <div class="lookpredict-stage-layout">
          <!-- Picture Scene Card -->
          <div class="picture-scene-hero">
            <span class="scene-emoji-large">${curCase.icon}</span>
            <h2 class="scene-hero-title">${curCase.title}</h2>
            <div class="scene-clues-pill">
              🔍 <strong>Visual Clues:</strong> ${curCase.clues}
            </div>
          </div>

          <!-- Prediction & Reveal Box -->
          <div class="predict-reveal-box">
            <span class="box-q-tag">WHAT WILL HAPPEN NEXT?</span>
            <div class="choices-stack">
              ${curCase.choices.map(c => `
                <button class="choice-row-btn" onclick="window.predictionsApp.selectLookChoice(${c.isCorrect})">
                  <span>${c.text}</span>
                </button>
              `).join('')}
            </div>

            <div class="reveal-button-wrap">
              <button class="pred-action-btn primary large" onclick="window.predictionsApp.revealLookPredict()">
                🎬 Reveal What Happens!
              </button>
            </div>

            ${isRevealed ? `
              <div class="revealed-outcome-card">
                <span class="outcome-icon">🎉</span>
                <span class="outcome-text">"${curCase.sentence}"</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="pred-action-footer">
          <button class="pred-action-btn" onclick="window.predictionsSound.speak('${curCase.sentence}')">
            🔊 Speak Outcome Sentence
          </button>
          <button class="pred-action-btn primary large" onclick="window.predictionsApp.nextLookPredictCase()">
            ${caseIdx === cases.length - 1 ? 'Go to Listen & Guess ➔' : 'Next Situation ➔'}
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 4. LISTEN & GUESS: Auditory Scenes (Tom, Rain, Balloons)
   */
  renderListenAndGuess(state) {
    const caseIdx = state.listenGuessIndex || 0;
    const cases = window.PREDICTIONS_DATA.listenGuessCases;
    const curCase = cases[caseIdx];
    const isRevealed = state.listenGuessRevealed || false;

    return `
      <div class="pred-scene-container scene-listenguess-view">
        <div class="pred-header">
          <div class="pred-title-pill listen-pill">
            <span class="icon">🎧</span>
            <div class="text-block">
              <h2>Listen & Guess (${caseIdx + 1}/${cases.length})</h2>
              <p class="sub">Close your eyes and listen to the story! What will happen next?</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Picture Sequences ➔
          </button>
        </div>

        <div class="listenguess-stage-layout">
          <!-- Audio Player Card -->
          <div class="audio-caller-card">
            <span class="audio-hero-icon">${curCase.icon}</span>
            <button class="big-audio-play-btn" onclick="window.predictionsSound.speak('${curCase.audioText}')">
              🔊 <span>TAP TO LISTEN TO THE SCENE</span>
            </button>
            <p class="audio-story-transcript">"${curCase.audioText}"</p>
          </div>

          <!-- Guessing Options Column -->
          <div class="listening-options-column">
            <span class="list-title">WHAT WILL HAPPEN NEXT?</span>
            <div class="choices-stack">
              ${curCase.choices.map(c => `
                <button class="choice-row-btn" onclick="window.predictionsApp.selectListenChoice(${c.isCorrect})">
                  <span>${c.text}</span>
                </button>
              `).join('')}
            </div>

            ${isRevealed ? `
              <div class="revealed-outcome-card">
                <span class="outcome-icon">✅</span>
                <span class="outcome-text">"${curCase.sentence}"</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="pred-action-footer">
          <button class="pred-action-btn" onclick="window.predictionsSound.speak('${curCase.sentence}')">
            🔊 Speak Prediction
          </button>
          <button class="pred-action-btn primary large" onclick="window.predictionsApp.nextListenGuessCase()">
            ${caseIdx === cases.length - 1 ? 'Go to Picture Sequences ➔' : 'Next Listening Story ➔'}
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 5. PICTURE SEQUENCES: 3-Panel Comics
   */
  renderPictureSequences(state) {
    const seqIdx = state.sequenceIndex || 0;
    const seq = window.PREDICTIONS_DATA.sequences[seqIdx];
    const isRevealed = state.sequenceRevealed || false;

    return `
      <div class="pred-scene-container scene-sequences-view">
        <div class="pred-header">
          <div class="pred-title-pill seq-pill">
            <span class="icon">🖼️</span>
            <div class="text-block">
              <h2>Picture Sequences: Story Predictor</h2>
              <p class="sub">Panel 1 and 2 are showing... What will happen in Panel 3?</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: What Will They Do? ➔
          </button>
        </div>

        <div class="sequences-stage-layout">
          <!-- 3-Panel Comic Layout -->
          <div class="comic-trio-row">
            <div class="comic-panel-box">
              <span class="panel-tag">PANEL 1</span>
              <span class="panel-icon-hero">${seq.panel1.icon}</span>
              <p class="panel-desc">${seq.panel1.text}</p>
            </div>

            <div class="comic-arrow-sep">➔</div>

            <div class="comic-panel-box">
              <span class="panel-tag">PANEL 2</span>
              <span class="panel-icon-hero">${seq.panel2.icon}</span>
              <p class="panel-desc">${seq.panel2.text}</p>
            </div>

            <div class="comic-arrow-sep">➔</div>

            <div class="comic-panel-box ${isRevealed ? 'revealed' : 'mystery'}">
              <span class="panel-tag">PANEL 3 (PREDICT!)</span>
              ${!isRevealed ? `
                <span class="mystery-q">❓</span>
                <p class="panel-desc">What will happen in Panel 3?</p>
              ` : `
                <span class="panel-icon-hero">${seq.reveal.icon}</span>
                <p class="panel-desc">${seq.reveal.text}</p>
              `}
            </div>
          </div>

          <!-- Choices & Reveal Control -->
          <div class="panel-choices-row">
            ${seq.panel3Choices.map(c => `
              <button class="seq-choice-btn" onclick="window.predictionsApp.selectSeqChoice(${c.isCorrect})">
                ${c.text}
              </button>
            `).join('')}
            <button class="pred-action-btn primary" onclick="window.predictionsApp.revealSequence()">
              🎬 Reveal Panel 3!
            </button>
          </div>
        </div>

        <div class="pred-action-footer">
          <button class="pred-action-btn" onclick="window.predictionsApp.nextSequence()">
            🎲 Next Comic Story
          </button>
          <button class="pred-action-btn primary large" onclick="window.predictionsApp.nextStage()">
            Go to "What Will They Do?" ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 6. "WHAT WILL HE / SHE DO?"
   */
  renderWhatWillTheyDo(state) {
    const caseIdx = state.whatWillDoIndex || 0;
    const curCase = window.PREDICTIONS_DATA.whatWillDoCases[caseIdx];
    const isRevealed = state.whatWillDoRevealed || false;

    return `
      <div class="pred-scene-container scene-whatwilldo-view">
        <div class="pred-header">
          <div class="pred-title-pill what-pill">
            <span class="icon">🤔</span>
            <div class="text-block">
              <h2>What Will He or She Do?</h2>
              <p class="sub">Observe the character and their situation. Predict their choice!</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Prediction Bingo 🎯 ➔
          </button>
        </div>

        <div class="whatwilldo-stage-layout">
          <div class="character-situation-card">
            <span class="char-header-title">${curCase.character}</span>
            <p class="char-situation-text">"${curCase.situation}"</p>
          </div>

          <div class="items-choice-trio">
            ${curCase.items.map(item => `
              <button class="item-card-btn" onclick="window.predictionsApp.selectWhatWillDoItem(${item.isBest})">
                <span class="item-icon-huge">${item.icon}</span>
                <span class="item-name-label">${item.name}</span>
              </button>
            `).join('')}
          </div>

          ${isRevealed ? `
            <div class="whatwilldo-reveal-banner">
              🎉 <strong>PREDICTION REVEALED:</strong> "${curCase.prediction}"
            </div>
          ` : ''}
        </div>

        <div class="pred-action-footer">
          <button class="pred-action-btn" onclick="window.predictionsApp.nextWhatWillDoCase()">
            🎲 Next Character Scenario
          </button>
          <button class="pred-action-btn primary large" onclick="window.predictionsApp.nextStage()">
            Start Prediction Bingo ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 7. PREDICTION BINGO: 3x3 Interactive Touch Board
   */
  renderPredictionBingo(state) {
    const board = state.bingoBoard || window.PREDICTIONS_DATA.bingoBoard;

    return `
      <div class="pred-scene-container scene-bingo-view">
        <div class="pred-header">
          <div class="pred-title-pill bingo-pill">
            <span class="icon">🎯</span>
            <div class="text-block">
              <h2>Prediction Bingo!</h2>
              <p class="sub">Tap any square when you predict that action! Try to get 3 in a row!</p>
            </div>
          </div>
          <button class="pred-action-btn" onclick="window.predictionsApp.resetBingo()">
            🔄 Reset Board
          </button>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Crazy Predictions ➔
          </button>
        </div>

        <div class="bingo-stage-layout">
          <div class="bingo-3x3-grid">
            ${board.map(cell => `
              <button class="bingo-cell-btn ${cell.marked ? 'marked' : ''}" onclick="window.predictionsApp.toggleBingoCell('${cell.id}')">
                <span class="cell-text">${cell.text}</span>
                ${cell.marked ? '<span class="bingo-stamp">⭐</span>' : ''}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="pred-action-footer">
          <div class="pred-speech-bubble highlight">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text">When you mark a square, say: <strong>"I think they will [action]!"</strong></span>
          </div>
          <button class="pred-action-btn primary large" onclick="window.predictionsApp.nextStage()">
            Next: Crazy Predictions ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 8. CRAZY PREDICTIONS: Duck with Backpack!
   */
  renderCrazyPredictions(state) {
    const scenarioIdx = state.crazyScenarioIndex || 0;
    const scenarios = window.PREDICTIONS_DATA.crazyScenarios;
    const curScenario = scenarios[scenarioIdx];

    return `
      <div class="pred-scene-container scene-crazy-view">
        <div class="pred-header">
          <div class="pred-title-pill crazy-pill">
            <span class="icon">🤪</span>
            <div class="text-block">
              <h2>Crazy Predictions Adventure!</h2>
              <p class="sub">There is no single correct answer! What funny thing will happen next?</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.adviceApp ? window.predictionsApp.nextStage() : window.predictionsApp.nextStage()">
            Next: Prediction Detectives ➔
          </button>
        </div>

        <div class="crazy-stage-layout">
          <div class="crazy-scenario-card">
            <span class="crazy-hero-emoji">${curScenario.image}</span>
            <h1 class="crazy-headline">"${curScenario.scenario}"</h1>
          </div>

          <div class="crazy-ideas-grid">
            ${curScenario.ideas.map(idea => `
              <div class="crazy-idea-card" onclick="window.predictionsSound.speak('${idea.text}')">
                <span class="idea-tag">${idea.type.toUpperCase()} PREDICTION</span>
                <p class="idea-text">"${idea.text}"</p>
                <button class="mini-audio-chip">🔊 Hear Prediction</button>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="pred-action-footer">
          <button class="pred-action-btn" onclick="window.predictionsApp.nextCrazyScenario()">
            🎲 Next Crazy Scene
          </button>
          <button class="pred-action-btn primary large" onclick="window.predictionsApp.nextStage()">
            Go to Clue Detectives ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 9. PREDICTION DETECTIVES: Clue Investigation
   */
  renderPredictionDetectives(state) {
    const caseIdx = state.detectiveIndex || 0;
    const cases = window.PREDICTIONS_DATA.detectiveCases;
    const curCase = cases[caseIdx];
    const cluesFound = state.cluesFound || new Set();

    return `
      <div class="pred-scene-container scene-detectives-view">
        <div class="pred-header">
          <div class="pred-title-pill det-pill">
            <span class="icon">🔎</span>
            <div class="text-block">
              <h2>Prediction Detectives: Find the Clues!</h2>
              <p class="sub">Good predictions use visual evidence! Tap all 3 clues to reveal the future.</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Big Showdown 🏆 ➔
          </button>
        </div>

        <div class="detectives-stage-layout">
          <div class="det-headline-card">
            <span class="det-step-badge">CASE #${caseIdx + 1}</span>
            <h2 class="det-title">${curCase.title}</h2>
          </div>

          <div class="clues-trio-row">
            ${curCase.clues.map(c => `
              <div class="clue-inspect-card ${cluesFound.has(c.id) ? 'found' : ''}" onclick="window.predictionsApp.toggleClue('${c.id}')">
                <span class="clue-status-icon">${cluesFound.has(c.id) ? '🔍 CLUE FOUND!' : '❓ TAP TO INSPECT'}</span>
                <h3 class="clue-name">${c.name}</h3>
                <p class="clue-desc">${c.desc}</p>
              </div>
            `).join('')}
          </div>

          ${cluesFound.size === curCase.clues.length ? `
            <div class="synthesized-prediction-card">
              🎉 <strong>EVIDENCE COMPLETE:</strong> "${curCase.prediction}"
            </div>
          ` : ''}
        </div>

        <div class="pred-action-footer">
          <button class="pred-action-btn" onclick="window.predictionsApp.nextDetectiveCase()">
            🎲 Next Detective Case
          </button>
          <button class="pred-action-btn primary large" onclick="window.predictionsApp.nextStage()">
            Final Challenge: Big Showdown ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 10. THE BIG PREDICTION SHOWDOWN: Team Competition
   */
  renderBigShowdown(state) {
    const box = window.PREDICTIONS_DATA.showdownBox;
    const teams = state.teams || window.PREDICTIONS_DATA.teams;
    const boxRevealed = state.boxRevealed || false;
    const activeReveal = state.activeBoxReveal || box.reveals[0];

    return `
      <div class="pred-scene-container scene-showdown-view">
        <div class="pred-header">
          <div class="pred-title-pill show-pill">
            <span class="icon">🏆</span>
            <div class="text-block">
              <h2>THE BIG PREDICTION SHOWDOWN!</h2>
              <p class="sub">Team competition! What is inside the shaking mystery box?</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.renderStage('award')">
            Award Trophies 🏅 ➔
          </button>
        </div>

        <div class="showdown-stage-layout">
          <!-- 4-Team Scoreboard Bar -->
          <div class="teams-scoreboard-strip">
            ${teams.map(t => `
              <div class="team-score-pod" style="border-color: ${t.color};">
                <span class="pod-name">${t.icon} ${t.name}</span>
                <span class="pod-score">${t.score} PTS</span>
                <div class="pod-btns">
                  <button class="score-btn" onclick="window.predictionsApp.addTeamPoint('${t.id}', 1)">+1</button>
                  <button class="score-btn" onclick="window.predictionsApp.addTeamPoint('${t.id}', 2)">+2</button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Mystery Shaking Gift Box -->
          <div class="mystery-box-stage">
            <div class="shaking-box-hero ${!boxRevealed ? 'shaking' : 'opened'}" onclick="window.predictionsApp.revealMysteryBox()">
              <span class="box-emoji-huge">${!boxRevealed ? '🎁' : '🎉'}</span>
              <h2 class="box-title">${box.title}</h2>
              <p class="box-desc">${!boxRevealed ? box.description : activeReveal.text}</p>
              <button class="open-box-btn">
                ${!boxRevealed ? '🔮 TAP TO SHAKE & REVEAL!' : '🎲 NEXT MYSTERY ENDING!'}
              </button>
            </div>
          </div>
        </div>

        <div class="pred-action-footer">
          <div class="pred-speech-bubble highlight">
            <span class="bubble-icon">🎤</span>
            <span class="bubble-text">Teams speak their final prediction: <strong>"I think ______ will ______!"</strong></span>
          </div>
          <button class="pred-action-btn large primary" onclick="window.predictionsApp.renderStage('award')">
            Complete Challenge & Get Trophies 🏅
          </button>
        </div>
      </div>
    `;
  },

  /**
   * AWARD CEREMONY
   */
  renderAwardCeremony(state) {
    return `
      <div class="pred-scene-container scene-award-view">
        <div class="future-master-card">
          <div class="gold-future-tag">⭐ PREDICTION MASTER CERTIFICATE ⭐</div>
          <h1 class="master-headline">FUTURE PREDICTION CHAMPIONS!</h1>
          <p class="master-sub">Awarded for brilliant observation, visual clues, and speaking future English with WILL!</p>

          <div class="trophy-row">
            <span class="trophy-icon">🏆</span>
            <span class="stars-stars">⭐ ⭐ ⭐ ⭐ ⭐</span>
          </div>

          <div class="actions-celebrate-row">
            <button class="pred-action-btn primary large" onclick="window.predictionsSound.playFanfare(); window.predictionsApp.launchConfetti()">
              🎉 Celebrate Again!
            </button>
            <a href="worksheets.html" target="_blank" class="pred-action-btn secondary">
              🖨️ Open 5 Printable Worksheets
            </a>
            <button class="pred-action-btn" onclick="window.predictionsApp.renderStage(1)">
              🔄 Replay Lesson
            </button>
          </div>
        </div>
      </div>
    `;
  }
};

window.PredictionsScenes = PredictionsScenes;
