/**
 * CLARA'S INVENTOR MYSTERY & THE INVENTOR CHALLENGE
 * Application Controller, State Management & Gamification Engine
 */

(function(root) {
  'use strict';

  class ClaraAppController {
    constructor() {
      this.state = {
        currentLesson: 'lesson1',
        currentStage: 1,
        teamScores: { teamA: 0, teamB: 0 },
        xp: 0,
        completedMissions: [],
        whatDoesItDoIndex: 0,
        invMode: 'normal',
        chosenBase: null,
        chosenAdj: 'super',
        activeChalIdx: 0,
        presentationStars: { idea: 0, useful: 0, funny: 0 }
      };

      this.container = null;
      this.toastTimer = null;
    }

    init() {
      this.container = document.getElementById('clara-stage-container');
      this.loadSavedState();
      this.render();
      this.updateHud();
    }

    loadSavedState() {
      try {
        const raw = localStorage.getItem('eaa_clara_inventor_state');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.xp) this.state.xp = parsed.xp;
          if (parsed.teamScores) this.state.teamScores = parsed.teamScores;
        }
      } catch (e) {
        console.warn('Could not load local state:', e);
      }
    }

    saveState() {
      try {
        localStorage.setItem('eaa_clara_inventor_state', JSON.stringify({
          xp: this.state.xp,
          teamScores: this.state.teamScores
        }));
      } catch (e) {}
    }

    // =========================================================================
    // NAVIGATION & STAGE ROUTING
    // =========================================================================
    switchLesson(lessonId) {
      this.state.currentLesson = lessonId;
      this.state.currentStage = 1;
      this.render();
      this.updateHud();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    goToStage(lessonId, stageNum) {
      this.state.currentLesson = lessonId;
      this.state.currentStage = stageNum;
      this.render();
      this.updateHud();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    prevStage() {
      if (this.state.currentStage > 1) {
        this.goToStage(this.state.currentLesson, this.state.currentStage - 1);
      }
    }

    nextStage() {
      const max = this.getMaxStages();
      if (this.state.currentStage < max) {
        this.goToStage(this.state.currentLesson, this.state.currentStage + 1);
      } else {
        this.showToast("You've reached the final stage of this lesson!");
      }
    }

    getMaxStages() {
      if (this.state.currentLesson === 'lesson1') return 6;
      if (this.state.currentLesson === 'lesson2') return 7;
      return 1;
    }

    render() {
      if (!this.container) return;
      const lesson = this.state.currentLesson;
      const stage = this.state.currentStage;

      if (lesson === 'lesson1') {
        switch (stage) {
          case 1: root.claraScenes.renderWarmup(this.container, this.state); break;
          case 2: root.claraScenes.renderWhatDoesItDo(this.container, this.state); break;
          case 3: root.claraScenes.renderReadingDetectives(this.container, this.state); break;
          case 4: root.claraScenes.renderFourCorners(this.container, this.state); break;
          case 5: root.claraScenes.renderBuildStory(this.container, this.state); break;
          case 6: root.claraScenes.renderMyInvention(this.container, this.state); break;
          default: root.claraScenes.renderWarmup(this.container, this.state);
        }
      } else if (lesson === 'lesson2') {
        switch (stage) {
          case 1: root.claraScenes.renderBrokenReview(this.container, this.state); break;
          case 2: root.claraScenes.renderHumanTablet(this.container, this.state); break;
          case 3: root.claraScenes.renderSequenceBuilder(this.container, this.state); break;
          case 4: root.claraScenes.renderInventorProcess(this.container, this.state); break;
          case 5: root.claraScenes.renderSequenceRelay(this.container, this.state); break;
          case 6: root.claraScenes.renderLabChallenge(this.container, this.state); break;
          case 7: root.claraScenes.renderPitchCeremony(this.container, this.state); break;
          default: root.claraScenes.renderBrokenReview(this.container, this.state);
        }
      } else if (lesson === 'phonics') {
        root.claraScenes.renderPhonicsStation(this.container, this.state);
      }
    }

    updateHud() {
      // Update Tab Highlights
      document.querySelectorAll('.lesson-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lesson === this.state.currentLesson) {
          btn.classList.add('active');
        }
      });

      // Update Stage Tracker Pill
      const pill = document.getElementById('hud-stage-tracker');
      if (pill) {
        if (this.state.currentLesson === 'lesson1') {
          const s = root.CLARA_DATA.lesson1.stages[this.state.currentStage - 1];
          pill.textContent = `${this.state.currentStage}. ${s.name}`;
        } else if (this.state.currentLesson === 'lesson2') {
          const s = root.CLARA_DATA.lesson2.stages[this.state.currentStage - 1];
          pill.textContent = `${this.state.currentStage}. ${s.name}`;
        } else {
          pill.textContent = "🔤 Phonics: CL / cl-";
        }
      }

      // Update Scores & XP
      const scoreA = document.getElementById('score-teamA');
      const scoreB = document.getElementById('score-teamB');
      const xpEl = document.getElementById('hud-xp-val');
      if (scoreA) scoreA.textContent = this.state.teamScores.teamA;
      if (scoreB) scoreB.textContent = this.state.teamScores.teamB;
      if (xpEl) xpEl.textContent = this.state.xp;
    }

    // =========================================================================
    // GAMIFICATION: SCOREBOARD, XP & TOASTS
    // =========================================================================
    addScore(team, delta) {
      if (team === 'teamA') this.state.teamScores.teamA += delta;
      if (team === 'teamB') this.state.teamScores.teamB += delta;
      root.claraAudio.playChime();
      this.updateHud();
      this.saveState();
    }

    addXp(pts, reason) {
      this.state.xp += pts;
      root.claraAudio.playSuccess();
      this.updateHud();
      this.showToast(`+${pts} XP! 🌟 ${reason || ''}`);
      this.saveState();
    }

    showToast(msg) {
      const toast = document.getElementById('clara-toast');
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3200);
    }

    // =========================================================================
    // LESSON 1 HANDLERS
    // =========================================================================
    playIntroBadge() {
      const banner = document.getElementById('badge-banner');
      if (banner) {
        banner.style.display = banner.style.display === 'none' ? 'flex' : 'none';
        root.claraAudio.playFanfare();
        root.claraAudio.speak("Welcome, Junior Inventors! You have earned your official Inventor Badge!");
        this.addXp(20, "Junior Inventor Induction!");
      }
    }

    revealWarmupCombo(comboId) {
      const ans = document.getElementById(`ans-${comboId}`);
      const card = document.getElementById(`card-${comboId}`);
      if (ans && card) {
        const isHidden = ans.style.display === 'none';
        ans.style.display = isHidden ? 'block' : 'none';
        card.classList.toggle('revealed', isHidden);
        if (isHidden) {
          root.claraAudio.playChime();
          const combo = root.CLARA_DATA.lesson1.warmup.combos.find(c => c.id === comboId);
          if (combo) root.claraAudio.speak(combo.speech);
          this.addXp(10, `Discovered ${combo.invention}!`);
        }
      }
    }

    toggleInvMode() {
      this.state.invMode = this.state.invMode === 'normal' ? 'reverse' : 'normal';
      this.render();
    }

    checkInventionChoice(chosenId, targetId) {
      const el = document.getElementById(`inv-${chosenId}`);
      if (!el) return;

      if (chosenId === targetId) {
        el.classList.add('correct');
        root.claraAudio.playSuccess();
        root.claraAudio.speak("Great invention detective! You found the right one!");
        this.addXp(15, "Correct Invention Identified!");

        setTimeout(() => {
          this.state.whatDoesItDoIndex = ((this.state.whatDoesItDoIndex || 0) + 1) % root.CLARA_DATA.lesson1.inventions.length;
          this.render();
        }, 1400);
      } else {
        el.classList.add('wrong');
        root.claraAudio.playError();
        root.claraAudio.speak("Not this one! Look and listen again!");
        setTimeout(() => el.classList.remove('wrong'), 800);
      }
    }

    selectMission(idx) {
      root.claraScenes.activeMissionIdx = idx;
      this.render();
    }

    answerMission(optIdx) {
      const curMission = root.CLARA_DATA.lesson1.readingMissions[root.claraScenes.activeMissionIdx];
      const opt = curMission.options[optIdx];
      const btn = document.getElementById(`opt-btn-${optIdx}`);
      const feedback = document.getElementById('mission-feedback-box');
      const sentenceDisplay = document.getElementById('story-sentence-display');

      if (opt.isCorrect) {
        btn.classList.add('correct');
        root.claraAudio.playSuccess();
        if (sentenceDisplay) sentenceDisplay.classList.add('highlight');
        if (feedback) feedback.style.display = 'block';

        if (!this.state.completedMissions.includes(root.claraScenes.activeMissionIdx)) {
          this.state.completedMissions.push(root.claraScenes.activeMissionIdx);
          this.addXp(15, `Mission #${curMission.id} Solved!`);
        }
        root.claraAudio.speak(curMission.spokenProof);
      } else {
        btn.classList.add('wrong');
        root.claraAudio.playError();
        this.showToast(`Almost! Hint: ${opt.hint}`);
        root.claraAudio.speak(opt.hint);
        setTimeout(() => btn.classList.remove('wrong'), 1000);
      }
    }

    nextMission() {
      const total = root.CLARA_DATA.lesson1.readingMissions.length;
      if (root.claraScenes.activeMissionIdx < total - 1) {
        root.claraScenes.activeMissionIdx++;
        this.render();
      } else {
        this.showToast("All 6 Detective Missions Solved! Moving to 4-Corners!");
        this.goToStage('lesson1', 4);
      }
    }

    handleTfChoice(userChoice) {
      const q = root.CLARA_DATA.lesson1.fourCorners[root.claraScenes.activeTfIdx];
      const fb = document.getElementById('tf-feedback');
      const isRight = userChoice === q.isTrue;

      if (isRight) {
        root.claraAudio.playSuccess();
        this.addXp(15, "4-Corners deduction correct!");
        root.claraAudio.speak(`Correct! ${q.explanation} ${q.speechWhy}`);
      } else {
        root.claraAudio.playError();
        root.claraAudio.speak(`Think again! ${q.speechWhy}`);
      }

      if (fb) {
        fb.style.display = 'block';
        fb.innerHTML = `
          <div class="speaking-banner" style="border-color:${isRight ? 'var(--lab-green)' : 'var(--lab-gold)'};">
            <div class="speak-text">
              ${isRight ? '✓' : '⚠️'} ${q.explanation}<br>
              <span class="highlight" style="font-size:1.15rem;">${q.speechWhy}</span>
            </div>
            <button class="action-btn primary" onclick="window.claraApp.nextTfQuestion()">
              Next Statement ➡️
            </button>
          </div>
        `;
      }
    }

    nextTfQuestion() {
      const total = root.CLARA_DATA.lesson1.fourCorners.length;
      if (root.claraScenes.activeTfIdx < total - 1) {
        root.claraScenes.activeTfIdx++;
        this.render();
      } else {
        this.showToast("4-Corners Complete! Great kinesthetic movement!");
        this.goToStage('lesson1', 5);
      }
    }

    // Drag & drop story sequence
    onDragCard(e, order) {
      e.dataTransfer.setData('text/plain', order);
    }

    onDragOverSlot(e) {
      e.preventDefault();
    }

    onDropSlot(e, slotIdx) {
      e.preventDefault();
      const order = parseInt(e.dataTransfer.getData('text/plain'), 10);
      const card = root.CLARA_DATA.lesson1.storyCards.find(c => c.order === order);
      if (card) {
        root.claraScenes.storySlotAssignments[slotIdx] = card;
        root.claraAudio.playClick();
        this.render();
      }
    }

    autoAssignCard(order) {
      // Find first empty slot
      for (let i = 0; i < 6; i++) {
        if (!root.claraScenes.storySlotAssignments[i]) {
          const card = root.CLARA_DATA.lesson1.storyCards.find(c => c.order === order);
          root.claraScenes.storySlotAssignments[i] = card;
          root.claraAudio.playClick();
          this.render();
          return;
        }
      }
      this.showToast("All slots filled! Click 'Check Sequence' to verify.");
    }

    clickSlotToAssign(slotIdx) {
      // Clear slot on click
      if (root.claraScenes.storySlotAssignments[slotIdx]) {
        delete root.claraScenes.storySlotAssignments[slotIdx];
        root.claraAudio.playClick();
        this.render();
      }
    }

    checkStorySequence() {
      const assignments = root.claraScenes.storySlotAssignments;
      let allFilled = true;
      let allCorrect = true;

      for (let i = 0; i < 6; i++) {
        if (!assignments[i]) {
          allFilled = false;
          break;
        }
        if (assignments[i].order !== i + 1) {
          allCorrect = false;
        }
      }

      if (!allFilled) {
        this.showToast("Please place all 6 cards into the sequence slots!");
        root.claraAudio.speak("Please place all six cards in order!");
        return;
      }

      if (allCorrect) {
        root.claraAudio.playFanfare();
        this.addXp(30, "Perfect Story Sequence Reconstructed!");
        this.showToast("🌟 EXCELLENT! You reconstructed Clara's story!");
        root.claraAudio.speak("Excellent! You reconstructed Clara's story in perfect order!");
      } else {
        root.claraAudio.playError();
        this.showToast("Almost! Check the order of the middle events!");
        root.claraAudio.speak("Almost! Look again at what happens before Clara tries again.");
      }
    }

    // Studio Builder
    pickAdj(adj) {
      this.state.chosenAdj = adj;
      root.claraAudio.playClick();
      this.render();
    }

    pickBase(name) {
      const b = root.CLARA_DATA.lesson1.builderOptions.bases.find(x => x.name === name);
      if (b) {
        this.state.chosenBase = b;
        root.claraAudio.playClick();
        this.render();
      }
    }

    awardJuniorCertificate() {
      root.claraAudio.playFanfare();
      this.addXp(50, "Graduated Lesson 1: Junior Inventor!");
      this.showToast("🏆 Congratulations! You are now an Official Junior Inventor!");
    }

    // =========================================================================
    // LESSON 2 HANDLERS
    // =========================================================================
    triggerBrokenAlert() {
      root.claraAudio.playError();
      const el = document.getElementById('broken-robot-icon');
      if (el) el.innerHTML = "💥🔥💨⚙️";
      root.claraAudio.speak("Oh no! The machine is broken! We need a plan! We must follow the sequence!");
      this.showToast("Machine failed! We need to learn SEQUENCE!");
    }

    toggleTabletPower() {
      const tb = root.claraScenes.tabletState;
      tb.powered = !tb.powered;
      if (tb.powered) {
        root.claraAudio.playPower();
        root.claraAudio.speak("Step 1: Press on. Device powered up!");
      } else {
        root.claraAudio.playClick();
      }
      this.render();
    }

    pressTabletKey(key) {
      const tb = root.claraScenes.tabletState;
      if (tb.code.length < 4) {
        tb.code += key;
        root.claraAudio.playClick();
        if (tb.code === '1234') {
          root.claraAudio.playSuccess();
          root.claraAudio.speak("Step 2: Password accepted! Ready to launch game.");
          this.addXp(10, "Password Decoded!");
        }
        this.render();
      }
    }

    clearTabletKey() {
      root.claraScenes.tabletState.code = '';
      root.claraAudio.playClick();
      this.render();
    }

    pressTabletPlay() {
      const tb = root.claraScenes.tabletState;
      tb.playPressed = true;
      root.claraAudio.playSuccess();
      root.claraAudio.speak("Step 3: Press play. Game started! Step 4: Play the game!");
      this.addXp(10, "Game Launched!");
      this.render();
    }

    hopBunny() {
      const tb = root.claraScenes.tabletState;
      tb.score++;
      root.claraAudio.playChime();
      root.claraScenes.bunnyY = -40;
      this.render();

      setTimeout(() => {
        root.claraScenes.bunnyY = 0;
        this.render();
      }, 200);

      if (tb.score % 5 === 0) {
        this.addXp(10, `Collected ${tb.score} carrots!`);
      }
    }

    generateSequenceBug() {
      root.claraAudio.playError();
      const fb = document.getElementById('bug-feedback-box');
      if (fb) {
        fb.style.display = 'block';
        fb.innerHTML = `
          <div class="speaking-banner" style="border-color:var(--lab-red);">
            <div class="speak-text">
              🐛 <strong>BUG DETECTED:</strong> Someone put <em>"Play the game"</em> before <em>"Press on"</em>!<br>
              <span class="highlight">Can you play a game when the tablet is turned OFF? "NO!"</span>
            </div>
            <button class="action-btn green" onclick="window.claraApp.fixSequenceBug()">
              🔧 Fix the Sequence!
            </button>
          </div>
        `;
      }
      root.claraAudio.speak("Bug detected! You cannot play a game before you turn it on!");
    }

    fixSequenceBug() {
      root.claraAudio.playSuccess();
      const fb = document.getElementById('bug-feedback-box');
      if (fb) fb.style.display = 'none';
      this.addXp(20, "Sequence Bug Fixed!");
      this.showToast("Sequence restored: First, Press on! Last, Play the game!");
      root.claraAudio.speak("Great job! You fixed the sequence!");
    }

    startRelayRound() {
      const stages = ["FIRST", "SECOND", "THIRD", "LAST"];
      const rand = stages[Math.floor(Math.random() * stages.length)];
      this.state.relayTarget = rand;

      const txt = document.getElementById('relay-callout-text');
      if (txt) txt.textContent = `"${rand}!"`;
      root.claraAudio.playGear();
      root.claraAudio.speak(`Teacher calls: ${rand}!`);
    }

    checkRelayAnswer(action) {
      const target = this.state.relayTarget || "FIRST";
      const validMap = {
        FIRST: "IDEA",
        SECOND: "PLAN",
        THIRD: "MAKE",
        LAST: "TEST"
      };

      if (validMap[target] === action) {
        root.claraAudio.playSuccess();
        this.addXp(15, `Relay Point for ${target} -> ${action}!`);
        this.showToast(`✓ Correct! ${target} = ${action}!`);
        root.claraAudio.speak(`Correct! ${target}, we ${action.toLowerCase()}!`);
      } else {
        root.claraAudio.playError();
        this.showToast(`Not quite! For ${target}, what comes next?`);
        root.claraAudio.speak(`Remember: First is idea, Second is plan, Third is make, Last is test!`);
      }
    }

    selectLabChallenge(idx) {
      this.state.activeChalIdx = parseInt(idx, 10);
      root.claraAudio.playClick();
      this.render();
    }

    awardPresentationStar(type) {
      this.state.presentationStars[type]++;
      const el = document.getElementById(`star-count-${type}`);
      if (el) el.textContent = this.state.presentationStars[type];
      root.claraAudio.playChime();
      this.addXp(5, `Awarded ${type.toUpperCase()} star!`);
    }

    launchCeremonyFanfare() {
      root.claraAudio.playFanfare();
      this.addXp(100, "Master Inventor Certificate Conferred!");
      this.showToast("🎓 INVENTOR MISSION COMPLETE! You are a Certified Master Inventor!");
      root.claraAudio.speak("Mission complete! Congratulations, Master Inventors!");
    }

    // =========================================================================
    // TEACHER CONTROL CENTER MODAL
    // =========================================================================
    openTeacherModal() {
      const modal = document.getElementById('clara-modal');
      const content = document.getElementById('modal-content-area');
      if (!modal || !content) return;

      const tm = root.CLARA_DATA.teacherMode;
      let html = `
        <h2 style="font-family:var(--font-heading); font-size:1.6rem; color:var(--lab-gold); margin-bottom:12px;">
          ⚙️ Teacher Control Center & Pedagogical Guide
        </h2>
        <p style="color:#cbd5e1; margin-bottom:18px;">
          Overview of the 35-minute pacing, stage switcher, physical classroom setup, and differentiation options.
        </p>

        <!-- Stage Jumper -->
        <div style="background:var(--lab-canvas); padding:16px; border-radius:14px; margin-bottom:18px;">
          <h4 style="color:var(--lab-cyan); margin-bottom:10px;">🚀 Jump to Any Stage:</h4>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            <button class="hud-btn primary" onclick="window.claraApp.goToStage('lesson1', 1); window.claraApp.closeModal();">L1: 1. Warm-up</button>
            <button class="hud-btn" onclick="window.claraApp.goToStage('lesson1', 2); window.claraApp.closeModal();">L1: 2. What Does It Do?</button>
            <button class="hud-btn" onclick="window.claraApp.goToStage('lesson1', 3); window.claraApp.closeModal();">L1: 3. Detectives</button>
            <button class="hud-btn" onclick="window.claraApp.goToStage('lesson1', 4); window.claraApp.closeModal();">L1: 4. 4-Corners</button>
            <button class="hud-btn" onclick="window.claraApp.goToStage('lesson1', 5); window.claraApp.closeModal();">L1: 5. Story Build</button>
            <button class="hud-btn" onclick="window.claraApp.goToStage('lesson1', 6); window.claraApp.closeModal();">L1: 6. My Invention</button>
            <button class="hud-btn gold" onclick="window.claraApp.goToStage('lesson2', 1); window.claraApp.closeModal();">L2: 1. Broken Machine</button>
            <button class="hud-btn" onclick="window.claraApp.goToStage('lesson2', 2); window.claraApp.closeModal();">L2: 2. Human Tablet</button>
            <button class="hud-btn" onclick="window.claraApp.goToStage('lesson2', 3); window.claraApp.closeModal();">L2: 3. Sequence Builder</button>
            <button class="hud-btn" onclick="window.claraApp.goToStage('lesson2', 4); window.claraApp.closeModal();">L2: 4. Inventor Process</button>
            <button class="hud-btn" onclick="window.claraApp.goToStage('lesson2', 5); window.claraApp.closeModal();">L2: 5. Relay Race</button>
            <button class="hud-btn" onclick="window.claraApp.goToStage('lesson2', 6); window.claraApp.closeModal();">L2: 6. Lab Blueprint</button>
            <button class="hud-btn" onclick="window.claraApp.goToStage('lesson2', 7); window.claraApp.closeModal();">L2: 7. Ceremony</button>
            <button class="hud-btn" onclick="window.claraApp.switchLesson('phonics'); window.claraApp.closeModal();">🔤 Phonics CL</button>
          </div>
        </div>

        <!-- 35-Min Pacing Table -->
        <div style="margin-bottom:18px;">
          <h4 style="color:var(--lab-gold); margin-bottom:8px;">⏱️ Lesson 1 Pacing Guide (35 min):</h4>
          <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
            <thead>
              <tr style="background:var(--lab-canvas); text-align:left;">
                <th style="padding:6px 10px; border:1px solid var(--lab-border);">Time</th>
                <th style="padding:6px 10px; border:1px solid var(--lab-border);">Stage</th>
                <th style="padding:6px 10px; border:1px solid var(--lab-border);">Classroom Strategy</th>
              </tr>
            </thead>
            <tbody>
              ${tm.lesson1Pacing.map(p => `
                <tr>
                  <td style="padding:6px 10px; border:1px solid var(--lab-border); color:var(--lab-cyan); font-weight:800;">${p.time}</td>
                  <td style="padding:6px 10px; border:1px solid var(--lab-border); font-weight:700;">${p.activity}</td>
                  <td style="padding:6px 10px; border:1px solid var(--lab-border); color:#cbd5e1;">${p.setup}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Differentiation -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px;">
          <div style="background:rgba(52,211,153,0.1); border:1px solid var(--lab-green); padding:12px; border-radius:12px;">
            <strong style="color:var(--lab-green);">🟢 Easier Version (Scaffolded):</strong>
            <ul style="margin-left:18px; margin-top:6px; font-size:0.88rem; color:#e2e8f0; line-height:1.4;">
              ${tm.differentiation.easier.map(e => `<li>${e}</li>`).join('')}
            </ul>
          </div>
          <div style="background:rgba(234,179,8,0.1); border:1px solid var(--lab-gold); padding:12px; border-radius:12px;">
            <strong style="color:var(--lab-gold);">🟡 Harder Version (Extension):</strong>
            <ul style="margin-left:18px; margin-top:6px; font-size:0.88rem; color:#e2e8f0; line-height:1.4;">
              ${tm.differentiation.harder.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- No Tech Alternatives -->
        <div style="background:rgba(56,189,248,0.1); border:1px solid var(--lab-cyan); padding:12px; border-radius:12px;">
          <strong style="color:var(--lab-cyan);">🔌 No-Tech / Low-Tech Classroom Alternatives:</strong>
          <ul style="margin-left:18px; margin-top:6px; font-size:0.88rem; color:#e2e8f0; line-height:1.4;">
            ${tm.differentiation.noTech.map(n => `<li>${n}</li>`).join('')}
          </ul>
        </div>
      `;

      content.innerHTML = html;
      modal.style.display = 'flex';
    }

    closeModal() {
      const modal = document.getElementById('clara-modal');
      if (modal) modal.style.display = 'none';
    }
  }

  root.claraApp = new ClaraAppController();
  document.addEventListener('DOMContentLoaded', () => {
    root.claraApp.init();
  });
})(window);
