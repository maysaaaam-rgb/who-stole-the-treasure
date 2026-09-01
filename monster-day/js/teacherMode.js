/**
 * teacherMode.js - Positive Star Scoring, 8 Badges, Confetti & Teacher Settings
 * "Build Your Own Monster!"
 */

class TeacherMode {
  constructor() {
    this.score = 0;
    this.badges = [
      { id: 'badge-eye', name: 'Eye Expert', icon: '👁️', desc: 'Customize monster eyes!', unlocked: false },
      { id: 'badge-color', name: 'Color Champion', icon: '🎨', desc: 'Choose creative monster colors!', unlocked: false },
      { id: 'badge-fashion', name: 'Fashion Monster', icon: '👕', desc: 'Dress up your monster in cool clothes!', unlocked: false },
      { id: 'badge-creature', name: 'Creature Creator', icon: '🐉', desc: 'Add wings, tails or spikes!', unlocked: false },
      { id: 'badge-power', name: 'Power Master', icon: '✨', desc: 'Give your monster super powers!', unlocked: false },
      { id: 'badge-speaker', name: 'Monster Speaker', icon: '🎤', desc: 'Complete Speaking Teleprompter mode!', unlocked: false },
      { id: 'badge-personality', name: 'Personality Master', icon: '❤️', desc: 'Choose a fun monster personality!', unlocked: false },
      { id: 'badge-master', name: 'Monster Master', icon: '🏆', desc: 'Create a complete monster card!', unlocked: false }
    ];

    this.stats = {
      speakingCompletedCount: 0,
      challengesSolved: 0,
      monstersCreated: 0
    };

    this.loadState();
  }

  loadState() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('monster_game_teacher_mode');
        if (saved) {
          const data = JSON.parse(saved);
          this.score = data.score || 0;
          if (Array.isArray(data.badges)) {
            data.badges.forEach(b => {
              const match = this.badges.find(localB => localB.id === b.id);
              if (match) match.unlocked = b.unlocked;
            });
          }
          if (data.stats) Object.assign(this.stats, data.stats);
        }
      }
    } catch (e) {}
    this.updateScoreUI();
  }

  saveState() {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = {
          score: this.score,
          badges: this.badges,
          stats: this.stats
        };
        localStorage.setItem('monster_game_teacher_mode', JSON.stringify(data));
      }
    } catch (e) {}
  }

  addPoints(points = 1, reason = '') {
    this.score += points;
    this.updateScoreUI();
    this.saveState();
    this.showFloatingScore(`+${points} ⭐ ${reason}`);
    this.checkBadges();
  }

  updateScoreUI() {
    if (typeof document !== 'undefined') {
      const el = document.getElementById('global-score-count');
      if (el) el.innerText = this.score;
    }
  }

  showFloatingScore(text) {
    const container = document.getElementById('floating-points-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'floating-score-item';
    el.innerText = text;
    container.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 2000);
  }

  checkBadges() {
    const m = window.monsterStore ? window.monsterStore.get() : {};

    // 1. Eye Expert
    if (m.eyes && (m.eyes.count !== 2 || m.eyes.style !== 'round')) {
      this.unlockBadge('badge-eye');
    }

    // 2. Color Champion
    if (m.color && (m.color !== 'purple' || (m.pattern && m.pattern !== 'none'))) {
      this.unlockBadge('badge-color');
    }

    // 3. Fashion Monster
    if (m.clothes && (m.clothes.top !== 'none' || m.clothes.bottom !== 'none' || m.clothes.outfit !== 'none' || m.clothes.cape)) {
      this.unlockBadge('badge-fashion');
    }

    // 4. Creature Creator
    if (m.specialParts && (m.specialParts.wings !== 'none' || m.specialParts.tail !== 'none' || m.specialParts.spikes || m.specialParts.fins)) {
      this.unlockBadge('badge-creature');
    }

    // 5. Power Master
    if (m.powers && m.powers.length > 0) {
      this.unlockBadge('badge-power');
    }

    // 6. Monster Speaker
    if (this.stats.speakingCompletedCount > 0) {
      this.unlockBadge('badge-speaker');
    }

    // 7. Personality Master
    if (m.personality && m.personality.length > 0) {
      this.unlockBadge('badge-personality');
    }

    // 8. Monster Master
    if (this.score >= 10 || this.stats.monstersCreated > 0) {
      this.unlockBadge('badge-master');
    }

    this.renderBadgesModal();
  }

  unlockBadge(badgeId) {
    const b = this.badges.find(item => item.id === badgeId);
    if (b && !b.unlocked) {
      b.unlocked = true;
      this.saveState();
      this.showBadgeNotification(b);
      this.triggerConfetti();
    }
  }

  showBadgeNotification(badge) {
    window.soundEngine.playSparkle();
    const modal = document.getElementById('badge-unlock-modal');
    if (modal) {
      document.getElementById('badge-unlock-icon').innerText = badge.icon;
      document.getElementById('badge-unlock-title').innerText = `Badge Unlocked: ${badge.name}!`;
      document.getElementById('badge-unlock-desc').innerText = badge.desc;
      modal.classList.add('active');
    }
  }

  renderBadgesModal() {
    const grid = document.getElementById('badges-modal-grid');
    if (!grid) return;

    grid.innerHTML = this.badges.map(b => `
      <div class="badge-item-card ${b.unlocked ? 'unlocked' : 'locked'}">
        <div class="badge-item-icon">${b.icon}</div>
        <div class="badge-item-name">${b.name}</div>
        <div class="badge-item-desc">${b.desc}</div>
        <div class="badge-item-status">${b.unlocked ? '⭐ UNLOCKED' : '🔒 LOCKED'}</div>
      </div>
    `).join('');
  }

  triggerConfetti() {
    const container = document.getElementById('confetti-canvas-container');
    if (!container) return;

    container.innerHTML = '';
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#facc15', '#a855f7', '#fb923c'];

    for (let i = 0; i < 45; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = '-20px';
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      p.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      p.style.animationDelay = `${Math.random() * 0.4}s`;
      container.appendChild(p);
    }

    setTimeout(() => {
      container.innerHTML = '';
    }, 4000);
  }
}

window.teacherMode = new TeacherMode();
