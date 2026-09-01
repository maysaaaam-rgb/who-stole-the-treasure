/**
 * app.js - Main Application State & Stage Controller for "Build Your Own Monster!"
 */

class MonsterApp {
  constructor() {
    this.defaultMonster = {
      name: 'Zippy',
      bodyShape: 'round',
      color: 'purple',
      secondaryColor: 'yellow',
      pattern: 'none',
      eyesCount: 2,
      eyesSize: 'big',
      eyesStyle: 'round',
      earsCount: 2,
      earsStyle: 'long',
      hornsCount: 0,
      hornsStyle: 'curly',
      mouthType: 'big',
      teethType: 'sharp',
      noseStyle: 'small',
      legsCount: 2,
      feetStyle: 'normal',
      armsCount: 2,
      armsLength: 'short',
      handsStyle: 'normal',
      specialWings: 'none',
      specialTail: 'none',
      specialParts: [],
      clothesTop: 'none',
      clothesTopColor: 'blue',
      clothesBottom: 'none',
      clothesBottomColor: 'black',
      clothesShoes: 'none',
      specialSuit: 'none',
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
      specialGlovesColor: 'green',
      powers: ['fly'],
      personality: ['funny'],
      world: 'castle',
      food: 'pizza'
    };

    // Current Monster State
    this.monster = JSON.parse(JSON.stringify(this.defaultMonster));

    this.activeScreen = 'screen-start';
    this.activeCreatorStage = 'stage-body';
    this.currentMode = 'creator'; // 'creator', 'challenge', 'listening', 'secret'
    this.speakingStepIndex = 0;
    this.speakingSteps = [];

    this.stages = [
      'stage-body',
      'stage-face',
      'stage-arms',
      'stage-legs',
      'stage-special',
      'stage-colors',
      'stage-clothes',
      'stage-powers',
      'stage-personality',
      'stage-world',
      'stage-food'
    ];

    this.randomNames = ['Zippy', 'Bob', 'Gloop', 'Max', 'Spike', 'Fluffy', 'Pip', 'Bubbles', 'Ziggy', 'Munchy', 'Sparky', 'Gobo', 'Barnaby', 'Fizzy', 'Pebble'];
  }

  init() {
    this.bindEvents();
    this.updateAllPreviews();
    this.setCreatorStage('stage-body');
    this.updateSelectionButtons();
    this.updateGlobalSoundToggles();
  }

  // ==========================================
  // NAVIGATION & STAGE PROGRESSION
  // ==========================================
  goToScreen(screenId, mode = 'creator') {
    this.activeScreen = screenId;
    this.currentMode = mode;

    document.querySelectorAll('.screen-view').forEach(scr => scr.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.soundEngine.playPop();

    if (screenId === 'screen-final') {
      this.renderFinalScreen();
      window.teacherMode.stats.monstersCreated++;
      window.teacherMode.addPoints(2, 'Monster Created');
      window.teacherMode.trackMonsterFeatures(this.monster);
    } else if (screenId === 'screen-create') {
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

  setCreatorStage(stageId) {
    this.activeCreatorStage = stageId;
    window.soundEngine.playPop();

    // Update Stage Tabs
    document.querySelectorAll('.stage-step-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.stage === stageId);
    });

    // Update Stage Panels
    document.querySelectorAll('.creator-stage-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === stageId);
    });

    this.updatePhraseBadge();
  }

  nextStage() {
    const currentIndex = this.stages.indexOf(this.activeCreatorStage);
    if (currentIndex < this.stages.length - 1) {
      this.setCreatorStage(this.stages[currentIndex + 1]);
    } else {
      this.goToScreen('screen-final');
    }
  }

  prevStage() {
    const currentIndex = this.stages.indexOf(this.activeCreatorStage);
    if (currentIndex > 0) {
      this.setCreatorStage(this.stages[currentIndex - 1]);
    } else {
      this.goToScreen('screen-start');
    }
  }

  // ==========================================
  // MONSTER PREVIEW UPDATER
  // ==========================================
  updateAllPreviews() {
    const svgHtml = window.monsterRenderer.renderSvg(this.monster, { animated: true });

    const previewContainers = [
      'create-monster-preview',
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

    window.teacherMode.trackMonsterFeatures(this.monster);
  }

  // ==========================================
  // PHRASE BADGE & PRONUNCIATION
  // ==========================================
  updatePhraseBadge(explicitText = null) {
    let phrase = '';

    if (explicitText) {
      phrase = explicitText;
    } else if (this.activeScreen === 'screen-create') {
      switch (this.activeCreatorStage) {
        case 'stage-body':
          phrase = `A ${this.monster.bodyShape || 'round'} body!`;
          break;
        case 'stage-face':
          phrase = window.grammarEngine.getEyesPhrase(this.monster);
          break;
        case 'stage-arms':
          phrase = window.grammarEngine.getArmsPhrase(this.monster);
          break;
        case 'stage-legs':
          phrase = window.grammarEngine.getLegsPhrase(this.monster);
          break;
        case 'stage-special':
          const specials = window.grammarEngine.getSpecialPartsPhrases(this.monster);
          phrase = specials.length > 0 ? specials[0] : 'Special parts';
          break;
        case 'stage-colors':
          phrase = `${this.monster.color} with ${this.monster.pattern !== 'none' ? this.monster.pattern : 'soft belly'}!`;
          break;
        case 'stage-clothes':
          const clothes = window.grammarEngine.getClothingPhrases(this.monster);
          phrase = clothes.length > 0 ? clothes[clothes.length - 1] : 'Clothes & accessories';
          break;
        case 'stage-powers':
          phrase = `It can ${window.grammarEngine.getPowersPhrase(this.monster) || 'fly'}!`;
          break;
        case 'stage-personality':
          phrase = `It is ${window.grammarEngine.getPersonalityPhrase(this.monster)}!`;
          break;
        case 'stage-world':
          phrase = `It ${window.grammarEngine.getWorldPhrase(this.monster)}!`;
          break;
        case 'stage-food':
          phrase = `It likes ${window.grammarEngine.getFoodPhrase(this.monster)}!`;
          break;
        default:
          phrase = `Meet ${this.monster.name}!`;
      }
    }

    const badgeTextEl = document.getElementById('active-phrase-text');
    if (badgeTextEl && this.activeScreen === 'screen-create') {
      badgeTextEl.innerText = phrase.toUpperCase();
      badgeTextEl.parentElement.classList.add('badge-bounce');
      setTimeout(() => badgeTextEl.parentElement.classList.remove('badge-bounce'), 400);
    }
  }

  speakCurrentPhrase() {
    const badgeTextEl = document.getElementById('active-phrase-text');
    const phrase = badgeTextEl ? badgeTextEl.innerText : '';
    if (phrase) {
      window.soundEngine.speak(phrase.toLowerCase());
    }
  }

  // ==========================================
  // MAKE IT WEIRD! (CREATIVE RANDOMIZER)
  // ==========================================
  makeItWeird() {
    window.soundEngine.playSparkle();

    const shapes = ['round', 'square', 'tall', 'short', 'wide', 'thin', 'blob', 'ghost', 'dinosaur', 'robot'];
    const colors = ['purple', 'green', 'blue', 'red', 'orange', 'yellow', 'pink', 'black', 'white'];
    const patterns = ['none', 'spots', 'stripes', 'stars', 'hearts', 'dots', 'zigzags', 'rainbow'];
    const eyeCounts = [1, 2, 3, 4, 'many'];
    const eyeSizes = ['tiny', 'small', 'big', 'giant'];
    const eyeStyles = ['round', 'star', 'heart', 'sleepy', 'happy', 'angry', 'surprised'];
    const earCounts = [0, 1, 2, 4];
    const earStyles = ['tiny', 'long', 'floppy', 'pointy', 'round'];
    const hornCounts = [0, 1, 2, 4];
    const hornStyles = ['curly', 'pointy', 'spiral', 'big'];
    const mouthTypes = ['tiny', 'small', 'big', 'huge', 'scary', 'smiling'];
    const teethTypes = ['none', 'small', 'big', 'sharp', 'vampire', 'giant'];
    const noseStyles = ['none', 'tiny', 'small', 'big', 'long', 'funny'];
    const armCounts = [0, 1, 2, 3, 4, 'many'];
    const armLengths = ['tiny', 'short', 'long', 'super_long'];
    const handStyles = ['normal', 'claws', 'giant', 'three_fingers'];
    const legCounts = [0, 1, 2, 3, 4];
    const feetStyles = ['normal', 'claws', 'bird', 'monster'];
    const wings = ['none', 'dragon', 'butterfly', 'bat'];
    const tails = ['none', 'long', 'curly', 'dinosaur', 'snake', 'bunny'];
    const powers = ['fly', 'breathe_fire', 'make_ice', 'shoot_lightning', 'invisible', 'jump_high', 'swim_fast', 'magic'];
    const personalities = ['funny', 'friendly', 'scary', 'crazy', 'sleepy', 'clever', 'happy'];
    const worlds = ['house', 'forest', 'castle', 'volcano', 'ocean', 'ice_world', 'moon', 'space', 'jungle', 'cave'];
    const foods = ['pizza', 'burgers', 'ice_cream', 'apples', 'fish', 'cake', 'chocolate'];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    this.monster.bodyShape = pick(shapes);
    this.monster.color = pick(colors);
    this.monster.secondaryColor = pick(colors);
    this.monster.pattern = pick(patterns);
    this.monster.eyesCount = pick(eyeCounts);
    this.monster.eyesSize = pick(eyeSizes);
    this.monster.eyesStyle = pick(eyeStyles);
    this.monster.earsCount = pick(earCounts);
    this.monster.earsStyle = pick(earStyles);
    this.monster.hornsCount = pick(hornCounts);
    this.monster.hornsStyle = pick(hornStyles);
    this.monster.mouthType = pick(mouthTypes);
    this.monster.teethType = pick(teethTypes);
    this.monster.noseStyle = pick(noseStyles);
    this.monster.armsCount = pick(armCounts);
    this.monster.armsLength = pick(armLengths);
    this.monster.handsStyle = pick(handStyles);
    this.monster.legsCount = pick(legCounts);
    this.monster.feetStyle = pick(feetStyles);
    this.monster.specialWings = pick(wings);
    this.monster.specialTail = pick(tails);
    this.monster.powers = [pick(powers), pick(powers)].filter((v, i, a) => a.indexOf(v) === i);
    this.monster.personality = [pick(personalities)];
    this.monster.world = pick(worlds);
    this.monster.food = pick(foods);
    this.monster.name = pick(this.randomNames);

    this.updateAllPreviews();
    this.updateSelectionButtons();

    // Creative Weird Popup Banner
    const banner = document.getElementById('surprise-popup-banner');
    if (banner) {
      const desc = window.grammarEngine.getFullDescription(this.monster);
      banner.innerHTML = `
        <div class="surprise-content">
          <h3>🎲 WOW! SUPER WEIRD MONSTER!</h3>
          <p>${desc}</p>
        </div>
      `;
      banner.classList.add('show');
      window.soundEngine.speak(`Meet ${this.monster.name}! It is super weird and creative!`);
      setTimeout(() => banner.classList.remove('show'), 4000);
    }

    this.updatePhraseBadge();
    window.teacherMode.addPoints(1, 'Creative Monster');
  }

  // ==========================================
  // CLASSROOM SPEAKING GAME: "FIND A MONSTER"
  // ==========================================
  openFindMonsterGame() {
    window.soundEngine.playSparkle();
    const modal = document.getElementById('find-monster-modal');
    if (!modal) return;

    const prompt = window.challengeEngine.getRandomFindPrompt();
    document.getElementById('find-monster-prompt-text').innerText = prompt.text;
    modal.classList.add('active');

    window.soundEngine.speak(prompt.text);
  }

  closeFindMonsterGame() {
    const modal = document.getElementById('find-monster-modal');
    if (modal) modal.classList.remove('active');
    window.soundEngine.stopSpeech();
  }

  // ==========================================
  // SELECTION BUTTONS SYNC
  // ==========================================
  updateSelectionButtons() {
    // Body Shapes
    document.querySelectorAll('[data-body-shape]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bodyShape === this.monster.bodyShape);
    });

    // Body Colors
    document.querySelectorAll('[data-body-color]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bodyColor === this.monster.color);
    });
    // Secondary Colors
    document.querySelectorAll('[data-secondary-color]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.secondaryColor === this.monster.secondaryColor);
    });
    // Patterns
    document.querySelectorAll('[data-pattern]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.pattern === this.monster.pattern);
    });

    // Eyes Count, Size, Style
    document.querySelectorAll('[data-eyes-count]').forEach(btn => {
      const val = btn.dataset.eyesCount === 'many' ? 'many' : parseInt(btn.dataset.eyesCount, 10);
      btn.classList.toggle('active', val === this.monster.eyesCount);
    });
    document.querySelectorAll('[data-eyes-size]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.eyesSize === this.monster.eyesSize);
    });
    document.querySelectorAll('[data-eyes-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.eyesStyle === this.monster.eyesStyle);
    });

    // Ears Count & Style
    document.querySelectorAll('[data-ears-count]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.earsCount, 10) === this.monster.earsCount);
    });
    document.querySelectorAll('[data-ears-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.earsStyle === this.monster.earsStyle);
    });

    // Horns Count & Style
    document.querySelectorAll('[data-horns-count]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.hornsCount, 10) === this.monster.hornsCount);
    });
    document.querySelectorAll('[data-horns-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.hornsStyle === this.monster.hornsStyle);
    });

    // Mouth & Teeth
    document.querySelectorAll('[data-mouth-type]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mouthType === this.monster.mouthType);
    });
    document.querySelectorAll('[data-teeth-type]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.teethType === this.monster.teethType);
    });
    document.querySelectorAll('[data-nose-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.noseStyle === this.monster.noseStyle);
    });

    // Arms & Hands
    document.querySelectorAll('[data-arms-count]').forEach(btn => {
      const val = btn.dataset.armsCount === 'many' ? 'many' : parseInt(btn.dataset.armsCount, 10);
      btn.classList.toggle('active', val === this.monster.armsCount);
    });
    document.querySelectorAll('[data-arms-length]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.armsLength === this.monster.armsLength);
    });
    document.querySelectorAll('[data-hands-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.handsStyle === this.monster.handsStyle);
    });

    // Legs & Feet
    document.querySelectorAll('[data-legs-count]').forEach(btn => {
      const val = btn.dataset.legsCount === 'many' ? 'many' : parseInt(btn.dataset.legsCount, 10);
      btn.classList.toggle('active', val === this.monster.legsCount);
    });
    document.querySelectorAll('[data-feet-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.feetStyle === this.monster.feetStyle);
    });

    // Special Parts (Wings, Tails, Extras)
    document.querySelectorAll('[data-special-wings]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.specialWings === this.monster.specialWings);
    });
    document.querySelectorAll('[data-special-tail]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.specialTail === this.monster.specialTail);
    });
    document.querySelectorAll('[data-special-extra]').forEach(btn => {
      const extra = btn.dataset.specialExtra;
      const isSelected = this.monster.specialParts && this.monster.specialParts.includes(extra);
      btn.classList.toggle('active', isSelected);
    });

    // Clothes
    document.querySelectorAll('[data-cloth-top]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.clothTop === this.monster.clothesTop);
    });
    document.querySelectorAll('[data-cloth-bottom]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.clothBottom === this.monster.clothesBottom);
    });
    document.querySelectorAll('[data-cloth-shoes]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.clothShoes === this.monster.clothesShoes);
    });
    document.querySelectorAll('[data-special-suit]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.specialSuit === this.monster.specialSuit);
    });

    // Accessories
    document.querySelectorAll('[data-accessory]').forEach(btn => {
      const acc = btn.dataset.accessory;
      const isSelected = this.monster.accessories && this.monster.accessories.includes(acc);
      btn.classList.toggle('active', isSelected);
    });

    // Powers (Multi-select)
    document.querySelectorAll('[data-power]').forEach(btn => {
      const p = btn.dataset.power;
      const isSelected = this.monster.powers && this.monster.powers.includes(p);
      btn.classList.toggle('active', isSelected);
    });

    // Personality (Multi-select)
    document.querySelectorAll('[data-personality]').forEach(btn => {
      const trait = btn.dataset.personality;
      const isSelected = this.monster.personality && this.monster.personality.includes(trait);
      btn.classList.toggle('active', isSelected);
    });

    // World
    document.querySelectorAll('[data-world]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.world === this.monster.world);
    });

    // Food
    document.querySelectorAll('[data-food]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.food === this.monster.food);
    });
  }

  togglePower(powerName) {
    if (!this.monster.powers) this.monster.powers = [];
    const idx = this.monster.powers.indexOf(powerName);
    if (idx > -1) {
      this.monster.powers.splice(idx, 1);
    } else {
      this.monster.powers.push(powerName);
    }
    window.soundEngine.playBoing();
    this.updateAllPreviews();
    this.updateSelectionButtons();
    this.updatePhraseBadge();
  }

  togglePersonality(trait) {
    if (!this.monster.personality) this.monster.personality = [];
    const idx = this.monster.personality.indexOf(trait);
    if (idx > -1) {
      this.monster.personality.splice(idx, 1);
    } else {
      this.monster.personality.push(trait);
    }
    window.soundEngine.playBoing();
    this.updateAllPreviews();
    this.updateSelectionButtons();
    this.updatePhraseBadge();
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
    this.updateSelectionButtons();
    this.updatePhraseBadge();
  }

  toggleSpecialExtra(extraName) {
    if (!this.monster.specialParts) this.monster.specialParts = [];
    const idx = this.monster.specialParts.indexOf(extraName);
    if (idx > -1) {
      this.monster.specialParts.splice(idx, 1);
    } else {
      this.monster.specialParts.push(extraName);
    }
    window.soundEngine.playBoing();
    this.updateAllPreviews();
    this.updateSelectionButtons();
    this.updatePhraseBadge();
  }

  // ==========================================
  // FINAL SCREEN: SHOWCASE & DESCRIPTIONS
  // ==========================================
  renderFinalScreen() {
    const summary = window.grammarEngine.getMonsterSummary(this.monster);
    const fullParagraph = window.grammarEngine.getFullDescription(this.monster);

    const nameInput = document.getElementById('monster-name-input');
    if (nameInput) nameInput.value = this.monster.name;

    const nameTitleEl = document.getElementById('final-monster-name-display');
    if (nameTitleEl) nameTitleEl.innerText = this.monster.name;

    const summaryCard = document.getElementById('final-summary-breakdown');
    if (summaryCard) {
      summaryCard.innerHTML = `
        <div class="summary-line"><strong>📛 Name:</strong> <span>${summary.name}</span></div>
        <div class="summary-line"><strong>🎨 Appearance:</strong> <span class="capitalize">${summary.colorDesc}</span></div>
        <div class="summary-section">
          <strong>👁️ Features:</strong>
          <ul>
            ${summary.bodyFeatures.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
        ${summary.clothingItems.length > 0 ? `
          <div class="summary-section">
            <strong>👕 Clothes:</strong>
            <ul>
              ${summary.clothingItems.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${summary.powers ? `
          <div class="summary-line"><strong>✨ Super Power:</strong> <span>It can ${summary.powers}</span></div>
        ` : ''}
        ${summary.personality ? `
          <div class="summary-line"><strong>❤️ Personality:</strong> <span>It is ${summary.personality}</span></div>
        ` : ''}
        ${summary.world ? `
          <div class="summary-line"><strong>🏠 Home:</strong> <span>It ${summary.world}</span></div>
        ` : ''}
        ${summary.food ? `
          <div class="summary-line"><strong>🍕 Favorite Food:</strong> <span>It likes ${summary.food}</span></div>
        ` : ''}
      `;
    }

    const paragraphEl = document.getElementById('final-description-paragraph');
    if (paragraphEl) paragraphEl.innerText = fullParagraph;
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

    window.soundEngine.speak(step.text);
  }

  nextSpeakingStep() {
    if (this.speakingStepIndex < this.speakingSteps.length - 1) {
      this.speakingStepIndex++;
      window.soundEngine.playPop();
      this.renderSpeakingStep();
    } else {
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

    document.getElementById('pres-monster-name').innerText = this.monster.name.toUpperCase();
    document.getElementById('pres-monster-color').innerText = window.grammarEngine.capitalize(this.monster.color);

    const bulletsList = document.getElementById('pres-bullets-list');
    if (bulletsList) {
      const summary = window.grammarEngine.getMonsterSummary(this.monster);
      const items = [
        `🎨 ${summary.colorDesc}`,
        `👁️ ${window.grammarEngine.getEyesPhrase(this.monster)}`,
        this.monster.hornsCount > 0 ? `🦄 ${window.grammarEngine.getHornsPhrase(this.monster)}` : null,
        `👄 ${window.grammarEngine.getMouthPhrase(this.monster)}`,
        summary.bodyFeatures.find(f => f.includes('teeth')) ? `🦷 ${window.grammarEngine.getTeethPhrase(this.monster)}` : null,
        `👐 ${window.grammarEngine.getArmsPhrase(this.monster)}`,
        `🦵 ${window.grammarEngine.getLegsPhrase(this.monster)}`,
        ...summary.clothingItems.map(c => `👕 ${c}`),
        summary.powers ? `✨ Can ${summary.powers}` : null,
        summary.personality ? `❤️ Is ${summary.personality}` : null,
        summary.world ? `🏠 ${summary.world}` : null,
        summary.food ? `🍕 Likes ${summary.food}` : null
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
  // MONSTER CHALLENGE & LISTENING MODES
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

  setupListeningView() {
    const quest = window.challengeEngine.getCurrentListeningQuest();
    const diff = window.challengeEngine.listeningDifficulty;

    const textCard = document.getElementById('listening-instruction-card');
    if (diff === 'easy') {
      textCard.innerHTML = `<p class="listening-text-large">${quest.easyText}</p>`;
    } else if (diff === 'medium') {
      textCard.innerHTML = `<p class="listening-text-medium">${quest.mediumText}</p>`;
    } else {
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
  // SECRET MONSTER 2-PLAYER MODE
  // ==========================================
  setupSecretMonsterView() {
    const secret = window.challengeEngine.generateSecretMonster();
    document.getElementById('secret-step-1').classList.add('active');
    document.getElementById('secret-step-2').classList.remove('active');

    const listEl = document.getElementById('secret-card-features');
    if (listEl) {
      const summary = window.grammarEngine.getMonsterSummary(secret);
      listEl.innerHTML = `
        <div class="secret-clue-item">🟣 <strong>Body Color:</strong> ${window.grammarEngine.capitalize(secret.color)}</div>
        <div class="secret-clue-item">👁️ <strong>Eyes:</strong> ${window.grammarEngine.getEyesPhrase(secret)}</div>
        <div class="secret-clue-item">👂 <strong>Ears:</strong> ${window.grammarEngine.getEarsPhrase(secret)}</div>
        <div class="secret-clue-item">👄 <strong>Mouth:</strong> ${window.grammarEngine.getMouthPhrase(secret)}</div>
        ${secret.specialWings !== 'none' ? `<div class="secret-clue-item">🐉 <strong>Wings:</strong> ${secret.specialWings} wings</div>` : ''}
        ${summary.powers ? `<div class="secret-clue-item">✨ <strong>Power:</strong> Can ${summary.powers}</div>` : ''}
        ${summary.world ? `<div class="secret-clue-item">🏠 <strong>Home:</strong> ${summary.world}</div>` : ''}
        ${summary.food ? `<div class="secret-clue-item">🍕 <strong>Food:</strong> Likes ${summary.food}</div>` : ''}
      `;
    }

    this.updateAllPreviews();
  }

  compareSecretMonster() {
    window.soundEngine.playSuccess();
    const result = window.challengeEngine.compareMonsters(this.monster);

    document.getElementById('secret-step-1').classList.remove('active');
    document.getElementById('secret-step-2').classList.add('active');

    const secretSvg = window.monsterRenderer.renderSvg(window.challengeEngine.secretMonsterTarget, { animated: false });
    const playerSvg = window.monsterRenderer.renderSvg(this.monster, { animated: false });

    document.getElementById('secret-monster-reveal-preview').innerHTML = secretSvg;
    document.getElementById('player-monster-reveal-preview').innerHTML = playerSvg;

    document.getElementById('secret-score-banner').innerHTML = `
      <h2>⭐ ${result.correct} / ${result.total} CORRECT! ⭐</h2>
      <p class="secret-congrats">${result.correct >= 6 ? '🎉 AMAZING TEAMWORK! Monster Masters!' : '💪 Great try! Keep practicing!'}</p>
    `;

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
  // DOWNLOAD MONSTER CARD (CANVAS PNG)
  // ==========================================
  downloadMonsterCard() {
    window.soundEngine.playSparkle();

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1060;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 1060);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1060);

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 16;
    ctx.strokeRect(20, 20, 760, 1020);

    ctx.fillStyle = '#4338ca';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👹 BUILD YOUR OWN MONSTER!', 400, 75);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(`Meet ${this.monster.name}!`, 400, 120);

    const svgString = window.monsterRenderer.renderSvg(this.monster, { width: 380, height: 450, animated: false });
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 210, 140, 380, 450);
      URL.revokeObjectURL(url);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(50, 610, 700, 400);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 610, 700, 400);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('English Description:', 75, 645);

      ctx.font = '19px sans-serif';
      const lines = [
        `• This is ${this.monster.name}. It is ${window.grammarEngine.getColorAndPatternPhrase(this.monster)}.`,
        `• It has ${window.grammarEngine.getEyesPhrase(this.monster)} and ${window.grammarEngine.getEarsPhrase(this.monster)}.`,
        `• It has ${window.grammarEngine.getMouthPhrase(this.monster)} and ${window.grammarEngine.getArmsPhrase(this.monster)}.`,
        `• It has ${window.grammarEngine.getLegsPhrase(this.monster)}.`
      ];

      const specials = window.grammarEngine.getSpecialPartsPhrases(this.monster);
      if (specials.length > 0) lines.push(`• It has ${window.grammarEngine.joinListNaturally(specials)}.`);

      const powers = window.grammarEngine.getPowersPhrase(this.monster);
      if (powers) lines.push(`• It can ${powers}.`);

      const personality = window.grammarEngine.getPersonalityPhrase(this.monster);
      if (personality) lines.push(`• It is ${personality}.`);

      const world = window.grammarEngine.getWorldPhrase(this.monster);
      const food = window.grammarEngine.getFoodPhrase(this.monster);
      lines.push(`• It ${world} and likes ${food}.`);

      lines.forEach((line, idx) => {
        ctx.fillText(line, 75, 685 + (idx * 34));
      });

      const link = document.createElement('a');
      link.download = `${this.monster.name}_Monster_Card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  }

  // ==========================================
  // RESET / RESTART
  // ==========================================
  showResetModal() {
    window.soundEngine.playPop();
    const modal = document.getElementById('reset-confirm-modal');
    if (modal) modal.classList.add('active');
  }

  confirmReset() {
    this.monster = JSON.parse(JSON.stringify(this.defaultMonster));
    this.monster.name = this.randomNames[Math.floor(Math.random() * this.randomNames.length)];
    this.updateAllPreviews();
    this.setCreatorStage('stage-body');
    this.updateSelectionButtons();
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
    document.querySelectorAll('.sfx-toggle-btn').forEach(btn => {
      btn.innerText = window.soundEngine.sfxEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
      btn.classList.toggle('off', !window.soundEngine.sfxEnabled);
    });

    document.querySelectorAll('.tts-toggle-btn').forEach(btn => {
      btn.innerText = window.soundEngine.ttsEnabled ? '🗣️ Voice: ON' : '🤐 Voice: OFF';
      btn.classList.toggle('off', !window.soundEngine.ttsEnabled);
    });
  }

  // ==========================================
  // EVENT BINDINGS
  // ==========================================
  bindEvents() {
    // 1. Navigation
    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const screenId = e.currentTarget.dataset.goto;
        const mode = e.currentTarget.dataset.mode || 'creator';
        this.goToScreen(screenId, mode);
      });
    });

    // 2. Stage Progress Steps
    document.querySelectorAll('.stage-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setCreatorStage(e.currentTarget.dataset.stage);
      });
    });

    // 3. Body Shapes
    document.querySelectorAll('[data-body-shape]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.bodyShape = e.currentTarget.dataset.bodyShape;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });

    // 4. Body Colors & Secondary Colors & Patterns
    document.querySelectorAll('[data-body-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.color = e.currentTarget.dataset.bodyColor;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-secondary-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.secondaryColor = e.currentTarget.dataset.secondaryColor;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-pattern]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.pattern = e.currentTarget.dataset.pattern;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });

    // 5. Face Elements
    document.querySelectorAll('[data-eyes-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.eyesCount === 'many' ? 'many' : parseInt(e.currentTarget.dataset.eyesCount, 10);
        this.monster.eyesCount = val;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-eyes-size]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.eyesSize = e.currentTarget.dataset.eyesSize;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-eyes-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.eyesStyle = e.currentTarget.dataset.eyesStyle;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });

    // Ears
    document.querySelectorAll('[data-ears-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.earsCount = parseInt(e.currentTarget.dataset.earsCount, 10);
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-ears-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.earsStyle = e.currentTarget.dataset.earsStyle;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });

    // Horns
    document.querySelectorAll('[data-horns-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.hornsCount = parseInt(e.currentTarget.dataset.hornsCount, 10);
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-horns-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.hornsStyle = e.currentTarget.dataset.hornsStyle;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });

    // Nose
    document.querySelectorAll('[data-nose-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.noseStyle = e.currentTarget.dataset.noseStyle;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });

    // Mouth & Teeth
    document.querySelectorAll('[data-mouth-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.mouthType = e.currentTarget.dataset.mouthType;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-teeth-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.teethType = e.currentTarget.dataset.teethType;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });

    // 6. Arms & Hands
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
    document.querySelectorAll('[data-arms-length]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.armsLength = e.currentTarget.dataset.armsLength;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-hands-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.handsStyle = e.currentTarget.dataset.handsStyle;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });

    // 7. Legs & Feet
    document.querySelectorAll('[data-legs-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.legsCount === 'many' ? 'many' : parseInt(e.currentTarget.dataset.legsCount, 10);
        this.monster.legsCount = val;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-feet-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.feetStyle = e.currentTarget.dataset.feetStyle;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });

    // 8. Special Parts
    document.querySelectorAll('[data-special-wings]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.specialWings = e.currentTarget.dataset.specialWings;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-special-tail]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.specialTail = e.currentTarget.dataset.specialTail;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-special-extra]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.toggleSpecialExtra(e.currentTarget.dataset.specialExtra);
      });
    });

    // 9. Clothes & Accessories
    document.querySelectorAll('[data-cloth-top]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.clothesTop = e.currentTarget.dataset.clothTop;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-cloth-bottom]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.clothesBottom = e.currentTarget.dataset.clothBottom;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-cloth-shoes]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.clothesShoes = e.currentTarget.dataset.clothShoes;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-special-suit]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.specialSuit = e.currentTarget.dataset.specialSuit;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-accessory]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.toggleAccessory(e.currentTarget.dataset.accessory);
      });
    });

    // 10. Powers & Personality & World & Food
    document.querySelectorAll('[data-power]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.togglePower(e.currentTarget.dataset.power);
      });
    });
    document.querySelectorAll('[data-personality]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.togglePersonality(e.currentTarget.dataset.personality);
      });
    });
    document.querySelectorAll('[data-world]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.world = e.currentTarget.dataset.world;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });
    document.querySelectorAll('[data-food]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.monster.food = e.currentTarget.dataset.food;
        window.soundEngine.playBoing();
        this.updateAllPreviews();
        this.updateSelectionButtons();
        this.updatePhraseBadge();
      });
    });

    // 11. Make it Weird & Surprise Button
    const weirdBtn = document.getElementById('make-it-weird-btn');
    if (weirdBtn) weirdBtn.addEventListener('click', () => this.makeItWeird());

    const surpriseBtn = document.getElementById('surprise-me-btn');
    if (surpriseBtn) surpriseBtn.addEventListener('click', () => this.makeItWeird());

    // 12. Name Input
    const nameInput = document.getElementById('monster-name-input');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => this.setMonsterName(e.target.value));
    }
    const randNameBtn = document.getElementById('random-name-btn');
    if (randNameBtn) {
      randNameBtn.addEventListener('click', () => this.pickRandomName());
    }

    // 13. Hear Phrase Button
    document.querySelectorAll('.hear-phrase-btn').forEach(btn => {
      btn.addEventListener('click', () => this.speakCurrentPhrase());
    });
  }

  updateModeBanner() {
    const banner = document.getElementById('creator-mode-banner');
    if (!banner) return;

    if (this.currentMode === 'challenge') {
      const quest = window.challengeEngine.getCurrentQuest();
      banner.classList.remove('hidden');
      document.getElementById('banner-quest-icon').innerText = '🎯';
      document.getElementById('banner-quest-text').innerText = `Mission: ${quest.instruction}`;
      document.getElementById('banner-audio-replay-btn').style.display = 'none';
      document.getElementById('banner-check-btn').style.display = 'inline-flex';
      document.getElementById('banner-return-btn').innerText = '➔ Back to Mission';
    } else if (this.currentMode === 'listening') {
      banner.classList.remove('hidden');
      document.getElementById('banner-quest-icon').innerText = '👂';
      document.getElementById('banner-quest-text').innerText = `Listening: Listen carefully & build!`;
      document.getElementById('banner-audio-replay-btn').style.display = 'inline-flex';
      document.getElementById('banner-check-btn').style.display = 'inline-flex';
      document.getElementById('banner-return-btn').innerText = '➔ Back to Listening';
    } else if (this.currentMode === 'secret') {
      banner.classList.remove('hidden');
      document.getElementById('banner-quest-icon').innerText = '🤫';
      document.getElementById('banner-quest-text').innerText = `2-Player Mode: Player B is building!`;
      document.getElementById('banner-audio-replay-btn').style.display = 'none';
      document.getElementById('banner-check-btn').style.display = 'none';
      document.getElementById('banner-return-btn').innerText = '➔ Compare Monsters!';
    } else {
      banner.classList.add('hidden');
    }
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
    if (this.currentMode === 'challenge') this.goToScreen('screen-challenge', 'challenge');
    else if (this.currentMode === 'listening') this.goToScreen('screen-listening', 'listening');
    else if (this.currentMode === 'secret') this.goToScreen('screen-secret', 'secret');
    else this.goToScreen('screen-start', 'creator');
  }
}

window.app = new MonsterApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
