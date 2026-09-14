/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — DEVELOPER DEBUG CONTROLLER (v3.0)
 * 
 * In-game diagnostics panel for developer, educator & QA testing:
 * - Engine Metrics: Coordinates, FPS, Hitbox wireframes, Inventory state
 * - Audio Diagnostics: Active audio state, dynamic music track, ambient layers
 * - Adaptive AI Learning Director Diagnostics:
 *     - Real-time Difficulty Mode (Supportive, Standard, Challenging)
 *     - Live Vocabulary Breakdown (Mastered, Developing, Weak)
 *     - Listening Comprehension & Speaking Accuracy Rates
 *     - Active Hint Escalation Level (Level 1 to Level 4)
 * - 4-Profile Pedagogical Simulation Switches:
 *     - Profile A: Strong Learner (high accuracy, no hints, fast pace)
 *     - Profile B: Average Learner (standard pace, balanced)
 *     - Profile C: Struggling Learner (vocabulary mistakes, remediation triggered)
 *     - Profile D: Hint-Heavy Learner (escalates through Levels 1-4)
 * - Teacher Analytics Inspector Modal
 * ============================================================================
 */

(function(root) {
  'use strict';

  class DebugController {
    constructor() {
      this.isOpen = false;
      this.showHitboxes = false;
      this.overlayEl = null;

      this._setupKeyboardToggle();
    }

    init(overlayElement) {
      this.overlayEl = overlayElement;
      if (!this.overlayEl) return;

      // Connect button handlers
      const btnHitboxes = document.getElementById('debug-toggle-hitboxes');
      if (btnHitboxes) {
        btnHitboxes.addEventListener('click', () => {
          this.showHitboxes = !this.showHitboxes;
          btnHitboxes.textContent = this.showHitboxes ? 'Hitboxes: ON' : 'Hitboxes: OFF';
        });
      }

      const btnTeleportKey = document.getElementById('debug-teleport-key');
      if (btnTeleportKey) {
        btnTeleportKey.addEventListener('click', () => {
          if (root.StoryGame && root.StoryGame.player) {
            root.StoryGame.player.x = 1080;
            root.StoryGame.player.y = 260;
          }
        });
      }

      const btnTeleportGate = document.getElementById('debug-teleport-gate');
      if (btnTeleportGate) {
        btnTeleportGate.addEventListener('click', () => {
          if (root.StoryGame && root.StoryGame.player) {
            root.StoryGame.player.x = 1650;
            root.StoryGame.player.y = 440;
          }
        });
      }

      const btnResetRabbit = document.getElementById('debug-reset-rabbit-woods');
      if (btnResetRabbit) {
        btnResetRabbit.addEventListener('click', () => {
          this.resetRabbitWoods();
        });
      }

      const btnResetHall = document.getElementById('debug-reset-hall-of-doors');
      if (btnResetHall) {
        btnResetHall.addEventListener('click', () => {
          this.resetHallOfDoors();
        });
      }

      const btnReset = document.getElementById('debug-reset-progress');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          if (root.StoryBridge && root.StoryBridge.clearProgress) {
            root.StoryBridge.clearProgress();
          }
          if (root.StoryGame && root.StoryGame.learner) {
            root.StoryGame.learner.reset();
          }
          window.location.reload();
        });
      }

      // Audio Controls
      const btnToggleAudio = document.getElementById('debug-toggle-audio');
      if (btnToggleAudio) {
        btnToggleAudio.addEventListener('click', () => {
          if (root.toggleStorySound) {
            root.toggleStorySound();
          }
        });
      }

      const btnTestSfx = document.getElementById('debug-test-sfx');
      if (btnTestSfx) {
        btnTestSfx.addEventListener('click', () => {
          if (root.StoryAudioEngine) {
            root.StoryAudioEngine.playVariation('key_pickup', { channel: 'sfx', volume: 0.85 });
          }
        });
      }

      // Adaptive Profile Simulators
      const btnProfileA = document.getElementById('debug-profile-a');
      if (btnProfileA) {
        btnProfileA.addEventListener('click', () => this.simulateProfileA());
      }
      const btnProfileB = document.getElementById('debug-profile-b');
      if (btnProfileB) {
        btnProfileB.addEventListener('click', () => this.simulateProfileB());
      }
      const btnProfileC = document.getElementById('debug-profile-c');
      if (btnProfileC) {
        btnProfileC.addEventListener('click', () => this.simulateProfileC());
      }
      const btnProfileD = document.getElementById('debug-profile-d');
      if (btnProfileD) {
        btnProfileD.addEventListener('click', () => this.simulateProfileD());
      }

      const btnTeacherReport = document.getElementById('debug-teacher-report');
      if (btnTeacherReport) {
        btnTeacherReport.addEventListener('click', () => this.showTeacherAnalyticsModal());
      }
    }

    simulateProfileA() {
      // Profile A: Strong Learner (Multi-chapter mastery & high accuracy)
      if (!root.StoryGame || !root.StoryGame.learner) return;
      const lm = root.StoryGame.learner;
      lm.reset();

      // Words mastered across multiple chapters with high retention
      ['follow', 'watch', 'late', 'rabbit', 'clock'].forEach(w => {
        // Encounter in Chapter 1
        lm.events.emit('WORD_EXPOSED', { word: w, chapter: 'rabbit_woods' });
        lm.events.emit('WORD_USED', { word: w });
        lm.events.emit('DIALOGUE_UNDERSTOOD', { targetWord: w });
        lm.events.emit('SPEAKING_SUCCESS', { targetWord: w });

        // Encounter in Chapter 3
        lm.events.emit('WORD_EXPOSED', { word: w, chapter: 'hall_of_doors' });
        lm.events.emit('WORD_USED', { word: w });
        lm.events.emit('DIALOGUE_UNDERSTOOD', { targetWord: w });

        // Encounter in Chapter 6
        lm.events.emit('WORD_EXPOSED', { word: w, chapter: 'tea_party' });
        lm.events.emit('WORD_USED', { word: w });
      });

      lm.events.emit('QUEST_LANGUAGE_SUCCESS', {
        objectiveText: 'Follow the White Rabbit and return his watch'
      });

      if (root.StoryGame.director) {
        root.StoryGame.director.consecutiveSuccesses = 6;
        root.StoryGame.director.consecutiveErrors = 0;
        root.StoryGame.director.executeDecision({
          action: 'DIFFICULTY_ADJUST',
          difficulty: 'CHALLENGING',
          reason: 'Profile A: High performance test simulation'
        });
      }

      if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
        root.StoryDialogue.showQuickToast('🧑‍🎓 Profile A: Strong Learner simulated! (Mode: Challenging)', 3500);
      }
    }

    simulateProfileB() {
      // Profile B: Average Learner
      if (!root.StoryGame || !root.StoryGame.learner) return;
      const lm = root.StoryGame.learner;
      lm.reset();

      ['rabbit', 'watch'].forEach(w => {
        lm.events.emit('WORD_EXPOSED', { word: w, chapter: 'rabbit_woods' });
        lm.events.emit('WORD_RECOGNIZED', { word: w });
      });
      lm.events.emit('WORD_EXPOSED', { word: 'follow', chapter: 'rabbit_woods' });

      if (root.StoryGame.director) {
        root.StoryGame.director.consecutiveSuccesses = 2;
        root.StoryGame.director.consecutiveErrors = 0;
        root.StoryGame.director.executeDecision({
          action: 'DIFFICULTY_ADJUST',
          difficulty: 'STANDARD',
          reason: 'Profile B: Standard pace test simulation'
        });
      }

      if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
        root.StoryDialogue.showQuickToast('🧑‍🎓 Profile B: Average Learner simulated! (Mode: Standard)', 3500);
      }
    }

    simulateProfileC() {
      // Profile C: Struggling Learner
      if (!root.StoryGame || !root.StoryGame.learner) return;
      const lm = root.StoryGame.learner;
      lm.reset();

      lm.events.emit('WORD_EXPOSED', { word: 'follow', chapter: 'rabbit_woods' });
      lm.events.emit('WORD_MISSED', { word: 'follow', reason: 'incorrect_action' });
      lm.events.emit('DIALOGUE_MISUNDERSTOOD', { targetWord: 'follow' });
      lm.events.emit('WORD_MISSED', { word: 'watch', reason: 'wrong_item' });

      if (root.StoryGame.director) {
        root.StoryGame.director.consecutiveErrors = 3;
        root.StoryGame.director.consecutiveSuccesses = 0;
        root.StoryGame.director.executeDecision({
          action: 'DIFFICULTY_ADJUST',
          difficulty: 'SUPPORTIVE',
          reason: 'Profile C: Struggling learner simulation'
        });
        root.StoryGame.director.executeDecision({
          action: 'REINFORCE',
          target: 'follow',
          reason: 'Contextual reinforcement test'
        });
      }

      if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
        root.StoryDialogue.showQuickToast('🧑‍🎓 Profile C: Struggling Learner simulated! (Mode: Supportive)', 3500);
      }
    }

    simulateProfileD() {
      // Profile D: Hint-Heavy Learner
      if (!root.StoryGame || !root.StoryGame.director) return;
      root.StoryGame.director.escalateHint('simulation_d');
      root.StoryGame.director.escalateHint('simulation_d');

      if (root.StoryDialogue && root.StoryDialogue.showQuickToast) {
        root.StoryDialogue.showQuickToast('💡 Profile D: Hint-Heavy Learner simulated (Escalated to Level 3)', 3500);
      }
    }

    showTeacherAnalyticsModal() {
      if (!root.StoryGame || !root.StoryGame.learner) return;
      const report = root.StoryGame.learner.getTeacherAnalytics();

      let modal = document.getElementById('debug-teacher-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'debug-teacher-modal';
        modal.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #0f172a;
          border: 2px solid #3b82f6;
          box-shadow: 0 25px 60px rgba(0,0,0,0.8);
          border-radius: 16px;
          padding: 24px;
          width: 90%;
          max-width: 520px;
          color: #f8fafc;
          z-index: 10000;
          font-family: 'Plus Jakarta Sans', sans-serif;
        `;
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:10px; margin-bottom:14px;">
          <h3 style="margin:0; font-size:1.15rem; color:#60a5fa;">📊 Teacher Analytics: Alice Adventure</h3>
          <button type="button" onclick="document.getElementById('debug-teacher-modal').style.display='none'" style="background:none; border:none; color:#94a3b8; font-size:1.2rem; cursor:pointer;">✕</button>
        </div>
        <div style="font-size:0.85rem; line-height:1.6;">
          <div style="margin-bottom:10px;">
            <strong style="color:#a7f3d0;">🟢 Mastered Vocabulary (${report.vocabulary.mastered.length}):</strong>
            <div>${report.vocabulary.mastered.join(', ') || 'None yet'}</div>
          </div>
          <div style="margin-bottom:10px;">
            <strong style="color:#fef08a;">🟡 Developing Vocabulary (${report.vocabulary.developing.length}):</strong>
            <div>${report.vocabulary.developing.join(', ') || 'None yet'}</div>
          </div>
          <div style="margin-bottom:10px;">
            <strong style="color:#fca5a5;">🔴 Needs Reinforcement (${report.vocabulary.needsReinforcement.length}):</strong>
            <div>${report.vocabulary.needsReinforcement.join(', ') || 'None (All on track)'}</div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px; border-top:1px solid #334155; padding-top:10px;">
            <div>
              <strong style="color:#93c5fd;">🎧 Listening Comprehension:</strong>
              <div>${report.listening.ratePct}% (${report.listening.status.toUpperCase()})</div>
            </div>
            <div>
              <strong style="color:#c084fc;">🎤 Speaking Accuracy:</strong>
              <div>${report.speaking.ratePct}% (${report.speaking.status.toUpperCase()})</div>
            </div>
          </div>
          <div style="margin-top:10px;">
            <strong style="color:#fed7aa;">📜 Quest Behavioral Comprehension:</strong>
            <div>Success Rate: ${report.questComprehension.successRatePct}% | Hints Used: ${report.questComprehension.hintsUsed} | Repeated Attempts: ${report.questComprehension.repeatedAttempts}</div>
          </div>
        </div>
      `;
      modal.style.display = 'block';
    }

    _setupKeyboardToggle() {
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Backquote') {
          e.preventDefault();
          this.toggle();
        }
      });
    }

    toggle() {
      this.isOpen = !this.isOpen;
      if (this.overlayEl) {
        this.overlayEl.classList.toggle('is-open', this.isOpen);
      }
    }

    update(fps, player, camera, questSystem, inventory) {
      if (!this.isOpen || !this.overlayEl) return;

      const fpsEl = document.getElementById('debug-val-fps');
      if (fpsEl) fpsEl.textContent = fps;

      // Current Scene & Story State
      const sceneEl = document.getElementById('debug-val-scene');
      if (sceneEl && root.StoryGame && root.StoryGame.world && root.StoryGame.world.activeArea) {
        const a = root.StoryGame.world.activeArea;
        sceneEl.textContent = `${a.id} [${a.movementMode || 'std'}]`;
      }

      const storyStateEl = document.getElementById('debug-val-story-state');
      if (storyStateEl && root.StoryGame) {
        storyStateEl.textContent = root.StoryGame.storyState || 'N/A';
      }

      const playerPosEl = document.getElementById('debug-val-player-pos');
      if (playerPosEl && player) {
        playerPosEl.textContent = `(${Math.round(player.x)}, ${Math.round(player.y)}) [${player.facing}] ${player.movementMode || 'std'}`;
      }

      const camPosEl = document.getElementById('debug-val-cam-pos');
      if (camPosEl && camera) {
        camPosEl.textContent = `(${Math.round(camera.x)}, ${Math.round(camera.y)}) z:${camera.zoom || 1}`;
      }

      // Real-time Input State
      const inputEl = document.getElementById('debug-val-input');
      if (inputEl && root.StoryGame && root.StoryGame.input) {
        const inp = root.StoryGame.input;
        const activeKeys = Object.entries(inp.keys || {}).filter(([_, v]) => Boolean(v)).map(([k]) => k.replace('Key', ''));
        const vec = inp.getMovementVector ? inp.getMovementVector() : { dx: 0, dy: 0 };
        inputEl.textContent = activeKeys.length > 0 ? `[${activeKeys.join(',')}] dx:${vec.dx.toFixed(1)} dy:${vec.dy.toFixed(1)}` : (inp.moveTarget ? 'Click-Target' : 'Idle');
      }

      // Real-time Collision State
      const colEl = document.getElementById('debug-val-collision');
      if (colEl && root.StoryGame && root.StoryGame.world && root.StoryGame.world.activeArea && player) {
        const area = root.StoryGame.world.activeArea;
        const obstacles = area.getSolidObstacles();
        const hitbox = player.getHitbox();
        const isColliding = obstacles.some(obs => window.StoryWorld && window.StoryWorld.Collision && window.StoryWorld.Collision.checkAABB(hitbox, obs));
        colEl.textContent = `${isColliding ? 'COLLIDING!' : 'Clear'} (${obstacles.length} obs)`;
        colEl.style.color = isColliding ? '#f87171' : '#a7f3d0';
      }

      const questEl = document.getElementById('debug-val-quest');
      if (questEl && questSystem) {
        const q = questSystem.activeQuest;
        questEl.textContent = q ? `${q.title} (${q.objectives.filter(o => o.isCompleted).length}/${q.objectives.length})` : 'None';
      }

      const invEl = document.getElementById('debug-val-inventory');
      if (invEl && inventory) {
        invEl.textContent = inventory.items.length > 0 ? inventory.items.map(i => i.id).join(', ') : 'Empty';
      }

      // Audio Engine Diagnostics
      if (root.StoryAudioEngine) {
        const diag = root.StoryAudioEngine.getDiagnostics();
        const stateEl = document.getElementById('debug-audio-state');
        if (stateEl) stateEl.textContent = diag.currentState;
        const musicEl = document.getElementById('debug-audio-music');
        if (musicEl) musicEl.textContent = diag.activeMusic;
      }

      // Adaptive Learning Diagnostics Update
      if (root.StoryGame && root.StoryGame.director) {
        const d = root.StoryGame.director;
        const diffEl = document.getElementById('debug-val-difficulty');
        if (diffEl) diffEl.textContent = d.difficulty;
        const hintEl = document.getElementById('debug-val-hint');
        if (hintEl) hintEl.textContent = `Level ${d.activeHintLevel}`;
      }

      if (root.StoryGame && root.StoryGame.learner) {
        const lm = root.StoryGame.learner;
        const vocabEl = document.getElementById('debug-val-vocab-counts');
        if (vocabEl) {
          vocabEl.textContent = `M:${lm.getMasteredVocabulary().length} D:${lm.getDevelopingVocabulary().length} W:${lm.getWeakVocabulary().length}`;
        }
      }
    }

    resetRabbitWoods() {
      if (root.resetRabbitWoodsStoryState) {
        root.resetRabbitWoodsStoryState();
      } else if (root.restartNewAdventure) {
        root.restartNewAdventure();
      }
    }

    resetHallOfDoors() {
      if (root.resetHallOfDoorsState) {
        root.resetHallOfDoorsState();
      }
    }
  }

  // Export to namespace
  root.StoryDebug = new DebugController();

})(window);
