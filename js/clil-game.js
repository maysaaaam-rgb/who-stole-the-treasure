/**
 * CLIL CRIME LAB: GAME ENGINE
 * Manages 4 simultaneous or rotational mystery investigations:
 * 🔴 Team Red (Case 1: The Missing Trophy)
 * 🔵 Team Blue (Case 2: The Science Lab Mystery)
 * 🟢 Team Green (Case 3: The Vanishing Painting)
 * 🟡 Team Yellow (Case 4: The Lost Explorer's Map)
 */

class ClilCrimeLabEngine {
  constructor() {
    this.activeCaseId = "red"; // 'red', 'blue', 'green', 'yellow'
    
    // Team Scores
    this.scores = {
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0
    };

    // Case Status & Progression
    this.caseStatus = {
      red: { stage: "story", solved: false, questionsLeft: 3, hintsUsed: { r1: 0, r2: 0 }, evidence: new Set(), yellowAvatarPos: { x: 240, y: 160 } },
      blue: { stage: "story", solved: false, questionsLeft: 3, hintsUsed: { r1: 0, r2: 0 }, evidence: new Set() },
      green: { stage: "story", solved: false, questionsLeft: 3, hintsUsed: { r1: 0, r2: 0 }, evidence: new Set() },
      yellow: { stage: "story", solved: false, questionsLeft: 3, hintsUsed: { r1: 0, r2: 0 }, evidence: new Set(), avatarPos: { x: 240, y: 350 } }
    };

    // Chief Detective Question Log (Yes / No responses)
    this.questionLogs = {
      red: [],
      blue: [],
      green: [],
      yellow: []
    };

    // Accusation History
    this.accusationHistory = {
      red: [],
      blue: [],
      green: [],
      yellow: []
    };
  }

  // Get active case data object
  getActiveCase() {
    return CLIL_DATA.cases[this.activeCaseId];
  }

  getActiveState() {
    return this.caseStatus[this.activeCaseId];
  }

  // Switch active case
  setActiveCase(caseId) {
    if (CLIL_DATA.cases[caseId]) {
      this.activeCaseId = caseId;
    }
  }

  // Add / subtract score for active team
  addScore(points, teamId = null) {
    const targetTeam = teamId || this.activeCaseId;
    this.scores[targetTeam] = Math.max(0, (this.scores[targetTeam] || 0) + points);
    if (window.clilUI) window.clilUI.updateScoreboard();
  }

  // Check Riddle 1 Answer
  checkRiddle1(userInput) {
    const caseData = this.getActiveCase();
    const state = this.getActiveState();
    const cleanInput = (userInput || "").trim().toLowerCase();

    const isMatch = caseData.riddle1.acceptableAnswers.some(ans => cleanInput.includes(ans.toLowerCase()));

    if (isMatch) {
      // Award score based on hints used
      const hints = state.hintsUsed.r1;
      let pts = 3;
      if (hints === 1) pts = 2;
      else if (hints >= 2) pts = 1;

      this.addScore(pts);
      state.evidence.add(caseData.riddle1.revealedEvidence.id);
      return { success: true, evidence: caseData.riddle1.revealedEvidence, points: pts };
    }
    return { success: false };
  }

  // Check Riddle 2 Answer
  checkRiddle2(userInput) {
    const caseData = this.getActiveCase();
    const state = this.getActiveState();
    const cleanInput = (userInput || "").trim().toLowerCase();

    const isMatch = caseData.riddle2.acceptableAnswers.some(ans => cleanInput.includes(ans.toLowerCase()));

    if (isMatch) {
      const hints = state.hintsUsed.r2;
      let pts = 3;
      if (hints === 1) pts = 2;
      else if (hints >= 2) pts = 1;

      this.addScore(pts);
      state.evidence.add(caseData.riddle2.revealedEvidence.id);
      return { success: true, evidence: caseData.riddle2.revealedEvidence, points: pts };
    }
    return { success: false };
  }

  // Use a hint for active case riddle
  useHint(riddleKey) {
    const state = this.getActiveState();
    if (!state.hintsUsed[riddleKey]) state.hintsUsed[riddleKey] = 0;
    if (state.hintsUsed[riddleKey] < 3) {
      state.hintsUsed[riddleKey]++;
      return state.hintsUsed[riddleKey];
    }
    return 3;
  }

  // Ask Teacher a Question (uses 1 token)
  recordQuestion(questionText, teacherAnswer) {
    const state = this.getActiveState();
    if (state.questionsLeft > 0) {
      state.questionsLeft--;
      this.questionLogs[this.activeCaseId].push({
        question: questionText,
        answer: teacherAnswer, // 'YES' or 'NO'
        time: new Date().toLocaleTimeString()
      });
      return true;
    }
    return false;
  }

  // Inspect Scene Object -> Unlocks extra clues
  inspectObject(objectId) {
    const caseData = this.getActiveCase();
    const state = this.getActiveState();
    const obj = caseData.sceneObjects.find(o => o.id === objectId);

    if (obj) {
      this.addScore(1); // Evidence found reward (+1)
      return { success: true, object: obj };
    }
    return { success: false };
  }

  // Final Accusation Checker
  evaluateAccusation(suspectId, selectedEvidenceIds) {
    const caseData = this.getActiveCase();
    const state = this.getActiveState();
    const isSuspectCorrect = (suspectId === caseData.correctSuspectId);

    // Check if at least 2 required pieces of evidence are selected
    const hasRequiredEvidence = caseData.requiredEvidenceIds.every(id => selectedEvidenceIds.includes(id));

    if (isSuspectCorrect && hasRequiredEvidence) {
      state.solved = true;
      state.stage = "solved";
      this.addScore(5); // +5 for correct final answer
      this.addScore(2); // +2 for English deduction explanation
      return { success: true, suspect: caseData.suspects.find(s => s.id === suspectId) };
    } else {
      this.addScore(-2); // -2 penalty for wrong accusation
      this.accusationHistory[this.activeCaseId].push({
        suspectId,
        evidenceIds: selectedEvidenceIds,
        timestamp: new Date().toLocaleTimeString()
      });
      return { 
        success: false, 
        message: "Your evidence isn't strong enough yet! Check the timeline, witness statements, and physical clues again!" 
      };
    }
  }

  // Check if all 4 cases are solved
  isAllCasesSolved() {
    return this.caseStatus.red.solved &&
           this.caseStatus.blue.solved &&
           this.caseStatus.green.solved &&
           this.caseStatus.yellow.solved;
  }

  // Reset entire CLIL lab
  resetAll() {
    this.activeCaseId = "red";
    this.scores = { red: 0, blue: 0, green: 0, yellow: 0 };
    this.caseStatus = {
      red: { stage: "story", solved: false, questionsLeft: 3, hintsUsed: { r1: 0, r2: 0 }, evidence: new Set() },
      blue: { stage: "story", solved: false, questionsLeft: 3, hintsUsed: { r1: 0, r2: 0 }, evidence: new Set() },
      green: { stage: "story", solved: false, questionsLeft: 3, hintsUsed: { r1: 0, r2: 0 }, evidence: new Set() },
      yellow: { stage: "story", solved: false, questionsLeft: 3, hintsUsed: { r1: 0, r2: 0 }, evidence: new Set(), avatarPos: { x: 240, y: 350 } }
    };
    this.questionLogs = { red: [], blue: [], green: [], yellow: [] };
    this.accusationHistory = { red: [], blue: [], green: [], yellow: [] };
  }
}

window.clilEngine = new ClilCrimeLabEngine();
