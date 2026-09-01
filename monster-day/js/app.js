/**
 * app.js - Main Application State & UI Controller for "Build Your Own Monster!"
 */

class MonsterApp {
  constructor() {
    this.defaultMonster = {
      name: 'Zippy',
      color: 'purple',
      eyesCount: 2,
      eyesSize: 'big',
      earsCount: 2,
      earsLength: 'long',
      mouthType: 'big',
      teethType: 'sharp',
      noseSize: 'small',
      legsCount: 2,
      armsCount: 2,
      armsLength: 'short',
      clothesTop: 'none',
      clothesTopColor: 'blue',
      clothesBottom: 'none',
      clothesBottomColor: 'black',
      accessories: [],
      accessoryColors: {
        hat: 'yellow',
        cap: 'blue',
        scarf: 'red',
        bow: 'pink',
        backpack: 'green'
      },
      specialCape: false,
      specialCapeColor: 'red',
      specialBoots: false,
      specialBootsColor: 'yellow',
      specialGloves: false,
      specialGlovesColor: 'green'
    };

    // Current Monster State
    this.monster = JSON.parse(JSON.stringify(this.defaultMonster));

    this.activeScreen = 'screen-start';
    this.activeCategory = 'eyes';
    this.activeWardrobeTab = 'tops';
    this.currentMode = 'creator'; // 'creator', 'challenge', 'listening', 'secret'
    this.speakingStepIndex = 0;
    this.speakingSteps = [];

    this.randomNames = ['Zippy', 'Bob', 'Gloop', 'Max', 'Spike', 'Fluffy', 'Pip', 'Bubbles', 'Ziggy', 'Munchy', 'Sparky', 'Gobo'];
  }

  init() {
    this.bindEvents();
    this.updateAllPreviews();
    this.updateCategoryUI();
    this.updateWardrobeUI();
    this.updateGlobalSoundToggles();
  }

  // ==========================================
  // NAVIGATION & SCREEN MANAGEMENT
  // ==========================================
  goToScreen(screenId, mode = 'creator') {
    this.activeScreen = screenId;
    this.currentMode = mode;

    document.querySelectorAll('.screen-view').forEach(scr => scr.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.soundEngine.playPop();

    if (screenId === 'screen-final') {
      this.renderFinalScreen();
      window.teacherMode.stats.monstersCreated++;
      window.teacherMode.addPoints(2, 'Monster Created');
      window.teacherMode.trackMonsterFeatures(this.monster);
    } else if (screenId === 'screen-create' || screenId === 'screen-dress') {
      this.updateAllPreviews();
      this.updatePhraseBadge();
      this.updateModeBanner();
    } else if (screenId === 'screen-challenge') {
      this.setupChallengeView();
    } else if (screenId === 'screen-listening') {
      this.setupListeningView();
    } else if (screenId === 'screen-secret') {
      this.setupSecretMonsterView();
    }
  }

  updateModeBanner() {
    const banners = [
      {
        el: document.getElementById('creator-mode-banner'),
        icon: document.getElementById('banner-quest-icon'),
        text: document.getElementById('banner-quest-text'),
        audioBtn: document.getElementById('banner-audio-replay-btn'),
        checkBtn: document.getElementById('banner-check-btn'),
        retBtn: document.getElementById('banner-return-btn')
      },
      {
        el: document.getElementById('dress-mode-banner'),
        icon: document.getElementById('dress-banner-quest-icon'),
        text: document.getElementById('dress-banner-quest-text'),
        audioBtn: document.getElementById('dress-banner-audio-replay-btn'),
        checkBtn: document.getElementById('dress-banner-check-btn'),
        retBtn: document.getElementById('dress-banner-return-btn')
      }
    ];

    banners.forEach(b => {
      if (!b.el) return;

      if (this.currentMode === 'challenge') {
        const quest = window.challengeEngine.getCurrentQuest();
        b.el.classList.remove('hidden');
        if (b.icon) b.icon.innerText = '🎯';
        if (b.text) b.text.innerText = `Mission: ${quest.instruction}`;
        if (b.audioBtn) b.audioBtn.style.display = 'none';
        if (b.checkBtn) b.checkBtn.style.display = 'inline-flex';
        if (b.retBtn) b.retBtn.innerText = '➔ Back to Mission';
      } else if (this.currentMode === 'listening') {
        const quest = window.challengeEngine.getCurrentListeningQuest();
        b.el.classList.remove('hidden');
        if (b.icon) b.icon.innerText = '👂';
        if (b.text) b.text.innerText = `Listening: Listen carefully & build!`;
        if (b.audioBtn) b.audioBtn.style.display = 'inline-flex';
        if (b.checkBtn) b.checkBtn.style.display = 'inline-flex';
        if (b.retBtn) b.retBtn.innerText = '➔ Back to Listening';
      } else if (this.currentMode === 'secret') {
        b.el.classList.remove('hidden');
        if (b.icon) b.icon.innerText = '🤫';
        if (b.text) b.text.innerText = `2-Player Mode: Player B is building!`;
        if (b.audioBtn) b.audioBtn.style.display = 'none';
        if (b.checkBtn) b.checkBtn.style.display = 'none';
        if (b.retBtn) b.retBtn.innerText = '➔ Compare Monsters!';
      } else {
        b.el.classList.add('hidden');
      }
    });
  }

  checkCurrentModeMission() {
    if (this.currentMode === 'challenge') {
      this.goToScreen('screen-challenge', 'challenge');
      this.checkChallenge();
    } else if (this.currentMode === 'listening') {
      this.goToScreen('screen-listening', 'listening');
      this.checkListening();
    }
  }

  returnToModeScreen() {
    if (this.currentMode === 'challenge') {
      this.goToScreen('screen-challenge', 'challenge');
    } else if (this.currentMode === 'listening') {
      this.goToScreen('screen-listening', 'listening');
    } else if (this.currentMode === 'secret') {
      this.goToScreen('screen-secret', 'secret');
    } else {
      this.goToScreen('screen-start', 'creator');
    }
  }

  // ==========================================
  // MONSTER PREVIEW UPDATER
  // ==========================================
  updateAllPreviews() {
    const svgHtml = window.monsterRenderer.renderSvg(this.monster, { animated: true });

    const previewContainers = [
      'create-monster-preview',
      'dress-monster-preview',
      'final-monster-preview',
      'challenge-monster-preview',
      'listening-monster-preview',
      'secret-player-monster-preview',
      'presentation-monster-preview'
    ];

    previewContainers.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = svgHtml;
      }
    });

    // Save feature tracking in stats
    window.teacherMode.trackMonsterFeatures(this.monster);
  }

  // ==========================================
  // PHRASE BADGE & PRONUNCIATION
  // ==========================================
  updatePhraseBadge(explicitText = null) {
    let phrase = '';
    let category = this.activeCategory;

    if (explicitText) {
      phrase = explicitText;
    } else if (this.activeScreen === 'screen-create') {
      switch (category) {
        case 'eyes':
          phrase = window.grammarEngine.getEyesPhrase(this.monster);
          break;
        case 'ears':
          phrase = window.grammarEngine.getEarsPhrase(this.monster);
          break;
        case 'mouth':
          phrase = window.grammarEngine.getMouthPhrase(this.monster);
          break;
        case 'teeth':
          phrase = window.grammarEngine.getTeethPhrase(this.monster) || 'No teeth';
          break;
        case 'legs':
          phrase = window.grammarEngine.getLegsPhrase(this.monster);
          break;
        case 'arms':
          phrase = window.grammarEngine.getArmsPhrase(this.monster);
          break;
        case 'nose':
          phrase = window.grammarEngine.getNosePhrase(this.monster);
          break;
        case 'color':
          phrase = `My monster is ${this.monster.color}!`;
          break;
        default:
          phrase = window.grammarEngine.getEyesPhrase(this.monster);
      }
    } else if (this.activeScreen === 'screen-dress') {
      const phrases = window.grammarEngine.getClothingPhrases(this.monster);
      phrase = phrases.length > 0 ? phrases[phrases.length - 1] : 'No clothes';
    }

    const badgeTextEl = document.getElementById('active-phrase-text');
    const dressBadgeTextEl = document.getElementById('dress-phrase-text');

    if (badgeTextEl && this.activeScreen === 'screen-create') {
      badgeTextEl.innerText = phrase.toUpperCase();
      badgeTextEl.parentElement.classList.add('badge-bounce');
      setTimeout(() => badgeTextEl.parentElement.classList.remove('badge-bounce'), 400);
    }

    if (dressBadgeTextEl && this.activeScreen === 'screen-dress') {
      dressBadgeTextEl.innerText = phrase.toUpperCase();
      dressBadgeTextEl.parentElement.classList.add('badge-bounce');
      setTimeout(() => dressBadgeTextEl.parentElement.classList.remove('badge-bounce'), 400);
    }
  }

  speakCurrentPhrase() {
    let phrase = '';
    if (this.activeScreen === 'screen-create') {
      const badgeTextEl = document.getElementById('active-phrase-text');
      phrase = badgeTextEl ? badgeTextEl.innerText : '';
    } else if (this.activeScreen === 'screen-dress') {
      const dressBadgeTextEl = document.getElementById('dress-phrase-text');
      phrase = dressBadgeTextEl ? dressBadgeTextEl.innerText : '';
    }

    if (phrase) {
      window.soundEngine.speak(phrase.toLowerCase());
    }
  }

  // ==========================================
  // SURPRISE ME! (RANDOMIZER)
  // ==========================================
  randomizeMonster() {
    window.soundEngine.playSparkle();

    const colors = ['purple', 'green', 'blue', 'red', 'orange', 'yellow', 'pink'];
    const eyesCounts = [1, 2, 3];
    const eyesSizes = ['big', 'small'];
    const earsCounts = [1, 2];
    const earsLengths = ['long', 'short'];
    const mouthTypes = ['big', 'small', 'scary'];
    const teethTypes = ['sharp', 'big', 'small'];
    const legsCounts = [2, 3, 4];
    const armsCounts = [2, 3, 'many'];
    const armsLengths = ['long', 'short'];
    const noseSizes = ['big', 'small'];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    this.monster.color = pick(colors);
    this.monster.eyesCount = pick(eyesCounts);
    this.monster.eyesSize = pick(eyesSizes);
    this.monster.earsCount = pick(earsCounts);
    this.monster.earsLength = pick(earsLengths);
    this.monster.mouthType = pick(mouthTypes);
    this.monster.teethType = pick(teethTypes);
    this.monster.legsCount = pick(legsCounts);
    this.monster.armsCount = pick(armsCounts);
    this.monster.armsLength = pick(armsLengths);
    this.monster.noseSize = pick(noseSizes);

    // Randomize Name
    this.monster.name = pick(this.randomNames);

    this.updateAllPreviews();
    this.updateCategoryUI();
    this.updateSelectionButtons();

    // Fun Surprise Banner
    const banner = document.getElementById('surprise-popup-banner');
    if (banner) {
      const eyesText = window.grammarEngine.getEyesPhrase(this.monster);
      const earsText = window.grammarEngine.getEarsPhrase(this.monster);
      banner.innerHTML = `
        <div class="surprise-content">
          <h3>🎉 WOW! SURPRISE MONSTER!</h3>
          <p>It has <strong>${eyesText}</strong> and <strong>${earsText}</strong>!</p>
        </div>
      `;
      banner.classList.add('show');
      window.soundEngine.speak(`Wow! It has ${eyesText}! It has ${earsText}!`);
      setTimeout(() => banner.classList.remove('show'), 3500);
    }

    this.updatePhraseBadge();
    window.teacherMode.addPoints(1, 'Surprise Monster');
  }

  // ==========================================
  // CATEGORY & OPTION CONTROLS (PHASE 1)
  // ==========================================
  setCategory(catName) {
    this.activeCategory = catName;
    window.soundEngine.playPop();

    // Update active tab button
    document.querySelectorAll('.cat-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === catName);
    });

    this.updateCategoryUI();
    this.updatePhraseBadge();
  }

  updateCategoryUI() {
    document.querySelectorAll('.category-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `cat-panel-${this.activeCategory}`);
    });
    this.updateSelectionButtons();
  }

  updateSelectionButtons() {
    // Eyes Size
    document.querySelectorAll('[data-eyes-size]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.eyesSize === this.monster.eyesSize);
    });
    // Eyes Count
    document.querySelectorAll('[data-eyes-count]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.eyesCount, 10) === this.monster.eyesCount);
    });
    // Ears Size
    document.querySelectorAll('[data-ears-length]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.earsLength === this.monster.earsLength);
    });
    // Ears Count
    document.querySelectorAll('[data-ears-count]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.earsCount, 10) === this.monster.earsCount);
    });
    // Mouth
    document.querySelectorAll('[data-mouth-type]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mouthType === this.monster.mouthType);
    });
    // Teeth
    document.querySelectorAll('[data-teeth-type]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.teethType === this.monster.teethType);
    });
    // Legs
    document.querySelectorAll('[data-legs-count]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.legsCount, 10) === this.monster.legsCount);
    });
    // Arms Length
    document.querySelectorAll('[data-arms-length]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.armsLength === this.monster.armsLength);
    });
    // Arms Count
    document.querySelectorAll('[data-arms-count]').forEach(btn => {
      const val = btn.dataset.armsCount === 'many' ? 'many' : parseInt(btn.dataset.armsCount, 10);
      btn.classList.toggle('active', val === this.monster.armsCount);
    });
    // Nose
    document.querySelectorAll('[data-nose-size]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.noseSize === this.monster.noseSize);
    });
    // Color
    document.querySelectorAll('[data-body-color]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bodyColor === this.monster.color);
    });
  }

  // ==========================================
  // WARDROBE CONTROLS (PHASE 2)
  // ==========================================
  setWardrobeTab(tabName) {
    this.activeWardrobeTab = tabName;
    window.soundEngine.playPop();

    document.querySelectorAll('.wardrobe-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    document.querySelectorAll('.wardrobe-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `wardrobe-panel-${tabName}`);
    });

    this.updateWardrobeUI();
  }

  updateWardrobeUI() {
    // Tops
    document.querySelectorAll('[data-cloth-top]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.clothTop === this.monster.clothesTop);
    });
    // Top Color Swatches
    document.querySelectorAll('[data-top-color]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.topColor === this.monster.clothesTopColor);
    });

    // Bottoms
    document.querySelectorAll('[data-cloth-bottom]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.clothBottom === this.monster.clothesBottom);
    });
    // Bottom Color Swatches
    document.querySelectorAll('[data-bottom-color]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bottomColor === this.monster.clothesBottomColor);
    });

    // Accessories (Multi-select)
    document.querySelectorAll('[data-accessory]').forEach(btn => {
      const acc = btn.dataset.accessory;
      const isSelected = this.monster.accessories && this.monster.accessories.includes(acc);
      btn.classList.toggle('active', isSelected);
    });

    // Special items
    const capeBtn = document.getElementById('special-btn-cape');
    if (capeBtn) capeBtn.classList.toggle('active', !!this.monster.specialCape);

    const bootsBtn = document.getElementById('special-btn-boots');
    if (bootsBtn) bootsBtn.classList.toggle('active', !!this.monster.specialBoots);

    const glovesBtn = document.getElementById('special-btn-gloves');
    if (glovesBtn) glovesBtn.classList.toggle('active', !!this.monster.specialGloves);
  }

  toggleAccessory(accName) {
    if (!this.monster.accessories) this.monster.accessories = [];
    const idx = this.monster.accessories.indexOf(accName);

    if (idx > -1) {
      this.monster.accessories.splice(idx, 1);
    } else {
      this.monster.accessories.push(accName);
    }

    window.soundEngine.playBoing();
    this.updateAllPreviews();
    this.updateWardrobeUI();
    this.updatePhraseBadge();
  }

  // ==========================================
  // FINAL SCREEN: NAME & DESCRIPTION
  // ==========================================
  renderFinalScreen() {
    const summary = window.grammarEngine.getMonsterSummary(this.monster);
    const fullParagraph = window.grammarEngine.getFullDescription(this.monster);

    // Update Name Input
    const nameInput = document.getElementById('monster-name-input');
    if (nameInput) {
      nameInput.value = this.monster.name;
    }

    const nameTitleEl = document.getElementById('final-monster-name-display');
    if (nameTitleEl) {
      nameTitleEl.innerText = this.monster.name;
    }

    // Structured Breakdown Card
    const summaryCard = document.getElementById('final-summary-breakdown');
    if (summaryCard) {
      summaryCard.innerHTML = `
        <div class="summary-line"><strong>📛 Name:</strong> <span>${summary.name}</span></div>
        <div class="summary-line"><strong>🎨 Color:</strong> <span class="capitalize">${summary.color}</span></div>
        <div class="summary-section">
          <strong>👁️ It has:</strong>
          <ul>
            ${summary.bodyFeatures.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        ${summary.clothingItems.length > 0 ? `
          <div class="summary-section">
            <strong>👕 It is wearing:</strong>
            <ul>
              ${summary.clothingItems.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      `;
    }

    // Full Paragraph Display
    const paragraphEl = document.getElementById('final-description-paragraph');
    if (paragraphEl) {
      paragraphEl.innerText = fullParagraph;
    }
  }

  setMonsterName(newName) {
    this.monster.name = newName.trim() || 'Zippy';
    const nameTitleEl = document.getElementById('final-monster-name-display');
    if (nameTitleEl) nameTitleEl.innerText = this.monster.name;
    this.renderFinalScreen();
  }

  pickRandomName() {
    window.soundEngine.playPop();
    const name = this.randomNames[Math.floor(Math.random() * this.randomNames.length)];
    this.setMonsterName(name);
  }

  // ==========================================
  // SPEAKING MODE (TELEPROMPTER)
  // ==========================================
  startSpeakingMode() {
    window.soundEngine.playSuccess();
    this.speakingSteps = window.grammarEngine.getSpeakingSentences(this.monster);
    this.speakingStepIndex = 0;

    const modal = document.getElementById('speaking-teleprompter-modal');
    if (modal) {
      modal.classList.add('active');
      this.renderSpeakingStep();
    }
  }

  renderSpeakingStep() {
    if (!this.speakingSteps || this.speakingSteps.length === 0) return;

    const step = this.speakingSteps[this.speakingStepIndex];
    const total = this.speakingSteps.length;

    document.getElementById('speaking-step-counter').innerText = `Sentence ${this.speakingStepIndex + 1} of ${total}`;
    document.getElementById('speaking-icon-badge').innerText = step.icon;
    document.getElementById('speaking-starter-prompt').innerText = `🗣️ SAY: "${step.starter}"`;
    document.getElementById('speaking-main-sentence').innerHTML = `<strong>${step.text}</strong>`;

    // Speak model sentence
    window.soundEngine.speak(step.text);
  }

  nextSpeakingStep() {
    if (this.speakingStepIndex < this.speakingSteps.length - 1) {
      this.speakingStepIndex++;
      window.soundEngine.playPop();
      this.renderSpeakingStep();
    } else {
      // Completed full speaking session!
      window.teacherMode.stats.speakingCompletedCount++;
      window.teacherMode.addPoints(3, 'Speaking Star!');
      this.closeSpeakingModal();
      window.teacherMode.checkBadges();
    }
  }

  prevSpeakingStep() {
    if (this.speakingStepIndex > 0) {
      this.speakingStepIndex--;
      window.soundEngine.playPop();
      this.renderSpeakingStep();
    }
  }

  closeSpeakingModal() {
    const modal = document.getElementById('speaking-teleprompter-modal');
    if (modal) modal.classList.remove('active');
    window.soundEngine.stopSpeech();
  }

  // ==========================================
  // CLASSROOM PRESENTATION MODE
  // ==========================================
  openPresentationMode() {
    window.soundEngine.playSparkle();
    const modal = document.getElementById('presentation-mode-modal');
    if (!modal) return;

    modal.classList.add('active');

    // Fill presentation details
    document.getElementById('pres-monster-name').innerText = this.monster.name.toUpperCase();
    document.getElementById('pres-monster-color').innerText = window.grammarEngine.capitalize(this.monster.color);

    const bulletsList = document.getElementById('pres-bullets-list');
    if (bulletsList) {
      const summary = window.grammarEngine.getMonsterSummary(this.monster);
      const items = [
        `👁️ ${window.grammarEngine.getEyesPhrase(this.monster)}`,
        `👂 ${window.grammarEngine.getEarsPhrase(this.monster)}`,
        `👄 ${window.grammarEngine.getMouthPhrase(this.monster)}`,
        summary.bodyFeatures.find(f => f.includes('teeth')) ? `🦷 ${window.grammarEngine.getTeethPhrase(this.monster)}` : null,
        `🦵 ${window.grammarEngine.getLegsPhrase(this.monster)}`,
        `👐 ${window.grammarEngine.getArmsPhrase(this.monster)}`,
        ...summary.clothingItems.map(c => `👕 ${c}`)
      ].filter(Boolean);

      bulletsList.innerHTML = items.map(it => `
        <div class="pres-bullet-card" onclick="window.soundEngine.speak('${it.replace(/[^a-zA-Z0-9 ]/g, '')}')">
          <span>${it}</span>
          <button class="pres-speak-chip">🔊</button>
        </div>
      `).join('');
    }

    this.updateAllPreviews();
  }

  closePresentationMode() {
    const modal = document.getElementById('presentation-mode-modal');
    if (modal) modal.classList.remove('active');
    window.soundEngine.stopSpeech();
  }

  // ==========================================
  // MONSTER CHALLENGE MODE
  // ==========================================
  setupChallengeView() {
    const quest = window.challengeEngine.getCurrentQuest();
    document.getElementById('challenge-quest-title').innerText = `Mission: ${quest.title}`;
    document.getElementById('challenge-quest-instruction').innerText = `👉 ${quest.instruction}`;
    document.getElementById('challenge-quest-hint').innerText = `💡 ${quest.hint}`;
    document.getElementById('challenge-feedback-banner').className = 'feedback-banner hidden';

    window.soundEngine.speak(quest.instruction);
    this.updateAllPreviews();
  }

  checkChallenge() {
    const quest = window.challengeEngine.getCurrentQuest();
    const isCorrect = quest.check(this.monster);

    const banner = document.getElementById('challenge-feedback-banner');

    if (isCorrect) {
      window.soundEngine.playSuccess();
      window.teacherMode.stats.challengesSolved++;
      window.teacherMode.addPoints(2, 'Mission Complete');
      banner.className = 'feedback-banner success';
      banner.innerHTML = `
        <h3>⭐ GREAT JOB! ⭐</h3>
        <p>You built: <strong>${quest.instruction}</strong></p>
        <button class="btn btn-primary" onclick="app.advanceChallenge()">NEXT MISSION ➔</button>
      `;
      window.teacherMode.triggerConfetti();
    } else {
      window.soundEngine.playTryAgain();
      banner.className = 'feedback-banner hint';
      banner.innerHTML = `
        <h3>🤔 Almost there! Try again!</h3>
        <p>${quest.hint}</p>
      `;
    }
  }

  advanceChallenge() {
    window.challengeEngine.nextQuest();
    this.setupChallengeView();
  }

  // ==========================================
  // LISTENING CHALLENGE MODE
  // ==========================================
  setupListeningView() {
    const quest = window.challengeEngine.getCurrentListeningQuest();
    const diff = window.challengeEngine.listeningDifficulty;

    const textCard = document.getElementById('listening-instruction-card');
    if (diff === 'easy') {
      textCard.innerHTML = `<p class="listening-text-large">${quest.easyText}</p>`;
    } else if (diff === 'medium') {
      textCard.innerHTML = `<p class="listening-text-medium">${quest.mediumText}</p>`;
    } else { // Hard (Audio only)
      textCard.innerHTML = `<p class="listening-text-hidden">🤫 Listen carefully to the voice!</p>`;
    }

    document.getElementById('listening-feedback-banner').className = 'feedback-banner hidden';
    this.playListeningAudio();
    this.updateAllPreviews();
  }

  playListeningAudio() {
    const quest = window.challengeEngine.getCurrentListeningQuest();
    window.soundEngine.playSparkle();
    setTimeout(() => {
      window.soundEngine.speak(quest.audioText);
    }, 200);
  }

  setListeningDifficulty(level) {
    window.challengeEngine.listeningDifficulty = level;
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.diff === level);
    });
    this.setupListeningView();
  }

  checkListening() {
    const quest = window.challengeEngine.getCurrentListeningQuest();
    const isCorrect = quest.check(this.monster);
    const banner = document.getElementById('listening-feedback-banner');

    if (isCorrect) {
      window.soundEngine.playSuccess();
      window.teacherMode.stats.challengesSolved++;
      window.teacherMode.addPoints(2, 'Listening Master');
      banner.className = 'feedback-banner success';
      banner.innerHTML = `
        <h3>⭐ PERFECT LISTENING! ⭐</h3>
        <p>"${quest.audioText}"</p>
        <button class="btn btn-primary" onclick="app.advanceListening()">NEXT SOUND ➔</button>
      `;
      window.teacherMode.triggerConfetti();
    } else {
      window.soundEngine.playTryAgain();
      banner.className = 'feedback-banner hint';
      banner.innerHTML = `
        <h3>👂 Listen once more!</h3>
        <button class="btn btn-secondary" onclick="app.playListeningAudio()">🔊 REPLAY AUDIO</button>
      `;
    }
  }

  advanceListening() {
    window.challengeEngine.nextListeningQuest();
    this.setupListeningView();
  }

  // ==========================================
  // SECRET MONSTER MODE (2-PLAYER)
  // ==========================================
  setupSecretMonsterView() {
    const secret = window.challengeEngine.generateSecretMonster();
    this.secretPlayerStep = 1; // 1: Player A describes, 2: Compare

    document.getElementById('secret-step-1').classList.add('active');
    document.getElementById('secret-step-2').classList.remove('active');

    // Fill Secret Monster Card for Player A
    const listEl = document.getElementById('secret-card-features');
    if (listEl) {
      const summary = window.grammarEngine.getMonsterSummary(secret);
      listEl.innerHTML = `
        <div class="secret-clue-item">🟣 <strong>Body Color:</strong> ${window.grammarEngine.capitalize(secret.color)}</div>
        <div class="secret-clue-item">👁️ <strong>Eyes:</strong> ${window.grammarEngine.getEyesPhrase(secret)}</div>
        <div class="secret-clue-item">👂 <strong>Ears:</strong> ${window.grammarEngine.getEarsPhrase(secret)}</div>
        <div class="secret-clue-item">👄 <strong>Mouth:</strong> ${window.grammarEngine.getMouthPhrase(secret)}</div>
        <div class="secret-clue-item">🦷 <strong>Teeth:</strong> ${window.grammarEngine.getTeethPhrase(secret) || 'None'}</div>
        <div class="secret-clue-item">👐 <strong>Arms:</strong> ${window.grammarEngine.getArmsPhrase(secret)}</div>
        <div class="secret-clue-item">🦵 <strong>Legs:</strong> ${window.grammarEngine.getLegsPhrase(secret)}</div>
        ${secret.specialCape ? `<div class="secret-clue-item">🦸 <strong>Special:</strong> Red Cape</div>` : ''}
        ${secret.accessories.length > 0 ? `<div class="secret-clue-item">👑 <strong>Accessory:</strong> ${secret.accessories.join(', ')}</div>` : ''}
      `;
    }

    this.updateAllPreviews();
  }

  compareSecretMonster() {
    window.soundEngine.playSuccess();
    const result = window.challengeEngine.compareMonsters(this.monster);

    document.getElementById('secret-step-1').classList.remove('active');
    document.getElementById('secret-step-2').classList.add('active');

    // Render Side-by-Side Monsters
    const secretSvg = window.monsterRenderer.renderSvg(window.challengeEngine.secretMonsterTarget, { animated: false });
    const playerSvg = window.monsterRenderer.renderSvg(this.monster, { animated: false });

    document.getElementById('secret-monster-reveal-preview').innerHTML = secretSvg;
    document.getElementById('player-monster-reveal-preview').innerHTML = playerSvg;

    // Render Score
    document.getElementById('secret-score-banner').innerHTML = `
      <h2>⭐ ${result.correct} / ${result.total} CORRECT! ⭐</h2>
      <p class="secret-congrats">${result.correct >= 6 ? '🎉 AMAZING TEAMWORK! Monster Masters!' : '💪 Great try! Keep practicing!'}</p>
    `;

    // Render Feature Comparison Table
    const tableEl = document.getElementById('secret-comparison-table');
    if (tableEl) {
      tableEl.innerHTML = `
        <div class="compare-row header">
          <div>Feature</div>
          <div>Secret Monster</div>
          <div>Your Monster</div>
          <div>Result</div>
        </div>
        ${result.details.map(d => `
          <div class="compare-row ${d.match ? 'match' : 'mismatch'}">
            <div><strong>${d.feature}</strong></div>
            <div>${d.target}</div>
            <div>${d.player}</div>
            <div>${d.match ? '✅ MATCH' : '❌ DIFF'}</div>
          </div>
        `).join('')}
      `;
    }

    window.teacherMode.addPoints(result.correct, 'Secret Monster');
    window.teacherMode.triggerConfetti();
  }

  // ==========================================
  // DOWNLOAD / EXPORT MONSTER CARD
  // ==========================================
  downloadMonsterCard() {
    window.soundEngine.playSparkle();

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1000);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1000);

    // Frame Border
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 16;
    ctx.strokeRect(20, 20, 760, 960);

    // Header Title
    ctx.fillStyle = '#4338ca';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👹 BUILD YOUR OWN MONSTER!', 400, 85);

    // Subtitle / Name
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(`Meet ${this.monster.name}!`, 400, 135);

    // Convert SVG to image
    const svgString = window.monsterRenderer.renderSvg(this.monster, { width: 380, height: 450, animated: false });
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 210, 160, 380, 450);
      URL.revokeObjectURL(url);

      // Draw Description Box
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(50, 640, 700, 310);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 640, 700, 310);

      // Text Lines
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('English Description:', 80, 680);

      ctx.font = '20px sans-serif';
      const lines = [
        `• This is ${this.monster.name}. It is ${this.monster.color}.`,
        `• It has ${window.grammarEngine.getEyesPhrase(this.monster)} and ${window.grammarEngine.getEarsPhrase(this.monster)}.`,
        `• It has ${window.grammarEngine.getMouthPhrase(this.monster)} and ${window.grammarEngine.getLegsPhrase(this.monster)}.`,
        `• It has ${window.grammarEngine.getArmsPhrase(this.monster)}.`
      ];

      const clothing = window.grammarEngine.getClothingPhrases(this.monster);
      if (clothing.length > 0) {
        lines.push(`• It is wearing ${window.grammarEngine.joinListNaturally(clothing)}.`);
      }

      lines.forEach((line, idx) => {
        ctx.fillText(line, 80, 725 + (idx * 40));
      });

      // Trigger Download
      const link = document.createElement('a');
      link.download = `${this.monster.name}_Monster_Card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  }

  // ==========================================
  // RESET / START AGAIN
  // ==========================================
  showResetModal() {
    window.soundEngine.playPop();
    const modal = document.getElementById('reset-confirm-modal');
    if (modal) modal.classList.add('active');
  }

  confirmReset() {
    this.monster = JSON.parse(JSON.stringify(this.defaultMonster));
    this.monster.name = this.randomNames[Math.floor(Math.random() * this.randomNames.length)];
    this.activeCategory = 'eyes';
    this.activeWardrobeTab = 'tops';
    this.updateAllPreviews();
    this.updateCategoryUI();
    this.updateWardrobeUI();
    this.closeResetModal();
    this.goToScreen('screen-create');
  }

  closeResetModal() {
    const modal = document.getElementById('reset-confirm-modal');
    if (modal) modal.classList.remove('active');
  }

  // ==========================================
  // SOUND TOGGLES
  // ==========================================
  toggleSfx() {
    const enabled = window.soundEngine.toggleSfx();
    this.updateGlobalSoundToggles();
    if (enabled) window.soundEngine.playPop();
  }

  toggleTts() {
    const enabled = window.soundEngine.toggleTts();
    this.updateGlobalSoundToggles();
    if (enabled) window.soundEngine.speak('English voice turned on');
  }

  updateGlobalSoundToggles() {
    const sfxBtns = document.querySelectorAll('.sfx-toggle-btn');
    sfxBtns.forEach(btn => {
      btn.innerText = window.soundEngine.sfxEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
      btn.classList.toggle('off', !window.soundEngine.sfxEnabled);
    });

    const ttsBtns = document.querySelectorAll('.tts-toggle-btn');
    ttsBtns.forEach(btn => {
      btn.innerText = window.soundEngine.ttsEnabled ? '🗣️ Voice: ON' : '🤐 Voice: OFF';
      btn.classList.toggle('off', !window.soundEngine.ttsEnabled);
    });
  }

  // ==========================================
  // EVENT BINDINGS
  // ==========================================
  bindEvents() {
    // 1. Navigation buttons
    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const screenId = e.currentTarget.dataset.goto;
        const mode = e.currentTarget.dataset.mode || 'creator';
        this.goToScreen(screenId, mode);
      });
    });

    // 2. Category Tab buttons (Phase 1)
    document.querySelectorAll('.cat-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setCategory(e.currentTarget.dataset.category);
      });
    });

    // 3. Phase 1 Option Selectors
    // Eyes Size
    document.querySelectorAll('[data-eyes-size]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.eyesSize = e.currentTarget.dataset.eyesSize;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    // Eyes Count
    document.querySelectorAll('[data-eyes-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.eyesCount = parseInt(e.currentTarget.dataset.eyesCount, 10);
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    // Ears Length
    document.querySelectorAll('[data-ears-length]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.earsLength = e.currentTarget.dataset.earsLength;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    // Ears Count
    document.querySelectorAll('[data-ears-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.earsCount = parseInt(e.currentTarget.dataset.earsCount, 10);
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    // Mouth
    document.querySelectorAll('[data-mouth-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.mouthType = e.currentTarget.dataset.mouthType;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    // Teeth
    document.querySelectorAll('[data-teeth-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.teethType = e.currentTarget.dataset.teethType;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    // Legs
    document.querySelectorAll('[data-legs-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.legsCount = parseInt(e.currentTarget.dataset.legsCount, 10);
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    // Arms Length
    document.querySelectorAll('[data-arms-length]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.armsLength = e.currentTarget.dataset.armsLength;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    // Arms Count
    document.querySelectorAll('[data-arms-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.armsCount === 'many' ? 'many' : parseInt(e.currentTarget.dataset.armsCount, 10);
        this.monster.armsCount = val;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    // Nose
    document.querySelectorAll('[data-nose-size]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.noseSize = e.currentTarget.dataset.noseSize;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    // Color
    document.querySelectorAll('[data-body-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.color = e.currentTarget.dataset.bodyColor;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });

    // 4. Wardrobe Tabs & Buttons (Phase 2)
    document.querySelectorAll('.wardrobe-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setWardrobeTab(e.currentTarget.dataset.tab);
      });
    });
    // Tops
    document.querySelectorAll('[data-cloth-top]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.clothesTop = e.currentTarget.dataset.clothTop;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateWardrobeUI();
        this.updatePhraseBadge();
      });
    });
    // Top Color Swatches
    document.querySelectorAll('[data-top-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.clothesTopColor = e.currentTarget.dataset.topColor;
        window.soundEngine.playPop();
        this.updateAllPreviews();
        this.updateWardrobeUI();
        this.updatePhraseBadge();
      });
    });
    // Bottoms
    document.querySelectorAll('[data-cloth-bottom]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.clothesBottom = e.currentTarget.dataset.clothBottom;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateWardrobeUI();
        this.updatePhraseBadge();
      });
    });
    // Bottom Color Swatches
    document.querySelectorAll('[data-bottom-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.clothesBottomColor = e.currentTarget.dataset.bottomColor;
        window.soundEngine.playPop();
        this.updateAllPreviews();
        this.updateWardrobeUI();
        this.updatePhraseBadge();
      });
    });
    // Accessories
    document.querySelectorAll('[data-accessory]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.toggleAccessory(e.currentTarget.dataset.accessory);
      });
    });
    // Special Cape
    const capeBtn = document.getElementById('special-btn-cape');
    if (capeBtn) {
      capeBtn.addEventListener('click', () => {
        this.monster.specialCape = !this.monster.specialCape;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateWardrobeUI();
        this.updatePhraseBadge(this.monster.specialCape ? 'RED CAPE' : 'NO CAPE');
      });
    }
    // Special Boots
    const bootsBtn = document.getElementById('special-btn-boots');
    if (bootsBtn) {
      bootsBtn.addEventListener('click', () => {
        this.monster.specialBoots = !this.monster.specialBoots;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateWardrobeUI();
        this.updatePhraseBadge(this.monster.specialBoots ? 'YELLOW BOOTS' : 'NO BOOTS');
      });
    }
    // Special Gloves
    const glovesBtn = document.getElementById('special-btn-gloves');
    if (glovesBtn) {
      glovesBtn.addEventListener('click', () => {
        this.monster.specialGloves = !this.monster.specialGloves;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateWardrobeUI();
        this.updatePhraseBadge(this.monster.specialGloves ? 'GREEN GLOVES' : 'NO GLOVES');
      });
    }

    // 5. Randomizer Button
    const surpriseBtn = document.getElementById('surprise-me-btn');
    if (surpriseBtn) {
      surpriseBtn.addEventListener('click', () => this.randomizeMonster());
    }

    // 6. Name Input
    const nameInput = document.getElementById('monster-name-input');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => this.setMonsterName(e.target.value));
    }
    const randNameBtn = document.getElementById('random-name-btn');
    if (randNameBtn) {
      randNameBtn.addEventListener('click', () => this.pickRandomName());
    }

    // 7. Phrase Audio Speaker Buttons
    document.querySelectorAll('.hear-phrase-btn').forEach(btn => {
      btn.addEventListener('click', () => this.speakCurrentPhrase());
    });
  }
}

// Global Application Controller instance
window.app = new MonsterApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
