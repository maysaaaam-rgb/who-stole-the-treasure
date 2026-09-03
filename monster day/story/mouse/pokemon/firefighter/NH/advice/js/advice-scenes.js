/**
 * Advice Academy Scenes Renderer: High-Impact SVG Comic Illustrations & Thinking Stages
 */

const AdviceScenes = {
  /**
   * 1. EMERGENCY INTRO: Professor Should Dilemma
   */
  renderEmergencyIntro(state) {
    const dilemma = window.ADVICE_DATA.introDilemma;
    const selectedOpt = state.introChoice ? dilemma.options.find(o => o.id === state.introChoice) : null;

    return `
      <div class="adv-scene-container scene-emergency-intro">
        <div class="adv-header">
          <div class="adv-title-pill alert-pill">
            <span class="icon">🚨</span>
            <div class="text-block">
              <h2>EMERGENCY! Professor Should Needs Help!</h2>
              <p class="sub">The Professor is overwhelmed with homework and distractions. What should he do?</p>
            </div>
          </div>
          <button class="adv-action-btn primary" onclick="window.adviceApp.nextStage()">
            Next: Investigate Problems ➔
          </button>
        </div>

        <div class="emergency-stage-layout">
          <!-- Professor's Chaotic Study Room (SVG) -->
          <div class="study-room-svg-wrap">
            <svg viewBox="0 0 650 420" class="room-svg">
              <defs>
                <linearGradient id="wallBg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#fdf4e3" />
                  <stop offset="100%" stop-color="#fae3c6" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="650" height="320" fill="url(#wallBg)" />
              <rect x="0" y="320" width="650" height="100" fill="#8d6e63" />
              <!-- Blackboard -->
              <rect x="50" y="30" width="220" height="100" rx="8" fill="#1e3a2b" stroke="#5d4037" stroke-width="6" />
              <text x="160" y="65" text-anchor="middle" font-size="14" font-weight="900" fill="#ffe082">📝 HOMEWORK DUE:</text>
              <text x="160" y="95" text-anchor="middle" font-size="20" font-weight="900" fill="#ff5252">TOMORROW! ⏰</text>

              <!-- TV glowing -->
              <rect x="420" y="50" width="160" height="100" rx="10" fill="#37474f" stroke="#263238" stroke-width="4" />
              <rect x="430" y="60" width="140" height="80" rx="6" fill="#80deea" />
              <text x="500" y="105" text-anchor="middle" font-size="32">📺 ⚽</text>

              <!-- Table with Pizza, Phone, Books -->
              <rect x="180" y="240" width="300" height="30" fill="#d7ccc8" stroke="#a1887f" stroke-width="2" />
              <rect x="220" y="270" width="20" height="80" fill="#5d4037" />
              <rect x="420" y="270" width="20" height="80" fill="#5d4037" />

              <!-- Distractions on table -->
              <text x="230" y="235" font-size="34">🍕</text>
              <text x="320" y="235" font-size="32">📱</text>
              <text x="410" y="235" font-size="36">📚</text>

              <!-- Professor Should (Cartoon Character) -->
              <g transform="translate(240, 90)">
                <!-- Wild Hair -->
                <path d="M 20 50 Q -10 10 30 10 Q 70 -10 100 10 Q 140 20 110 60 Z" fill="#78909c" />
                <!-- Head -->
                <circle cx="65" cy="65" r="40" fill="#ffcc80" />
                <!-- Round Glasses -->
                <circle cx="50" cy="65" r="16" fill="none" stroke="#212121" stroke-width="4" />
                <circle cx="80" cy="65" r="16" fill="none" stroke="#212121" stroke-width="4" />
                <line x1="66" y1="65" x2="64" y2="65" stroke="#212121" stroke-width="4" />
                <!-- Wide Panic Eyes -->
                <circle cx="50" cy="65" r="5" fill="#212121" />
                <circle cx="80" cy="65" r="5" fill="#212121" />
                <!-- Open Mouth -->
                <ellipse cx="65" cy="88" rx="14" ry="9" fill="#d32f2f" />
                <!-- Lab Coat Body -->
                <path d="M 35 105 L 15 200 L 115 200 L 95 105 Z" fill="#ffffff" stroke="#90a4ae" stroke-width="3" />
                <line x1="65" y1="105" x2="65" y2="200" stroke="#90a4ae" stroke-width="2" />
                <!-- Game Controller in Hand -->
                <g transform="translate(0, 140)">
                  <text x="0" y="0" font-size="34">🎮</text>
                </g>
              </g>
            </svg>
          </div>

          <!-- Dilemma Voting Panel -->
          <div class="emergency-decision-panel">
            <div class="dilemma-card">
              <span class="prof-tag">🧠 PROFESSOR SHOULD ASKS:</span>
              <h1 class="dilemma-quote">"${dilemma.question}"</h1>
            </div>

            <div class="vote-options-column">
              ${dilemma.options.map(opt => `
                <button class="vote-opt-btn ${selectedOpt && selectedOpt.id === opt.id ? 'active' : ''}" onclick="window.adviceApp.chooseIntroOption('${opt.id}')">
                  <span class="opt-label">${opt.text}</span>
                  ${selectedOpt && selectedOpt.id === opt.id ? '<span class="vote-tick">👈 YOUR ADVICE!</span>' : ''}
                </button>
              `).join('')}
            </div>

            ${selectedOpt ? `
              <div class="professor-reaction-box">
                <span class="reaction-avatar">🧠</span>
                <div class="reaction-text">
                  <strong>Professor Should:</strong> "${selectedOpt.reaction}"
                </div>
              </div>
            ` : `
              <div class="voting-prompt-pill">
                👆 Tap an option to advise Professor Should!
              </div>
            `}
          </div>
        </div>

        <div class="adv-action-footer">
          <div class="adv-speech-bubble highlight">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text">
              ${selectedOpt ? selectedOpt.advice : 'Advise the Professor: "You should..." or "You shouldn\'t..."'}
            </span>
          </div>
          <button class="adv-action-btn large primary" onclick="window.adviceApp.nextStage()">
            Start Mission: What's the Problem? ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 2. WHAT'S THE PROBLEM?: Snowstorm Investigation
   */
  renderWhatsTheProblem(state) {
    const scene = window.ADVICE_DATA.snowScene;
    const selectedItem = state.snowSelectedItem ? scene.nearbyItems.find(i => i.id === state.snowSelectedItem) : null;

    return `
      <div class="adv-scene-container scene-problem-view">
        <div class="adv-header">
          <div class="adv-title-pill problem-pill">
            <span class="icon">🔍</span>
            <div class="text-block">
              <h2>What's the Problem?</h2>
              <p class="sub">Investigate the scene! Tap the clothing items to solve the winter emergency.</p>
            </div>
          </div>
          <button class="adv-action-btn primary" onclick="window.adviceApp.nextStage()">
            Next: Should or Shouldn't ⚡ ➔
          </button>
        </div>

        <div class="snowstorm-stage-layout">
          <!-- Left: Snow Scene Visual -->
          <div class="snow-scene-box">
            <div class="scene-weather-badge">❄️ SNOWSTORM: -5°C</div>
            <div class="character-stand">
              <div class="shivering-character">
                <span class="char-icon">🥶</span>
                <div class="char-clothing-tags">
                  <span class="bad-tag">🩴 Flip-Flops (Brrr!)</span>
                  <span class="bad-tag">👕 T-Shirt (Freezing!)</span>
                  <span class="ok-tag">🧢 Cap</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Problem & Solution Discovery -->
          <div class="investigation-controls-box">
            <div class="problem-diagnosis-card">
              <span class="diag-tag">1. IDENTIFY THE PROBLEM:</span>
              <h3 class="diag-title">"It is freezing cold and he is wearing summer clothes!"</h3>
            </div>

            <div class="solutions-palette">
              <span class="diag-tag">2. CHOOSE THE BEST SOLUTION:</span>
              <div class="nearby-items-grid">
                ${scene.nearbyItems.map(item => `
                  <button class="item-choice-btn ${selectedItem && selectedItem.id === item.id ? 'active' : ''}" onclick="window.adviceApp.selectSnowItem('${item.id}')">
                    <span class="item-emoji">${item.icon}</span>
                    <span class="item-name">${item.name}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            ${selectedItem ? `
              <div class="advice-solution-pill ${selectedItem.isSolution ? 'good' : 'bad'}">
                <span class="pill-icon">${selectedItem.isSolution ? '💡 GOOD ADVICE:' : '🤪 SILLY ADVICE:'}</span>
                <span class="pill-sentence">"${selectedItem.sentence}"</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="adv-action-footer">
          <div class="adv-speech-bubble highlight">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text">
              ${selectedItem ? selectedItem.sentence : 'Select an item above to generate the correct advice!'}
            </span>
          </div>
          <button class="adv-action-btn large primary say-btn" onclick="window.adviceApp.speakSnowAdvice()">
            🗣️ SAY IT ALOUD!
          </button>
          <button class="adv-action-btn" onclick="window.adviceApp.nextStage()">
            Next Stage ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 3. SHOULD OR SHOULDN'T: 6 Fast-Paced Visual Grammar Rounds
   */
  renderShouldOrShouldnt(state) {
    const roundIdx = state.grammarRoundIndex || 0;
    const rounds = window.ADVICE_DATA.grammarRounds;
    const curRound = rounds[roundIdx];
    const totalRounds = rounds.length;
    const answered = state.grammarAnswer;

    return `
      <div class="adv-scene-container scene-grammar-view">
        <div class="adv-header">
          <div class="adv-title-pill grammar-pill">
            <span class="icon">⚡</span>
            <div class="text-block">
              <h2>Should or Shouldn't? (${roundIdx + 1}/${totalRounds})</h2>
              <p class="sub">Look at the situation! Choose SHOULD or SHOULDN'T.</p>
            </div>
          </div>
          <button class="adv-action-btn primary" onclick="window.adviceApp.nextStage()">
            Next: Consequence Detective ➔
          </button>
        </div>

        <div class="grammar-round-stage">
          <div class="situation-hero-card">
            <span class="situation-emoji">${curRound.emoji}</span>
            <span class="situation-badge">${curRound.context}</span>
            <h1 class="sentence-prompt">
              ${curRound.sentence.replace('________', `<span class="blank-slot ${answered ? (answered === curRound.answer ? 'correct' : 'wrong') : ''}">${answered ? (answered === 'should' ? 'SHOULD' : 'SHOULDN\'T') : '________'}</span>`)}
            </h1>
          </div>

          <!-- SHOULD vs SHOULDN'T Big Touch Buttons -->
          <div class="should-buttons-row">
            <button class="modal-choice-btn should-btn ${answered === 'should' ? 'selected' : ''}" onclick="window.adviceApp.submitGrammarAnswer('should')">
              🟢 SHOULD
            </button>
            <button class="modal-choice-btn shouldnt-btn ${answered === 'shouldnt' ? 'selected' : ''}" onclick="window.adviceApp.submitGrammarAnswer('shouldnt')">
              🔴 SHOULDN'T
            </button>
          </div>

          <!-- Feedback & Character Reaction -->
          ${answered ? `
            <div class="grammar-reaction-box ${answered === curRound.answer ? 'correct' : 'wrong'}">
              <span class="react-icon">${answered === curRound.answer ? '🎉' : '💡'}</span>
              <div class="react-content">
                <strong>${answered === curRound.answer ? 'EXCELLENT ADVICE!' : 'THINK AGAIN:'}</strong>
                <p>"${curRound.reaction}"</p>
                <div class="rule-hint">Rule: ${curRound.rule}</div>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="adv-action-footer">
          <div class="round-tracker-dots">
            ${rounds.map((r, i) => `
              <span class="round-dot ${i === roundIdx ? 'active' : ''} ${i < roundIdx ? 'done' : ''}"></span>
            `).join('')}
          </div>
          <button class="adv-action-btn large primary" onclick="window.adviceApp.nextGrammarRound()">
            ${roundIdx === totalRounds - 1 ? 'Go to Consequence Detective ➔' : 'Next Situation ➔'}
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 4. CONSEQUENCE DETECTIVE: Cause & Effect Thinking
   */
  renderConsequenceDetective(state) {
    const caseIdx = state.consequenceCaseIndex || 0;
    const curCase = window.ADVICE_DATA.consequenceCases[caseIdx];
    const totalCases = window.ADVICE_DATA.consequenceCases.length;
    const selectedEffects = state.selectedEffects || new Set();

    return `
      <div class="adv-scene-container scene-consequence-view">
        <div class="adv-header">
          <div class="adv-title-pill cons-pill">
            <span class="icon">🕵️</span>
            <div class="text-block">
              <h2>Consequence Detective (${caseIdx + 1}/${totalCases})</h2>
              <p class="sub">Think about Cause & Effect! What might happen?</p>
            </div>
          </div>
          <button class="adv-action-btn primary" onclick="window.adviceApp.nextStage()">
            Next: Which Advice is Best? ➔
          </button>
        </div>

        <div class="consequence-stage-layout">
          <!-- Cause Card -->
          <div class="cause-card">
            <span class="card-step-tag">1. THE ACTION (CAUSE)</span>
            <h2 class="cause-title">${curCase.character}</h2>
            <div class="cause-box">
              <span class="warning-icon">⚠️</span>
              <p class="cause-text">"${curCase.cause}"</p>
            </div>
          </div>

          <!-- Effect Detective Box -->
          <div class="effects-investigation-box">
            <span class="card-step-tag">2. WHAT MIGHT HAPPEN? (CONSEQUENCES)</span>
            <div class="effects-grid">
              ${curCase.effects.map((eff, i) => `
                <button class="effect-chip ${selectedEffects.has(i) ? 'active' : ''}" onclick="window.adviceApp.toggleEffect(${i})">
                  <span class="check-box">${selectedEffects.has(i) ? '☑' : '☐'}</span>
                  <span>${eff.text}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Solution & Reasoning -->
          <div class="solution-reason-box">
            <span class="card-step-tag">3. SOLUTION & REASON</span>
            <div class="solution-pill">
              <strong>Advice:</strong> "${curCase.solution}"
            </div>
            <div class="reason-pill">
              <strong>Why?</strong> "${curCase.reason}"
            </div>
          </div>
        </div>

        <div class="adv-action-footer">
          <button class="adv-action-btn" onclick="window.adviceApp.speakConsequence()">
            🔊 Speak Solution & Reason
          </button>
          <button class="adv-action-btn primary large" onclick="window.adviceApp.nextConsequenceCase()">
            ${caseIdx === totalCases - 1 ? 'Go to Which Advice is Best ➔' : 'Next Case ➔'}
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 5. WHICH ADVICE IS BEST?: Comparing Choices & Reasoning with "Because..."
   */
  renderWhichAdviceIsBest(state) {
    const dilemma = window.ADVICE_DATA.bestAdviceDilemma;
    const selectedLetter = state.bestAdviceSelected;

    return `
      <div class="adv-scene-container scene-bestadvice-view">
        <div class="adv-header">
          <div class="adv-title-pill best-pill">
            <span class="icon">💡</span>
            <div class="text-block">
              <h2>Which Advice is Best?</h2>
              <p class="sub">Compare the three pieces of advice. Which one is best and WHY?</p>
            </div>
          </div>
          <button class="adv-action-btn primary" onclick="window.adviceApp.nextStage()">
            Next: Tom's Terrible Morning ➔
          </button>
        </div>

        <div class="bestadvice-stage-layout">
          <div class="scenario-banner-card">
            <span class="scenario-tag">DILEMMA:</span>
            <h2 class="scenario-text">"${dilemma.scenario}"</h2>
          </div>

          <div class="advice-cards-trio">
            ${dilemma.options.map(opt => `
              <div class="advice-card-item ${selectedLetter === opt.letter ? 'selected' : ''}" onclick="window.adviceApp.selectBestAdvice('${opt.letter}')">
                <div class="opt-header">
                  <span class="letter-badge">OPTION ${opt.letter}</span>
                  ${selectedLetter === opt.letter ? `<span class="rating-badge">${opt.rating}</span>` : ''}
                </div>
                <p class="opt-body">"${opt.text}"</p>
                ${selectedLetter === opt.letter ? `
                  <div class="because-frame">
                    <strong>WHY?</strong> ${opt.reason}
                  </div>
                ` : '<div class="tap-hint">Tap to inspect & rate</div>'}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="adv-action-footer">
          <div class="adv-speech-bubble highlight">
            <span class="bubble-icon">🗣️</span>
            <span class="bubble-text">
              Say: "Option B is best <strong>because</strong> you finish your work first!"
            </span>
          </div>
          <button class="adv-action-btn large primary" onclick="window.adviceApp.nextStage()">
            Next: Tom's Terrible Morning ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 6. TOM'S TERRIBLE MORNING: Comic Strip Story & Crazy Advice
   */
  renderTomsMorning(state) {
    const panels = window.ADVICE_DATA.tomStory;
    const activePanelIdx = state.tomActivePanel || 0;
    const curPanel = panels[activePanelIdx];
    const crazyChoice = state.crazyAdviceChoice;

    return `
      <div class="adv-scene-container scene-tom-view">
        <div class="adv-header">
          <div class="adv-title-pill tom-pill">
            <span class="icon">📰</span>
            <div class="text-block">
              <h2>Advice Detectives: Tom's Terrible Morning</h2>
              <p class="sub">Follow Tom's chaotic morning! Identify each problem and give advice.</p>
            </div>
          </div>
          <button class="adv-action-btn primary" onclick="window.adviceApp.nextStage()">
            Next: Pair Role-Play 🎭 ➔
          </button>
        </div>

        <div class="tom-comic-stage-layout">
          <!-- 5 Comic Panels Strip -->
          <div class="comic-strip-bar">
            ${panels.map((p, i) => `
              <div class="comic-panel-card ${i === activePanelIdx ? 'active' : ''}" onclick="window.adviceApp.selectTomPanel(${i})">
                <span class="panel-num">#${p.step}</span>
                <span class="panel-icon">${p.icon}</span>
                <span class="panel-title">${p.title}</span>
              </div>
            `).join('')}
          </div>

          <!-- Active Panel Detail -->
          <div class="active-panel-detail-box">
            <div class="detail-story">
              <span class="detail-badge">STEP ${curPanel.step}: ${curPanel.title}</span>
              <h2 class="detail-desc">"${curPanel.desc}"</h2>
              <div class="problem-statement">
                <strong>Problem:</strong> ${curPanel.problem}
              </div>
              <div class="advice-statement">
                <strong>Advice:</strong> "${curPanel.advice}"
              </div>
            </div>

            <!-- Crazy Advice Check -->
            <div class="crazy-advice-widget">
              <span class="crazy-title">🤪 CRAZY ADVICE CHECK:</span>
              <p class="crazy-quote">"${window.ADVICE_DATA.tomCrazyAdvice.quote}"</p>
              <div class="crazy-buttons-row">
                <button class="btn-check ${crazyChoice === 'good' ? 'selected' : ''}" onclick="window.adviceApp.submitCrazyAdvice('good')">
                  👍 GOOD ADVICE
                </button>
                <button class="btn-check ${crazyChoice === 'crazy' ? 'selected' : ''}" onclick="window.adviceApp.submitCrazyAdvice('crazy')">
                  🤪 CRAZY ADVICE
                </button>
              </div>
              ${crazyChoice ? `
                <div class="crazy-feedback ${crazyChoice === 'crazy' ? 'correct' : 'wrong'}">
                  ${crazyChoice === 'crazy' ? '🎉 Correct! That is totally crazy advice!' : '😂 Haha, no way! 17 socks is crazy!'}
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="adv-action-footer">
          <button class="adv-action-btn" onclick="window.adviceSound.speak('${curPanel.advice}')">
            🔊 Speak Tom's Advice
          </button>
          <button class="adv-action-btn primary large" onclick="window.adviceApp.nextStage()">
            Start Pair Role-Play ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 7. PAIR ROLE-PLAY: Problem Cards & Speaking Prompts
   */
  renderPairRoleplay(state) {
    const cards = window.ADVICE_DATA.roleplayCards;
    const cardIdx = state.roleplayCardIndex || 0;
    const curCard = cards[cardIdx];
    const isSwitched = state.roleplaySwitched || false;

    return `
      <div class="adv-scene-container scene-roleplay-view">
        <div class="adv-header">
          <div class="adv-title-pill rp-pill">
            <span class="icon">🎭</span>
            <div class="text-block">
              <h2>Pair Role-Play: Problem & Advice Expert</h2>
              <p class="sub">Student A explains the problem. Student B gives advice + reason!</p>
            </div>
          </div>
          <button class="adv-action-btn" onclick="window.adviceApp.switchRoleplayRoles()">
            🔄 Switch Roles
          </button>
          <button class="adv-action-btn primary" onclick="window.adviceApp.nextStage()">
            Next: Advice Puzzle ➔
          </button>
        </div>

        <div class="roleplay-interactive-stage">
          <!-- Active Problem Card -->
          <div class="rp-problem-header-card">
            <span class="rp-tag">SITUATION CARD #${cardIdx + 1}:</span>
            <h1 class="rp-problem-headline">${curCard.problem}</h1>
          </div>

          <div class="rp-speakers-row">
            <!-- Student A (Problem) -->
            <div class="rp-speaker-pod ${!isSwitched ? 'student-a' : 'student-b'}">
              <span class="speaker-avatar">${!isSwitched ? '🧒' : '🧑‍🏫'}</span>
              <span class="speaker-title">${!isSwitched ? 'STUDENT A: PERSON WITH PROBLEM' : 'STUDENT B: ADVICE EXPERT'}</span>
              <div class="speech-dialogue-bubble">
                "${!isSwitched ? curCard.starterA : curCard.starterB}"
              </div>
            </div>

            <div class="rp-exchange-arrow">➡️ 🗣️ ➡️</div>

            <!-- Student B (Advice) -->
            <div class="rp-speaker-pod ${!isSwitched ? 'student-b' : 'student-a'}">
              <span class="speaker-avatar">${!isSwitched ? '🧑‍🏫' : '🧒'}</span>
              <span class="speaker-title">${!isSwitched ? 'STUDENT B: ADVICE EXPERT' : 'STUDENT A: PERSON WITH PROBLEM'}</span>
              <div class="speech-dialogue-bubble">
                "${!isSwitched ? curCard.starterB : curCard.starterA}"
              </div>
            </div>
          </div>
        </div>

        <div class="adv-action-footer">
          <button class="adv-action-btn" onclick="window.adviceApp.nextRoleplayCard()">
            🎲 New Problem Card
          </button>
          <button class="adv-action-btn primary large" onclick="window.adviceApp.nextStage()">
            Go to Advice Puzzle ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 8. ADVICE PUZZLE: Classroom Chaos
   */
  renderAdvicePuzzle(state) {
    const puzzle = window.ADVICE_DATA.classroomPuzzle;
    const selectedCards = state.selectedPuzzleCards || new Set();

    return `
      <div class="adv-scene-container scene-puzzle-view">
        <div class="adv-header">
          <div class="adv-title-pill puzzle-pill">
            <span class="icon">🧩</span>
            <div class="text-block">
              <h2>Advice Puzzle: Solve the Classroom Chaos!</h2>
              <p class="sub">Select the BEST TWO pieces of advice to solve this noisy situation.</p>
            </div>
          </div>
          <button class="adv-action-btn primary" onclick="window.adviceApp.nextStage()">
            Next: Crazy Advice Battle ➔
          </button>
        </div>

        <div class="puzzle-stage-layout">
          <div class="puzzle-problem-banner">
            <span class="banner-alert">${puzzle.problem}</span>
            <span class="banner-mission">Mission: Tap the 2 BEST solutions!</span>
          </div>

          <div class="puzzle-cards-grid">
            ${puzzle.cards.map(card => `
              <div class="puzzle-card ${selectedCards.has(card.id) ? 'selected' : ''}" onclick="window.adviceApp.togglePuzzleCard('${card.id}')">
                <span class="p-check">${selectedCards.has(card.id) ? '✅' : '➕'}</span>
                <span class="p-text">${card.text}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="adv-action-footer">
          <button class="adv-action-btn primary large" onclick="window.adviceApp.checkPuzzle()">
            ✅ Check Our Solutions
          </button>
          <button class="adv-action-btn" onclick="window.adviceApp.nextStage()">
            Next Stage ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 9. CRAZY ADVICE BATTLE: Banana on Head!
   */
  renderCrazyAdviceBattle(state) {
    const battleIdx = state.crazyBattleIndex || 0;
    const battle = window.ADVICE_DATA.crazyBattles[battleIdx];

    return `
      <div class="adv-scene-container scene-battle-view">
        <div class="adv-header">
          <div class="adv-title-pill battle-pill">
            <span class="icon">🍌</span>
            <div class="text-block">
              <h2>Crazy Advice Battle!</h2>
              <p class="sub">Classify each piece of advice: GOOD ADVICE 👍, FUNNY ADVICE 😂, or BAD ADVICE ❌!</p>
            </div>
          </div>
          <button class="adv-action-btn primary" onclick="window.adviceApp.nextStage()">
            Final Challenge: Save Prof. Should! 🏆 ➔
          </button>
        </div>

        <div class="battle-stage-layout">
          <div class="battle-scenario-card">
            <h1 class="scenario-headline">${battle.scenario}</h1>
          </div>

          <div class="battle-cards-trio">
            ${battle.choices.map(c => `
              <div class="battle-card-choice">
                <div class="category-icon">${c.icon}</div>
                <p class="choice-text">"${c.text}"</p>
                <div class="category-pill ${c.category}">
                  ${c.category === 'good' ? '👍 GOOD ADVICE' : (c.category === 'funny' ? '😂 FUNNY ADVICE' : '❌ BAD ADVICE')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="adv-action-footer">
          <button class="adv-action-btn" onclick="window.adviceApp.nextCrazyBattle()">
            🎲 Next Crazy Scenario
          </button>
          <button class="adv-action-btn primary large" onclick="window.adviceApp.nextStage()">
            Final Challenge: Save Professor Should! ➔
          </button>
        </div>
      </div>
    `;
  },

  /**
   * 10. FINAL CHALLENGE: Save Professor Should!
   */
  renderSaveProfessorShould(state) {
    const chaos = window.ADVICE_DATA.finalEmergency;

    return `
      <div class="adv-scene-container scene-final-chaos">
        <div class="adv-header">
          <div class="adv-title-pill final-pill">
            <span class="icon">🏆</span>
            <div class="text-block">
              <h2>FINAL MISSION: Save Professor Should!</h2>
              <p class="sub">The Professor has 5 problems at once! Teams must give at least 3 pieces of advice + reasons.</p>
            </div>
          </div>
          <button class="adv-action-btn primary" onclick="window.adviceApp.renderStage('award')">
            Award Academy Badges 🏅 ➔
          </button>
        </div>

        <div class="final-chaos-stage-layout">
          <!-- The 5 Simultaneous Problems -->
          <div class="chaos-problems-row">
            ${chaos.problems.map(p => `
              <div class="chaos-problem-card">
                <span class="prob-icon">${p.icon}</span>
                <span class="prob-title">${p.name}</span>
                <span class="prob-desc">${p.desc}</span>
              </div>
            `).join('')}
          </div>

          <!-- Team Advice Presentation Box -->
          <div class="team-presentation-box">
            <h3 class="pres-title">🗣️ TEAM SPEAKING CHALLENGE: Say 3 Sentences</h3>
            <div class="sentence-starters-grid">
              <div class="starter-card">
                <span class="num-b">1</span>
                <span>"He should ___________________________ because ___________________________."</span>
              </div>
              <div class="starter-card">
                <span class="num-b">2</span>
                <span>"He should ___________________________ because ___________________________."</span>
              </div>
              <div class="starter-card">
                <span class="num-b">3</span>
                <span>"He shouldn't _________________________ because ___________________________."</span>
              </div>
            </div>
          </div>
        </div>

        <div class="adv-action-footer">
          <div class="adv-speech-bubble highlight">
            <span class="bubble-icon">🎤</span>
            <span class="bubble-text">Teams present their 3 pieces of advice aloud to save Professor Should!</span>
          </div>
          <button class="adv-action-btn large primary" onclick="window.adviceApp.renderStage('award')">
            Complete Mission & Get Badges 🏅
          </button>
        </div>
      </div>
    `;
  },

  /**
   * AWARD CEREMONY: Advice Academy Master Badges
   */
  renderAwardCeremony(state) {
    const badges = window.ADVICE_DATA.finalEmergency.badges;

    return `
      <div class="adv-scene-container scene-award-view">
        <div class="academy-certificate-card">
          <div class="cert-gold-ribbon">⭐ THE CRAZY ADVICE ACADEMY ⭐</div>
          <h1 class="cert-headline">CERTIFIED ADVICE EXPERTS!</h1>
          <p class="cert-subtext">Professor Should is saved! Awarded for brilliant thinking, problem-solving, and English speaking.</p>

          <!-- Badges Grid -->
          <div class="badges-grid-row">
            ${badges.map(b => `
              <div class="award-badge-card" onclick="window.adviceSound.playSparkle()">
                <span class="badge-title">${b.title}</span>
                <span class="badge-desc">${b.desc}</span>
              </div>
            `).join('')}
          </div>

          <div class="cert-actions-row">
            <button class="adv-action-btn primary large" onclick="window.adviceSound.playFanfare(); window.adviceApp.launchConfetti()">
              🎉 Celebrate Again!
            </button>
            <a href="worksheets.html" target="_blank" class="adv-action-btn secondary">
              🖨️ Open 5 Printable Worksheets
            </a>
            <button class="adv-action-btn" onclick="window.adviceApp.renderStage(1)">
              🔄 Replay Lesson
            </button>
          </div>
        </div>
      </div>
    `;
  }
};

window.AdviceScenes = AdviceScenes;
