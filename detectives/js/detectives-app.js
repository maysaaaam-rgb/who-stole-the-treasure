/**
 * THE MYSTERY OF YESTERDAY — CONTROLLER & STATE MACHINE
 * Version 2.0 (35-Minute Interactive ESL Detective Adventure)
 */

(function(root) {
  'use strict';

  class DetectivesApp {
    constructor() {
      this.sound = root.detectivesSound;
      this.data = root.DETECTIVES_DATA;
      this.scenes = new root.DetectivesScenes(this);

      // Core Game State
      this.currentStage = 1;
      this.totalStages = 6;
      this.xp = 0;
      this.streak = 0;
      this.teamA = 0;
      this.teamB = 0;

      // Sub-activity States
      this.state = {
        level1Shaking: false,
        level1NoteOpen: false,
        level1Vote: null,

        level2Index: 0,
        level2Answers: {},

        level3Round: 0,
        level3ChosenCard: null,
        level3Revealed: false,

        level4MonsterEmotion: 'happy',
        level4Speech: null,
        level4Asked: {},

        studentSlots: [null, null, null],
        studentLieSlot: null,

        finalC1Solved: false,
        finalC2Solved: false,
        mysterySolved: false
      };

      this.stageTitles = [
        '1. 📦 The Mystery Begins (5m)',
        '2. 🏃 Run to the Answer (5m)',
        '3. 🕵️ Two Truths & One Lie (8m)',
        '4. 🧟 Crazy Suspect: Monster (7m)',
        '5. 🗣️ Students Are Suspects (6m)',
        '6. 🏆 Final Detective Challenge (4m)'
      ];
    }

    init() {
      this.bindKeyboardShortcuts();
      this.renderStage(1);
    }

    bindKeyboardShortcuts() {
      if (typeof window === 'undefined') return;
      window.addEventListener('keydown', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (e.key === 't' || e.key === 'T') {
          this.openTeacherModal();
        } else if (e.key === 'ArrowRight') {
          this.nextStage();
        } else if (e.key === 'ArrowLeft') {
          this.prevStage();
        } else if (e.key === '1') {
          if (this.currentStage === 3) this.selectLevel3Card(0);
        } else if (e.key === '2') {
          if (this.currentStage === 3) this.selectLevel3Card(1);
        } else if (e.key === '3') {
          if (this.currentStage === 3) this.selectLevel3Card(2);
        }
      });
    }

    // --- Navigation & Rendering ---

    renderStage(stageNum) {
      if (stageNum < 1) stageNum = 1;
      if (stageNum > this.totalStages) stageNum = this.totalStages;
      this.currentStage = stageNum;

      this.updateHud();

      const mount = document.getElementById('detectives-stage-content');
      if (!mount) return;

      mount.scrollTop = 0;

      switch (this.currentStage) {
        case 1:
          this.scenes.renderLevel1(mount);
          break;
        case 2:
          this.scenes.renderLevel2(mount);
          break;
        case 3:
          this.scenes.renderLevel3(mount);
          break;
        case 4:
          this.scenes.renderLevel4(mount);
          break;
        case 5:
          this.scenes.renderLevel5(mount);
          break;
        case 6:
          this.scenes.renderLevel6(mount);
          break;
        default:
          this.scenes.renderLevel1(mount);
      }
    }

    prevStage() {
      if (this.currentStage > 1) {
        this.renderStage(this.currentStage - 1);
      }
    }

    nextStage() {
      if (this.currentStage < this.totalStages) {
        this.renderStage(this.currentStage + 1);
      }
    }

    updateHud() {
      const nameEl = document.getElementById('hud-stage-name');
      if (nameEl) {
        nameEl.textContent = this.stageTitles[this.currentStage - 1] || `Stage ${this.currentStage}`;
      }

      const xpEl = document.getElementById('hud-xp-pts');
      if (xpEl) xpEl.textContent = this.xp + ' XP';

      const teamAEl = document.getElementById('score-teamA');
      if (teamAEl) teamAEl.textContent = this.teamA;

      const teamBEl = document.getElementById('score-teamB');
      if (teamBEl) teamBEl.textContent = this.teamB;

      const streakEl = document.getElementById('hud-streak-pill');
      if (streakEl) {
        if (this.streak >= 2) {
          streakEl.style.display = 'inline-flex';
          streakEl.textContent = `🔥 ${this.streak} Streak!`;
        } else {
          streakEl.style.display = 'none';
        }
      }
    }

    addXp(amount) {
      this.xp += amount;
      this.updateHud();
      this.showToast(`+${amount} Detective XP!`);
    }

    incrementStreak() {
      this.streak++;
      this.updateHud();
    }

    resetStreak() {
      this.streak = 0;
      this.updateHud();
    }

    addScore(team, delta) {
      if (team === 'teamA') {
        this.teamA = Math.max(0, this.teamA + delta);
      } else if (team === 'teamB') {
        this.teamB = Math.max(0, this.teamB + delta);
      }
      this.sound.playClick();
      this.updateHud();
    }

    resetScores() {
      this.teamA = 0;
      this.teamB = 0;
      this.updateHud();
      this.showToast('Team scores reset to 0');
    }

    showToast(msg) {
      const toast = document.getElementById('detectives-toast');
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('is-active');
      clearTimeout(this._toastTimeout);
      this._toastTimeout = setTimeout(() => {
        toast.classList.remove('is-active');
      }, 2600);
    }

    // =========================================================================
    // LEVEL 1 ACTIONS
    // =========================================================================

    shakeAndOpenBox() {
      if (this.state.level1Shaking || this.state.level1NoteOpen) return;
      this.state.level1Shaking = true;
      this.sound.playBoxRumble();
      this.renderStage(1);

      setTimeout(() => {
        this.state.level1Shaking = false;
        this.state.level1NoteOpen = true;
        this.sound.playUnlockFanfare();
        this.addXp(15);
        this.renderStage(1);
        this.sound.speakTeacher("Look! There is a note inside the mysterious box!");
      }, 700);
    }

    handleLevel1Vote(choice) {
      this.state.level1Vote = choice;
      if (choice === 'no') {
        this.sound.playCorrectChime();
        this.addXp(20);
        this.sound.speakTeacher("Spot on, Detective! Dinosaurs are extinct! That was the LIE!");
      } else {
        this.sound.playWrongBuzzer();
        this.sound.speakTeacher("Wait a second! Dinosaurs lived millions of years ago! It was a LIE!");
      }
      this.renderStage(1);
    }

    // =========================================================================
    // LEVEL 2 ACTIONS (RUN TO THE ANSWER)
    // =========================================================================

    handleLevel2Answer(choiceIndex) {
      const qIndex = this.state.level2Index || 0;
      const currentQ = this.data.LEVEL2_DATA.questions[qIndex];
      if (!currentQ || this.state.level2Answers[qIndex]) return;

      const isCorrect = choiceIndex === currentQ.correctIndex;
      this.state.level2Answers[qIndex] = {
        chosenIndex: choiceIndex,
        selectedVerb: currentQ.options[choiceIndex],
        isCorrect
      };

      if (isCorrect) {
        this.sound.playCorrectChime();
        this.addXp(20);
        this.incrementStreak();
        this.sound.speakTeacher(currentQ.speech);
      } else {
        this.sound.playWrongBuzzer();
        this.resetStreak();
        this.sound.speakTeacher(currentQ.explanation);
      }
      this.renderStage(2);
    }

    nextLevel2Question() {
      this.state.level2Index = (this.state.level2Index || 0) + 1;
      this.sound.playFootstep();
      this.renderStage(2);
    }

    resetLevel2() {
      this.state.level2Index = 0;
      this.state.level2Answers = {};
      this.renderStage(2);
    }

    // =========================================================================
    // LEVEL 3 ACTIONS (TWO TRUTHS & ONE LIE)
    // =========================================================================

    selectLevel3Card(cardIndex) {
      this.state.level3ChosenCard = cardIndex;
      this.sound.playClick();
      const round = this.data.LEVEL3_DATA.rounds[this.state.level3Round || 0];
      if (round && round.cards[cardIndex]) {
        this.sound.speakTeacher(round.cards[cardIndex].text);
      }
      this.renderStage(3);
    }

    revealLevel3Lie() {
      if (this.state.level3Revealed) return;
      this.state.level3Revealed = true;
      this.sound.playSuspenseDrum();

      setTimeout(() => {
        this.sound.playStampThud();
        const round = this.data.LEVEL3_DATA.rounds[this.state.level3Round || 0];
        const isUserCorrect = this.state.level3ChosenCard === round.lieIndex;
        if (isUserCorrect) {
          this.addXp(25);
          this.incrementStreak();
        }
        this.renderStage(3);
        this.sound.speakTeacher(round.explanation);
      }, 500);
    }

    nextLevel3Round() {
      this.state.level3Round = (this.state.level3Round || 0) + 1;
      this.state.level3ChosenCard = null;
      this.state.level3Revealed = false;
      this.sound.playFootstep();
      this.renderStage(3);
    }

    // =========================================================================
    // LEVEL 4 ACTIONS (CRAZY MONSTER INTERROGATION)
    // =========================================================================

    askMonsterQuestion(qId) {
      const q = this.data.LEVEL4_DATA.interrogationQuestions.find(item => item.id === qId);
      if (!q) return;

      this.state.level4Asked[qId] = true;
      this.state.level4MonsterEmotion = q.monsterEmotion;
      this.state.level4Speech = q.responseSpeech;

      if (q.isLieQuestion) {
        this.sound.playStampThud();
        this.addXp(30);
      } else {
        this.sound.playCorrectChime();
        this.addXp(15);
      }

      this.renderStage(4);
      this.sound.speakMonster(q.responseSpeech);
    }

    // =========================================================================
    // LEVEL 5 ACTIONS (STUDENTS BECOME SUSPECTS)
    // =========================================================================

    addSentenceFromAction(actionId) {
      const act = this.data.LEVEL5_DATA.actionPalette.find(a => a.id === actionId);
      if (!act) return;

      // Find first empty slot, or replace slot 0
      let emptyIdx = this.state.studentSlots.findIndex(s => s === null);
      if (emptyIdx === -1) emptyIdx = 0;

      // Randomly pick one option for variety
      const randomDetail = act.options[Math.floor(Math.random() * act.options.length)];
      const sentence = `Yesterday I ${act.past} ${randomDetail}.`;

      this.state.studentSlots[emptyIdx] = sentence;
      this.sound.playClick();
      this.renderStage(5);
      this.sound.speakTeacher(sentence);
    }

    toggleLieSlot(slotIndex) {
      this.state.studentLieSlot = this.state.studentLieSlot === slotIndex ? null : slotIndex;
      this.sound.playClick();
      this.renderStage(5);
    }

    loadStudentDemo(demoIndex) {
      const demo = this.data.LEVEL5_DATA.presetChallenges[demoIndex];
      if (!demo) return;
      this.state.studentSlots = [demo.s1, demo.s2, demo.s3];
      this.state.studentLieSlot = demo.lieSlot;
      this.sound.playUnlockFanfare();
      this.showToast(`Loaded ${demo.author}'s Challenge!`);
      this.renderStage(5);
    }

    clearStudentSlots() {
      this.state.studentSlots = [null, null, null];
      this.state.studentLieSlot = null;
      this.sound.playClick();
      this.renderStage(5);
    }

    // =========================================================================
    // LEVEL 6 ACTIONS (FINAL DETECTIVE CHALLENGE)
    // =========================================================================

    handleFinalC1(choiceIndex) {
      const correct = choiceIndex === this.data.LEVEL6_DATA.challenge1.correctIndex;
      if (correct) {
        this.state.finalC1Solved = true;
        this.sound.playCorrectChime();
        this.addXp(30);
        this.sound.speakTeacher("Spot on! Dragons are not real!");
      } else {
        this.sound.playWrongBuzzer();
        this.sound.speakTeacher("Check again! Look for the mythical creature!");
      }
      this.renderStage(6);
    }

    handleFinalC2(choiceIndex) {
      const correct = choiceIndex === this.data.LEVEL6_DATA.challenge2.correctIndex;
      if (correct) {
        this.state.finalC2Solved = true;
        this.state.mysterySolved = true;
        this.sound.playUnlockFanfare();
        this.addXp(100);
        this.sound.speakTeacher("Mystery Solved! No, she didn't! You are now a Master Detective!");
      } else {
        this.sound.playWrongBuzzer();
        this.sound.speakTeacher("Remember the short answer: No, she didn't!");
      }
      this.renderStage(6);
    }

    restartGame() {
      this.currentStage = 1;
      this.xp = 0;
      this.streak = 0;
      this.state = {
        level1Shaking: false,
        level1NoteOpen: false,
        level1Vote: null,
        level2Index: 0,
        level2Answers: {},
        level3Round: 0,
        level3ChosenCard: null,
        level3Revealed: false,
        level4MonsterEmotion: 'happy',
        level4Speech: null,
        level4Asked: {},
        studentSlots: [null, null, null],
        studentLieSlot: null,
        finalC1Solved: false,
        finalC2Solved: false,
        mysterySolved: false
      };
      this.sound.playClick();
      this.renderStage(1);
      this.showToast('Game restarted at Level 1');
    }

    // =========================================================================
    // TEACHER HUD MODAL
    // =========================================================================

    openTeacherModal() {
      const modal = document.getElementById('detectives-modal');
      const content = document.getElementById('modal-content-area');
      if (!modal || !content) return;

      const guide = this.data.TEACHER_HUD_GUIDES[this.currentStage] || this.data.TEACHER_HUD_GUIDES[1];

      content.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
          <h3 style="font-size:1.4rem; color:#f59e0b; font-weight:900;">
            🧑‍🏫 Teacher Guide · Level ${this.currentStage}
          </h3>
          <span class="stage-tracker-pill">${guide.timing}</span>
        </div>

        <div style="display:flex; gap:8px; margin-bottom:18px; flex-wrap:wrap;">
          ${[1, 2, 3, 4, 5, 6].map(lvl => `
            <button type="button" class="hud-btn ${lvl === this.currentStage ? 'primary' : ''}" onclick="window.detectivesApp.renderStage(${lvl}); window.detectivesApp.openTeacherModal();">
              L${lvl}
            </button>
          `).join('')}
        </div>

        <div class="hud-guide-grid">
          <div class="hud-guide-card">
            <h4>🎯 Pedagogical Objective</h4>
            <p>${guide.objective}</p>
          </div>

          <div class="hud-guide-card">
            <h4>🗣️ Teacher Spoken Script</h4>
            <p style="font-style:italic; color:#fef08a;">${guide.teacherScript}</p>
          </div>

          <div class="hud-guide-card">
            <h4>🏃 Student Physical Action</h4>
            <p>${guide.physicalAction}</p>
          </div>

          <div class="hud-guide-card">
            <h4>💡 Grammar & Form Focus</h4>
            <p>${guide.formFocus}</p>
          </div>

          <div class="hud-guide-card">
            <h4>⚠️ Common Errors & Remediation</h4>
            <p>${guide.commonErrors}</p>
          </div>

          <div class="hud-guide-card">
            <h4>📱 Smart Board Interaction Tip</h4>
            <p>${guide.smartBoardTip}</p>
          </div>
        </div>

        <div style="margin-top:20px; text-align:right;">
          <button type="button" class="box-action-prompt" style="padding:8px 20px; font-size:0.95rem; display:inline-flex;" onclick="window.detectivesApp.closeModal()">
            Close Guide (ESC)
          </button>
        </div>
      `;

      modal.style.display = 'flex';
      this.sound.playClick();
    }

    closeModal() {
      const modal = document.getElementById('detectives-modal');
      if (modal) modal.style.display = 'none';
    }
  }

  root.detectivesApp = new DetectivesApp();

  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      window.detectivesApp.init();
    });
  }

})(typeof window !== 'undefined' ? window : global);
