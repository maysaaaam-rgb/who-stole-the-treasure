/**
 * Core Game Engine for "Who Stole the Treasure?"
 * Manages 4-team state, mini-game progression, mystery engine, dynamic clue synthesis, and suspect interrogation.
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
    this.investigationLog = {}; // suspectId -> array of { questionText, answerText }
    this.teamAccusations = { red: null, blue: null, green: null, yellow: null };

    // History for Undo
    this.actionHistory = [];

    this.init();
  }

  init() {
    this.setupMystery();
  }

  // Setup the mystery with dynamic clues matching the predetermined secret thief
  setupMystery(selectedThiefId = null) {
    const suspects = GAME_DATA.suspects;

    if (selectedThiefId) {
      this.secretThief = suspects.find(s => s.id === selectedThiefId) || suspects[0];
    } else {
      // Pick a random thief
      const randomIdx = Math.floor(Math.random() * suspects.length);
      this.secretThief = suspects[randomIdx];
    }

    // Generate tailored 5-step clues for this specific thief
    this.clues = [
      {
        num: 1,
        title: "CLUE 1: Physical Feature",
        icon: this.secretThief.hairEmoji,
        text: `The thief has ${this.secretThief.hairColor} hair.`,
        spoken: `Clue number one: The thief has ${this.secretThief.hairColor} hair.`,
        hint: `Eliminate suspects who do not have ${this.secretThief.hairColor} hair!`
      },
      {
        num: 2,
        title: "CLUE 2: Special Ability",
        icon: this.secretThief.can === "swim" ? "🏊‍♂️" : "🏃‍♂️",
        text: `The thief can ${this.secretThief.can}.`,
        spoken: `Clue number two: The thief can ${this.secretThief.can}.`,
        hint: `Check who can ${this.secretThief.can}!`
      },
      {
        num: 3,
        title: "CLUE 3: Favorite Pet",
        icon: this.secretThief.likesEmoji,
        text: `The thief likes ${this.secretThief.likes}.`,
        spoken: `Clue number three: The thief likes ${this.secretThief.likes}.`,
        hint: `Look at the animal badges!`
      },
      {
        num: 4,
        title: "CLUE 4: Family Clue",
        icon: this.secretThief.hasEmoji,
        text: `The thief has a ${this.secretThief.has}.`,
        spoken: `Clue number four: The thief has a ${this.secretThief.has}.`,
        hint: `Does the suspect have a ${this.secretThief.has}?`
      },
      {
        num: 5,
        title: "CLUE 5: Age Clue",
        icon: "🎂",
        text: `The thief is ${this.secretThief.age} years old.`,
        spoken: `Clue number five: The thief is ${this.secretThief.age} years old.`,
        hint: `Only ${this.secretThief.age}-year-olds remain!`
      }
    ];

    this.revealedClueCount = 0;
    this.eliminatedSuspects.clear();
    this.investigationLog = {};
    suspects.forEach(s => {
      this.investigationLog[s.id] = [];
    });
    this.teamAccusations = { red: null, blue: null, green: null, yellow: null };
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

    if (!suspect || !qObj) return null;

    const answer = qObj.getAnswer(suspect);
    const spoken = qObj.getSpoken(suspect);

    const record = {
      qId: questionId,
      question: qObj.text,
      answer: answer,
      spoken: spoken,
      timestamp: new Date().toLocaleTimeString()
    };

    if (!this.investigationLog[suspectId]) {
      this.investigationLog[suspectId] = [];
    }

    // Add if not already asked
    const exists = this.investigationLog[suspectId].some(r => r.qId === questionId);
    if (!exists) {
      this.investigationLog[suspectId].push(record);
    }

    return { suspect, question: qObj, answer, spoken };
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
    this.setupMystery();
  }
}

// Global Game Engine Instance
window.gameEngine = new GameEngine();
