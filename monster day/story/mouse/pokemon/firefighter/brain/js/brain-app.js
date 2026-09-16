/**
 * 🧠 THE DAY YOUR BRAIN QUIT! — Main Application Controller
 * Manages stage transitions, clue tracking (0/5), XP, auto-scaling 16:9,
 * teacher panel, audio toggles, and touch optimization.
 */

class BrainLessonApp {
  constructor() {
    this.currentStage = 1;
    this.totalStages = 10;
    this.unlockedClues = new Set();
    this.xp = 0;
    this.difficulty = 'a1'; // 'a1' or 'a1_plus'

    this.audio = new BrainAudioEngine();
    this.renderer = new BrainScenesRenderer(this);

    this.stageEl = document.getElementById('brain-stage');
    this.viewportEl = document.getElementById('scene-viewport');

    this.initHUD();
    this.initScaling();
    this.initKeyboard();
    this.goToStage(1);
  }

  initHUD() {
    // Nav buttons
    document.getElementById('hud-prev-btn').onclick = () => this.prevStage();
    document.getElementById('hud-next-btn').onclick = () => this.nextStage();

    // Sound controls
    document.getElementById('hud-voice-btn').onclick = () => this.toggleVoice();
    document.getElementById('hud-sfx-btn').onclick = () => this.toggleSfx();
    document.getElementById('hud-music-btn').onclick = () => this.toggleMusic();

    // Teacher menu toggle
    document.getElementById('hud-teacher-btn').onclick = () => this.toggleTeacherMenu();

    // Close teacher menu when clicking outside
    document.addEventListener('click', (e) => {
      const modal = document.getElementById('teacher-menu-modal');
      const btn = document.getElementById('hud-teacher-btn');
      if (modal && modal.classList.contains('show') && !modal.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        modal.classList.remove('show');
      }
    });
  }

  initScaling() {
    const doResize = () => {
      if (!this.stageEl) return;
      const targetW = 1200;
      const targetH = 675;
      const winW = window.innerWidth;
      const winH = window.innerHeight;

      const scale = Math.min(winW / targetW, winH / targetH);
      this.stageEl.style.transform = `scale(${scale})`;
    };

    window.addEventListener('resize', doResize);
    window.addEventListener('orientationchange', () => setTimeout(doResize, 100));
    doResize();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') this.nextStage();
      if (e.key === 'ArrowLeft') this.prevStage();
    });
  }

  goToStage(stageNum) {
    if (stageNum < 1 || stageNum > this.totalStages) return;
    this.currentStage = stageNum;

    // Stop current speech
    this.audio.stopSpeech();

    // Update Stage tracker label
    const stageInfo = window.BRAIN_LESSON_DATA.stages.find(s => s.id === stageNum);
    const stageNameEl = document.getElementById('hud-stage-name');
    if (stageNameEl && stageInfo) {
      stageNameEl.textContent = `🧠 ${stageInfo.title} (${stageInfo.time})`;
    }

    // Render corresponding scene
    this.viewportEl.innerHTML = '';
    const renderFn = this.renderer[`renderScreen${stageNum}`];
    if (typeof renderFn === 'function') {
      renderFn.call(this.renderer, this.viewportEl);
    }
  }

  nextStage() {
    if (this.currentStage < this.totalStages) {
      this.goToStage(this.currentStage + 1);
    }
  }

  prevStage() {
    if (this.currentStage > 1) {
      this.goToStage(this.currentStage - 1);
    }
  }

  unlockClue(clueNum, title, desc) {
    if (!this.unlockedClues.has(clueNum)) {
      this.unlockedClues.add(clueNum);
      this.audio.playClueFound();

      // Update badge UI
      const badge = document.getElementById(`clue-badge-${clueNum}`);
      if (badge) {
        badge.classList.add('unlocked', 'pulse');
        badge.innerHTML = `🔍 Clue ${clueNum}`;
        setTimeout(() => badge.classList.remove('pulse'), 2500);
      }
    }
  }

  addXP(amount) {
    this.xp += amount;
    const xpEl = document.getElementById('hud-xp-count');
    if (xpEl) {
      xpEl.textContent = `${this.xp} XP`;
      xpEl.parentElement.style.animation = 'none';
      void xpEl.parentElement.offsetWidth;
      xpEl.parentElement.style.animation = 'cluePulse 0.8s ease';
    }
  }

  toggleVoice() {
    this.audio.speechEnabled = !this.audio.speechEnabled;
    const btn = document.getElementById('hud-voice-btn');
    btn.innerHTML = this.audio.speechEnabled ? '🔊 <span>Voice</span>' : '🔇 <span>Voice</span>';
    btn.style.opacity = this.audio.speechEnabled ? '1' : '0.6';
  }

  toggleSfx() {
    this.audio.soundEnabled = !this.audio.soundEnabled;
    const btn = document.getElementById('hud-sfx-btn');
    btn.innerHTML = this.audio.soundEnabled ? '🎵 <span>SFX</span>' : '🔇 <span>SFX</span>';
    btn.style.opacity = this.audio.soundEnabled ? '1' : '0.6';
  }

  toggleMusic() {
    const on = this.audio.toggleMusic();
    const btn = document.getElementById('hud-music-btn');
    btn.innerHTML = on ? '🎶 <span>Music: ON</span>' : '🎵 <span>Music: OFF</span>';
    btn.classList.toggle('primary', on);
  }

  toggleTeacherMenu() {
    const menu = document.getElementById('teacher-menu-modal');
    if (menu) menu.classList.toggle('show');
  }

  setDifficulty(level) {
    this.difficulty = level;
    this.audio.playNotification();
    this.goToStage(this.currentStage); // re-render with new difficulty
  }

  resetProgress() {
    this.unlockedClues.clear();
    this.xp = 0;
    for (let i = 1; i <= 5; i++) {
      const badge = document.getElementById(`clue-badge-${i}`);
      if (badge) {
        badge.classList.remove('unlocked', 'pulse');
        badge.innerHTML = `🔒 Clue ${i}`;
      }
    }
    const xpEl = document.getElementById('hud-xp-count');
    if (xpEl) xpEl.textContent = '0 XP';
    this.goToStage(1);
  }
}

// Global Launcher
window.addEventListener('DOMContentLoaded', () => {
  window.brainApp = new BrainLessonApp();
});
