/**
 * 🌿 LIFE IN THE JUNGLE: THE JUNGLE RANGERS
 * Central Game State Machine & Progress Store
 */

export class GameState {
  constructor() {
    this.currentPhaseIndex = 0; // 0 to 21
    this.currentSubActivity = 1; // 1 to 9 for Phase 1
    this.ecosystemHealth = 100; // 0 to 100%
    this.rangerName = 'Young Ranger';
    this.rangerBadge = 'Junior Explorer';
    this.cluesFound = new Set();
    this.restoredZones = new Set();
    this.reportAnswers = {};
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this));
  }

  setPhase(phaseIndex, subActivity = 1) {
    this.currentPhaseIndex = Math.max(0, Math.min(21, phaseIndex));
    this.currentSubActivity = subActivity;

    // Adjust ecosystem health according to story progression
    if (this.currentPhaseIndex <= 2) {
      this.ecosystemHealth = 100; // Peaceful healthy start
    } else if (this.currentPhaseIndex === 3) {
      this.ecosystemHealth = 50;  // Storm strikes
    } else if (this.currentPhaseIndex >= 4 && this.currentPhaseIndex <= 5) {
      this.ecosystemHealth = 25;  // Damaged jungle
    } else if (this.currentPhaseIndex >= 6 && this.currentPhaseIndex <= 10) {
      this.ecosystemHealth = 30 + (this.currentPhaseIndex - 6) * 6; // Suki, Rico, Poppy, Boris recoveries
    } else if (this.currentPhaseIndex >= 11 && this.currentPhaseIndex <= 18) {
      this.ecosystemHealth = 60 + (this.currentPhaseIndex - 11) * 3;
    } else if (this.currentPhaseIndex >= 19) {
      this.ecosystemHealth = 100; // Full restoration & celebration
    }

    this.notify();
  }

  nextPhase() {
    if (this.currentPhaseIndex === 0 && this.currentSubActivity < 9) {
      this.currentSubActivity++;
      this.notify();
    } else {
      this.setPhase(this.currentPhaseIndex + 1, 1);
    }
  }

  prevPhase() {
    if (this.currentPhaseIndex === 0 && this.currentSubActivity > 1) {
      this.currentSubActivity--;
      this.notify();
    } else if (this.currentPhaseIndex > 0) {
      this.setPhase(this.currentPhaseIndex - 1, 1);
    }
  }

  addClue(clueId) {
    this.cluesFound.add(clueId);
    this.notify();
  }

  restoreZone(zoneId) {
    this.restoredZones.add(zoneId);
    this.ecosystemHealth = Math.min(100, this.ecosystemHealth + 15);
    this.notify();
  }

  setRangerName(name) {
    this.rangerName = name || 'Young Ranger';
    this.notify();
  }

  saveReportAnswer(questionId, answer) {
    this.reportAnswers[questionId] = answer;
    this.notify();
  }
}

export const state = new GameState();
