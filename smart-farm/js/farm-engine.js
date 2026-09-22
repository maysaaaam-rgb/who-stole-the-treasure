/**
 * THE SMART FARM — GAME ENGINE & STATE CONTROLLER
 * Scene transitions, mission progression, farm restoration, and reward unlocks
 */
(function(root) {
  'use strict';

  const FarmEngine = {
    state: {
      currentScene: 'start', // 'start' | 'map' | 'mission-1' | 'mission-2' | 'mission-3' | 'lab' | 'restored'
      xp: 0,
      powerLevel: 0, // 0 to 100%
      completedMissions: [], // [1, 2, 3, 4]
      unlockedParts: [],
      badges: []
    },

    // Confetti particles
    confetti: {
      canvas: null,
      ctx: null,
      particles: [],
      animId: null
    },

    init: function() {
      this.initConfetti();
      this.updateHUD();
      this.renderMapZones();
    },

    initConfetti: function() {
      const c = document.getElementById('farmConfettiCanvas');
      if (!c) return;
      this.confetti.canvas = c;
      this.confetti.ctx = c.getContext('2d');
      this.resizeConfetti();
      window.addEventListener('resize', () => this.resizeConfetti());
    },

    resizeConfetti: function() {
      if (!this.confetti.canvas) return;
      this.confetti.canvas.width = window.innerWidth;
      this.confetti.canvas.height = window.innerHeight;
    },

    burstConfetti: function(count = 80) {
      if (!this.confetti.canvas || !this.confetti.ctx) return;
      const colors = ['#10b981', '#38bdf8', '#f59e0b', '#f43f5e', '#a855f7', '#fde047'];
      for (let i = 0; i < count; i++) {
        this.confetti.particles.push({
          x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 250,
          y: window.innerHeight * 0.4 + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 16,
          vy: (Math.random() - 1.2) * 15,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rot: Math.random() * 360,
          rotSpd: (Math.random() - 0.5) * 10,
          opacity: 1,
          gravity: 0.4
        });
      }

      if (!this.confetti.animId) {
        this.renderConfettiLoop();
      }
    },

    renderConfettiLoop: function() {
      const { ctx, canvas, particles } = this.confetti;
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rot += p.rotSpd;
        p.opacity -= 0.014;

        if (p.opacity <= 0 || p.y > canvas.height) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();
      }

      if (particles.length > 0) {
        this.confetti.animId = requestAnimationFrame(() => this.renderConfettiLoop());
      } else {
        this.confetti.animId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },

    // --- NAVIGATION & SCENE SWITCHING ---
    switchScene: function(sceneName) {
      this.state.currentScene = sceneName;
      root.FarmAudio.playTap();

      document.querySelectorAll('.game-screen').forEach(el => {
        el.classList.remove('is-active-screen');
      });

      const target = document.getElementById(`screen-${sceneName}`);
      if (target) {
        target.classList.add('is-active-screen');
      }

      // Hide or show top HUD
      const hud = document.getElementById('farmTopHUD');
      if (hud) {
        hud.style.display = (sceneName === 'start') ? 'none' : 'flex';
      }

      if (sceneName === 'map') {
        this.renderMapZones();
      }
    },

    // Start Screen: Trigger Dramatic System Failure & Intro
    startStoryIntro: function() {
      root.FarmAudio.playSystemFailure();

      const blackoutEl = document.getElementById('startFailureOverlay');
      if (blackoutEl) {
        blackoutEl.classList.add('trigger-blackout');
      }

      setTimeout(() => {
        root.FarmAudio.playRobotChirp();
        const speechBubble = document.getElementById('startRobotSpeech');
        if (speechBubble) {
          speechBubble.style.display = 'block';
          speechBubble.classList.add('bounce-in');
        }

        const startBtn = document.getElementById('btnStartMission');
        if (startBtn) {
          startBtn.style.display = 'inline-flex';
          startBtn.classList.add('bounce-in');
        }

        root.FarmAudio.speakPhrase("Young Inventor! We need your help! The smart farm lost its power!");
      }, 1200);
    },

    enterFarmMap: function() {
      root.FarmAudio.playTap();
      this.switchScene('map');
      root.FarmAudio.speakPhrase("Welcome to the Smart Farm! Tap Mission 1 to save the cow!");
    },

    renderMapZones: function() {
      const container = document.getElementById('farmMapGrid');
      if (!container) return;

      const zones = root.SMART_FARM_DATA.zones;
      container.innerHTML = zones.map(z => {
        const isDone = this.state.completedMissions.includes(z.missionId);
        const isUnlocked = z.missionId === 1 || this.state.completedMissions.includes(z.missionId - 1);
        const statusClass = isDone ? 'is-completed' : (isUnlocked ? 'is-unlocked' : 'is-locked');

        return `
          <div class="farm-zone-card ${statusClass}" onclick="FarmEngine.openMission(${z.missionId}, ${isUnlocked})">
            <div class="zone-badge-status">
              ${isDone ? '✅ COMPLETED' : (isUnlocked ? '⚡ ACTIVE' : '🔒 LOCKED')}
            </div>
            <div class="zone-illustration">
              <span class="zone-animal-emoji">${z.icon}</span>
              ${isDone ? '<span class="zone-trophy-star">⭐</span>' : ''}
            </div>
            <h3 class="zone-title">${z.title}</h3>
            <p class="zone-preview">${z.previewText}</p>
            <div class="zone-action-btn">
              ${isDone ? 'REPLAY MISSION ↺' : (isUnlocked ? 'ENTER MISSION ➔' : 'LOCKED 🔒')}
            </div>
          </div>
        `;
      }).join('');
    },

    openMission: function(mId, isUnlocked) {
      if (!isUnlocked && !this.state.completedMissions.includes(mId)) {
        root.FarmAudio.playTap();
        alert("🔒 Complete the previous farm mission first to restore system power!");
        return;
      }

      root.FarmAudio.playTap();

      if (mId === 1) {
        this.switchScene('mission-1');
        root.MiniGames.initPipePuzzle();
        root.FarmAudio.speakPhrase("The cow is thirsty. Connect the water pipes to help the cow!");
      } else if (mId === 2) {
        this.switchScene('mission-2');
        root.MiniGames.initClimateGame();
        root.FarmAudio.speakPhrase("The chicken is cold. Use the smart heater to make it warm!");
      } else if (mId === 3) {
        this.switchScene('mission-3');
        root.MiniGames.initRobotGame();
        root.FarmAudio.speakPhrase("Program the robot to carry the heavy box to the barn!");
      } else if (mId === 4) {
        this.switchScene('lab');
        root.MiniGames.initInventorLab();
        root.FarmAudio.speakPhrase("Welcome to the Inventor Lab! Combine parts to build your machine!");
      }
    },

    completeMission: function(mId) {
      if (!this.state.completedMissions.includes(mId)) {
        this.state.completedMissions.push(mId);
        this.addXP(50);
        this.state.powerLevel = Math.min(100, this.state.completedMissions.length * 25);
        this.updateHUD();

        const zone = root.SMART_FARM_DATA.zones.find(z => z.missionId === mId);
        if (zone) {
          this.state.unlockedParts.push(zone.unlockedPart);
          this.state.badges.push(zone.badge);
        }
      }

      root.FarmAudio.playVictoryFanfare();
      this.burstConfetti(90);

      // Show Mission Success Reward Modal
      this.showRewardModal(mId);
    },

    showRewardModal: function(mId) {
      const modal = document.getElementById('rewardSuccessModal');
      const titleEl = document.getElementById('rewardModalTitle');
      const descEl = document.getElementById('rewardModalDesc');
      const partEl = document.getElementById('rewardPartName');

      const zone = root.SMART_FARM_DATA.zones.find(z => z.missionId === mId);

      if (titleEl) titleEl.textContent = `🎉 Mission ${mId} Completed!`;
      if (descEl) descEl.textContent = zone ? zone.targetSentence : 'Great problem solving!';
      if (partEl) partEl.textContent = `Unlocked: ${zone ? zone.unlockedPart : 'New Robot Part'}`;

      if (modal) modal.classList.add('is-active');
    },

    closeRewardModal: function() {
      const modal = document.getElementById('rewardSuccessModal');
      if (modal) modal.classList.remove('is-active');

      if (this.state.completedMissions.length >= 4) {
        this.switchScene('restored');
      } else {
        this.switchScene('map');
      }
    },

    finishAllMissionsShowcase: function() {
      this.completeMission(4);
      setTimeout(() => {
        this.closeRewardModal();
        this.switchScene('restored');
        this.burstConfetti(120);
        root.FarmAudio.playVictoryFanfare();
        root.FarmAudio.speakPhrase("Congratulations! You built the smart farm inventions! All animals are happy and safe!");
      }, 500);
    },

    addXP: function(amount) {
      this.state.xp += amount;
      this.updateHUD();

      // Sync with parent school platform if embedded
      try {
        if (window.parent && window.parent.store && typeof window.parent.store.giveXP === 'function') {
          window.parent.store.giveXP('student-3a-224', amount, 'The Smart Farm');
        }
      } catch (e) {}
    },

    updateHUD: function() {
      const xpEl = document.getElementById('hudFarmXP');
      if (xpEl) xpEl.textContent = `⭐ +${this.state.xp} XP`;

      const powerBar = document.getElementById('hudPowerBarFill');
      const powerNum = document.getElementById('hudPowerNumber');
      if (powerBar) powerBar.style.width = `${this.state.powerLevel}%`;
      if (powerNum) powerNum.textContent = `${this.state.powerLevel}% Power`;

      const badgeCountEl = document.getElementById('hudBadgeCount');
      if (badgeCountEl) badgeCountEl.textContent = `🏅 ${this.state.badges.length}/4 Badges`;
    },

    restartGame: function() {
      root.FarmAudio.playTap();
      this.state.xp = 0;
      this.state.powerLevel = 0;
      this.state.completedMissions = [];
      this.state.unlockedParts = [];
      this.state.badges = [];

      this.updateHUD();
      this.switchScene('start');

      const blackoutEl = document.getElementById('startFailureOverlay');
      if (blackoutEl) blackoutEl.classList.remove('trigger-blackout');

      const speechBubble = document.getElementById('startRobotSpeech');
      if (speechBubble) speechBubble.style.display = 'none';

      const startBtn = document.getElementById('btnStartMission');
      if (startBtn) startBtn.style.display = 'none';
    }
  };

  root.FarmEngine = FarmEngine;

  // Auto initialize on DOM load
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      FarmEngine.init();
    });
  }

})(typeof window !== 'undefined' ? window : global);
