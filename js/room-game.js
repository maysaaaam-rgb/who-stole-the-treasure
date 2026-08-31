/**
 * Room Rescue: Core Engine
 * Manages game state, levels 1-9 progression, spatial checks, searches, and points.
 */

class RoomGameEngine {
  constructor() {
    this.score = 0;
    this.currentLevel = 1; // 1 to 9, 'final', 'victory'
    this.searchesLeft = 5;

    // Progression state per level
    this.level1TaskIndex = 0;
    this.level2CompletedItems = new Set();
    this.level3QuestionIndex = 0;
    this.level4FoundItems = new Set();
    this.level5CurrentStep = 1;
    this.level6ChallengeIndex = 0;
    this.level7ChallengeIndex = 0;
    this.level8UserOrder = [];
    this.level9CompletedItems = new Set();
    this.finalMissionStepIndex = 0;

    // Room object placement state
    this.itemLocations = {}; // { books: 'floor', shoes: 'floor', ... }
    this.hiddenFoundMap = {};

    this.init();
  }

  init() {
    this.resetItemLocations();
  }

  resetItemLocations() {
    this.itemLocations = {
      books: "floor",
      shoes: "floor",
      bag: "chair",
      blue_pencil: "floor",
      teddy: "floor",
      clothes: "floor",
      toy_car: "floor"
    };
    this.hiddenFoundMap = {
      key: false,
      red_notebook: false,
      blue_hat: false,
      missing_book: false
    };
  }

  addScore(points) {
    this.score = Math.max(0, this.score + points);
    if (window.soundEngine && points > 0) {
      window.soundEngine.playPoint();
    }
  }

  useSearch() {
    if (this.searchesLeft > 0) {
      this.searchesLeft--;
      return true;
    }
    return false;
  }

  addSearches(amount = 1) {
    this.searchesLeft += amount;
  }

  // --- Level 1 Check ---
  checkLevel1Move(targetZoneId) {
    const task = ROOM_DATA.level1.tasks[this.level1TaskIndex];
    if (!task) return false;
    return task.targetZoneId === targetZoneId;
  }

  // --- Level 2 Check ---
  checkLevel2Move(itemId, targetZoneId) {
    const instruction = ROOM_DATA.level2.instructions.find(i => i.itemId === itemId);
    if (instruction && instruction.targetZoneId === targetZoneId) {
      this.level2CompletedItems.add(itemId);
      this.itemLocations[itemId] = targetZoneId;
      return true;
    }
    return false;
  }

  // --- Level 4 Check ---
  checkLevel4Search(zoneId) {
    const remaining = ROOM_DATA.level4.lostItems.filter(i => !this.level4FoundItems.has(i.id));
    const matched = remaining.find(i => i.correctZoneId === zoneId);

    if (matched) {
      this.level4FoundItems.add(matched.id);
      this.hiddenFoundMap[matched.id] = true;
      return { success: true, item: matched };
    }
    return { success: false };
  }

  // --- Level 5 Check ---
  checkLevel5Search(zoneId) {
    return zoneId === ROOM_DATA.level5.correctZoneId;
  }

  // --- Level 6 Check ---
  checkLevel6Search(zoneId) {
    const ch = ROOM_DATA.level6.challenges[this.level6ChallengeIndex];
    if (ch && ch.correctZoneId === zoneId) {
      return { success: true, challenge: ch };
    }
    return { success: false };
  }

  // --- Level 7 Check ---
  checkLevel7Search(zoneId) {
    const ch = ROOM_DATA.level7.challenges[this.level7ChallengeIndex];
    if (ch && ch.correctZoneId === zoneId) {
      return { success: true, challenge: ch };
    }
    return { success: false };
  }

  // --- Level 8 Sequence Check ---
  checkLevel8Sequence(orderedCardIds) {
    const correctOrder = ["seq_1", "seq_2", "seq_3", "seq_4", "seq_5"];
    let isCorrect = true;
    for (let i = 0; i < correctOrder.length; i++) {
      if (orderedCardIds[i] !== correctOrder[i]) {
        isCorrect = false;
        break;
      }
    }
    return isCorrect;
  }

  // --- Level 9 Check ---
  checkLevel9Move(itemId, targetZoneId) {
    const task = ROOM_DATA.level9.tasks.find(t => t.itemId === itemId);
    if (task && task.targetZoneId === targetZoneId) {
      this.level9CompletedItems.add(itemId);
      return true;
    }
    return false;
  }

  // --- Final Mission Check ---
  checkFinalMissionAction(actionType, id) {
    const step = ROOM_DATA.finalMission.steps[this.finalMissionStepIndex];
    if (!step) return false;

    if (step.type === "move" && actionType === "move") {
      return step.targetZoneId === id;
    }
    if (step.type === "search" && actionType === "search") {
      return step.correctZoneId === id;
    }
    return false;
  }

  // Calculate overall mission completion percentage
  getProgressPercentage() {
    const totalLevels = 10; // 1-9 + Final
    let current = 0;
    if (typeof this.currentLevel === 'number') {
      current = this.currentLevel;
    } else if (this.currentLevel === 'final') {
      current = 9.5;
    } else if (this.currentLevel === 'victory') {
      current = 10;
    }
    return Math.min(100, Math.round((current / totalLevels) * 100));
  }

  resetAll() {
    this.score = 0;
    this.currentLevel = 1;
    this.searchesLeft = 5;
    this.level1TaskIndex = 0;
    this.level2CompletedItems.clear();
    this.level3QuestionIndex = 0;
    this.level4FoundItems.clear();
    this.level5CurrentStep = 1;
    this.level6ChallengeIndex = 0;
    this.level7ChallengeIndex = 0;
    this.level8UserOrder = [];
    this.level9CompletedItems.clear();
    this.finalMissionStepIndex = 0;
    this.resetItemLocations();
  }
}

window.roomGameEngine = new RoomGameEngine();
