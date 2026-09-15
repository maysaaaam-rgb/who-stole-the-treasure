/**
 * YOUNG INVENTOR ACADEMY — APPLICATION CONTROLLER & STATE MACHINE
 * Grade 4 A1+ • Complete Interactive Game Engine
 */

(function(root) {
  'use strict';

  class YoungInventorApp {
    constructor() {
      this.sound = root.youngInventorAudio;
      this.data = root.YOUNG_INVENTOR_DATA;
      this.scenes = new root.YoungInventorScenes(this);

      this.currentMission = 0; // 0 = Home
      this.totalMissions = 10;
      this.xp = 0;
      this.maxXP = 100;

      this.state = {
        completedMissions: new Set(),
        mission1Index: 0,
        mission2Matched: [],
        selectedProblemId: null,
        chosenProblem: null,
        inventionName: "Super Bag 3000",
        equippedComponents: ["comp-wheels", "comp-screen", "comp-battery"],
        chosenVerbs: ["v-carry", "v-fly", "v-help"],
        chosenCant: null,
        isTestingActive: false,
        testResult: false,
        chosenUpgrade: null,
        isTimerRunning: false,
        timerSeconds: 300,
        timerInterval: null,
        drawingHistory: [],
        currentColor: "#38bdf8",
        isDrawing: false,
        rubric: {
          'rubric-idea': 3,
          'rubric-english': 3,
          'rubric-description': 3,
          'rubric-presentation': 3
        }
      };

      // Load saved rubric if available
      try {
        const saved = localStorage.getItem('eaa-yi-rubric');
        if (saved) this.state.rubric = JSON.parse(saved);
      } catch (e) {}
    }

    init() {
      this.bindKeyboardShortcuts();
      this.checkUrlParams();
      if (this.currentMission === 0) {
        this.renderHome();
      } else {
        this.goToMission(this.currentMission);
      }
      this.updateHud();
    }

    checkUrlParams() {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const m = parseInt(params.get('mission'), 10);
      if (m >= 1 && m <= 10) {
        this.currentMission = m;
      } else if (params.get('view') === 'map') {
        this.currentMission = -1; // map
      }
    }

    bindKeyboardShortcuts() {
      if (typeof window === 'undefined') return;
      window.addEventListener('keydown', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (e.key === 't' || e.key === 'T') {
          this.toggleTeacherDrawer();
        } else if (e.key === 'ArrowRight') {
          this.nextMission();
        } else if (e.key === 'ArrowLeft') {
          this.prevMission();
        } else if (e.key === 'Escape') {
          this.closeTeacherDrawer();
          this.closeAudienceCardModal();
        }
      });
    }

    // =========================================================================
    // NAVIGATION & HUD
    // =========================================================================

    renderHome() {
      this.currentMission = 0;
      this.updateHud();
      const container = document.getElementById('young-inventor-stage-content');
      if (container) {
        container.scrollTop = 0;
        this.scenes.renderHome(container);
      }
    }

    renderMissionMap() {
      this.currentMission = -1;
      this.updateHud();
      const container = document.getElementById('young-inventor-stage-content');
      if (container) {
        container.scrollTop = 0;
        this.scenes.renderMissionMap(container);
      }
    }

    startAdventure() {
      if (this.sound) this.sound.playClick();
      this.goToMission(1);
    }

    goToMission(num) {
      if (num < 1) num = 1;
      if (num > 10) {
        this.renderCelebration();
        return;
      }

      this.currentMission = num;
      this.updateHud();

      const container = document.getElementById('young-inventor-stage-content');
      if (!container) return;
      container.scrollTop = 0;

      switch (num) {
        case 1: this.scenes.renderMission1(container); break;
        case 2: this.scenes.renderMission2(container); break;
        case 3: this.scenes.renderMission3(container); break;
        case 4: this.scenes.renderMission4(container); break;
        case 5: this.scenes.renderMission5(container); break;
        case 6: this.scenes.renderMission6(container); break;
        case 7: this.scenes.renderMission7(container); break;
        case 8: this.scenes.renderMission8(container); break;
        case 9: this.scenes.renderMission9(container); break;
        case 10: this.scenes.renderMission10(container); break;
        default: this.scenes.renderHome(container); break;
      }
    }

    nextMission() {
      if (this.currentMission >= 1 && this.currentMission < 10) {
        if (this.sound) this.sound.playClick();
        this.goToMission(this.currentMission + 1);
      } else if (this.currentMission === 10) {
        this.renderCelebration();
      }
    }

    prevMission() {
      if (this.currentMission > 1) {
        if (this.sound) this.sound.playClick();
        this.goToMission(this.currentMission - 1);
      } else if (this.currentMission === 1) {
        this.renderHome();
      }
    }

    renderCelebration() {
      this.currentMission = 11;
      this.awardXP(20, 'Young Inventor Academy Master!');
      if (this.sound) {
        this.sound.playApplause();
      }
      this.updateHud();

      const container = document.getElementById('young-inventor-stage-content');
      if (container) {
        this.scenes.renderCelebration(container);
      }
    }

    awardXP(pts, reason = '') {
      if (this.state.completedMissions.has(this.currentMission) && this.currentMission !== 11) return;
      if (this.currentMission > 0) this.state.completedMissions.add(this.currentMission);

      this.xp = Math.min(this.maxXP, this.xp + pts);
      if (this.sound) {
        this.sound.playIdeaDing();
      }
      this.updateHud();
      this.showToast('+' + pts + ' XP! ' + (reason || 'Great job inventor! ⭐'));
    }

    updateHud() {
      const xpEl = document.getElementById('hud-xp-display');
      if (xpEl) xpEl.textContent = '⭐ ' + this.xp + ' / ' + this.maxXP + ' XP';

      const tracker = document.getElementById('hud-mission-indicator');
      if (tracker) {
        if (this.currentMission === 0) {
          tracker.textContent = '🚀 Academy Lab';
        } else if (this.currentMission === -1) {
          tracker.textContent = '🗺️ Mission Map';
        } else if (this.currentMission === 11) {
          tracker.textContent = '🏆 Expo Master!';
        } else {
          tracker.textContent = 'Mission ' + this.currentMission + ' of ' + this.totalMissions;
        }
      }

      const btnPrev = document.getElementById('btn-nav-prev');
      if (btnPrev) btnPrev.disabled = (this.currentMission === 0);
    }

    showToast(msg, duration = 2400) {
      const toast = document.getElementById('yi-toast');
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('visible');
      clearTimeout(toast._t);
      toast._t = setTimeout(() => {
        toast.classList.remove('visible');
      }, duration);
    }

    speak(text) {
      if (this.sound) this.sound.speak(text);
    }

    playApplause() {
      if (this.sound) this.sound.playApplause();
      this.showToast('👏👏 Enormous Classroom Expo Applause!');
    }

    // =========================================================================
    // MISSION 1 HANDLERS (Problem Detectives)
    // =========================================================================
    answerMission1(optIdx) {
      const qIdx = this.state.mission1Index;
      const scene = this.data.mission1.scenes[qIdx];
      if (!scene) return;

      const opt = scene.options[optIdx];
      if (opt && opt.correct) {
        if (this.sound) this.sound.playCorrect();
        this.showToast('Correct! Problem found: "' + opt.text + '" ⭐');

        setTimeout(() => {
          if (this.currentMission !== 1) return;
          if (this.state.mission1Index < this.data.mission1.scenes.length - 1) {
            this.state.mission1Index++;
            const container = document.getElementById('young-inventor-stage-content');
            if (container && this.currentMission === 1) this.scenes.renderMission1(container);
          } else {
            this.awardXP(10, 'Mission 1 Complete: Problem Detective!');
            setTimeout(() => {
              if (this.currentMission === 1) this.goToMission(2);
            }, 1000);
          }
        }, 1000);
      } else {
        if (this.sound) this.sound.playWrong();
        this.showToast('Oops! Look at what needs to be fixed!');
      }
    }

    // =========================================================================
    // MISSION 2 HANDLERS (Idea Lab Matching)
    // =========================================================================
    selectProblemMatch(id) {
      this.state.selectedProblemId = id;
      if (this.sound) this.sound.playClick();
      const container = document.getElementById('young-inventor-stage-content');
      if (container) this.scenes.renderMission2(container);
      this.showToast('Selected problem. Now choose the matching solution!');
    }

    selectSolutionMatch(id) {
      if (!this.state.selectedProblemId) {
        this.showToast('Select a problem on the left first!');
        return;
      }

      if (this.state.selectedProblemId === id) {
        // Correct match!
        if (!this.state.mission2Matched.includes(id)) {
          this.state.mission2Matched.push(id);
        }
        this.state.selectedProblemId = null;
        if (this.sound) this.sound.playCorrect();
        this.showToast('Brilliant match! Solution connected! 💡');

        if (this.state.mission2Matched.length === this.data.mission2.matchingPairs.length) {
          this.awardXP(10, 'Mission 2 Complete: Idea Lab Master!');
        }
        const container = document.getElementById('young-inventor-stage-content');
        if (container) this.scenes.renderMission2(container);
      } else {
        if (this.sound) this.sound.playWrong();
        this.showToast('Not quite! Think what fixes that specific problem!');
      }
    }

    // =========================================================================
    // MISSION 4 CANVAS & DESIGN HANDLERS
    // =========================================================================
    selectProblemPreset(id) {
      const p = this.data.mission4.problemPresets.find(item => item.id === id);
      if (p) {
        this.state.chosenProblem = p;
        this.state.inventionName = p.defaultInvention;
        if (this.sound) this.sound.playClick();
        const container = document.getElementById('young-inventor-stage-content');
        if (container) this.scenes.renderMission4(container);
      }
    }

    setInventionName(name) {
      this.state.inventionName = name;
    }

    initDrawingCanvas() {
      const canvas = document.getElementById('blueprint-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      let drawing = false;

      const startDraw = (e) => {
        drawing = true;
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
      };

      const drawMove = (e) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        ctx.strokeStyle = this.state.currentColor;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
      };

      const stopDraw = () => {
        if (drawing) {
          drawing = false;
          this.awardXP(10, 'Mission 4 Complete: Blueprint Created! 🎨');
        }
      };

      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', drawMove);
      window.addEventListener('mouseup', stopDraw);

      canvas.addEventListener('touchstart', startDraw, { passive: true });
      canvas.addEventListener('touchmove', drawMove, { passive: true });
      window.addEventListener('touchend', stopDraw);
    }

    setCanvasColor(color, el) {
      this.state.currentColor = color;
      const swatches = document.querySelectorAll('.color-swatch');
      swatches.forEach(s => s.classList.remove('active'));
      if (el) el.classList.add('active');
    }

    clearCanvas() {
      const canvas = document.getElementById('blueprint-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (this.sound) this.sound.playClick();
      this.showToast('Canvas cleared! 🗑️');
    }

    undoCanvas() {
      this.clearCanvas();
    }

    // =========================================================================
    // MISSION 5 BUILDER HANDLERS
    // =========================================================================
    toggleComponent(id) {
      const eq = this.state.equippedComponents;
      const idx = eq.indexOf(id);
      if (idx > -1) {
        eq.splice(idx, 1);
        if (this.sound) this.sound.playClick();
      } else {
        eq.push(id);
        if (this.sound) this.sound.playComponentSnap();
      }

      if (eq.length >= 2) {
        this.awardXP(10, 'Mission 5 Complete: Prototype Constructed! ⚙️');
      }

      const container = document.getElementById('young-inventor-stage-content');
      if (container) this.scenes.renderMission5(container);
    }

    // =========================================================================
    // MISSION 6 VERB HANDLERS (CAN / CAN'T)
    // =========================================================================
    toggleVerb(id) {
      const chosen = this.state.chosenVerbs;
      const idx = chosen.indexOf(id);
      if (idx > -1) {
        chosen.splice(idx, 1);
        if (this.sound) this.sound.playClick();
      } else {
        if (chosen.length < 3) {
          chosen.push(id);
          if (this.sound) this.sound.playIdeaDing();
        } else {
          this.showToast('Max 3 abilities! Tap one to remove first.');
          return;
        }
      }

      if (chosen.length >= 2) {
        this.awardXP(10, 'Mission 6 Complete: Abilities Defined! 🚀');
      }

      const container = document.getElementById('young-inventor-stage-content');
      if (container) this.scenes.renderMission6(container);
    }

    readAbilities() {
      const chosen = this.state.chosenVerbs;
      if (chosen.length === 0) return;
      const text = chosen.map(vId => {
        const v = this.data.mission6.actionVerbs.find(item => item.id === vId);
        return v ? v.sentence : '';
      }).join(' ');

      if (this.sound) this.sound.speak(text, 0.88);
      this.showToast('Reading abilities aloud... 🔊');
    }

    // =========================================================================
    // MISSION 8 TEST LAB HANDLERS
    // =========================================================================
    runStressTest() {
      this.state.isTestingActive = true;
      this.state.testResult = false;
      if (this.sound) this.sound.playMachineHum();

      const container = document.getElementById('young-inventor-stage-content');
      if (container) this.scenes.renderMission8(container);

      setTimeout(() => {
        if (this.currentMission !== 8) return;
        this.state.isTestingActive = false;
        this.state.testResult = true;
        if (this.sound) this.sound.playCorrect();
        this.awardXP(10, 'Mission 8 Complete: Stress Test Passed! 🧪');
        if (container && this.currentMission === 8) this.scenes.renderMission8(container);
      }, 1600);
    }

    // =========================================================================
    // MISSION 9 UPGRADE HANDLERS
    // =========================================================================
    selectUpgrade(id) {
      const up = this.data.mission9.upgrades.find(item => item.id === id);
      if (up) {
        this.state.chosenUpgrade = up;
        if (this.sound) this.sound.playGearClick();
        this.awardXP(10, 'Mission 9 Complete: Invention Upgraded! 🔧');
        const container = document.getElementById('young-inventor-stage-content');
        if (container) this.scenes.renderMission9(container);
      }
    }

    // =========================================================================
    // MISSION 10 EXPO TIMER & AUDIENCE MODAL
    // =========================================================================
    toggleTimer() {
      if (this.state.isTimerRunning) {
        clearInterval(this.state.timerInterval);
        this.state.isTimerRunning = false;
      } else {
        this.state.isTimerRunning = true;
        this.state.timerInterval = setInterval(() => {
          if (this.state.timerSeconds > 0) {
            this.state.timerSeconds--;
            const timerEl = document.getElementById('expo-timer-display');
            if (timerEl) {
              const minutes = Math.floor(this.state.timerSeconds / 60);
              const seconds = this.state.timerSeconds % 60;
              timerEl.textContent = '⏱️ ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            }
          } else {
            clearInterval(this.state.timerInterval);
            this.state.isTimerRunning = false;
            this.playApplause();
          }
        }, 1000);
      }
      const container = document.getElementById('young-inventor-stage-content');
      if (container) this.scenes.renderMission10(container);
    }

    resetTimer() {
      clearInterval(this.state.timerInterval);
      this.state.isTimerRunning = false;
      this.state.timerSeconds = 300;
      const container = document.getElementById('young-inventor-stage-content');
      if (container) this.scenes.renderMission10(container);
    }

    openAudienceCardModal() {
      const modal = document.getElementById('audience-card-modal');
      if (modal) modal.style.display = 'flex';
    }

    closeAudienceCardModal() {
      const modal = document.getElementById('audience-card-modal');
      if (modal) modal.style.display = 'none';
    }

    // =========================================================================
    // TEACHER DRAWER & RUBRIC
    // =========================================================================
    openTeacherDrawer() {
      const modal = document.getElementById('young-inventor-teacher-modal');
      const body = document.getElementById('teacher-modal-body');
      if (modal && body) {
        this.scenes.renderTeacherModal(body);
        modal.style.display = 'flex';
      }
    }

    closeTeacherDrawer() {
      const modal = document.getElementById('young-inventor-teacher-modal');
      if (modal) modal.style.display = 'none';
    }

    toggleTeacherDrawer() {
      const modal = document.getElementById('young-inventor-teacher-modal');
      if (!modal) return;
      if (modal.style.display === 'none' || !modal.style.display) {
        this.openTeacherDrawer();
      } else {
        this.closeTeacherDrawer();
      }
    }

    setRubricScore(id, score) {
      this.state.rubric[id] = score;
      try {
        localStorage.setItem('eaa-yi-rubric', JSON.stringify(this.state.rubric));
      } catch (e) {}
      const body = document.getElementById('teacher-modal-body');
      if (body) this.scenes.renderTeacherModal(body);
    }

    restartLesson() {
      this.currentMission = 0;
      this.state.completedMissions = new Set();
      this.state.mission1Index = 0;
      this.state.mission2Matched = [];
      this.state.selectedProblemId = null;
      this.state.testResult = false;
      this.renderHome();
      this.showToast('Young Inventor Academy restarted! 🚀');
    }
  }

  // Instantiate & Boot
  root.YoungInventorApp = YoungInventorApp;

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      root.youngInventorApp = new YoungInventorApp();
      root.youngInventorApp.init();
    });
  }

})(typeof window !== 'undefined' ? window : global);
