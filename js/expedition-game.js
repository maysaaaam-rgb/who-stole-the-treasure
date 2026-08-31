/**
 * THE LAST EXPEDITION: GAME ENGINE
 * Manages Section 0: Expedition Training (7 Mini-Games)
 * + 10 Sequential Story Scenes, Storm Countdown, and composite scoring.
 */

class ExpeditionGameEngine {
  constructor() {
    this.mode = "training"; // 'training' or 'story'
    this.trainingGameIndex = 0; // 0 to 6 (Games 1 to 7)

    // Training sub-state
    this.lookFindIndex = 0;
    this.matchWordIndex = 0;
    this.whatAmIIndex = 0;
    this.memoryState = "countdown"; // 'countdown', 'guessing', 'done'
    this.selectedMemoryItems = [];
    this.packedItems = [];
    this.whichOneIndex = 0;
    this.useWordIndex = 0;

    // Main Story state
    this.currentSceneIndex = 0; // 0 to 9 (Scene 1 to 10)
    this.stormMinutesLeft = 60;
    
    // Scores
    this.scores = {
      training: 0,
      predictions: 0,
      evidence: 0,
      clil: 0,
      reasoning: 0,
      total: 0
    };

    // Expedition Log History
    this.history = [];
  }

  getCurrentScene() {
    return EXPEDITION_DATA.scenes[this.currentSceneIndex];
  }

  addScore(category, points) {
    this.scores[category] = (this.scores[category] || 0) + points;
    this.scores.total = this.scores.training + this.scores.predictions + this.scores.evidence + this.scores.clil + this.scores.reasoning;
    if (window.expeditionUI) window.expeditionUI.updateHeader();
  }

  // Record a team prediction in Main Story
  recordPrediction(predictionId, selectedReasonText = "") {
    const scene = this.getCurrentScene();
    const opt = (scene.predictionOptions || scene.decisionOptions || []).find(o => o.id === predictionId);

    let earnedPts = 0;
    if (opt) {
      if (opt.isBest) {
        earnedPts += 3;
        this.addScore("predictions", 3);
      } else {
        earnedPts += 1;
        this.addScore("predictions", 1);
      }

      if (selectedReasonText) {
        earnedPts += 2;
        this.addScore("reasoning", 2);
      }

      this.history.push({
        sceneNum: scene.sceneNum,
        sceneTitle: scene.title,
        choice: opt.text,
        isBest: opt.isBest,
        points: earnedPts
      });

      return { success: true, option: opt, points: earnedPts };
    }
    return { success: false };
  }

  // Check Riddle in Story
  checkRiddle(input) {
    const scene = this.getCurrentScene();
    if (!scene.riddle) return { success: false };

    const clean = (input || "").trim().toLowerCase();
    const isMatch = scene.riddle.acceptableAnswers.some(ans => clean.includes(ans.toLowerCase()));

    if (isMatch) {
      this.addScore("clil", 3);
      return { success: true };
    }
    return { success: false };
  }

  startMainStory() {
    this.mode = "story";
    this.currentSceneIndex = 0;
    this.stormMinutesLeft = 60;
  }

  resetAll() {
    this.mode = "training";
    this.trainingGameIndex = 0;
    this.lookFindIndex = 0;
    this.matchWordIndex = 0;
    this.whatAmIIndex = 0;
    this.memoryState = "countdown";
    this.selectedMemoryItems = [];
    this.packedItems = [];
    this.whichOneIndex = 0;
    this.useWordIndex = 0;

    this.currentSceneIndex = 0;
    this.stormMinutesLeft = 60;
    this.scores = { training: 0, predictions: 0, evidence: 0, clil: 0, reasoning: 0, total: 0 };
    this.history = [];
  }
}

window.expeditionEngine = new ExpeditionGameEngine();
