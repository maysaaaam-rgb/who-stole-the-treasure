/**
 * INVENTOR LAB — APPLICATION CONTROLLER & STATE MACHINE
 * Manages stage transitions, scoreboard, interaction logic, and audio triggers.
 */

(function(root) {
  'use strict';

  class InventorApp {
    constructor() {
      this.state = {
        currentStage: 1,
        scores: { teamA: 0, teamB: 0 },
        selectedHotspot: 'boy',
        discoveredHotspots: ['boy'],
        stwPlaced: {},
        firstStepAnswer: null,
        activeCycleStep: 1,
        currentMissionIndex: 0,
        storyPageIdx: 0,
        selectedStoryLine: null,
        correctStoryLines: [],
        evidenceFeedback: null,
        scenarioIndex: 0,
        scenarioAnswer: null,
        dilemmaIdea: 'd-wheels',
        dilemmaTestFailed: true,
        dilemmaFeedback: null,
        builderBody: 'b-robot',
        builderFunction: 'f-clean',
        builderFeature: 'ft-wings',
        builderName: 'The Turbo-Helper 3000',
        pitchVotes: {
          'aw-useful': 3,
          'aw-creative': 4,
          'aw-funny': 2,
          'aw-tech': 5,
          'aw-star': 4
        }
      };

      this.stageNames = [
        "1. 🚀 Lab Induction",
        "2. 🔍 Mystery Room",
        "3. 🧠 See, Think, Wonder",
        "4. 💡 What Do Inventors Do?",
        "5. 📖 Clara Doodle Reading",
        "6. ⚖️ Inventor or Not?",
        "7. 🎒 Heavy Bag Dilemma",
        "8. 🛠️ Invention Studio",
        "9. 🏆 Graduation Ceremony"
      ];
    }

    init() {
      this.updateHUD();
      this.renderStage(1);
    }

    renderStage(stageNum) {
      if (stageNum < 1) stageNum = 1;
      if (stageNum > 9) stageNum = 9;
      this.state.currentStage = stageNum;

      const container = document.getElementById('stage-container');
      if (!container) return;

      const rendererName = `renderStage${stageNum}`;
      if (root.inventorScenes && typeof root.inventorScenes[rendererName] === 'function') {
        root.inventorScenes[rendererName](container, this.state);
      }

      this.updateHUD();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextStage() {
      if (root.inventorAudio) root.inventorAudio.playMachineStart();
      this.renderStage(this.state.currentStage + 1);
    }

    prevStage() {
      this.renderStage(this.state.currentStage - 1);
    }

    updateHUD() {
      const stagePill = document.getElementById('hud-stage-name');
      if (stagePill) {
        stagePill.textContent = this.stageNames[this.state.currentStage - 1] || `Stage ${this.state.currentStage}`;
      }
      const scoreA = document.getElementById('score-teamA');
      const scoreB = document.getElementById('score-teamB');
      if (scoreA) scoreA.textContent = this.state.scores.teamA;
      if (scoreB) scoreB.textContent = this.state.scores.teamB;
    }

    addScore(team, pts) {
      if (this.state.scores[team] !== undefined) {
        this.state.scores[team] += pts;
        this.updateHUD();
        if (root.inventorAudio) root.inventorAudio.playSuccess();
        this.showToast(`+${pts} point to ${team === 'teamA' ? 'Team Alpha' : 'Team Beta'}!`);
      }
    }

    // --- STAGE 2: HOTSPOT LOGIC ---
    selectHotspot(id) {
      this.state.selectedHotspot = id;
      if (!this.state.discoveredHotspots.includes(id)) {
        this.state.discoveredHotspots.push(id);
      }
      if (root.inventorAudio) root.inventorAudio.playIdeaPing();
      this.renderStage(2);

      const item = INVENTOR_DATA.hotspots.find(h => h.id === id);
      if (item && root.inventorAudio) {
        root.inventorAudio.speak(item.sentence);
      }
    }

    // --- STAGE 3: SEE / THINK / WONDER LOGIC ---
    sortSTWItem(itemId, chosenCategory) {
      const item = INVENTOR_DATA.seeThinkWonderItems.find(it => it.id === itemId);
      if (!item) return;

      if (item.category === chosenCategory) {
        this.state.stwPlaced[itemId] = chosenCategory;
        if (root.inventorAudio) root.inventorAudio.playSuccess();
        this.showToast(`✓ Correct! "${item.text}" is ${chosenCategory.toUpperCase()}!`);
        this.renderStage(3);
      } else {
        if (root.inventorAudio) root.inventorAudio.playTryAgain();
        this.showToast(`Not quite! Hint: ${item.hint}`);
      }
    }

    // --- STAGE 4: QUIZ & CYCLE LOGIC ---
    answerFirstStepQuiz(optId) {
      this.state.firstStepAnswer = optId;
      const opt = INVENTOR_DATA.firstStepQuiz.options.find(o => o.id === optId);
      if (opt && opt.correct) {
        if (root.inventorAudio) root.inventorAudio.playSuccess();
        this.addScore('teamA', 1);
        this.addScore('teamB', 1);
      } else {
        if (root.inventorAudio) root.inventorAudio.playTryAgain();
      }
      this.renderStage(4);
    }

    selectCycleStep(stepNum) {
      this.state.activeCycleStep = stepNum;
      if (root.inventorAudio) root.inventorAudio.playGearClick();
      this.renderStage(4);
    }

    // --- STAGE 5: READING & EVIDENCE DETECTIVE ---
    nextStoryPage() {
      if (this.state.storyPageIdx < INVENTOR_DATA.claraStory.passages.length - 1) {
        this.state.storyPageIdx++;
        this.state.evidenceFeedback = null;
        this.renderStage(5);
      }
    }

    prevStoryPage() {
      if (this.state.storyPageIdx > 0) {
        this.state.storyPageIdx--;
        this.state.evidenceFeedback = null;
        this.renderStage(5);
      }
    }

    checkEvidenceLine(lineId, key) {
      const missions = INVENTOR_DATA.claraStory.evidenceMissions;
      const currentMission = missions[this.state.currentMissionIndex || 0];

      if (key && key === currentMission.targetKey) {
        if (!this.state.correctStoryLines.includes(lineId)) {
          this.state.correctStoryLines.push(lineId);
        }
        this.state.evidenceFeedback = {
          success: true,
          text: `🎉 EXCELLENT EVIDENCE! ${currentMission.explanation}`
        };
        if (root.inventorAudio) root.inventorAudio.playSuccess();
        this.addScore('teamA', 2);
      } else {
        this.state.selectedStoryLine = lineId;
        this.state.evidenceFeedback = {
          success: false,
          text: "Look closely at the question! Can you find the exact sentence that answers it?"
        };
        if (root.inventorAudio) root.inventorAudio.playTryAgain();
      }
      this.renderStage(5);
    }

    advanceMission() {
      const missions = INVENTOR_DATA.claraStory.evidenceMissions;
      this.state.currentMissionIndex = ((this.state.currentMissionIndex || 0) + 1) % missions.length;
      this.state.selectedStoryLine = null;
      this.state.evidenceFeedback = null;

      // Auto flip to the corresponding page if needed
      const nextMission = missions[this.state.currentMissionIndex];
      const targetPassageIdx = INVENTOR_DATA.claraStory.passages.findIndex(p => p.textLines.some(l => l.key === nextMission.targetKey));
      if (targetPassageIdx !== -1) {
        this.state.storyPageIdx = targetPassageIdx;
      }

      this.renderStage(5);
    }

    openGlossaryModal() {
      const modal = document.getElementById('inventor-modal');
      const modalBody = document.getElementById('modal-content-area');
      if (!modal || !modalBody) return;

      const glossary = INVENTOR_DATA.claraStory.glossary;
      modalBody.innerHTML = `
        <h2 style="color:var(--amber-gold); font-size:1.6rem; margin-bottom:16px;">
          📚 Words in Context Glossary
        </h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; max-height:60vh; overflow-y:auto; padding-right:8px;">
          ${glossary.map(g => `
            <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-weight:900; color:#38bdf8; font-size:1.1rem;">${g.icon} ${g.word}</span>
                <button class="hud-btn" style="padding:2px 8px; font-size:0.75rem;" onclick="window.inventorAudio.speak('${g.word}')">🔊</button>
              </div>
              <p style="font-size:0.9rem; color:#cbd5e1; line-height:1.4;">${g.def}</p>
            </div>
          `).join('')}
        </div>
      `;
      modal.style.display = 'flex';
    }

    closeModal() {
      const modal = document.getElementById('inventor-modal');
      if (modal) modal.style.display = 'none';
    }

    // --- STAGE 6: BINARY SORTING LOGIC ---
    answerScenario(chosenIsInventor) {
      const scenarios = INVENTOR_DATA.inventorScenarios;
      const idx = this.state.scenarioIndex || 0;
      const current = scenarios[idx];

      const isCorrect = (chosenIsInventor === current.isInventor);
      this.state.scenarioAnswer = {
        correct: isCorrect
      };

      if (isCorrect) {
        if (root.inventorAudio) root.inventorAudio.playSuccess();
        this.addScore('teamA', 1);
        this.addScore('teamB', 1);
      } else {
        if (root.inventorAudio) root.inventorAudio.playTryAgain();
      }
      this.renderStage(6);
    }

    nextScenario() {
      const scenarios = INVENTOR_DATA.inventorScenarios;
      if (this.state.scenarioIndex < scenarios.length - 1) {
        this.state.scenarioIndex++;
        this.state.scenarioAnswer = null;
        this.renderStage(6);
      } else {
        this.nextStage();
      }
    }

    prevScenario() {
      if (this.state.scenarioIndex > 0) {
        this.state.scenarioIndex--;
        this.state.scenarioAnswer = null;
        this.renderStage(6);
      }
    }

    // --- STAGE 7: DILEMMA LOGIC ---
    selectDilemmaIdea(id) {
      this.state.dilemmaIdea = id;
      this.state.dilemmaTestFailed = true;
      if (root.inventorAudio) root.inventorAudio.playBuildTinker();
      this.renderStage(7);
    }

    answerDilemmaFail(makeChanges) {
      if (makeChanges) {
        this.state.dilemmaFeedback = "🎉 YES! You added rubber mudguards and waterproof covers! The invention is a huge success! +30 Points!";
        if (root.inventorAudio) root.inventorAudio.playSuccess();
        this.addScore('teamA', 2);
        this.addScore('teamB', 2);
      } else {
        this.state.dilemmaFeedback = "Remember Clara Doodle: 'OK, some ideas are not so good ... but I always try again!'";
        if (root.inventorAudio) root.inventorAudio.playTryAgain();
      }
      this.renderStage(7);
    }

    // --- STAGE 8: BUILDER LOGIC ---
    setBuilderPart(partType, id) {
      this.state[partType] = id;
      if (root.inventorAudio) root.inventorAudio.playBuildTinker();
      this.renderStage(8);
    }

    setBuilderName(name) {
      this.state.builderName = name || "The Turbo-Helper 3000";
      this.renderStage(8);
    }

    randomizeBuilderName() {
      const names = INVENTOR_DATA.builder.nameSuggestions;
      const rand = names[Math.floor(Math.random() * names.length)];
      this.state.builderName = rand;
      if (root.inventorAudio) root.inventorAudio.playIdeaPing();
      this.renderStage(8);
    }

    // --- STAGE 9: PITCH VOTING LOGIC ---
    votePitchAward(awardId) {
      this.state.pitchVotes[awardId] = (this.state.pitchVotes[awardId] || 0) + 1;
      if (root.inventorAudio) root.inventorAudio.playIdeaPing();
      this.renderStage(9);
    }

    // --- TEACHER MODAL & UTILS ---
    openTeacherModal() {
      const modal = document.getElementById('inventor-modal');
      const modalBody = document.getElementById('modal-content-area');
      if (!modal || !modalBody) return;

      modalBody.innerHTML = `
        <h2 style="color:#38bdf8; font-size:1.6rem; margin-bottom:16px;">
          ⚙️ Teacher Control Center
        </h2>
        <p style="color:#cbd5e1; margin-bottom:16px;">Directly jump to any stage or adjust classroom settings:</p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
          ${this.stageNames.map((name, idx) => `
            <button class="hud-btn" style="justify-content:flex-start; padding:10px;" onclick="window.inventorApp.renderStage(${idx + 1}); window.inventorApp.closeModal();">
              ${name}
            </button>
          `).join('')}
        </div>

        <div style="border-top:1px solid var(--border-subtle); padding-top:16px; display:flex; justify-content:space-between; align-items:center;">
          <button class="hud-btn" onclick="window.inventorApp.resetLesson(); window.inventorApp.closeModal();" style="border-color:#f43f5e; color:#fecdd3;">
            🔄 Reset Lesson State
          </button>
          <a href="worksheet.html" target="_blank" class="hud-btn gold" style="text-decoration:none;">
            🖨️ Printable Worksheets
          </a>
        </div>
      `;
      modal.style.display = 'flex';
    }

    resetLesson() {
      this.state.currentStage = 1;
      this.state.scores = { teamA: 0, teamB: 0 };
      this.state.discoveredHotspots = ['boy'];
      this.state.stwPlaced = {};
      this.state.firstStepAnswer = null;
      this.state.currentMissionIndex = 0;
      this.state.storyPageIdx = 0;
      this.state.scenarioIndex = 0;
      this.state.scenarioAnswer = null;
      this.renderStage(1);
      this.showToast("Lesson reset to beginning!");
    }

    showToast(msg) {
      const toast = document.getElementById('inventor-toast');
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2600);
    }
  }

  root.InventorApp = InventorApp;
  root.inventorApp = new InventorApp();

  document.addEventListener('DOMContentLoaded', () => {
    window.inventorApp.init();
  });

})(typeof window !== 'undefined' ? window : this);
