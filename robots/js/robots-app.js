/**
 * "AMAZING ROBOTS AROUND THE WORLD" — Main Application Controller
 * Manages 16:9 Smartboard Auto-Scaling, 9-Page Pedagogical Flow,
 * WH Detective matching, Prediction storage, Comprehension scoring,
 * Fact/Guess voting, and Presentation/Reveal interactions.
 */

class RobotsApp {
  constructor() {
    this.state = {
      currentPage: 1,
      activeRobotId: 'fish',

      // Group predictions (robotId -> { what, where, when, who, why, how })
      predictions: {
        fish: {},
        jellyfish: {},
        bee: {},
        snake: {},
        dog: {}
      },
      predictionsSaved: {
        fish: false,
        jellyfish: false,
        bee: false,
        snake: false,
        dog: false
      },

      // Page 3: WH Detective
      whMatchedSet: new Set(),
      selectedWhWord: null,

      // Page 5: Comprehension
      comprehensionAnswers: {
        fish: {},
        jellyfish: {},
        bee: {},
        snake: {},
        dog: {}
      },
      answersChecked: {
        fish: false,
        jellyfish: false,
        bee: false,
        snake: false,
        dog: false
      },
      showReadingPeek: false,

      // Page 6: Fact or Guess votes (robotId -> { idx: boolean })
      factGuessVotes: {
        fish: {},
        jellyfish: {},
        bee: {},
        snake: {},
        dog: {}
      },

      // Page 7: Team presentation choices
      teamUseChoice: {
        fish: null,
        jellyfish: null,
        bee: null,
        snake: null,
        dog: null
      },

      // Page 8: Real World Reveal reflection
      revealOpinions: {
        fish: null,
        jellyfish: null,
        bee: null,
        snake: null,
        dog: null
      },

      // Page 9: Final Class Polls
      mostUsefulRobot: 'dog',
      mostSurprisingRobot: 'fish'
    };

    this.pageNames = {
      1: "1. 🚀 Welcome & Missions",
      2: "2. 🤔 Mystery Robot Guessing",
      3: "3. 🔎 WH Question Detective",
      4: "4. 📖 Robot Reading Dossier",
      5: "5. 🔎 Find the Answers",
      6: "6. ⚡ Fact or Guess?",
      7: "7. 🎤 Presentation Prep",
      8: "8. 🌍 Real World Reveal",
      9: "9. 💭 Final Reflection & Award"
    };

    this.init();
  }

  init() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.resizeStage());
      window.addEventListener('orientationchange', () => this.resizeStage());
    }

    setTimeout(() => {
      this.resizeStage();
      this.renderPage(1);
    }, 50);
  }

  // ================= 16:9 AUTO-SCALING =================
  resizeStage() {
    const stage = document.getElementById('robots-stage');
    if (!stage) return;

    const baseWidth = 1200;
    const baseHeight = 675;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const scaleX = windowWidth / baseWidth;
    const scaleY = windowHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    stage.style.transform = `scale(${scale})`;
  }

  // ================= PAGE STATE GETTER =================
  getPageState() {
    return {
      activeRobotId: this.state.activeRobotId,
      predictions: this.state.predictions,
      predictionsSaved: this.state.predictionsSaved[this.state.activeRobotId],
      whMatchedSet: this.state.whMatchedSet,
      selectedWhWord: this.state.selectedWhWord,
      comprehensionAnswers: this.state.comprehensionAnswers,
      answersChecked: this.state.answersChecked[this.state.activeRobotId],
      showReadingPeek: this.state.showReadingPeek,
      factGuessVotes: this.state.factGuessVotes,
      teamUseChoice: this.state.teamUseChoice[this.state.activeRobotId],
      revealOpinions: this.state.revealOpinions,
      mostUsefulRobot: this.state.mostUsefulRobot,
      mostSurprisingRobot: this.state.mostSurprisingRobot
    };
  }

  // ================= PAGE NAVIGATION =================
  renderPage(pageNum) {
    if (pageNum < 1 || pageNum > 9) return;
    this.state.currentPage = pageNum;

    // Update HUD stage title
    const hudTitle = document.getElementById('hud-page-name');
    if (hudTitle) {
      hudTitle.textContent = this.pageNames[pageNum] || `Page ${pageNum}`;
    }

    // Update HUD Robot Selector Badge
    const hudBadge = document.getElementById('hud-robot-badge');
    if (hudBadge) {
      const robot = (window.ROBOTS_DATA && window.ROBOTS_DATA.robots.find(r => r.id === this.state.activeRobotId)) || { icon: '🤖', shortTitle: 'Robot' };
      if (pageNum === 2) {
        hudBadge.textContent = `🕵️ Group ${robot.groupNum || 1} Mystery Robot`;
      } else {
        hudBadge.textContent = `${robot.icon} ${robot.shortTitle}`;
      }
    }

    // Update Viewport
    const viewport = document.getElementById('robots-viewport');
    if (viewport && window.RobotsScenes) {
      const renderFn = window.RobotsScenes[`renderPage${pageNum}`];
      if (typeof renderFn === 'function') {
        viewport.innerHTML = renderFn.call(window.RobotsScenes, this.getPageState());
      }
    }

    if (window.robotsSound) {
      window.robotsSound.playClick();
    }
  }

  prevPage() {
    if (this.state.currentPage > 1) {
      this.renderPage(this.state.currentPage - 1);
    }
  }

  nextPage() {
    if (this.state.currentPage < 9) {
      this.renderPage(this.state.currentPage + 1);
    }
  }

  startMission() {
    this.renderPage(2);
  }

  setActiveRobot(robotId) {
    if (!window.ROBOTS_DATA || !window.ROBOTS_DATA.robots.some(r => r.id === robotId)) return;
    this.state.activeRobotId = robotId;
    const robot = window.ROBOTS_DATA.robots.find(r => r.id === robotId);

    if (window.robotsSound) window.robotsSound.playGentle();
    this.showToast(`Switched to Group ${robot.groupNum}: ${robot.name}`);
    this.renderPage(this.state.currentPage);
  }

  // ================= PAGE 2: GUESSING / PREDICTION =================
  saveGuesses() {
    const what = document.getElementById('guess-what')?.value.trim() || '';
    const where = document.getElementById('guess-where')?.value.trim() || '';
    const when = document.getElementById('guess-when')?.value.trim() || '';
    const who = document.getElementById('guess-who')?.value.trim() || '';
    const why = document.getElementById('guess-why')?.value.trim() || '';
    const how = document.getElementById('guess-how')?.value.trim() || '';

    this.state.predictions[this.state.activeRobotId] = {
      what, where, when, who, why, how
    };
    this.state.predictionsSaved[this.state.activeRobotId] = true;

    if (window.robotsSound) window.robotsSound.playScan();
    this.showToast("🔮 Guesses saved! Fantastic detective work!");
    this.renderPage(2);
  }

  // ================= PAGE 3: WH QUESTION DETECTIVE =================
  selectWhWord(whId) {
    if (this.state.whMatchedSet.has(whId)) return;
    this.state.selectedWhWord = whId;
    if (window.robotsSound) window.robotsSound.playClick();
    this.renderPage(3);
  }

  selectWhMeaning(meaningId) {
    if (!this.state.selectedWhWord) {
      this.showToast("👉 Click a WH-Word on the left first!");
      return;
    }

    if (this.state.selectedWhWord === meaningId) {
      this.state.whMatchedSet.add(meaningId);
      this.state.selectedWhWord = null;

      if (this.state.whMatchedSet.size === 6) {
        if (window.robotsSound) window.robotsSound.playFanfare();
        this.showToast("🎉 GREAT DETECTIVE! All 6 WH-Questions matched!");
      } else {
        if (window.robotsSound) window.robotsSound.playCorrect();
        this.showToast("✓ Correct Match!");
      }
    } else {
      if (window.robotsSound) window.robotsSound.playBoing();
      this.showToast("❌ Not quite! Think what that question asks for.");
    }

    this.renderPage(3);
  }

  resetWhMatching() {
    this.state.whMatchedSet.clear();
    this.state.selectedWhWord = null;
    if (window.robotsSound) window.robotsSound.playClick();
    this.renderPage(3);
  }

  // ================= PAGE 5: COMPREHENSION CHECK =================
  toggleReadingPeek() {
    this.state.showReadingPeek = !this.state.showReadingPeek;
    if (window.robotsSound) window.robotsSound.playClick();
    this.renderPage(5);
  }

  selectComprehensionAnswer(qIdx, opt) {
    if (!this.state.comprehensionAnswers[this.state.activeRobotId]) {
      this.state.comprehensionAnswers[this.state.activeRobotId] = {};
    }
    this.state.comprehensionAnswers[this.state.activeRobotId][qIdx] = opt;
    if (window.robotsSound) window.robotsSound.playClick();
    this.renderPage(5);
  }

  checkAnswers() {
    this.state.answersChecked[this.state.activeRobotId] = true;
    const robot = window.ROBOTS_DATA.robots.find(r => r.id === this.state.activeRobotId);
    const answers = this.state.comprehensionAnswers[this.state.activeRobotId] || {};

    let correct = 0;
    robot.comprehension.forEach((item, idx) => {
      if (answers[idx] === item.answer) correct++;
    });

    if (correct === robot.comprehension.length) {
      if (window.robotsSound) window.robotsSound.playFanfare();
      this.showToast(`🌟 Perfect Score! 6/6 questions answered correctly!`);
    } else {
      if (window.robotsSound) window.robotsSound.playGentle();
      this.showToast(`🔎 You found ${correct}/6 correct answers! Check the green badges.`);
    }

    this.renderPage(5);
  }

  // ================= PAGE 6: FACT OR GUESS =================
  voteFactOrGuess(idx, userRealVote) {
    if (!this.state.factGuessVotes[this.state.activeRobotId]) {
      this.state.factGuessVotes[this.state.activeRobotId] = {};
    }
    this.state.factGuessVotes[this.state.activeRobotId][idx] = userRealVote;

    const robot = window.ROBOTS_DATA.robots.find(r => r.id === this.state.activeRobotId);
    const item = robot.factOrGuess[idx];

    if (userRealVote === item.isReal) {
      if (window.robotsSound) window.robotsSound.playCorrect();
      this.showToast(`✅ Correct! Real science verified!`);
    } else {
      if (window.robotsSound) window.robotsSound.playBoing();
      this.showToast(`❌ Oops! Look at the scientific explanation.`);
    }

    this.renderPage(6);
  }

  // ================= PAGE 7: PRESENTATION PREP =================
  setTeamUseChoice(choice) {
    this.state.teamUseChoice[this.state.activeRobotId] = choice;
    if (window.robotsSound) window.robotsSound.playGentle();
    this.showToast(`Team opinion recorded: ${choice}!`);
    this.renderPage(7);
  }

  // ================= PAGE 8: REAL WORLD REVEAL =================
  cycleRobotReveal() {
    const robots = window.ROBOTS_DATA.robots;
    const currentIdx = robots.findIndex(r => r.id === this.state.activeRobotId);
    const nextIdx = (currentIdx + 1) % robots.length;
    this.state.activeRobotId = robots[nextIdx].id;

    if (window.robotsSound) window.robotsSound.playScan();
    this.showToast(`Revealing Robot ${robots[nextIdx].groupNum}: ${robots[nextIdx].name}`);
    this.renderPage(8);
  }

  setRevealOpinion(opinion) {
    this.state.revealOpinions[this.state.activeRobotId] = opinion;
    if (window.robotsSound) window.robotsSound.playGentle();
    this.renderPage(8);
  }

  // ================= PAGE 9: FINAL REFLECTION =================
  setMostUseful(robotId) {
    this.state.mostUsefulRobot = robotId;
    if (window.robotsSound) window.robotsSound.playClick();
    this.renderPage(9);
  }

  setMostSurprising(robotId) {
    this.state.mostSurprisingRobot = robotId;
    if (window.robotsSound) window.robotsSound.playClick();
    this.renderPage(9);
  }

  // ================= TOAST NOTIFICATION =================
  showToast(message) {
    let toast = document.getElementById('robots-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'robots-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      toast.style.background = '#0f172a';
      toast.style.color = '#f8fafc';
      toast.style.padding = '12px 24px';
      toast.style.borderRadius = '999px';
      toast.style.fontWeight = '900';
      toast.style.fontSize = '14px';
      toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      toast.style.zIndex = '9999';
      toast.style.opacity = '0';
      toast.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      toast.style.pointerEvents = 'none';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2800);
  }
}

// Global Toggle Helpers for Header
function toggleTeacherMenu() {
  const menu = document.getElementById('robots-teacher-menu');
  if (menu) {
    menu.classList.toggle('show');
    menu.classList.toggle('is-visible');
  }
}

function toggleRobotSpeech() {
  if (window.robotsSound) {
    const enabled = window.robotsSound.toggleSpeech();
    const btn = document.getElementById('robot-voice-btn');
    if (btn) {
      btn.innerHTML = enabled ? '🔊 <span>Voice ON</span>' : '🔇 <span>Voice OFF</span>';
    }
    if (window.robotsApp) {
      window.robotsApp.showToast(enabled ? '🔊 Voice Narration Enabled' : '🔇 Voice Narration Muted');
    }
  }
}

function toggleRobotSfx() {
  if (window.robotsSound) {
    const enabled = window.robotsSound.toggleSfx();
    const btn = document.getElementById('robot-sfx-btn');
    if (btn) {
      btn.innerHTML = enabled ? '🎵 <span>SFX ON</span>' : '🔇 <span>SFX OFF</span>';
    }
    if (window.robotsApp) {
      window.robotsApp.showToast(enabled ? '🎵 Sound Effects Enabled' : '🔇 Sound Effects Muted');
    }
  }
}

// Close teacher menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('robots-teacher-menu');
  const btn = e.target.closest('.teacher-dropdown-wrap');
  if (menu && !btn && (menu.classList.contains('show') || menu.classList.contains('is-visible'))) {
    menu.classList.remove('show');
    menu.classList.remove('is-visible');
  }
});

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.robotsApp = new RobotsApp();
});
