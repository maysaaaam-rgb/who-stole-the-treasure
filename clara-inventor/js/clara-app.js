/**
 * CLARA'S INVENTION MYSTERY & THE INVENTOR CHALLENGE
 * Application Controller, State Management & Gamification Engine
 * Based on Reading Book 3 / Global Readings 2 (pp. 16–17)
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
        chosenComboIdx: 0,
        chosenBase: null,
        chosenAdj: 'super',
        activeChalIdx: 0,
        presentationStars: { idea: 0, useful: 0, funny: 0, applause: 0 },
        activeTeacherTab: 'lesson1',
        activeTeacherActIdx: 0,
        phonicsMiniIdx: 0
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
      // Update Tab highlight
      const tabL1 = document.getElementById('tab-lesson1');
      const tabL2 = document.getElementById('tab-lesson2');
      const tabPhonics = document.getElementById('tab-phonics');

      if (tabL1) tabL1.className = `lesson-tab-btn ${this.state.currentLesson === 'lesson1' ? 'active' : ''}`;
      if (tabL2) tabL2.className = `lesson-tab-btn ${this.state.currentLesson === 'lesson2' ? 'active' : ''}`;
      if (tabPhonics) tabPhonics.className = `lesson-tab-btn ${this.state.currentLesson === 'phonics' ? 'active' : ''}`;

      // Stage Tracker text
      const tracker = document.getElementById('hud-stage-tracker');
      if (tracker) {
        if (this.state.currentLesson === 'lesson1') {
          const names = ["1. 🔍 Inventor Mystery", "2. 🎴 What Does It Do?", "3. 🕵️ Reading Detectives", "4. 🏃 True/False Move", "5. 📜 Story Timeline", "6. 🎨 Create Invention"];
          tracker.textContent = names[this.state.currentStage - 1] || 'Lesson 1';
        } else if (this.state.currentLesson === 'lesson2') {
          const names = ["1. 💥 Broken Machine", "2. 📱 Human Tablet", "3. 🧩 Sequence Builder", "4. 💡 Inventor Process", "5. ⏱️ Sequence Relay", "6. 🛠️ Inventor Lab", "7. 🏆 Presentation"];
          tracker.textContent = names[this.state.currentStage - 1] || 'Lesson 2';
        } else {
          tracker.textContent = '🔤 Phonics CL / cl- Station';
        }
      }

      // XP & Scores
      const xpEl = document.getElementById('hud-xp-val');
      if (xpEl) xpEl.textContent = `${this.state.xp} XP`;

      const scoreA = document.getElementById('score-teamA');
      const scoreB = document.getElementById('score-teamB');
      if (scoreA) scoreA.textContent = this.state.teamScores.teamA;
      if (scoreB) scoreB.textContent = this.state.teamScores.teamB;
    }

    // =========================================================================
    // GAMIFICATION & SCOREBOARD
    // =========================================================================
    addXp(pts, reason) {
      this.state.xp += pts;
      this.updateHud();
      this.saveState();
      this.showToast(`+${pts} XP! ${reason || ''}`);
    }

    changeTeamScore(team, delta) {
      if (this.state.teamScores[team] !== undefined) {
        this.state.teamScores[team] = Math.max(0, this.state.teamScores[team] + delta);
        if (delta > 0) root.claraAudio.playSuccess();
        this.updateHud();
        this.saveState();
      }
    }

    addScore(team, delta = 1) {
      this.changeTeamScore(team, delta);
    }


    showToast(message) {
      const toast = document.getElementById('clara-toast');
      if (!toast) return;
      toast.textContent = message;
      toast.style.display = 'block';
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
    }

    // =========================================================================
    // STAGE 1 & 2 ACTIONS
    // =========================================================================
    playIntroBadge() {
      const banner = document.getElementById('badge-banner');
      if (banner) {
        banner.style.display = banner.style.display === 'none' ? 'flex' : 'none';
      }
      root.claraAudio.playFanfare();
      this.addXp(10, "Junior Inventor Badge Conferred!");
      root.claraAudio.speak("Congratulations! You are now an official Junior Inventor!");
    }

    revealWarmupCombo(id) {
      const ans = document.getElementById(`ans-${id}`);
      if (ans) {
        ans.style.display = 'block';
        root.claraAudio.playChime();
        this.addXp(10, "Inventor Discovery!");
      }
    }

    toggleInvMode() {
      this.state.invMode = this.state.invMode === 'normal' ? 'reverse' : 'normal';
      this.render();
    }

    checkInventionChoice(selectedId, targetId) {
      const card = document.getElementById(`inv-${selectedId}`);
      if (selectedId === targetId) {
        root.claraAudio.playSuccess();
        this.addXp(10, "Invention Function Correct!");
        if (card) {
          card.style.borderColor = 'var(--lab-green)';
          card.style.boxShadow = '0 0 20px rgba(52, 211, 153, 0.4)';
        }
        this.showToast("Great! You matched the invention!");
        root.claraAudio.speak("Great! Excellent inventor!");

        setTimeout(() => {
          const invs = root.CLARA_DATA.lesson1.inventions;
          this.state.whatDoesItDoIndex = ((this.state.whatDoesItDoIndex || 0) + 1) % invs.length;
          this.render();
        }, 1200);
      } else {
        root.claraAudio.playError();
        if (card) {
          card.style.borderColor = 'var(--lab-red)';
          setTimeout(() => { card.style.borderColor = 'var(--lab-border)'; }, 1000);
        }
        this.showToast("Almost! Try again! Listen to the clue!");
        root.claraAudio.speak("Try again! Listen carefully!");
      }
    }

    // =========================================================================
    // STAGE 3: READING DETECTIVES
    // =========================================================================
    selectMission(idx) {
      root.claraScenes.activeMissionIdx = idx;
      this.render();
    }

    answerMission(optIdx) {
      const missions = root.CLARA_DATA.lesson1.readingMissions;
      const curMission = missions[root.claraScenes.activeMissionIdx];
      const opt = curMission.options[optIdx];
      const btn = document.getElementById(`opt-btn-${optIdx}`);

      if (opt.isCorrect) {
        root.claraAudio.playSuccess();
        this.addXp(10, `Mission #${curMission.id} Solved!`);
        if (btn) btn.className = 'option-choice-btn correct';

        // Highlight sentence in text chunk
        const storyDisplay = document.getElementById('story-sentence-display');
        if (storyDisplay) {
          storyDisplay.innerHTML = curMission.textChunk.replace(
            curMission.sentenceHighlight,
            `<mark style="background:var(--lab-green); color:#000; padding:2px 6px; border-radius:4px;">${curMission.sentenceHighlight}</mark>`
          );
        }

        const fb = document.getElementById('mission-feedback-box');
        if (fb) fb.style.display = 'block';

        if (!this.state.completedMissions.includes(root.claraScenes.activeMissionIdx)) {
          this.state.completedMissions.push(root.claraScenes.activeMissionIdx);
        }
        root.claraAudio.speak(curMission.spokenProof);
      } else {
        root.claraAudio.playError();
        if (btn) btn.className = 'option-choice-btn incorrect';
        this.showToast(opt.hint);
        root.claraAudio.speak("Almost! Look at the reading carefully!");
      }
    }

    nextMission() {
      const missions = root.CLARA_DATA.lesson1.readingMissions;
      if (root.claraScenes.activeMissionIdx < missions.length - 1) {
        root.claraScenes.activeMissionIdx++;
        this.render();
      } else {
        this.showToast("All 6 Reading Missions Complete! Moving to True or False!");
        this.goToStage('lesson1', 4);
      }
    }

    // =========================================================================
    // STAGE 4: FOUR CORNERS TRUE/FALSE
    // =========================================================================
    checkTfAnswer(choiceBool) {
      const items = root.CLARA_DATA.lesson1.fourCorners;
      const cur = items[root.claraScenes.activeTfIdx];
      const fb = document.getElementById('tf-feedback');

      if (choiceBool === cur.isTrue) {
        root.claraAudio.playSuccess();
        this.addXp(10, "True/False Correct!");
        if (fb) {
          fb.style.display = 'block';
          fb.style.borderColor = 'var(--lab-green)';
          fb.innerHTML = `
            <div style="font-size:1.2rem; font-weight:800; color:var(--lab-green); margin-bottom:6px;">
              ✓ ${cur.explanation}
            </div>
            <div style="font-size:1rem; color:#e2e8f0;">
              <strong>Why?</strong> ${cur.whyResponse}
            </div>
            <button class="action-btn green" style="margin-top:12px;" onclick="window.claraApp.nextTf()">
              Next Statement ➡️
            </button>
          `;
        }
        root.claraAudio.speak(cur.explanation + " " + cur.whyResponse);
      } else {
        root.claraAudio.playError();
        if (fb) {
          fb.style.display = 'block';
          fb.style.borderColor = 'var(--lab-red)';
          fb.innerHTML = `
            <div style="font-size:1.1rem; font-weight:800; color:var(--lab-red); margin-bottom:6px;">
              Look carefully at Clara's story!
            </div>
            <div style="color:#e2e8f0;">
              ${cur.whyResponse}
            </div>
          `;
        }
        root.claraAudio.speak("Think carefully! Why? " + cur.whyResponse);
      }
    }

    nextTf() {
      const items = root.CLARA_DATA.lesson1.fourCorners;
      if (root.claraScenes.activeTfIdx < items.length - 1) {
        root.claraScenes.activeTfIdx++;
        this.render();
      } else {
        this.showToast("All True/False Statements Complete! Moving to Story Timeline!");
        this.goToStage('lesson1', 5);
      }
    }

    // =========================================================================
    // STAGE 5: STORY TIMELINE
    // =========================================================================
    assignCardToNextSlot(orderNum) {
      const cards = root.CLARA_DATA.lesson1.storyCards;
      const card = cards.find(c => c.order === orderNum);
      if (!card) return;

      for (let i = 1; i <= 6; i++) {
        if (!root.claraScenes.storySlotAssignments[i]) {
          root.claraScenes.storySlotAssignments[i] = card;
          root.claraAudio.playClick();
          this.render();
          return;
        }
      }
      this.showToast("All slots filled! Tap 'Check Story Order'!");
    }

    clearSlot(slotNum) {
      delete root.claraScenes.storySlotAssignments[slotNum];
      root.claraAudio.playClick();
      this.render();
    }

    validateStoryOrder() {
      const assigned = root.claraScenes.storySlotAssignments;
      let allCorrect = true;

      for (let i = 1; i <= 6; i++) {
        if (!assigned[i] || assigned[i].order !== i) {
          allCorrect = false;
          break;
        }
      }

      if (allCorrect) {
        root.claraAudio.playFanfare();
        this.addXp(30, "Clara's Story Reconstructed Perfectly!");
        this.showToast("🎉 Perfect Sequence! You reconstructed Clara's Story!");
        root.claraAudio.speak("Perfect! You put Clara's story in the exact order!");
      } else {
        root.claraAudio.playError();
        this.showToast("Almost! Look at what happens first in Clara's day!");
        root.claraAudio.speak("Almost! Look at what happens first!");
      }
    }

    // =========================================================================
    // STAGE 6: CREATE YOUR INVENTION
    // =========================================================================
    pickCombo(idx) {
      this.state.chosenComboIdx = idx;
      root.claraAudio.playClick();
      this.render();
    }

    clearDrawing() {
      const canvas = document.getElementById('studio-drawing-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        root.claraAudio.playClick();
        this.showToast("Canvas cleared!");
      }
    }

    finishLesson1() {
      root.claraAudio.playFanfare();
      this.addXp(20, "Lesson 1: Clara's Invention Mystery Complete!");
      this.showToast("🎉 Mission Complete! You are Junior Inventors!");
      root.claraAudio.speak("Mission complete! You are Junior Inventors!");
    }

    // =========================================================================
    // LESSON 2 ACTIONS
    // =========================================================================
    triggerBrokenAlert() {
      root.claraAudio.playError();
      const el = document.getElementById('broken-robot-icon');
      if (el) el.style.animation = 'shakeCard 0.2s infinite';
      this.showToast("⚠️ SYSTEM ALERT: Order not found! Machine failed!");
      root.claraAudio.speak("Oh no! The invention doesn't work! What do we do? We need a plan!");
    }

    toggleTabletPower() {
      const tb = root.claraScenes.tabletState;
      tb.powered = !tb.powered;
      if (tb.powered) {
        root.claraAudio.playPower();
        this.addXp(10, "Tablet Power On (Step: Press on / Press play)");
        root.claraAudio.speak("First, press on!");
      } else {
        root.claraAudio.playClick();
      }
      this.render();
    }

    pressTabletKey(num) {
      const tb = root.claraScenes.tabletState;
      if (tb.code.length < 4) {
        tb.code += num;
        root.claraAudio.playClick();
        if (tb.code === '1234') {
          root.claraAudio.playSuccess();
          this.addXp(10, "Password Unlocked (Step: Type password)");
          root.claraAudio.speak("Second, type password!");
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
      root.claraAudio.playChime();
      this.addXp(10, "Game Menu Activated (Step: Press play)");
      root.claraAudio.speak("Third, press play!");
      this.render();
    }

    hopBunny() {
      const tb = root.claraScenes.tabletState;
      tb.score++;
      root.claraScenes.bunnyY = -25;
      root.claraAudio.playSuccess();
      this.addXp(5, "Carrot Collected! (Step: Play the game)");

      const b = document.getElementById('bunny-actor');
      if (b) b.style.transform = 'translateY(-25px)';

      setTimeout(() => {
        root.claraScenes.bunnyY = 0;
        if (b) b.style.transform = 'translateY(0)';
        this.render();
      }, 300);
    }

    generateSequenceBug() {
      root.claraAudio.playError();
      const fb = document.getElementById('bug-feedback-box');
      if (fb) {
        fb.style.display = 'block';
        fb.innerHTML = `
          <div class="speaking-banner" style="border-color:var(--lab-red);">
            <div class="speak-text">
              🐛 <strong>BUG DETECTED:</strong> Someone put <em>"Play the game"</em> before <em>"Press play"</em>!<br>
              <span class="highlight">Can you play a game before you start the system? "NO!"</span>
            </div>
            <button class="action-btn green" onclick="window.claraApp.fixSequenceBug()">
              🔧 Fix the Sequence!
            </button>
          </div>
        `;
      }
      root.claraAudio.speak("Bug detected! You cannot play a game before you press play!");
    }

    fixSequenceBug() {
      root.claraAudio.playSuccess();
      const fb = document.getElementById('bug-feedback-box');
      if (fb) fb.style.display = 'none';
      this.addXp(20, "Sequence Bug Fixed!");
      this.showToast("Sequence restored: First, Second, Third, Last!");
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
        this.addXp(10, `Relay Accuracy Point for ${target} -> ${action}!`);
        this.showToast(`✓ Correct! ${target} = ${action}!`);
        root.claraAudio.speak(`Correct! ${target}, an inventor has an ${action.toLowerCase()}!`);
      } else {
        root.claraAudio.playError();
        this.showToast(`Not quite! Remember accuracy is most important!`);
        root.claraAudio.speak(`Think about what happens in order!`);
      }
    }

    selectLabChallenge(idx) {
      this.state.activeChalIdx = parseInt(idx, 10);
      root.claraAudio.playClick();
      this.render();
    }

    awardPresentationStar(type) {
      if (!this.state.presentationStars[type]) this.state.presentationStars[type] = 0;
      this.state.presentationStars[type]++;
      const el = document.getElementById(`star-count-${type}`);
      if (el) el.textContent = this.state.presentationStars[type];
      root.claraAudio.playChime();
      this.addXp(5, `Awarded ${type.toUpperCase()} star!`);
    }

    launchCeremonyFanfare() {
      root.claraAudio.playFanfare();
      this.addXp(100, "Master Inventor Certificate Conferred!");
      this.showToast("🎓 MISSION COMPLETE! You are Certified Master Inventors!");
      root.claraAudio.speak("Mission complete! You are Master Inventors!");
    }

    // =========================================================================
    // 2-MINUTE PHONICS MINI-CHALLENGE MODAL
    // =========================================================================
    openPhonicsMini() {
      const modal = document.getElementById('clara-modal');
      const content = document.getElementById('modal-content-area');
      if (!modal || !content) return;

      const p = root.CLARA_DATA.lesson1.phonicsMini;
      const curWord = p.words[this.state.phonicsMiniIdx || 0];

      let html = `
        <div style="text-align:center;">
          <span class="stage-tracker-pill">Phonics Mini-Challenge (2–3 min)</span>
          <h2 style="font-family:var(--font-heading); font-size:1.6rem; color:var(--lab-gold); margin:8px 0;">
            🔤 Initial Sound Challenge: CL / cl-
          </h2>
          <p style="color:#cbd5e1; font-size:1rem; margin-bottom:14px;">
            ${p.instruction}
          </p>

          <div style="background:var(--lab-canvas); padding:20px; border-radius:14px; border:2px dashed var(--lab-cyan); margin-bottom:16px;">
            <div style="font-size:3rem; margin-bottom:8px;">🔊</div>
            <button class="action-btn gold" onclick="window.claraAudio.speak('${curWord.word}')">
              🔊 <span>Listen to the Word</span>
            </button>
            <div id="phonics-word-reveal" style="display:none; font-size:2rem; font-weight:900; color:#ffffff; margin-top:10px;">
              ${curWord.isCl ? `<span style="color:var(--lab-cyan); text-decoration:underline;">cl</span>${curWord.word.substring(2)}` : curWord.word}
            </div>
            <div id="phonics-mini-feedback" style="display:none; margin-top:8px; font-weight:700;"></div>
          </div>

          <div style="display:flex; justify-content:center; gap:20px;">
            <button class="action-btn primary" style="font-size:1.2rem; padding:12px 30px;" onclick="window.claraApp.answerPhonicsMini(true)">
              👍 CL Sound
            </button>
            <button class="action-btn red" style="font-size:1.2rem; padding:12px 30px;" onclick="window.claraApp.answerPhonicsMini(false)">
              👎 NOT CL
            </button>
          </div>

          <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.85rem; color:#94a3b8;">Word ${(this.state.phonicsMiniIdx || 0) + 1} of ${p.words.length}</span>
            <button class="hud-btn" onclick="window.claraApp.closeModal()">Back to Lesson</button>
          </div>
        </div>
      `;

      content.innerHTML = html;
      modal.style.display = 'flex';
      root.claraAudio.speak(curWord.word);
    }

    answerPhonicsMini(userChoiceBool) {
      const p = root.CLARA_DATA.lesson1.phonicsMini;
      const curWord = p.words[this.state.phonicsMiniIdx || 0];
      const reveal = document.getElementById('phonics-word-reveal');
      const fb = document.getElementById('phonics-mini-feedback');

      if (reveal) reveal.style.display = 'block';

      if (userChoiceBool === curWord.isCl) {
        root.claraAudio.playSuccess();
        this.addXp(10, `Phonics match for ${curWord.word}!`);
        if (fb) {
          fb.style.display = 'block';
          fb.style.color = 'var(--lab-green)';
          fb.textContent = `✓ Correct! "${curWord.word}" ${curWord.isCl ? 'starts with CL!' : 'does NOT start with CL!'}`;
        }
        root.claraAudio.speak(`Correct! ${curWord.word}. ${curWord.sentence}`);
      } else {
        root.claraAudio.playError();
        if (fb) {
          fb.style.display = 'block';
          fb.style.color = 'var(--lab-red)';
          fb.textContent = `Listen carefully to the beginning sound!`;
        }
        root.claraAudio.speak(`Listen again: ${curWord.word}`);
      }

      setTimeout(() => {
        this.state.phonicsMiniIdx = ((this.state.phonicsMiniIdx || 0) + 1) % p.words.length;
        this.openPhonicsMini();
      }, 1600);
    }

    // =========================================================================
    // TEACHER CONTROL CENTER MODAL (11 Required Fields)
    // =========================================================================
    openTeacherModal() {
      const modal = document.getElementById('clara-modal');
      const content = document.getElementById('modal-content-area');
      if (!modal || !content) return;

      const tm = root.CLARA_DATA.teacherMode;
      const currentTab = this.state.activeTeacherTab || 'lesson1';
      const actList = currentTab === 'lesson1' ? tm.lesson1Activities : tm.lesson2Activities;
      const curAct = actList[this.state.activeTeacherActIdx || 0];

      let html = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--lab-border); padding-bottom:10px; margin-bottom:14px;">
            <h2 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--lab-gold);">
              ⚙️ Teacher HUD: 11 Pedagogical Dimensions
            </h2>
            <div style="display:flex; gap:8px;">
              <button class="lesson-tab-btn ${currentTab === 'lesson1' ? 'active' : ''}" onclick="window.claraApp.switchTeacherTab('lesson1')">Lesson 1 (35m)</button>
              <button class="lesson-tab-btn ${currentTab === 'lesson2' ? 'active' : ''}" onclick="window.claraApp.switchTeacherTab('lesson2')">Lesson 2 (35m)</button>
            </div>
          </div>

          <!-- Activity Navigator Row -->
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">
      `;

      actList.forEach((a, i) => {
        const sel = i === (this.state.activeTeacherActIdx || 0) ? 'primary' : '';
        html += `<button class="hud-btn ${sel}" onclick="window.claraApp.selectTeacherAct(${i})">${i + 1}. ${a.name} (${a.time})</button>`;
      });

      html += `
          </div>

          <!-- 11 Detailed Dimensional Fields for Selected Activity -->
          <div style="background:var(--lab-canvas); border:1px solid var(--lab-border); border-radius:12px; padding:16px; max-height:480px; overflow-y:auto; font-size:0.9rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <h3 style="font-family:var(--font-heading); font-size:1.2rem; color:var(--lab-cyan);">${curAct.name}</h3>
              <span class="stage-tracker-pill">${curAct.time}</span>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--lab-gold);">1. Objective:</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${curAct.objective}</p>
              </div>
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--lab-gold);">2. Classroom Setup:</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${curAct.setup}</p>
              </div>
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--lab-gold);">3. Teacher Instructions:</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${curAct.instructions}</p>
              </div>
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--lab-gold);">4. Teacher Language:</strong>
                <p style="color:#e2e8f0; margin-top:2px; font-style:italic;">"${curAct.teacherLanguage}"</p>
              </div>
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--lab-gold);">5. Answer Key:</strong>
                <p style="color:var(--lab-green); margin-top:2px;">${curAct.answerKey}</p>
              </div>
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--lab-gold);">6. Expected Student Responses:</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${curAct.expectedResponses}</p>
              </div>
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--lab-cyan);">7. Physical Classroom Version:</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${curAct.physicalVersion}</p>
              </div>
              <div style="background:rgba(15,23,42,0.6); padding:10px; border-radius:8px;">
                <strong style="color:var(--lab-cyan);">8. Digital Platform Version:</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${curAct.digitalVersion}</p>
              </div>
              <div style="background:rgba(52,211,153,0.1); border:1px solid var(--lab-green); padding:10px; border-radius:8px;">
                <strong style="color:var(--lab-green);">9. Easier Version (Scaffold):</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${curAct.easierVersion}</p>
              </div>
              <div style="background:rgba(234,179,8,0.1); border:1px solid var(--lab-gold); padding:10px; border-radius:8px;">
                <strong style="color:var(--lab-gold);">10. Harder Version (Extension):</strong>
                <p style="color:#e2e8f0; margin-top:2px;">${curAct.harderVersion}</p>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px;">
            <a href="worksheet.html" target="_blank" class="action-btn gold" style="text-decoration:none;">
              🖨️ Open 4-Page Printable Kit & Cutout Cards
            </a>
            <button class="action-btn primary" onclick="window.claraApp.closeModal()">
              Close HUD
            </button>
          </div>
        </div>
      `;

      content.innerHTML = html;
      modal.style.display = 'flex';
    }

    switchTeacherTab(tabName) {
      this.state.activeTeacherTab = tabName;
      this.state.activeTeacherActIdx = 0;
      this.openTeacherModal();
    }

    selectTeacherAct(idx) {
      this.state.activeTeacherActIdx = idx;
      this.openTeacherModal();
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
