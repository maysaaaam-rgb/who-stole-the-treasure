/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — DEVELOPER DEBUG CONTROLLER (v1.0)
 * 
 * In-game diagnostics panel for developer & QA testing:
 * Coordinates, FPS, Hitbox wireframes, Inventory state, and Teleport shortcuts.
 * Hidden from young learners.
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
            root.StoryGame.player.x = 1180;
            root.StoryGame.player.y = 570;
          }
        });
      }

      const btnReset = document.getElementById('debug-reset-progress');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          if (root.StoryBridge && root.StoryBridge.clearProgress) {
            root.StoryBridge.clearProgress();
          }
          window.location.reload();
        });
      }
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

      const playerPosEl = document.getElementById('debug-val-player-pos');
      if (playerPosEl && player) {
        playerPosEl.textContent = `(${Math.round(player.x)}, ${Math.round(player.y)}) [${player.facing}]`;
      }

      const camPosEl = document.getElementById('debug-val-cam-pos');
      if (camPosEl && camera) {
        camPosEl.textContent = `(${Math.round(camera.x)}, ${Math.round(camera.y)})`;
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
    }
  }

  root.StoryDebug = new DebugController();

})(window);
