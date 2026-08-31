/**
 * THE LAST EXPEDITION: GAME ENGINE
 * Manages 10 sequential narrative scenes, storm countdown timer,
 * prediction evaluation, reasoning bonus points, CLIL science checks, and expedition logs.
 */

class ExpeditionGameEngine {
  constructor() {
    this.currentSceneIndex = 0; // 0 to 9 (Scene 1 to 10)
    this.stormMinutesLeft = 60;
    
    // Detailed Score Categories
    this.scores = {
      predictions: 0,
      evidence: 0,
      clil: 0,
      reasoning: 0,
      total: 0
    };

    // Expedition Log History
    this.history = [];

    // State of Current Scene
    this.sceneState = "observe"; // 'observe', 'discuss', 'predict', 'reveal', 'solve'
  }

  getCurrentScene() {
    return EXPEDITION_DATA.scenes[this.currentSceneIndex];
  }

  addScore(category, points) {
    this.scores[category] = (this.scores[category] || 0) + points;
    this.scores.total = this.scores.predictions + this.scores.evidence + this.scores.clil + this.scores.reasoning;
    if (window.expeditionUI) window.expeditionUI.updateHeader();
  }

  // Record a team prediction
  recordPrediction(predictionId, selectedReasonText = "") {
    const scene = this.getCurrentScene();
    const opt = (scene.predictionOptions || scene.decisionOptions || []).find(o => o.id === predictionId);

    let earnedPts = 0;
    if (opt) {
      if (opt.isBest) {
        earnedPts += 3;
        this.addScore("predictions", 3);
      } else {
        earnedPts += 1; // Partial credit for reasoning
        this.addScore("predictions", 1);
      }

      // Bonus point if student provided verbal/selected reasoning
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

  // Check Riddle
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

  // Advance to next scene
  nextScene() {
    if (this.currentSceneIndex < EXPEDITION_DATA.scenes.length - 1) {
      this.currentSceneIndex++;
      const nextSc = this.getCurrentScene();
      this.stormMinutesLeft = nextSc.stormMinutesLeft;
      this.sceneState = "observe";
      return true;
    }
    return false; // Reached end
  }

  resetAll() {
    this.currentSceneIndex = 0;
    this.stormMinutesLeft = 60;
    this.scores = { predictions: 0, evidence: 0, clil: 0, reasoning: 0, total: 0 };
    this.history = [];
    this.sceneState = "observe";
  }
}

window.expeditionEngine = new ExpeditionGameEngine();
