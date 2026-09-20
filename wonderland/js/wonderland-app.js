/**
 * WONDERLAND APP CONTROLLER & STATE MACHINE
 * Grade 3 A1 Mini-Unit • Lesson 1: Welcome to Wonderland
 */

(function(root) {
  'use strict';

  class WonderlandApp {
    constructor() {
      this.sound = root.wonderlandAudio;
      this.data = root.WONDERLAND_DATA;
      this.scenes = new root.WonderlandScenes(this);

      this.currentScreen = 1;
      this.totalScreens = 12;
      this.xp = 0;

      this.state = {
        screen2Answer: null,
        screen2Feedback: null,
        screen2IsCorrect: false,

        collectedItems: [],
        selectedCharId: null,

        matchedPairs: {},
        activeCharMatch: null,
        activePropMatch: null,

        timeMachineIsPast: false,
        clockSpinning: false,

        tappedMoments: {},

        nowYesterdayIndex: 0,
        nowYesterdayFeedback: null,
        nowYesterdayIsCorrect: false,

        tprIndex: 0,
        chestIsOpen: false,
        exitTicketIndex: 0,
        isCelebration: false
      };
    }

    init() {
      this.bindKeyboardShortcuts();
      this.renderScreen(1);
    }

    bindKeyboardShortcuts() {
      if (typeof window === 'undefined') return;
      window.addEventListener('keydown', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (e.key === 't' || e.key === 'T') {
          this.toggleTeacherDrawer();
        } else if (e.key === 'ArrowRight') {
          this.nextScreen();
        } else if (e.key === 'ArrowLeft') {
          this.prevScreen();
        } else if (e.key === 'Escape') {
          this.closeTeacherDrawer();
        }
      });
    }

    // =========================================================================
    // NAVIGATION & HUD
    // =========================================================================

    renderScreen(num) {
      if (num < 1) num = 1;
      if (num > this.totalScreens) num = this.totalScreens;
      this.currentScreen = num;
      this.state.isCelebration = false;

      this.updateHud();

      const container = document.getElementById('wonderland-stage-content');
      if (!container) return;
      container.scrollTop = 0;

      switch (num) {
        case 1: this.scenes.renderScreen1(container); break;
        case 2: this.scenes.renderScreen2(container); break;
        case 3: this.scenes.renderScreen3(container); break;
        case 4: this.scenes.renderScreen4(container); break;
        case 5: this.scenes.renderScreen5(container); break;
        case 6: this.scenes.renderScreen6(container); break;
        case 7: this.scenes.renderScreen7(container); break;
        case 8: this.scenes.renderScreen8(container); break;
        case 9: this.scenes.renderScreen9(container); break;
        case 10: this.scenes.renderScreen10(container); break;
        case 11: this.scenes.renderScreen11(container); break;
        case 12: this.scenes.renderScreen12(container); break;
        default: this.scenes.renderScreen1(container);
      }
    }

    renderCelebration() {
      this.state.isCelebration = true;
      this.addXp(10);
      this.sound.playChestOpenFanfare();
      const container = document.getElementById('wonderland-stage-content');
      if (container) {
        this.scenes.renderCelebration(container);
      }
    }

    nextScreen() {
      if (this.currentScreen < this.totalScreens) {
        this.sound.playClick();
        this.renderScreen(this.currentScreen + 1);
      } else if (!this.state.isCelebration) {
        this.renderCelebration();
      }
    }

    prevScreen() {
      if (this.currentScreen > 1) {
        this.sound.playClick();
        this.renderScreen(this.currentScreen - 1);
      }
    }

    updateHud() {
      const tracker = document.getElementById('hud-screen-tracker');
      if (tracker) {
        tracker.textContent = `Screen ${this.currentScreen} of ${this.totalScreens}`;
      }
      const xpEl = document.getElementById('hud-xp-display');
      if (xpEl) {
        xpEl.textContent = `⭐ ${this.xp} XP`;
      }
    }

    addXp(amount) {
      this.xp += amount;
      this.updateHud();
      const pill = document.getElementById('hud-xp-pill');
      if (pill) {
        pill.classList.add('bounce');
        setTimeout(() => pill.classList.remove('bounce'), 320);
      }
      this.showToast(`+${amount} Wonderland XP! ⭐`);
    }

    showToast(msg) {
      const toast = document.getElementById('wonderland-toast');
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('is-active');
      clearTimeout(this._toastTimeout);
      this._toastTimeout = setTimeout(() => {
        toast.classList.remove('is-active');
      }, 2400);
    }

    speak(text) {
      this.sound.speakTeacher(text);
    }

    // =========================================================================
    // SCREEN ACTIONS
    // =========================================================================

    enterWonderland() {
      this.sound.playWhoosh();
      this.sound.playMagicalChime();
      this.addXp(1);
      this.sound.speakTeacher("Welcome to Wonderland!");
      setTimeout(() => {
        this.nextScreen();
      }, 700);
    }

    handleScreen2Choice(choiceId) {
      this.state.screen2Answer = choiceId;
      const opt = this.data.screen2.options.find(o => o.id === choiceId);
      if (!opt) return;

      if (opt.isCorrect) {
        this.state.screen2IsCorrect = true;
        this.state.screen2Feedback = opt.feedback;
        this.sound.playMagicalChime();
        this.addXp(1);
        this.sound.speakTeacher(opt.feedback);
        this.renderScreen(2);
        setTimeout(() => {
          this.nextScreen();
        }, 1600);
      } else {
        this.state.screen2IsCorrect = false;
        this.state.screen2Feedback = opt.feedback;
        this.sound.playGentleTryAgain();
        this.sound.speakTeacher(opt.feedback);
        this.renderScreen(2);
      }
    }

    collectScavengerItem(itemId) {
      if (this.state.collectedItems.includes(itemId)) return;
      this.state.collectedItems.push(itemId);
      this.sound.playSparkle();
      this.addXp(1);

      const foundItem = this.data.screen3.items.find(i => i.id === itemId);
      if (foundItem) {
        this.sound.speakTeacher(foundItem.name);
      }

      if (this.state.collectedItems.length >= this.data.screen3.items.length) {
        this.sound.playMagicalChime();
        this.addXp(2);
        this.sound.speakTeacher("Super! You found all 6 Wonderland things!");
      }
      this.renderScreen(3);
    }

    selectCharacter(charId) {
      this.state.selectedCharId = charId;
      this.sound.playClick();
      const charObj = this.data.characters.find(c => c.id === charId);
      if (charObj) {
        this.sound.speakCharacter(charObj.audioSpeech);
      }
      this.renderScreen(4);
    }

    selectMatchChar(charId) {
      this.sound.playClick();
      this.state.activeCharMatch = charId;
      this.checkMatchAttempt();
      this.renderScreen(5);
    }

    selectMatchProp(propId) {
      this.sound.playClick();
      this.state.activePropMatch = propId;
      this.checkMatchAttempt();
      this.renderScreen(5);
    }

    checkMatchAttempt() {
      const cId = this.state.activeCharMatch;
      const pId = this.state.activePropMatch;
      if (!cId || !pId) return;

      const targetPair = this.data.propMatch.pairs.find(pair => pair.charId === cId && pair.propId === pId);
      if (targetPair) {
        this.state.matchedPairs[cId] = pId;
        this.state.activeCharMatch = null;
        this.state.activePropMatch = null;
        this.sound.playMagicalChime();
        this.addXp(1);
        this.sound.speakTeacher(`Magic Match! ${targetPair.charName} and ${targetPair.propName}!`);
      } else {
        this.sound.playGentleTryAgain();
        this.showToast("Try another one!");
        this.state.activeCharMatch = null;
        this.state.activePropMatch = null;
      }
    }

    toggleTimeMachine() {
      this.state.clockSpinning = true;
      this.sound.playWhoosh();
      this.renderScreen(6);

      setTimeout(() => {
        this.state.clockSpinning = false;
        this.state.timeMachineIsPast = !this.state.timeMachineIsPast;
        if (this.state.timeMachineIsPast) {
          this.sound.playMagicalChime();
          this.addXp(1);
          this.sound.speakTeacher("Yesterday! Alice WENT to Wonderland!");
        } else {
          this.sound.speakTeacher("Today! Alice is here.");
        }
        this.renderScreen(6);
      }, 700);
    }

    tapMoment(momentId) {
      this.sound.playSparkle();
      this.state.tappedMoments[momentId] = true;
      const m = this.data.whatHappened.find(item => item.id === momentId);
      if (m) {
        this.sound.speakTeacher(m.audio);
      }
      this.renderScreen(7);
    }

    answerNowYesterday(choice) {
      const questions = this.data.nowOrYesterday;
      const qIdx = this.state.nowYesterdayIndex || 0;
      const currentQ = questions[qIdx];
      if (!currentQ) return;

      const isCorrect = choice === currentQ.correct;
      this.state.nowYesterdayIsCorrect = isCorrect;
      this.state.nowYesterdayFeedback = isCorrect ? `YES! ${currentQ.explanation}` : `Almost! ${currentQ.explanation}`;

      if (isCorrect) {
        this.sound.playMagicalChime();
        this.addXp(1);
        this.sound.speakTeacher(this.state.nowYesterdayFeedback);
      } else {
        this.sound.playGentleTryAgain();
        this.sound.speakTeacher(this.state.nowYesterdayFeedback);
      }

      this.renderScreen(8);

      setTimeout(() => {
        if (qIdx + 1 < questions.length) {
          this.state.nowYesterdayIndex = qIdx + 1;
          this.state.nowYesterdayFeedback = null;
          this.renderScreen(8);
        } else {
          this.nextScreen();
        }
      }, 1500);
    }

    nextTprAction() {
      const actions = this.data.tprActions;
      if (this.state.tprIndex + 1 < actions.length) {
        this.state.tprIndex++;
        this.sound.playClick();
        const nextAct = actions[this.state.tprIndex];
        this.sound.speakTeacher(nextAct.audioPrompt);
        this.renderScreen(9);
      } else {
        this.addXp(2);
        this.sound.playMagicalChime();
        this.nextScreen();
      }
    }

    openChest() {
      if (this.state.chestIsOpen) return;
      this.state.chestIsOpen = true;
      this.sound.playChestOpenFanfare();
      this.addXp(2);
      this.sound.speakTeacher("Look! These are our future theatre props!");
      this.renderScreen(10);
    }

    randomExitTicket() {
      this.sound.playClick();
      const count = this.data.exitTickets.length;
      this.state.exitTicketIndex = Math.floor(Math.random() * count);
      const ticket = this.data.exitTickets[this.state.exitTicketIndex];
      this.sound.speakTeacher(`Object: ${ticket.name}. ${ticket.target}`);
      this.renderScreen(12);
    }

    restartLesson() {
      this.currentScreen = 1;
      this.xp = 0;
      this.state = {
        screen2Answer: null,
        screen2Feedback: null,
        screen2IsCorrect: false,
        collectedItems: [],
        selectedCharId: null,
        matchedPairs: {},
        activeCharMatch: null,
        activePropMatch: null,
        timeMachineIsPast: false,
        clockSpinning: false,
        tappedMoments: {},
        nowYesterdayIndex: 0,
        nowYesterdayFeedback: null,
        nowYesterdayIsCorrect: false,
        tprIndex: 0,
        chestIsOpen: false,
        exitTicketIndex: 0,
        isCelebration: false
      };
      this.sound.playClick();
      this.renderScreen(1);
      this.showToast("Lesson restarted at Screen 1");
    }

    // =========================================================================
    // TEACHER DRAWER / MODAL
    // =========================================================================

    toggleTeacherDrawer() {
      const modal = document.getElementById('wonderland-teacher-modal');
      if (!modal) return;
      const isVisible = modal.style.display === 'flex';
      if (isVisible) {
        this.closeTeacherDrawer();
      } else {
        this.openTeacherDrawer();
      }
    }

    openTeacherDrawer() {
      const modal = document.getElementById('wonderland-teacher-modal');
      const content = document.getElementById('teacher-modal-body');
      if (!modal || !content) return;

      const guide = this.data.teacherGuides[this.currentScreen] || this.data.teacherGuides[1];

      content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid rgba(245,158,11,0.3); padding-bottom:10px;">
          <div>
            <h3 style="font-size:1.35rem; color:#f59e0b; font-weight:900; margin:0;">
              🧑‍🏫 Teacher Guide · Screen ${this.currentScreen}
            </h3>
            <span style="font-size:0.85rem; color:#38bdf8; font-weight:700;">Timing: ${guide.timing}</span>
          </div>
          <button type="button" class="hud-btn" onclick="window.wonderlandApp.closeTeacherDrawer()">✕ Close</button>
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px;">
          ${[1,2,3,4,5,6,7,8,9,10,11,12].map(num => `
            <button type="button" class="hud-btn ${num === this.currentScreen ? 'primary' : ''}" style="padding:6px 12px; font-size:0.85rem;"
                    onclick="window.wonderlandApp.renderScreen(${num}); window.wonderlandApp.openTeacherDrawer();">
              S${num}
            </button>
          `).join('')}
        </div>

        <div class="teacher-grid-guides">
          <div class="teacher-guide-tile">
            <h4>🎯 Pedagogical Objective</h4>
            <p>${guide.objective}</p>
          </div>
          <div class="teacher-guide-tile">
            <h4>🗣️ Teacher Spoken Script</h4>
            <p style="color:#fef08a; font-style:italic;">${guide.teacherScript}</p>
          </div>
          <div class="teacher-guide-tile">
            <h4>🏃 Student Physical Action</h4>
            <p>${guide.studentAction}</p>
          </div>
          <div class="teacher-guide-tile">
            <h4>📱 Smart Board Tip</h4>
            <p>${guide.boardTip}</p>
          </div>
        </div>

        <div style="display:flex; gap:10px; margin-top:20px; justify-content:space-between; align-items:center;">
          <button type="button" class="hud-btn" onclick="window.wonderlandApp.restartLesson(); window.wonderlandApp.closeTeacherDrawer();">
            🔄 Restart Lesson
          </button>
          <a href="worksheet.html" target="_blank" class="hud-btn" style="background:#f0fdf4; color:#166534; font-weight:800;">
            🖨️ Open Companion Worksheet ➔
          </a>
        </div>
      `;

      modal.style.display = 'flex';
      this.sound.playClick();
    }

    closeTeacherDrawer() {
      const modal = document.getElementById('wonderland-teacher-modal');
      if (modal) modal.style.display = 'none';
    }
  }

  root.wonderlandApp = new WonderlandApp();

  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      window.wonderlandApp.init();
    });
  }

})(typeof window !== 'undefined' ? window : global);
