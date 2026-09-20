/**
 * WONDERLAND STORY APP CONTROLLER & STATE MACHINE
 * Grade 3 A1 Mini-Unit • Lesson 3: We Are the Wonderland Story!
 */

(function(root) {
  'use strict';

  class WonderlandStoryApp {
    constructor() {
      this.sound = root.wonderlandStoryAudio;
      this.data = root.WONDERLAND_STORY_DATA;
      this.scenes = new root.WonderlandStoryScenes(this);

      this.currentScreen = 1;
      this.totalScreens = 11;
      this.xp = 0;
      this.maxXP = 105;
      this.completedScreens = new Set();

      this.state = {
        enteredPortal: false,
        memoryQuestionIndex: 0,
        whatHappenedPlaced: [],
        storyBuilderSelected: [],
        selectedVoiceChar: null,
        freezeSceneIndex: 0,
        isFreezeActive: false,
        freezeTimer: null,
        selectedScenePreset: 'sc-teaparty',
        equippedProps: [],
        exitTicketSelections: [],
        isCelebration: false,
        rubric: {
          recallsCharacters: false,
          ordersStory: false,
          usesPastSimple: false,
          actsInRole: false,
          teamworkRehearsal: false
        }
      };

      // Load saved rubric if available
      try {
        const saved = localStorage.getItem('eaa-ws-rubric');
        if (saved) this.state.rubric = JSON.parse(saved);
      } catch (e) {}
    }

    init() {
      this.bindKeyboardShortcuts();
      this.checkUrlParams();
      this.renderScreen(this.currentScreen);
      this.updateHud();
    }

    checkUrlParams() {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const s = parseInt(params.get('screen'), 10);
      if (s >= 1 && s <= 11) {
        this.currentScreen = s;
      } else if (s === 12) {
        this.currentScreen = 12;
      }
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
      if (num === 12) {
        this.renderCelebration();
        return;
      }

      if (num < 1) num = 1;
      if (num > this.totalScreens) num = this.totalScreens;
      this.currentScreen = num;
      this.state.isCelebration = false;

      // Clean freeze timers if switching away from screen 6
      if (num !== 6 && this.state.freezeTimer) {
        clearTimeout(this.state.freezeTimer);
        this.state.freezeTimer = null;
        if (this.sound) this.sound.stopCarnivalMusic();
      }

      this.updateHud();

      const container = document.getElementById('wonderland-story-stage-content');
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
        default: this.scenes.renderScreen1(container); break;
      }
    }

    nextScreen() {
      if (this.currentScreen < this.totalScreens) {
        if (this.sound) this.sound.playClick();
        this.renderScreen(this.currentScreen + 1);
      } else {
        this.renderCelebration();
      }
    }

    prevScreen() {
      if (this.currentScreen > 1) {
        if (this.sound) this.sound.playClick();
        this.renderScreen(this.currentScreen - 1);
      }
    }

    renderCelebration() {
      this.currentScreen = 12;
      this.state.isCelebration = true;
      this.awardXP(20, 'Wonderland Hero Bonus!');
      if (this.sound) {
        this.sound.playApplause();
        this.sound.playFanfare();
      }
      this.updateHud();

      const container = document.getElementById('wonderland-story-stage-content');
      if (container) {
        this.scenes.renderCelebration(container);
      }
    }

    restartLesson() {
      this.currentScreen = 1;
      this.state.enteredPortal = false;
      this.state.memoryQuestionIndex = 0;
      this.state.whatHappenedPlaced = [];
      this.state.storyBuilderSelected = [];
      this.state.selectedVoiceChar = null;
      this.state.freezeSceneIndex = 0;
      this.state.isFreezeActive = false;
      this.state.selectedScenePreset = 'sc-teaparty';
      this.state.equippedProps = [];
      this.state.exitTicketSelections = [];
      this.state.isCelebration = false;
      this.renderScreen(1);
      this.showToast('Lesson restarted! 🌟');
    }

    awardXP(pts, reason = '') {
      if (this.completedScreens.has(this.currentScreen)) return;
      this.completedScreens.add(this.currentScreen);

      this.xp = Math.min(this.maxXP, this.xp + pts);
      if (this.sound) {
        this.sound.playChime();
        this.sound.playSparkle();
      }
      this.updateHud();
      this.showToast('+' + pts + ' XP! ' + (reason || 'Great job! ⭐'));
    }

    updateHud() {
      const xpEl = document.getElementById('hud-xp-display');
      if (xpEl) xpEl.textContent = '⭐ ' + this.xp + ' / ' + this.maxXP + ' XP';

      const tracker = document.getElementById('hud-screen-indicator');
      if (tracker) {
        if (this.state.isCelebration) {
          tracker.textContent = '🌟 Celebration!';
        } else {
          tracker.textContent = 'Scene ' + this.currentScreen + ' of ' + this.totalScreens;
        }
      }

      const progress = document.getElementById('hud-progress-fill');
      if (progress) {
        const pct = Math.min(100, Math.round(((this.currentScreen - 1) / this.totalScreens) * 100));
        progress.style.width = pct + '%';
      }

      const btnPrev = document.getElementById('btn-nav-prev');
      if (btnPrev) btnPrev.disabled = (this.currentScreen === 1);

      const btnNext = document.getElementById('btn-nav-next');
      if (btnNext) {
        if (this.state.isCelebration) {
          btnNext.style.display = 'none';
        } else {
          btnNext.style.display = 'inline-flex';
          btnNext.textContent = (this.currentScreen === this.totalScreens) ? 'Celebration! 🌟' : 'Next Scene ▶';
        }
      }
    }

    showToast(msg, duration = 2400) {
      const toast = document.getElementById('ws-toast');
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('visible');
      clearTimeout(toast._t);
      toast._t = setTimeout(() => {
        toast.classList.remove('visible');
      }, duration);
    }

    // =========================================================================
    // SCREEN 1: PORTAL & READINESS
    // =========================================================================

    enterPortal() {
      this.state.enteredPortal = true;
      if (this.sound) {
        this.sound.playDoorUnlock();
        this.sound.playSparkle();
      }
      const container = document.getElementById('wonderland-story-stage-content');
      if (container) this.scenes.renderScreen1(container);
    }

    chooseReadiness(id) {
      this.awardXP(5, 'Entered Wonderland Theatre!');
      if (this.sound) this.sound.playCurtain();
      this.showToast("Let's go! Opening the stage curtains... 🎭");
      setTimeout(() => this.nextScreen(), 1100);
    }

    // =========================================================================
    // SCREEN 2: MEMORY CHALLENGE
    // =========================================================================

    answerMemoryQuestion(choice) {
      const qIdx = this.state.memoryQuestionIndex;
      const q = this.data.screen2.questions[qIdx];
      if (!q) return;

      const isCorrect = (choice === q.correct);
      if (isCorrect) {
        if (this.sound) {
          this.sound.playCorrect();
          this.sound.playSparkle();
        }
        this.showToast('Correct! ⭐ ' + q.correct);

        setTimeout(() => {
          if (this.state.memoryQuestionIndex < this.data.screen2.questions.length - 1) {
            this.state.memoryQuestionIndex++;
            this.renderScreen(2);
          } else {
            this.awardXP(5, 'Memory Master! 🧠');
            setTimeout(() => this.nextScreen(), 1200);
          }
        }, 1000);
      } else {
        if (this.sound) this.sound.playWrong();
        this.showToast('Try again! Look closely at the characters and props!');
      }
    }

    // =========================================================================
    // SCREEN 3: SEQUENCING
    // =========================================================================

    placeWhatHappened(sceneId) {
      const placed = this.state.whatHappenedPlaced;
      const expectedId = this.data.screen3.correctOrder[placed.length];

      if (sceneId === expectedId) {
        placed.push(sceneId);
        if (this.sound) {
          this.sound.playCorrect();
          this.sound.playCardSnap();
        }

        if (placed.length === this.data.screen3.correctOrder.length) {
          if (this.sound) this.sound.playApplause();
          this.awardXP(10, 'Story Sequenced in Perfect Order! 🎬');
          this.showToast('Magnificent! You sequenced all 4 scenes!');
        }

        this.renderScreen(3);
      } else {
        if (this.sound) this.sound.playWrong();
        this.showToast('Oops! Think what happened before this!');
      }
    }

    resetWhatHappened() {
      this.state.whatHappenedPlaced = [];
      if (this.sound) this.sound.playClick();
      this.renderScreen(3);
    }

    // =========================================================================
    // SCREEN 4: BUILD THE STORY
    // =========================================================================

    toggleStoryCard(cardId) {
      const sel = this.state.storyBuilderSelected;
      const idx = sel.indexOf(cardId);
      if (idx > -1) {
        sel.splice(idx, 1);
      } else {
        if (sel.length < 5) {
          sel.push(cardId);
          if (this.sound) this.sound.playCardSnap();
        } else {
          this.showToast('Max 5 cards for your story!');
          return;
        }
      }

      if (sel.length >= 3) {
        this.awardXP(10, 'Story Timeline Created! 📚');
      }

      this.renderScreen(4);
    }

    removeStoryCard(cardId) {
      const sel = this.state.storyBuilderSelected;
      const idx = sel.indexOf(cardId);
      if (idx > -1) {
        sel.splice(idx, 1);
        if (this.sound) this.sound.playClick();
        this.renderScreen(4);
      }
    }

    readFullGeneratedStory() {
      const sel = this.state.storyBuilderSelected;
      if (sel.length === 0) return;
      const storyText = sel.map(id => {
        const c = this.data.screen4.cards.find(card => card.id === id);
        return c ? c.phrase : '';
      }).filter(Boolean).join('. ');

      if (this.sound) this.sound.speak(storyText, 0.86);
      this.showToast('Narrating your Wonderland story... 🔊');
    }

    // =========================================================================
    // SCREEN 5: CHARACTER VOICES
    // =========================================================================

    selectVoiceChar(charId) {
      const c = this.data.screen5.characters.find(char => char.id === charId);
      if (c) {
        this.state.selectedVoiceChar = c;
        if (this.sound) this.sound.playClick();
        this.renderScreen(5);
      }
    }

    speakCharacterLines() {
      const c = this.state.selectedVoiceChar || this.data.screen5.characters[0];
      const text = c.lines.join('. ');
      if (this.sound) this.sound.speakCharacter(text, 1.15, 0.88);
      this.showToast('Listening to ' + c.name + '... 🔊');
    }

    promptSayIt() {
      const c = this.state.selectedVoiceChar || this.data.screen5.characters[0];
      if (this.sound) this.sound.playSparkle();
      this.showToast('Class, say it together: "' + c.lines[0] + '" 🎤');
    }

    promptActIt() {
      const c = this.state.selectedVoiceChar || this.data.screen5.characters[0];
      if (this.sound) this.sound.playChime();
      this.awardXP(10, 'Acted Character Line! 🎭');
      this.showToast('Show your ' + c.name + ' pose! 🎭');
    }

    // =========================================================================
    // SCREEN 6: FREEZE FRAME THEATRE
    // =========================================================================

    startFreezeGame() {
      if (this.sound) this.sound.startCarnivalMusic();
      this.state.isFreezeActive = false;
      this.renderScreen(6);
      this.showToast('🎶 Music playing! Dance and move like your character! 💃🕺');

      clearTimeout(this.state.freezeTimer);
      const duration = Math.floor(Math.random() * 1500) + 3500;
      this.state.freezeTimer = setTimeout(() => {
        if (this.sound) {
          this.sound.stopCarnivalMusic();
          this.sound.playFreezeWhistle();
        }
        this.state.isFreezeActive = true;
        this.awardXP(10, 'Freeze Frame Champion! 🧊');
        this.renderScreen(6);
        this.showToast('🧊 FREEZE! Answer: What happened?');
      }, duration);
    }

    nextFreezeScene() {
      clearTimeout(this.state.freezeTimer);
      if (this.sound) this.sound.stopCarnivalMusic();
      this.state.freezeSceneIndex = (this.state.freezeSceneIndex + 1) % this.data.screen6.scenes.length;
      this.state.isFreezeActive = false;
      this.renderScreen(6);
    }

    // =========================================================================
    // SCREEN 7: CREATE MINI SCENE
    // =========================================================================

    selectScenePreset(presetId) {
      this.state.selectedScenePreset = presetId;
      if (this.sound) this.sound.playClick();
      this.awardXP(15, 'Mini-Scene Chosen! 🎬');
      this.renderScreen(7);
    }

    // =========================================================================
    // SCREEN 8: MINI SCRIPT BUILDER
    // =========================================================================

    readEntireScript(rate = 1.0) {
      const presetId = this.state.selectedScenePreset || "sc-teaparty";
      const scriptLines = this.data.screen8.scripts[presetId] || this.data.screen8.scripts["sc-teaparty"];
      const fullText = scriptLines.map(l => l.speaker + ": " + l.speech).join('. ');

      if (this.sound) this.sound.speak(fullText, rate);
      this.awardXP(10, 'Script Rehearsed! 📜✨');
      this.showToast('Rehearsing entire dialogue script... 📜');
    }

    // =========================================================================
    // SCREEN 9: PROP CONNECTION
    // =========================================================================

    toggleProp(propId) {
      const eq = this.state.equippedProps;
      const idx = eq.indexOf(propId);
      if (idx > -1) {
        eq.splice(idx, 1);
        if (this.sound) this.sound.playClick();
      } else {
        eq.push(propId);
        if (this.sound) this.sound.playCardSnap();
      }

      if (eq.length >= 3) {
        this.awardXP(10, 'Props Equipped for Play! 🧰');
      }

      this.renderScreen(9);
    }

    // =========================================================================
    // SCREEN 10: PERFORMANCE CHALLENGE
    // =========================================================================

    triggerApplause() {
      if (this.sound) {
        this.sound.playApplause();
        this.sound.playCheer();
      }
      this.awardXP(10, 'Classroom Standing Ovation! 🌟');
      this.showToast('👏👏 Enormous Classroom Applause! Bravo, actors!');
    }

    // =========================================================================
    // SCREEN 11: EXIT TICKET
    // =========================================================================

    toggleExitChoice(choiceId) {
      const sel = this.state.exitTicketSelections;
      const idx = sel.indexOf(choiceId);
      if (idx > -1) {
        sel.splice(idx, 1);
      } else {
        sel.push(choiceId);
      }
      if (this.sound) this.sound.playClick();
      this.awardXP(10, 'Exit Ticket Reflection Complete! 🎫');
      this.renderScreen(11);
    }

    speak(text) {
      if (this.sound) this.sound.speak(text);
    }

    // =========================================================================
    // TEACHER DRAWER & RUBRIC
    // =========================================================================

    openTeacherDrawer() {
      const modal = document.getElementById('wonderland-teacher-modal');
      const body = document.getElementById('teacher-modal-body');
      if (modal && body) {
        this.scenes.renderTeacherModal(body);
        modal.style.display = 'flex';
      }
    }

    closeTeacherDrawer() {
      const modal = document.getElementById('wonderland-teacher-modal');
      if (modal) modal.style.display = 'none';
    }

    toggleTeacherDrawer() {
      const modal = document.getElementById('wonderland-teacher-modal');
      if (!modal) return;
      if (modal.style.display === 'none' || !modal.style.display) {
        this.openTeacherDrawer();
      } else {
        this.closeTeacherDrawer();
      }
    }

    toggleRubric(key) {
      if (this.state.rubric.hasOwnProperty(key)) {
        this.state.rubric[key] = !this.state.rubric[key];
        try {
          localStorage.setItem('eaa-ws-rubric', JSON.stringify(this.state.rubric));
        } catch (e) {}
        const body = document.getElementById('teacher-modal-body');
        if (body) this.scenes.renderTeacherModal(body);
      }
    }
  }

  // Instantiate & Boot
  root.WonderlandStoryApp = WonderlandStoryApp;

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      root.wonderlandStoryApp = new WonderlandStoryApp();
      root.wonderlandStoryApp.init();
    });
  }

})(typeof window !== 'undefined' ? window : global);
