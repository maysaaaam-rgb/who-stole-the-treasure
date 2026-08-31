/**
 * UI Controller for "Who Stole the Treasure?" - HARD MODE DETECTIVE INVESTIGATION
 * Coordinates 8 suspects, token cost system, Interview Room with speaking challenge,
 * Detective Meetings, and Final Accusation logic puzzle.
 */

class UIController {
  constructor() {
    this.currentView = "intro";
    this.selectedNotebookTeam = "red";
    this.activeInterviewSuspect = null;
    this.selectedInterviewQuestion = null;
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
    floater.textContent = amount > 0 ? `+${amount} ⭐` : `${amount} ⭐`;
    floater.style.position = "absolute";
    floater.style.top = "-20px";
    floater.style.left = "50%";
    floater.style.transform = "translateX(-50%)";
    floater.style.color = amount > 0 ? "var(--primary-gold)" : "#ef4444";
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
  // MINI-GAMES (TRAINING MISSIONS 1 - 5) & BOSS LOCK
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
          <div class="feedback-text" style="color: #b91c1c;">🤔 Look carefully at the question. Try again!</div>
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

  // Mini-Game 2
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

  // Mini-Game 3
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

  // Mini-Game 4
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

  // Mini-Game 5
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

  // Boss Lock
  renderBossLock() {
    const currentIdx = window.gameEngine.mgIndex.boss;
    const item = GAME_DATA.bossLockQuestions[currentIdx];
    const total = GAME_DATA.bossLockQuestions.length;
    const isComplete = window.gameEngine.isBossLockComplete();
    const container = document.getElementById("boss-lock-content");
    if (!container) return;

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
          <h3 style="font-family: 'Bungee', cursive; font-size: 1.8rem; color: #1e293b; margin: 12px 0;">THE 8-SUSPECT INVESTIGATION IS NOW UNLOCKED!</h3>
          <p style="font-size: 1.25rem; font-weight: 800; color: #64748b; margin-bottom: 24px;">All 4 detective teams are certified. Time to question the suspects, share evidence, and solve the mystery!</p>
          <button class="jumbo-btn btn-gold" style="font-size: 1.6rem; padding: 20px 48px;" onclick="uiController.startInvestigation()">
            🔍 START HARD MODE INVESTIGATION ➔
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
  // PART 2: HARD MODE INVESTIGATION (8 PURE SUSPECTS & DETECTIVE MEETING)
  // =========================================================================

  renderInvestigation() {
    const container = document.getElementById("investigation-content");
    if (!container) return;

    const suspects = GAME_DATA.suspects;
    const revealedClues = window.gameEngine.getRevealedClues();
    const totalClues = window.gameEngine.clues.length;
    const activeTeam = window.gameEngine.getActiveTeam();
    const tokens = window.gameEngine.getTeamTokens(activeTeam.id);
    const remainingCount = window.gameEngine.getTeamRemainingSuspectsCount(activeTeam.id);

    // Strategy Bar
    const strategyStatusBarHtml = `
      <div class="strategy-status-bar">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-family: 'Bungee', cursive; color: var(--primary-gold); font-size: 1.15rem;">
            STAGE: INDIRECT CLUES (${revealedClues.length} / ${totalClues})
          </span>
          <span style="color: #94a3b8; font-weight: 800;">•</span>
          <span style="color: #cbd5e1; font-weight: 800;">
            ${activeTeam.emoji} <strong>${activeTeam.name}'s Turn</strong>
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <div class="team-tokens-pill" style="border-color: ${activeTeam.border}; color: ${activeTeam.color}; background: #fff;">
            <span>${activeTeam.name}:</span>
            <span style="font-size: 1.2rem;">
              ${tokens > 0 ? '🔎 '.repeat(tokens) + `(${tokens})` : '❌ 0 TOKENS'}
            </span>
          </div>
          <button class="icon-btn" onclick="gameEngine.addTeamTokens('${activeTeam.id}', 1); uiController.renderInvestigation();" title="Add +1 Token">+1 🔎</button>
          <button class="jumbo-btn btn-purple" style="font-size: 0.95rem; padding: 10px 18px;" onclick="uiController.openDetectiveMeetingModal()">
            🗣️ DETECTIVE MEETING
          </button>
        </div>
      </div>
    `;

    // Clue Banner
    let clueBannerHtml = "";
    if (revealedClues.length > 0) {
      const latest = revealedClues[revealedClues.length - 1];
      clueBannerHtml = `
        <div class="clues-ribbon-bar">
          <div class="clue-ticker">
            <span class="clue-badge">${latest.title}</span>
            <span style="font-size: 1.8rem;">${latest.icon}</span>
            <span class="clue-active-text">"${latest.text}"</span>
            <button class="speak-icon-btn" onclick="soundEngine.speak('${latest.spoken}')" style="background: #475569; color: #fff;">🔊</button>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            ${revealedClues.length < totalClues ? `
              <button class="jumbo-btn btn-gold" style="padding: 10px 18px; font-size: 0.95rem;" onclick="uiController.handleRevealNextClue()">
                📜 REVEAL NEXT CLUE (${revealedClues.length + 1}/${totalClues})
              </button>
            ` : `
              <span style="color: #34d399; font-weight: 900; display: flex; align-items: center; gap: 4px;">✅ ALL 5 CLUES REVEALED</span>
            `}
          </div>
        </div>
      `;
    } else {
      clueBannerHtml = `
        <div class="clues-ribbon-bar" style="background: #1e293b;">
          <div class="clue-ticker">
            <span class="clue-badge" style="background: #94a3b8; color: #1e293b;">CLUES LOCKED</span>
            <span style="font-size: 1.2rem; font-weight: 800; color: #cbd5e1;">Click below to reveal Indirect Clue #1!</span>
          </div>
          <button class="jumbo-btn btn-gold" style="padding: 10px 18px; font-size: 0.95rem;" onclick="uiController.handleRevealNextClue()">
            📜 REVEAL CLUE 1 ➔
          </button>
        </div>
      `;
    }

    // 8 PURE SUSPECT CARDS (PICTURE + NAME ONLY)
    const suspectsHtml = suspects.map(s => {
      const isElim = window.gameEngine.isTeamEliminated(activeTeam.id, s.id);
      const discoveredCount = window.gameEngine.getDiscoveredCountForTeam(activeTeam.id, s.id);

      return `
        <div class="suspect-card-pure ${isElim ? 'eliminated' : ''}" id="suspect-card-${s.id}">
          <div class="eliminated-stamp">❌ ELIMINATED</div>

          <div class="pure-avatar-box">${s.avatar}</div>
          <div class="pure-suspect-name">${s.name}</div>

          <div class="notebook-discovery-chip">
            📓 ${discoveredCount > 0 ? `${discoveredCount} facts discovered` : 'No info yet'}
          </div>

          <div class="suspect-pure-actions">
            <button class="card-action-btn btn-interview" onclick="uiController.openInterviewRoom('${s.id}')">
              🕵️ INTERVIEW
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

    // Detective Notebook Panel (8 Suspects Grid)
    const notebookTeam = this.selectedNotebookTeam || activeTeam.id;
    const notebookData = window.gameEngine.teamData[notebookTeam].notebook;
    const notebookTeamObj = GAME_DATA.teams.find(t => t.id === notebookTeam) || GAME_DATA.teams[0];

    const notebookCardsHtml = suspects.map(s => {
      const entry = notebookData[s.id];
      const isElim = window.gameEngine.isTeamEliminated(notebookTeam, s.id);

      return `
        <div class="notebook-suspect-card" style="opacity: ${isElim ? '0.5' : '1'}; border-left: 5px solid ${notebookTeamObj.color};">
          <div class="notebook-suspect-header">
            <span style="font-size: 2rem;">${s.avatar}</span>
            <div>
              <strong style="font-family: 'Bungee', cursive; font-size: 1.1rem; color: #1e293b;">${s.name}</strong>
              <div style="font-size: 0.75rem; color: #64748b;">${isElim ? '❌ Marked Innocent' : '🔍 Suspect'}</div>
            </div>
          </div>

          <div class="notebook-fields-list">
            <div class="notebook-field-row">
              <span>Age:</span>
              <span class="${entry.age ? 'field-value-known' : 'field-value-unknown'}">${entry.age || '❓'}</span>
            </div>
            <div class="notebook-field-row">
              <span>Alibi:</span>
              <span class="${entry.alibi ? 'field-value-known' : 'field-value-unknown'}">${entry.alibi || '❓'}</span>
            </div>
            <div class="notebook-field-row">
              <span>Can Swim:</span>
              <span class="${entry.canSwim ? 'field-value-known' : 'field-value-unknown'}">${entry.canSwim || '❓'}</span>
            </div>
            <div class="notebook-field-row">
              <span>Can Run:</span>
              <span class="${entry.canRun ? 'field-value-known' : 'field-value-unknown'}">${entry.canRun || '❓'}</span>
            </div>
            <div class="notebook-field-row">
              <span>Likes Cats:</span>
              <span class="${entry.likesCats ? 'field-value-known' : 'field-value-unknown'}">${entry.likesCats || '❓'}</span>
            </div>
            <div class="notebook-field-row">
              <span>Likes Dogs:</span>
              <span class="${entry.likesDogs ? 'field-value-known' : 'field-value-unknown'}">${entry.likesDogs || '❓'}</span>
            </div>
            <div class="notebook-field-row">
              <span>Has Sister:</span>
              <span class="${entry.hasSister ? 'field-value-known' : 'field-value-unknown'}">${entry.hasSister || '❓'}</span>
            </div>
            <div class="notebook-field-row">
              <span>Has Brother:</span>
              <span class="${entry.hasBrother ? 'field-value-known' : 'field-value-unknown'}">${entry.hasBrother || '❓'}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="investigation-dashboard">
        <div class="card-header-banner" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="text-align: left;">
            <span class="card-tag">PART 2: HARD MODE INVESTIGATION</span>
            <h2 class="main-heading">🕵️ Live Suspects Board (8 Suspects)</h2>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <div style="background: #fff; padding: 8px 16px; border-radius: var(--radius-md); font-weight: 900; font-size: 1.1rem; border: 3px solid #cbd5e1;">
              ${activeTeam.emoji} Active Suspects: <span style="color: ${remainingCount <= 2 ? '#dc2626' : '#2563eb'};">${remainingCount} / 8</span>
            </div>
            <button class="jumbo-btn btn-crimson" style="font-size: 1rem; padding: 12px 24px;" onclick="uiController.showScreen('accusation')">
              🚨 MAKE ACCUSATION ➔
            </button>
          </div>
        </div>

        ${strategyStatusBarHtml}
        ${clueBannerHtml}

        <!-- 8 Pure Suspect Cards -->
        <div class="suspects-grid-8">
          ${suspectsHtml}
        </div>

        <!-- Detective Notebook Panel -->
        <div class="notebook-panel-wrapper">
          <div class="notebook-header-row">
            <div>
              <h3 style="font-family: 'Bungee', cursive; font-size: 1.4rem; color: #78350f;">
                📓 DETECTIVE NOTEBOOKS (8 SUSPECTS LOG)
              </h3>
              <p style="font-size: 0.95rem; font-weight: 800; color: #64748b;">
                Select a team tab to review their discovered evidence:
              </p>
            </div>

            <div class="notebook-tabs-container">
              ${GAME_DATA.teams.map(t => `
                <button class="notebook-tab-btn ${notebookTeam === t.id ? `active-tab-${t.id}` : ''}" 
                  onclick="uiController.selectNotebookTeam('${t.id}')">
                  ${t.emoji} ${t.name}
                </button>
              `).join("")}
            </div>
          </div>

          <div class="notebook-grid-8">
            ${notebookCardsHtml}
          </div>
        </div>
      </div>
    `;
  }

  selectNotebookTeam(teamId) {
    this.selectedNotebookTeam = teamId;
    this.renderInvestigation();
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
    const activeTeam = window.gameEngine.getActiveTeam();
    window.gameEngine.toggleTeamElimination(activeTeam.id, suspectId);
    this.renderInvestigation();
  }

  // =========================================================================
  // INTERVIEW ROOM (TOKEN COSTS & MANDATORY SPEAKING CHALLENGE)
  // =========================================================================

  openInterviewRoom(suspectId) {
    const suspect = GAME_DATA.suspects.find(s => s.id === suspectId);
    if (!suspect) return;

    this.activeInterviewSuspect = suspect;
    this.selectedInterviewQuestion = null;

    const modal = document.getElementById("dossier-modal");
    const container = document.getElementById("dossier-modal-body");
    const activeTeam = window.gameEngine.getActiveTeam();
    const tokens = window.gameEngine.getTeamTokens(activeTeam.id);

    container.innerHTML = `
      <div class="interview-room-container">
        <div class="interview-suspect-spotlight">
          <div class="pure-avatar-box" style="width: 90px; height: 90px; font-size: 4rem;">${suspect.avatar}</div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <h2 style="font-family: 'Bungee', cursive; font-size: 2rem; color: #1e293b;">${suspect.name}</h2>
              <span class="card-tag" style="background: ${activeTeam.bg}; color: ${activeTeam.color}; border-color: ${activeTeam.border};">
                ${activeTeam.emoji} ${activeTeam.name} is Interviewing
              </span>
            </div>
            <p style="font-size: 1.05rem; font-weight: 800; color: #64748b;">${suspect.bio}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-family: 'Bungee', cursive; font-size: 1.25rem; color: #1e293b;">
            ❓ Choose a Question to Ask ${suspect.name}:
          </h3>
          <div style="font-family: 'Bungee', cursive; font-size: 1.1rem; color: ${tokens > 0 ? '#0284c7' : '#dc2626'};">
            ${activeTeam.name} Tokens: ${tokens > 0 ? '🔎 '.repeat(tokens) + `(${tokens})` : '❌ 0 LEFT'}
          </div>
        </div>

        ${tokens === 0 ? `
          <div style="background: #fee2e2; border: 2px solid #ef4444; border-radius: var(--radius-md); padding: 12px; color: #991b1b; font-weight: 800;">
            ⚠️ ${activeTeam.name} has no Question Tokens left! Discuss evidence with other teams or request +1 token from the teacher.
            <button class="teacher-small-btn" style="margin-left: 8px;" onclick="gameEngine.addTeamTokens('${activeTeam.id}', 1); uiController.openInterviewRoom('${suspect.id}');">Grant +1 Token (Teacher)</button>
          </div>
        ` : ''}

        <div class="questions-selector-list" id="interview-questions-list">
          ${GAME_DATA.interrogationQuestions.map(q => {
            const hasEnough = tokens >= q.cost;
            return `
              <button class="interrogate-q-btn" ${!hasEnough ? 'disabled style="opacity: 0.5;"' : ''} onclick="uiController.selectQuestionToSpeak('${q.id}')">
                <span>❓ "${q.text}"</span>
                <span class="question-cost-badge">${q.costLabel}</span>
              </button>
            `;
          }).join("")}
        </div>

        <div id="interview-speaking-area"></div>
      </div>
    `;

    modal.classList.add("active");
  }

  selectQuestionToSpeak(questionId) {
    const qObj = GAME_DATA.interrogationQuestions.find(q => q.id === questionId);
    const suspect = this.activeInterviewSuspect;
    const activeTeam = window.gameEngine.getActiveTeam();
    if (!qObj || !suspect) return;

    this.selectedInterviewQuestion = qObj;

    const list = document.getElementById("interview-questions-list");
    if (list) list.style.display = "none";

    const speakingArea = document.getElementById("interview-speaking-area");
    if (!speakingArea) return;

    speakingArea.innerHTML = `
      <div class="speaking-mandatory-box">
        <span class="card-tag" style="background: #f59e0b; color: #fff; border-color: #d97706;">
          🗣️ MANDATORY SPEAKING CHALLENGE
        </span>
        <h3 style="font-family: 'Bungee', cursive; font-size: 1.4rem; color: #78350f; margin-top: 8px;">
          ${activeTeam.name}, say this question ALOUD to ${suspect.name}!
        </h3>

        <div class="speaking-target-phrase">
          <span>"${qObj.text}"</span>
          <button class="speak-icon-btn" onclick="soundEngine.speak('${qObj.speechText}')" title="Hear English pronunciation">🔊</button>
        </div>

        <p style="font-size: 1.05rem; font-weight: 800; color: #92400e; margin-bottom: 16px;">
          Cost: <strong>${qObj.cost} Tokens</strong> • Once spoken, click below to hear ${suspect.name}'s answer!
        </p>

        <div style="display: flex; justify-content: center; gap: 12px;">
          <button class="jumbo-btn btn-ocean" style="font-size: 1rem; padding: 12px 24px;" onclick="uiController.openInterviewRoom('${suspect.id}')">
            ↩️ CHOOSE DIFFERENT QUESTION
          </button>
          <button class="jumbo-btn btn-emerald" style="font-size: 1.2rem; padding: 14px 32px;" onclick="uiController.executeAskQuestion()">
            📢 WE SAID IT! ASK ${suspect.name.toUpperCase()} ➔
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.speak(`Say it aloud: ${qObj.speechText}`);
    }, 300);
  }

  executeAskQuestion() {
    const activeTeam = window.gameEngine.getActiveTeam();
    const suspect = this.activeInterviewSuspect;
    const qObj = this.selectedInterviewQuestion;

    if (!window.gameEngine.useTeamTokens(activeTeam.id, qObj.cost)) {
      if (window.soundEngine) window.soundEngine.playWrong();
      return;
    }

    const result = window.gameEngine.askQuestionForTeam(activeTeam.id, suspect.id, qObj.id);
    if (!result) return;

    const speakingArea = document.getElementById("interview-speaking-area");
    if (!speakingArea) return;

    if (window.soundEngine) {
      window.soundEngine.playCorrect();
      window.soundEngine.speak(result.spoken);
    }

    speakingArea.innerHTML = `
      <div class="answer-speech-bubble">
        <div style="font-size: 3.5rem;">${suspect.avatar}</div>
        <div style="flex: 1;">
          <div style="font-weight: 800; font-size: 1rem; color: #047857; text-transform: uppercase;">
            ${suspect.name} answers ${activeTeam.name}:
          </div>
          <div class="answer-text-large">"${result.answer}"</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #065f46; margin-top: 6px;">
            📝 Logged in ${activeTeam.name}'s Notebook: <strong>${qObj.fieldLabel} = ${result.notebookValue}</strong>
          </div>
        </div>
        <button class="speak-icon-btn" onclick="soundEngine.speak('${result.spoken}')">🔊</button>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
        <button class="jumbo-btn btn-gold" style="font-size: 1rem; padding: 10px 20px;" onclick="uiController.awardPointsToActive(2)">
          +2 ⭐ Points (Great Speaking!)
        </button>
        <button class="jumbo-btn btn-emerald" style="font-size: 1.1rem; padding: 12px 28px;" onclick="uiController.closeInterview(true)">
          📓 ADD TO NOTEBOOK & PASS TURN ➔
        </button>
      </div>
    `;
  }

  closeInterview(advanceTurn = false) {
    const modal = document.getElementById("dossier-modal");
    if (modal) modal.classList.remove("active");
    if (advanceTurn) {
      window.gameEngine.nextTeam();
      this.updateScoreboard();
    }
    this.renderInvestigation();
  }

  // =========================================================================
  // 🗣️ DETECTIVE MEETING (INFORMATION SHARING ROUND)
  // =========================================================================

  openDetectiveMeetingModal() {
    const modal = document.getElementById("dossier-modal");
    const container = document.getElementById("dossier-modal-body");
    const sharedLogs = window.gameEngine.sharedCaseFile;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="text-align: center;">
          <span class="card-tag" style="background: #c4b5fd; color: #5b21b6; border-color: #8b5cf6;">
            🗣️ INFORMATION SHARING ROUND
          </span>
          <h2 style="font-family: 'Bungee', cursive; font-size: 2rem; color: #1e293b; margin-top: 6px;">
            DETECTIVE ACADEMY MEETING
          </h2>
          <p style="font-size: 1.1rem; font-weight: 800; color: #64748b;">
            Teams share discovered evidence verbally in English!
          </p>
        </div>

        <div class="sentence-reason-frame" style="font-size: 1.2rem;">
          🗣️ SPEAKING FRAME: "[Team Name] discovered that [Suspect] [Age / Likes / Can / Alibi]..."
        </div>

        <h3 style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: #1e293b;">
          📋 Verified Central Case File (Shared with All Teams):
        </h3>

        <div class="case-file-panel">
          ${sharedLogs.length > 0 ? sharedLogs.map(item => `
            <div class="case-file-item">
              <span>${item.teamEmoji}</span>
              <strong style="color: #1e293b;">${item.suspectAvatar} ${item.suspectName}:</strong>
              <span>${item.label} = <strong style="color: #047857;">${item.value}</strong></span>
              <span style="margin-left: auto; font-size: 0.8rem; color: #94a3b8;">(${item.teamName})</span>
            </div>
          `).join("") : `<div style="color: #64748b; font-weight: 800; text-align: center; padding: 12px;">No evidence shared yet! Have a team speak their evidence to record it here.</div>`}
        </div>

        <!-- Quick Teacher Share Buttons -->
        <div style="background: #f8fafc; border: 2px solid #cbd5e1; border-radius: var(--radius-md); padding: 14px;">
          <h4 style="font-family: 'Bungee', cursive; font-size: 0.95rem; color: #475569; margin-bottom: 8px;">
            Teacher Control: Share A Team's Discovered Fact
          </h4>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${GAME_DATA.teams.map(t => {
              const assigned = GAME_DATA.teamAssignments[t.id] || [];
              return assigned.map(sId => {
                const s = GAME_DATA.suspects.find(x => x.id === sId);
                return `
                  <button class="teacher-small-btn" onclick="gameEngine.shareFactToCaseFile('${t.id}', '${s.id}', 'alibi'); uiController.openDetectiveMeetingModal();">
                    Share ${t.emoji} ${s.name}'s Alibi
                  </button>
                  <button class="teacher-small-btn" onclick="gameEngine.shareFactToCaseFile('${t.id}', '${s.id}', 'age'); uiController.openDetectiveMeetingModal();">
                    Share ${t.emoji} ${s.name}'s Age
                  </button>
                `;
              }).join("");
            }).join("")}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
          <button class="jumbo-btn btn-ocean" style="font-size: 1.1rem; padding: 12px 28px;" onclick="uiController.closeInterview(false)">
            🔍 RETURN TO INVESTIGATION
          </button>
        </div>
      </div>
    `;

    modal.classList.add("active");
  }

  // =========================================================================
  // FINAL ACCUSATION & 2-PROOF REASONING
  // =========================================================================

  renderAccusation() {
    const container = document.getElementById("accusation-content");
    if (!container) return;

    const suspects = GAME_DATA.suspects;

    container.innerHTML = `
      <div class="card-header-banner">
        <span class="card-tag" style="background: #fee2e2; border-color: #ef4444; color: #b91c1c;">🚨 FINAL ACCUSATION ARENA</span>
        <h2 class="main-heading">Who Stole the Treasure?</h2>
        <p class="sub-heading">Teams must provide 2 PIECES OF EVIDENCE to support their accusation!</p>
      </div>

      <div class="sentence-reason-frame">
        🗣️ SPEAKING CHALLENGE: "We think <span style="text-decoration: underline;">[Suspect]</span> is the thief because [Proof 1] AND [Proof 2]!"
      </div>

      <div class="team-accusation-row">
        ${GAME_DATA.teams.map(t => `
          <div class="team-vote-box vote-${t.id}">
            <div style="font-family: 'Bungee', cursive; font-size: 1.2rem; color: ${t.color}; margin-bottom: 6px;">
              ${t.emoji} ${t.name}
            </div>
            <label style="font-size: 0.9rem; font-weight: 800; color: #64748b;">Prime Suspect:</label>
            <select class="vote-suspect-select" id="vote-select-${t.id}" onchange="gameEngine.setTeamAccusation('${t.id}', this.value)">
              <option value="">-- Pick Suspect --</option>
              ${suspects.map(s => `
                <option value="${s.id}" ${window.gameEngine.teamAccusations[t.id] === s.id ? 'selected' : ''}>
                  ${s.avatar} ${s.name}
                </option>
              `).join("")}
            </select>
          </div>
        `).join("")}
      </div>

      <div style="display: flex; gap: 16px; margin-top: 16px;">
        <button class="jumbo-btn btn-ocean" style="font-size: 1.1rem; padding: 14px 28px;" onclick="uiController.showScreen('investigation')">
          🔍 BACK TO INVESTIGATION
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
          🥁 VERIFYING EVIDENCE & ALIBIS...
        </h2>
        <div style="font-size: 4rem; animation: float-chest 0.5s infinite alternate;">🔎 ✨ 🔦</div>
      </div>
    `;

    setTimeout(() => {
      const thief = window.gameEngine.secretThief;
      const correctTeams = [];
      const wrongTeams = [];

      GAME_DATA.teams.forEach(t => {
        if (window.gameEngine.teamAccusations[t.id] === thief.id) {
          correctTeams.push(t);
          window.gameEngine.addPoints(t.id, 5); // +5 bonus for correct accusation
        } else if (window.gameEngine.teamAccusations[t.id]) {
          wrongTeams.push(t);
          window.gameEngine.addPoints(t.id, -2); // -2 penalty for wrong accusation
        }
      });
      this.updateScoreboard();

      if (window.soundEngine) {
        window.soundEngine.playFanfare();
        window.soundEngine.speak(`The mystery is solved! The thief who stole the treasure is ${thief.name}!`);
      }

      cutsceneArea.innerHTML = `
        <div class="reveal-spotlight-box">
          <span class="card-tag" style="background: #fef08a; color: #854d0e;">🎉 MYSTERY SOLVED!</span>
          <div class="thief-revealed-avatar">${thief.avatar}</div>
          <h2 style="font-family: 'Bungee', cursive; font-size: 2.4rem; color: #38bdf8;">
            IT WAS ${thief.name.toUpperCase()}!
          </h2>
          <p style="font-size: 1.35rem; font-weight: 800; color: #cbd5e1; margin: 12px 0;">
            ${thief.hairDesc} • ${thief.ageDesc} • ${thief.likesDesc} • ${thief.canDesc} • ${thief.hasDesc} • Location: ${thief.alibiLocation}
          </p>

          <div style="background: rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: 16px; margin: 16px 0;">
            <div style="font-size: 3rem;">🔐 💰</div>
            <h3 style="font-family: 'Bungee', cursive; font-size: 1.5rem; color: var(--primary-gold);">
              "WAIT! THE TREASURE IS STILL LOCKED!"
            </h3>
            <p style="font-size: 1.15rem; font-weight: 800; color: #cbd5e1; margin: 6px 0;">
              Complete the final English bonus challenge to open the golden chest!
            </p>
          </div>

          <button class="jumbo-btn btn-gold" style="font-size: 1.4rem; padding: 16px 36px;" onclick="uiController.renderFinalBonusChallenge()">
            🔐 SOLVE FINAL BONUS CHALLENGE ➔
          </button>
        </div>
      `;
    }, 2600);
  }

  // Final Bonus Challenge to Unlock the Treasure
  renderFinalBonusChallenge() {
    const cutsceneArea = document.getElementById("reveal-cutscene-area");
    if (!cutsceneArea) return;

    cutsceneArea.innerHTML = `
      <div class="reveal-spotlight-box">
        <span class="card-tag" style="background: #a7f3d0; color: #065f46;">🔐 TREASURE FINAL LOCK</span>
        <h2 style="font-family: 'Bungee', cursive; font-size: 1.8rem; color: var(--primary-gold); margin: 12px 0;">
          Arrange the words to make the question:
        </h2>

        <div style="display: flex; justify-content: center; gap: 12px; margin: 20px 0; font-size: 1.8rem; font-family: 'Bungee', cursive;">
          <span style="background: #1e293b; padding: 10px 18px; border-radius: var(--radius-md); border: 2px solid #38bdf8;">swim</span>
          <span style="background: #1e293b; padding: 10px 18px; border-radius: var(--radius-md); border: 2px solid #38bdf8;">Can</span>
          <span style="background: #1e293b; padding: 10px 18px; border-radius: var(--radius-md); border: 2px solid #38bdf8;">she</span>
          <span style="background: #1e293b; padding: 10px 18px; border-radius: var(--radius-md); border: 2px solid #38bdf8;">?</span>
        </div>

        <div class="choices-grid two-columns" style="max-width: 600px; margin: 0 auto;">
          <button class="choice-card-btn" onclick="uiController.completeBonusChallenge(true)">
            <span class="choice-text" style="font-size: 1.4rem;">"Can she swim?" ✅</span>
          </button>
          <button class="choice-card-btn" onclick="uiController.completeBonusChallenge(false)">
            <span class="choice-text" style="font-size: 1.4rem;">"She can swim?" ❌</span>
          </button>
        </div>
      </div>
    `;
  }

  completeBonusChallenge(isCorrect) {
    if (isCorrect) {
      if (window.soundEngine) {
        window.soundEngine.playFanfare();
        window.soundEngine.speak("The chest is open! You solved the mystery!");
      }
      this.triggerConfetti(6000);
      this.showScreen("victory");
    } else {
      if (window.soundEngine) {
        window.soundEngine.playWrong();
        window.soundEngine.speak("Try again! Remember: question starts with Can!");
      }
    }
  }

  // =========================================================================
  // FINAL SCORE & DETECTIVE AWARDS CEREMONY
  // =========================================================================

  renderVictory() {
    const container = document.getElementById("victory-content");
    if (!container) return;

    const scores = window.gameEngine.scores;
    const rankedTeams = [...GAME_DATA.teams].sort((a, b) => scores[b.id] - scores[a.id]);

    container.innerHTML = `
      <div class="card-header-banner">
        <span class="card-tag">🏆 DETECTIVE ACADEMY GRADUATION</span>
        <h2 class="main-heading">Grand Scoreboard & Awards</h2>
        <p class="sub-heading">Congratulations to all 4 detective teams for solving the hard mystery in English!</p>
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
            For strategically spending tokens on high-value English questions!
          </p>
        </div>

        <div class="award-badge-card">
          <div class="award-icon">🧠</div>
          <div class="award-title">MASTER MIND DETECTIVE</div>
          <p style="font-weight: 800; color: #64748b; font-size: 0.95rem; margin-top: 4px;">
            For connecting indirect clues and solving the deduction matrix!
          </p>
        </div>

        <div class="award-badge-card">
          <div class="award-icon">💬</div>
          <div class="award-title">SUPERSTAR ENGLISH SPEAKER</div>
          <p style="font-weight: 800; color: #64748b; font-size: 0.95rem; margin-top: 4px;">
            For speaking questions aloud clearly and sharing evidence in the meeting!
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
    const activeTeam = window.gameEngine.getActiveTeam();

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
            <button class="teacher-small-btn" onclick="uiController.showScreen('investigation'); uiController.closeTeacherHub();">🕵️ Investigation</button>
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

        <!-- Active Turn & Token Controls -->
        <div class="teacher-card-mini">
          <h4>🎯 Active Turn & Tokens</h4>
          <div class="teacher-actions-row">
            ${GAME_DATA.teams.map(t => `
              <button class="teacher-small-btn ${window.gameEngine.getActiveTeam().id === t.id ? 'btn-active' : ''}" 
                onclick="gameEngine.setActiveTeam('${t.id}'); uiController.updateScoreboard(); uiController.openTeacherHub();">
                ${t.emoji} ${t.name} (${window.gameEngine.getTeamTokens(t.id)} 🔎)
              </button>
            `).join("")}
          </div>
          <div style="margin-top: 10px; display: flex; gap: 6px;">
            <button class="teacher-small-btn" onclick="gameEngine.addTeamTokens('${activeTeam.id}', 1); uiController.openTeacherHub();">+1 Token to ${activeTeam.name}</button>
            <button class="teacher-small-btn" onclick="gameEngine.addTeamTokens('${activeTeam.id}', -1); uiController.openTeacherHub();">-1 Token</button>
          </div>
        </div>

        <!-- Clue & Investigation Controls -->
        <div class="teacher-card-mini">
          <h4>🧩 Mystery Controls</h4>
          <div class="teacher-actions-row">
            <button class="teacher-small-btn" onclick="uiController.handleRevealNextClue(); uiController.openTeacherHub();">Reveal Next Clue</button>
            <button class="teacher-small-btn" onclick="gameEngine.resetClues(); uiController.renderInvestigation(); uiController.openTeacherHub();">Reset Clues</button>
            <button class="teacher-small-btn" onclick="gameEngine.teamData['${activeTeam.id}'].eliminated.clear(); uiController.renderInvestigation(); uiController.openTeacherHub();">Restore All Suspects (${activeTeam.name})</button>
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
      display.textContent = `Thief: ${thief.avatar} ${thief.name} (${thief.hairColor} hair, ${thief.age}yo, likes ${thief.likes}, can ${thief.can}, has ${thief.has}, alibi: ${thief.alibiLocation})`;
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
    const nextBtn = document.getElementById("next-turn-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        window.gameEngine.nextTeam();
        this.updateScoreboard();
        if (this.currentView === "investigation") {
          this.renderInvestigation();
        }
        if (window.soundEngine) window.soundEngine.playClick();
      });
    }

    const fsBtn = document.getElementById("fullscreen-btn");
    if (fsBtn) {
      fsBtn.addEventListener("click", () => this.toggleFullscreen());
    }

    const sfxBtn = document.getElementById("sfx-toggle-btn");
    if (sfxBtn) {
      sfxBtn.addEventListener("click", () => {
        const enabled = window.soundEngine.toggleSound();
        sfxBtn.classList.toggle("active-btn", enabled);
        sfxBtn.textContent = enabled ? "🔊" : "🔇";
      });
    }

    const ttsBtn = document.getElementById("tts-toggle-btn");
    if (ttsBtn) {
      ttsBtn.addEventListener("click", () => {
        const enabled = window.soundEngine.toggleSpeech();
        ttsBtn.classList.toggle("active-btn", enabled);
        ttsBtn.textContent = enabled ? "🗣️" : "🤐";
      });
    }

    const homeBtn = document.getElementById("home-menu-btn");
    if (homeBtn) {
      homeBtn.addEventListener("click", () => this.openTeacherHub());
    }

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
