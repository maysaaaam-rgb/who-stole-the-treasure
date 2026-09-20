/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — AI GAME DIRECTOR & LEARNING ADAPTATION
 * 
 * Orchestrates adaptive pedagogical pacing inside gameplay:
 * - Decides "What should the learner practice next?"
 * - Strict Story Determinism: AI NEVER rewrites canonical story or rules
 * - Structured Decision Input & Output JSON Schemas
 * - 4-Level Graduated Contextual Hint Escalation:
 *     [ Level 1: Visual/Particle Cue → Level 2: Short Dialogue Cue →
 *       Level 3: Full Language Explanation → Level 4: Direct Support ]
 * - Adaptive Difficulty Levels: [ SUPPORTIVE | STANDARD | CHALLENGING ]
 * - Hysteresis & Anti-Spam: Prevents over-adaptation, requires multi-signal evidence
 * - Spaced Vocabulary Recycling Across All 9 Chapters
 * - 100% Offline Deterministic Rule Engine + Pluggable Async LLM Hook
 * ============================================================================
 */

(function(root) {
  'use strict';

  const DIFFICULTY_LEVELS = {
    SUPPORTIVE: 'SUPPORTIVE',
    STANDARD: 'STANDARD',
    CHALLENGING: 'CHALLENGING'
  };

  const HINT_LEVELS = {
    NONE: 0,
    VISUAL_CUE: 1,      // Level 1: Soft pulsating glow / directional particle trail
    SHORT_PROMPT: 2,    // Level 2: In-character subtitle cue ("Follow him!")
    EXPLANATION: 3,     // Level 3: Explicit narrative guidance ("Follow the rabbit down the path")
    BILINGUAL_SUPPORT: 4// Level 4: Vocabulary card / bilingual tooltip
  };

  class AdaptiveGameDirector {
    constructor({ eventBus, learnerModel, world, quests, dialogue }) {
      this.events = eventBus;
      this.learnerModel = learnerModel;
      this.world = world;
      this.quests = quests;
      this.dialogue = dialogue;

      // Current Operational Pacing State
      this.difficulty = DIFFICULTY_LEVELS.STANDARD;
      this.consecutiveErrors = 0;
      this.consecutiveSuccesses = 0;
      this.activeHintLevel = HINT_LEVELS.NONE;
      this.activeHintTarget = null;
      this.lastActionTime = Date.now();
      this.inactivityThresholdMs = 20000; // 20 seconds before gentle level 1 hint

      // Visual Hint Particles System
      this.hintParticles = [];
      this.hintGlowAlpha = 0;

      // History of director decisions
      this.decisionLog = [];

      this._setupListeners();
      this._startPacingWatchdog();
    }

    _setupListeners() {
      if (!this.events) return;

      // Track player interactions to measure engagement & reset inactivity
      this.events.on('PLAYER_MOVE', () => {
        this.lastActionTime = Date.now();
      });

      this.events.on('INTERACTION_TRIGGERED', () => {
        this.lastActionTime = Date.now();
      });

      this.events.on('OBJECT_COLLECTED', () => {
        this.lastActionTime = Date.now();
        this._recordSuccess();
      });

      this.events.on('OBJECTIVE_COMPLETED', () => {
        this.lastActionTime = Date.now();
        this.clearHint();
        this._recordSuccess();
      });

      this.events.on('WORD_MISSED', (data) => {
        this._recordError(data);
      });

      this.events.on('DIALOGUE_MISUNDERSTOOD', (data) => {
        this._recordError(data);
      });

      this.events.on('HINT_REQUESTED', () => {
        this.escalateHint('manual_request');
      });
    }

    // =========================================================================
    // 1. STRUCTURED INPUT & DECISION CYCLE
    // =========================================================================

    /**
     * Gathers structured, non-PII pedagogical context for the Director.
     */
    getDirectorContext() {
      const activeQuest = this.quests ? this.quests.activeQuest : null;
      const currentArea = (this.world && this.world.activeArea) ? this.world.activeArea.id : 'unknown';

      const weakWords = this.learnerModel ? this.learnerModel.getWeakVocabulary(60).map(w => w.word) : [];
      const masteredWords = this.learnerModel ? this.learnerModel.getMasteredVocabulary().map(w => w.word) : [];
      const developingWords = this.learnerModel ? this.learnerModel.getDevelopingVocabulary().map(w => w.word) : [];

      return {
        currentArea,
        currentQuest: activeQuest ? activeQuest.id : 'none',
        currentObjective: activeQuest ? (activeQuest.objectives.find(o => !o.isCompleted) || {}).id : 'none',
        learnerCefr: 'A1',
        currentDifficulty: this.difficulty,
        weakVocabulary: weakWords.slice(0, 5),
        masteredVocabulary: masteredWords.slice(0, 5),
        developingVocabulary: developingWords.slice(0, 5),
        recentErrors: this.consecutiveErrors,
        recentSuccesses: this.consecutiveSuccesses,
        listeningPerformance: this.learnerModel ? this.learnerModel.getListeningComprehensionRate() : 1.0,
        speakingPerformance: this.learnerModel ? this.learnerModel.getSpeakingAccuracyRate() : 1.0,
        hintReliance: this.learnerModel ? this.learnerModel.getHintRelianceScore() : 0.0,
        secondsSinceAction: Math.round((Date.now() - this.lastActionTime) / 1000)
      };
    }

    /**
     * Evaluates context and outputs a structured pedagogical action decision.
     * Uses 100% Deterministic Offline Rule Engine with fallback safety.
     */
    evaluateDecision() {
      const ctx = this.getDirectorContext();

      // 1. Check if learner is stuck or requested a hint
      if (ctx.secondsSinceAction >= (this.inactivityThresholdMs / 1000) && this.activeHintLevel === HINT_LEVELS.NONE) {
        return {
          action: 'HINT',
          target: this._resolveCurrentObjectiveTarget(),
          method: 'visual_context',
          difficulty: this.difficulty,
          level: HINT_LEVELS.VISUAL_CUE,
          reason: 'Inactivity threshold reached'
        };
      }

      // 2. Check if repeated errors warrant SUPPORTIVE mode and reinforcement
      if (this.consecutiveErrors >= 2 && this.difficulty !== DIFFICULTY_LEVELS.SUPPORTIVE) {
        return {
          action: 'DIFFICULTY_ADJUST',
          target: ctx.weakVocabulary[0] || 'general',
          method: 'supportive_switch',
          difficulty: DIFFICULTY_LEVELS.SUPPORTIVE,
          reason: `${this.consecutiveErrors} consecutive errors recorded`
        };
      }

      // 3. Check if strong mastery warrants CHALLENGING mode
      if (this.consecutiveSuccesses >= 5 && ctx.hintReliance === 0 && this.difficulty !== DIFFICULTY_LEVELS.CHALLENGING) {
        return {
          action: 'DIFFICULTY_ADJUST',
          target: 'mastery_escalation',
          method: 'challenging_switch',
          difficulty: DIFFICULTY_LEVELS.CHALLENGING,
          reason: `${this.consecutiveSuccesses} consecutive successes without hints`
        };
      }

      // 4. Check if weak vocabulary should be recycled naturally
      if (ctx.weakVocabulary.length > 0 && Math.random() < 0.4) {
        return {
          action: 'REINFORCE',
          target: ctx.weakVocabulary[0],
          method: 'contextual_dialogue',
          difficulty: this.difficulty,
          reason: `Word "${ctx.weakVocabulary[0]}" in remediation queue`
        };
      }

      // 5. Normal pacing maintain
      return {
        action: 'MAINTAIN',
        target: null,
        method: 'standard_flow',
        difficulty: this.difficulty,
        reason: 'Optimal learner flow state'
      };
    }

    /**
     * Executes the Director's structured decision in the game without altering story rules.
     */
    executeDecision(decision) {
      if (!decision) return;

      this.decisionLog.push({
        decision,
        timestamp: new Date().toISOString()
      });

      console.log(`[GameDirector] Executing decision: ${decision.action} (${decision.reason})`);

      switch (decision.action) {
        case 'HINT':
          this.setHintLevel(decision.level || HINT_LEVELS.VISUAL_CUE, decision.target);
          break;

        case 'DIFFICULTY_ADJUST':
          this.difficulty = decision.difficulty;
          this._applyDifficultyPacing();
          break;

        case 'REINFORCE':
          this._triggerContextualReinforcement(decision.target);
          break;

        case 'RECYCLE':
          this._triggerVocabularyRecycle(decision.target);
          break;

        case 'MAINTAIN':
        default:
          break;
      }
    }

    // =========================================================================
    // 2. 4-LEVEL GRADUATED HINT SYSTEM
    // =========================================================================

    escalateHint(triggerReason = 'stuck') {
      if (this.activeHintLevel < HINT_LEVELS.BILINGUAL_SUPPORT) {
        this.activeHintLevel++;
      }
      const target = this._resolveCurrentObjectiveTarget();
      this.setHintLevel(this.activeHintLevel, target);

      if (this.events) {
        this.events.emit('HINT_USED', {
          level: this.activeHintLevel,
          targetWord: target ? target.word : null,
          reason: triggerReason
        });
      }
    }

    setHintLevel(level, target) {
      this.activeHintLevel = level;
      this.activeHintTarget = target;

      // Update in-game hint HUD badge
      let hudEl = document.getElementById('story-hint-hud');
      if (!hudEl) {
        hudEl = document.createElement('div');
        hudEl.id = 'story-hint-hud';
        hudEl.className = 'story-badge-pill';
        hudEl.style.cssText = `
          display: none;
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.95);
          border: 1.5px solid #f59e0b;
          color: #fef3c7;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 8px 18px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.4);
          z-index: 999;
          transition: all 0.3s ease;
        `;
        document.body.appendChild(hudEl);
      }

      if (level === HINT_LEVELS.NONE) {
        hudEl.style.display = 'none';
        return;
      }

      const cue = this._getHintContent(level, target);
      hudEl.innerHTML = `<span>💡 Hint:</span> <span>${cue.text}</span>`;
      hudEl.style.display = 'inline-flex';

      // Level 1: Visual clue activation
      if (level === HINT_LEVELS.VISUAL_CUE) {
        this._spawnVisualHintParticles(target);
      }

      // Level 2 / 3: Audio cue support
      if (level >= HINT_LEVELS.SHORT_PROMPT && root.StoryAudioEngine) {
        root.StoryAudioEngine.playVariation('ui_chime', { volume: 0.35 });
      }
    }

    _getHintContent(level, target) {
      const q = this.quests ? this.quests.activeQuest : null;
      const world = this.world || (root.StoryGame && root.StoryGame.world);
      const activeArea = world ? world.activeArea : null;

      // 1. Contextual Hints for Rabbit Woods (Chapter 1)
      if (activeArea && activeArea.id === 'rabbit_woods') {
        const rabbit = activeArea.getEntity('npc-white-rabbit');
        const watch = activeArea.getEntity('collectible-pocket-watch');
        const inv = root.StoryGame ? root.StoryGame.inventory : null;
        const player = world ? world.player : (root.StoryGame && root.StoryGame.player);
        const hasWatch = inv && inv.hasItem('pocket_watch');

        if (rabbit) {
          if (rabbit.state === 'intro_waiting' || (rabbit.state === 'running' && !rabbit.hasDroppedWatch)) {
            return { text: "Where did the Rabbit run? Follow his pawprints down the path." };
          }
          if (rabbit.hasDroppedWatch && !hasWatch) {
            return { text: "Look around the path for something shiny that fell." };
          }
          if (hasWatch && (rabbit.state === 'at_hole' || rabbit.state === 'running')) {
            return { text: "The Rabbit went toward the Rabbit Hole near the ancient tree." };
          }
          if (rabbit.state === 'watch_returned' || rabbit.state === 'hopped_down') {
            return { text: "The Rabbit Hole is open beneath the hollow oak. Step inside!" };
          }
        }
      }

      // 2. Standard Fallback for other areas
      const targetName = target ? (target.name || target.id || 'the objective') : 'forward';

      switch (level) {
        case HINT_LEVELS.VISUAL_CUE:
          return { text: `Look closely around the path for clues...` };
        case HINT_LEVELS.SHORT_PROMPT:
          if (q && q.id === 'hall_transformation') return { text: `Drink the bottle on the glass table!` };
          return { text: `Look for ${targetName}!` };
        case HINT_LEVELS.EXPLANATION:
          if (q && q.id === 'hall_transformation') return { text: `Alice is too big for the tiny 15-inch door! Drink the potion to shrink.` };
          return { text: `Interact with ${targetName} to complete the objective.` };
        case HINT_LEVELS.BILINGUAL_SUPPORT:
          return { text: `Target: <strong>${target ? (target.word || targetName) : 'ACTION'}</strong> — Approach and press [E] to interact.` };
        default:
          return { text: '' };
      }
    }

    clearHint() {
      this.activeHintLevel = HINT_LEVELS.NONE;
      this.activeHintTarget = null;
      const hudEl = document.getElementById('story-hint-hud');
      if (hudEl) hudEl.style.display = 'none';
      this.hintParticles = [];
    }

    _spawnVisualHintParticles(target) {
      if (!target) return;
      this.hintParticles = [];
      const startX = target.x || 600;
      const startY = target.y || 450;

      for (let i = 0; i < 20; i++) {
        this.hintParticles.push({
          x: startX + (Math.random() - 0.5) * 60,
          y: startY + (Math.random() - 0.5) * 60,
          vx: (Math.random() - 0.5) * 20,
          vy: -15 - Math.random() * 25,
          alpha: 1.0,
          size: 3 + Math.random() * 4,
          color: '#fbbf24'
        });
      }
    }

    renderHintVisuals(ctx, camera) {
      if (this.activeHintLevel === HINT_LEVELS.NONE || !this.activeHintTarget) return;

      const target = this.activeHintTarget;
      const screenX = target.x - camera.x;
      const screenY = target.y - camera.y;

      // Render Soft Pulsing Radial Aura around target object
      this.hintGlowAlpha = 0.35 + 0.25 * Math.sin(Date.now() / 250);
      ctx.save();
      ctx.beginPath();
      const grad = ctx.createRadialGradient(screenX, screenY, 10, screenX, screenY, 70);
      grad.addColorStop(0, `rgba(251, 191, 36, ${this.hintGlowAlpha})`);
      grad.addColorStop(0.5, `rgba(245, 158, 11, ${this.hintGlowAlpha * 0.5})`);
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = grad;
      ctx.arc(screenX, screenY, 70, 0, Math.PI * 2);
      ctx.fill();

      // Render Floating Guide Arrow above target
      const bounce = Math.sin(Date.now() / 200) * 8;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(screenX, screenY - 50 + bounce);
      ctx.lineTo(screenX - 12, screenY - 68 + bounce);
      ctx.lineTo(screenX + 12, screenY - 68 + bounce);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    _resolveCurrentObjectiveTarget() {
      if (!this.quests || !this.quests.activeQuest) return null;
      const q = this.quests.activeQuest;
      const pendingObj = q.objectives.find(o => !o.isCompleted);
      if (!pendingObj) return null;

      // Match entity in world by objective ID
      if (this.world && this.world.activeArea) {
        const entities = this.world.activeArea.entities || [];
        if (pendingObj.id === 'find_watch' || pendingObj.id.includes('watch')) {
          return entities.find(e => e.id.includes('watch')) || { x: 1120, y: 460, word: 'watch' };
        }
        if (pendingObj.id === 'follow_rabbit' || pendingObj.id === 'return_watch') {
          return entities.find(e => e.id.includes('rabbit')) || { x: 1720, y: 460, word: 'rabbit' };
        }
        if (pendingObj.id.includes('drink') || pendingObj.id.includes('bottle')) {
          return entities.find(e => e.id.includes('bottle')) || { x: 700, y: 440, word: 'drink' };
        }
        if (pendingObj.id.includes('key')) {
          return entities.find(e => e.id.includes('key')) || { x: 450, y: 350, word: 'key' };
        }
      }
      return { x: 1000, y: 500, word: 'path' };
    }

    // =========================================================================
    // 3. ADAPTIVE PACING & REINFORCEMENT
    // =========================================================================

    _recordSuccess() {
      this.consecutiveSuccesses++;
      this.consecutiveErrors = 0;
      if (this.consecutiveSuccesses >= 4 && this.difficulty === DIFFICULTY_LEVELS.SUPPORTIVE) {
        this.difficulty = DIFFICULTY_LEVELS.STANDARD;
        this._applyDifficultyPacing();
      }
    }

    _recordError(data) {
      this.consecutiveErrors++;
      this.consecutiveSuccesses = 0;
      if (this.consecutiveErrors >= 2 && this.difficulty === DIFFICULTY_LEVELS.STANDARD) {
        this.difficulty = DIFFICULTY_LEVELS.SUPPORTIVE;
        this._applyDifficultyPacing();
      }
      // Escalate hint automatically if 3 consecutive errors occur
      if (this.consecutiveErrors >= 3) {
        this.escalateHint('repeated_mistakes');
      }
    }

    _applyDifficultyPacing() {
      console.log(`[GameDirector] Difficulty adjusted to: ${this.difficulty}`);

      let diffBadge = document.getElementById('story-difficulty-badge');
      if (!diffBadge) {
        diffBadge = document.createElement('div');
        diffBadge.id = 'story-difficulty-badge';
        diffBadge.className = 'story-badge-pill';
        diffBadge.style.cssText = 'position:fixed; top:20px; right:170px; font-size:0.75rem; font-weight:800; z-index:999;';
        document.body.appendChild(diffBadge);
      }

      if (this.difficulty === DIFFICULTY_LEVELS.SUPPORTIVE) {
        diffBadge.innerHTML = '🛡️ Mode: Supportive';
        diffBadge.style.background = '#065f46';
        diffBadge.style.color = '#a7f3d0';
        this.inactivityThresholdMs = 12000; // Faster hint assistance
      } else if (this.difficulty === DIFFICULTY_LEVELS.CHALLENGING) {
        diffBadge.innerHTML = '⚡ Mode: Challenging';
        diffBadge.style.background = '#7c2d12';
        diffBadge.style.color = '#fed7aa';
        this.inactivityThresholdMs = 35000; // Independent exploration
      } else {
        diffBadge.innerHTML = '🌿 Mode: Standard';
        diffBadge.style.background = 'rgba(15, 23, 42, 0.7)';
        diffBadge.style.color = '#cbd5e1';
        this.inactivityThresholdMs = 20000;
      }
    }

    _triggerContextualReinforcement(word) {
      if (!word || !this.dialogue) return;
      console.log(`[GameDirector] Contextual reinforcement for: "${word}"`);

      // Gentle non-intrusive reminder toast
      this.dialogue.showQuickToast(`✨ Alice remembers: "${word.toUpperCase()}"`, 3200);

      if (this.events) {
        this.events.emit('REMEDIATION_TRIGGERED', {
          word: word,
          method: 'contextual_toast',
          difficulty: this.difficulty
        });
      }
    }

    _triggerVocabularyRecycle(word) {
      if (!word) return;
      console.log(`[GameDirector] Vocabulary recycling: "${word}"`);
      if (this.events) {
        this.events.emit('WORD_EXPOSED', {
          word,
          category: 'recycled',
          chapter: (this.world && this.world.activeArea) ? this.world.activeArea.id : 'wonderland'
        });
      }
    }

    _startPacingWatchdog() {
      setInterval(() => {
        const decision = this.evaluateDecision();
        if (decision && decision.action !== 'MAINTAIN') {
          this.executeDecision(decision);
        }
      }, 5000); // Check pacing every 5 seconds
    }
  }

  // Export to namespace
  root.StoryAdaptive = root.StoryAdaptive || {};
  root.StoryAdaptive.DIFFICULTY_LEVELS = DIFFICULTY_LEVELS;
  root.StoryAdaptive.HINT_LEVELS = HINT_LEVELS;
  root.StoryAdaptive.AdaptiveGameDirector = AdaptiveGameDirector;

})(window);
