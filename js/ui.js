/**
 * UI Controller for "Who Stole the Treasure?"
 * Coordinates screen transitions, whiteboard interactions, touch feedback, modal dialogues, animations & confetti.
 */

class UIController {
  constructor() {
    this.currentView = "intro";
    this.confettiRunning = false;
    this.confettiParticles = [];
    this.confettiCanvas = null;
    this.confettiCtx = null;
  }

  init() {
    this.initConfetti();
    this.bindGlobalEvents();
    this.updateScoreboard();
    this.showScreen("intro");
  }

  // =========================================================================
  // SCREEN TRANSITIONS & NAVIGATION
  // =========================================================================

  showScreen(screenId) {
    this.currentView = screenId;
    window.gameEngine.currentSection = screenId;

    // Hide all screens
    document.querySelectorAll(".screen-view").forEach(el => el.classList.remove("active"));

    // Activate selected screen
    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
      target.classList.add("active");
    }

    // Stop speaking when switching screens
    if (window.soundEngine) window.soundEngine.stopSpeech();

    // Render screen specific content
    switch (screenId) {
      case "intro":
        this.renderIntro();
        break;
      case "mg1":
        this.renderMiniGame1();
        break;
      case "mg2":
        this.renderMiniGame2();
        break;
      case "mg3":
        this.renderMiniGame3();
        break;
      case "mg4":
        this.renderMiniGame4();
        break;
      case "mg5":
        this.renderMiniGame5();
        break;
      case "boss":
        this.renderBossLock();
        break;
      case "investigation":
        this.renderInvestigation();
        break;
      case "accusation":
        this.renderAccusation();
        break;
      case "victory":
        this.renderVictory();
        break;
    }

    this.updateScoreboard();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // =========================================================================
  // SCOREBOARD & TEAM CONTROLS
  // =========================================================================

  updateScoreboard() {
    const scores = window.gameEngine.scores;
    const activeTeam = window.gameEngine.getActiveTeam();

    // Update Team score cards
    GAME_DATA.teams.forEach(team => {
      const starEl = document.getElementById(`score-val-${team.id}`);
      if (starEl) {
        starEl.textContent = scores[team.id];
      }

      const cardEl = document.getElementById(`team-card-${team.id}`);
      if (cardEl) {
        if (team.id === activeTeam.id) {
          cardEl.classList.add("active-turn");
        } else {
          cardEl.classList.remove("active-turn");
        }
      }
    });

    // Update Turn Indicator Banner
    const turnBanner = document.getElementById("active-turn-pill");
    if (turnBanner) {
      turnBanner.className = `turn-pill turn-${activeTeam.id}`;
      turnBanner.innerHTML = `${activeTeam.emoji} <span>TURN: ${activeTeam.name.toUpperCase()}</span>`;
    }
  }

  awardPointsToActive(amount) {
    const active = window.gameEngine.getActiveTeam();
    window.gameEngine.addPoints(active.id, amount);
    this.updateScoreboard();
    this.spawnFloatingStar(active.id, amount);
  }

  spawnFloatingStar(teamId, amount) {
    const cardEl = document.getElementById(`team-card-${teamId}`);
    if (!cardEl) return;

    const floater = document.createElement("div");
    floater.textContent = `+${amount} ⭐`;
    floater.style.position = "absolute";
    floater.style.top = "-20px";
    floater.style.left = "50%";
    floater.style.transform = "translateX(-50%)";
    floater.style.color = "var(--primary-gold)";
    floater.style.fontFamily = "'Bungee', cursive";
    floater.style.fontSize = "1.5rem";
    floater.style.textShadow = "0 2px 8px rgba(0,0,0,0.5)";
    floater.style.pointerEvents = "none";
    floater.style.transition = "all 0.8s ease-out";
    floater.style.zIndex = "200";

    cardEl.appendChild(floater);
    setTimeout(() => {
      floater.style.top = "-60px";
      floater.style.opacity = "0";
    }, 20);
    setTimeout(() => floater.remove(), 850);
  }

  // =========================================================================
  // INTRO SCREEN
  // =========================================================================

  renderIntro() {
    const container = document.getElementById("intro-suspects-preview");
    if (!container) return;

    container.innerHTML = GAME_DATA.suspects
      .map(s => `<div class="suspect-mini-chip">${s.avatar} ${s.name}</div>`)
      .join("");
  }

  // =========================================================================
  // MINI-GAME 1: DETECTIVE QUESTION MATCH
  // =========================================================================

  renderMiniGame1() {
    const currentIdx = window.gameEngine.mgIndex.mg1;
    const item = GAME_DATA.miniGame1[currentIdx];
    const total = GAME_DATA.miniGame1.length;

    const container = document.getElementById("mg1-content");
    if (!container) return;

    container.innerHTML = `
      <div class="card-header-banner">
        <span class="card-tag">MISSION 1: QUESTION MATCH (Level ${currentIdx + 1}/${total})</span>
        <h2 class="main-heading">❓ Detective Question Match</h2>
        <p class="sub-heading">Choose the correct answer for the detective question!</p>
      </div>

      <div class="question-spotlight-box">
        <div class="spotlight-avatar">${item.characterImg}</div>
        <div class="spotlight-content">
          <div class="spotlight-character-name">${item.character}</div>
          <div class="spotlight-question-text">"${item.question}"</div>
        </div>
        <button class="speak-icon-btn" onclick="soundEngine.speak('${item.speechQuestion}')" title="Listen to question">🔊</button>
      </div>

      <div class="choices-grid">
        ${item.options.map((opt, i) => `
          <button class="choice-card-btn" id="mg1-opt-${i}" onclick="uiController.handleMG1Answer(${i})">
            <span class="choice-emoji">${opt.emoji || '💬'}</span>
            <span class="choice-text">${opt.text}</span>
          </button>
        `).join("")}
      </div>

      <div id="mg1-feedback-area" style="width: 100%; max-width: 850px;"></div>
    `;

    // Speak the question automatically after slight delay
    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(item.speechQuestion);
    }, 400);
  }

  handleMG1Answer(choiceIdx) {
    const currentIdx = window.gameEngine.mgIndex.mg1;
    const item = GAME_DATA.miniGame1[currentIdx];
    const selected = item.options[choiceIdx];
    const total = GAME_DATA.miniGame1.length;
    const feedbackArea = document.getElementById("mg1-feedback-area");
    const btn = document.getElementById(`mg1-opt-${choiceIdx}`);

    if (selected.isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(selected.speech || selected.text);
      }
      btn.classList.add("correct-choice");

      feedbackArea.innerHTML = `
        <div class="feedback-box">
          <div>
            <div class="feedback-text">🎉 EXCELLENT DETECTIVE WORK!</div>
            <div style="font-weight: 700; color: #475569; margin-top: 4px;">${item.grammarNote}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="jumbo-btn btn-gold" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.awardPointsToActive(2)">+2 ⭐ Points</button>
            <button class="jumbo-btn btn-ocean" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.nextMG1Question()">
              ${currentIdx + 1 < total ? 'NEXT QUESTION ➔' : 'FINISH MISSION 1 ➔'}
            </button>
          </div>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Try again!");
      }
      btn.classList.add("wrong-choice");
      setTimeout(() => btn.classList.remove("wrong-choice"), 600);

      feedbackArea.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Not quite! Look carefully at the question. Try again!</div>
        </div>
      `;
    }
  }

  nextMG1Question() {
    const total = GAME_DATA.miniGame1.length;
    if (window.gameEngine.mgIndex.mg1 + 1 < total) {
      window.gameEngine.mgIndex.mg1++;
      window.gameEngine.nextTeam();
      this.renderMiniGame1();
    } else {
      this.showScreen("mg2");
    }
  }

  // =========================================================================
  // MINI-GAME 2: WHO AM I? (PROFILE MATCH)
  // =========================================================================

  renderMiniGame2() {
    const currentIdx = window.gameEngine.mgIndex.mg2;
    const item = GAME_DATA.miniGame2[currentIdx];
    const total = GAME_DATA.miniGame2.length;
    const container = document.getElementById("mg2-content");
    if (!container) return;

    container.innerHTML = `
      <div class="card-header-banner">
        <span class="card-tag">MISSION 2: PROFILE MATCH (Level ${currentIdx + 1}/${total})</span>
        <h2 class="main-heading">🔎 Who Am I? (Suspect Profiles)</h2>
        <p class="sub-heading">Read the visual profile badges and find the matching English sentence!</p>
      </div>

      <div class="question-spotlight-box" style="flex-direction: column; align-items: center; text-align: center;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div class="spotlight-avatar">${item.avatar}</div>
          <div class="spotlight-character-name" style="font-size: 1.6rem; color: #1e293b;">${item.name}</div>
          <button class="speak-icon-btn" onclick="soundEngine.speak('${item.speechQuestion}')">🔊</button>
        </div>

        <div class="profile-badges-row">
          ${item.clues.map(c => `<div class="info-badge">${c.icon} ${c.label}</div>`).join("")}
        </div>

        <div class="spotlight-question-text" style="font-size: 1.4rem; color: #334155;">"${item.question}"</div>
      </div>

      <div class="choices-grid">
        ${item.options.map((opt, i) => `
          <button class="choice-card-btn" id="mg2-opt-${i}" onclick="uiController.handleMG2Answer(${i})">
            <span class="choice-text" style="font-size: 1.25rem;">${opt.text}</span>
          </button>
        `).join("")}
      </div>

      <div id="mg2-feedback-area" style="width: 100%; max-width: 850px;"></div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(item.speechQuestion);
    }, 400);
  }

  handleMG2Answer(choiceIdx) {
    const currentIdx = window.gameEngine.mgIndex.mg2;
    const item = GAME_DATA.miniGame2[currentIdx];
    const selected = item.options[choiceIdx];
    const total = GAME_DATA.miniGame2.length;
    const feedbackArea = document.getElementById("mg2-feedback-area");
    const btn = document.getElementById(`mg2-opt-${choiceIdx}`);

    if (selected.isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(selected.speech || item.sayItSentence);
      }
      btn.classList.add("correct-choice");

      feedbackArea.innerHTML = `
        <div class="feedback-box">
          <div>
            <div class="feedback-text">⭐ GREAT MATCH!</div>
            <div class="say-it-banner" style="margin-top: 8px;">
              <span>🗣️ SAY IT WITH YOUR TEAM:</span>
              <strong style="color: #78350f;">"${item.sayItSentence}"</strong>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${item.sayItSentence}')" style="width: 36px; height: 36px;">🔊</button>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="jumbo-btn btn-gold" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.awardPointsToActive(2)">+2 ⭐ Points</button>
            <button class="jumbo-btn btn-ocean" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.nextMG2Question()">
              ${currentIdx + 1 < total ? 'NEXT PROFILE ➔' : 'FINISH MISSION 2 ➔'}
            </button>
          </div>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Look at the profile again!");
      }
      btn.classList.add("wrong-choice");
      setTimeout(() => btn.classList.remove("wrong-choice"), 600);

      feedbackArea.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Look at the badges closely! Try again!</div>
        </div>
      `;
    }
  }

  nextMG2Question() {
    const total = GAME_DATA.miniGame2.length;
    if (window.gameEngine.mgIndex.mg2 + 1 < total) {
      window.gameEngine.mgIndex.mg2++;
      window.gameEngine.nextTeam();
      this.renderMiniGame2();
    } else {
      this.showScreen("mg3");
    }
  }

  // =========================================================================
  // MINI-GAME 3: CAN / CAN'T CHALLENGE
  // =========================================================================

  renderMiniGame3() {
    const currentIdx = window.gameEngine.mgIndex.mg3;
    const item = GAME_DATA.miniGame3[currentIdx];
    const total = GAME_DATA.miniGame3.length;
    const container = document.getElementById("mg3-content");
    if (!container) return;

    container.innerHTML = `
      <div class="card-header-banner">
        <span class="card-tag">MISSION 3: ABILITIES (Level ${currentIdx + 1}/${total})</span>
        <h2 class="main-heading">⚡ Can / Can't Challenge</h2>
        <p class="sub-heading">Look at the cartoon situation and answer: Can they do it?</p>
      </div>

      <div class="question-spotlight-box" style="justify-content: center; text-align: center; flex-direction: column;">
        <div style="font-size: 4.5rem; margin-bottom: 8px;">${item.imageEmoji}</div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="spotlight-question-text" style="font-size: 2rem;">"${item.question}"</div>
          <button class="speak-icon-btn" onclick="soundEngine.speak('${item.speechQuestion}')">🔊</button>
        </div>
      </div>

      <div class="choices-grid two-columns" style="max-width: 600px;">
        <button class="choice-card-btn" id="mg3-btn-yes" onclick="uiController.handleMG3Answer('yes')">
          <span class="choice-emoji">👍</span>
          <span class="choice-text" style="color: #059669; font-size: 1.6rem;">YES, IT CAN!</span>
        </button>
        <button class="choice-card-btn" id="mg3-btn-no" onclick="uiController.handleMG3Answer('no')">
          <span class="choice-emoji">👎</span>
          <span class="choice-text" style="color: #dc2626; font-size: 1.6rem;">NO, IT CAN'T!</span>
        </button>
      </div>

      <div id="mg3-feedback-area" style="width: 100%; max-width: 850px;"></div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(item.speechQuestion);
    }, 400);
  }

  handleMG3Answer(choice) {
    const currentIdx = window.gameEngine.mgIndex.mg3;
    const item = GAME_DATA.miniGame3[currentIdx];
    const total = GAME_DATA.miniGame3.length;
    const feedbackArea = document.getElementById("mg3-feedback-area");
    const btnYes = document.getElementById("mg3-btn-yes");
    const btnNo = document.getElementById("mg3-btn-no");

    if (choice === item.correctAnswer) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(item.spokenSentence);
      }
      (choice === 'yes' ? btnYes : btnNo).classList.add("correct-choice");

      feedbackArea.innerHTML = `
        <div class="feedback-box">
          <div>
            <div class="feedback-text">🎉 CORRECT!</div>
            <div class="say-it-banner" style="margin-top: 8px;">
              <span>🗣️ SAY THE FULL SENTENCE:</span>
              <strong style="color: #78350f;">"${item.fullSentence}"</strong>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${item.spokenSentence}')" style="width: 36px; height: 36px;">🔊</button>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="jumbo-btn btn-gold" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.awardPointsToActive(2)">+2 ⭐ Points</button>
            <button class="jumbo-btn btn-ocean" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.nextMG3Question()">
              ${currentIdx + 1 < total ? 'NEXT SITUATION ➔' : 'FINISH MISSION 3 ➔'}
            </button>
          </div>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Try again!");
      }
      const wrongBtn = choice === 'yes' ? btnYes : btnNo;
      wrongBtn.classList.add("wrong-choice");
      setTimeout(() => wrongBtn.classList.remove("wrong-choice"), 600);

      feedbackArea.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Think about what animals can or can't do! Try again!</div>
        </div>
      `;
    }
  }

  nextMG3Question() {
    const total = GAME_DATA.miniGame3.length;
    if (window.gameEngine.mgIndex.mg3 + 1 < total) {
      window.gameEngine.mgIndex.mg3++;
      window.gameEngine.nextTeam();
      this.renderMiniGame3();
    } else {
      this.showScreen("mg4");
    }
  }

  // =========================================================================
  // MINI-GAME 4: DO YOU LIKE / DOES HE/SHE LIKE?
  // =========================================================================

  renderMiniGame4() {
    const currentIdx = window.gameEngine.mgIndex.mg4;
    const item = GAME_DATA.miniGame4[currentIdx];
    const total = GAME_DATA.miniGame4.length;
    const container = document.getElementById("mg4-content");
    if (!container) return;

    if (item.type === "direct") {
      container.innerHTML = `
        <div class="card-header-banner">
          <span class="card-tag">MISSION 4: LIKES & DISLIKES (Level ${currentIdx + 1}/${total})</span>
          <h2 class="main-heading">❤️ Do You Like...?</h2>
          <p class="sub-heading">${item.prompt}</p>
        </div>

        <div class="question-spotlight-box" style="justify-content: center; text-align: center; flex-direction: column;">
          <div style="font-size: 5rem; margin-bottom: 6px;">${item.emoji}</div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="spotlight-question-text" style="font-size: 2.2rem;">"${item.question}"</div>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${item.speechQuestion}')">🔊</button>
          </div>
        </div>

        <div class="choices-grid two-columns" style="max-width: 600px;">
          ${item.options.map((opt, i) => `
            <button class="choice-card-btn" onclick="uiController.handleMG4Direct('${opt.value}', '${opt.audio}')">
              <span class="choice-text" style="font-size: 1.5rem;">${opt.text}</span>
            </button>
          `).join("")}
        </div>

        <div id="mg4-feedback-area" style="width: 100%; max-width: 850px;"></div>
      `;
    } else {
      // Detective 3rd person singular mode
      container.innerHTML = `
        <div class="card-header-banner">
          <span class="card-tag">MISSION 4: DETECTIVE HE/SHE LIKES (Level ${currentIdx + 1}/${total})</span>
          <h2 class="main-heading">🔍 Does He / She Like...?</h2>
          <p class="sub-heading">${item.hint}</p>
        </div>

        <div class="question-spotlight-box">
          <div class="spotlight-avatar">${item.suspectEmoji}</div>
          <div class="spotlight-content">
            <div style="font-size: 1.1rem; font-weight: 800; color: #64748b;">${item.likesText}</div>
            <div class="spotlight-question-text" style="font-size: 1.8rem;">"${item.question}"</div>
          </div>
          <button class="speak-icon-btn" onclick="soundEngine.speak('${item.speechQuestion}')">🔊</button>
        </div>

        <div class="choices-grid">
          ${item.options.map((opt, i) => `
            <button class="choice-card-btn" id="mg4-opt-${i}" onclick="uiController.handleMG4Detective(${i})">
              <span class="choice-text" style="font-size: 1.3rem;">${opt.text}</span>
            </button>
          `).join("")}
        </div>

        <div id="mg4-feedback-area" style="width: 100%; max-width: 850px;"></div>
      `;
    }

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(item.speechQuestion);
    }, 400);
  }

  handleMG4Direct(value, speechAudio) {
    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak(speechAudio);
    }
    const currentIdx = window.gameEngine.mgIndex.mg4;
    const total = GAME_DATA.miniGame4.length;
    const feedbackArea = document.getElementById("mg4-feedback-area");

    feedbackArea.innerHTML = `
      <div class="feedback-box">
        <div class="feedback-text">🗣️ Great speaking! Award team points!</div>
        <div style="display: flex; gap: 8px;">
          <button class="jumbo-btn btn-gold" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.awardPointsToActive(1)">+1 ⭐ Point</button>
          <button class="jumbo-btn btn-ocean" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.nextMG4Question()">
            ${currentIdx + 1 < total ? 'NEXT QUESTION ➔' : 'FINISH MISSION 4 ➔'}
          </button>
        </div>
      </div>
    `;
  }

  handleMG4Detective(choiceIdx) {
    const currentIdx = window.gameEngine.mgIndex.mg4;
    const item = GAME_DATA.miniGame4[currentIdx];
    const selected = item.options[choiceIdx];
    const total = GAME_DATA.miniGame4.length;
    const feedbackArea = document.getElementById("mg4-feedback-area");
    const btn = document.getElementById(`mg4-opt-${choiceIdx}`);

    if (selected.isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(selected.speech);
      }
      btn.classList.add("correct-choice");

      feedbackArea.innerHTML = `
        <div class="feedback-box">
          <div>
            <div class="feedback-text">⭐ PERFECT GRAMMAR!</div>
            <div style="font-weight: 700; color: #475569; margin-top: 4px;">"Does he/she like...?" ➔ "Yes, he/she does." / "No, he/she doesn't."</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="jumbo-btn btn-gold" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.awardPointsToActive(2)">+2 ⭐ Points</button>
            <button class="jumbo-btn btn-ocean" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.nextMG4Question()">
              ${currentIdx + 1 < total ? 'NEXT QUESTION ➔' : 'FINISH MISSION 4 ➔'}
            </button>
          </div>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Remember: check if it's he or she!");
      }
      btn.classList.add("wrong-choice");
      setTimeout(() => btn.classList.remove("wrong-choice"), 600);

      feedbackArea.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Watch out for He/She and Does/Doesn't! Try again!</div>
        </div>
      `;
    }
  }

  nextMG4Question() {
    const total = GAME_DATA.miniGame4.length;
    if (window.gameEngine.mgIndex.mg4 + 1 < total) {
      window.gameEngine.mgIndex.mg4++;
      window.gameEngine.nextTeam();
      this.renderMiniGame4();
    } else {
      this.showScreen("mg5");
    }
  }

  // =========================================================================
  // MINI-GAME 5: HAVE GOT (FAMILY & PETS)
  // =========================================================================

  renderMiniGame5() {
    const currentIdx = window.gameEngine.mgIndex.mg5;
    const item = GAME_DATA.miniGame5[currentIdx];
    const total = GAME_DATA.miniGame5.length;
    const container = document.getElementById("mg5-content");
    if (!container) return;

    container.innerHTML = `
      <div class="card-header-banner">
        <span class="card-tag">MISSION 5: FAMILY & PETS (Level ${currentIdx + 1}/${total})</span>
        <h2 class="main-heading">👨‍👩‍👧‍👦 Have Got Challenge</h2>
        <p class="sub-heading">Look at the family info and answer with "Has he/she got...?"</p>
      </div>

      <div class="question-spotlight-box">
        <div class="spotlight-avatar">${item.characterEmoji}</div>
        <div class="spotlight-content">
          <div style="font-size: 1.1rem; font-weight: 800; color: #475569;">${item.familyDesc} (${item.familyImg})</div>
          <div class="spotlight-question-text" style="font-size: 1.8rem;">"${item.question}"</div>
        </div>
        <button class="speak-icon-btn" onclick="soundEngine.speak('${item.speechQuestion}')">🔊</button>
      </div>

      <div class="choices-grid">
        ${item.options.map((opt, i) => `
          <button class="choice-card-btn" id="mg5-opt-${i}" onclick="uiController.handleMG5Answer(${i})">
            <span class="choice-text" style="font-size: 1.3rem;">${opt.text}</span>
          </button>
        `).join("")}
      </div>

      <div id="mg5-feedback-area" style="width: 100%; max-width: 850px;"></div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(item.speechQuestion);
    }, 400);
  }

  handleMG5Answer(choiceIdx) {
    const currentIdx = window.gameEngine.mgIndex.mg5;
    const item = GAME_DATA.miniGame5[currentIdx];
    const selected = item.options[choiceIdx];
    const total = GAME_DATA.miniGame5.length;
    const feedbackArea = document.getElementById("mg5-feedback-area");
    const btn = document.getElementById(`mg5-opt-${choiceIdx}`);

    if (selected.isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playCorrect();
        window.soundEngine.speak(selected.speech);
      }
      btn.classList.add("correct-choice");

      feedbackArea.innerHTML = `
        <div class="feedback-box">
          <div>
            <div class="feedback-text">⭐ OUTSTANDING!</div>
            <div class="say-it-banner" style="margin-top: 8px;">
              <span>🗣️ FULL SENTENCE:</span>
              <strong style="color: #78350f;">"${item.sentenceDisplay}"</strong>
              <button class="speak-icon-btn" onclick="soundEngine.speak('${item.sentenceDisplay}')" style="width: 36px; height: 36px;">🔊</button>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="jumbo-btn btn-gold" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.awardPointsToActive(2)">+2 ⭐ Points</button>
            <button class="jumbo-btn btn-crimson" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.nextMG5Question()">
              ${currentIdx + 1 < total ? 'NEXT QUESTION ➔' : 'GO TO BOSS LOCK 🔐 ➔'}
            </button>
          </div>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Try again!");
      }
      btn.classList.add("wrong-choice");
      setTimeout(() => btn.classList.remove("wrong-choice"), 600);

      feedbackArea.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🤔 Check who they have got! Try again!</div>
        </div>
      `;
    }
  }

  nextMG5Question() {
    const total = GAME_DATA.miniGame5.length;
    if (window.gameEngine.mgIndex.mg5 + 1 < total) {
      window.gameEngine.mgIndex.mg5++;
      window.gameEngine.nextTeam();
      this.renderMiniGame5();
    } else {
      this.showScreen("boss");
    }
  }

  // =========================================================================
  // BOSS LOCK: THE TREASURE COMBINATION LOCK
  // =========================================================================

  renderBossLock() {
    const currentIdx = window.gameEngine.mgIndex.boss;
    const item = GAME_DATA.bossLockQuestions[currentIdx];
    const total = GAME_DATA.bossLockQuestions.length;
    const isComplete = window.gameEngine.isBossLockComplete();
    const container = document.getElementById("boss-lock-content");
    if (!container) return;

    // Render 5 padlock cylinders
    const dialsHtml = GAME_DATA.bossLockQuestions.map((q, idx) => {
      const isUnlocked = window.gameEngine.bossUnlockedKeys[idx];
      return `
        <div class="lock-dial-box ${isUnlocked ? 'unlocked' : ''}">
          <span class="lock-slot-label">KEY ${idx + 1}</span>
          <span class="lock-digit">${isUnlocked ? q.codeDigit : '🔒'}</span>
        </div>
      `;
    }).join("");

    if (isComplete) {
      container.innerHTML = `
        <div class="card-header-banner">
          <span class="card-tag">🔐 TRAINING BOSS DEFEATED!</span>
          <h2 class="main-heading" style="color: #059669;">🎉 TRAINING COMPLETE!</h2>
          <p class="sub-heading">"YOU ARE NOW OFFICIAL DETECTIVES!"</p>
        </div>

        <div class="vault-combination-display">${dialsHtml}</div>

        <div style="text-align: center; margin: 24px 0;">
          <div style="font-size: 5rem; animation: bounce-success 1s infinite alternate;">🕵️‍♂️ 🗝️ 💰</div>
          <h3 style="font-family: 'Bungee', cursive; font-size: 1.8rem; color: #1e293b; margin: 12px 0;">THE INVESTIGATION IS NOW UNLOCKED!</h3>
          <p style="font-size: 1.25rem; font-weight: 800; color: #64748b; margin-bottom: 24px;">All 4 detective teams are certified. Time to question the 6 suspects and solve the mystery!</p>
          <button class="jumbo-btn btn-gold" style="font-size: 1.6rem; padding: 20px 48px;" onclick="uiController.startInvestigation()">
            🔍 START REAL INVESTIGATION ➔
          </button>
        </div>
      `;
      this.triggerConfetti(3000);
      if (window.soundEngine) window.soundEngine.playFanfare();
      return;
    }

    container.innerHTML = `
      <div class="card-header-banner">
        <span class="card-tag">🔐 FINAL TRAINING CHALLENGE (${currentIdx + 1}/${total})</span>
        <h2 class="main-heading">Unlock the Master Treasure Vault!</h2>
        <p class="sub-heading">Answer correctly to unlock each secret combination key!</p>
      </div>

      <div class="vault-combination-display">${dialsHtml}</div>

      <div class="question-spotlight-box" style="justify-content: center; text-align: center; flex-direction: column;">
        <div style="font-size: 3rem;">${item.emoji}</div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="spotlight-question-text" style="font-size: 1.8rem;">"${item.question}"</div>
          <button class="speak-icon-btn" onclick="soundEngine.speak('${item.speechQuestion}')">🔊</button>
        </div>
      </div>

      <div class="choices-grid two-columns" style="max-width: 600px;">
        ${item.options.map((opt, i) => `
          <button class="choice-card-btn" id="boss-opt-${i}" onclick="uiController.handleBossAnswer(${i})">
            <span class="choice-text" style="font-size: 1.4rem;">${opt.text}</span>
          </button>
        `).join("")}
      </div>

      <div id="boss-feedback-area" style="width: 100%; max-width: 850px;"></div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(item.speechQuestion);
    }, 400);
  }

  handleBossAnswer(choiceIdx) {
    const currentIdx = window.gameEngine.mgIndex.boss;
    const item = GAME_DATA.bossLockQuestions[currentIdx];
    const selected = item.options[choiceIdx];
    const total = GAME_DATA.bossLockQuestions.length;
    const feedbackArea = document.getElementById("boss-feedback-area");
    const btn = document.getElementById(`boss-opt-${choiceIdx}`);

    if (selected.isCorrect) {
      window.gameEngine.unlockBossKey(currentIdx);
      btn.classList.add("correct-choice");

      feedbackArea.innerHTML = `
        <div class="feedback-box">
          <div class="feedback-text">🔑 KEY UNLOCKED! (+2 ⭐ Team Points)</div>
          <div style="display: flex; gap: 8px;">
            <button class="jumbo-btn btn-gold" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.awardPointsToActive(2)">+2 ⭐ Points</button>
            <button class="jumbo-btn btn-ocean" style="padding: 10px 20px; font-size: 1rem;" onclick="uiController.nextBossQuestion()">
              ${currentIdx + 1 < total ? 'NEXT KEY ➔' : 'UNLOCK VAULT 🔓 ➔'}
            </button>
          </div>
        </div>
      `;
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Try again!");
      }
      btn.classList.add("wrong-choice");
      setTimeout(() => btn.classList.remove("wrong-choice"), 600);

      feedbackArea.innerHTML = `
        <div class="feedback-box error-mode">
          <div class="feedback-text" style="color: #b91c1c;">🔒 Key jammed! Try again!</div>
        </div>
      `;
    }
  }

  nextBossQuestion() {
    const total = GAME_DATA.bossLockQuestions.length;
    if (window.gameEngine.mgIndex.boss + 1 < total) {
      window.gameEngine.mgIndex.boss++;
      window.gameEngine.nextTeam();
      this.renderBossLock();
    } else {
      this.renderBossLock();
    }
  }

  startInvestigation() {
    this.showScreen("investigation");
  }

  // =========================================================================
  // PART 2: REAL INVESTIGATION & SUSPECTS EVIDENCE BOARD
  // =========================================================================

  renderInvestigation() {
    const container = document.getElementById("investigation-content");
    if (!container) return;

    const suspects = GAME_DATA.suspects;
    const revealedClues = window.gameEngine.getRevealedClues();
    const totalClues = window.gameEngine.clues.length;
    const remainingCount = window.gameEngine.getRemainingSuspectsCount();

    // Latest Clue Banner
    let clueBannerHtml = "";
    if (revealedClues.length > 0) {
      const latest = revealedClues[revealedClues.length - 1];
      clueBannerHtml = `
        <div class="clues-ribbon-bar">
          <div class="clue-ticker">
            <span class="clue-badge">CLUE #${latest.num}</span>
            <span style="font-size: 1.8rem;">${latest.icon}</span>
            <span class="clue-active-text">"${latest.text}"</span>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${latest.spoken}')" style="background: #475569; color: #fff;">🔊</button>
          </div>
          <div style="display: flex; gap: 8px;">
            ${revealedClues.length < totalClues ? `
              <button class="jumbo-btn btn-gold" style="padding: 10px 18px; font-size: 0.95rem;" onclick="uiController.handleRevealNextClue()">
                🧩 REVEAL NEXT CLUE (${revealedClues.length}/${totalClues})
              </button>
            ` : `
              <span style="color: #34d399; font-weight: 900; display: flex; align-items: center; gap: 4px;">✅ ALL CLUES REVEALED</span>
            `}
          </div>
        </div>
      `;
    } else {
      clueBannerHtml = `
        <div class="clues-ribbon-bar" style="background: #1e293b;">
          <div class="clue-ticker">
            <span class="clue-badge" style="background: #94a3b8; color: #1e293b;">CLUES LOCKED</span>
            <span style="font-size: 1.2rem; font-weight: 800; color: #cbd5e1;">Click below to reveal the first detective clue!</span>
          </div>
          <button class="jumbo-btn btn-gold" style="padding: 10px 18px; font-size: 0.95rem;" onclick="uiController.handleRevealNextClue()">
            🧩 REVEAL CLUE 1 ➔
          </button>
        </div>
      `;
    }

    // 6 Suspects Grid
    const suspectsHtml = suspects.map(s => {
      const isElim = window.gameEngine.isEliminated(s.id);
      const evidenceList = window.gameEngine.getSuspectEvidence(s.id);

      return `
        <div class="suspect-card ${isElim ? 'eliminated' : ''}" id="suspect-card-${s.id}">
          <div class="eliminated-stamp">❌ INNOCENT</div>

          <div class="suspect-card-header">
            <div class="suspect-avatar-large">${s.avatar}</div>
            <div>
              <div class="suspect-name-title">${s.name}</div>
              <div class="suspect-age-tag">🎂 ${s.age} years old • 💇 ${s.hairColor} hair</div>
            </div>
          </div>

          <div class="suspect-traits-list">
            <div class="trait-item">❤️ ${s.likesEmoji} ${s.likes}</div>
            <div class="trait-item">🏊 ${s.canEmoji} ${s.can}</div>
            <div class="trait-item">👨‍👩‍👦 ${s.hasEmoji} ${s.has}</div>
            <div class="trait-item">🎨 ${s.favColorEmoji} ${s.favColor}</div>
          </div>

          ${evidenceList.length > 0 ? `
            <div style="background: #f1f5f9; border-radius: var(--radius-sm); padding: 6px 10px; font-size: 0.85rem; font-weight: 800; color: #475569;">
              📝 Evidence Logged: ${evidenceList.length} facts
            </div>
          ` : ''}

          <div class="suspect-card-actions">
            <button class="card-action-btn btn-investigate" onclick="uiController.openDossier('${s.id}')">
              🔍 QUESTION
            </button>
            ${isElim ? `
              <button class="card-action-btn btn-restore" onclick="uiController.handleToggleElimination('${s.id}')">
                ↩️ RESTORE
              </button>
            ` : `
              <button class="card-action-btn btn-eliminate" onclick="uiController.handleToggleElimination('${s.id}')">
                ❌ ELIMINATE
              </button>
            `}
          </div>
        </div>
      `;
    }).join("");

    // Evidence Board Notes
    const allEvidenceNotes = [];
    revealedClues.forEach(c => {
      allEvidenceNotes.push({
        title: `CLUE #${c.num}`,
        icon: c.icon,
        text: c.text
      });
    });

    suspects.forEach(s => {
      const logs = window.gameEngine.getSuspectEvidence(s.id);
      logs.forEach(log => {
        allEvidenceNotes.push({
          title: `NOTE: ${s.name}`,
          icon: s.avatar,
          text: `"${log.question}" ➔ ${log.answer}`
        });
      });
    });

    const evidenceNotesHtml = allEvidenceNotes.length > 0 ? allEvidenceNotes.map(n => `
      <div class="evidence-sticky-note">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px; border-bottom: 1px dashed rgba(0,0,0,0.2); padding-bottom: 2px;">
          <span>${n.icon}</span>
          <span style="font-family: 'Bungee', cursive; font-size: 0.8rem;">${n.title}</span>
        </div>
        <div>${n.text}</div>
      </div>
    `).join("") : `<div style="color: #78350f; font-weight: 800; font-size: 1.1rem;">No clues or interrogations recorded yet! Reveal a clue or question a suspect.</div>`;

    container.innerHTML = `
      <div class="investigation-dashboard">
        <div class="card-header-banner" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="text-align: left;">
            <span class="card-tag">PART 2: DETECTIVE HEADQUARTERS</span>
            <h2 class="main-heading">🕵️ Live Suspects Board</h2>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <div style="background: #fff; padding: 8px 16px; border-radius: var(--radius-md); font-weight: 900; font-size: 1.1rem; border: 3px solid #cbd5e1;">
              Suspects Remaining: <span style="color: ${remainingCount <= 2 ? '#dc2626' : '#2563eb'};">${remainingCount} / 6</span>
            </div>
            <button class="jumbo-btn btn-crimson" style="font-size: 1rem; padding: 12px 24px;" onclick="uiController.showScreen('accusation')">
              🚨 MAKE ACCUSATION ➔
            </button>
          </div>
        </div>

        ${clueBannerHtml}

        <div class="suspects-grid">
          ${suspectsHtml}
        </div>

        <div class="evidence-board-panel">
          <div class="evidence-board-title">
            <span>📌 DETECTIVE PINBOARD & EVIDENCE</span>
          </div>
          <div class="evidence-notes-grid">
            ${evidenceNotesHtml}
          </div>
        </div>
      </div>
    `;
  }

  handleRevealNextClue() {
    const clue = window.gameEngine.revealNextClue();
    if (clue) {
      if (window.soundEngine) {
        window.soundEngine.speak(clue.spoken);
      }
      this.renderInvestigation();
    }
  }

  handleToggleElimination(suspectId) {
    window.gameEngine.toggleElimination(suspectId);
    this.renderInvestigation();
  }

  // =========================================================================
  // INVESTIGATION DOSSIER MODAL
  // =========================================================================

  openDossier(suspectId) {
    const suspect = GAME_DATA.suspects.find(s => s.id === suspectId);
    if (!suspect) return;

    const modal = document.getElementById("dossier-modal");
    const container = document.getElementById("dossier-modal-body");

    container.innerHTML = `
      <div class="dossier-profile-header">
        <div class="suspect-avatar-large" style="width: 88px; height: 88px; font-size: 4rem;">${suspect.avatar}</div>
        <div>
          <h2 style="font-family: 'Bungee', cursive; font-size: 2rem; color: #1e293b;">${suspect.name}</h2>
          <p style="font-size: 1.15rem; font-weight: 800; color: #64748b;">${suspect.bio}</p>
          <div style="margin-top: 6px; font-weight: 800; color: #d97706;">🕒 Alibi: "${suspect.alibi}"</div>
        </div>
      </div>

      <h3 style="font-family: 'Bungee', cursive; font-size: 1.25rem; color: #1e293b; margin-bottom: 8px;">
        🗣️ Choose a Question for the Active Team to Ask:
      </h3>

      <div class="questions-selector-list">
        ${GAME_DATA.interrogationQuestions.map(q => `
          <button class="interrogate-q-btn" onclick="uiController.handleAskQuestion('${suspect.id}', '${q.id}')">
            <span>❓ "${q.text}"</span>
            <span style="color: #2563eb; font-size: 0.95rem;">Ask ➔</span>
          </button>
        `).join("")}
      </div>

      <div id="dossier-answer-area"></div>
    `;

    modal.classList.add("active");
  }

  handleAskQuestion(suspectId, questionId) {
    const result = window.gameEngine.askQuestion(suspectId, questionId);
    if (!result) return;

    const answerArea = document.getElementById("dossier-answer-area");
    if (!answerArea) return;

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak(result.spoken);
    }

    answerArea.innerHTML = `
      <div class="answer-speech-bubble">
        <div style="font-size: 3rem;">${result.suspect.avatar}</div>
        <div style="flex: 1;">
          <div style="font-weight: 800; font-size: 1rem; color: #047857; text-transform: uppercase;">
            ${result.suspect.name} answers:
          </div>
          <div class="answer-text-large">"${result.answer}"</div>
        </div>
        <button class="speak-icon-btn" onclick="soundEngine.speak('${result.spoken}')">🔊</button>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
        <button class="jumbo-btn btn-gold" style="font-size: 1rem; padding: 10px 20px;" onclick="uiController.awardPointsToActive(2)">
          +2 ⭐ Points (Great Question!)
        </button>
        <button class="jumbo-btn btn-emerald" style="font-size: 1rem; padding: 10px 20px;" onclick="uiController.closeDossier()">
          📌 PIN TO EVIDENCE BOARD ➔
        </button>
      </div>
    `;
  }

  closeDossier() {
    const modal = document.getElementById("dossier-modal");
    if (modal) modal.classList.remove("active");
    this.renderInvestigation();
  }

  // =========================================================================
  // FINAL ACCUSATION & REVEAL CEREMONY
  // =========================================================================

  renderAccusation() {
    const container = document.getElementById("accusation-content");
    if (!container) return;

    const suspects = GAME_DATA.suspects;

    container.innerHTML = `
      <div class="card-header-banner">
        <span class="card-tag" style="background: #fee2e2; border-color: #ef4444; color: #b91c1c;">🚨 FINAL ACCUSATION ARENA</span>
        <h2 class="main-heading">Who Stole the Treasure?</h2>
        <p class="sub-heading">Each team discusses their reasoning and selects their prime suspect!</p>
      </div>

      <div class="sentence-reason-frame">
        🗣️ SPEAKING CHALLENGE: "We think <span style="text-decoration: underline;">[Suspect Name]</span> stole the treasure because..."
      </div>

      <div class="team-accusation-row">
        ${GAME_DATA.teams.map(t => `
          <div class="team-vote-box vote-${t.id}">
            <div style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: ${t.color}; margin-bottom: 6px;">
              ${t.emoji} ${t.name}
            </div>
            <label style="font-size: 0.9rem; font-weight: 800; color: #64748b;">Accuses:</label>
            <select class="vote-suspect-select" id="vote-select-${t.id}" onchange="gameEngine.setTeamAccusation('${t.id}', this.value)">
              <option value="">-- Pick Suspect --</option>
              ${suspects.map(s => `
                <option value="${s.id}" ${window.gameEngine.teamAccusations[t.id] === s.id ? 'selected' : ''}>
                  ${s.avatar} ${s.name} (${s.hairColor} hair)
                </option>
              `).join("")}
            </select>
          </div>
        `).join("")}
      </div>

      <div style="display: flex; gap: 16px; margin-top: 16px;">
        <button class="jumbo-btn btn-ocean" style="font-size: 1.1rem; padding: 14px 28px;" onclick="uiController.showScreen('investigation')">
          🔍 BACK TO EVIDENCE BOARD
        </button>
        <button class="jumbo-btn btn-crimson" style="font-size: 1.3rem; padding: 16px 36px;" onclick="uiController.handleRevealThiefCutscene()">
          🚨 REVEAL THE THIEF ➔
        </button>
      </div>

      <div id="reveal-cutscene-area" style="width: 100%; display: flex; justify-content: center; margin-top: 24px;"></div>
    `;
  }

  handleRevealThiefCutscene() {
    const cutsceneArea = document.getElementById("reveal-cutscene-area");
    if (!cutsceneArea) return;

    if (window.soundEngine) {
      window.soundEngine.playDrumroll(2.5);
    }

    cutsceneArea.innerHTML = `
      <div class="reveal-spotlight-box">
        <h2 style="font-family: 'Bungee', cursive; font-size: 2rem; color: var(--primary-gold); margin-bottom: 12px;">
          🥁 SEARCHING FOR THE THIEF...
        </h2>
        <div style="font-size: 4rem; animation: float-chest 0.5s infinite alternate;">🔎 ✨ 🔦</div>
      </div>
    `;

    setTimeout(() => {
      const thief = window.gameEngine.secretThief;
      if (window.soundEngine) {
        window.soundEngine.playFanfare();
        window.soundEngine.speak(`The mystery is solved! The thief who stole the treasure is ${thief.name}!`);
      }
      this.triggerConfetti(6000);

      // Check which teams got it right
      const correctTeams = [];
      GAME_DATA.teams.forEach(t => {
        if (window.gameEngine.teamAccusations[t.id] === thief.id) {
          correctTeams.push(t);
          window.gameEngine.addPoints(t.id, 5); // +5 bonus for correct accusation
        }
      });
      this.updateScoreboard();

      cutsceneArea.innerHTML = `
        <div class="reveal-spotlight-box">
          <span class="card-tag" style="background: #fef08a; color: #854d0e;">🎉 MYSTERY SOLVED!</span>
          <div class="thief-revealed-avatar">${thief.avatar}</div>
          <h2 style="font-family: 'Bungee', cursive; font-size: 2.4rem; color: #38bdf8;">
            IT WAS ${thief.name.toUpperCase()}!
          </h2>
          <p style="font-size: 1.35rem; font-weight: 800; color: #cbd5e1; margin: 12px 0;">
            ${thief.hairDesc} • ${thief.ageDesc} • ${thief.likesDesc} • ${thief.canDesc} • ${thief.hasDesc}
          </p>

          <div style="background: rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: 16px; margin: 16px 0;">
            <div style="font-size: 3.5rem;">💰 💎 👑 🏆</div>
            <h3 style="font-family: 'Bungee', cursive; font-size: 1.6rem; color: var(--primary-gold);">
              THE TREASURE IS RETURNED SAFELY!
            </h3>
            ${correctTeams.length > 0 ? `
              <p style="font-size: 1.2rem; font-weight: 800; color: #34d399; margin-top: 6px;">
                ⭐ Correct Accusation (+5 pts): ${correctTeams.map(t => `${t.emoji} ${t.name}`).join(", ")}
              </p>
            ` : `
              <p style="font-size: 1.1rem; font-weight: 800; color: #fca5a5; margin-top: 6px;">
                No team guessed correctly, but great teamwork solving the clues!
              </p>
            `}
          </div>

          <button class="jumbo-btn btn-gold" style="font-size: 1.4rem; padding: 16px 36px;" onclick="uiController.showScreen('victory')">
            🏆 GO TO FINAL AWARDS CEREMONY ➔
          </button>
        </div>
      `;
    }, 2600);
  }

  // =========================================================================
  // FINAL SCORE & DETECTIVE AWARDS CEREMONY
  // =========================================================================

  renderVictory() {
    const container = document.getElementById("victory-content");
    if (!container) return;

    const scores = window.gameEngine.scores;

    // Rank teams by score
    const rankedTeams = [...GAME_DATA.teams].sort((a, b) => scores[b.id] - scores[a.id]);

    container.innerHTML = `
      <div class="card-header-banner">
        <span class="card-tag">🏆 DETECTIVE ACADEMY GRADUATION</span>
        <h2 class="main-heading">Grand Scoreboard & Awards</h2>
        <p class="sub-heading">Congratulations to all 4 detective teams for solving the mystery in English!</p>
      </div>

      <div class="victory-podium-container">
        <div class="podium-column place-2">
          <div style="font-size: 2rem;">🥈</div>
          <div style="font-size: 1.2rem;">${rankedTeams[1].emoji}</div>
          <div style="font-size: 1.1rem; font-family: 'Bungee', cursive;">${rankedTeams[1].name}</div>
          <div style="font-size: 1.5rem; color: var(--primary-gold);">${scores[rankedTeams[1].id]} ⭐</div>
          <div style="margin-top: auto; font-size: 1.5rem; font-family: 'Bungee', cursive;">2nd</div>
        </div>

        <div class="podium-column place-1">
          <div style="font-size: 3.5rem;">👑 🏆</div>
          <div style="font-size: 1.4rem;">${rankedTeams[0].emoji}</div>
          <div style="font-size: 1.3rem; font-family: 'Bungee', cursive;">${rankedTeams[0].name}</div>
          <div style="font-size: 1.8rem; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">${scores[rankedTeams[0].id]} ⭐</div>
          <div style="margin-top: auto; font-size: 2rem; font-family: 'Bungee', cursive;">1st CHAMPION</div>
        </div>

        <div class="podium-column place-3">
          <div style="font-size: 1.8rem;">🥉</div>
          <div style="font-size: 1.1rem;">${rankedTeams[2].emoji}</div>
          <div style="font-size: 1rem; font-family: 'Bungee', cursive;">${rankedTeams[2].name}</div>
          <div style="font-size: 1.4rem; color: var(--primary-gold);">${scores[rankedTeams[2].id]} ⭐</div>
          <div style="margin-top: auto; font-size: 1.3rem; font-family: 'Bungee', cursive;">3rd</div>
        </div>

        <div class="podium-column place-4">
          <div style="font-size: 1.6rem;">🎖️</div>
          <div style="font-size: 1.1rem;">${rankedTeams[3].emoji}</div>
          <div style="font-size: 0.95rem; font-family: 'Bungee', cursive;">${rankedTeams[3].name}</div>
          <div style="font-size: 1.3rem; color: var(--primary-gold);">${scores[rankedTeams[3].id]} ⭐</div>
          <div style="margin-top: auto; font-size: 1.2rem; font-family: 'Bungee', cursive;">4th</div>
        </div>
      </div>

      <h3 style="font-family: 'Bungee', cursive; font-size: 1.6rem; color: #1e293b; margin: 20px 0 12px; text-align: center;">
        🎖️ SPECIAL DETECTIVE AWARDS
      </h3>

      <div class="awards-cards-grid">
        <div class="award-badge-card">
          <div class="award-icon">🔎</div>
          <div class="award-title">BEST QUESTION MASTER</div>
          <p style="font-weight: 800; color: #64748b; font-size: 0.95rem; margin-top: 4px;">
            For asking the cleverest English questions during the interrogation!
          </p>
        </div>

        <div class="award-badge-card">
          <div class="award-icon">🧠</div>
          <div class="award-title">MASTER MIND DETECTIVE</div>
          <p style="font-weight: 800; color: #64748b; font-size: 0.95rem; margin-top: 4px;">
            For sharp elimination and connecting all clues flawlessly!
          </p>
        </div>

        <div class="award-badge-card">
          <div class="award-icon">💬</div>
          <div class="award-title">SUPERSTAR ENGLISH SPEAKER</div>
          <p style="font-weight: 800; color: #64748b; font-size: 0.95rem; margin-top: 4px;">
            For speaking full sentences clearly and enthusiastically!
          </p>
        </div>
      </div>

      <div style="display: flex; gap: 14px; justify-content: center; margin-top: 24px;">
        <button class="jumbo-btn btn-gold" style="font-size: 1.2rem; padding: 14px 28px;" onclick="uiController.handlePlayAgain(true)">
          🔄 PLAY AGAIN (Keep Scores)
        </button>
        <button class="jumbo-btn btn-ocean" style="font-size: 1.2rem; padding: 14px 28px;" onclick="uiController.handlePlayAgain(false)">
          ✨ NEW GAME (Reset All)
        </button>
      </div>
    `;

    this.triggerConfetti(5000);
    if (window.soundEngine) window.soundEngine.playFanfare();
  }

  handlePlayAgain(keepScores = true) {
    window.gameEngine.resetFullGame(keepScores);
    this.updateScoreboard();
    this.showScreen("intro");
  }

  // =========================================================================
  // TEACHER CONTROL PANEL MODAL
  // =========================================================================

  openTeacherHub() {
    const modal = document.getElementById("teacher-modal");
    const container = document.getElementById("teacher-modal-body");
    const thief = window.gameEngine.secretThief;

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #475569; padding-bottom: 12px; margin-bottom: 16px;">
        <h2 style="font-family: 'Bungee', cursive; color: #a78bfa; font-size: 1.6rem;">🧑‍🏫 Teacher Control Center</h2>
        <button class="icon-btn" onclick="uiController.closeTeacherHub()">✕</button>
      </div>

      <div class="teacher-grid-section">
        <!-- Quick Jump Navigation -->
        <div class="teacher-card-mini">
          <h4>🚀 Jump to Section</h4>
          <div class="teacher-actions-row">
            <button class="teacher-small-btn" onclick="uiController.showScreen('intro'); uiController.closeTeacherHub();">🏴‍☠️ Intro</button>
            <button class="teacher-small-btn" onclick="uiController.showScreen('mg1'); uiController.closeTeacherHub();">Mission 1 (Q&A)</button>
            <button class="teacher-small-btn" onclick="uiController.showScreen('mg2'); uiController.closeTeacherHub();">Mission 2 (Who Am I)</button>
            <button class="teacher-small-btn" onclick="uiController.showScreen('mg3'); uiController.closeTeacherHub();">Mission 3 (Can/Can't)</button>
            <button class="teacher-small-btn" onclick="uiController.showScreen('mg4'); uiController.closeTeacherHub();">Mission 4 (Likes)</button>
            <button class="teacher-small-btn" onclick="uiController.showScreen('mg5'); uiController.closeTeacherHub();">Mission 5 (Have Got)</button>
            <button class="teacher-small-btn" onclick="uiController.showScreen('boss'); uiController.closeTeacherHub();">🔐 Boss Lock</button>
            <button class="teacher-small-btn" onclick="uiController.showScreen('investigation'); uiController.closeTeacherHub();">🕵️ Suspects Board</button>
            <button class="teacher-small-btn" onclick="uiController.showScreen('accusation'); uiController.closeTeacherHub();">🚨 Accusation</button>
            <button class="teacher-small-btn" onclick="uiController.showScreen('victory'); uiController.closeTeacherHub();">🏆 Grand Victory</button>
          </div>
        </div>

        <!-- Team Score Adjuster -->
        <div class="teacher-card-mini">
          <h4>⭐ Manage Scores</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${GAME_DATA.teams.map(t => `
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-weight: 800; color: ${t.color};">${t.emoji} ${t.name}:</span>
                <div style="display: flex; gap: 4px; align-items: center;">
                  <button class="teacher-small-btn" onclick="gameEngine.addPoints('${t.id}', -1); uiController.updateScoreboard(); uiController.openTeacherHub();">-1</button>
                  <strong style="min-width: 24px; text-align: center;">${window.gameEngine.scores[t.id]}</strong>
                  <button class="teacher-small-btn" onclick="gameEngine.addPoints('${t.id}', 1); uiController.updateScoreboard(); uiController.openTeacherHub();">+1</button>
                  <button class="teacher-small-btn" onclick="gameEngine.addPoints('${t.id}', 2); uiController.updateScoreboard(); uiController.openTeacherHub();">+2</button>
                  <button class="teacher-small-btn" onclick="gameEngine.addPoints('${t.id}', 5); uiController.updateScoreboard(); uiController.openTeacherHub();">+5</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Active Turn Override -->
        <div class="teacher-card-mini">
          <h4>🎯 Active Turn Selection</h4>
          <div class="teacher-actions-row">
            ${GAME_DATA.teams.map(t => `
              <button class="teacher-small-btn ${window.gameEngine.getActiveTeam().id === t.id ? 'btn-active' : ''}" 
                onclick="gameEngine.setActiveTeam('${t.id}'); uiController.updateScoreboard(); uiController.openTeacherHub();">
                ${t.emoji} ${t.name}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Clue & Investigation Controls -->
        <div class="teacher-card-mini">
          <h4>🧩 Mystery Controls</h4>
          <div class="teacher-actions-row">
            <button class="teacher-small-btn" onclick="uiController.handleRevealNextClue(); uiController.openTeacherHub();">Reveal Next Clue</button>
            <button class="teacher-small-btn" onclick="gameEngine.resetClues(); uiController.renderInvestigation(); uiController.openTeacherHub();">Reset Clues</button>
            <button class="teacher-small-btn" onclick="gameEngine.eliminatedSuspects.clear(); uiController.renderInvestigation(); uiController.openTeacherHub();">Restore All Suspects</button>
          </div>
        </div>
      </div>

      <!-- Secret Thief Protected Peek Box -->
      <div class="secret-peek-box">
        <div>
          <div style="font-weight: 900; color: #f59e0b; font-size: 0.9rem;">🔒 SECRET THIEF (TEACHER CONFIDENTIAL)</div>
          <div id="teacher-peek-display" style="font-weight: 800; color: #94a3b8; font-size: 0.95rem; margin-top: 2px;">
            [Hidden to prevent accidental reveals]
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="teacher-small-btn" onclick="uiController.toggleSecretPeek()">👁️ Peek</button>
          <button class="teacher-small-btn" onclick="gameEngine.setupMystery(); uiController.toggleSecretPeek(true);">🎲 Re-roll Secret Thief</button>
        </div>
      </div>
    `;

    modal.classList.add("active");
  }

  toggleSecretPeek(forceShow = false) {
    const display = document.getElementById("teacher-peek-display");
    if (!display) return;

    const thief = window.gameEngine.secretThief;
    if (display.textContent.includes(thief.name) && !forceShow) {
      display.textContent = "[Hidden to prevent accidental reveals]";
      display.style.color = "#94a3b8";
    } else {
      display.textContent = `Thief: ${thief.avatar} ${thief.name} (${thief.hairColor} hair, ${thief.age}yo, likes ${thief.likes}, can ${thief.can}, has ${thief.has})`;
      display.style.color = "#34d399";
    }
  }

  closeTeacherHub() {
    const modal = document.getElementById("teacher-modal");
    if (modal) modal.classList.remove("active");
  }

  // =========================================================================
  // GLOBAL EVENTS & FULLSCREEN & CONFETTI
  // =========================================================================

  bindGlobalEvents() {
    // Next Team button in top header
    const nextBtn = document.getElementById("next-turn-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        window.gameEngine.nextTeam();
        this.updateScoreboard();
        if (window.soundEngine) window.soundEngine.playClick();
      });
    }

    // Fullscreen toggle button
    const fsBtn = document.getElementById("fullscreen-btn");
    if (fsBtn) {
      fsBtn.addEventListener("click", () => this.toggleFullscreen());
    }

    // Audio SFX toggle button
    const sfxBtn = document.getElementById("sfx-toggle-btn");
    if (sfxBtn) {
      sfxBtn.addEventListener("click", () => {
        const enabled = window.soundEngine.toggleSound();
        sfxBtn.classList.toggle("active-btn", enabled);
        sfxBtn.textContent = enabled ? "🔊" : "🔇";
      });
    }

    // Speech TTS toggle button
    const ttsBtn = document.getElementById("tts-toggle-btn");
    if (ttsBtn) {
      ttsBtn.addEventListener("click", () => {
        const enabled = window.soundEngine.toggleSpeech();
        ttsBtn.classList.toggle("active-btn", enabled);
        ttsBtn.textContent = enabled ? "🗣️" : "🤐";
      });
    }

    // Home / Menu Button
    const homeBtn = document.getElementById("home-menu-btn");
    if (homeBtn) {
      homeBtn.addEventListener("click", () => this.openTeacherHub());
    }

    // Teacher Hub Button
    const hubBtn = document.getElementById("teacher-hub-btn");
    if (hubBtn) {
      hubBtn.addEventListener("click", () => this.openTeacherHub());
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Confetti Particle System
  initConfetti() {
    this.confettiCanvas = document.getElementById("confetti-canvas");
    if (!this.confettiCanvas) return;
    this.confettiCtx = this.confettiCanvas.getContext("2d");

    const resize = () => {
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();
  }

  triggerConfetti(durationMs = 4000) {
    if (!this.confettiCanvas || !this.confettiCtx) return;

    this.confettiParticles = [];
    const colors = ["#ffb703", "#e63946", "#38bdf8", "#10b981", "#a78bfa", "#fbbf24"];

    for (let i = 0; i < 150; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.confettiCanvas.width,
        y: Math.random() * this.confettiCanvas.height - this.confettiCanvas.height,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 5 + 3,
        speedX: Math.random() * 4 - 2,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 6 - 3
      });
    }

    this.confettiRunning = true;
    const startTime = Date.now();

    const animate = () => {
      if (!this.confettiRunning) return;

      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

      this.confettiParticles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        this.confettiCtx.save();
        this.confettiCtx.translate(p.x, p.y);
        this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
        this.confettiCtx.fillStyle = p.color;
        this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.confettiCtx.restore();

        if (p.y > this.confettiCanvas.height) {
          p.y = -20;
          p.x = Math.random() * this.confettiCanvas.width;
        }
      });

      if (Date.now() - startTime < durationMs) {
        requestAnimationFrame(animate);
      } else {
        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
        this.confettiRunning = false;
      }
    };

    animate();
  }
}

// Global UI Instance
window.uiController = new UIController();
document.addEventListener("DOMContentLoaded", () => {
  window.uiController.init();
});
