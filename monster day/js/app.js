/**
 * app.js - Main Application Orchestrator & UI Controller
 * "Build Your Own Monster!"
 * Coordinates State Store, Renderer, Grammar Engine, Audio, Challenges, and UI.
 */

class MonsterApp {
  constructor() {
    this.currentScreen = 'screen-start';
    this.currentMode = 'creator'; // 'creator', 'challenge', 'listening', 'secret'
    this.currentStage = 'stage-body';
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
      'stage-accessories',
      'stage-powers',
      'stage-personality',
      'stage-world',
      'stage-food'
    ];

    this.randomNames = [
      'Zippy', 'Grumble', 'Fluffy', 'Sparky', 'Bob', 'Blobby', 'Pip', 'Ziggy', 
      'Munchkin', 'Barnaby', 'Cosmo', 'Toby', 'Gizmo', 'Waffles', 'Bubbles', 'Rex'
    ];

    this.init();
  }

  init() {
    // 1. Subscribe to Monster State updates
    window.monsterStore.subscribe((monster) => {
      this.onMonsterUpdated(monster);
    });

    // 2. Bind all UI Events
    this.bindEvents();

    // 3. Initial Rendering
    this.updateAllPreviews();
    this.updateSelectionButtons();
    this.updatePhraseBadge();
    this.updateGlobalSoundToggles();
  }

  // ==========================================
  // STATE CHANGE LISTENER
  // ==========================================
  onMonsterUpdated(monster) {
    this.updateAllPreviews();
    this.updateSelectionButtons();
    this.updatePhraseBadge();

    // If currently on final screen, update description
    if (this.currentScreen === 'screen-final') {
      this.renderFinalScreen();
    }
  }

  // ==========================================
  // SCREEN NAVIGATION
  // ==========================================
  goToScreen(screenId, mode = null) {
    window.soundEngine.playPop();
    if (mode) this.currentMode = mode;

    document.querySelectorAll('.screen-view').forEach(screen => {
      screen.classList.remove('active');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
    }

    // Header Home Visibility & Banner sync
    const banner = document.getElementById('creator-mode-banner');
    if (screenId === 'screen-create' && (this.currentMode === 'challenge' || this.currentMode === 'listening')) {
      if (banner) banner.classList.remove('hidden');
      this.updateCreatorQuestBanner();
    } else {
      if (banner) banner.classList.add('hidden');
    }

    if (screenId === 'screen-final') {
      this.renderFinalScreen();
      window.teacherMode.stats.monstersCreated++;
      window.teacherMode.addPoints(2, 'Monster Complete!');
      window.teacherMode.triggerConfetti();
    } else if (screenId === 'screen-challenge') {
      this.setupChallengeView();
    } else if (screenId === 'screen-listening') {
      this.setupListeningView();
    } else if (screenId === 'screen-secret') {
      this.setupSecretMonsterView();
    }

    this.updateAllPreviews();
  }

  // ==========================================
  // CREATOR STAGE CONTROLLER (12 Steps)
  // ==========================================
  setCreatorStage(stageId) {
    window.soundEngine.playPop();
    this.currentStage = stageId;

    // Update Stage Buttons
    document.querySelectorAll('.stage-step-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.stage === stageId);
    });

    // Update Panels
    document.querySelectorAll('.creator-stage-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === stageId);
    });

    this.updatePhraseBadge();
  }

  nextStage() {
    const idx = this.stages.indexOf(this.currentStage);
    if (idx < this.stages.length - 1) {
      this.setCreatorStage(this.stages[idx + 1]);
    } else {
      this.goToScreen('screen-final');
    }
  }

  prevStage() {
    const idx = this.stages.indexOf(this.currentStage);
    if (idx > 0) {
      this.setCreatorStage(this.stages[idx - 1]);
    } else {
      this.goToScreen('screen-start');
    }
  }

  // ==========================================
  // LIVE PREVIEW UPDATER
  // ==========================================
  updateAllPreviews() {
    const monster = window.monsterStore.get();
    const svgHtml = window.monsterRenderer.renderSvg(monster);

    const containers = [
      'create-monster-preview',
      'final-monster-preview',
      'challenge-monster-preview',
      'listening-monster-preview',
      'secret-player-monster-preview',
      'presentation-monster-preview'
    ];

    containers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = svgHtml;
    });
  }

  // ==========================================
  // ACTIVE ENGLISH PHRASE BADGE
  // ==========================================
  updatePhraseBadge() {
    const monster = window.monsterStore.get();
    let phrase = '';

    switch (this.currentStage) {
      case 'stage-body':
        phrase = `${monster.body.toUpperCase()} BODY`;
        break;
      case 'stage-face':
        phrase = window.grammarEngine.getEyesPhrase(monster).toUpperCase();
        break;
      case 'stage-arms':
        phrase = window.grammarEngine.getArmsPhrase(monster).toUpperCase();
        break;
      case 'stage-legs':
        phrase = window.grammarEngine.getLegsPhrase(monster).toUpperCase();
        break;
      case 'stage-special':
        const specials = window.grammarEngine.getSpecialPartsPhrases(monster);
        phrase = specials.length > 0 ? specials.join(', ').toUpperCase() : 'NO SPECIAL PARTS';
        break;
      case 'stage-colors':
        phrase = window.grammarEngine.getColorAndPatternPhrase(monster).toUpperCase();
        break;
      case 'stage-clothes':
        const clothes = window.grammarEngine.getClothingPhrases(monster);
        phrase = clothes.length > 0 ? clothes.join(', ').toUpperCase() : 'NO CLOTHES';
        break;
      case 'stage-accessories':
        phrase = monster.accessories.length > 0 ? monster.accessories.join(', ').toUpperCase() : 'NO ACCESSORIES';
        break;
      case 'stage-powers':
        phrase = monster.powers.length > 0 ? `CAN ${monster.powers.join(', ').toUpperCase()}` : 'CHOOSE A POWER';
        break;
      case 'stage-personality':
        phrase = monster.personality.length > 0 ? `IS ${monster.personality.join(', ').toUpperCase()}` : 'CHOOSE PERSONALITY';
        break;
      case 'stage-world':
        phrase = `LIVES IN ${monster.world.toUpperCase()}`;
        break;
      case 'stage-food':
        phrase = `LIKES ${monster.food.toUpperCase()}`;
        break;
      default:
        phrase = `MEET ${monster.name.toUpperCase()}`;
    }

    const textEl = document.getElementById('active-phrase-text');
    if (textEl) textEl.innerText = phrase;
  }

  speakActivePhrase() {
    const textEl = document.getElementById('active-phrase-text');
    if (textEl) {
      window.soundEngine.speak(textEl.innerText.toLowerCase());
    }
  }

  // ==========================================
  // MAKE IT WEIRD (CREATIVE RANDOMIZER)
  // ==========================================
  makeItWeird() {
    window.soundEngine.playSparkle();

    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const shapes = ['round', 'tall', 'short', 'wide', 'thin', 'blob', 'ghost', 'dinosaur', 'robot'];
    const colors = ['purple', 'green', 'blue', 'red', 'orange', 'yellow', 'pink', 'black', 'white'];
    const patterns = ['none', 'spots', 'stripes', 'stars', 'hearts', 'dots', 'zigzags', 'rainbow'];
    const eyeCounts = [1, 2, 3, 4, 'many'];
    const eyeSizes = ['tiny', 'small', 'big', 'giant'];
    const eyeStyles = ['round', 'star', 'heart', 'sleepy', 'happy', 'angry', 'surprised', 'funny'];
    const earCounts = [0, 1, 2, 4];
    const earStyles = ['tiny', 'small', 'long', 'floppy', 'pointy', 'round', 'animal'];
    const hornCounts = [0, 1, 2, 4];
    const hornStyles = ['tiny', 'big', 'curly', 'pointy', 'spiral'];
    const noses = ['none', 'tiny', 'small', 'big', 'long', 'round', 'funny'];
    const mouths = ['tiny', 'small', 'big', 'huge', 'smiling', 'happy', 'surprised', 'scary'];
    const teeth = ['none', 'small', 'big', 'sharp', 'vampire', 'giant'];
    const armCounts = [0, 1, 2, 3, 4, 'many'];
    const armLengths = ['tiny', 'short', 'normal', 'long', 'super_long'];
    const handStyles = ['normal', 'tiny', 'giant', 'claws', 'three_fingers', 'four_fingers'];
    const legCounts = [0, 1, 2, 3, 4, 'many'];
    const feetStyles = ['tiny', 'normal', 'big', 'giant', 'claws', 'bird', 'monster'];
    const wings = ['none', 'dragon', 'butterfly', 'bat'];
    const tails = ['none', 'long', 'curly', 'dinosaur', 'snake', 'bunny'];
    const powers = ['fly', 'breathe_fire', 'make_ice', 'shoot_lightning', 'invisible', 'jump_high', 'swim_fast', 'super_strong', 'magic', 'run_fast'];
    const personalities = ['friendly', 'funny', 'scary', 'angry', 'happy', 'sleepy', 'crazy', 'shy', 'strong', 'clever'];
    const worlds = ['house', 'forest', 'castle', 'volcano', 'ocean', 'ice_world', 'moon', 'space', 'jungle', 'cave'];
    const foods = ['pizza', 'burgers', 'ice cream', 'apples', 'fish', 'cake', 'sandwiches', 'chocolate'];

    const weirdMonster = {
      name: pick(this.randomNames),
      body: pick(shapes),
      color: pick(colors),
      secondaryColor: pick(colors),
      pattern: pick(patterns),
      eyes: { count: pick(eyeCounts), size: pick(eyeSizes), style: pick(eyeStyles) },
      ears: { count: pick(earCounts), style: pick(earStyles) },
      horns: { count: pick(hornCounts), style: pick(hornStyles) },
      nose: pick(noses),
      mouth: pick(mouths),
      teeth: pick(teeth),
      expression: 'happy',
      arms: { count: pick(armCounts), length: pick(armLengths) },
      hands: pick(handStyles),
      legs: { count: pick(legCounts) },
      feet: pick(feetStyles),
      specialParts: {
        wings: pick(wings),
        tail: pick(tails),
        spikes: Math.random() > 0.6,
        fins: Math.random() > 0.7,
        tentacles: Math.random() > 0.8,
        shell: Math.random() > 0.8
      },
      clothes: {
        outfit: 'none',
        top: 'none',
        topColor: pick(colors),
        bottom: 'none',
        bottomColor: pick(colors),
        shoes: 'none',
        shoesColor: pick(colors),
        cape: Math.random() > 0.5,
        capeColor: 'red'
      },
      accessories: [],
      accessoryColors: { hat: 'yellow', cap: 'blue' },
      powers: [pick(powers)],
      personality: [pick(personalities)],
      world: pick(worlds),
      food: pick(foods)
    };

    window.monsterStore.set(weirdMonster);

    // Creative Weird Popup Banner
    const banner = document.getElementById('surprise-popup-banner');
    if (banner) {
      const desc = window.grammarEngine.getFullDescription(weirdMonster);
      banner.innerHTML = `
        <div class="surprise-content">
          <h3>🎲 WOW! SUPER WEIRD MONSTER!</h3>
          <p>${desc}</p>
        </div>
      `;
      banner.classList.add('show');
      window.soundEngine.speak(`Meet ${weirdMonster.name}! It is super weird and creative!`);
      setTimeout(() => banner.classList.remove('show'), 4000);
    }

    window.teacherMode.addPoints(1, 'Creative Monster');
  }

  // ==========================================
  // SYNC SELECTION BUTTONS STATE
  // ==========================================
  updateSelectionButtons() {
    const m = window.monsterStore.get();

    // Body Shapes
    document.querySelectorAll('[data-body-shape]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bodyShape === m.body);
    });

    // Body Colors & Secondary Colors & Patterns
    document.querySelectorAll('[data-body-color]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bodyColor === m.color);
    });
    document.querySelectorAll('[data-secondary-color]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.secondaryColor === m.secondaryColor);
    });
    document.querySelectorAll('[data-pattern]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.pattern === m.pattern);
    });

    // Eyes
    document.querySelectorAll('[data-eyes-count]').forEach(btn => {
      const val = btn.dataset.eyesCount === 'many' ? 'many' : parseInt(btn.dataset.eyesCount, 10);
      btn.classList.toggle('active', val === m.eyes.count);
    });
    document.querySelectorAll('[data-eyes-size]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.eyesSize === m.eyes.size);
    });
    document.querySelectorAll('[data-eyes-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.eyesStyle === m.eyes.style);
    });

    // Ears
    document.querySelectorAll('[data-ears-count]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.earsCount, 10) === m.ears.count);
    });
    document.querySelectorAll('[data-ears-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.earsStyle === m.ears.style);
    });

    // Horns
    document.querySelectorAll('[data-horns-count]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.hornsCount, 10) === m.horns.count);
    });
    document.querySelectorAll('[data-horns-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.hornsStyle === m.horns.style);
    });

    // Nose, Mouth, Teeth, Expressions
    document.querySelectorAll('[data-nose-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.noseStyle === m.nose);
    });
    document.querySelectorAll('[data-mouth-type]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mouthType === m.mouth);
    });
    document.querySelectorAll('[data-teeth-type]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.teethType === m.teeth);
    });
    document.querySelectorAll('[data-expression]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.expression === m.expression);
    });

    // Arms & Hands
    document.querySelectorAll('[data-arms-count]').forEach(btn => {
      const val = btn.dataset.armsCount === 'many' ? 'many' : parseInt(btn.dataset.armsCount, 10);
      btn.classList.toggle('active', val === m.arms.count);
    });
    document.querySelectorAll('[data-arms-length]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.armsLength === m.arms.length);
    });
    document.querySelectorAll('[data-hands-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.handsStyle === m.hands);
    });

    // Legs & Feet
    document.querySelectorAll('[data-legs-count]').forEach(btn => {
      const val = btn.dataset.legsCount === 'many' ? 'many' : parseInt(btn.dataset.legsCount, 10);
      btn.classList.toggle('active', val === m.legs.count);
    });
    document.querySelectorAll('[data-feet-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.feetStyle === m.feet);
    });

    // Special Parts
    document.querySelectorAll('[data-special-wings]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.specialWings === m.specialParts.wings);
    });
    document.querySelectorAll('[data-special-tail]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.specialTail === m.specialParts.tail);
    });
    document.querySelectorAll('[data-special-extra]').forEach(btn => {
      const extra = btn.dataset.specialExtra;
      btn.classList.toggle('active', !!m.specialParts[extra]);
    });

    // Clothes & Outfits
    document.querySelectorAll('[data-special-suit]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.specialSuit === m.clothes.outfit);
    });
    document.querySelectorAll('[data-cloth-top]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.clothTop === m.clothes.top);
    });
    document.querySelectorAll('[data-cloth-bottom]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.clothBottom === m.clothes.bottom);
    });
    document.querySelectorAll('[data-cloth-shoes]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.clothShoes === m.clothes.shoes);
    });

    // Accessories
    document.querySelectorAll('[data-accessory]').forEach(btn => {
      const acc = btn.dataset.accessory;
      btn.classList.toggle('active', m.accessories.includes(acc));
    });

    // Powers & Personality
    document.querySelectorAll('[data-power]').forEach(btn => {
      const p = btn.dataset.power;
      btn.classList.toggle('active', m.powers.includes(p));
    });
    document.querySelectorAll('[data-personality]').forEach(btn => {
      const trait = btn.dataset.personality;
      btn.classList.toggle('active', m.personality.includes(trait));
    });

    // World & Food
    document.querySelectorAll('[data-world]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.world === m.world);
    });
    document.querySelectorAll('[data-food]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.food === m.food);
    });
  }

  // ==========================================
  // FINAL SCREEN: SHOWCASE & DESCRIPTIONS
  // ==========================================
  renderFinalScreen() {
    const monster = window.monsterStore.get();
    const summary = window.grammarEngine.getMonsterSummary(monster);
    const fullParagraph = window.grammarEngine.getFullDescription(monster);

    const nameInput = document.getElementById('monster-name-input');
    if (nameInput) nameInput.value = monster.name;

    const nameTitleEl = document.getElementById('final-monster-name-display');
    if (nameTitleEl) nameTitleEl.innerText = monster.name;

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
    window.monsterStore.setName(newName);
    const nameTitleEl = document.getElementById('final-monster-name-display');
    if (nameTitleEl) nameTitleEl.innerText = window.monsterStore.get().name;
    this.renderFinalScreen();
  }

  pickRandomName() {
    window.soundEngine.playPop();
    const name = this.randomNames[Math.floor(Math.random() * this.randomNames.length)];
    this.setMonsterName(name);
  }

  // ==========================================
  // SPEAKING TELEPROMPTER MODE
  // ==========================================
  startSpeakingMode() {
    window.soundEngine.playSuccess();
    const monster = window.monsterStore.get();
    this.speakingSteps = window.grammarEngine.getSpeakingSentences(monster);
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

    const monster = window.monsterStore.get();
    modal.classList.add('active');

    document.getElementById('pres-monster-name').innerText = monster.name.toUpperCase();

    const bulletsList = document.getElementById('pres-bullets-list');
    if (bulletsList) {
      const summary = window.grammarEngine.getMonsterSummary(monster);
      const items = [
        `🎨 ${summary.colorDesc}`,
        `👁️ ${window.grammarEngine.getEyesPhrase(monster)}`,
        monster.horns.count > 0 ? `🦄 ${window.grammarEngine.getHornsPhrase(monster)}` : null,
        `👄 ${window.grammarEngine.getMouthPhrase(monster)}`,
        summary.bodyFeatures.find(f => f.includes('teeth')) ? `🦷 ${window.grammarEngine.getTeethPhrase(monster)}` : null,
        `👐 ${window.grammarEngine.getArmsPhrase(monster)}`,
        `🦵 ${window.grammarEngine.getLegsPhrase(monster)}`,
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
  // CHALLENGE & LISTENING MODES
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
    const monster = window.monsterStore.get();
    const isCorrect = quest.check(monster);
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
      banner.className = 'feedback-banner error';
      banner.innerHTML = `
        <h3>💪 KEEP TRYING!</h3>
        <p>${quest.hint}</p>
        <button class="btn btn-secondary" data-goto="screen-create" data-mode="challenge">🛠️ Open Creator & Fix</button>
      `;
    }
  }

  advanceChallenge() {
    window.challengeEngine.nextQuest();
    this.setupChallengeView();
  }

  setupListeningView() {
    const task = window.challengeEngine.getCurrentListening();
    const diff = window.challengeEngine.listeningDifficulty;
    const card = document.getElementById('listening-instruction-card');

    if (diff === 'hard') {
      card.innerHTML = `<div class="quest-mission-title">👂 Audio Clue Active!</div><p>Listen carefully and build what you hear!</p>`;
    } else if (diff === 'medium') {
      card.innerHTML = `<div class="quest-mission-title">👂 Audio Clue:</div><p>${task.easyText.split(' ').map((w, i) => i % 3 === 0 ? '___' : w).join(' ')}</p>`;
    } else {
      card.innerHTML = `<div class="quest-mission-title">👂 Spoken Clue:</div><p>👉 ${task.easyText}</p>`;
    }

    document.getElementById('listening-feedback-banner').className = 'feedback-banner hidden';
    window.soundEngine.speak(task.audioText);
    this.updateAllPreviews();
  }

  playListeningAudio() {
    const task = window.challengeEngine.getCurrentListening();
    window.soundEngine.speak(task.audioText);
  }

  setListeningDifficulty(diff) {
    window.challengeEngine.listeningDifficulty = diff;
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.diff === diff);
    });
    this.setupListeningView();
  }

  checkListening() {
    const task = window.challengeEngine.getCurrentListening();
    const monster = window.monsterStore.get();
    const isCorrect = task.check(monster);
    const banner = document.getElementById('listening-feedback-banner');

    if (isCorrect) {
      window.soundEngine.playSuccess();
      window.teacherMode.addPoints(2, 'Listening Star');
      banner.className = 'feedback-banner success';
      banner.innerHTML = `
        <h3>⭐ FANTASTIC LISTENING! ⭐</h3>
        <p>You built: <strong>${task.audioText}</strong></p>
        <button class="btn btn-primary" onclick="app.advanceListening()">NEXT LISTENING CLUE ➔</button>
      `;
      window.teacherMode.triggerConfetti();
    } else {
      window.soundEngine.playTryAgain();
      banner.className = 'feedback-banner error';
      banner.innerHTML = `
        <h3>💪 LISTEN AGAIN!</h3>
        <button class="btn btn-accent" onclick="app.playListeningAudio()">🔊 Replay Audio</button>
        <button class="btn btn-secondary" data-goto="screen-create" data-mode="listening">🛠️ Open Creator & Fix</button>
      `;
    }
  }

  advanceListening() {
    window.challengeEngine.nextListening();
    this.setupListeningView();
  }

  // ==========================================
  // CREATOR QUEST BANNER SYNC
  // ==========================================
  updateCreatorQuestBanner() {
    const banner = document.getElementById('creator-mode-banner');
    const textEl = document.getElementById('banner-quest-text');
    const replayBtn = document.getElementById('banner-audio-replay-btn');

    if (this.currentMode === 'challenge') {
      const quest = window.challengeEngine.getCurrentQuest();
      textEl.innerText = `Mission: ${quest.instruction}`;
      if (replayBtn) replayBtn.style.display = 'none';
    } else if (this.currentMode === 'listening') {
      const task = window.challengeEngine.getCurrentListening();
      textEl.innerText = window.challengeEngine.listeningDifficulty === 'hard' ? 'Listen carefully to the audio clue!' : `Clue: ${task.easyText}`;
      if (replayBtn) replayBtn.style.display = 'inline-block';
    }
  }

  checkCurrentModeMission() {
    if (this.currentMode === 'challenge') {
      this.goToScreen('screen-challenge');
      this.checkChallenge();
    } else if (this.currentMode === 'listening') {
      this.goToScreen('screen-listening');
      this.checkListening();
    }
  }

  returnToModeScreen() {
    if (this.currentMode === 'challenge') this.goToScreen('screen-challenge');
    else if (this.currentMode === 'listening') this.goToScreen('screen-listening');
    else if (this.currentMode === 'secret') this.goToScreen('screen-secret');
  }

  // ==========================================
  // 2-PLAYER SECRET MONSTER MODE
  // ==========================================
  setupSecretMonsterView() {
    const secret = window.challengeEngine.generateSecretMonster();

    document.getElementById('secret-step-1').classList.add('active');
    document.getElementById('secret-step-2').classList.remove('active');

    const cluesList = document.getElementById('secret-card-features');
    if (cluesList) {
      cluesList.innerHTML = `
        <div class="secret-clue-pill">🎨 Color: ${secret.color.toUpperCase()}</div>
        <div class="secret-clue-pill">👁️ Eyes: ${secret.eyes.count} EYES</div>
        <div class="secret-clue-pill">👂 Ears: ${secret.ears.count} EARS</div>
        <div class="secret-clue-pill">🦄 Horns: ${secret.horns.count > 0 ? `${secret.horns.count} HORNS` : 'NO HORNS'}</div>
        <div class="secret-clue-pill">🦷 Teeth: ${secret.teeth === 'sharp' ? 'SHARP TEETH' : 'NO TEETH'}</div>
        <div class="secret-clue-pill">👐 Arms: ${secret.arms.count} ARMS</div>
        <div class="secret-clue-pill">🦵 Legs: ${secret.legs.count} LEGS</div>
        <div class="secret-clue-pill">🪽 Wings: ${secret.specialParts.wings !== 'none' ? secret.specialParts.wings.toUpperCase() + ' WINGS' : 'NO WINGS'}</div>
        <div class="secret-clue-pill">🦸 Cape: ${secret.clothes.cape ? 'RED CAPE' : 'NO CAPE'}</div>
      `;
    }

    this.updateAllPreviews();
  }

  compareSecretMonster() {
    window.soundEngine.playSuccess();
    const monster = window.monsterStore.get();
    const result = window.challengeEngine.compareMonsters(monster);

    document.getElementById('secret-step-1').classList.remove('active');
    document.getElementById('secret-step-2').classList.add('active');

    const secretSvg = window.monsterRenderer.renderSvg(window.challengeEngine.secretMonsterTarget, { animated: false });
    const playerSvg = window.monsterRenderer.renderSvg(monster, { animated: false });

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
    const monster = window.monsterStore.get();

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
    ctx.fillText(`Meet ${monster.name}!`, 400, 120);

    const svgString = window.monsterRenderer.renderSvg(monster, { width: 380, height: 450, animated: false });
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
        `• This is ${monster.name}. It is ${window.grammarEngine.getColorAndPatternPhrase(monster)}.`,
        `• It has ${window.grammarEngine.getEyesPhrase(monster)} and ${window.grammarEngine.getEarsPhrase(monster)}.`,
        `• It has ${window.grammarEngine.getMouthPhrase(monster)} and ${window.grammarEngine.getArmsPhrase(monster)}.`,
        `• It has ${window.grammarEngine.getLegsPhrase(monster)}.`
      ];

      const specials = window.grammarEngine.getSpecialPartsPhrases(monster);
      if (specials.length > 0) lines.push(`• It has ${window.grammarEngine.joinListNaturally(specials)}.`);

      const powers = window.grammarEngine.getPowersPhrase(monster);
      if (powers) lines.push(`• It can ${powers}.`);

      const personality = window.grammarEngine.getPersonalityPhrase(monster);
      if (personality) lines.push(`• It is ${personality}.`);

      const world = window.grammarEngine.getWorldPhrase(monster);
      const food = window.grammarEngine.getFoodPhrase(monster);
      lines.push(`• It ${world} and likes ${food}.`);

      lines.forEach((line, idx) => {
        ctx.fillText(line, 75, 685 + (idx * 34));
      });

      const link = document.createElement('a');
      link.download = `${monster.name}_Monster_Card.png`;
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
    window.monsterStore.reset();
    window.monsterStore.setName(this.randomNames[Math.floor(Math.random() * this.randomNames.length)]);
    this.setCreatorStage('stage-body');
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
    // 1. Screen Navigation
    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const screenId = e.currentTarget.dataset.goto;
        const mode = e.currentTarget.dataset.mode || 'creator';
        this.goToScreen(screenId, mode);
      });
    });

    // 2. Stage Stepper Navigation
    document.querySelectorAll('.stage-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setCreatorStage(e.currentTarget.dataset.stage);
      });
    });

    // 3. Body Shapes
    document.querySelectorAll('[data-body-shape]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setBodyShape(e.currentTarget.dataset.bodyShape);
        window.soundEngine.playBoing();
      });
    });

    // 4. Colors & Patterns
    document.querySelectorAll('[data-body-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setMainColor(e.currentTarget.dataset.bodyColor);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-secondary-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setSecondaryColor(e.currentTarget.dataset.secondaryColor);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-pattern]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setPattern(e.currentTarget.dataset.pattern);
        window.soundEngine.playBoing();
      });
    });

    // 5. Face Elements (Eyes, Ears, Horns, Nose, Mouth, Teeth, Expressions)
    document.querySelectorAll('[data-eyes-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.eyesCount === 'many' ? 'many' : parseInt(e.currentTarget.dataset.eyesCount, 10);
        window.monsterStore.setEyesCount(val);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-eyes-size]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setEyesSize(e.currentTarget.dataset.eyesSize);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-eyes-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setEyesStyle(e.currentTarget.dataset.eyesStyle);
        window.soundEngine.playBoing();
      });
    });

    document.querySelectorAll('[data-ears-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setEarsCount(parseInt(e.currentTarget.dataset.earsCount, 10));
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-ears-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setEarsStyle(e.currentTarget.dataset.earsStyle);
        window.soundEngine.playBoing();
      });
    });

    document.querySelectorAll('[data-horns-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setHornsCount(parseInt(e.currentTarget.dataset.hornsCount, 10));
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-horns-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setHornsStyle(e.currentTarget.dataset.hornsStyle);
        window.soundEngine.playBoing();
      });
    });

    document.querySelectorAll('[data-nose-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setNoseStyle(e.currentTarget.dataset.noseStyle);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-mouth-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setMouthType(e.currentTarget.dataset.mouthType);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-teeth-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setTeethType(e.currentTarget.dataset.teethType);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-expression]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setExpression(e.currentTarget.dataset.expression);
        window.soundEngine.playBoing();
      });
    });

    // 6. Arms & Hands
    document.querySelectorAll('[data-arms-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.armsCount === 'many' ? 'many' : parseInt(e.currentTarget.dataset.armsCount, 10);
        window.monsterStore.setArmsCount(val);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-arms-length]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setArmsLength(e.currentTarget.dataset.armsLength);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-hands-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setHandsStyle(e.currentTarget.dataset.handsStyle);
        window.soundEngine.playBoing();
      });
    });

    // 7. Legs & Feet
    document.querySelectorAll('[data-legs-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.legsCount === 'many' ? 'many' : parseInt(e.currentTarget.dataset.legsCount, 10);
        window.monsterStore.setLegsCount(val);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-feet-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setFeetStyle(e.currentTarget.dataset.feetStyle);
        window.soundEngine.playBoing();
      });
    });

    // 8. Special Parts
    document.querySelectorAll('[data-special-wings]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setSpecialWings(e.currentTarget.dataset.specialWings);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-special-tail]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setSpecialTail(e.currentTarget.dataset.specialTail);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-special-extra]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.toggleSpecialExtra(e.currentTarget.dataset.specialExtra);
        window.soundEngine.playBoing();
      });
    });

    // 9. Clothes & Accessories
    document.querySelectorAll('[data-special-suit]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setSpecialOutfit(e.currentTarget.dataset.specialSuit);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-cloth-top]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setClothesTop(e.currentTarget.dataset.clothTop);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-cloth-bottom]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setClothesBottom(e.currentTarget.dataset.clothBottom);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-cloth-shoes]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setClothesShoes(e.currentTarget.dataset.clothShoes);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-accessory]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.toggleAccessory(e.currentTarget.dataset.accessory);
        window.soundEngine.playBoing();
      });
    });

    // 10. Powers, Personality, World, Food
    document.querySelectorAll('[data-power]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.togglePower(e.currentTarget.dataset.power);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-personality]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.togglePersonality(e.currentTarget.dataset.personality);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-world]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setWorld(e.currentTarget.dataset.world);
        window.soundEngine.playBoing();
      });
    });
    document.querySelectorAll('[data-food]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setFood(e.currentTarget.dataset.food);
        window.soundEngine.playBoing();
      });
    });

    // 11. "Make It Weird" Buttons
    const makeWeirdBtn = document.getElementById('make-it-weird-btn');
    if (makeWeirdBtn) makeWeirdBtn.addEventListener('click', () => this.makeItWeird());

    const surpriseMeBtn = document.getElementById('surprise-me-btn');
    if (surpriseMeBtn) surpriseMeBtn.addEventListener('click', () => this.makeItWeird());

    // 12. Active Phrase Pronunciation
    const hearPhraseBtn = document.querySelector('.hear-phrase-btn');
    if (hearPhraseBtn) hearPhraseBtn.addEventListener('click', () => this.speakActivePhrase());

    // 13. Name Input
    const nameInput = document.getElementById('monster-name-input');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => this.setMonsterName(e.target.value));
    }
    const randomNameBtn = document.getElementById('random-name-btn');
    if (randomNameBtn) {
      randomNameBtn.addEventListener('click', () => this.pickRandomName());
    }
  }
}

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MonsterApp();
});
