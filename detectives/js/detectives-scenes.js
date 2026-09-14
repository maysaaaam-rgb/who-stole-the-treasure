/**
 * THE MYSTERY OF YESTERDAY — SCENE CONTROLLERS & INTERACTIVE STAGES
 * High-engagement ELT mechanics for Levels 1–6 (A1/A1+ CEFR)
 */

(function(root) {
  'use strict';

  class DetectivesScenes {
    constructor(app) {
      this.app = app;
      this.data = root.DETECTIVES_DATA;
    }

    get sound() {
      return this.app.sound;
    }

    // =========================================================================
    // LEVEL 1: THE MYSTERY BEGINS (0–5 MIN)
    // =========================================================================
    renderLevel1(mount) {
      const data = this.data.LEVEL1_DATA;
      const isOpen = Boolean(this.app.state.level1NoteOpen);
      const voteState = this.app.state.level1Vote || null;

      mount.innerHTML = `
        <div class="level-header">
          <span class="level-tag">📦 Level 1 · ${data.time}</span>
          <h2 class="level-title">${data.title}</h2>
          <p class="level-subtitle">${data.boxStory.headline}</p>
        </div>

        <div class="mystery-box-container">
          ${!isOpen ? `
            <div class="box-stage-interactive ${this.app.state.level1Shaking ? 'is-shaking' : ''}" onclick="window.detectivesApp.shakeAndOpenBox()" title="Click to shake and open the box!">
              <svg class="mystery-box-svg" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#b45309" />
                    <stop offset="50%" stop-color="#d97706" />
                    <stop offset="100%" stop-color="#78350f" />
                  </linearGradient>
                  <linearGradient id="goldRibbon" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#fef08a" />
                    <stop offset="100%" stop-color="#eab308" />
                  </linearGradient>
                </defs>
                <!-- Shadow -->
                <ellipse cx="100" cy="180" rx="75" ry="16" fill="rgba(0,0,0,0.35)" />
                <!-- Box Base -->
                <rect x="35" y="70" width="130" height="100" rx="10" fill="url(#boxGrad)" stroke="#f59e0b" stroke-width="3" />
                <!-- Golden Ribbon Vertical -->
                <rect x="90" y="70" width="20" height="100" fill="url(#goldRibbon)" />
                <!-- Golden Ribbon Horizontal -->
                <rect x="35" y="115" width="130" height="20" fill="url(#goldRibbon)" />
                <!-- Box Lid -->
                <rect x="25" y="55" width="150" height="25" rx="6" fill="#92400e" stroke="#fbbf24" stroke-width="3" />
                <!-- Big Question Mark -->
                <text x="100" y="132" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="system-ui">❓</text>
                <!-- Lock Icon -->
                <circle cx="100" cy="125" r="16" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
                <text x="100" y="131" font-size="14" text-anchor="middle">🔒</text>
              </svg>
              <button type="button" class="box-action-prompt">
                <span>🔍</span> <span>Open the Mystery!</span>
              </button>
            </div>
          ` : `
            <div class="mystery-note-card">
              <div class="note-header">
                <div class="note-title">📜 The Secret Note from the Box</div>
                <button type="button" class="hud-btn" onclick="window.detectivesSound.speakTeacher(\`${data.boxStory.noteSnippet}\`)" title="Read note aloud">
                  🔊 <span>Listen</span>
                </button>
              </div>

              <div class="note-statements-list">
                ${data.teacherStatements.map(s => `
                  <div class="note-statement-item">
                    <span>${s.text}</span>
                    <button type="button" class="hud-btn" onclick="window.detectivesSound.speakTeacher('${s.text}')" title="Listen">🔊</button>
                  </div>
                `).join('')}
              </div>

              <!-- Visual Verbs Transition Bar -->
              <div class="visual-verbs-row">
                ${data.visualVerbs.map(v => `
                  <div class="visual-verb-pill">
                    <span class="verb-icon-large">${v.icon}</span>
                    <span class="verb-transform-text">${v.label}</span>
                    <span class="verb-sample-text">${v.actionText}</span>
                  </div>
                `).join('')}
              </div>

              <!-- Dinosaur Vote Challenge -->
              <div class="vote-section-box">
                <div class="vote-prompt-title">🦖 ${data.dinosaurQuestion.prompt}</div>
                <div class="vote-buttons-wrap">
                  ${data.dinosaurQuestion.options.map(opt => `
                    <button type="button" class="btn-vote ${opt.value === 'yes' ? 'vote-yes' : 'vote-no'}" onclick="window.detectivesApp.handleLevel1Vote('${opt.value}')">
                      ${opt.text}
                    </button>
                  `).join('')}
                </div>

                ${voteState ? `
                  <div class="vote-feedback-banner ${voteState === 'no' ? 'success' : 'info'}">
                    ${voteState === 'no' 
                      ? data.dinosaurQuestion.options[1].feedback 
                      : data.dinosaurQuestion.options[0].feedback}
                  </div>
                  <div style="margin-top: 14px; font-weight:800; color:#fef08a;">
                    ${data.dinosaurQuestion.ruleDiscovery}
                  </div>
                  <div style="margin-top: 16px;">
                    <button type="button" class="box-action-prompt" onclick="window.detectivesApp.renderStage(2)">
                      <span>🏃</span> <span>Start Level 2: Run to the Answer! ➔</span>
                    </button>
                  </div>
                ` : ''}
              </div>
            </div>
          `}
        </div>
      `;
    }

    // =========================================================================
    // LEVEL 2: RUN TO THE ANSWER (5–10 MIN)
    // =========================================================================
    renderLevel2(mount) {
      const data = this.data.LEVEL2_DATA;
      const qIndex = this.app.state.level2Index || 0;
      const currentQ = data.questions[qIndex];
      const answerState = this.app.state.level2Answers[qIndex];

      if (qIndex >= data.questions.length) {
        // Level complete screen
        mount.innerHTML = `
          <div class="level-header">
            <span class="level-tag">🏃 Level 2 Complete!</span>
            <h2 class="level-title">Great Running, Detectives!</h2>
            <p class="level-subtitle">You have mastered the Past Simple forms!</p>
          </div>
          <div class="run-arena-container">
            <div class="run-question-card">
              <div style="font-size: 4rem; margin-bottom: 12px;">🏆</div>
              <h3 style="font-size: 1.8rem; font-weight:900; color:#fef08a; margin-bottom: 10px;">5 of 5 Targets Solved!</h3>
              <p style="font-size: 1.1rem; color:#cbd5e1; margin-bottom: 20px;">
                You identified: <strong>ATE</strong>, <strong>WENT</strong>, <strong>SAW</strong>, <strong>PLAYED</strong>, and <strong>WATCHED</strong>!
              </p>
              <div style="display:flex; gap:12px; justify-content:center;">
                <button type="button" class="hud-btn" onclick="window.detectivesApp.resetLevel2()">🔄 Practice Again</button>
                <button type="button" class="box-action-prompt" onclick="window.detectivesApp.renderStage(3)">
                  <span>🕵️</span> <span>Level 3: Two Truths & One Lie ➔</span>
                </button>
              </div>
            </div>
          </div>
        `;
        return;
      }

      mount.innerHTML = `
        <div class="level-header">
          <span class="level-tag">🏃 Level 2 · ${data.time}</span>
          <h2 class="level-title">${data.title}</h2>
          <p class="level-subtitle">${data.instructions}</p>
        </div>

        <div class="run-arena-container">
          <div class="run-question-card">
            <div class="run-question-counter">Question ${qIndex + 1} of ${data.questions.length}</div>
            <div class="run-sentence-prompt">
              ${currentQ.prompt.replace('___', `<span class="run-blank-slot">${answerState && answerState.selectedVerb ? answerState.selectedVerb : '???'}</span>`)}
            </div>

            <div style="margin-top: 14px;">
              <button type="button" class="hud-btn" onclick="window.detectivesSound.speakTeacher('${currentQ.prompt}')" title="Listen to question">
                🔊 <span>Listen</span>
              </button>
            </div>
          </div>

          <!-- Giant Touch Zones (A, B, C) -->
          <div class="run-options-grid">
            ${currentQ.options.map((opt, i) => {
              const letter = ['A', 'B', 'C'][i];
              let stateClass = '';
              if (answerState) {
                if (i === currentQ.correctIndex) stateClass = 'is-correct';
                else if (i === answerState.chosenIndex) stateClass = 'is-wrong';
              }
              return `
                <button type="button" class="btn-run-zone ${stateClass}" onclick="window.detectivesApp.handleLevel2Answer(${i})">
                  <span class="zone-letter">Zone ${letter}</span>
                  <span>${opt}</span>
                </button>
              `;
            }).join('')}
          </div>

          ${answerState ? `
            <div class="vote-feedback-banner ${answerState.isCorrect ? 'success' : 'info'}" style="max-width:600px; text-align:center;">
              ${answerState.isCorrect ? '✅ ' + currentQ.explanation : '❌ Not quite! Notice: ' + currentQ.explanation}
              <div style="margin-top: 12px;">
                <button type="button" class="box-action-prompt" onclick="window.detectivesApp.nextLevel2Question()">
                  <span>Next Target ➔</span>
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    // =========================================================================
    // LEVEL 3: TWO TRUTHS & ONE LIE (MAIN GAME)
    // =========================================================================
    renderLevel3(mount) {
      const data = this.data.LEVEL3_DATA;
      const roundIdx = this.app.state.level3Round || 0;
      const currentRound = data.rounds[roundIdx];
      const isRevealed = Boolean(this.app.state.level3Revealed);
      const chosenCard = this.app.state.level3ChosenCard;

      mount.innerHTML = `
        <div class="level-header">
          <span class="level-tag">🕵️ Level 3 · ${data.time}</span>
          <h2 class="level-title">${data.title}</h2>
          <p class="level-subtitle">Round ${currentRound.roundNumber} of ${data.rounds.length}: <strong>${currentRound.theme}</strong> (${currentRound.difficulty})</p>
        </div>

        <div class="two-truths-container">
          <div class="cards-investigation-row">
            ${currentRound.cards.map((c, i) => {
              const isLie = c.isLie;
              const isSelected = chosenCard === i;
              return `
                <div class="truth-card ${isSelected ? 'is-selected' : ''}" onclick="window.detectivesApp.selectLevel3Card(${i})">
                  <div class="card-number-badge">${c.num}</div>
                  <div class="card-illustration">${c.icon}</div>
                  <div class="card-text-sentence">${c.text}</div>
                  
                  <button type="button" class="hud-btn" onclick="event.stopPropagation(); window.detectivesSound.speakTeacher('${c.text}')" title="Listen">
                    🔊
                  </button>

                  <!-- Stamp Overlay -->
                  <div class="card-stamp-overlay ${isLie ? 'stamp-lie' : 'stamp-true'} ${isRevealed ? 'is-revealed' : ''}">
                    ${isLie ? '🔴 LIE!' : '🟢 TRUE!'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Voting & Reveal Action Bar -->
          <div class="voting-action-bar">
            <span style="font-weight:900; color:#f59e0b;">Class Vote:</span>
            <button type="button" class="btn-vote-choice" onclick="window.detectivesApp.selectLevel3Card(0)" title="Vote 1">1️⃣</button>
            <button type="button" class="btn-vote-choice" onclick="window.detectivesApp.selectLevel3Card(1)" title="Vote 2">2️⃣</button>
            <button type="button" class="btn-vote-choice" onclick="window.detectivesApp.selectLevel3Card(2)" title="Vote 3">3️⃣</button>

            <button type="button" class="btn-reveal-lie" onclick="window.detectivesApp.revealLevel3Lie()">
              <span>🔍</span> <span>Reveal the LIE!</span>
            </button>
          </div>

          ${isRevealed ? `
            <div class="vote-feedback-banner success" style="max-width: 750px; text-align: center; animation: pop-in 0.4s ease;">
              <h4 style="font-size: 1.2rem; margin-bottom: 6px; color:#fef08a;">🔍 Case Verdict:</h4>
              <p style="font-size: 1.05rem; margin-bottom: 8px;">${currentRound.explanation}</p>
              <div style="background: rgba(15,23,42,0.6); padding: 8px 14px; border-radius: 8px; font-size: 0.95rem; color:#38bdf8; font-weight:800;">
                💡 Question Drill: "${currentRound.didQuestion}"
              </div>
              
              <div style="margin-top: 16px; display:flex; gap:12px; justify-content:center;">
                ${roundIdx + 1 < data.rounds.length ? `
                  <button type="button" class="box-action-prompt" onclick="window.detectivesApp.nextLevel3Round()">
                    <span>Next Investigation Round ➔</span>
                  </button>
                ` : `
                  <button type="button" class="box-action-prompt" onclick="window.detectivesApp.renderStage(4)">
                    <span>🧟 Level 4: Crazy Monster Suspect ➔</span>
                  </button>
                `}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    // =========================================================================
    // LEVEL 4: CRAZY SUSPECT (18–25 MIN)
    // =========================================================================
    renderLevel4(mount) {
      const data = this.data.LEVEL4_DATA;
      const monsterEmotion = this.app.state.level4MonsterEmotion || 'happy';
      const speechText = this.app.state.level4Speech || data.introSpeech;
      const askedQuestions = this.app.state.level4Asked || {};

      mount.innerHTML = `
        <div class="level-header">
          <span class="level-tag">🧟 Level 4 · ${data.time}</span>
          <h2 class="level-title">${data.title}</h2>
          <p class="level-subtitle">${data.suspectDescription}</p>
        </div>

        <div class="interrogation-room">
          <!-- Monster Avatar Card -->
          <div class="monster-avatar-card">
            <div class="monster-svg-wrap ${monsterEmotion}">
              <svg viewBox="0 0 200 200" width="100%" height="100%">
                <!-- Horns -->
                <polygon points="50,50 35,20 65,40" fill="#f59e0b" stroke="#78350f" stroke-width="2" />
                <polygon points="150,50 165,20 135,40" fill="#f59e0b" stroke="#78350f" stroke-width="2" />
                <!-- Monster Furry Body -->
                <circle cx="100" cy="115" r="75" fill="#0284c7" stroke="#38bdf8" stroke-width="4" />
                <!-- Belly Patch -->
                <ellipse cx="100" cy="135" rx="45" ry="38" fill="#38bdf8" opacity="0.6" />
                <!-- Big Googly Eyes -->
                <circle cx="75" cy="95" r="22" fill="#ffffff" stroke="#0f172a" stroke-width="3" />
                <circle cx="125" cy="95" r="22" fill="#ffffff" stroke="#0f172a" stroke-width="3" />
                <!-- Pupils (reactive) -->
                ${monsterEmotion === 'caught' ? `
                  <!-- Sweating nervous eyes -->
                  <circle cx="70" cy="98" r="8" fill="#0f172a" />
                  <circle cx="120" cy="98" r="8" fill="#0f172a" />
                  <!-- Sweat drops -->
                  <path d="M 155,75 Q 162,85 155,92 Q 148,85 155,75" fill="#38bdf8" />
                ` : monsterEmotion === 'laughing' ? `
                  <!-- Squinty laughing eyes -->
                  <path d="M 60,95 Q 75,85 90,95" stroke="#0f172a" stroke-width="4" fill="none" />
                  <path d="M 110,95 Q 125,85 140,95" stroke="#0f172a" stroke-width="4" fill="none" />
                ` : `
                  <!-- Normal friendly pupils -->
                  <circle cx="78" cy="95" r="9" fill="#0f172a" />
                  <circle cx="128" cy="95" r="9" fill="#0f172a" />
                  <circle cx="81" cy="92" r="3" fill="#ffffff" />
                  <circle cx="131" cy="92" r="3" fill="#ffffff" />
                `}
                <!-- Mouth -->
                ${monsterEmotion === 'caught' ? `
                  <path d="M 80,150 Q 100,135 120,150" stroke="#0f172a" stroke-width="4" fill="none" />
                ` : `
                  <path d="M 75,140 Q 100,165 125,140 Z" fill="#991b1b" stroke="#0f172a" stroke-width="3" />
                  <!-- Fangs -->
                  <polygon points="85,140 92,148 99,140" fill="#ffffff" />
                  <polygon points="101,140 108,148 115,140" fill="#ffffff" />
                `}
              </svg>
            </div>
            <div class="monster-name-tag">${data.suspectName}</div>
            <div class="monster-status-tag">Status: Under Interrogation 🔍</div>
          </div>

          <!-- Interrogation Dialogue Hub -->
          <div class="interrogation-dialogue-hub">
            <div class="monster-speech-bubble" id="monster-bubble">
              "${speechText}"
            </div>

            <div class="question-choices-header">
              <span>🎤</span> <span>Choose a Question to Ask the Suspect:</span>
            </div>

            <div class="questions-buttons-stack">
              ${data.interrogationQuestions.map(q => {
                const asked = askedQuestions[q.id];
                return `
                  <button type="button" class="btn-ask-question ${asked ? 'has-been-asked' : ''}" onclick="window.detectivesApp.askMonsterQuestion('${q.id}')">
                    <span>❓ "${q.text}"</span>
                    ${asked ? '<span style="font-size:0.85rem; font-weight:900;">✓ Asked</span>' : '<span>➔</span>'}
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Partner Practice Box -->
            <div style="background: rgba(15,23,42,0.7); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:12px 18px;">
              <div style="font-size:0.85rem; font-weight:800; color:#f59e0b; margin-bottom:4px;">🗣️ Dialogue Practice with Partner:</div>
              <div style="font-size:0.95rem; color:#ffffff;">${data.dialogueDrill.frameQuestion} ➔ ${data.dialogueDrill.frameAnswerYes} / ${data.dialogueDrill.frameAnswerNo}</div>
            </div>

            ${Object.keys(askedQuestions).length >= 3 ? `
              <div style="margin-top: 10px; animation: pop-in 0.3s ease;">
                <button type="button" class="box-action-prompt" onclick="window.detectivesApp.renderStage(5)">
                  <span>🗣️ Level 5: Students Become Suspects ➔</span>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    // =========================================================================
    // LEVEL 5: STUDENTS BECOME SUSPECTS (25–31 MIN)
    // =========================================================================
    renderLevel5(mount) {
      const data = this.data.LEVEL5_DATA;
      const slots = this.app.state.studentSlots || [null, null, null];
      const lieSlot = this.app.state.studentLieSlot; // 0, 1, or 2

      mount.innerHTML = `
        <div class="level-header">
          <span class="level-tag">🗣️ Level 5 · ${data.time}</span>
          <h2 class="level-title">${data.title}</h2>
          <p class="level-subtitle">${data.instructions}</p>
        </div>

        <div class="student-builder-container">
          <!-- Quick Preset Demo Buttons -->
          <div style="display:flex; align-items:center; gap:10px; justify-content:center;">
            <span style="font-size:0.85rem; font-weight:800; color:#cbd5e1;">Quick Load Demo:</span>
            ${data.presetChallenges.map((demo, i) => `
              <button type="button" class="hud-btn" onclick="window.detectivesApp.loadStudentDemo(${i})">
                📋 <span>${demo.author}</span>
              </button>
            `).join('')}
            <button type="button" class="hud-btn" onclick="window.detectivesApp.clearStudentSlots()">
              🗑️ <span>Clear</span>
            </button>
          </div>

          <!-- Action Palette Grid (8 Verbs) -->
          <div>
            <div class="palette-section-title">Tap an Action to add to your sentences:</div>
            <div class="actions-palette-grid">
              ${data.actionPalette.map(act => `
                <div class="action-card-token" onclick="window.detectivesApp.addSentenceFromAction('${act.id}')">
                  <span class="action-token-icon">${act.icon}</span>
                  <div class="action-token-verbs">
                    <span class="action-token-past">${act.past.toUpperCase()}</span>
                    <span class="action-token-base">base: ${act.base}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- The 3 Sentence Slots -->
          <div class="student-slots-row">
            ${[0, 1, 2].map(i => {
              const sentence = slots[i];
              const isLie = lieSlot === i;
              return `
                <div class="student-slot-card ${sentence ? 'has-content' : ''} ${isLie ? 'is-lie-marked' : ''}">
                  <div class="slot-header-bar">
                    <span class="slot-label">Sentence ${i + 1}</span>
                    <button type="button" class="btn-toggle-lie-tag ${isLie ? 'is-active' : ''}" onclick="window.detectivesApp.toggleLieSlot(${i})">
                      ${isLie ? '❌ SECRET LIE' : 'Mark as LIE'}
                    </button>
                  </div>
                  <div class="slot-sentence-text">
                    ${sentence || '<em style="color:#64748b;">(Tap an action verb above)</em>'}
                  </div>
                  ${sentence ? `
                    <button type="button" class="hud-btn" style="align-self:flex-start; padding:2px 8px; font-size:0.75rem;" onclick="window.detectivesSound.speakTeacher('${sentence}')">
                      🔊 Listen
                    </button>
                  ` : '<div></div>'}
                </div>
              `;
            }).join('')}
          </div>

          <div style="display:flex; justify-content:center; margin-top:10px;">
            <button type="button" class="box-action-prompt" onclick="window.detectivesApp.renderStage(6)">
              <span>🏆 Level 6: Final Detective Challenge ➔</span>
            </button>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // LEVEL 6: FINAL DETECTIVE CHALLENGE & UNLOCK (31–35 MIN)
    // =========================================================================
    renderLevel6(mount) {
      const data = this.data.LEVEL6_DATA;
      const isBoxUnlocked = Boolean(this.app.state.mysterySolved);
      const c1Solved = Boolean(this.app.state.finalC1Solved);
      const c2Solved = Boolean(this.app.state.finalC2Solved);

      mount.innerHTML = `
        <div class="level-header">
          <span class="level-tag">🏆 Level 6 · ${data.time}</span>
          <h2 class="level-title">${data.title}</h2>
          <p class="level-subtitle">${data.caseTitle}</p>
        </div>

        <div class="final-challenge-container">
          <!-- Story Dossier Card -->
          <div class="story-dossier-card">
            <div class="dossier-title">
              <span>📖</span> <span>Mia's Sunday Story Dossier</span>
            </div>
            <div class="dossier-lines">
              ${data.storyPassage.map(line => `
                <div>${line}</div>
              `).join('')}
            </div>
          </div>

          ${!isBoxUnlocked ? `
            <!-- Challenge 1: Find the Lie -->
            ${!c1Solved ? `
              <div class="vote-section-box">
                <div class="vote-prompt-title">❓ ${data.challenge1.question}</div>
                <div style="display:flex; flex-direction:column; gap:10px; max-width:600px; margin:0 auto;">
                  ${data.challenge1.options.map((opt, i) => `
                    <button type="button" class="btn-ask-question" onclick="window.detectivesApp.handleFinalC1(${i})">
                      ${opt}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : `
              <!-- Challenge 2: Did Mia see a dragon? -->
              <div class="vote-section-box" style="animation: fadeIn 0.3s ease;">
                <div class="vote-prompt-title">❓ ${data.challenge2.question}</div>
                <div class="vote-buttons-wrap">
                  ${data.challenge2.options.map((opt, i) => `
                    <button type="button" class="btn-vote ${i === 0 ? 'vote-yes' : 'vote-no'}" onclick="window.detectivesApp.handleFinalC2(${i})">
                      ${opt}
                    </button>
                  `).join('')}
                </div>
              </div>
            `}
          ` : `
            <!-- Mystery Box Solved Celebration! -->
            <div class="victory-card">
              <div style="font-size: 5rem;">🔓✨</div>
              <h3 class="victory-title">${data.unlockReward.finalMessage}</h3>
              <div class="victory-xp-banner">⭐ +${data.unlockReward.xpBonus} Detective XP Awarded!</div>
              
              <div style="background:rgba(15,23,42,0.8); border:2px solid #f59e0b; border-radius:16px; padding:20px 30px; max-width:550px;">
                <div style="font-size:2.5rem; margin-bottom:8px;">🏆</div>
                <h4 style="font-size:1.4rem; color:#fef08a; font-weight:900;">${data.unlockReward.badgeName}</h4>
                <p style="color:#cbd5e1; margin-top:4px;">${data.unlockReward.badgeDesc}</p>
              </div>

              <div style="display:flex; gap:14px; margin-top:10px; flex-wrap:wrap; justify-content:center;">
                <a href="worksheet.html" target="_blank" class="hud-btn primary" style="font-size:1.1rem; padding:12px 24px;">
                  🖨️ <span>Print Detective Case File</span>
                </a>
                <button type="button" class="hud-btn" style="font-size:1.1rem; padding:12px 24px;" onclick="window.detectivesApp.restartGame()">
                  🔄 <span>Play Again</span>
                </button>
                <a href="../index.html#library" class="hud-btn" style="font-size:1.1rem; padding:12px 24px; background:#e0f2fe; color:#0369a1; border-color:#38bdf8;">
                  📚 <span>Return to Library</span>
                </a>
              </div>
            </div>
          `}
        </div>
      `;
    }
  }

  root.DetectivesScenes = DetectivesScenes;

})(typeof window !== 'undefined' ? window : global);
