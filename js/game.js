/**
 * Core Game Engine for "Who Stole the Treasure?"
 * Manages 4-team state, mini-game progression, mystery engine, dynamic clue synthesis,
 * deductive clue sequencing, question token budgets, and suspect interrogation.
 */

class GameEngine {
  constructor() {
    this.scores = { red: 0, blue: 0, green: 0, yellow: 0 };
    this.teamOrder = ["red", "blue", "green", "yellow"];
    this.activeTeamIndex = 0;

    this.currentSection = "intro"; // intro, mg1, mg2, mg3, mg4, mg5, boss, investigation, accusation, victory

    // Mini-game progression pointers
    this.mgIndex = {
      mg1: 0,
      mg2: 0,
      mg3: 0,
      mg4: 0,
      mg5: 0,
      boss: 0
    };

    // Boss Lock status
    this.bossUnlockedKeys = [false, false, false, false, false];

    // Mystery Engine State
    this.secretThief = null;
    this.clues = [];
    this.revealedClueCount = 0;
    this.eliminatedSuspects = new Set();
    this.investigationLog = {}; // suspectId -> array of { questionText, answerText, teamId }
    this.teamAccusations = { red: null, blue: null, green: null, yellow: null };

    // Limited Question Token Budget for Interrogation Strategy
    this.questionTokens = 4;
    this.maxQuestionTokens = 4;

    this.init();
  }

  init() {
    this.setupMystery();
  }

  // Setup the mystery with curated overlapping & deductive clue sequences
  setupMystery(selectedThiefId = null) {
    const suspects = GAME_DATA.suspects;

    if (selectedThiefId) {
      this.secretThief = suspects.find(s => s.id === selectedThiefId) || suspects[0];
    } else {
      // Pick a random thief
      const randomIdx = Math.floor(Math.random() * suspects.length);
      this.secretThief = suspects[randomIdx];
    }

    // Build curated multi-step deductive clues for the specific thief
    this.clues = this.generateDeductiveClues(this.secretThief);

    this.revealedClueCount = 0;
    this.questionTokens = 4;
    this.eliminatedSuspects.clear();
    this.investigationLog = {};
    suspects.forEach(s => {
      this.investigationLog[s.id] = [];
    });
    this.teamAccusations = { red: null, blue: null, green: null, yellow: null };
  }

  // Curated 5-Step Deductive Clue Sequences (Combining positive, negative, and red-herring evidence)
  generateDeductiveClues(thief) {
    switch (thief.id) {
      case "alex": // Brown, 9yo, Cats, Swim, Sister
        return [
          {
            num: 1,
            title: "CLUE 1: Hair Color",
            icon: "🟤",
            text: "The thief has brown hair.",
            spoken: "Clue number one: The thief has brown hair.",
            type: "filter",
            matchingIds: ["alex", "mia", "tom"],
            note: "Narrows suspects to 3 (Alex, Mia, Tom)!"
          },
          {
            num: 2,
            title: "CLUE 2: Age Deduction",
            icon: "🎂",
            text: "The thief is NOT 8 years old.",
            spoken: "Clue number two: The thief is not eight years old.",
            type: "negative",
            matchingIds: ["alex", "mia"],
            note: "Tom is 8, so Tom is eliminated! (Alex & Mia remain)"
          },
          {
            num: 3,
            title: "CLUE 3: Ability (Red Herring!)",
            icon: "🏊‍♂️",
            text: "The thief can swim.",
            spoken: "Clue number three: The thief can swim.",
            type: "red-herring",
            matchingIds: ["alex", "mia"],
            note: "Both Alex and Mia can swim! Need more evidence!"
          },
          {
            num: 4,
            title: "CLUE 4: Favorite Animal",
            icon: "🐱",
            text: "The thief likes cats (does NOT like dogs).",
            spoken: "Clue number four: The thief likes cats and does not like dogs.",
            type: "filter",
            matchingIds: ["alex"],
            note: "Alex likes cats, Mia likes dogs! Alex is the prime suspect!"
          },
          {
            num: 5,
            title: "CLUE 5: Family Verification",
            icon: "👧",
            text: "The thief has a sister.",
            spoken: "Clue number five: The thief has a sister.",
            type: "confirm",
            matchingIds: ["alex"],
            note: "Final confirmation: Alex has a sister!"
          }
        ];

      case "emma": // Blonde, 9yo, Dogs, Swim, Brother
        return [
          {
            num: 1,
            title: "CLUE 1: Ability Clue",
            icon: "🏊‍♀️",
            text: "The thief can swim.",
            spoken: "Clue number one: The thief can swim.",
            type: "filter",
            matchingIds: ["alex", "emma", "mia", "sara"],
            note: "4 suspects can swim (Alex, Emma, Mia, Sara)!"
          },
          {
            num: 2,
            title: "CLUE 2: Favorite Animal",
            icon: "🐶",
            text: "The thief likes dogs (does NOT like cats).",
            spoken: "Clue number two: The thief likes dogs.",
            type: "filter",
            matchingIds: ["emma", "mia", "sara"],
            note: "Alex likes cats, so Alex is eliminated! (Emma, Mia, Sara remain)"
          },
          {
            num: 3,
            title: "CLUE 3: Family Clue",
            icon: "👦",
            text: "The thief has a brother (does NOT have a sister).",
            spoken: "Clue number three: The thief has a brother and does not have a sister.",
            type: "filter",
            matchingIds: ["emma"],
            note: "Mia and Sara have sisters, Emma has a brother! Emma matches!"
          },
          {
            num: 4,
            title: "CLUE 4: Age Verification",
            icon: "🎂",
            text: "The thief is 9 years old.",
            spoken: "Clue number four: The thief is nine years old.",
            type: "confirm",
            matchingIds: ["emma"],
            note: "Emma is 9 years old."
          },
          {
            num: 5,
            title: "CLUE 5: Hair Confirmation",
            icon: "👱‍♀️",
            text: "The thief has blonde hair.",
            spoken: "Clue number five: The thief has blonde hair.",
            type: "confirm",
            matchingIds: ["emma"],
            note: "100% confirmed: Emma!"
          }
        ];

      case "leo": // Black, 10yo, Cats, Run, Sister
        return [
          {
            num: 1,
            title: "CLUE 1: Hair Color",
            icon: "⚫",
            text: "The thief has black hair.",
            spoken: "Clue number one: The thief has black hair.",
            type: "filter",
            matchingIds: ["leo", "sara"],
            note: "Narrows suspects to Leo and Sara!"
          },
          {
            num: 2,
            title: "CLUE 2: Family (Red Herring!)",
            icon: "👧",
            text: "The thief has a sister.",
            spoken: "Clue number two: The thief has a sister.",
            type: "red-herring",
            matchingIds: ["leo", "sara"],
            note: "Both Leo and Sara have a sister! Still tied!"
          },
          {
            num: 3,
            title: "CLUE 3: Age Deduction",
            icon: "🎂",
            text: "The thief is NOT 9 years old (The thief is 10).",
            spoken: "Clue number three: The thief is not nine years old.",
            type: "filter",
            matchingIds: ["leo"],
            note: "Sara is 9, so Sara is eliminated! Leo is 10!"
          },
          {
            num: 4,
            title: "CLUE 4: Ability Clue",
            icon: "🏃‍♂️",
            text: "The thief can run fast (the thief CANNOT swim).",
            spoken: "Clue number four: The thief can run fast, but cannot swim.",
            type: "confirm",
            matchingIds: ["leo"],
            note: "Leo runs fast and cannot swim."
          },
          {
            num: 5,
            title: "CLUE 5: Pet Clue",
            icon: "🐱",
            text: "The thief likes cats.",
            spoken: "Clue number five: The thief likes cats.",
            type: "confirm",
            matchingIds: ["leo"],
            note: "Leo loves cats!"
          }
        ];

      case "mia": // Brown, 10yo, Dogs, Swim, Sister
        return [
          {
            num: 1,
            title: "CLUE 1: Hair Color",
            icon: "🟤",
            text: "The thief has brown hair.",
            spoken: "Clue number one: The thief has brown hair.",
            type: "filter",
            matchingIds: ["alex", "mia", "tom"],
            note: "Narrows suspects to Alex, Mia, and Tom!"
          },
          {
            num: 2,
            title: "CLUE 2: Ability Clue",
            icon: "🏊‍♀️",
            text: "The thief can swim.",
            spoken: "Clue number two: The thief can swim.",
            type: "filter",
            matchingIds: ["alex", "mia"],
            note: "Tom cannot swim, so Tom is eliminated! (Alex & Mia remain)"
          },
          {
            num: 3,
            title: "CLUE 3: Family (Red Herring!)",
            icon: "👧",
            text: "The thief has a sister.",
            spoken: "Clue number three: The thief has a sister.",
            type: "red-herring",
            matchingIds: ["alex", "mia"],
            note: "Both Alex and Mia have a sister! Still tied!"
          },
          {
            num: 4,
            title: "CLUE 4: Favorite Animal",
            icon: "🐶",
            text: "The thief likes dogs (does NOT like cats).",
            spoken: "Clue number four: The thief likes dogs and does not like cats.",
            type: "filter",
            matchingIds: ["mia"],
            note: "Mia likes dogs, Alex likes cats! Mia is isolated!"
          },
          {
            num: 5,
            title: "CLUE 5: Age Verification",
            icon: "🎂",
            text: "The thief is 10 years old.",
            spoken: "Clue number five: The thief is ten years old.",
            type: "confirm",
            matchingIds: ["mia"],
            note: "Confirmed: Mia is 10!"
          }
        ];

      case "tom": // Brown, 8yo, Cats, Run, Brother
        return [
          {
            num: 1,
            title: "CLUE 1: Hair Color",
            icon: "🟤",
            text: "The thief has brown hair.",
            spoken: "Clue number one: The thief has brown hair.",
            type: "filter",
            matchingIds: ["alex", "mia", "tom"],
            note: "Narrows suspects to Alex, Mia, and Tom!"
          },
          {
            num: 2,
            title: "CLUE 2: Favorite Animal",
            icon: "🐱",
            text: "The thief likes cats.",
            spoken: "Clue number two: The thief likes cats.",
            type: "filter",
            matchingIds: ["alex", "tom"],
            note: "Mia likes dogs, so Mia is eliminated! (Alex & Tom remain)"
          },
          {
            num: 3,
            title: "CLUE 3: Ability Deduction",
            icon: "🏃‍♂️",
            text: "The thief CANNOT swim (The thief can run fast).",
            spoken: "Clue number three: The thief cannot swim. The thief can run fast.",
            type: "filter",
            matchingIds: ["tom"],
            note: "Alex can swim, Tom cannot! Tom is the thief!"
          },
          {
            num: 4,
            title: "CLUE 4: Family Clue",
            icon: "👦",
            text: "The thief has a brother (does NOT have a sister).",
            spoken: "Clue number four: The thief has a brother.",
            type: "confirm",
            matchingIds: ["tom"],
            note: "Tom has a brother named Ben."
          },
          {
            num: 5,
            title: "CLUE 5: Age Confirmation",
            icon: "🎂",
            text: "The thief is 8 years old.",
            spoken: "Clue number five: The thief is eight years old.",
            type: "confirm",
            matchingIds: ["tom"],
            note: "Tom is 8 years old."
          }
        ];

      case "sara": // Black, 9yo, Dogs, Swim, Sister
      default:
        return [
          {
            num: 1,
            title: "CLUE 1: Ability Clue",
            icon: "🏊‍♀️",
            text: "The thief can swim.",
            spoken: "Clue number one: The thief can swim.",
            type: "filter",
            matchingIds: ["alex", "emma", "mia", "sara"],
            note: "4 suspects can swim (Alex, Emma, Mia, Sara)!"
          },
          {
            num: 2,
            title: "CLUE 2: Family Clue",
            icon: "👧",
            text: "The thief has a sister.",
            spoken: "Clue number two: The thief has a sister.",
            type: "filter",
            matchingIds: ["alex", "mia", "sara"],
            note: "Emma has a brother, so Emma is eliminated! (Alex, Mia, Sara remain)"
          },
          {
            num: 3,
            title: "CLUE 3: Age Deduction",
            icon: "🎂",
            text: "The thief is 9 years old (NOT 10).",
            spoken: "Clue number three: The thief is nine years old.",
            type: "filter",
            matchingIds: ["alex", "sara"],
            note: "Mia is 10, so Mia is eliminated! (Alex & Sara remain)"
          },
          {
            num: 4,
            title: "CLUE 4: Hair Color",
            icon: "⚫",
            text: "The thief has black hair (does NOT have brown hair).",
            spoken: "Clue number four: The thief has black hair.",
            type: "filter",
            matchingIds: ["sara"],
            note: "Alex has brown hair, Sara has black hair! Sara matches!"
          },
          {
            num: 5,
            title: "CLUE 5: Favorite Pet",
            icon: "🐶",
            text: "The thief likes dogs.",
            spoken: "Clue number five: The thief likes dogs.",
            type: "confirm",
            matchingIds: ["sara"],
            note: "Confirmed: Sara loves dogs!"
          }
        ];
    }
  }

  // --- Team Management & Scoring ---

  getActiveTeam() {
    const id = this.teamOrder[this.activeTeamIndex];
    return GAME_DATA.teams.find(t => t.id === id);
  }

  nextTeam() {
    this.activeTeamIndex = (this.activeTeamIndex + 1) % this.teamOrder.length;
    return this.getActiveTeam();
  }

  setActiveTeam(teamId) {
    const idx = this.teamOrder.indexOf(teamId);
    if (idx !== -1) {
      this.activeTeamIndex = idx;
    }
  }

  addPoints(teamId, amount) {
    if (this.scores[teamId] !== undefined) {
      this.scores[teamId] = Math.max(0, this.scores[teamId] + amount);
      if (amount > 0 && window.soundEngine) {
        window.soundEngine.playPoint();
      }
    }
    return this.scores[teamId];
  }

  setScore(teamId, score) {
    if (this.scores[teamId] !== undefined) {
      this.scores[teamId] = Math.max(0, parseInt(score, 10) || 0);
    }
  }

  // --- Question Token Budget Management ---

  useQuestionToken() {
    if (this.questionTokens > 0) {
      this.questionTokens--;
      return true;
    }
    return false;
  }

  addQuestionTokens(amount = 1) {
    this.questionTokens = Math.max(0, this.questionTokens + amount);
  }

  // --- Clue Operations ---

  revealNextClue() {
    if (this.revealedClueCount < this.clues.length) {
      this.revealedClueCount++;
      if (window.soundEngine) {
        window.soundEngine.playClue();
      }
      return this.clues[this.revealedClueCount - 1];
    }
    return null;
  }

  resetClues() {
    this.revealedClueCount = 0;
  }

  getRevealedClues() {
    return this.clues.slice(0, this.revealedClueCount);
  }

  // Get list of suspects currently fitting all revealed clues
  getMatchingSuspectsFromClues() {
    const revealed = this.getRevealedClues();
    if (revealed.length === 0) {
      return GAME_DATA.suspects.map(s => s.id);
    }
    const latest = revealed[revealed.length - 1];
    return latest.matchingIds || GAME_DATA.suspects.map(s => s.id);
  }

  // --- Suspect Elimination ---

  toggleElimination(suspectId) {
    if (this.eliminatedSuspects.has(suspectId)) {
      this.eliminatedSuspects.delete(suspectId);
      if (window.soundEngine) window.soundEngine.playClick();
      return false; // Not eliminated now
    } else {
      this.eliminatedSuspects.add(suspectId);
      if (window.soundEngine) window.soundEngine.playEliminate();
      return true; // Eliminated now
    }
  }

  isEliminated(suspectId) {
    return this.eliminatedSuspects.has(suspectId);
  }

  getRemainingSuspectsCount() {
    return GAME_DATA.suspects.length - this.eliminatedSuspects.size;
  }

  // --- Investigation Dossier ---

  askQuestion(suspectId, questionId) {
    const suspect = GAME_DATA.suspects.find(s => s.id === suspectId);
    const qObj = GAME_DATA.interrogationQuestions.find(q => q.id === questionId);
    const activeTeam = this.getActiveTeam();

    if (!suspect || !qObj) return null;

    const answer = qObj.getAnswer(suspect);
    const spoken = qObj.getSpoken(suspect);

    const record = {
      qId: questionId,
      question: qObj.text,
      answer: answer,
      spoken: spoken,
      teamId: activeTeam.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!this.investigationLog[suspectId]) {
      this.investigationLog[suspectId] = [];
    }

    // Add record to investigation log
    this.investigationLog[suspectId].push(record);

    return { suspect, question: qObj, answer, spoken, team: activeTeam };
  }

  getSuspectEvidence(suspectId) {
    return this.investigationLog[suspectId] || [];
  }

  // --- Boss Lock Progression ---

  unlockBossKey(index) {
    if (index >= 0 && index < this.bossUnlockedKeys.length) {
      this.bossUnlockedKeys[index] = true;
      if (window.soundEngine) window.soundEngine.playLockClick();
    }
    return this.isBossLockComplete();
  }

  isBossLockComplete() {
    return this.bossUnlockedKeys.every(k => k === true);
  }

  // --- Accusations ---

  setTeamAccusation(teamId, suspectId) {
    this.teamAccusations[teamId] = suspectId;
  }

  checkAccusation(suspectId) {
    return this.secretThief && this.secretThief.id === suspectId;
  }

  // --- Resetting & Restoring ---

  resetFullGame(keepScores = false) {
    if (!keepScores) {
      this.scores = { red: 0, blue: 0, green: 0, yellow: 0 };
    }
    this.activeTeamIndex = 0;
    this.currentSection = "intro";
    this.mgIndex = { mg1: 0, mg2: 0, mg3: 0, mg4: 0, mg5: 0, boss: 0 };
    this.bossUnlockedKeys = [false, false, false, false, false];
    this.questionTokens = 4;
    this.setupMystery();
  }
}

// Global Game Engine Instance
window.gameEngine = new GameEngine();
