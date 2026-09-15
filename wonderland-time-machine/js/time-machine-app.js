/**
 * TIME MACHINE APP CONTROLLER & STATE MACHINE
 * Grade 3 A1 Mini-Unit • Lesson 2: The Wonderland Time Machine
 */

(function(root) {
  'use strict';

  class TimeMachineApp {
    constructor() {
      this.sound = root.timeMachineAudio;
      this.data = root.TIME_MACHINE_DATA;
      this.scenes = new root.TimeMachineScenes(this);

      this.currentScreen = 1;
      this.totalScreens = 14;
      this.xp = 0;

      this.state = {
        difficultyLevel: 'A', // 'A' (Support) | 'B' (Challenge)
        clockSpinning: false,
        countdownActive: false,
        countdownNumber: 3,

        nowYesterdayIndex: 0,
        nowYesterdayFeedback: null,

        transformedVerbs: {},
        storyPlacedOrder: [],

        magicSentenceIndex: 0,
        magicSentenceFeedback: null,

        foundHuntVerbs: [],
        madHatterLieFound: false,

        ownLieDrawnCards: [],
        tprIndex: 0,
        detectiveAnswers: {},
        bossRoundIndex: 0,
        isCelebration: false,

        rubric: {
          recognizesVerbs: false,
          understandsYesterday: false,
          usesOrally: false,
          participatesTPR: false,
          tellsSequence: false
        }
      };

      // Load saved rubric if available
      try {
        const saved = localStorage.getItem('eaa-tm-rubric');
        if (saved) this.state.rubric = JSON.parse(saved);
      } catch (e) {}
    }

    init() {
      this.bindKeyboardShortcuts();
      this.drawRandomLieCards();
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

      const container = document.getElementById('time-machine-stage-content');
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
        case 13: this.scenes.renderScreen13(container); break;
        case 14: this.scenes.renderScreen14(container); break;
        default: this.scenes.renderScreen1(container);
      }
    }

    renderCelebration() {
      this.state.isCelebration = true;
      this.addXp(10);
      this.sound.playBossVictory();
      const container = document.getElementById('time-machine-stage-content');
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

    toggleDifficulty() {
      this.state.difficultyLevel = this.state.difficultyLevel === 'A' ? 'B' : 'A';
      this.sound.playClick();
      this.showToast(`Difficulty switched to Level ${this.state.difficultyLevel}!`);
      this.updateHud();
      this.renderScreen(this.currentScreen);
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
      const diffBtn = document.getElementById('hud-diff-btn');
      if (diffBtn) {
        diffBtn.textContent = `Level ${this.state.difficultyLevel} (${this.state.difficultyLevel === 'A' ? 'Support' : 'Challenge'})`;
      }
    }

    addXp(amount) {
      this.xp += amount;
      this.updateHud();
      const pill = document.getElementById('hud-xp-pill');
      if (pill) {
        pill.classList.add('bounce');
        setTimeout(() => pill.classList.remove('bounce'), 350);
      }
      this.showToast(`+${amount} Wonderland XP! ⭐`);
    }

    showToast(msg) {
      const toast = document.getElementById('time-machine-toast');
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
    // SCREEN 1: COUNTDOWN & LAUNCH
    // =========================================================================

    startMachineCountdown() {
      if (this.state.countdownActive) return;
      this.state.countdownActive = true;
      this.state.clockSpinning = true;
      this.state.countdownNumber = 3;
      this.sound.playClockTick(true);
      this.renderScreen(1);

      const countInterval = setInterval(() => {
        this.state.countdownNumber--;
        if (this.state.countdownNumber > 0) {
          this.sound.playClockTick(true);
          this.renderScreen(1);
        } else {
          clearInterval(countInterval);
          this.sound.playTimeWarpWhoosh();
          this.addXp(1);
          setTimeout(() => {
            this.state.countdownActive = false;
            this.state.clockSpinning = false;
            this.nextScreen();
          }, 900);
        }
      }, 750);
    }

    // =========================================================================
    // SCREEN 2: NOW OR YESTERDAY?
    // =========================================================================

    answerNowYesterday(choice) {
      const questions = this.data.screen2.questions;
      const qIdx = this.state.nowYesterdayIndex || 0;
      const currentQ = questions[qIdx];
      if (!currentQ) return;

      const isCorrect = choice === currentQ.correct;
      if (isCorrect) {
        this.sound.playTransformationChime();
        this.addXp(1);
        this.state.nowYesterdayFeedback = currentQ.feedback;
        this.sound.speakTeacher(currentQ.feedback);
      } else {
        this.sound.playGentleTryAgain();
        this.state.nowYesterdayFeedback = "Almost! Look at the verb again!";
        this.sound.speakTeacher("Almost! Try again!");
      }

      this.renderScreen(2);

      setTimeout(() => {
        if (isCorrect) {
          if (qIdx + 1 < questions.length) {
            this.state.nowYesterdayIndex = qIdx + 1;
            this.state.nowYesterdayFeedback = null;
            this.renderScreen(2);
          } else {
            this.state.nowYesterdayFeedback = null;
            this.nextScreen();
          }
        }
      }, 1400);
    }

    // =========================================================================
    // SCREEN 3: TRANSFORM VERBS
    // =========================================================================

    transformVerb(verbId) {
      if (this.state.transformedVerbs[verbId]) return;
      this.state.transformedVerbs[verbId] = true;
      this.sound.playGearClank();
      this.sound.playTransformationChime();
      this.addXp(1);

      const verbObj = this.data.screen3.verbs.find(v => v.id === verbId);
      if (verbObj) {
        this.sound.speakTeacher(verbObj.audio);
      }
      this.renderScreen(3);
    }

    transformAllVerbs() {
      this.data.screen3.verbs.forEach(v => {
        this.state.transformedVerbs[v.id] = true;
      });
      this.sound.playGearClank();
      this.sound.playTransformationChime();
      this.addXp(2);
      this.sound.speakTeacher("All verbs transformed to yesterday!");
      this.renderScreen(3);
    }

    // =========================================================================
    // SCREEN 4: STORY SEQUENCER
    // =========================================================================

    placeStoryCard(cardId) {
      const correctOrder = this.data.screen4.correctOrder;
      const nextExpected = correctOrder[this.state.storyPlacedOrder.length];

      if (cardId === nextExpected) {
        this.state.storyPlacedOrder.push(cardId);
        this.sound.playSparkle();
        this.addXp(1);

        const card = this.data.screen4.cards.find(c => c.id === cardId);
        if (card) {
          this.sound.speakTeacher(card.sentence);
        }

        if (this.state.storyPlacedOrder.length === correctOrder.length) {
          this.sound.playBossVictory();
          this.addXp(2);
          this.sound.speakTeacher("Fantastic! You ordered Alice's entire story!");
        }
        this.renderScreen(4);
      } else {
        this.sound.playGentleTryAgain();
        this.showToast("Not this one yet! Look at what happened first!");
      }
    }

    resetStorySequence() {
      this.state.storyPlacedOrder = [];
      this.sound.playClick();
      this.renderScreen(4);
    }

    // =========================================================================
    // SCREEN 5: COMPLETE THE MAGIC SENTENCE
    // =========================================================================

    chooseSentenceVerb(choice) {
      const challenges = this.data.screen5.challenges;
      const idx = this.state.magicSentenceIndex || 0;
      const c = challenges[idx];
      if (!c) return;

      if (choice === c.correct) {
        this.sound.playTransformationChime();
        this.addXp(1);
        this.state.magicSentenceFeedback = `YES! "${c.fullText}"`;
        this.sound.speakTeacher(c.fullText);
        this.renderScreen(5);

        setTimeout(() => {
          if (idx + 1 < challenges.length) {
            this.state.magicSentenceIndex = idx + 1;
            this.state.magicSentenceFeedback = null;
            this.renderScreen(5);
          } else {
            this.state.magicSentenceFeedback = null;
            this.nextScreen();
          }
        }, 1400);
      } else {
        this.sound.playGentleTryAgain();
        this.state.magicSentenceFeedback = "Try again! Remember, it happened yesterday!";
        this.sound.speakTeacher("Try again!");
        this.renderScreen(5);
      }
    }

    // =========================================================================
    // SCREEN 6: VERB HUNT
    // =========================================================================

    discoverHuntVerb(verbId) {
      if (this.state.foundHuntVerbs.includes(verbId)) return;
      this.state.foundHuntVerbs.push(verbId);
      this.sound.playSparkle();
      this.addXp(1);

      const item = this.data.screen6.items.find(i => i.id === verbId);
      if (item) {
        this.sound.speakTeacher(item.sentence);
      }

      if (this.state.foundHuntVerbs.length >= this.data.screen6.items.length) {
        this.sound.playBossVictory();
        this.addXp(2);
        this.sound.speakTeacher("Super! You found all 5 time verbs!");
      }
      this.renderScreen(6);
    }

    revealAllHuntVerbs() {
      this.data.screen6.items.forEach(i => {
        if (!this.state.foundHuntVerbs.includes(i.id)) {
          this.state.foundHuntVerbs.push(i.id);
        }
      });
      this.sound.playSparkle();
      this.addXp(1);
      this.renderScreen(6);
    }

    // =========================================================================
    // SCREEN 7: MAD HATTER'S LIE
    // =========================================================================

    checkHatterLie(statementId) {
      const s = this.data.screen7.statements.find(item => item.id === statementId);
      if (!s) return;

      if (s.isLie) {
        this.state.madHatterLieFound = true;
        this.sound.playLieBuzzer();
        this.sound.playBossVictory();
        this.addXp(2);
        this.sound.speakTeacher(s.feedback);
        this.renderScreen(7);
      } else {
        this.sound.playGentleTryAgain();
        this.sound.speakTeacher(`No, that really happened! "${s.text}"`);
        this.showToast("That's TRUE! Find the IMPOSSIBLE one!");
      }
    }

    // =========================================================================
    // SCREEN 8: MAKE YOUR OWN LIE
    // =========================================================================

    drawRandomLieCards() {
      const pool = [...this.data.screen8.cardsPool];
      // Shuffle & pick 3
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      this.state.ownLieDrawnCards = pool.slice(0, 3);
      this.sound.playClick();
      this.renderScreen(8);
    }

    voteLie(vote) {
      this.sound.playClick();
      if (vote === 'lie') {
        this.sound.playLieBuzzer();
        this.showToast("Class voted: 🤥 LIE!");
      } else {
        this.sound.playTransformationChime();
        this.showToast("Class voted: 🤔 TRUE!");
      }
    }

    // =========================================================================
    // SCREEN 9: ACT THE PAST (TPR)
    // =========================================================================

    nextTprAction() {
      const actions = this.data.screen9.actions;
      if (this.state.tprIndex + 1 < actions.length) {
        this.state.tprIndex++;
        this.sound.playClick();
        const next = actions[this.state.tprIndex];
        this.sound.speakTeacher(next.speech);
        this.renderScreen(9);
      } else {
        this.addXp(2);
        this.sound.playBossVictory();
        this.nextScreen();
      }
    }

    // =========================================================================
    // SCREEN 10: WHAT HAPPENED DETECTIVE
    // =========================================================================

    answerDetectiveClue(clueId, option) {
      const clue = this.data.screen10.clues.find(c => c.id === clueId);
      if (!clue) return;

      this.state.detectiveAnswers[clueId] = option;
      if (option === clue.correct) {
        this.sound.playTransformationChime();
        this.addXp(1);
        this.sound.speakTeacher(clue.feedback);
      } else {
        this.sound.playGentleTryAgain();
      }
      this.renderScreen(10);
    }

    // =========================================================================
    // SCREEN 11: BOSS BATTLE
    // =========================================================================

    answerBossRound(option) {
      const rounds = this.data.screen11.rounds;
      const idx = this.state.bossRoundIndex || 0;
      const r = rounds[idx];
      if (!r) return;

      if (option === r.correct) {
        this.state.bossRoundIndex++;
        this.sound.playBossDamage();
        this.addXp(1);

        if (this.state.bossRoundIndex >= rounds.length) {
          this.sound.playBossVictory();
          this.addXp(5);
          this.sound.speakTeacher("Time Monster defeated! You saved the time machine!");
        }
        this.renderScreen(11);
      } else {
        this.sound.playGentleTryAgain();
        this.showToast("The Monster shakes! Try another word!");
      }
    }

    // =========================================================================
    // TEACHER DRAWER & RUBRIC
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

      this.scenes.renderTeacherModal(content);
      modal.style.display = 'flex';
      this.sound.playClick();
    }

    closeTeacherDrawer() {
      const modal = document.getElementById('wonderland-teacher-modal');
      if (modal) modal.style.display = 'none';
    }

    toggleRubric(key) {
      this.state.rubric[key] = !this.state.rubric[key];
      try {
        localStorage.setItem('eaa-tm-rubric', JSON.stringify(this.state.rubric));
      } catch (e) {}
    }

    restartLesson() {
      this.currentScreen = 1;
      this.xp = 0;
      this.state = {
        difficultyLevel: 'A',
        clockSpinning: false,
        countdownActive: false,
        countdownNumber: 3,
        nowYesterdayIndex: 0,
        nowYesterdayFeedback: null,
        transformedVerbs: {},
        storyPlacedOrder: [],
        magicSentenceIndex: 0,
        magicSentenceFeedback: null,
        foundHuntVerbs: [],
        madHatterLieFound: false,
        ownLieDrawnCards: [],
        tprIndex: 0,
        detectiveAnswers: {},
        bossRoundIndex: 0,
        isCelebration: false,
        rubric: this.state.rubric
      };
      this.drawRandomLieCards();
      this.sound.playClick();
      this.renderScreen(1);
      this.showToast("Time machine reset to Screen 1!");
    }
  }

  root.timeMachineApp = new TimeMachineApp();

  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      window.timeMachineApp.init();
    });
  }

})(typeof window !== 'undefined' ? window : global);
