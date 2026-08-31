/**
 * Core Game Engine for "Who Stole the Treasure?" & "Detective Preparation"
 */

class GameEngine {
  constructor() {
    this.scores = { red: 0, blue: 0, green: 0, yellow: 0 };
    this.teamOrder = ["red", "blue", "green", "yellow"];
    this.activeTeamIndex = 0;

    this.currentMode = "hub"; // "hub", "prep", "treasure"
    this.currentSection = "hub"; // hub, prep-intro, prep-mg1, prep-mg2, prep-mg3, prep-mg4, prep-board, prep-classroom, intro, mg1, mg2, mg3, mg4, mg5, boss, investigation, accusation, victory

    // Detective Preparation progression pointers
    this.prepIndex = {
      mg1: 0,
      mg2CharIndex: 0,
      mg3: 0,
      mg4SceneIndex: 0,
      mg4QuestionIndex: 0
    };

    // Treasure Mini-game progression pointers
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

    // Central Shared Case File (Filled during 🗣️ Detective Meetings)
    this.sharedCaseFile = [];

    this.teamAccusations = { red: null, blue: null, green: null, yellow: null };

    this.init();
  }

  init() {
    this.setupMystery();
  }

  // Initialize per-team data with Information Disparity (Initial starter dossier)
  initTeamData() {
    this.teamData = {};
    const suspects = GAME_DATA.suspects;

    this.teamOrder.forEach(teamId => {
      const notebook = {};
      suspects.forEach(s => {
        notebook[s.id] = {
          name: s.name,
          age: null,
          alibi: null,
          canSwim: null,
          canRun: null,
          likesCats: null,
          likesDogs: null,
          hasSister: null,
          hasBrother: null,
          favColor: null
        };
      });

      // Grant starter evidence for the assigned 2 suspects to create information gap!
      const assignedIds = GAME_DATA.teamAssignments[teamId] || [];
      assignedIds.forEach(id => {
        const s = suspects.find(x => x.id === id);
        if (s) {
          notebook[id].age = `${s.age} yo`;
          notebook[id].alibi = s.alibiLocation;
        }
      });

      this.teamData[teamId] = {
        tokens: 4, // Starts with 4 tokens in Phase 1
        eliminated: new Set(),
        notebook: notebook
      };
    });

    this.sharedCaseFile = [];
  }

  // Setup the mystery with indirect relational clues
  setupMystery(selectedThiefId = null) {
    const suspects = GAME_DATA.suspects;

    if (selectedThiefId) {
      this.secretThief = suspects.find(s => s.id === selectedThiefId) || suspects[0];
    } else {
      const randomIdx = Math.floor(Math.random() * suspects.length);
      this.secretThief = suspects[randomIdx];
    }

    this.clues = this.generateIndirectRelationalClues(this.secretThief);
    this.revealedClueCount = 0;
    this.initTeamData();
    this.teamAccusations = { red: null, blue: null, green: null, yellow: null };
  }

  // Generates 5 Indirect / Relational Clues comparing suspects (guaranteed 5-step deduction)
  generateIndirectRelationalClues(thief) {
    const curated = {
      alex: [
        { num: 1, title: "INDIRECT CLUE 1: Ability", icon: "🏊", text: "The thief can do what Emma can do (can swim).", spoken: "Indirect Clue number one: The thief can do what Emma can do.", hint: "Find out who can swim!" },
        { num: 2, title: "INDIRECT CLUE 2: Hair Color", icon: "💇", text: "The thief has the same hair color as Tom and Mia (brown hair).", spoken: "Indirect Clue number two: The thief has brown hair like Tom and Mia.", hint: "Check who has brown hair!" },
        { num: 3, title: "INDIRECT CLUE 3: Age Bracket", icon: "🎂", text: "The thief is NOT the oldest (10) or youngest (8) suspect.", spoken: "Indirect Clue number three: The thief is not the oldest or youngest suspect.", hint: "Find out who is 9 years old!" },
        { num: 4, title: "INDIRECT CLUE 4: Pet Preference", icon: "🐱", text: "The thief likes the same animal as Leo and Mia (cats).", spoken: "Indirect Clue number four: The thief likes cats like Leo and Mia.", hint: "Ask suspects: 'Do you like cats?'" },
        { num: 5, title: "INDIRECT CLUE 5: Final Alibi", icon: "🌳", text: "The thief was at the park and favorite color is blue.", spoken: "Indirect Clue number five: The thief was at the park and favorite color is blue.", hint: "Check who was at the park!" }
      ],
      emma: [
        { num: 1, title: "INDIRECT CLUE 1: Ability", icon: "🏊", text: "The thief can do what Alex can do (can swim).", spoken: "Indirect Clue number one: The thief can swim like Alex.", hint: "Find out who can swim!" },
        { num: 2, title: "INDIRECT CLUE 2: Hair Color", icon: "💇", text: "The thief has brown hair like Mia and Tom.", spoken: "Indirect Clue number two: The thief has brown hair like Mia and Tom.", hint: "Check hair colors!" },
        { num: 3, title: "INDIRECT CLUE 3: Age Bracket", icon: "🎂", text: "The thief is NOT the oldest or youngest suspect (is 9 years old).", spoken: "Indirect Clue number three: The thief is 9 years old.", hint: "Check who is 9 years old!" },
        { num: 4, title: "INDIRECT CLUE 4: Pet Preference", icon: "🐶", text: "The thief likes the same animal as Jack and Tom (dogs).", spoken: "Indirect Clue number four: The thief likes dogs like Jack and Tom.", hint: "Ask: 'Do you like dogs?'" },
        { num: 5, title: "INDIRECT CLUE 5: Final Alibi", icon: "🏠", text: "The thief was at home and favorite color is pink.", spoken: "Indirect Clue number five: The thief was at home and favorite color is pink.", hint: "Check alibis!" }
      ],
      leo: [
        { num: 1, title: "INDIRECT CLUE 1: Pet Preference", icon: "🐱", text: "The thief likes the same animal as Alex and Mia (cats).", spoken: "Indirect Clue number one: The thief likes cats like Alex and Mia.", hint: "Check who likes cats!" },
        { num: 2, title: "INDIRECT CLUE 2: Family", icon: "👧", text: "The thief has a sister like Alex and Mia.", spoken: "Indirect Clue number two: The thief has a sister like Alex and Mia.", hint: "Ask: 'Have you got a sister?'" },
        { num: 3, title: "INDIRECT CLUE 3: Age Comparison", icon: "🎂", text: "The thief is older than Alex and Emma (10 years old).", spoken: "Indirect Clue number three: The thief is older than Alex and Emma.", hint: "Find who is 10 years old!" },
        { num: 4, title: "INDIRECT CLUE 4: Ability", icon: "🏃", text: "The thief CANNOT swim (the thief can run fast).", spoken: "Indirect Clue number four: The thief cannot swim. The thief can run fast.", hint: "Check who can run fast!" },
        { num: 5, title: "INDIRECT CLUE 5: Alibi & Color", icon: "🌊", text: "The thief was at the swimming pool and favorite color is green.", spoken: "Indirect Clue number five: The thief was at the swimming pool and favorite color is green.", hint: "Check alibis!" }
      ],
      mia: [
        { num: 1, title: "INDIRECT CLUE 1: Ability", icon: "🏊", text: "The thief can do what Emma can do (can swim).", spoken: "Indirect Clue number one: The thief can swim like Emma.", hint: "Check who can swim!" },
        { num: 2, title: "INDIRECT CLUE 2: Family", icon: "👧", text: "The thief has a sister like Alex and Jack.", spoken: "Indirect Clue number two: The thief has a sister like Alex and Jack.", hint: "Ask: 'Have you got a sister?'" },
        { num: 3, title: "INDIRECT CLUE 3: Age Comparison", icon: "🎂", text: "The thief is older than Alex and Emma (10 years old).", spoken: "Indirect Clue number three: The thief is older than Alex and Emma.", hint: "Find who is 10 years old!" },
        { num: 4, title: "INDIRECT CLUE 4: Pet Preference", icon: "🐱", text: "The thief likes cats like Alex and Leo.", spoken: "Indirect Clue number four: The thief likes cats like Alex and Leo.", hint: "Ask: 'Do you like cats?'" },
        { num: 5, title: "INDIRECT CLUE 5: Color & Alibi", icon: "🟣", text: "The thief's favorite color is purple and was at the park.", spoken: "Indirect Clue number five: The thief's favorite color is purple and was at the park.", hint: "Check alibis!" }
      ],
      tom: [
        { num: 1, title: "INDIRECT CLUE 1: Ability", icon: "🏃", text: "The thief can run fast like Leo and Lily.", spoken: "Indirect Clue number one: The thief can run fast like Leo and Lily.", hint: "Check who can run fast!" },
        { num: 2, title: "INDIRECT CLUE 2: Hair Color", icon: "💇", text: "The thief has brown hair like Alex and Mia.", spoken: "Indirect Clue number two: The thief has brown hair like Alex and Mia.", hint: "Check hair colors!" },
        { num: 3, title: "INDIRECT CLUE 3: Age Comparison", icon: "🎂", text: "The thief is younger than Alex and Emma (8 years old).", spoken: "Indirect Clue number three: The thief is younger than Alex and Emma.", hint: "Find who is 8 years old!" },
        { num: 4, title: "INDIRECT CLUE 4: Pet Preference", icon: "🐶", text: "The thief likes the same animal as Emma and Jack (dogs).", spoken: "Indirect Clue number four: The thief likes dogs like Emma and Jack.", hint: "Ask: 'Do you like dogs?'" },
        { num: 5, title: "INDIRECT CLUE 5: Alibi & Color", icon: "📚", text: "The thief was at the library and favorite color is orange.", spoken: "Indirect Clue number five: The thief was at the library and favorite color is orange.", hint: "Check alibis!" }
      ],
      sara: [
        { num: 1, title: "INDIRECT CLUE 1: Ability", icon: "🏊", text: "The thief can swim like Alex and Emma.", spoken: "Indirect Clue number one: The thief can swim like Alex and Emma.", hint: "Check who can swim!" },
        { num: 2, title: "INDIRECT CLUE 2: Pet Preference", icon: "🐱", text: "The thief likes the same animal as Alex and Mia (cats).", spoken: "Indirect Clue number two: The thief likes cats like Alex and Mia.", hint: "Ask: 'Do you like cats?'" },
        { num: 3, title: "INDIRECT CLUE 3: Age Bracket", icon: "🎂", text: "The thief is NOT the oldest or youngest suspect (9 years old).", spoken: "Indirect Clue number three: The thief is 9 years old.", hint: "Find who is 9 years old!" },
        { num: 4, title: "INDIRECT CLUE 4: Hair Color", icon: "💇", text: "The thief has black hair like Leo and Jack.", spoken: "Indirect Clue number four: The thief has black hair like Leo and Jack.", hint: "Check hair color!" },
        { num: 5, title: "INDIRECT CLUE 5: Alibi & Color", icon: "🟡", text: "The thief was at the swimming pool and favorite color is yellow.", spoken: "Indirect Clue number five: The thief was at the swimming pool and favorite color is yellow.", hint: "Check alibis!" }
      ],
      jack: [
        { num: 1, title: "INDIRECT CLUE 1: Ability", icon: "🏊", text: "The thief can swim like Alex and Emma.", spoken: "Indirect Clue number one: The thief can swim like Alex and Emma.", hint: "Check who can swim!" },
        { num: 2, title: "INDIRECT CLUE 2: Age Comparison", icon: "🎂", text: "The thief is older than Alex, Emma, and Sara (10 years old).", spoken: "Indirect Clue number two: The thief is older than Alex, Emma, and Sara.", hint: "Find who is 10 years old!" },
        { num: 3, title: "INDIRECT CLUE 3: Family", icon: "👧", text: "The thief has a sister like Mia and Alex.", spoken: "Indirect Clue number three: The thief has a sister like Mia and Alex.", hint: "Ask: 'Have you got a sister?'" },
        { num: 4, title: "INDIRECT CLUE 4: Pet Preference", icon: "🐶", text: "The thief likes dogs like Emma and Tom.", spoken: "Indirect Clue number four: The thief likes dogs like Emma and Tom.", hint: "Ask: 'Do you like dogs?'" },
        { num: 5, title: "INDIRECT CLUE 5: Alibi & Color", icon: "🔴", text: "The thief was at the park and favorite color is red.", spoken: "Indirect Clue number five: The thief was at the park and favorite color is red.", hint: "Check alibis!" }
      ],
      lily: [
        { num: 1, title: "INDIRECT CLUE 1: Ability", icon: "🏃", text: "The thief can run fast like Leo and Tom.", spoken: "Indirect Clue number one: The thief can run fast like Leo and Tom.", hint: "Check who can run fast!" },
        { num: 2, title: "INDIRECT CLUE 2: Hair Color", icon: "💇", text: "The thief has brown hair like Alex and Mia.", spoken: "Indirect Clue number two: The thief has brown hair like Alex and Mia.", hint: "Check hair colors!" },
        { num: 3, title: "INDIRECT CLUE 3: Age Comparison", icon: "🎂", text: "The thief is younger than Alex and Emma (8 years old).", spoken: "Indirect Clue number three: The thief is younger than Alex and Emma.", hint: "Find who is 8 years old!" },
        { num: 4, title: "INDIRECT CLUE 4: Pet Preference", icon: "🐱", text: "The thief likes cats like Alex and Mia.", spoken: "Indirect Clue number four: The thief likes cats like Alex and Mia.", hint: "Ask: 'Do you like cats?'" },
        { num: 5, title: "INDIRECT CLUE 5: Alibi & Color", icon: "🌿", text: "The thief was at home and favorite color is mint.", spoken: "Indirect Clue number five: The thief was at home and favorite color is mint.", hint: "Check alibis!" }
      ]
    };

    return curated[thief.id] || curated.alex;
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
      } else if (amount < 0 && window.soundEngine) {
        window.soundEngine.playWrong();
      }
    }
    return this.scores[teamId];
  }

  // --- Per-Team Token Management with Question Costs ---

  getTeamTokens(teamId) {
    return this.teamData[teamId] ? this.teamData[teamId].tokens : 0;
  }

  hasEnoughTokens(teamId, cost) {
    return this.getTeamTokens(teamId) >= cost;
  }

  useTeamTokens(teamId, cost) {
    if (this.teamData[teamId] && this.teamData[teamId].tokens >= cost) {
      this.teamData[teamId].tokens -= cost;
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

  // --- Detective Notebook & Question Handling ---

  askQuestionForTeam(teamId, suspectId, questionId) {
    const suspect = GAME_DATA.suspects.find(s => s.id === suspectId);
    const qObj = GAME_DATA.interrogationQuestions.find(q => q.id === questionId);
    const teamObj = GAME_DATA.teams.find(t => t.id === teamId);

    if (!suspect || !qObj || !this.teamData[teamId]) return null;

    const answer = qObj.getAnswer(suspect);
    const spoken = qObj.getSpoken(suspect);
    const notebookValue = qObj.getNotebookValue(suspect);

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

  // Share a fact from team notebook to the Central Shared Case File during Detective Meeting
  shareFactToCaseFile(teamId, suspectId, fieldKey) {
    const suspect = GAME_DATA.suspects.find(s => s.id === suspectId);
    const team = GAME_DATA.teams.find(t => t.id === teamId);
    const val = this.teamData[teamId].notebook[suspectId][fieldKey];

    if (!suspect || !val) return;

    const qObj = GAME_DATA.interrogationQuestions.find(q => q.fieldKey === fieldKey);
    const label = qObj ? qObj.fieldLabel : fieldKey;

    const entry = {
      teamName: team.name,
      teamEmoji: team.emoji,
      suspectName: suspect.name,
      suspectAvatar: suspect.avatar,
      label: label,
      value: val,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update all other teams' notebooks with this shared fact!
    this.teamOrder.forEach(tId => {
      this.teamData[tId].notebook[suspectId][fieldKey] = val;
    });

    this.sharedCaseFile.push(entry);
    if (window.soundEngine) window.soundEngine.playPoint();
  }

  // --- Accusation Checking & Penalty ---

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
    this.prepIndex = { mg1: 0, mg2CharIndex: 0, mg3: 0, mg4SceneIndex: 0, mg4QuestionIndex: 0 };
    this.bossUnlockedKeys = [false, false, false, false, false];
    this.setupMystery();
  }
}

// Global Game Engine Instance
window.gameEngine = new GameEngine();
