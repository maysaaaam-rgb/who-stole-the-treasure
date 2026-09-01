/**
 * app.js - Dynamic Single-Screen Component Wizard & State Orchestrator
 * "Build Your Own Monster!"
 * Real Screen Navigation: Only ONE step exists in the DOM at any given moment!
 */

class MonsterApp {
  constructor() {
    this.currentScreen = 'screen-start';
    this.currentMode = 'creator'; // 'creator', 'challenge', 'listening', 'secret'
    this.currentStep = 1;
    this.totalSteps = 12;
    this.speakingStepIndex = 0;
    this.speakingSteps = [];

    this.stepsMeta = [
      { id: 'body', title: 'CHOOSE YOUR BODY 🧸', label: '1. Body', cheer: 'Great choice! ⭐' },
      { id: 'eyes', title: 'CHOOSE YOUR EYES 👁️', label: '2. Eyes', cheer: 'Look at those eyes! 👀' },
      { id: 'ears_horns', title: 'EARS & HORNS 🦄', label: '3. Ears & Horns', cheer: 'Super cool ears! 👂' },
      { id: 'face', title: 'MAKE THE FACE 👄', label: '4. Face', cheer: 'What a funny face! 😃' },
      { id: 'arms_legs', title: 'ARMS & LEGS 👐', label: '5. Arms & Legs', cheer: 'Ready to move! 🦵' },
      { id: 'special', title: 'MAKE IT SPECIAL! 🐉', label: '6. Special', cheer: 'Your monster is unique! ✨' },
      { id: 'colors', title: 'CHOOSE COLORS 🎨', label: '7. Colors', cheer: 'So colorful! 🌈' },
      { id: 'clothes', title: 'DRESS YOUR MONSTER! 👕', label: '8. Clothes', cheer: 'Looking stylish! 👗' },
      { id: 'accessories', title: 'ADD ACCESSORIES! 🧢', label: '9. Items', cheer: 'Awesome accessories! 👑' },
      { id: 'personality_powers', title: 'WHAT IS YOUR MONSTER LIKE? ❤️', label: '10. Powers', cheer: 'Super powers unlocked! ⚡' },
      { id: 'world_food', title: 'WHERE DOES IT LIVE? 🏠', label: '11. World', cheer: 'Yummy favorite food! 🍕' },
      { id: 'name', title: 'NAME YOUR MONSTER! 📛', label: '12. Name', cheer: 'Almost ready! 🎉' }
    ];

    this.randomNames = [
      'Zippy', 'Bobo', 'Fluffy', 'Rex', 'Momo', 'Grumble', 'Sparky', 'Bob', 
      'Blobby', 'Pip', 'Ziggy', 'Munchkin', 'Barnaby', 'Cosmo', 'Toby', 'Gizmo'
    ];

    if (typeof document !== 'undefined') {
      this.init();
    }
  }

  init() {
    // 1. Subscribe to central Monster State updates
    window.monsterStore.subscribe((monster) => {
      this.onMonsterUpdated(monster);
    });

    // 2. Bind static UI click events
    this.bindStaticEvents();

    // 3. Initial Setup
    this.setStep(1);
    this.updateAllPreviews();
    this.updateGlobalSoundToggles();
  }

  // ==========================================
  // STATE CHANGE LISTENER
  // ==========================================
  onMonsterUpdated(monster) {
    this.updateAllPreviews();
    this.updatePhraseBadge();

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

    // Quest banner sync for challenge/listening modes inside creator
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

  startCreation(mode = 'creator') {
    this.currentMode = mode;
    this.setStep(1);
    this.goToScreen('screen-create', mode);
  }

  // ==========================================
  // DYNAMIC STEP-BY-STEP COMPONENT WIZARD
  // ==========================================
  setStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) return;
    this.currentStep = stepNumber;
    window.soundEngine.playPop();

    const meta = this.stepsMeta[stepNumber - 1];

    // 1. Update Header Badges & Title
    const badgeEl = document.getElementById('wizard-step-badge');
    const titleEl = document.getElementById('wizard-step-title');
    const cheerEl = document.getElementById('wizard-cheer-badge');

    if (badgeEl) badgeEl.innerText = `STEP ${stepNumber} OF ${this.totalSteps}`;
    if (titleEl) titleEl.innerText = meta.title;
    if (cheerEl) cheerEl.innerText = meta.cheer;

    // 2. Render Progress Track
    const trackEl = document.getElementById('wizard-progress-track');
    if (trackEl) {
      trackEl.innerHTML = this.stepsMeta.map((s, idx) => {
        const stepNum = idx + 1;
        const status = stepNum === stepNumber ? 'active' : (stepNum < stepNumber ? 'completed' : '');
        return `<div class="track-step ${status}" onclick="app.setStep(${stepNum})" title="${s.title}"><span>${s.label}</span></div>`;
      }).join('');
    }

    // 3. DYNAMICALLY MOUNT ONLY THE ACTIVE STEP HTML
    const contentEl = document.getElementById('wizard-step-content');
    if (contentEl) {
      contentEl.innerHTML = this.getStepHtml(stepNumber);
      this.bindStepEvents(contentEl);
      this.syncStepSelections(contentEl);
    }

    // 4. Update Navigation Buttons
    const backBtn = document.getElementById('wizard-back-btn');
    const nextBtn = document.getElementById('wizard-next-btn');

    if (backBtn) {
      backBtn.innerHTML = stepNumber === 1 ? '<span>← HOME</span>' : '<span>← BACK</span>';
    }

    if (nextBtn) {
      nextBtn.innerHTML = stepNumber === this.totalSteps ? '<span>FINISH MONSTER! 🎉</span>' : '<span>NEXT →</span>';
    }

    this.updatePhraseBadge();
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.setStep(this.currentStep + 1);
    } else {
      this.goToScreen('screen-final');
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.setStep(this.currentStep - 1);
    } else {
      this.goToScreen('screen-start');
    }
  }

  // ==========================================
  // DYNAMIC HTML TEMPLATES FOR EACH STEP
  // ==========================================
  getStepHtml(stepNumber) {
    switch (stepNumber) {
      case 1: // BODY
        return `
          <div class="step-screen-instruction">👉 Pick a body shape for your monster:</div>
          <div class="option-button-grid wide">
            <button class="opt-btn" data-body-shape="round"><span class="opt-btn-icon">🟢</span> ROUND</button>
            <button class="opt-btn" data-body-shape="tall"><span class="opt-btn-icon">🦒</span> TALL</button>
            <button class="opt-btn" data-body-shape="short"><span class="opt-btn-icon">🐧</span> SHORT</button>
            <button class="opt-btn" data-body-shape="wide"><span class="opt-btn-icon">🥚</span> WIDE</button>
            <button class="opt-btn" data-body-shape="thin"><span class="opt-btn-icon">📏</span> THIN</button>
            <button class="opt-btn" data-body-shape="blob"><span class="opt-btn-icon">💧</span> BLOB</button>
            <button class="opt-btn" data-body-shape="ghost"><span class="opt-btn-icon">👻</span> GHOST</button>
            <button class="opt-btn" data-body-shape="dinosaur"><span class="opt-btn-icon">🦖</span> DINOSAUR</button>
            <button class="opt-btn" data-body-shape="robot"><span class="opt-btn-icon">🤖</span> ROBOT</button>
          </div>
        `;

      case 2: // EYES
        return `
          <div class="step-subgroup">
            <div class="step-group-label">1. Number of Eyes:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-eyes-count="1"><span class="opt-btn-icon">👁️</span> 1 ONE</button>
              <button class="opt-btn" data-eyes-count="2"><span class="opt-btn-icon">👀</span> 2 TWO</button>
              <button class="opt-btn" data-eyes-count="3"><span class="opt-btn-icon">👁️👁️👁️</span> 3 THREE</button>
              <button class="opt-btn" data-eyes-count="4"><span class="opt-btn-icon">4️⃣</span> 4 FOUR</button>
              <button class="opt-btn" data-eyes-count="many"><span class="opt-btn-icon">✨</span> MANY</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">2. Eye Size:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-eyes-size="tiny">TINY</button>
              <button class="opt-btn" data-eyes-size="small">SMALL</button>
              <button class="opt-btn" data-eyes-size="big">BIG</button>
              <button class="opt-btn" data-eyes-size="giant">GIANT</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">3. Eye Style:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-eyes-style="round">ROUND</button>
              <button class="opt-btn" data-eyes-style="sleepy">😴 SLEEPY</button>
              <button class="opt-btn" data-eyes-style="angry">😠 ANGRY</button>
              <button class="opt-btn" data-eyes-style="happy">😄 HAPPY</button>
              <button class="opt-btn" data-eyes-style="surprised">😲 SURPRISED</button>
              <button class="opt-btn" data-eyes-style="funny">🤪 FUNNY</button>
              <button class="opt-btn" data-eyes-style="star">⭐ STAR</button>
              <button class="opt-btn" data-eyes-style="heart">❤️ HEART</button>
            </div>
          </div>
        `;

      case 3: // EARS & HORNS
        return `
          <div class="step-subgroup">
            <div class="step-group-label">1. Monster Ears:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-ears-count="0">NO EARS</button>
              <button class="opt-btn" data-ears-count="1">1 EAR</button>
              <button class="opt-btn" data-ears-count="2">2 EARS</button>
              <button class="opt-btn" data-ears-count="4">4 EARS</button>
            </div>
            <div class="option-button-grid" style="margin-top: 8px;">
              <button class="opt-btn" data-ears-style="tiny">🔹 TINY</button>
              <button class="opt-btn" data-ears-style="small">🔸 SMALL</button>
              <button class="opt-btn" data-ears-style="long">🐰 LONG</button>
              <button class="opt-btn" data-ears-style="floppy">🐶 FLOPPY</button>
              <button class="opt-btn" data-ears-style="pointy">🧝 POINTY</button>
              <button class="opt-btn" data-ears-style="round">🐻 ROUND</button>
              <button class="opt-btn" data-ears-style="animal">🦊 ANIMAL</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">2. Monster Horns:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-horns-count="0">NO HORNS</button>
              <button class="opt-btn" data-horns-count="1">1 HORN</button>
              <button class="opt-btn" data-horns-count="2">2 HORNS</button>
              <button class="opt-btn" data-horns-count="4">4 HORNS</button>
            </div>
            <div class="option-button-grid" style="margin-top: 8px;">
              <button class="opt-btn" data-horns-style="tiny">🔹 TINY</button>
              <button class="opt-btn" data-horns-style="curly">🌀 CURLY</button>
              <button class="opt-btn" data-horns-style="pointy">🔺 POINTY</button>
              <button class="opt-btn" data-horns-style="spiral">🦄 SPIRAL</button>
              <button class="opt-btn" data-horns-style="big">🦏 BIG</button>
            </div>
          </div>
        `;

      case 4: // FACE (Nose, Mouth, Teeth, Expression)
        return `
          <div class="step-subgroup">
            <div class="step-group-label">1. Quick Expression:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-expression="happy">😊 HAPPY</button>
              <button class="opt-btn" data-expression="angry">😡 ANGRY</button>
              <button class="opt-btn" data-expression="sleepy">😴 SLEEPY</button>
              <button class="opt-btn" data-expression="surprised">😮 SURPRISED</button>
              <button class="opt-btn" data-expression="silly">🤪 SILLY</button>
              <button class="opt-btn" data-expression="scary">😱 SCARY</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">2. Nose:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-nose-style="none">NO NOSE</button>
              <button class="opt-btn" data-nose-style="tiny">TINY</button>
              <button class="opt-btn" data-nose-style="small">SMALL</button>
              <button class="opt-btn" data-nose-style="big">BIG</button>
              <button class="opt-btn" data-nose-style="long">LONG</button>
              <button class="opt-btn" data-nose-style="round">ROUND</button>
              <button class="opt-btn" data-nose-style="funny">🔴 FUNNY</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">3. Mouth & Teeth:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-mouth-type="tiny">🙂 TINY</button>
              <button class="opt-btn" data-mouth-type="small">😊 SMALL</button>
              <button class="opt-btn" data-mouth-type="big">😃 BIG</button>
              <button class="opt-btn" data-mouth-type="huge">😄 HUGE</button>
              <button class="opt-btn" data-mouth-type="smiling">😁 SMILING</button>
              <button class="opt-btn" data-mouth-type="happy">🥰 HAPPY</button>
              <button class="opt-btn" data-mouth-type="surprised">😲 SURPRISED</button>
              <button class="opt-btn" data-mouth-type="scary">😈 SCARY</button>
            </div>
            <div class="option-button-grid" style="margin-top: 8px;">
              <button class="opt-btn" data-teeth-type="none">NO TEETH</button>
              <button class="opt-btn" data-teeth-type="small">SMALL</button>
              <button class="opt-btn" data-teeth-type="big">BIG</button>
              <button class="opt-btn" data-teeth-type="sharp">🦈 SHARP</button>
              <button class="opt-btn" data-teeth-type="vampire">🧛 VAMPIRE</button>
              <button class="opt-btn" data-teeth-type="giant">🦷 1 GIANT TOOTH</button>
            </div>
          </div>
        `;

      case 5: // ARMS & LEGS
        return `
          <div class="step-subgroup">
            <div class="step-group-label">1. Arms & Hands:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-arms-count="0">0 NONE</button>
              <button class="opt-btn" data-arms-count="1">1 ONE</button>
              <button class="opt-btn" data-arms-count="2">2 TWO</button>
              <button class="opt-btn" data-arms-count="3">3 THREE</button>
              <button class="opt-btn" data-arms-count="4">4 FOUR</button>
              <button class="opt-btn" data-arms-count="many">🐙 MANY</button>
            </div>
            <div class="option-button-grid" style="margin-top: 8px;">
              <button class="opt-btn" data-arms-length="tiny">TINY</button>
              <button class="opt-btn" data-arms-length="short">SHORT</button>
              <button class="opt-btn" data-arms-length="normal">NORMAL</button>
              <button class="opt-btn" data-arms-length="long">LONG</button>
              <button class="opt-btn" data-arms-length="super_long">SUPER LONG</button>
            </div>
            <div class="option-button-grid" style="margin-top: 8px;">
              <button class="opt-btn" data-hands-style="normal">NORMAL HANDS</button>
              <button class="opt-btn" data-hands-style="tiny">TINY</button>
              <button class="opt-btn" data-hands-style="giant">🥊 GIANT</button>
              <button class="opt-btn" data-hands-style="claws">🦅 CLAWS</button>
              <button class="opt-btn" data-hands-style="three_fingers">3 FINGERS</button>
              <button class="opt-btn" data-hands-style="four_fingers">4 FINGERS</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">2. Legs & Feet:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-legs-count="0">0 NONE</button>
              <button class="opt-btn" data-legs-count="1">1 ONE</button>
              <button class="opt-btn" data-legs-count="2">2 TWO</button>
              <button class="opt-btn" data-legs-count="3">3 THREE</button>
              <button class="opt-btn" data-legs-count="4">4 FOUR</button>
              <button class="opt-btn" data-legs-count="many">🐾 MANY</button>
            </div>
            <div class="option-button-grid" style="margin-top: 8px;">
              <button class="opt-btn" data-feet-style="tiny">TINY</button>
              <button class="opt-btn" data-feet-style="normal">NORMAL</button>
              <button class="opt-btn" data-feet-style="big">BIG</button>
              <button class="opt-btn" data-feet-style="giant">GIANT</button>
              <button class="opt-btn" data-feet-style="claws">🦅 CLAWS</button>
              <button class="opt-btn" data-feet-style="bird">🐓 BIRD FEET</button>
              <button class="opt-btn" data-feet-style="monster">🐾 MONSTER</button>
            </div>
          </div>
        `;

      case 6: // SPECIAL PARTS
        return `
          <div class="step-subgroup">
            <div class="step-group-label">1. Wings:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-special-wings="none">NO WINGS</button>
              <button class="opt-btn" data-special-wings="dragon">🐉 DRAGON</button>
              <button class="opt-btn" data-special-wings="butterfly">🦋 BUTTERFLY</button>
              <button class="opt-btn" data-special-wings="bat">🦇 BAT</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">2. Tails:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-special-tail="none">NO TAIL</button>
              <button class="opt-btn" data-special-tail="long">LONG TAIL</button>
              <button class="opt-btn" data-special-tail="curly">CURLY TAIL</button>
              <button class="opt-btn" data-special-tail="dinosaur">🦖 DINOSAUR</button>
              <button class="opt-btn" data-special-tail="snake">🐍 SNAKE</button>
              <button class="opt-btn" data-special-tail="bunny">🐰 BUNNY</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">3. Special Extras (Combine multiple!):</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-special-extra="spikes">🌵 SPIKES</button>
              <button class="opt-btn" data-special-extra="shell">🐌 SHELL</button>
              <button class="opt-btn" data-special-extra="fins">🐬 FINS</button>
              <button class="opt-btn" data-special-extra="tentacles">🐙 TENTACLES</button>
            </div>
          </div>
        `;

      case 7: // COLORS & PATTERNS
        return `
          <div class="step-subgroup">
            <div class="step-group-label">1. Body Main Color:</div>
            <div class="color-swatch-grid">
              <button class="color-swatch-btn swatch-purple" data-body-color="purple" title="Purple"></button>
              <button class="color-swatch-btn swatch-green" data-body-color="green" title="Green"></button>
              <button class="color-swatch-btn swatch-blue" data-body-color="blue" title="Blue"></button>
              <button class="color-swatch-btn swatch-red" data-body-color="red" title="Red"></button>
              <button class="color-swatch-btn swatch-orange" data-body-color="orange" title="Orange"></button>
              <button class="color-swatch-btn swatch-yellow" data-body-color="yellow" title="Yellow"></button>
              <button class="color-swatch-btn swatch-pink" data-body-color="pink" title="Pink"></button>
              <button class="color-swatch-btn swatch-black" data-body-color="black" title="Black"></button>
              <button class="color-swatch-btn swatch-white" data-body-color="white" title="White"></button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">2. Secondary Belly / Accent Color:</div>
            <div class="color-swatch-grid">
              <button class="color-swatch-btn swatch-yellow" data-secondary-color="yellow" title="Yellow"></button>
              <button class="color-swatch-btn swatch-purple" data-secondary-color="purple" title="Purple"></button>
              <button class="color-swatch-btn swatch-green" data-secondary-color="green" title="Green"></button>
              <button class="color-swatch-btn swatch-blue" data-secondary-color="blue" title="Blue"></button>
              <button class="color-swatch-btn swatch-red" data-secondary-color="red" title="Red"></button>
              <button class="color-swatch-btn swatch-pink" data-secondary-color="pink" title="Pink"></button>
              <button class="color-swatch-btn swatch-orange" data-secondary-color="orange" title="Orange"></button>
              <button class="color-swatch-btn swatch-black" data-secondary-color="black" title="Black"></button>
              <button class="color-swatch-btn swatch-white" data-secondary-color="white" title="White"></button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">3. Body Pattern:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-pattern="none">NO PATTERN</button>
              <button class="opt-btn" data-pattern="spots">🔴 SPOTS</button>
              <button class="opt-btn" data-pattern="stripes">🦓 STRIPES</button>
              <button class="opt-btn" data-pattern="stars">⭐ STARS</button>
              <button class="opt-btn" data-pattern="hearts">❤️ HEARTS</button>
              <button class="opt-btn" data-pattern="dots">⚪ DOTS</button>
              <button class="opt-btn" data-pattern="zigzags">⚡ ZIGZAGS</button>
              <button class="opt-btn" data-pattern="rainbow">🌈 RAINBOW</button>
            </div>
          </div>
        `;

      case 8: // CLOTHES & OUTFITS
        return `
          <div class="step-subgroup">
            <div class="step-group-label">1. Full Outfits (Replaces Tops & Bottoms):</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-special-suit="none">NO OUTFIT</button>
              <button class="opt-btn" data-special-suit="dress">💃 DRESS</button>
              <button class="opt-btn" data-special-suit="superhero">🦸 SUPERHERO</button>
              <button class="opt-btn" data-special-suit="astronaut">👨‍🚀 ASTRONAUT</button>
              <button class="opt-btn" data-special-suit="wizard">🧙 WIZARD</button>
              <button class="opt-btn" data-special-suit="pirate">🏴‍☠️ PIRATE</button>
              <button class="opt-btn" data-special-suit="football">⚽ FOOTBALL</button>
              <button class="opt-btn" data-special-suit="royal">👑 ROYAL</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">2. Tops:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-cloth-top="none">NO TOP</button>
              <button class="opt-btn" data-cloth-top="tshirt">👕 T-SHIRT</button>
              <button class="opt-btn" data-cloth-top="shirt">👔 SHIRT</button>
              <button class="opt-btn" data-cloth-top="jacket">🧥 JACKET</button>
              <button class="opt-btn" data-cloth-top="hoodie">🧤 HOODIE</button>
              <button class="opt-btn" data-cloth-top="sweater">🧶 SWEATER</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">3. Bottoms:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-cloth-bottom="none">NO BOTTOM</button>
              <button class="opt-btn" data-cloth-bottom="trousers">👖 TROUSERS</button>
              <button class="opt-btn" data-cloth-bottom="shorts">🩳 SHORTS</button>
              <button class="opt-btn" data-cloth-bottom="skirt">👗 SKIRT</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">4. Shoes:</div>
            <div class="option-button-grid">
              <button class="opt-btn" data-cloth-shoes="none">NO SHOES</button>
              <button class="opt-btn" data-cloth-shoes="boots">🥾 BOOTS</button>
              <button class="opt-btn" data-cloth-shoes="sneakers">👟 SNEAKERS</button>
              <button class="opt-btn" data-cloth-shoes="clown_shoes">🤡 CLOWN SHOES</button>
            </div>
          </div>
        `;

      case 9: // ACCESSORIES
        return `
          <div class="step-screen-instruction">👉 Choose accessories for your monster (select multiple!):</div>
          <div class="option-button-grid">
            <button class="opt-btn" data-accessory="crown">👑 CROWN</button>
            <button class="opt-btn" data-accessory="wizard_hat">🧙 WIZARD HAT</button>
            <button class="opt-btn" data-accessory="pirate_hat">🏴‍☠️ PIRATE HAT</button>
            <button class="opt-btn" data-accessory="hat">🎩 TOP HAT</button>
            <button class="opt-btn" data-accessory="cap">🧢 CAP</button>
            <button class="opt-btn" data-accessory="helmet">⛑️ HELMET</button>
            <button class="opt-btn" data-accessory="glasses">🕶️ GLASSES</button>
            <button class="opt-btn" data-accessory="sunglasses">😎 SUNGLASSES</button>
            <button class="opt-btn" data-accessory="scarf">🧣 SCARF</button>
            <button class="opt-btn" data-accessory="bow">🎀 BOW</button>
            <button class="opt-btn" data-accessory="necklace">📿 NECKLACE</button>
            <button class="opt-btn" data-accessory="backpack">🎒 BACKPACK</button>
            <button class="opt-btn" data-accessory="earrings">✨ EARRINGS</button>
          </div>
        `;

      case 10: // PERSONALITY & POWERS
        return `
          <div class="step-subgroup">
            <div class="step-group-label">1. My Monster is... (Personality):</div>
            <div class="option-button-grid wide">
              <button class="opt-btn" data-personality="friendly"><span class="opt-btn-icon">🤗</span> FRIENDLY</button>
              <button class="opt-btn" data-personality="funny"><span class="opt-btn-icon">😂</span> FUNNY</button>
              <button class="opt-btn" data-personality="scary"><span class="opt-btn-icon">😈</span> SCARY</button>
              <button class="opt-btn" data-personality="angry"><span class="opt-btn-icon">😠</span> ANGRY</button>
              <button class="opt-btn" data-personality="happy"><span class="opt-btn-icon">😃</span> HAPPY</button>
              <button class="opt-btn" data-personality="sleepy"><span class="opt-btn-icon">😴</span> SLEEPY</button>
              <button class="opt-btn" data-personality="crazy"><span class="opt-btn-icon">🤪</span> CRAZY</button>
              <button class="opt-btn" data-personality="shy"><span class="opt-btn-icon">🙈</span> SHY</button>
              <button class="opt-btn" data-personality="strong"><span class="opt-btn-icon">🦁</span> STRONG</button>
              <button class="opt-btn" data-personality="clever"><span class="opt-btn-icon">🧠</span> CLEVER</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">2. Super Powers (It can...):</div>
            <div class="option-button-grid wide">
              <button class="opt-btn" data-power="fly"><span class="opt-btn-icon">🦅</span> FLY</button>
              <button class="opt-btn" data-power="breathe_fire"><span class="opt-btn-icon">🔥</span> BREATHE FIRE</button>
              <button class="opt-btn" data-power="make_ice"><span class="opt-btn-icon">❄️</span> MAKE ICE</button>
              <button class="opt-btn" data-power="shoot_lightning"><span class="opt-btn-icon">⚡</span> SHOOT LIGHTNING</button>
              <button class="opt-btn" data-power="invisible"><span class="opt-btn-icon">👻</span> BE INVISIBLE</button>
              <button class="opt-btn" data-power="jump_high"><span class="opt-btn-icon">🦘</span> JUMP HIGH</button>
              <button class="opt-btn" data-power="swim_fast"><span class="opt-btn-icon">🐬</span> SWIM FAST</button>
              <button class="opt-btn" data-power="super_strong"><span class="opt-btn-icon">💪</span> SUPER STRONG</button>
              <button class="opt-btn" data-power="magic"><span class="opt-btn-icon">🪄</span> MAKE MAGIC</button>
              <button class="opt-btn" data-power="run_fast"><span class="opt-btn-icon">🏃</span> RUN FAST</button>
            </div>
          </div>
        `;

      case 11: // WORLD & FOOD
        return `
          <div class="step-subgroup">
            <div class="step-group-label">1. Where Does It Live?</div>
            <div class="option-button-grid wide">
              <button class="opt-btn" data-world="castle"><span class="opt-btn-icon">🏰</span> CASTLE</button>
              <button class="opt-btn" data-world="forest"><span class="opt-btn-icon">🌲</span> FOREST</button>
              <button class="opt-btn" data-world="volcano"><span class="opt-btn-icon">🌋</span> VOLCANO</button>
              <button class="opt-btn" data-world="ocean"><span class="opt-btn-icon">🌊</span> OCEAN</button>
              <button class="opt-btn" data-world="ice_world"><span class="opt-btn-icon">🧊</span> ICE WORLD</button>
              <button class="opt-btn" data-world="moon"><span class="opt-btn-icon">🌕</span> MOON</button>
              <button class="opt-btn" data-world="space"><span class="opt-btn-icon">🚀</span> SPACE</button>
              <button class="opt-btn" data-world="jungle"><span class="opt-btn-icon">🌴</span> JUNGLE</button>
              <button class="opt-btn" data-world="cave"><span class="opt-btn-icon">🕳️</span> CAVE</button>
              <button class="opt-btn" data-world="house"><span class="opt-btn-icon">🏡</span> HOUSE</button>
            </div>
          </div>
          <div class="step-subgroup">
            <div class="step-group-label">2. Favorite Food (What does it like?):</div>
            <div class="option-button-grid wide">
              <button class="opt-btn" data-food="pizza"><span class="opt-btn-icon">🍕</span> PIZZA</button>
              <button class="opt-btn" data-food="burgers"><span class="opt-btn-icon">🍔</span> BURGERS</button>
              <button class="opt-btn" data-food="ice_cream"><span class="opt-btn-icon">🍦</span> ICE CREAM</button>
              <button class="opt-btn" data-food="apples"><span class="opt-btn-icon">🍎</span> APPLES</button>
              <button class="opt-btn" data-food="fish"><span class="opt-btn-icon">🐟</span> FISH</button>
              <button class="opt-btn" data-food="cake"><span class="opt-btn-icon">🎂</span> CAKE</button>
              <button class="opt-btn" data-food="sandwiches"><span class="opt-btn-icon">🥪</span> SANDWICHES</button>
              <button class="opt-btn" data-food="chocolate"><span class="opt-btn-icon">🍫</span> CHOCOLATE</button>
            </div>
          </div>
        `;

      case 12: // NAME
        const currentName = window.monsterStore.get().name || 'Zippy';
        return `
          <div class="step-screen-instruction">👉 Give your monster a name:</div>
          <div class="name-entry-card">
            <p class="name-prompt-text">My monster's name is...</p>
            <div class="name-input-row" style="margin-top: 14px;">
              <input type="text" id="monster-name-input" class="monster-name-input" placeholder="Type name (e.g. Zippy)..." maxlength="20" value="${currentName}">
              <button class="random-name-btn" id="random-name-btn" title="Pick a random funny name">🎲 RANDOM NAME</button>
            </div>
          </div>
        `;

      default:
        return '';
    }
  }

  // ==========================================
  // SYNC SELECTIONS FROM STATE FOR CURRENT STEP
  // ==========================================
  syncStepSelections(container) {
    const m = window.monsterStore.get();

    // Body
    container.querySelectorAll('[data-body-shape]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bodyShape === m.body);
    });

    // Eyes
    container.querySelectorAll('[data-eyes-count]').forEach(btn => {
      const val = btn.dataset.eyesCount === 'many' ? 'many' : parseInt(btn.dataset.eyesCount, 10);
      btn.classList.toggle('active', val === m.eyes.count);
    });
    container.querySelectorAll('[data-eyes-size]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.eyesSize === m.eyes.size);
    });
    container.querySelectorAll('[data-eyes-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.eyesStyle === m.eyes.style);
    });

    // Ears & Horns
    container.querySelectorAll('[data-ears-count]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.earsCount, 10) === m.ears.count);
    });
    container.querySelectorAll('[data-ears-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.earsStyle === m.ears.style);
    });
    container.querySelectorAll('[data-horns-count]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.hornsCount, 10) === m.horns.count);
    });
    container.querySelectorAll('[data-horns-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.hornsStyle === m.horns.style);
    });

    // Face
    container.querySelectorAll('[data-nose-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.noseStyle === m.nose);
    });
    container.querySelectorAll('[data-mouth-type]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mouthType === m.mouth);
    });
    container.querySelectorAll('[data-teeth-type]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.teethType === m.teeth);
    });
    container.querySelectorAll('[data-expression]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.expression === m.expression);
    });

    // Arms & Legs
    container.querySelectorAll('[data-arms-count]').forEach(btn => {
      const val = btn.dataset.armsCount === 'many' ? 'many' : parseInt(btn.dataset.armsCount, 10);
      btn.classList.toggle('active', val === m.arms.count);
    });
    container.querySelectorAll('[data-arms-length]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.armsLength === m.arms.length);
    });
    container.querySelectorAll('[data-hands-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.handsStyle === m.hands);
    });
    container.querySelectorAll('[data-legs-count]').forEach(btn => {
      const val = btn.dataset.legsCount === 'many' ? 'many' : parseInt(btn.dataset.legsCount, 10);
      btn.classList.toggle('active', val === m.legs.count);
    });
    container.querySelectorAll('[data-feet-style]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.feetStyle === m.feet);
    });

    // Special
    container.querySelectorAll('[data-special-wings]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.specialWings === m.specialParts.wings);
    });
    container.querySelectorAll('[data-special-tail]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.specialTail === m.specialParts.tail);
    });
    container.querySelectorAll('[data-special-extra]').forEach(btn => {
      btn.classList.toggle('active', !!m.specialParts[btn.dataset.specialExtra]);
    });

    // Colors
    container.querySelectorAll('[data-body-color]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bodyColor === m.color);
    });
    container.querySelectorAll('[data-secondary-color]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.secondaryColor === m.secondaryColor);
    });
    container.querySelectorAll('[data-pattern]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.pattern === m.pattern);
    });

    // Clothes
    container.querySelectorAll('[data-special-suit]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.specialSuit === m.clothes.outfit);
    });
    container.querySelectorAll('[data-cloth-top]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.clothTop === m.clothes.top);
    });
    container.querySelectorAll('[data-cloth-bottom]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.clothBottom === m.clothes.bottom);
    });
    container.querySelectorAll('[data-cloth-shoes]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.clothShoes === m.clothes.shoes);
    });

    // Accessories
    container.querySelectorAll('[data-accessory]').forEach(btn => {
      btn.classList.toggle('active', m.accessories.includes(btn.dataset.accessory));
    });

    // Personality & Powers
    container.querySelectorAll('[data-power]').forEach(btn => {
      btn.classList.toggle('active', m.powers.includes(btn.dataset.power));
    });
    container.querySelectorAll('[data-personality]').forEach(btn => {
      btn.classList.toggle('active', m.personality.includes(btn.dataset.personality));
    });

    // World & Food
    container.querySelectorAll('[data-world]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.world === m.world);
    });
    container.querySelectorAll('[data-food]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.food === m.food);
    });
  }

  // ==========================================
  // BIND EVENTS FOR CURRENT STEP
  // ==========================================
  bindStepEvents(container) {
    // Body Shapes
    container.querySelectorAll('[data-body-shape]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setBodyShape(e.currentTarget.dataset.bodyShape);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });

    // Eyes
    container.querySelectorAll('[data-eyes-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.eyesCount === 'many' ? 'many' : parseInt(e.currentTarget.dataset.eyesCount, 10);
        window.monsterStore.setEyesCount(val);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-eyes-size]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setEyesSize(e.currentTarget.dataset.eyesSize);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-eyes-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setEyesStyle(e.currentTarget.dataset.eyesStyle);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });

    // Ears & Horns
    container.querySelectorAll('[data-ears-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setEarsCount(parseInt(e.currentTarget.dataset.earsCount, 10));
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-ears-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setEarsStyle(e.currentTarget.dataset.earsStyle);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-horns-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setHornsCount(parseInt(e.currentTarget.dataset.hornsCount, 10));
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-horns-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setHornsStyle(e.currentTarget.dataset.hornsStyle);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });

    // Face
    container.querySelectorAll('[data-nose-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setNoseStyle(e.currentTarget.dataset.noseStyle);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-mouth-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setMouthType(e.currentTarget.dataset.mouthType);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-teeth-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setTeethType(e.currentTarget.dataset.teethType);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-expression]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setExpression(e.currentTarget.dataset.expression);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });

    // Arms & Legs
    container.querySelectorAll('[data-arms-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.armsCount === 'many' ? 'many' : parseInt(e.currentTarget.dataset.armsCount, 10);
        window.monsterStore.setArmsCount(val);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-arms-length]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setArmsLength(e.currentTarget.dataset.armsLength);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-hands-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setHandsStyle(e.currentTarget.dataset.handsStyle);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-legs-count]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.legsCount === 'many' ? 'many' : parseInt(e.currentTarget.dataset.legsCount, 10);
        window.monsterStore.setLegsCount(val);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-feet-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setFeetStyle(e.currentTarget.dataset.feetStyle);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });

    // Special
    container.querySelectorAll('[data-special-wings]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setSpecialWings(e.currentTarget.dataset.specialWings);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-special-tail]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setSpecialTail(e.currentTarget.dataset.specialTail);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-special-extra]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.toggleSpecialExtra(e.currentTarget.dataset.specialExtra);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });

    // Colors
    container.querySelectorAll('[data-body-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setMainColor(e.currentTarget.dataset.bodyColor);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-secondary-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setSecondaryColor(e.currentTarget.dataset.secondaryColor);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-pattern]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setPattern(e.currentTarget.dataset.pattern);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });

    // Clothes
    container.querySelectorAll('[data-special-suit]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setSpecialOutfit(e.currentTarget.dataset.specialSuit);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-cloth-top]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setClothesTop(e.currentTarget.dataset.clothTop);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-cloth-bottom]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setClothesBottom(e.currentTarget.dataset.clothBottom);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-cloth-shoes]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setClothesShoes(e.currentTarget.dataset.clothShoes);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });

    // Accessories
    container.querySelectorAll('[data-accessory]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.toggleAccessory(e.currentTarget.dataset.accessory);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });

    // Personality & Powers
    container.querySelectorAll('[data-power]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.togglePower(e.currentTarget.dataset.power);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-personality]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.togglePersonality(e.currentTarget.dataset.personality);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });

    // World & Food
    container.querySelectorAll('[data-world]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setWorld(e.currentTarget.dataset.world);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });
    container.querySelectorAll('[data-food]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.monsterStore.setFood(e.currentTarget.dataset.food);
        window.soundEngine.playBoing();
        this.syncStepSelections(container);
      });
    });

    // Name Input & Random Name Button
    const nameInput = container.querySelector('#monster-name-input');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        window.monsterStore.setName(e.target.value);
      });
    }
    const randNameBtn = container.querySelector('#random-name-btn');
    if (randNameBtn) {
      randNameBtn.addEventListener('click', () => {
        this.pickRandomName();
      });
    }
  }

  // ==========================================
  // LIVE PREVIEW & PHRASE BADGE UPDATER
  // ==========================================
  updateAllPreviews() {
    const monster = window.monsterStore.get();
    const svgHtml = window.monsterRenderer.renderSvg(monster);

    const containers = [
      'start-monster-preview',
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

  updatePhraseBadge() {
    const monster = window.monsterStore.get();
    let phrase = '';

    switch (this.currentStep) {
      case 1:
        phrase = `${monster.body.toUpperCase()} BODY`;
        break;
      case 2:
        phrase = window.grammarEngine.getEyesPhrase(monster).toUpperCase();
        break;
      case 3:
        const ears = window.grammarEngine.getEarsPhrase(monster);
        const horns = window.grammarEngine.getHornsPhrase(monster);
        phrase = horns ? `${ears}, ${horns}`.toUpperCase() : ears.toUpperCase();
        break;
      case 4:
        const mouth = window.grammarEngine.getMouthPhrase(monster);
        const teeth = window.grammarEngine.getTeethPhrase(monster);
        phrase = teeth ? `${mouth}, ${teeth}`.toUpperCase() : mouth.toUpperCase();
        break;
      case 5:
        phrase = `${window.grammarEngine.getArmsPhrase(monster)}, ${window.grammarEngine.getLegsPhrase(monster)}`.toUpperCase();
        break;
      case 6:
        const specials = window.grammarEngine.getSpecialPartsPhrases(monster);
        phrase = specials.length > 0 ? specials.join(', ').toUpperCase() : 'NO SPECIAL PARTS';
        break;
      case 7:
        phrase = window.grammarEngine.getColorAndPatternPhrase(monster).toUpperCase();
        break;
      case 8:
        const clothes = window.grammarEngine.getClothingPhrases(monster);
        phrase = clothes.length > 0 ? clothes.join(', ').toUpperCase() : 'NO CLOTHES';
        break;
      case 9:
        phrase = monster.accessories.length > 0 ? monster.accessories.join(', ').toUpperCase() : 'NO ACCESSORIES';
        break;
      case 10:
        const powers = window.grammarEngine.getPowersPhrase(monster);
        const traits = window.grammarEngine.getPersonalityPhrase(monster);
        phrase = powers ? `CAN ${powers.toUpperCase()}` : (traits ? `IS ${traits.toUpperCase()}` : 'CHOOSE POWERS');
        break;
      case 11:
        phrase = `LIVES IN ${monster.world.toUpperCase()}, LIKES ${monster.food.toUpperCase()}`;
        break;
      case 12:
        phrase = `MEET ${monster.name.toUpperCase()}`;
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

    // Sync active step options
    const contentEl = document.getElementById('wizard-step-content');
    if (contentEl) {
      this.syncStepSelections(contentEl);
    }

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
  // FINAL SCREEN: SHOWCASE & DESCRIPTIONS
  // ==========================================
  renderFinalScreen() {
    const monster = window.monsterStore.get();
    const summary = window.grammarEngine.getMonsterSummary(monster);
    const fullParagraph = window.grammarEngine.getFullDescription(monster);

    const nameTitleEl = document.getElementById('final-monster-name-display');
    if (nameTitleEl) nameTitleEl.innerText = monster.name.toUpperCase();

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

  speakFullDescription() {
    const text = window.grammarEngine.getFullDescription(window.monsterStore.get());
    window.soundEngine.speak(text);
  }

  setMonsterName(newName) {
    window.monsterStore.setName(newName);
    const nameTitleEl = document.getElementById('final-monster-name-display');
    if (nameTitleEl) nameTitleEl.innerText = window.monsterStore.get().name.toUpperCase();
    this.renderFinalScreen();
  }

  pickRandomName() {
    window.soundEngine.playPop();
    const name = this.randomNames[Math.floor(Math.random() * this.randomNames.length)];
    this.setMonsterName(name);
    const nameInput = document.getElementById('monster-name-input');
    if (nameInput) nameInput.value = name;
  }

  // ==========================================
  // SPEAKING TELEPROMPTER MODE (1 SENTENCE AT A TIME)
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
    if (!modal) return;
    modal.classList.remove('active');
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
    if (!modal) return;
    modal.classList.remove('active');
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
        <button class="btn btn-secondary" onclick="app.startCreation('challenge')">🛠️ Open Creator & Fix</button>
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
        <button class="btn btn-secondary" onclick="app.startCreation('listening')">🛠️ Open Creator & Fix</button>
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
    this.setStep(1);
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
  // STATIC EVENT BINDINGS
  // ==========================================
  bindStaticEvents() {
    // Screen Navigation
    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const screenId = e.currentTarget.dataset.goto;
        const mode = e.currentTarget.dataset.mode || 'creator';
        this.goToScreen(screenId, mode);
      });
    });

    // Make It Weird
    const makeWeirdBtn = document.getElementById('make-it-weird-btn');
    if (makeWeirdBtn) makeWeirdBtn.addEventListener('click', () => this.makeItWeird());

    const surpriseMeBtn = document.getElementById('surprise-me-btn');
    if (surpriseMeBtn) surpriseMeBtn.addEventListener('click', () => this.makeItWeird());

    // Active Phrase Pronunciation
    const hearPhraseBtn = document.querySelector('.hear-phrase-btn');
    if (hearPhraseBtn) hearPhraseBtn.addEventListener('click', () => this.speakActivePhrase());
  }
}

window.MonsterApp = MonsterApp;

// Initialize Application when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new MonsterApp();
  });
}
