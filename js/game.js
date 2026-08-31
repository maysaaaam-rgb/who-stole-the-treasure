/**
 * Core Game Engine for "Who Stole the Treasure?"
 * Features:
 * - Completely HIDDEN suspect cards (discoverable ONLY via interviews)
 * - Independent Per-Team Investigation Notebooks (🔴 Red, 🔵 Blue, 🟢 Green, 🟡 Yellow)
 * - Per-Team Question Limit (3 🔎 Tokens Each, with teacher refill)
 * - Overlapping multi-clue mystery logic
 * - Step-by-step interview interrogation with mandatory speaking checks
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

    // Per-Team Notebooks & Tokens & Eliminations
    this.teamData = {};

    this.teamAccusations = { red: null, blue: null, green: null, yellow: null };

    this.init();
  }

  init() {
    this.setupMystery();
  }

  // Initialize or reset the per-team investigation notebooks
  initTeamData() {
    this.teamData = {};
    const suspects = GAME_DATA.suspects;

    this.teamOrder.forEach(teamId => {
      const notebook = {};
      suspects.forEach(s => {
        notebook[s.id] = {
          name: s.name,
          age: null,
          favColor: null,
          likesCats: null,
          likesDogs: null,
          canSwim: null,
          canRun: null,
          hasBrother: null,
          hasSister: null
        };
      });

      this.teamData[teamId] = {
        tokens: 3, // Each team starts with 3 Question Tokens
        eliminated: new Set(),
        notebook: notebook
      };
    });
  }

  // Setup the mystery with overlapping clues
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
    this.clues = this.generateOverlappingClues(this.secretThief);

    this.revealedClueCount = 0;
    this.initTeamData();
    this.teamAccusations = { red: null, blue: null, green: null, yellow: null };
  }

  // 5 Overlapping Clues that require combining evidence and interviews
  generateOverlappingClues(thief) {
    const s = thief;
    return [
      {
        num: 1,
        title: "OFFICIAL CLUE 1: Special Ability",
        icon: s.can === "swim" ? "🏊" : "🏃",
        text: `The thief can ${s.can === "swim" ? "swim" : "run fast"}.`,
        spoken: `Official Clue number one: The thief can ${s.can === "swim" ? "swim" : "run fast"}.`,
        hint: `Interview suspects to find out who can ${s.can}!`
      },
      {
        num: 2,
        title: "OFFICIAL CLUE 2: Favorite Pet",
        icon: s.likes === "cats" ? "🐱" : "🐶",
        text: `The thief likes ${s.likes}.`,
        spoken: `Official Clue number two: The thief likes ${s.likes}.`,
        hint: `Ask suspects: "Do you like ${s.likes}?"`
      },
      {
        num: 3,
        title: "OFFICIAL CLUE 3: Family Member",
        icon: s.has === "sister" ? "👧" : "👦",
        text: `The thief has a ${s.has}.`,
        spoken: `Official Clue number three: The thief has a ${s.has}.`,
        hint: `Ask suspects: "Have you got a ${s.has}?"`
      },
      {
        num: 4,
        title: "OFFICIAL CLUE 4: Age Clue",
        icon: "🎂",
        text: `The thief is ${s.age} years old.`,
        spoken: `Official Clue number four: The thief is ${s.age} years old.`,
        hint: `Ask suspects: "How old are you?"`
      },
      {
        num: 5,
        title: "OFFICIAL CLUE 5: Favorite Color",
        icon: "🎨",
        text: `The thief's favorite color is ${s.favColor}.`,
        spoken: `Official Clue number five: The thief's favorite color is ${s.favColor}.`,
        hint: `Final verification! Ask: "What's your favorite color?"`
      }
    ];
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

  // --- Per-Team Token Management ---

  getTeamTokens(teamId) {
    return this.teamData[teamId] ? this.teamData[teamId].tokens : 0;
  }

  useTeamToken(teamId) {
    if (this.teamData[teamId] && this.teamData[teamId].tokens > 0) {
      this.teamData[teamId].tokens--;
      return true;
    }
    return false;
  }

  addTeamTokens(teamId, amount = 1) {
    if (this.teamData[teamId]) {
      this.teamData[teamId].tokens = Math.max(0, this.teamData[teamId].tokens + amount);
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

  // --- Per-Team Suspect Elimination ---

  toggleTeamElimination(teamId, suspectId) {
    if (!this.teamData[teamId]) return false;
    const elimSet = this.teamData[teamId].eliminated;

    if (elimSet.has(suspectId)) {
      elimSet.delete(suspectId);
      if (window.soundEngine) window.soundEngine.playClick();
      return false; // Restored
    } else {
      elimSet.add(suspectId);
      if (window.soundEngine) window.soundEngine.playEliminate();
      return true; // Eliminated
    }
  }

  isTeamEliminated(teamId, suspectId) {
    return this.teamData[teamId] ? this.teamData[teamId].eliminated.has(suspectId) : false;
  }

  getTeamRemainingSuspectsCount(teamId) {
    if (!this.teamData[teamId]) return GAME_DATA.suspects.length;
    return GAME_DATA.suspects.length - this.teamData[teamId].eliminated.size;
  }

  // --- Detective Notebook Records & Interrogation ---

  askQuestionForTeam(teamId, suspectId, questionId) {
    const suspect = GAME_DATA.suspects.find(s => s.id === suspectId);
    const qObj = GAME_DATA.interrogationQuestions.find(q => q.id === questionId);
    const teamObj = GAME_DATA.teams.find(t => t.id === teamId);

    if (!suspect || !qObj || !this.teamData[teamId]) return null;

    const answer = qObj.getAnswer(suspect);
    const spoken = qObj.getSpoken(suspect);
    const notebookValue = qObj.getNotebookValue(suspect);

    // Record in that specific team's notebook
    if (this.teamData[teamId].notebook[suspectId]) {
      this.teamData[teamId].notebook[suspectId][qObj.fieldKey] = notebookValue;
    }

    return { suspect, question: qObj, answer, spoken, team: teamObj, notebookValue };
  }

  getTeamNotebook(teamId, suspectId) {
    if (this.teamData[teamId] && this.teamData[teamId].notebook[suspectId]) {
      return this.teamData[teamId].notebook[suspectId];
    }
    return null;
  }

  getDiscoveredCountForTeam(teamId, suspectId) {
    const nb = this.getTeamNotebook(teamId, suspectId);
    if (!nb) return 0;
    let count = 0;
    Object.keys(nb).forEach(k => {
      if (k !== 'name' && nb[k] !== null) count++;
    });
    return count;
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
