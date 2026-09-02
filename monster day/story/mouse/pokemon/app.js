/**
 * POKÉMON TRAINER BATTLE - CORE APPLICATION CONTROLLER
 * Grade 4 ESL A1+ Interactive Smartboard Game
 */

class PokemonApp {
  constructor() {
    this.currentStage = 0;
    this.totalStages = 14;

    // Game & Creature State
    this.p1Config = {
      size: 'huge',
      personality: 'brave',
      power: 'strong',
      abilities: ['make fire', 'fly']
    };
    this.p2Config = {
      size: 'small',
      personality: 'cute',
      power: 'fast',
      abilities: ['swim', 'make ice']
    };

    this.p1Creature = null;
    this.p2Creature = null;

    // Battle State
    this.activeBattleTrainer = 1; // 1 or 2
    this.battleRound = 1;
    this.p1Points = 0;
    this.p2Points = 0;
    this.p1Hp = 100;
    this.p2Hp = 100;

    // Quiz & Activity State
    this.quizIndex = 0;
    this.movementIndex = 0;

    this.screens = [
      'screen-emergency',
      'screen-spotting',
      'screen-adjectives-1',
      'screen-adjectives-2',
      'screen-adj-game',
      'screen-abilities',
      'screen-movement-game',
      'screen-model-desc',
      'screen-create-p1',
      'screen-reveal-p1',
      'screen-create-p2',
      'screen-reveal-p2',
      'screen-battle',
      'screen-champion'
    ];

    this.stageNames = [
      '1. 🚨 Pokémon Emergency',
      '2. 🔍 Spotting Icebreaker',
      '3. 📖 Adjectives (Size & Speed)',
      '4. 📖 Adjectives (Power & Personality)',
      '5. 🎮 Adjective Quick Game',
      '6. ⚡ Abilities (What Can It Do?)',
      '7. 🏃 Movement TPR Game',
      '8. 🗣️ Model Description',
      '9. 🧬 Create Pokémon (Trainer 1)',
      '10. 🎤 Speak & Reveal (Trainer 1)',
      '11. 🧬 Create Pokémon (Trainer 2)',
      '12. 🎤 Speak & Reveal (Trainer 2)',
      '13. ⚔️ Creator Battle Arena',
      '14. 🏆 Champion Ceremony'
    ];

    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupSpottingScreen();
    this.setupAdjectivesScreens();
    this.setupQuizScreen();
    this.setupAbilitiesScreen();
    this.setupMovementScreen();
    this.setupModelScreen();
    this.setupCreatorScreens();
    this.setupRevealScreens();
    this.setupBattleArena();
    this.setupModals();
    this.setupKeyboardShortcuts();

    this.goToStage(0);
  }

  /* ==========================================================================
     STAGE NAVIGATION & TOP BAR
     ========================================================================== */
  setupNavigation() {
    // Dropdown
    const stageSelect = document.getElementById('stageSelect');
    stageSelect.addEventListener('change', (e) => {
      this.goToStage(parseInt(e.target.value, 10));
    });

    // Progress Track Dots
    const progressTrack = document.getElementById('stageProgressTrack');
    progressTrack.innerHTML = '';
    for (let i = 0; i < this.totalStages; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      dot.title = this.stageNames[i];
      dot.addEventListener('click', () => this.goToStage(i));
      progressTrack.appendChild(dot);
    }

    // Bottom Bar Buttons
    document.getElementById('btnNavPrev').addEventListener('click', () => this.prevStage());
    document.getElementById('btnNavNext').addEventListener('click', () => this.nextStage());
    document.getElementById('btnNavSkip').addEventListener('click', () => this.nextStage());
    document.getElementById('btnNavReplay').addEventListener('click', () => this.speakCurrentInstruction());

    // Top Controls
    document.getElementById('btnAudioPrompt').addEventListener('click', () => this.speakCurrentInstruction());
    
    document.getElementById('btnMuteToggle').addEventListener('click', () => {
      const muted = sounds.toggleMute();
      document.getElementById('muteIcon').textContent = muted ? '🔕' : '🔔';
    });

    document.getElementById('btnFullscreen').addEventListener('click', () => this.toggleFullscreen());
    document.getElementById('btnPrintWorksheets').addEventListener('click', () => window.print());

    // Screen 0 Start Mission Button
    document.getElementById('btnStartMission').addEventListener('click', () => {
      sounds.playClick();
      sounds.playSelect();
      this.goToStage(1);
    });
  }

  goToStage(stageIndex) {
    if (stageIndex < 0) stageIndex = 0;
    if (stageIndex >= this.totalStages) stageIndex = this.totalStages - 1;

    // Hide old screen
    const oldScreen = document.getElementById(this.screens[this.currentStage]);
    if (oldScreen) oldScreen.classList.remove('active');

    this.currentStage = stageIndex;

    // Show new screen
    const newScreen = document.getElementById(this.screens[this.currentStage]);
    if (newScreen) newScreen.classList.add('active');

    // Update Dropdown & Bottom Display
    document.getElementById('stageSelect').value = this.currentStage;
    document.getElementById('stageNameDisplay').textContent = this.stageNames[this.currentStage];

    // Update Progress Dots
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentStage);
      dot.classList.toggle('completed', idx < this.currentStage);
    });

    // Lifecycle triggers per stage
    this.onStageEnter(this.currentStage);
  }

  nextStage() {
    sounds.playClick();
    this.goToStage(this.currentStage + 1);
  }

  prevStage() {
    sounds.playClick();
    this.goToStage(this.currentStage - 1);
  }

  onStageEnter(stage) {
    switch (stage) {
      case 0:
        sounds.playTone(400, 'sine', 0.2);
        break;
      case 1:
        // Spotting
        break;
      case 4:
        this.renderQuizQuestion();
        break;
      case 6:
        this.renderMovementAction();
        break;
      case 8:
        this.updateCreatorSummary(1);
        break;
      case 9:
        this.prepareSpeakingGate(1);
        break;
      case 10:
        this.updateCreatorSummary(2);
        break;
      case 11:
        this.prepareSpeakingGate(2);
        break;
      case 12:
        this.initBattleArena();
        break;
      case 13:
        this.initChampionCeremony();
        break;
    }
  }

  speakCurrentInstruction() {
    const instructions = [
      "Attention! The Pokémon have escaped! I need new Pokémon Trainers!",
      "Spot the escaped Pokémon! Tap a Pokémon, say its name, and call it out!",
      "Look at the contrast! Tiny versus Huge! Fast versus Slow!",
      "Look at the contrast! Strong versus Weak! Cute versus Scary!",
      "Find the Pokémon! Tap the right one!",
      "What can your Pokémon do? It can fly, it can swim, it can make fire!",
      "Action challenge! Move like your Pokémon and say: It can!",
      "My Pokémon is small and fast. It is cute. It can jump and make electricity.",
      "Trainer 1, choose your size, personality, power, and two abilities!",
      "Trainer 1, describe your Pokémon aloud before creation!",
      "Trainer 2, choose your size, personality, power, and two abilities!",
      "Trainer 2, describe your Pokémon aloud before creation!",
      "Welcome to the Battle Arena! Use your English to attack!",
      "Mission Complete! You are official Pokémon Trainers!"
    ];

    const text = instructions[this.currentStage] || "Pokémon Trainer Battle!";
    sounds.speak(text);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      document.getElementById('fullscreenIcon').textContent = '🗗';
    } else {
      document.exitFullscreen().catch(() => {});
      document.getElementById('fullscreenIcon').textContent = '⛶';
    }
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.nextStage();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.prevStage();
      } else if (e.key === ' ') {
        e.preventDefault();
        this.speakCurrentInstruction();
      }
    });
  }

  /* ==========================================================================
     SCREEN 1: SPOTTING ICEBREAKER
     ========================================================================== */
  setupSpottingScreen() {
    const grid = document.getElementById('spottingGrid');
    grid.innerHTML = '';

    LESSON_DATA.escapedPokemon.forEach(pk => {
      const card = document.createElement('div');
      card.className = 'spot-card';
      card.innerHTML = `
        <span class="spot-tag hidden">FOUND!</span>
        <img src="${pk.image}" alt="${pk.name}" class="spot-img">
        <span class="spot-name">${pk.name}</span>
      `;

      card.addEventListener('click', () => {
        sounds.playClick();
        sounds.playPoint();
        sounds.speak(pk.name);
        card.classList.add('spotted');
        const tag = card.querySelector('.spot-tag');
        if (tag) tag.classList.remove('hidden');

        document.getElementById('spottingFeedback').querySelector('.feedback-text').textContent =
          `🎉 Great job! You spotted ${pk.name}!`;
      });

      grid.appendChild(card);
    });

    document.getElementById('btnFinishSpotting').addEventListener('click', () => {
      sounds.playCorrect();
      this.nextStage();
    });
  }

  /* ==========================================================================
     SCREEN 2 & 3: ADJECTIVE VOCABULARY CONTRASTS
     ========================================================================== */
  setupAdjectivesScreens() {
    // Screen 2: Size & Speed
    const tabSize = document.getElementById('tabSize');
    const tabSpeed = document.getElementById('tabSpeed');

    const updateScreen2 = (catIndex) => {
      const data = LESSON_DATA.adjectives[catIndex].contrast;
      document.getElementById('adjWordLeft').textContent = data.left.label;
      document.getElementById('adjImgLeft').src = data.left.image;
      document.getElementById('adjSentenceLeft').textContent = `"${LESSON_DATA.adjectives[catIndex].words[0].sentence}"`;
      document.getElementById('adjGestureLeft').querySelector('.gesture-text').textContent = LESSON_DATA.adjectives[catIndex].words[0].gesture;

      document.getElementById('adjWordRight').textContent = data.right.label;
      document.getElementById('adjImgRight').src = data.right.image;
      document.getElementById('adjSentenceRight').textContent = `"${LESSON_DATA.adjectives[catIndex].words[catIndex === 0 ? 3 : 1].sentence}"`;
      document.getElementById('adjGestureRight').querySelector('.gesture-text').textContent = LESSON_DATA.adjectives[catIndex].words[catIndex === 0 ? 3 : 1].gesture;
    };

    tabSize.addEventListener('click', () => {
      tabSize.classList.add('active');
      tabSpeed.classList.remove('active');
      sounds.playClick();
      updateScreen2(0);
    });
    tabSpeed.addEventListener('click', () => {
      tabSpeed.classList.add('active');
      tabSize.classList.remove('active');
      sounds.playClick();
      updateScreen2(1);
    });

    document.getElementById('btnSpeakAdjLeft').addEventListener('click', () => {
      sounds.speak(document.getElementById('adjSentenceLeft').textContent);
    });
    document.getElementById('btnSpeakAdjRight').addEventListener('click', () => {
      sounds.speak(document.getElementById('adjSentenceRight').textContent);
    });

    // Screen 3: Power & Personality
    const tabPower = document.getElementById('tabPower');
    const tabPersonality = document.getElementById('tabPersonality');

    const updateScreen3 = (catIndex) => {
      const data = LESSON_DATA.adjectives[catIndex].contrast;
      document.getElementById('adj2WordLeft').textContent = data.left.label;
      document.getElementById('adj2ImgLeft').src = data.left.image;
      document.getElementById('adj2SentenceLeft').textContent = `"${LESSON_DATA.adjectives[catIndex].words[0].sentence}"`;
      document.getElementById('adj2GestureLeft').querySelector('.gesture-text').textContent = LESSON_DATA.adjectives[catIndex].words[0].gesture;

      document.getElementById('adj2WordRight').textContent = data.right.label;
      document.getElementById('adj2ImgRight').src = data.right.image;
      document.getElementById('adj2SentenceRight').textContent = `"${LESSON_DATA.adjectives[catIndex].words[1].sentence}"`;
      document.getElementById('adj2GestureRight').querySelector('.gesture-text').textContent = LESSON_DATA.adjectives[catIndex].words[1].gesture;
    };

    tabPower.addEventListener('click', () => {
      tabPower.classList.add('active');
      tabPersonality.classList.remove('active');
      sounds.playClick();
      updateScreen3(2);
    });
    tabPersonality.addEventListener('click', () => {
      tabPersonality.classList.add('active');
      tabPower.classList.remove('active');
      sounds.playClick();
      updateScreen3(3);
    });

    document.getElementById('btnSpeakAdj2Left').addEventListener('click', () => {
      sounds.speak(document.getElementById('adj2SentenceLeft').textContent);
    });
    document.getElementById('btnSpeakAdj2Right').addEventListener('click', () => {
      sounds.speak(document.getElementById('adj2SentenceRight').textContent);
    });
  }

  /* ==========================================================================
     SCREEN 4: ADJECTIVE QUICK GAME
     ========================================================================== */
  setupQuizScreen() {
    // Handled in renderQuizQuestion
  }

  renderQuizQuestion() {
    const quizData = LESSON_DATA.adjectiveQuiz[this.quizIndex];
    if (!quizData) {
      this.quizIndex = 0;
      this.nextStage();
      return;
    }

    document.getElementById('adjQuizQuestionTitle').textContent = `🔍 ${quizData.question.toUpperCase()}`;
    document.getElementById('adjQuizSentenceFrame').textContent = `"It is ${quizData.targetWord}."`;
    document.getElementById('adjQuizFeedbackMsg').textContent = 'Tap the correct Pokémon!';

    const container = document.getElementById('adjQuizChoices');
    container.innerHTML = '';

    quizData.options.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'quiz-choice-card';
      card.innerHTML = `
        <img src="${opt.image}" alt="${opt.name}" class="choice-img">
        <span class="choice-name">${opt.name}</span>
      `;

      card.addEventListener('click', () => {
        if (opt.isCorrect) {
          card.classList.add('correct');
          sounds.playCorrect();
          document.getElementById('adjQuizFeedbackMsg').textContent = `🎉 YES! ${opt.name} is ${quizData.targetWord}!`;
          sounds.speak(`${opt.name} is ${quizData.targetWord}!`);

          setTimeout(() => {
            this.quizIndex++;
            if (this.quizIndex < LESSON_DATA.adjectiveQuiz.length) {
              this.renderQuizQuestion();
            } else {
              this.quizIndex = 0;
              this.nextStage();
            }
          }, 1800);
        } else {
          card.classList.add('wrong');
          sounds.playWrong();
          document.getElementById('adjQuizFeedbackMsg').textContent = '😂 NOPE! Try again, Trainer!';
          setTimeout(() => card.classList.remove('wrong'), 800);
        }
      });

      container.appendChild(card);
    });
  }

  /* ==========================================================================
     SCREEN 5: VOCABULARY - ABILITIES
     ========================================================================== */
  setupAbilitiesScreen() {
    const grid = document.getElementById('abilitiesCardsGrid');
    grid.innerHTML = '';

    LESSON_DATA.abilities.forEach((ab, idx) => {
      const card = document.createElement('div');
      card.className = `ability-card-item ${idx === 0 ? 'active' : ''}`;
      card.innerHTML = `
        <span class="ability-card-emoji">${ab.emoji}</span>
        <span class="ability-card-name">${ab.name}</span>
        <span class="ability-card-sentence">"${ab.sentence}"</span>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.ability-card-item').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        sounds.playClick();
        sounds.playTone(600, 'sine', 0.1);

        document.getElementById('spotlightEmoji').textContent = ab.emoji;
        document.getElementById('spotlightTitle').textContent = ab.name.toUpperCase();
        document.getElementById('spotlightSentence').textContent = `"${ab.sentence}"`;
        document.getElementById('spotlightGesture').querySelector('.gesture-desc').textContent = `Gesture: ${ab.gesture}`;

        sounds.speak(ab.sentence);
      });

      grid.appendChild(card);
    });

    document.getElementById('btnSpeakSpotlight').addEventListener('click', () => {
      const sentence = document.getElementById('spotlightSentence').textContent;
      sounds.speak(sentence);
    });
  }

  /* ==========================================================================
     SCREEN 6: ACTION GAME (TPR)
     ========================================================================== */
  setupMovementScreen() {
    document.getElementById('btnNextMove').addEventListener('click', () => {
      this.movementIndex = (this.movementIndex + 1) % LESSON_DATA.abilities.length;
      sounds.playClick();
      this.renderMovementAction();
    });

    document.getElementById('btnPrevMove').addEventListener('click', () => {
      this.movementIndex = (this.movementIndex - 1 + LESSON_DATA.abilities.length) % LESSON_DATA.abilities.length;
      sounds.playClick();
      this.renderMovementAction();
    });

    document.getElementById('btnSpeakMoveSentence').addEventListener('click', () => {
      const sentence = document.getElementById('moveSentenceText').textContent;
      sounds.speak(sentence);
    });
  }

  renderMovementAction() {
    const ab = LESSON_DATA.abilities[this.movementIndex];
    document.getElementById('moveGiantEmoji').textContent = ab.emoji;
    document.getElementById('moveCommandText').textContent = `${ab.name.toUpperCase()}!`;
    document.getElementById('moveActionTip').textContent = `Action: ${ab.gesture}`;
    document.getElementById('moveSentenceText').textContent = `"${ab.sentence}"`;

    sounds.playTone(550, 'triangle', 0.2);
    setTimeout(() => sounds.speak(ab.sentence), 200);
  }

  /* ==========================================================================
     SCREEN 7: MODEL COMPLETE DESCRIPTIONS
     ========================================================================== */
  setupModelScreen() {
    const setModel = (index) => {
      const model = LESSON_DATA.modelingExamples[index];
      document.getElementById('modelImage').src = model.image;
      document.getElementById('modelName').textContent = model.name.toUpperCase();

      const tagsRow = document.getElementById('modelTagsRow');
      tagsRow.innerHTML = '';
      model.adjectives.forEach(adj => {
        tagsRow.innerHTML += `<span class="tag tag-adj">${adj}</span>`;
      });
      model.abilities.forEach(ab => {
        tagsRow.innerHTML += `<span class="tag tag-ab">${ab}</span>`;
      });

      document.getElementById('modelSentence1').textContent = `"${model.sentence1}"`;
      document.getElementById('modelSentence2').textContent = `"${model.sentence3}"`;
      document.getElementById('modelFullSpeech').textContent = `"${model.fullSpeech}"`;
    };

    document.getElementById('tabModelPikachu').addEventListener('click', (e) => {
      document.querySelectorAll('.model-switch-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      sounds.playClick();
      setModel(0);
    });
    document.getElementById('tabModelCharizard').addEventListener('click', (e) => {
      document.querySelectorAll('.model-switch-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      sounds.playClick();
      setModel(1);
    });
    document.getElementById('tabModelSquirtle').addEventListener('click', (e) => {
      document.querySelectorAll('.model-switch-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      sounds.playClick();
      setModel(2);
    });

    document.getElementById('btnSpeakModelFull').addEventListener('click', () => {
      const text = document.getElementById('modelFullSpeech').textContent;
      sounds.speak(text);
    });

    document.querySelectorAll('.student-answer-bubble .btn-audio-mini').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.speak(btn.getAttribute('data-text'));
      });
    });
  }

  /* ==========================================================================
     SCREENS 8 & 10: CHARACTER CREATOR (P1 & P2)
     ========================================================================== */
  setupCreatorScreens() {
    this.setupSingleCreator(1);
    this.setupSingleCreator(2);

    document.getElementById('btnP1Ready').addEventListener('click', () => {
      sounds.playClick();
      sounds.playSelect();
      this.goToStage(9); // P1 Speaking & Reveal
    });

    document.getElementById('btnP2Ready').addEventListener('click', () => {
      sounds.playClick();
      sounds.playSelect();
      this.goToStage(11); // P2 Speaking & Reveal
    });
  }

  setupSingleCreator(playerNum) {
    const config = playerNum === 1 ? this.p1Config : this.p2Config;
    const prefix = `p${playerNum}`;

    // Size Pills
    const sizePills = document.querySelectorAll(`#${prefix}-size-choices .choice-pill`);
    sizePills.forEach(pill => {
      pill.addEventListener('click', () => {
        sizePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        config.size = pill.getAttribute('data-val');
        sounds.playClick();
        this.updateCreatorSummary(playerNum);
      });
    });

    // Personality Pills
    const personalityPills = document.querySelectorAll(`#${prefix}-personality-choices .choice-pill`);
    personalityPills.forEach(pill => {
      pill.addEventListener('click', () => {
        personalityPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        config.personality = pill.getAttribute('data-val');
        sounds.playClick();
        this.updateCreatorSummary(playerNum);
      });
    });

    // Power Pills
    const powerPills = document.querySelectorAll(`#${prefix}-power-choices .choice-pill`);
    powerPills.forEach(pill => {
      pill.addEventListener('click', () => {
        powerPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        config.power = pill.getAttribute('data-val');
        sounds.playClick();
        this.updateCreatorSummary(playerNum);
      });
    });

    // Ability Select Grid (Exactly 2 allowed)
    const abilityContainer = document.getElementById(`${prefix}-ability-choices`);
    abilityContainer.innerHTML = '';

    LESSON_DATA.abilities.forEach(ab => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `ability-pill ${config.abilities.includes(ab.id) ? 'active' : ''}`;
      pill.setAttribute('data-id', ab.id);
      pill.innerHTML = `<span>${ab.emoji}</span> <span>${ab.name}</span>`;

      pill.addEventListener('click', () => {
        const isSelected = config.abilities.includes(ab.id);
        if (isSelected) {
          // Deselect
          config.abilities = config.abilities.filter(a => a !== ab.id);
          pill.classList.remove('active');
          sounds.playClick();
        } else {
          // Select if under 2
          if (config.abilities.length < 2) {
            config.abilities.push(ab.id);
            pill.classList.add('active');
            sounds.playSelect();
          } else {
            // Shake to indicate max 2
            sounds.playWrong();
            pill.classList.add('wrong');
            setTimeout(() => pill.classList.remove('wrong'), 400);
          }
        }
        this.updateCreatorSummary(playerNum);
      });

      abilityContainer.appendChild(pill);
    });

    this.updateCreatorSummary(playerNum);
  }

  updateCreatorSummary(playerNum) {
    const config = playerNum === 1 ? this.p1Config : this.p2Config;
    const prefix = `p${playerNum}`;

    document.getElementById(`${prefix}-spec-size`).textContent = config.size.toUpperCase();
    document.getElementById(`${prefix}-spec-personality`).textContent = config.personality.toUpperCase();
    document.getElementById(`${prefix}-spec-power`).textContent = config.power.toUpperCase();
    document.getElementById(`${prefix}-spec-abilities`).textContent = config.abilities.join(', ').toUpperCase();

    document.getElementById(`${prefix}-ability-count`).textContent = `${config.abilities.length}/2`;

    // Highlight Pod Glow based on chosen primary ability
    const pod = document.querySelector(`#screen-create-${prefix} .pod-capsule`);
    if (pod) {
      if (config.abilities.includes('make fire')) pod.style.borderColor = '#ef4444';
      else if (config.abilities.includes('make electricity')) pod.style.borderColor = '#facc15';
      else if (config.abilities.includes('make ice')) pod.style.borderColor = '#06b6d4';
      else if (config.abilities.includes('swim')) pod.style.borderColor = '#0284c7';
      else pod.style.borderColor = '#38bdf8';
    }
  }

  /* ==========================================================================
     SCREENS 9 & 11: SPEAKING CHECKPOINT & REVEAL
     ========================================================================== */
  setupRevealScreens() {
    // Player 1
    document.getElementById('btnP1PracticeSpeech').addEventListener('click', () => {
      this.speakPokemonDescription(1);
    });

    document.getElementById('btnP1TriggerReveal').addEventListener('click', () => {
      this.triggerCountdownReveal(1);
    });

    document.getElementById('btnP1NextToTrainer2').addEventListener('click', () => {
      sounds.playClick();
      this.goToStage(10); // Trainer 2 Create
    });

    // Player 2
    document.getElementById('btnP2PracticeSpeech').addEventListener('click', () => {
      this.speakPokemonDescription(2);
    });

    document.getElementById('btnP2TriggerReveal').addEventListener('click', () => {
      this.triggerCountdownReveal(2);
    });

    document.getElementById('btnStartBattleArena').addEventListener('click', () => {
      sounds.playClick();
      this.goToStage(12); // Battle Arena
    });
  }

  prepareSpeakingGate(playerNum) {
    const config = playerNum === 1 ? this.p1Config : this.p2Config;
    const prefix = `p${playerNum}`;

    document.getElementById(`${prefix}-slot-size`).textContent = config.size;
    document.getElementById(`${prefix}-slot-power`).textContent = config.power;
    document.getElementById(`${prefix}-slot-personality`).textContent = config.personality;
    document.getElementById(`${prefix}-slot-ab1`).textContent = config.abilities[0] || 'jump';
    document.getElementById(`${prefix}-slot-ab2`).textContent = config.abilities[1] || 'fly';

    // Show speaking box, hide countdown and reveal cards
    document.getElementById(`${prefix}-speaking-box`).classList.remove('hidden');
    document.getElementById(`${prefix}-countdown-overlay`).classList.add('hidden');
    document.getElementById(`${prefix}-reveal-card`).classList.add('hidden');
  }

  speakPokemonDescription(playerNum) {
    const config = playerNum === 1 ? this.p1Config : this.p2Config;
    const ab1 = config.abilities[0] || 'jump';
    const ab2 = config.abilities[1] || 'fly';
    const text = `My Pokémon is ${config.size} and ${config.power}. It is ${config.personality}. It can ${ab1} and ${ab2}.`;
    sounds.speak(text);
  }

  triggerCountdownReveal(playerNum) {
    const prefix = `p${playerNum}`;
    const speakingBox = document.getElementById(`${prefix}-speaking-box`);
    const countdownOverlay = document.getElementById(`${prefix}-countdown-overlay`);
    const countdownNumber = document.getElementById(`${prefix}-countdown-number`);
    const revealCard = document.getElementById(`${prefix}-reveal-card`);

    speakingBox.classList.add('hidden');
    countdownOverlay.classList.remove('hidden');

    let count = 3;
    countdownNumber.textContent = count;
    sounds.playCountdown(count);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownNumber.textContent = count;
        sounds.playCountdown(count);
      } else {
        clearInterval(interval);
        countdownOverlay.classList.add('hidden');

        // Create Creature
        const config = playerNum === 1 ? this.p1Config : this.p2Config;
        const creature = creatures.create(config, `Trainer ${playerNum}`);
        if (playerNum === 1) this.p1Creature = creature;
        else this.p2Creature = creature;

        // Render Revealed Creature
        revealCard.classList.remove('hidden');
        sounds.playReveal();

        document.getElementById(`${prefix}-revealed-name`).textContent = creature.name.toUpperCase();
        document.getElementById(`${prefix}-revealed-traits`).textContent =
          `${creature.size.toUpperCase()} • ${creature.power.toUpperCase()} • ${creature.personality.toUpperCase()}`;

        document.getElementById(`${prefix}-creature-viewport`).innerHTML = creature.svg;

        const abContainer = document.getElementById(`${prefix}-revealed-abilities`);
        abContainer.innerHTML = '';
        creature.abilities.forEach(ab => {
          abContainer.innerHTML += `<span class="revealed-ability-pill">Can ${ab}</span>`;
        });
      }
    }, 1000);
  }

  /* ==========================================================================
     SCREEN 12: CREATOR BATTLE ARENA
     ========================================================================== */
  setupBattleArena() {
    // Rubric Scoring Buttons
    const rubricButtons = document.querySelectorAll('.teacher-score-rubric .btn-rubric');
    rubricButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const pts = parseInt(btn.getAttribute('data-pts'), 10) || 1;
        const label = btn.getAttribute('data-label');
        this.awardEnglishPoints(this.activeBattleTrainer, pts, label);
      });
    });

    // Switch Turn
    document.getElementById('btnSwitchBattleTurn').addEventListener('click', () => {
      sounds.playClick();
      this.switchBattleTurn();
    });

    // Finish Battle
    document.getElementById('btnFinishBattle').addEventListener('click', () => {
      sounds.playClick();
      this.goToStage(13); // Champion Ceremony
    });
  }

  initBattleArena() {
    // If creatures weren't created yet, generate defaults
    if (!this.p1Creature) this.p1Creature = creatures.create(this.p1Config, "Trainer 1");
    if (!this.p2Creature) this.p2Creature = creatures.create(this.p2Config, "Trainer 2");

    this.activeBattleTrainer = 1;
    this.battleRound = 1;
    this.p1Hp = 100;
    this.p2Hp = 100;
    this.p1Points = 0;
    this.p2Points = 0;

    document.getElementById('battleP1Name').textContent = this.p1Creature.name.toUpperCase();
    document.getElementById('battleP2Name').textContent = this.p2Creature.name.toUpperCase();

    document.getElementById('battleCreatureP1').innerHTML = this.p1Creature.svg;
    document.getElementById('battleCreatureP2').innerHTML = this.p2Creature.svg;

    this.updateBattleHUD();
    this.renderBattleAttackButtons();
  }

  updateBattleHUD() {
    document.getElementById('battleP1HpBar').style.width = `${Math.max(0, this.p1Hp)}%`;
    document.getElementById('battleP2HpBar').style.width = `${Math.max(0, this.p2Hp)}%`;

    document.getElementById('battleP1PointsBadge').textContent = `⭐ ${this.p1Points} English Pts`;
    document.getElementById('battleP2PointsBadge').textContent = `⭐ ${this.p2Points} English Pts`;

    document.getElementById('battleRoundText').textContent = `ROUND ${this.battleRound}`;

    // Highlight active podium
    const podiumP1 = document.getElementById('battlePodiumP1');
    const podiumP2 = document.getElementById('battlePodiumP2');
    if (this.activeBattleTrainer === 1) {
      podiumP1.classList.add('active-turn');
      podiumP2.classList.remove('active-turn');
      document.getElementById('turnIndicatorP1').textContent = 'Active Turn ⚡';
      document.getElementById('turnIndicatorP2').textContent = 'Waiting...';
      document.getElementById('turnPromptBanner').querySelector('.turn-callout').textContent = 'TRAINER 1 TURN:';
    } else {
      podiumP2.classList.add('active-turn');
      podiumP1.classList.remove('active-turn');
      document.getElementById('turnIndicatorP2').textContent = 'Active Turn ⚡';
      document.getElementById('turnIndicatorP1').textContent = 'Waiting...';
      document.getElementById('turnPromptBanner').querySelector('.turn-callout').textContent = 'TRAINER 2 TURN:';
    }
  }

  renderBattleAttackButtons() {
    const container = document.getElementById('abilityAttackButtons');
    container.innerHTML = '';

    const currentCreature = this.activeBattleTrainer === 1 ? this.p1Creature : this.p2Creature;
    const abilities = currentCreature.abilities || ['make fire', 'fly'];

    abilities.forEach(abName => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-attack';
      btn.textContent = `💥 "It can ${abName}!"`;

      btn.addEventListener('click', () => {
        this.triggerBattleAttack(this.activeBattleTrainer, abName);
      });

      container.appendChild(btn);
    });
  }

  triggerBattleAttack(attackerNum, abilityName) {
    const defenderNum = attackerNum === 1 ? 2 : 1;
    const attackerEl = document.getElementById(`battleCreatureP${attackerNum}`);
    const defenderEl = document.getElementById(`battleCreatureP${defenderNum}`);
    const bubble = document.getElementById(`bubbleP${attackerNum}`);

    // Show Speech Bubble
    bubble.querySelector('.bubble-speech-text').textContent = `"It can ${abilityName}!"`;
    bubble.classList.remove('hidden');
    sounds.speak(`It can ${abilityName}!`);

    // Attacker lunge animation
    attackerEl.classList.add(attackerNum === 1 ? 'attack-lunge-p1' : 'attack-lunge-p2');

    // Attack FX Blast
    const fxLayer = document.getElementById('battleFxLayer');
    const blast = document.createElement('div');
    blast.className = 'fx-blast';
    blast.style.left = defenderNum === 2 ? '75%' : '25%';
    blast.style.top = '50%';

    const emojiMap = {
      'make fire': '🔥',
      'make ice': '❄️',
      'make electricity': '⚡',
      'fly': '🌪️',
      'swim': '🌊',
      'jump': '💥',
      'dig': '🪨',
      'become invisible': '👻'
    };
    blast.textContent = emojiMap[abilityName] || '💥';
    fxLayer.appendChild(blast);

    // Audio & Hit
    sounds.playAttackSound(abilityName.split(' ')[1] || abilityName);

    setTimeout(() => {
      defenderEl.classList.add('hit-shake');
      sounds.playHit();

      // Reduce HP
      if (defenderNum === 1) this.p1Hp -= 20;
      else this.p2Hp -= 20;

      // Award automatic +1 attack point
      if (attackerNum === 1) this.p1Points += 1;
      else this.p2Points += 1;

      this.updateBattleHUD();

      setTimeout(() => {
        attackerEl.classList.remove('attack-lunge-p1', 'attack-lunge-p2');
        defenderEl.classList.remove('hit-shake');
        bubble.classList.add('hidden');
        if (blast.parentNode) blast.parentNode.removeChild(blast);
      }, 500);
    }, 250);
  }

  awardEnglishPoints(trainerNum, pts, reason) {
    if (trainerNum === 1) this.p1Points += pts;
    else this.p2Points += pts;

    sounds.playPoint();
    sounds.playSuper();
    this.updateBattleHUD();

    // Floating notification on screen
    const feedback = document.getElementById('turnPromptBanner').querySelector('.turn-instruction');
    feedback.textContent = `⭐ +${pts} ${reason}! Great English, Trainer ${trainerNum}!`;
  }

  switchBattleTurn() {
    this.activeBattleTrainer = this.activeBattleTrainer === 1 ? 2 : 1;
    if (this.activeBattleTrainer === 1) this.battleRound++;
    this.updateBattleHUD();
    this.renderBattleAttackButtons();
  }

  /* ==========================================================================
     SCREEN 13: CHAMPION CEREMONY
     ========================================================================== */
  initChampionCeremony() {
    sounds.playVictory();

    // Determine winner based on English points
    let winner = 1;
    if (this.p2Points > this.p1Points) winner = 2;
    else if (this.p1Points === this.p2Points && this.p2Hp > this.p1Hp) winner = 2;

    const winnerCreature = winner === 1 ? this.p1Creature : this.p2Creature;

    document.getElementById('champWinnerTitle').textContent = `CHAMPION TRAINER ${winner}!`;
    document.getElementById('champCreatureName').textContent = winnerCreature.name.toUpperCase();
    document.getElementById('champCreatureViewport').innerHTML = winnerCreature.svg;

    document.getElementById('champScoreP1').textContent = `${this.p1Points} Points ⭐`;
    document.getElementById('champScoreP2').textContent = `${this.p2Points} Points ⭐`;

    // Confetti particles
    const confettiWrap = document.getElementById('confettiContainer');
    confettiWrap.innerHTML = '';
    for (let i = 0; i < 40; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti-piece';
      conf.style.left = `${Math.random() * 100}%`;
      conf.style.backgroundColor = ['#facc15', '#38bdf8', '#ef4444', '#22c55e', '#ec4899'][Math.floor(Math.random() * 5)];
      conf.style.animationDelay = `${Math.random() * 2}s`;
      confettiWrap.appendChild(conf);
    }

    // Handlers for champion buttons
    document.getElementById('btnOpenClassroomWorksheets').addEventListener('click', () => {
      document.getElementById('modalPokedex').classList.remove('hidden');
    });

    document.getElementById('btnNextPairBattle').addEventListener('click', () => {
      // Reset for next battle pair
      sounds.playClick();
      this.goToStage(8); // Trainer 1 Create
    });
  }

  /* ==========================================================================
     MODALS: POKÉDEX & TEACHER GUIDE
     ========================================================================== */
  setupModals() {
    // Pokédex Modal
    const modalPokedex = document.getElementById('modalPokedex');
    document.getElementById('btnPokedexModal').addEventListener('click', () => {
      modalPokedex.classList.remove('hidden');
    });
    document.getElementById('btnClosePokedex').addEventListener('click', () => {
      modalPokedex.classList.add('hidden');
    });
    document.getElementById('btnClearPokedexChecks').addEventListener('click', () => {
      modalPokedex.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
    });
    document.getElementById('btnPrintPokedexModal').addEventListener('click', () => {
      window.print();
    });

    // Teacher Guide Modal
    const modalGuide = document.getElementById('modalTeacherGuide');
    document.getElementById('btnTeacherNotes').addEventListener('click', () => {
      modalGuide.classList.remove('hidden');
    });
    document.getElementById('btnCloseGuide').addEventListener('click', () => {
      modalGuide.classList.add('hidden');
    });

    // Close on backdrop click
    [modalPokedex, modalGuide].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });
    });
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new PokemonApp();
});
