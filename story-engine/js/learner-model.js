/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — ADAPTIVE LEARNER MODEL & VOCABULARY MASTERY
 * 
 * Tracks the student's evolving English language competencies:
 * - 5-Stage Vocabulary Mastery State Machine:
 *   [ NEW → EXPOSED → DEVELOPING → FAMILIAR → MASTERED ]
 * - 16-Signal Central Learning Event Bus Listener
 * - CEFR A1/A1+ Vocabulary & Grammar Diagnostics
 * - Behavioral Comprehension & Listening/Speaking Metrics
 * - Zero-Duplicate Architecture: Persists to SchoolStore & LocalStorage
 * - Clean Separation: Operates invisibly behind gameplay with zero score popups
 * ============================================================================
 */

(function(root) {
  'use strict';

  // 5 Canonical Vocabulary Mastery States
  const MASTERY_STATES = {
    NEW: 'NEW',               // 0 - 19%
    EXPOSED: 'EXPOSED',       // 20 - 39%
    DEVELOPING: 'DEVELOPING', // 40 - 69%
    FAMILIAR: 'FAMILIAR',     // 70 - 84%
    MASTERED: 'MASTERED'      // 85 - 100%
  };

  class LearnerModel {
    constructor(eventBus, studentId = null) {
      this.events = eventBus;
      this.studentId = studentId || this._resolveCurrentStudentId();
      
      // Core Vocabulary Ledger: Map of word -> VocabularyItem
      this.vocabulary = new Map();

      // Behavioral & Cognitive Performance Signals
      this.metrics = {
        dialoguesHeard: 0,
        dialoguesUnderstood: 0,
        dialoguesMisunderstood: 0,
        listeningSuccessCount: 0,
        listeningAttempts: 0,
        speakingSuccessCount: 0,
        speakingAttempts: 0,
        hintsRequested: 0,
        hintsUsed: 0,
        repeatedAttempts: 0,
        totalInteractions: 0,
        successfulInteractions: 0,
        unsuccessfulInteractions: 0,
        lastInteractionTime: Date.now(),
        averageResponseTimeMs: 2500
      };

      // Spaced Contextual Exposure Queue
      this.remediationQueue = [];
      this.recycledWords = new Set();

      // Load existing state from storage/store if available
      this._loadState();

      // Bind all 16 learning events from the EventBus
      if (this.events) {
        this._bindLearningEvents();
      }
    }

    _resolveCurrentStudentId() {
      if (root.StoryBridge && root.StoryBridge.getActiveStudent) {
        const s = root.StoryBridge.getActiveStudent();
        if (s && s.id) return s.id;
      }
      return 'student-3a-224';
    }

    // =========================================================================
    // 1. VOCABULARY MASTERY ENGINE
    // =========================================================================

    /**
     * Registers a vocabulary word or retrieves its current mastery record.
     */
    getOrCreateWord(word, meta = {}) {
      const cleanWord = String(word).trim().toLowerCase();
      if (!this.vocabulary.has(cleanWord)) {
        this.vocabulary.set(cleanWord, {
          word: cleanWord,
          category: meta.category || 'general',
          cefr: meta.cefr || 'A1',
          meaning: meta.meaning || '',
          exposureCount: 0,
          successfulInteractions: 0,
          unsuccessfulInteractions: 0,
          hintsUsed: 0,
          listeningSuccess: 0,
          speakingSuccess: 0,
          masteryScore: 0,
          masteryState: MASTERY_STATES.NEW,
          lastSeen: null,
          nextRecommendedExposure: Date.now(),
          encountersInChapters: new Set(),
          history: []
        });
      }
      return this.vocabulary.get(cleanWord);
    }

    /**
     * Recalculates mastery score (0–100) and state based on multi-dimensional evidence:
     * - Repetition across multiple chapters/contexts
     * - Action success ratio
     * - Independent understanding without hints
     * - Listening & speaking successes
     */
    recalculateMastery(item) {
      if (!item) return;

      const totalAttempts = item.successfulInteractions + item.unsuccessfulInteractions;
      const successRatio = totalAttempts > 0 ? (item.successfulInteractions / totalAttempts) : 0;
      
      // Base score from exposure and successful interactions
      let score = 0;

      // 1. Exposure component (up to 20 pts)
      score += Math.min(20, item.exposureCount * 5);

      // 2. Behavioral success component (up to 40 pts)
      score += Math.round(successRatio * 40);

      // 3. Listening component (up to 15 pts)
      if (item.listeningSuccess > 0) {
        score += Math.min(15, item.listeningSuccess * 7.5);
      }

      // 4. Speaking component (up to 15 pts)
      if (item.speakingSuccess > 0) {
        score += Math.min(15, item.speakingSuccess * 10);
      }

      // 5. Context variety bonus (up to 10 pts for encounters in 2+ chapters)
      const chapterCount = item.encountersInChapters ? item.encountersInChapters.size : 1;
      if (chapterCount >= 2) score += 5;
      if (chapterCount >= 3) score += 5;

      // Penalty for heavy hint reliance on this specific word (-5 per hint, max -15)
      const hintPenalty = Math.min(15, item.hintsUsed * 5);
      score = Math.max(0, score - hintPenalty);

      // Clamping to 0-100
      item.masteryScore = Math.min(100, Math.max(0, Math.round(score)));

      // Update state string based on thresholds
      const oldState = item.masteryState;
      if (item.masteryScore >= 85) {
        item.masteryState = MASTERY_STATES.MASTERED;
      } else if (item.masteryScore >= 70) {
        item.masteryState = MASTERY_STATES.FAMILIAR;
      } else if (item.masteryScore >= 40) {
        item.masteryState = MASTERY_STATES.DEVELOPING;
      } else if (item.exposureCount > 0 || item.masteryScore >= 20) {
        item.masteryState = MASTERY_STATES.EXPOSED;
      } else {
        item.masteryState = MASTERY_STATES.NEW;
      }

      // Emit milestone if state increased
      if (oldState !== item.masteryState && this.events) {
        this.events.emit('MASTERY_STATE_CHANGED', {
          word: item.word,
          previousState: oldState,
          newState: item.masteryState,
          masteryScore: item.masteryScore
        });

        if (item.masteryState === MASTERY_STATES.MASTERED) {
          this.events.emit('MASTERY_INCREASED', {
            word: item.word,
            masteryScore: item.masteryScore
          });
        }
      }

      this._saveState();
    }

    // =========================================================================
    // 2. 16-SIGNAL LEARNING EVENT BUS BINDINGS
    // =========================================================================
    _bindLearningEvents() {
      // 1. WORD_EXPOSED
      this.events.on('WORD_EXPOSED', (data) => {
        const item = this.getOrCreateWord(data.word, data);
        item.exposureCount++;
        item.lastSeen = new Date().toISOString();
        if (data.chapter) item.encountersInChapters.add(data.chapter);
        if (item.masteryState === MASTERY_STATES.NEW) {
          item.masteryState = MASTERY_STATES.EXPOSED;
        }
        item.history.push({ event: 'EXPOSED', time: Date.now() });
        this.recalculateMastery(item);
      });

      // 2. WORD_RECOGNIZED
      this.events.on('WORD_RECOGNIZED', (data) => {
        const item = this.getOrCreateWord(data.word, data);
        item.successfulInteractions++;
        item.lastSeen = new Date().toISOString();
        item.history.push({ event: 'RECOGNIZED', time: Date.now() });
        this.recalculateMastery(item);
      });

      // 3. WORD_USED (Active in-game interaction / giving correct item)
      this.events.on('WORD_USED', (data) => {
        const item = this.getOrCreateWord(data.word, data);
        item.successfulInteractions += 2;
        this.metrics.successfulInteractions++;
        this.metrics.totalInteractions++;
        item.lastSeen = new Date().toISOString();
        item.history.push({ event: 'USED', time: Date.now() });
        this.recalculateMastery(item);
      });

      // 4. WORD_MISSED (Wrong item handed or target action misunderstood)
      this.events.on('WORD_MISSED', (data) => {
        const item = this.getOrCreateWord(data.word, data);
        item.unsuccessfulInteractions++;
        this.metrics.unsuccessfulInteractions++;
        this.metrics.totalInteractions++;
        item.lastSeen = new Date().toISOString();
        item.history.push({ event: 'MISSED', time: Date.now() });
        this.recalculateMastery(item);

        // Add to remediation queue if weak
        if (item.masteryScore < 60 && !this.remediationQueue.includes(item.word)) {
          this.remediationQueue.push(item.word);
        }
      });

      // 5. DIALOGUE_HEARD
      this.events.on('DIALOGUE_HEARD', (data) => {
        this.metrics.dialoguesHeard++;
        this.metrics.listeningAttempts++;
      });

      // 6. DIALOGUE_UNDERSTOOD (Correct action followed dialogue instruction)
      this.events.on('DIALOGUE_UNDERSTOOD', (data) => {
        this.metrics.dialoguesUnderstood++;
        this.metrics.listeningSuccessCount++;
        if (data.targetWord) {
          const item = this.getOrCreateWord(data.targetWord);
          item.listeningSuccess++;
          this.recalculateMastery(item);
        }
      });

      // 7. DIALOGUE_MISUNDERSTOOD
      this.events.on('DIALOGUE_MISUNDERSTOOD', (data) => {
        this.metrics.dialoguesMisunderstood++;
        this.metrics.repeatedAttempts++;
      });

      // 8. HINT_REQUESTED
      this.events.on('HINT_REQUESTED', (data) => {
        this.metrics.hintsRequested++;
      });

      // 9. HINT_USED
      this.events.on('HINT_USED', (data) => {
        this.metrics.hintsUsed++;
        if (data.targetWord) {
          const item = this.getOrCreateWord(data.targetWord);
          item.hintsUsed++;
          this.recalculateMastery(item);
        }
      });

      // 10. SPEAKING_ATTEMPT
      this.events.on('SPEAKING_ATTEMPT', (data) => {
        this.metrics.speakingAttempts++;
      });

      // 11. SPEAKING_SUCCESS
      this.events.on('SPEAKING_SUCCESS', (data) => {
        this.metrics.speakingSuccessCount++;
        if (data.targetWord) {
          const item = this.getOrCreateWord(data.targetWord);
          item.speakingSuccess += 2;
          this.recalculateMastery(item);
        }
      });

      // 12. SPEAKING_NEEDS_SUPPORT
      this.events.on('SPEAKING_NEEDS_SUPPORT', (data) => {
        this.metrics.repeatedAttempts++;
      });

      // 13. QUEST_LANGUAGE_SUCCESS
      this.events.on('QUEST_LANGUAGE_SUCCESS', (data) => {
        this.metrics.successfulInteractions++;
        this._recordPlatformLearningEvidence('comprehension', 95, `Successfully completed language objective: ${data.objectiveText || 'Quest'}`);
      });

      // 14. QUEST_LANGUAGE_FAILURE
      this.events.on('QUEST_LANGUAGE_FAILURE', (data) => {
        this.metrics.repeatedAttempts++;
      });

      // 15. REMEDIATION_TRIGGERED
      this.events.on('REMEDIATION_TRIGGERED', (data) => {
        console.log(`[LearnerModel] Remediation triggered for word: "${data.word}" via ${data.method}`);
      });

      // 16. MASTERY_INCREASED
      this.events.on('MASTERY_INCREASED', (data) => {
        this._recordPlatformLearningEvidence('vocabulary', data.masteryScore, `Mastered target word: "${data.word}"`);
      });
    }

    // =========================================================================
    // 3. ADAPTIVE QUERIES FOR AI GAME DIRECTOR
    // =========================================================================

    getWeakVocabulary(threshold = 55) {
      const weak = [];
      for (const [word, item] of this.vocabulary.entries()) {
        if (item.exposureCount > 0 && item.masteryScore < threshold) {
          weak.push(item);
        }
      }
      return weak.sort((a, b) => a.masteryScore - b.masteryScore);
    }

    getMasteredVocabulary() {
      const mastered = [];
      for (const [word, item] of this.vocabulary.entries()) {
        if (item.masteryState === MASTERY_STATES.MASTERED) {
          mastered.push(item);
        }
      }
      return mastered;
    }

    getDevelopingVocabulary() {
      const developing = [];
      for (const [word, item] of this.vocabulary.entries()) {
        if (item.masteryState === MASTERY_STATES.DEVELOPING || item.masteryState === MASTERY_STATES.FAMILIAR) {
          developing.push(item);
        }
      }
      return developing;
    }

    getListeningComprehensionRate() {
      const attempts = this.metrics.listeningAttempts;
      if (attempts === 0) return 1.0;
      return Math.round((this.metrics.listeningSuccessCount / attempts) * 100) / 100;
    }

    getSpeakingAccuracyRate() {
      const attempts = this.metrics.speakingAttempts;
      if (attempts === 0) return 1.0;
      return Math.round((this.metrics.speakingSuccessCount / attempts) * 100) / 100;
    }

    getHintRelianceScore() {
      if (this.metrics.totalInteractions === 0) return 0;
      return Math.round((this.metrics.hintsUsed / Math.max(1, this.metrics.totalInteractions)) * 100) / 100;
    }

    // =========================================================================
    // 4. TEACHER ANALYTICS & SCHOOL STORE PERSISTENCE
    // =========================================================================

    /**
     * Synthesizes meaningful educational analytics for teachers without raw noise.
     */
    getTeacherAnalytics() {
      const weak = this.getWeakVocabulary().map(w => w.word);
      const developing = this.getDevelopingVocabulary().map(w => w.word);
      const mastered = this.getMasteredVocabulary().map(w => w.word);

      const listeningRate = this.getListeningComprehensionRate();
      const listeningStatus = listeningRate >= 0.8 ? 'strong' : (listeningRate >= 0.55 ? 'developing' : 'needs_support');

      const speakingRate = this.getSpeakingAccuracyRate();
      const speakingStatus = speakingRate >= 0.75 ? 'strong' : (speakingRate >= 0.5 ? 'developing' : 'needs_support');

      const comprehensionPct = this.metrics.totalInteractions > 0 
        ? Math.round((this.metrics.successfulInteractions / this.metrics.totalInteractions) * 100)
        : 100;

      return {
        studentId: this.studentId,
        vocabulary: {
          mastered,
          developing,
          needsReinforcement: weak,
          totalTracked: this.vocabulary.size
        },
        listening: {
          ratePct: Math.round(listeningRate * 100),
          status: listeningStatus,
          dialoguesHeard: this.metrics.dialoguesHeard,
          dialoguesUnderstood: this.metrics.dialoguesUnderstood
        },
        speaking: {
          ratePct: Math.round(speakingRate * 100),
          status: speakingStatus,
          speakingAttempts: this.metrics.speakingAttempts,
          speakingSuccessCount: this.metrics.speakingSuccessCount
        },
        questComprehension: {
          successRatePct: comprehensionPct,
          hintsUsed: this.metrics.hintsUsed,
          repeatedAttempts: this.metrics.repeatedAttempts
        }
      };
    }

    _recordPlatformLearningEvidence(skill, score, notes) {
      if (root.schoolStore && typeof root.schoolStore.getStudent === 'function') {
        const student = root.schoolStore.getStudent(this.studentId);
        if (student) {
          if (!root.schoolStore.state.learningEvidence) {
            root.schoolStore.state.learningEvidence = [];
          }
          root.schoolStore.state.learningEvidence.push({
            id: 'ev-story-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            studentId: this.studentId,
            source: 'Alice in Wonderland Adventure',
            skill: skill,
            score: Math.min(100, Math.max(0, Math.round(score))),
            notes: notes,
            date: new Date().toISOString().split('T')[0]
          });
          if (root.schoolStore.saveState) {
            root.schoolStore.saveState();
          }
        }
      }
    }

    _saveState() {
      try {
        const serializedVocab = {};
        for (const [k, v] of this.vocabulary.entries()) {
          serializedVocab[k] = {
            ...v,
            encountersInChapters: Array.from(v.encountersInChapters || [])
          };
        }
        const statePayload = {
          studentId: this.studentId,
          metrics: this.metrics,
          vocabulary: serializedVocab,
          remediationQueue: this.remediationQueue,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem(`story_learner_model_${this.studentId}`, JSON.stringify(statePayload));

        // Connect directly to SchoolStore student profile if available
        if (root.schoolStore && typeof root.schoolStore.getStudent === 'function') {
          const s = root.schoolStore.getStudent(this.studentId);
          if (s) {
            s.storyAdventureModel = {
              masteredCount: this.getMasteredVocabulary().length,
              developingCount: this.getDevelopingVocabulary().length,
              weakCount: this.getWeakVocabulary().length,
              listeningRate: this.getListeningComprehensionRate(),
              speakingRate: this.getSpeakingAccuracyRate(),
              lastActive: new Date().toISOString()
            };
          }
        }
      } catch (err) {
        console.warn('[LearnerModel] Save state error:', err);
      }
    }

    _loadState() {
      try {
        const raw = localStorage.getItem(`story_learner_model_${this.studentId}`);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data.metrics) {
          Object.assign(this.metrics, data.metrics);
        }
        if (data.remediationQueue) {
          this.remediationQueue = data.remediationQueue;
        }
        if (data.vocabulary) {
          for (const [k, v] of Object.entries(data.vocabulary)) {
            this.vocabulary.set(k, {
              ...v,
              encountersInChapters: new Set(v.encountersInChapters || [])
            });
          }
        }
      } catch (err) {
        console.warn('[LearnerModel] Load state error:', err);
      }
    }

    reset() {
      this.vocabulary.clear();
      this.metrics = {
        dialoguesHeard: 0,
        dialoguesUnderstood: 0,
        dialoguesMisunderstood: 0,
        listeningSuccessCount: 0,
        listeningAttempts: 0,
        speakingSuccessCount: 0,
        speakingAttempts: 0,
        hintsRequested: 0,
        hintsUsed: 0,
        repeatedAttempts: 0,
        totalInteractions: 0,
        successfulInteractions: 0,
        unsuccessfulInteractions: 0,
        lastInteractionTime: Date.now(),
        averageResponseTimeMs: 2500
      };
      this.remediationQueue = [];
      this.recycledWords.clear();
      try {
        localStorage.removeItem(`story_learner_model_${this.studentId}`);
      } catch (e) {}
    }
  }

  // Export to namespace
  root.StoryAdaptive = root.StoryAdaptive || {};
  root.StoryAdaptive.MASTERY_STATES = MASTERY_STATES;
  root.StoryAdaptive.LearnerModel = LearnerModel;

})(window);
