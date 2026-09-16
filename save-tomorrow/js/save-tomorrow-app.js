/**
 * THE INVENTION THAT MUST SAVE TOMORROW — CENTRAL APPLICATION CONTROLLER
 * Full State Machine, Canvas Touch Engine, Audio Routing & 15-Phase Logic
 */

(function(root) {
  'use strict';

  class SaveTomorrowApp {
    constructor() {
      this.currentPhase = 1;
      this.currentStage = 1;
      this.xp = 0;
      this.data = root.SAVE_TOMORROW_DATA;
      this.audio = new root.SaveTomorrowAudio();
      this.scenes = new root.SaveTomorrowScenes(this);

      this.state = {
        completedPhases: new Set(),
        activeConduits: 1,
        mixerSelected: [],
        problemPreset: 'prob-bag',
        inventionName: 'Aero-Roller 2045',
        currentColor: '#06b6d4',
        drawingPaths: [],
        isDrawing: false,
        isStressTesting: false,
        testFailed: false,
        chosenImprovement: 'Make it STRONGER 💪',
        retryCount: 0,
        thinkSecondsRemaining: 0,
        thinkTimerInterval: null,
        presentationSeconds: 30,
        presentationTimerInterval: null,
        isPresentationRunning: false
      };
    }

    init() {
      this.bindKeyboardShortcuts();
      this.bindHudButtons();
      this.renderProgressConduit();
      this.goToPhase(1);
    }

    bindHudButtons() {
      const prevBtn = document.getElementById('btn-nav-prev');
      if (prevBtn) prevBtn.addEventListener('click', () => this.prevPhase());

      const nextBtn = document.getElementById('btn-nav-next');
      if (nextBtn) nextBtn.addEventListener('click', () => this.nextPhase());

      const soundBtn = document.getElementById('stm-btn-sound');
      if (soundBtn) {
        soundBtn.addEventListener('click', () => {
          if (this.audio) {
            const enabled = this.audio.toggleSfx();
            const icon = document.getElementById('stm-sound-icon');
            if (icon) icon.textContent = enabled ? '🔊' : '🔇';
            this.showToast(enabled ? 'Sound Enabled 🔊' : 'Sound Muted 🔇');
          }
        });
      }

      const speechBtn = document.getElementById('stm-btn-speech');
      if (speechBtn) {
        speechBtn.addEventListener('click', () => {
          if (this.audio) {
            const enabled = this.audio.toggleVoice();
            const icon = document.getElementById('stm-speech-icon');
            if (icon) icon.textContent = enabled ? '🎙️' : '🔇';
            this.showToast(enabled ? 'Voice Narration Active 🎙️' : 'Voice Narration Off 🔇');
          }
        });
      }

      const teacherBtn = document.getElementById('stm-btn-teacher');
      if (teacherBtn) teacherBtn.addEventListener('click', () => this.toggleTeacherDrawer());

      const closeDrawerBtn = document.getElementById('stm-btn-close-drawer');
      if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => this.closeTeacherDrawer());

      const backdrop = document.getElementById('stm-drawer-backdrop');
      if (backdrop) backdrop.addEventListener('click', () => this.closeTeacherDrawer());
    }

    bindKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 't' || e.key === 'T') {
          this.toggleTeacherDrawer();
        } else if (e.key === 'ArrowRight') {
          this.nextPhase();
        } else if (e.key === 'ArrowLeft') {
          this.prevPhase();
        }
      });
    }

    // =========================================================================
    // HUD & CONDUIT TRACK
    // =========================================================================
    renderProgressConduit() {
      const container = document.getElementById('stm-progress-conduit');
      if (!container) return;

      container.innerHTML = this.data.stages.map((stage, idx) => {
        const stageNum = idx + 1;
        const isActive = (stageNum === this.currentStage);
        const isCompleted = (stageNum < this.currentStage || this.currentPhase >= 14);
        return `
          <div class="conduit-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
               title="${stage.name}: ${stage.desc}"
               onclick="window.saveTomorrowApp.goToPhase(${stage.phase})">
            ${stage.icon}
          </div>
        `;
      }).join('');
    }

    updateHud() {
      const phasePill = document.getElementById('hud-phase-indicator');
      if (phasePill) {
        phasePill.textContent = `Phase ${this.currentPhase} of 15`;
      }

      const xpDisplay = document.getElementById('hud-xp-display');
      if (xpDisplay) {
        xpDisplay.textContent = `⭐ ${this.xp} / 100 XP`;
      }

      // Energy core meter
      const pct = Math.min(100, Math.round((this.currentStage / 10) * 100));
      const pctEl = document.getElementById('stm-energy-pct');
      if (pctEl) pctEl.textContent = `${pct}%`;
      const fillEl = document.getElementById('stm-energy-bar-fill');
      if (fillEl) fillEl.style.width = `${pct}%`;

      const prevBtn = document.getElementById('btn-nav-prev');
      const nextBtn = document.getElementById('btn-nav-next');
      if (prevBtn) prevBtn.disabled = (this.currentPhase <= 1);
      if (nextBtn) nextBtn.disabled = (this.currentPhase >= 15);

      this.renderProgressConduit();
    }

    awardXP(amount, reason = '') {
      this.xp = Math.min(100, this.xp + amount);
      this.updateHud();
      if (this.audio) this.audio.playCorrect();
      if (reason) this.showToast(`+${amount} XP! ${reason}`);
    }

    showToast(message) {
      const toast = document.getElementById('stm-toast');
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }

    // =========================================================================
    // PHASE NAVIGATION & ROUTING
    // =========================================================================
    goToPhase(phaseNum) {
      if (phaseNum < 1) phaseNum = 1;
      if (phaseNum > 15) phaseNum = 15;

      this.currentPhase = phaseNum;

      // Map phase to 10-node progress conduits
      if (phaseNum <= 2) this.currentStage = 1;
      else if (phaseNum === 3) this.currentStage = 2;
      else if (phaseNum <= 5) this.currentStage = 3;
      else if (phaseNum === 6) this.currentStage = 4;
      else if (phaseNum <= 8) this.currentStage = 5;
      else if (phaseNum === 9) this.currentStage = 6;
      else if (phaseNum === 10) this.currentStage = 8;
      else if (phaseNum === 11) this.currentStage = 9;
      else this.currentStage = 10;

      this.state.completedPhases.add(phaseNum);
      this.updateHud();

      const container = document.getElementById('stm-stage-content');
      if (!container) return;
      container.scrollTop = 0;

      switch (phaseNum) {
        case 1: this.scenes.renderPhase1(container); break;
        case 2: this.scenes.renderPhase2(container); break;
        case 3: this.scenes.renderPhase3(container); break;
        case 4: this.scenes.renderPhase4(container); break;
        case 5: this.scenes.renderPhase5(container); break;
        case 6: this.scenes.renderPhase6(container); break;
        case 7: this.scenes.renderPhase7(container); break;
        case 8: this.scenes.renderPhase8(container); break;
        case 9: this.scenes.renderPhase9(container); break;
        case 10: this.scenes.renderPhase10(container); break;
        case 11: this.scenes.renderPhase11(container); break;
        case 12: this.scenes.renderPhase12(container); break;
        case 13: this.scenes.renderPhase13(container); break;
        case 14: this.scenes.renderPhase14(container); break;
        case 15: this.scenes.renderPhase15(container); break;
        default: this.scenes.renderPhase1(container); break;
      }
    }

    nextPhase() {
      if (this.currentPhase < 15) {
        if (this.audio) this.audio.playClick();
        this.goToPhase(this.currentPhase + 1);
      }
    }

    prevPhase() {
      if (this.currentPhase > 1) {
        if (this.audio) this.audio.playClick();
        this.goToPhase(this.currentPhase - 1);
      }
    }

    // =========================================================================
    // PHASE SPECIFIC ACTIONS
    // =========================================================================
    selectPhase1Answer(id) {
      if (id === 'opt-b') {
        this.awardXP(10, 'Phase 1 Complete: Future Inventor Recruited! 🛠️');
      } else {
        if (this.audio) this.audio.playTryAgain();
        this.showToast('Remember: Inventors solve problems and never give up!');
      }
    }

    checkProblemYesNo(isProblem) {
      if (isProblem) {
        this.awardXP(10, 'Correct! Falling and breaking pencils is a problem! 👍');
      } else {
        if (this.audio) this.audio.playTryAgain();
        this.showToast('Think: Does a broken pencil make writing difficult? Yes!');
      }
    }

    selectNotebookIdea(id, isCorrect) {
      if (isCorrect) {
        this.awardXP(10, 'Idea saved to Digital Notebook! 📓💡');
      } else {
        if (this.audio) this.audio.playTryAgain();
        this.showToast('Look closer! Can a regular stone solve wet school shoes?');
      }
    }

    completeSentenceWord(slotId, word) {
      const slot = document.getElementById(slotId);
      if (slot) {
        slot.textContent = word;
        slot.style.color = '#38bdf8';
        slot.style.fontWeight = 'bold';
        this.awardXP(5, `Added "${word}" to sentence!`);
      }
    }

    selectBiomimicryCard(animalId) {
      const card = document.getElementById(`bio-card-${animalId}`);
      if (card) {
        card.classList.toggle('selected');
        this.awardXP(5, 'Biomimicry secret unlocked! 🦎');
      }
    }

    solveAnimalChallenge(id, isCorrect) {
      if (isCorrect) {
        this.awardXP(10, 'Superpower matched to invention! 🦅💡');
      } else {
        if (this.audio) this.audio.playTryAgain();
        this.showToast('Think about how birds fly and animals climb!');
      }
    }

    toggleMixerItem(itemId) {
      const idx = this.state.mixerSelected.indexOf(itemId);
      if (idx > -1) {
        this.state.mixerSelected.splice(idx, 1);
      } else {
        if (this.state.mixerSelected.length >= 2) {
          this.state.mixerSelected.shift();
        }
        this.state.mixerSelected.push(itemId);
      }

      document.querySelectorAll('.mixer-item-card').forEach(c => {
        const id = c.getAttribute('data-id');
        if (this.state.mixerSelected.includes(id)) {
          c.classList.add('selected');
        } else {
          c.classList.remove('selected');
        }
      });

      if (this.audio) this.audio.playClick();
    }

    spinIdeaMixer() {
      if (this.state.mixerSelected.length < 2) {
        this.showToast('Select 2 items first to mix!');
        return;
      }

      const pot = document.getElementById('mixer-pot');
      if (pot) pot.classList.add('mixing');

      if (this.audio) this.audio.playMixerVortex();

      const expectedPhase = this.currentPhase;
      setTimeout(() => {
        if (this.currentPhase !== expectedPhase) return;
        if (pot) pot.classList.remove('mixing');
        this.awardXP(15, 'Created a brand-new hybrid invention! 🌪️⚡');
        const res = document.getElementById('mixer-result');
        if (res) {
          res.style.display = 'block';
          res.innerHTML = `
            <div style="background:rgba(6,182,212,0.15); border:2px solid #06b6d4; border-radius:12px; padding:16px; margin-top:16px;">
              <h4 style="color:#67e8f9; margin-top:0;">⚡ HYBRID INVENTED: Solar Breeze Shield!</h4>
              <p style="color:#e2e8f0; margin-bottom:0;">An umbrella equipped with mini solar fans that keeps you dry AND cool in sunny rain!</p>
            </div>
          `;
        }
      }, 1200);
    }

    // Canvas Blueprint Drawing
    setupCanvas(canvas) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.strokeStyle = this.state.currentColor;

      const getPos = (e) => {
        const r = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: (clientX - r.left) * (canvas.width / r.width),
          y: (clientY - r.top) * (canvas.height / r.height)
        };
      };

      const start = (e) => {
        this.state.isDrawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      };

      const draw = (e) => {
        if (!this.state.isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.strokeStyle = this.state.currentColor;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      };

      const end = () => {
        this.state.isDrawing = false;
      };

      canvas.addEventListener('mousedown', start);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', end);
      canvas.addEventListener('mouseleave', end);

      canvas.addEventListener('touchstart', start, { passive: false });
      canvas.addEventListener('touchmove', draw, { passive: false });
      canvas.addEventListener('touchend', end);
    }

    initCanvas() {
      const canvas = document.getElementById('stm-blueprint-canvas') || document.getElementById('blueprint-canvas');
      if (canvas) {
        this.setupCanvas(canvas);
      }
    }

    setProblemPreset(id, defaultName) {
      this.state.problemPreset = id;
      this.state.inventionName = defaultName;
      const input = document.getElementById('stm-input-name');
      if (input) input.value = defaultName;
      this.awardXP(5, `Selected problem & named invention "${defaultName}"! 💡`);
    }

    setInventionName(name) {
      this.state.inventionName = name;
    }

    setCanvasColor(color, element) {
      this.state.currentColor = color;
      if (element) {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        element.classList.add('active');
      }
      if (this.audio) this.audio.playClick();
    }

    clearCanvas() {
      const canvas = document.getElementById('stm-blueprint-canvas') || document.getElementById('blueprint-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.showToast('Canvas cleared. Start a new sketch!');
      }
    }

    undoCanvas() {
      this.clearCanvas();
    }

    // Stress Testing
    runStressTest() {
      if (this.state.isStressTesting) return;
      this.state.isStressTesting = true;

      const chamber = document.getElementById('testing-chamber');
      if (chamber) chamber.classList.add('testing-active');

      if (this.audio) this.audio.playMachineHum();

      const expectedPhase = this.currentPhase;
      setTimeout(() => {
        if (this.currentPhase !== expectedPhase) return;
        this.state.isStressTesting = false;
        if (chamber) chamber.classList.remove('testing-active');

        if (this.state.retryCount === 0) {
          // Failure on first attempt (pedagogical moment: Karl Benz persevered!)
          this.state.testFailed = true;
          this.state.retryCount++;
          if (this.audio) this.audio.playTryAgain();
          const resultBox = document.getElementById('test-result-box');
          if (resultBox) {
            resultBox.innerHTML = `
              <div style="background:rgba(239,68,68,0.2); border:2px solid #ef4444; border-radius:12px; padding:16px; margin-top:16px;">
                <h4 style="color:#f87171; margin-top:0;">⚠️ TEST FAILED: Overheating & Loose Fasteners!</h4>
                <p style="color:#fecaca;">Karl Benz says: <em>"A breakdown is not failure—it is valuable data!"</em> Let's fix it!</p>
                <button class="stm-btn-action" onclick="window.saveTomorrowApp.goToPhase(12)" style="background:#ef4444;">Go to Improvement Chamber ▶</button>
              </div>
            `;
          }
        } else {
          // Success after improvement
          this.state.testFailed = false;
          if (this.audio) this.audio.playCorrect();
          this.awardXP(20, 'Prototype PASSED all environmental stress tests! 🏆');
          const resultBox = document.getElementById('test-result-box');
          if (resultBox) {
            resultBox.innerHTML = `
              <div style="background:rgba(16,185,129,0.2); border:2px solid #10b981; border-radius:12px; padding:16px; margin-top:16px;">
                <h4 style="color:#6ee7b7; margin-top:0;">✅ TEST SUCCESSFUL: 100% Efficiency!</h4>
                <p style="color:#d1fae5;">The prototype is durable, safe, and ready for the Tomorrow Science Expo!</p>
                <button class="stm-btn-action" onclick="window.saveTomorrowApp.goToPhase(13)">Proceed to Expo Presentation ▶</button>
              </div>
            `;
          }
        }
      }, 1500);
    }

    applyImprovement(improvementText) {
      this.state.chosenImprovement = improvementText;
      this.awardXP(15, `Applied: "${improvementText}"! Ready for re-test! 🛠️`);
    }

    // Presentation Timer
    togglePresentationTimer() {
      if (this.state.isPresentationRunning) {
        clearInterval(this.state.presentationTimerInterval);
        this.state.isPresentationRunning = false;
        const btn = document.getElementById('btn-pitch-timer');
        if (btn) btn.textContent = '▶ Start 30s Pitch Timer';
      } else {
        this.state.isPresentationRunning = true;
        const btn = document.getElementById('btn-pitch-timer');
        if (btn) btn.textContent = '⏸ Pause Pitch Timer';
        this.state.presentationTimerInterval = setInterval(() => {
          if (this.state.presentationSeconds > 0) {
            this.state.presentationSeconds--;
            const display = document.getElementById('pitch-timer-display');
            if (display) display.textContent = `⏱️ 00:${this.state.presentationSeconds < 10 ? '0' : ''}${this.state.presentationSeconds}`;
          } else {
            clearInterval(this.state.presentationTimerInterval);
            this.state.isPresentationRunning = false;
            if (this.audio) this.audio.playApplause();
            this.awardXP(25, 'Expo Presentation Delivered with Pride! 🌟');
            this.showToast('Time is up! Wonderful presentation! 👏');
          }
        }, 1000);
      }
    }

    // Think Timer
    startThinkTimer(seconds) {
      clearInterval(this.state.thinkTimerInterval);
      this.state.thinkSecondsRemaining = seconds;
      this.showToast(`⏱️ ${seconds}-second thinking time started!`);
      this.state.thinkTimerInterval = setInterval(() => {
        if (this.state.thinkSecondsRemaining > 0) {
          this.state.thinkSecondsRemaining--;
        } else {
          clearInterval(this.state.thinkTimerInterval);
          if (this.audio) this.audio.playCorrect();
          this.showToast('Time is up! Ready to share!');
        }
      }, 1000);
    }

    // Teacher Drawer
    openTeacherDrawer() {
      const drawer = document.getElementById('stm-teacher-drawer');
      const backdrop = document.getElementById('stm-drawer-backdrop');
      if (drawer) {
        this.scenes.renderTeacherDrawer(drawer, this.currentPhase);
        drawer.classList.add('open');
      }
      if (backdrop) backdrop.classList.add('open');
    }

    closeTeacherDrawer() {
      const drawer = document.getElementById('stm-teacher-drawer');
      const backdrop = document.getElementById('stm-drawer-backdrop');
      if (drawer) drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
    }

    toggleTeacherDrawer() {
      const drawer = document.getElementById('stm-teacher-drawer');
      if (!drawer) return;
      if (drawer.classList.contains('open')) this.closeTeacherDrawer();
      else this.openTeacherDrawer();
    }

    restartAdventure() {
      this.currentPhase = 1;
      this.currentStage = 1;
      this.xp = 0;
      this.state.completedPhases.clear();
      this.state.retryCount = 0;
      this.state.mixerSelected = [];
      this.goToPhase(1);
      this.showToast('Adventure restarted! Welcome back to 2045! 🚀');
    }
  }

  root.SaveTomorrowApp = SaveTomorrowApp;

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      root.saveTomorrowApp = new SaveTomorrowApp();
      root.saveTomorrowApp.init();
    });
  }

})(typeof window !== 'undefined' ? window : global);
