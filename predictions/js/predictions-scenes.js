/**
 * Predictions Scenes Renderer: 100% Picture-First Visual Storytelling & Comic Strips
 */

const PredictionsScenes = {
  /**
   * 1. INTRO: NOW vs NEXT Freeze Frame
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
              <h2>Picture Clues: What Will Happen Next?</h2>
              <p class="sub">Observe the picture clues! The moment is frozen in time. Make your prediction!</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Prediction Language ⏳ ➔
          </button>
        </div>

        <div class="freeze-stage-layout">
          <!-- Frozen Comic Scene (SVG + Visual Tags) -->
          <div class="comic-freeze-box">
            <div class="now-visual-badge">
              <span class="badge-title">1. NOW: WHAT IS HAPPENING NOW?</span>
              <span class="badge-emojis">👦 🏃 🍌 🐶</span>
            </div>

            <svg viewBox="0 0 700 380" class="freeze-svg">
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#bae6fd" />
                  <stop offset="100%" stop-color="#e0f2fe" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="700" height="260" fill="url(#skyGrad)" />
              <rect x="0" y="260" width="700" height="120" fill="#86efac" />
              <rect x="0" y="300" width="700" height="80" fill="#cbd5e1" stroke="#94a3b8" stroke-width="4" />

              <!-- Banana Peel on Sidewalk -->
              <g transform="translate(390, 310)">
                <path d="M 0 15 Q 15 0 35 12 Q 25 30 10 32 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3" />
                <path d="M 12 10 Q 25 -5 40 5" stroke="#ca8a04" stroke-width="3" fill="none" />
                <circle cx="20" cy="8" r="4" fill="#854d0e" />
                <line x1="-5" y1="0" x2="-15" y2="-10" stroke="#ef4444" stroke-width="3" />
                <line x1="20" y1="-5" x2="20" y2="-18" stroke="#ef4444" stroke-width="3" />
                <line x1="45" y1="0" x2="55" y2="-10" stroke="#ef4444" stroke-width="3" />
              </g>

              ${!isRevealed ? `
                <!-- Running Boy (Mid-Air Stride) -->
                <g transform="translate(230, 95)">
                  <circle cx="60" cy="50" r="30" fill="#fde047" stroke="#eab308" stroke-width="2" />
                  <circle cx="50" cy="45" r="7" fill="#ffffff" />
                  <circle cx="70" cy="45" r="7" fill="#ffffff" />
                  <circle cx="52" cy="45" r="3" fill="#0f172a" />
                  <circle cx="68" cy="45" r="3" fill="#0f172a" />
                  <ellipse cx="60" cy="65" rx="8" ry="10" fill="#b91c1c" />
                  <path d="M 30 40 Q 60 15 90 40 L 110 45 Z" fill="#3b82f6" />
                  <rect x="40" y="80" width="40" height="70" rx="8" fill="#ef4444" />
                  <line x1="40" y1="95" x2="0" y2="70" stroke="#ef4444" stroke-width="12" stroke-linecap="round" />
                  <line x1="80" y1="95" x2="130" y2="80" stroke="#ef4444" stroke-width="12" stroke-linecap="round" />
                  <line x1="50" y1="150" x2="20" y2="210" stroke="#1e3a8a" stroke-width="14" stroke-linecap="round" />
                  <line x1="70" y1="150" x2="150" y2="205" stroke="#1e3a8a" stroke-width="14" stroke-linecap="round" />
                  <ellipse cx="15" cy="215" rx="14" ry="8" fill="#0f172a" />
                  <ellipse cx="155" cy="210" rx="16" ry="9" fill="#0f172a" />
                </g>
              ` : `
                <!-- REVEALED: Fallen on Grass! -->
                <g transform="translate(310, 230)">
                  <text x="30" y="-30" font-size="40">💥 ⭐ 💫</text>
                  <ellipse cx="80" cy="60" rx="60" ry="25" fill="#ef4444" />
                  <circle cx="150" cy="30" r="28" fill="#fde047" stroke="#eab308" stroke-width="2" />
                  <line x1="135" y1="25" x2="145" y2="35" stroke="#000" stroke-width="3" />
                  <line x1="145" y1="25" x2="135" y2="35" stroke="#000" stroke-width="3" />
                  <line x1="155" y1="25" x2="165" y2="35" stroke="#000" stroke-width="3" />
                  <line x1="165" y1="25" x2="155" y2="35" stroke="#000" stroke-width="3" />
                  <line x1="40" y1="50" x2="0" y2="-10" stroke="#1e3a8a" stroke-width="14" stroke-linecap="round" />
                  <line x1="30" y1="50" x2="-20" y2="10" stroke="#1e3a8a" stroke-width="14" stroke-linecap="round" />
                </g>
              `}

              <!-- Chasing Puppy -->
              <g transform="translate(60, 250)">
                <text x="0" y="0" font-size="52">🐶 💨</text>
                <text x="20" y="-18" font-size="16" font-weight="900" fill="#713f12">WOOF!</text>
              </g>
            </svg>
          </div>

          <!-- Dual-Coded Picture Choices & Reveal Controls -->
          <div class="freeze-controls-box">
            <div class="question-banner-card">
              <span class="q-tag">🔮 WHAT WILL HAPPEN NEXT?</span>
              <p class="q-sub">Look at the pictures and tap your prediction:</p>
            </div>

            <div class="visual-choices-grid">
              ${data.choices.map(c => `
                <button class="visual-choice-card ${userChoice === c.id ? 'active' : ''}" onclick="window.predictionsApp.chooseIntroChoice('${c.id}')">
                  <span class="v-card-pic">${c.icon}</span>
                  <span class="v-card-text">${c.text}</span>
                  ${userChoice === c.id ? '<span class="v-card-selected">✓ MY GUESS</span>' : ''}
                </button>
              `).join('')}
            </div>

            <div class="reveal-action-panel">
              <button class="big-reveal-btn ${!isRevealed ? 'pulse' : 'done'}" onclick="window.predictionsApp.revealIntroEvent()">
                🎬 ${!isRevealed ? 'REVEAL WHAT HAPPENS!' : 'REPLAY THE MOMENT!'}
              </button>
            </div>

            ${isRevealed ? `
              <div class="now-next-outcome-box">
                <span class="next-tag">2. NEXT:</span>
                <span class="next-text">"${data.nextScene.revealText}"</span>
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
   * 2. TEACH PREDICTION LANGUAGE: Formula + Visual Cards
   */
  renderPredictionLanguage(state) {
    const cards = window.PREDICTIONS_DATA.futureCards;

    return `
      <div class="pred-scene-container scene-language-view">
        <div class="pred-header">
          <div class="pred-title-pill lang-pill">
            <span class="icon">⏳</span>
            <div class="text-block">
              <h2>Language of the Future: WILL + ACTION</h2>
              <p class="sub">Every prediction pairs a clear picture with the English sentence!</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: 4-Panel Comic Stories 📰 ➔
          </button>
        </div>

        <div class="language-timeline-stage">
          <!-- Visual Timeline: NOW -> FUTURE -->
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
              <span class="node-label">2. FUTURE (WILL)</span>
              <div class="node-icon">💥 💦</div>
              <span class="node-desc">"He WILL fall!"</span>
            </div>
          </div>

          <!-- 5 Visual Sentence Picture Cards (Rule 38) -->
          <div class="visual-future-cards-row">
            ${cards.map(c => `
              <div class="future-card-item" onclick="window.predictionsSound.speak('${c.audio}')">
                <span class="future-card-pic">${c.icon}</span>
                <span class="future-card-sentence">"${c.sentence}"</span>
                <button class="mini-audio-btn">🔊 Listen</button>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="pred-action-footer">
          <div class="pred-speech-bubble">
            <span class="bubble-icon">💡</span>
            <span class="bubble-text">Remember: <strong>WILL</strong> means what happens LATER!</span>
          </div>
          <button class="pred-action-btn large primary" onclick="window.predictionsApp.nextStage()">
            Start 4-Panel Comic Stories ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 3. 4-PANEL COMIC STRIP STORIES (Rules 36 & 46)
   */
  renderComicStories(state) {
    const storyIdx = state.comicStoryIndex || 0;
    const stories = window.PREDICTIONS_DATA.comicStories;
    const curStory = stories[storyIdx];
    const isRevealed = state.comicStoryRevealed || false;

    return `
      <div class="pred-scene-container scene-comic-view">
        <div class="pred-header">
          <div class="pred-title-pill comic-pill">
            <span class="icon">📰</span>
            <div class="text-block">
              <h2>4-Panel Comic Story (${storyIdx + 1}/${stories.length})</h2>
              <p class="sub">Follow the visual story across the panels. What will happen in Panel 4?</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Visual Listening 🎧 ➔
          </button>
        </div>

        <div class="comic-strip-stage-layout">
          <!-- 4 Sequential Comic Panels -->
          <div class="four-panels-row">
            <div class="comic-panel-card">
              <span class="p-num-tag">${curStory.panel1.label}</span>
              <span class="p-hero-icon">${curStory.panel1.icon}</span>
              <p class="p-caption">${curStory.panel1.text}</p>
            </div>

            <div class="p-arrow">➔</div>

            <div class="comic-panel-card">
              <span class="p-num-tag">${curStory.panel2.label}</span>
              <span class="p-hero-icon">${curStory.panel2.icon}</span>
              <p class="p-caption">${curStory.panel2.text}</p>
            </div>

            <div class="p-arrow">➔</div>

            <div class="comic-panel-card">
              <span class="p-num-tag">${curStory.panel3.label}</span>
              <span class="p-hero-icon">${curStory.panel3.icon}</span>
              <p class="p-caption">${curStory.panel3.text}</p>
            </div>

            <div class="p-arrow">➔</div>

            <!-- Panel 4 (Mystery or Revealed) -->
            <div class="comic-panel-card ${isRevealed ? 'revealed' : 'mystery'}">
              <span class="p-num-tag">4. NEXT (PREDICT!)</span>
              ${!isRevealed ? `
                <span class="mystery-q-mark">❓</span>
                <p class="p-caption">What will happen next?</p>
              ` : `
                <span class="p-hero-icon">${curStory.reveal.icon}</span>
                <p class="p-caption">${curStory.reveal.text}</p>
              `}
            </div>
          </div>

          <!-- Dual-Coded Picture Choices -->
          <div class="comic-choices-panel">
            <span class="c-prompt-title">Choose what will happen in Panel 4:</span>
            <div class="comic-choices-row">
              ${curStory.choices.map(c => `
                <button class="comic-choice-btn" onclick="window.predictionsApp.selectComicChoice(${c.isCorrect})">
                  <span class="btn-pic">${c.icon}</span>
                  <span class="btn-text">${c.text}</span>
                </button>
              `).join('')}
            </div>

            <div class="panel-reveal-action">
              <button class="pred-action-btn primary large" onclick="window.predictionsApp.revealComicStory()">
                🎬 Reveal Panel 4!
              </button>
            </div>
          </div>
        </div>

        <div class="pred-action-footer">
          <button class="pred-action-btn" onclick="window.predictionsApp.nextComicStory()">
            🎲 Next Comic Story
          </button>
          <button class="pred-action-btn primary large" onclick="window.predictionsApp.nextStage()">
            Go to Visual Listening ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 4. VISUAL LISTENING ACTIVITIES (Rule 40)
   */
  renderVisualListening(state) {
    const caseIdx = state.visualListeningIndex || 0;
    const cases = window.PREDICTIONS_DATA.visualListeningCases;
    const curCase = cases[caseIdx];
    const isRevealed = state.visualListeningRevealed || false;

    return `
      <div class="pred-scene-container scene-listening-view">
        <div class="pred-header">
          <div class="pred-title-pill listen-pill">
            <span class="icon">🎧</span>
            <div class="text-block">
              <h2>Visual Listening (${caseIdx + 1}/${cases.length})</h2>
              <p class="sub">Listen to the story while looking at the picture setup!</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Which Picture Matches? ➔
          </button>
        </div>

        <div class="vis-listening-stage-layout">
          <!-- Visual Scene Card (Rule 40) -->
          <div class="vis-caller-card">
            <span class="caller-tag">VISUAL SCENE SETUP:</span>
            <span class="caller-hero-emojis">${curCase.sceneCard.icon}</span>
            <p class="caller-desc">"${curCase.sceneCard.desc}"</p>
            <button class="big-audio-btn" onclick="window.predictionsSound.speak('${curCase.audioText}')">
              🔊 <span>TAP TO HEAR STORY</span>
            </button>
          </div>

          <!-- Dual-Coded Picture Choices -->
          <div class="vis-choices-column">
            <span class="q-banner">WHAT WILL HAPPEN NEXT?</span>
            <div class="vis-choices-stack">
              ${curCase.choices.map(c => `
                <button class="vis-listen-choice-btn" onclick="window.predictionsApp.selectVisualListenChoice(${c.isCorrect})">
                  <span class="c-pic">${c.icon}</span>
                  <span class="c-label">${c.text}</span>
                </button>
              `).join('')}
            </div>

            ${isRevealed ? `
              <div class="vis-outcome-card">
                <span class="outcome-icon">✅</span>
                <span class="outcome-text">"${curCase.sentence}"</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="pred-action-footer">
          <button class="pred-action-btn" onclick="window.predictionsSound.speak('${curCase.sentence}')">
            🔊 Speak Outcome Sentence
          </button>
          <button class="pred-action-btn primary large" onclick="window.predictionsApp.nextVisualListenCase()">
            ${caseIdx === cases.length - 1 ? 'Go to Which Picture Matches? ➔' : 'Next Listening Story ➔'}
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 5. "WHICH PICTURE MATCHES?" (Rules 43 & 44)
   */
  renderWhichPictureMatches(state) {
    const caseIdx = state.whichPicIndex || 0;
    const cases = window.PREDICTIONS_DATA.whichPictureCases;
    const curCase = cases[caseIdx];
    const userSelected = state.whichPicSelected;

    return `
      <div class="pred-scene-container scene-whichpic-view">
        <div class="pred-header">
          <div class="pred-title-pill which-pill">
            <span class="icon">🖼️</span>
            <div class="text-block">
              <h2>Which Picture Matches? (${caseIdx + 1}/${cases.length})</h2>
              <p class="sub">Read the sentence. Tap the picture that matches the meaning!</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Picture-Sentence Match 🔗 ➔
          </button>
        </div>

        <div class="whichpic-stage-layout">
          <!-- Target Sentence Display Banner -->
          <div class="target-sentence-banner">
            <span class="target-tag">TARGET SENTENCE:</span>
            <h1 class="target-sentence-text">"${curCase.sentence}"</h1>
            <button class="mini-sentence-audio-btn" onclick="window.predictionsSound.speak('${curCase.speech}')">
              🔊 Hear Sentence Aloud
            </button>
          </div>

          <!-- 3 Picture Cards (Rule 43) -->
          <div class="which-pictures-trio">
            ${curCase.pictures.map(p => `
              <button class="picture-match-card ${userSelected === p.id ? (p.isCorrect ? 'correct' : 'wrong') : ''}" onclick="window.predictionsApp.selectWhichPic('${p.id}', ${p.isCorrect})">
                <span class="pic-hero-emojis">${p.icon}</span>
                <span class="pic-card-label">${p.label}</span>
                ${userSelected === p.id ? (p.isCorrect ? '<span class="status-pill win">CORRECT MATCH! 🎉</span>' : '<span class="status-pill try">TRY AGAIN</span>') : ''}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="pred-action-footer">
          <div class="pred-speech-bubble highlight">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text">Say it aloud: <strong>"${curCase.sentence}"</strong></span>
          </div>
          <button class="pred-action-btn primary large" onclick="window.predictionsApp.nextWhichPicCase()">
            ${caseIdx === cases.length - 1 ? 'Go to Picture-Sentence Match ➔' : 'Next Picture Challenge ➔'}
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 6. PICTURE + SENTENCE MATCHING BOARD (Rule 42)
   */
  renderPictureMatching(state) {
    const act = window.PREDICTIONS_DATA.matchingActivity;
    const selectedS = state.matchSelectedSentence;
    const matched = state.matchedPairs || new Set();

    return `
      <div class="pred-scene-container scene-matching-view">
        <div class="pred-header">
          <div class="pred-title-pill match-pill">
            <span class="icon">🔗</span>
            <div class="text-block">
              <h2>Picture + Sentence Matching</h2>
              <p class="sub">Tap a sentence on the left, then tap its matching picture on the right!</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Prediction Bingo 🎯 ➔
          </button>
        </div>

        <div class="matching-board-stage">
          <!-- Sentences Column -->
          <div class="match-column sentences-col">
            <span class="col-title">1. SENTENCES</span>
            <div class="match-items-stack">
              ${act.sentences.map(s => `
                <button class="match-card-btn ${selectedS === s.id ? 'active' : ''} ${matched.has(s.matchId) ? 'matched' : ''}" onclick="window.predictionsApp.selectMatchSentence('${s.id}', '${s.matchId}')">
                  <span>${s.text}</span>
                  ${matched.has(s.matchId) ? '<span>✅</span>' : ''}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="match-center-divider">⚡</div>

          <!-- Pictures Column -->
          <div class="match-column pictures-col">
            <span class="col-title">2. PICTURES</span>
            <div class="match-items-stack">
              ${act.pictures.map(p => `
                <button class="match-pic-btn ${matched.has(p.matchId) ? 'matched' : ''}" onclick="window.predictionsApp.selectMatchPicture('${p.matchId}')">
                  <span class="match-pic-hero">${p.icon}</span>
                  <span class="match-pic-label">${p.label}</span>
                  ${matched.has(p.matchId) ? '<span class="status-check">✅ MATCHED!</span>' : ''}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="pred-action-footer">
          <div class="pred-speech-bubble highlight">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text">After matching, say each sentence aloud to the class!</span>
          </div>
          <button class="pred-action-btn primary large" onclick="window.predictionsApp.nextStage()">
            Start Prediction Bingo ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 7. PREDICTION BINGO: 3x3 Visual Touch Grid
   */
  renderPredictionBingo(state) {
    const board = state.bingoBoard || window.PREDICTIONS_DATA.bingoBoard;

    return `
      <div class="pred-scene-container scene-bingo-view">
        <div class="pred-header">
          <div class="pred-title-pill bingo-pill">
            <span class="icon">🎯</span>
            <div class="text-block">
              <h2>Visual Prediction Bingo!</h2>
              <p class="sub">Every square has a picture! Tap a square when you predict that future action!</p>
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
                <span class="b-pic">${cell.icon}</span>
                <span class="b-text">${cell.text}</span>
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
   * 8. CRAZY PREDICTIONS: Visual Scenes
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
              <p class="sub">Look at the funny picture! What hilarious thing will happen next?</p>
            </div>
          </div>
          <button class="pred-action-btn primary" onclick="window.predictionsApp.nextStage()">
            Next: Clue Detectives 🔎 ➔
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
                <span class="idea-hero-icon">${idea.icon}</span>
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
              <h2>Prediction Detectives: Visual Evidence!</h2>
              <p class="sub">Good predictions use visual clues! Tap all 3 clues to reveal the future.</p>
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
                <span class="clue-big-pic">${c.icon}</span>
                <h3 class="clue-name">${c.name}</h3>
                <p class="clue-desc">${c.desc}</p>
                <span class="clue-status-tag">${cluesFound.has(c.id) ? '✓ EVIDENCE FOUND!' : '❓ TAP TO INSPECT'}</span>
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
              <p class="sub">Team game! What is inside the shaking mystery box?</p>
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
              <span class="box-emoji-huge">${!boxRevealed ? '🎁' : activeReveal.icon}</span>
              <h2 class="box-title">${!boxRevealed ? box.title : activeReveal.title}</h2>
              <p class="box-desc">${!boxRevealed ? box.description : activeReveal.text}</p>
              <button class="open-box-btn">
                ${!boxRevealed ? '🔮 TAP TO SHAKE & REVEAL!' : '🎲 NEXT SURPRISE ENDING!'}
              </button>
            </div>
          </div>
        </div>

        <div class="pred-action-footer">
          <div class="pred-speech-bubble highlight">
            <span class="bubble-icon">🎤</span>
            <span class="bubble-text">Teams speak their prediction: <strong>"I think ______ will ______!"</strong></span>
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
