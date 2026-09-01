/**
 * teacherMode.js - Teacher Controls, Vocabulary Settings, Scoring & Expanded Badges System
 */

class TeacherMode {
  constructor() {
    this.score = 0;
    this.difficulty = 'easy';

    this.vocabSettings = {
      bodyParts: true,
      shapes: true,
      numbers: true,
      colors: true,
      clothes: true,
      adjectives: true,
      powers: true,
      worlds: true,
      foods: true
    };

    this.stats = {
      monstersCreated: 0,
      eyesUsed: new Set(),
      earsUsed: new Set(),
      colorsUsed: new Set(),
      clothesWorn: new Set(),
      powersUsed: new Set(),
      personalityUsed: new Set(),
      specialPartsUsed: new Set(),
      speakingCompletedCount: 0,
      challengesSolved: 0
    };

    this.badges = [
      {
        id: 'monster_master',
        title: 'Monster Master',
        icon: '🏆',
        description: 'Create 3 unique monsters',
        unlocked: false,
        check: () => this.stats.monstersCreated >= 3 || this.stats.challengesSolved >= 5
      },
      {
        id: 'eye_expert',
        title: 'Eye Expert',
        icon: '👁️',
        description: 'Try 1, 2, and 3+ eyes',
        unlocked: false,
        check: () => this.stats.eyesUsed.size >= 3
      },
      {
        id: 'color_champion',
        title: 'Color Champion',
        icon: '🎨',
        description: 'Use 4 different monster colors',
        unlocked: false,
        check: () => this.stats.colorsUsed.size >= 4
      },
      {
        id: 'fashion_monster',
        title: 'Fashion Monster',
        icon: '👕',
        description: 'Dress monster with top, bottom and accessories',
        unlocked: false,
        check: () => this.stats.clothesWorn.size >= 3
      },
      {
        id: 'creature_creator',
        title: 'Creature Creator',
        icon: '🐉',
        description: 'Add wings, tails, or special parts',
        unlocked: false,
        check: () => this.stats.specialPartsUsed.size >= 2
      },
      {
        id: 'power_master',
        title: 'Power Master',
        icon: '✨',
        description: 'Give your monster super powers',
        unlocked: false,
        check: () => this.stats.powersUsed.size >= 2
      },
      {
        id: 'personality_master',
        title: 'Personality Master',
        icon: '🎭',
        description: 'Choose unique monster personalities',
        unlocked: false,
        check: () => this.stats.personalityUsed.size >= 2
      },
      {
        id: 'monster_speaker',
        title: 'Monster Speaker',
        icon: '🗣️',
        description: 'Complete the English Speaking activity',
        unlocked: false,
        check: () => this.stats.speakingCompletedCount >= 1
      }
    ];

    this.loadState();
  }

  loadState() {
    try {
      const savedScore = localStorage.getItem('monster_game_score');
      if (savedScore) this.score = parseInt(savedScore, 10) || 0;
    } catch (e) {
      console.warn("LocalStorage not accessible", e);
    }
  }

  saveState() {
    try {
      localStorage.setItem('monster_game_score', this.score.toString());
    } catch (e) {
      console.warn("LocalStorage save error", e);
    }
  }

  addPoints(points, reason = '') {
    this.score += points;
    this.saveState();
    window.soundEngine.playStarChime();
    this.updateScoreUI(reason, points);
    this.checkBadges();
  }

  updateScoreUI(reason = '', added = 0) {
    const scoreElem = document.getElementById('global-score-count');
    if (scoreElem) {
      scoreElem.innerText = this.score;
      scoreElem.classList.add('star-bounce');
      setTimeout(() => scoreElem.classList.remove('star-bounce'), 600);
    }

    if (added > 0) {
      this.showFloatingPoints(`+${added} ⭐ ${reason}`);
    }
  }

  showFloatingPoints(text) {
    const container = document.getElementById('floating-points-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'floating-star-badge';
    el.innerText = text;
    container.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1800);
  }

  trackMonsterFeatures(monster) {
    if (monster.eyesCount) this.stats.eyesUsed.add(monster.eyesCount);
    if (monster.color) this.stats.colorsUsed.add(monster.color);

    if (monster.clothesTop && monster.clothesTop !== 'none') this.stats.clothesWorn.add('top');
    if (monster.clothesBottom && monster.clothesBottom !== 'none') this.stats.clothesWorn.add('bottom');
    if (monster.specialCape) this.stats.clothesWorn.add('cape');
    if (monster.accessories && monster.accessories.length > 0) this.stats.clothesWorn.add('accessory');

    if (monster.specialWings && monster.specialWings !== 'none') this.stats.specialPartsUsed.add(monster.specialWings);
    if (monster.specialTail && monster.specialTail !== 'none') this.stats.specialPartsUsed.add(monster.specialTail);
    if (monster.specialParts && monster.specialParts.length > 0) monster.specialParts.forEach(p => this.stats.specialPartsUsed.add(p));

    if (monster.powers && Array.isArray(monster.powers)) {
      monster.powers.forEach(p => this.stats.powersUsed.add(p));
    }

    if (monster.personality && Array.isArray(monster.personality)) {
      monster.personality.forEach(p => this.stats.personalityUsed.add(p));
    }

    this.checkBadges();
  }

  checkBadges() {
    let newlyUnlocked = [];

    this.badges.forEach(b => {
      if (!b.unlocked && b.check()) {
        b.unlocked = true;
        newlyUnlocked.push(b);
      }
    });

    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach(b => {
        this.showBadgeModal(b);
      });
    }

    this.renderBadgesList();
  }

  showBadgeModal(badge) {
    window.soundEngine.playSuccess();
    const modal = document.getElementById('badge-unlock-modal');
    if (!modal) return;

    document.getElementById('badge-unlock-icon').innerText = badge.icon;
    document.getElementById('badge-unlock-title').innerText = badge.title;
    document.getElementById('badge-unlock-desc').innerText = badge.description;

    modal.classList.add('active');
    this.triggerConfetti();
  }

  renderBadgesList() {
    const list = document.getElementById('badges-modal-grid');
    if (!list) return;

    list.innerHTML = this.badges.map(b => `
      <div class="badge-card ${b.unlocked ? 'unlocked' : 'locked'}">
        <div class="badge-card-icon">${b.icon}</div>
        <div class="badge-card-info">
          <h4>${b.title}</h4>
          <p>${b.description}</p>
        </div>
        <div class="badge-card-status">${b.unlocked ? '✅ UNLOCKED' : '🔒 LOCKED'}</div>
      </div>
    `).join('');
  }

  triggerConfetti() {
    const container = document.getElementById('confetti-canvas-container');
    if (!container) return;

    container.innerHTML = '';
    const colors = ['#f43f5e', '#a855f7', '#38bdf8', '#22c55e', '#facc15', '#fb923c'];

    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.8 + 's';
      piece.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
      container.appendChild(piece);
    }

    setTimeout(() => {
      container.innerHTML = '';
    }, 3500);
  }
}

window.teacherMode = new TeacherMode();
