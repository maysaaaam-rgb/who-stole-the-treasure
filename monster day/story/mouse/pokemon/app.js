/**
 * POKÉMON TRAINER CHALLENGE — SMARTBOARD APPLICATION CONTROLLER
 * Responsive 16:9 Auto-Scaling, Touch-Optimized, Classroom-First ESL Game
 */

class PokemonTrainerApp {
  constructor() {
    this.currentStageIndex = 0;
    this.isClassroomMode = false;

    // Student Creature State
    this.studentPokemon = {
      archetype: 'dragon',
      size: 'big',
      look: 'cute',
      color: 'blue',
      features: 'wings',
      abilities: ['fly', 'breathe fire']
    };
    this.createdCreatureObj = null;

    // Activity States
    this.silhouetteRound = 0;
    this.vocabPairIndex = 0;
    this.canCantRound = 0;
    this.mysteryClassRound = 0;
    this.bossStars = 0;
    this.bossStep = 1; // 1 to 4

    // Screen IDs
    this.screens = [
      'screen-start',
      'screen-how-to-play',
      'screen-silhouette',
      'screen-appearance-vocab',
      'screen-appearance-explorer',
      'screen-ability-lab',
      'screen-can-cant',
      'screen-creator',
      'screen-reveal',
      'screen-speaking',
      'screen-mystery-game',
      'screen-final-boss',
      'screen-profile-card'
    ];

    this.stageTitles = [
      '1. Welcome Trainer!',
      '2. How to Play',
      '3. Guess the Pokémon (Icebreaker)',
      '4. Teach Appearance Vocabulary',
      '5. Appearance Explorer',
      '6. Pokémon Ability Lab (16 Abilities)',
      '7. CAN or CAN\'T Challenge',
      '8. Build Your Own Pokémon',
      '9. Dramatic 3-2-1 Reveal',
      '10. Speaking Challenge',
      '11. Mystery Pokémon Class Game',
      '12. Final Boss Challenge',
      '13. Master Trainer Certificate'
    ];
  }

  init() {
    // 1. Initial 16:9 Screen Fit
    this.fitToScreen();
    window.addEventListener('resize', () => this.fitToScreen());
    document.addEventListener('fullscreenchange', () => {
      this.fitToScreen();
      this.updateFullscreenButton();
    });

    // 2. Global Navigation & Utilities
    this.setupGlobalControls();
    this.renderProgressDots();

    // 3. Screen Initializers
    this.setupStartScreen();
    this.setupSilhouetteGame();
    this.setupVocabScreen();
    this.setupExplorerScreen();
    this.setupAbilityLab();
    this.setupCanCantScreen();
    this.setupCreatorStudio();
    this.setupSpeakingScreen();
    this.setupMysteryGame();
    this.setupBossChallenge();
    this.setupProfileCard();

    // 4. Keyboard Navigation
    this.setupKeyboardShortcuts();

    // Start at Screen 0
    this.goToStage(0);
  }

  /* ==========================================================================
     VIRTUAL CANVAS AUTO-SCALER (Guarantees Zero Scrolling & Zero Clipping)
     ========================================================================== */
  fitToScreen() {
    const stage = document.getElementById('appStage');
    if (!stage) return;

    const availableW = window.innerWidth;
    const availableH = window.innerHeight;

    // Maintain 1920x1080 (16:9) aspect ratio within any display
    const scale = Math.min(availableW / 1920, availableH / 1080);
    stage.style.transform = `scale(${scale})`;
  }

  updateFullscreenButton() {
    const isFs = !!document.fullscreenElement;
    const btnText = document.getElementById('fullscreenText');
    const btnIcon = document.getElementById('fullscreenIcon');
    if (btnText) btnText.textContent = isFs ? 'Exit Full' : 'Fullscreen';
    if (btnIcon) btnIcon.textContent = isFs ? '✖' : '🔲';
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen request error", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  toggleSound() {
    const isMuted = sounds.toggleMute();
    const icon = document.getElementById('soundIcon');
    if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
  }

  toggleClassroomMode() {
    this.isClassroomMode = !this.isClassroomMode;
    const viewport = document.getElementById('appViewport');
    if (viewport) {
      viewport.classList.toggle('classroom-mode', this.isClassroomMode);
    }
  }

  /* ==========================================================================
     NAVIGATION & BREADCRUMBS
     ========================================================================== */
  renderProgressDots() {
    const track = document.getElementById('stageProgressTrack');
    if (!track) return;
    track.innerHTML = '';
    this.screens.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `progress-dot ${idx === 0 ? 'active' : ''}`;
      dot.title = this.stageTitles[idx] || `Stage ${idx + 1}`;
      dot.addEventListener('click', () => {
        sounds.playClick();
        this.goToStage(idx);
      });
      track.appendChild(dot);
    });
  }

  updateProgressDots() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, idx) => {
      dot.classList.remove('active', 'completed');
      if (idx === this.currentStageIndex) {
        dot.classList.add('active');
      } else if (idx < this.currentStageIndex) {
        dot.classList.add('completed');
      }
    });
  }

  goToStage(index) {
    if (index < 0 || index >= this.screens.length) return;

    // Hide all screens
    document.querySelectorAll('.activity-screen').forEach(s => s.classList.remove('active'));

    this.currentStageIndex = index;
    const activeScreenId = this.screens[index];
    const targetScreen = document.getElementById(activeScreenId);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }

    // Update Top & Bottom Stage Titles
    const titleText = this.stageTitles[index] || `Stage ${index + 1}`;
    document.getElementById('topStageTitle').textContent = titleText;
    document.getElementById('navStageIndicator').textContent = titleText;

    this.updateProgressDots();

    // Trigger stage-specific entries
    this.onStageEnter(index);
  }

  nextStage() {
    if (this.currentStageIndex < this.screens.length - 1) {
      sounds.playClick();
      this.goToStage(this.currentStageIndex + 1);
    }
  }

  prevStage() {
    if (this.currentStageIndex > 0) {
      sounds.playClick();
      this.goToStage(this.currentStageIndex - 1);
    }
  }

  setupGlobalControls() {
    // Top Bar
    document.getElementById('btnLogoHome').addEventListener('click', () => {
      sounds.playClick();
      this.goToStage(0);
    });
    document.getElementById('btnSoundToggle').addEventListener('click', () => this.toggleSound());
    document.getElementById('btnFullscreenToggle').addEventListener('click', () => this.toggleFullscreen());
    document.getElementById('btnClassroomMode').addEventListener('click', () => this.toggleClassroomMode());
    document.getElementById('btnRestartAdventure').addEventListener('click', () => {
      sounds.playClick();
      this.goToStage(0);
    });

    // Bottom Bar
    document.getElementById('btnNavBack').addEventListener('click', () => this.prevStage());
    document.getElementById('btnNavHome').addEventListener('click', () => {
      sounds.playClick();
      this.goToStage(0);
    });
    document.getElementById('btnNavNext').addEventListener('click', () => this.nextStage());

    // Modal How to Play
    const modal = document.getElementById('modalHowToPlay');
    document.getElementById('btnOpenHowToPlay').addEventListener('click', () => {
      sounds.playClick();
      modal.classList.remove('hidden');
    });
    document.getElementById('btnCloseHowToPlay').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('btnModalUnderstood').addEventListener('click', () => {
      modal.classList.add('hidden');
      this.goToStage(1);
    });
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        this.nextStage();
      } else if (e.key === 'ArrowLeft') {
        this.prevStage();
      } else if (e.key === 'f' || e.key === 'F') {
        this.toggleFullscreen();
      } else if (e.key === ' ') {
        // Space repeats current active speech
        e.preventDefault();
        this.repeatActiveSpeech();
      }
    });
  }

  repeatActiveSpeech() {
    if (this.currentStageIndex === 3) {
      const pair = LESSON_DATA.appearanceVocab[this.vocabPairIndex];
      if (pair) sounds.speak(`${pair.sentence1} ${pair.sentence2}`);
    } else if (this.currentStageIndex === 5) {
      const sentence = document.getElementById('demoSentenceText').textContent;
      sounds.speak(sentence);
    } else if (this.currentStageIndex === 9) {
      this.speakFullPokemonDescription();
    }
  }

  onStageEnter(index) {
    if (index === 2) {
      this.renderSilhouetteRound();
    } else if (index === 3) {
      this.renderVocabPair(0);
    } else if (index === 4) {
      this.renderExplorerCards();
    } else if (index === 6) {
      this.renderCanCantRound();
    } else if (index === 7) {
      this.updateCreatorPreview();
    } else if (index === 8) {
      this.start321Reveal();
    } else if (index === 9) {
      this.prepareSpeakingChallenge();
    } else if (index === 10) {
      this.renderMysteryClassRound();
    } else if (index === 11) {
      this.initBossChallenge();
    } else if (index === 12) {
      this.renderFinalProfileCard();
    }
  }

  /* ==========================================================================
     SCREEN 1: START SCREEN
     ========================================================================== */
  setupStartScreen() {
    document.getElementById('btnStartAdventure').addEventListener('click', () => {
      sounds.playClick();
      sounds.playSelect();
      this.goToStage(1);
    });
    document.getElementById('btnRulesContinue').addEventListener('click', () => {
      sounds.playClick();
      sounds.playSelect();
      this.goToStage(2);
    });
  }

  /* ==========================================================================
     SCREEN 3: SILHOUETTE MYSTERY GAME (ICEBREAKER)
     ========================================================================== */
  setupSilhouetteGame() {
    for (let i = 1; i <= 4; i++) {
      const btn = document.getElementById(`clueBtn${i}`);
      if (btn) {
        btn.addEventListener('click', () => {
          const round = LESSON_DATA.silhouetteRounds[this.silhouetteRound];
          if (!round) return;
          const clueText = round.clues[i - 1];
          btn.querySelector('.clue-text').textContent = clueText;
          btn.classList.add('active');
          sounds.playSelect();
          sounds.speak(clueText);
        });
      }
    }
  }

  renderSilhouetteRound() {
    const round = LESSON_DATA.silhouetteRounds[this.silhouetteRound];
    if (!round) {
      this.silhouetteRound = 0;
      this.nextStage();
      return;
    }

    document.getElementById('silhouetteRoundTag').textContent = `ROUND ${this.silhouetteRound + 1} of ${LESSON_DATA.silhouetteRounds.length}`;
    const img = document.getElementById('silhouetteImage');
    img.src = round.image;
    img.className = 'silhouette-img is-shadow';

    // Reset clues
    for (let i = 1; i <= 4; i++) {
      const btn = document.getElementById(`clueBtn${i}`);
      btn.querySelector('.clue-text').textContent = `Touch for Clue ${i}`;
      btn.classList.remove('active');
    }

    // Render 3 choices
    const container = document.getElementById('silhouetteChoicesContainer');
    container.innerHTML = '';

    round.choices.forEach(choice => {
      const card = document.createElement('div');
      card.className = 'silhouette-choice-card';
      card.innerHTML = `
        <img src="${choice.image}" alt="${choice.name}">
        <span>${choice.name}</span>
      `;

      card.addEventListener('click', () => {
        if (choice.isCorrect) {
          card.classList.add('correct');
          sounds.playCorrect();
          sounds.playCelebration();

          // Reveal silhouette!
          img.className = 'silhouette-img is-revealed';
          sounds.speak(`YES! It is ${round.answerName}!`);

          setTimeout(() => {
            this.silhouetteRound++;
            if (this.silhouetteRound < LESSON_DATA.silhouetteRounds.length) {
              this.renderSilhouetteRound();
            } else {
              this.silhouetteRound = 0;
              this.nextStage();
            }
          }, 2400);
        } else {
          card.classList.add('wrong');
          sounds.playWrong();
          sounds.speak("Try again, Trainer!");
          setTimeout(() => card.classList.remove('wrong'), 700);
        }
      });

      container.appendChild(card);
    });
  }

  /* ==========================================================================
     SCREEN 4: TEACH APPEARANCE VOCABULARY
     ========================================================================== */
  setupVocabScreen() {
    const tabs = document.querySelectorAll('.vocab-tab');
    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        sounds.playClick();
        this.renderVocabPair(idx);
      });
    });

    document.getElementById('btnSpeakLeft').addEventListener('click', () => {
      sounds.speak(document.getElementById('contrastSentenceLeft').textContent);
    });
    document.getElementById('btnSpeakRight').addEventListener('click', () => {
      sounds.speak(document.getElementById('contrastSentenceRight').textContent);
    });

    // Touch card interaction
    document.getElementById('contrastCardLeft').addEventListener('click', () => {
      this.handleVocabCardTouch('left');
    });
    document.getElementById('contrastCardRight').addEventListener('click', () => {
      this.handleVocabCardTouch('right');
    });
  }

  renderVocabPair(pairIdx) {
    this.vocabPairIndex = pairIdx;
    const pair = LESSON_DATA.appearanceVocab[pairIdx];
    if (!pair) return;

    document.getElementById('contrastImgLeft').src = pair.image1;
    document.getElementById('contrastWordLeft').textContent = pair.word1.toUpperCase();
    document.getElementById('contrastSentenceLeft').textContent = `"${pair.sentence1}"`;
    document.getElementById('contrastGestureLeft').textContent = `Gesture: ${pair.gesture1}`;

    document.getElementById('contrastImgRight').src = pair.image2;
    document.getElementById('contrastWordRight').textContent = pair.word2.toUpperCase();
    document.getElementById('contrastSentenceRight').textContent = `"${pair.sentence2}"`;
    document.getElementById('contrastGestureRight').textContent = `Gesture: ${pair.gesture2}`;

    // Prompt for quick check challenge
    const promptEl = document.getElementById('vocabChallengePrompt');
    promptEl.textContent = `Touch the ${pair.word1.toUpperCase()} Pokémon!`;
    document.getElementById('vocabChallengeFeedback').textContent = 'Tap one above!';

    // Speak sentence
    sounds.speak(`${pair.sentence1} ${pair.sentence2}`);
  }

  handleVocabCardTouch(side) {
    const pair = LESSON_DATA.appearanceVocab[this.vocabPairIndex];
    if (!pair) return;

    const card = side === 'left' ? document.getElementById('contrastCardLeft') : document.getElementById('contrastCardRight');
    const word = side === 'left' ? pair.word1 : pair.word2;

    card.classList.add('touched-correct');
    sounds.playCorrect();
    document.getElementById('vocabChallengeFeedback').textContent = `⭐ YES! That is ${word.toUpperCase()}!`;
    sounds.speak(`Yes! It is ${word}!`);

    setTimeout(() => card.classList.remove('touched-correct'), 1200);
  }

  /* ==========================================================================
     SCREEN 5: APPEARANCE EXPLORER
     ========================================================================== */
  setupExplorerScreen() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        const val = btn.getAttribute('data-val');

        const wasActive = btn.classList.contains('active');
        filterBtns.forEach(b => {
          if (b.getAttribute('data-type') === type) b.classList.remove('active');
        });

        if (!wasActive) {
          btn.classList.add('active');
          sounds.playSelect();
          this.applyExplorerFilter(type, val);
        } else {
          this.clearExplorerFilters();
        }
      });
    });

    document.getElementById('btnClearExplorerFilters').addEventListener('click', () => {
      sounds.playClick();
      this.clearExplorerFilters();
    });
  }

  clearExplorerFilters() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.explorer-creature-card').forEach(card => {
      card.classList.remove('highlighted', 'dimmed');
    });
  }

  applyExplorerFilter(type, val) {
    const cards = document.querySelectorAll('.explorer-creature-card');
    cards.forEach(card => {
      const cardVal = card.getAttribute(`data-${type}`);
      if (cardVal && cardVal.includes(val)) {
        card.classList.add('highlighted');
        card.classList.remove('dimmed');
      } else {
        card.classList.remove('highlighted');
        card.classList.add('dimmed');
      }
    });

    sounds.speak(`Showing ${val} Pokémon!`);
  }

  renderExplorerCards() {
    const container = document.getElementById('explorerCardsGrid');
    container.innerHTML = '';

    LESSON_DATA.explorerCards.forEach(item => {
      const card = document.createElement('div');
      card.className = 'explorer-creature-card';
      card.setAttribute('data-size', item.size);
      card.setAttribute('data-height', item.height);
      card.setAttribute('data-color', item.color);
      card.setAttribute('data-look', item.look);

      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <span class="card-title">${item.name}</span>
        <span class="card-tags">${item.size.toUpperCase()} • ${item.color.toUpperCase()} • ${item.look.toUpperCase()}</span>
      `;

      card.addEventListener('click', () => {
        sounds.playClick();
        sounds.speak(`${item.name} is ${item.size}, ${item.color}, and ${item.look}.`);
      });

      container.appendChild(card);
    });
  }

  /* ==========================================================================
     SCREEN 6: POKÉMON ABILITY LAB (16 RICH ABILITIES)
     ========================================================================== */
  setupAbilityLab() {
    const grid = document.getElementById('abilities16Grid');
    grid.innerHTML = '';

    LESSON_DATA.abilities.forEach((ab, idx) => {
      const card = document.createElement('div');
      card.className = `ability-grid-card ${idx === 0 ? 'active' : ''}`;
      card.innerHTML = `
        <span class="ability-card-emoji">${ab.emoji}</span>
        <span class="ability-card-name">${ab.name}</span>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.ability-grid-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        this.demonstrateAbility(ab);
      });

      grid.appendChild(card);
    });

    document.getElementById('btnSpeakAbilitySentence').addEventListener('click', () => {
      sounds.speak(document.getElementById('demoSentenceText').textContent);
    });

    // Default demonstration for Fly
    this.demonstrateAbility(LESSON_DATA.abilities[0]);
  }

  demonstrateAbility(ability) {
    sounds.playSelect();
    sounds.playAbilityEffect(ability.id);

    // Update Banner
    document.getElementById('demoAbilityTag').textContent = `${ability.emoji} ${ability.name.toUpperCase()}`;
    document.getElementById('demoSentenceText').textContent = `"${ability.sentence}"`;
    document.getElementById('demoGestureHint').textContent = `Gesture: ${ability.gesture}`;

    // Update Demo Sprite
    const sprite = document.getElementById('demoCreatureImg');
    sprite.src = ability.demoImage;

    // Trigger visual demonstration animation
    sprite.className = 'demo-creature-sprite';
    const fx = document.getElementById('demoFxOverlay');
    fx.textContent = ability.emoji;
    fx.style.opacity = '1';

    if (ability.id === 'fly') sprite.classList.add('anim-fly-active');
    else if (ability.id === 'jump high') sprite.classList.add('anim-jump-active');
    else if (ability.id === 'run fast') sprite.classList.add('anim-run-active');

    setTimeout(() => {
      fx.style.opacity = '0';
    }, 1200);

    // Speak native sentence
    sounds.speak(ability.sentence);
  }

  /* ==========================================================================
     SCREEN 7: CAN VS CAN'T CHALLENGE
     ========================================================================== */
  setupCanCantScreen() {
    // Handled in renderCanCantRound
  }

  renderCanCantRound() {
    const q = LESSON_DATA.canCantQuestions[this.canCantRound];
    if (!q) {
      this.canCantRound = 0;
      this.nextStage();
      return;
    }

    document.getElementById('canCantRoundCounter').textContent = `Round ${this.canCantRound + 1} of ${LESSON_DATA.canCantQuestions.length}`;
    document.getElementById('canCantName').textContent = q.pokemonName.toUpperCase();
    document.getElementById('canCantCreatureImg').src = q.image;

    const stack = document.getElementById('canCantQuestionsStack');
    stack.innerHTML = '';

    q.prompts.forEach(p => {
      const row = document.createElement('div');
      row.className = 'can-cant-row-card';
      row.innerHTML = `
        <span class="can-cant-statement">"${p.statement}"</span>
        <div class="can-cant-buttons-pair">
          <button class="btn-choice-can">✅ CAN</button>
          <button class="btn-choice-cant">❌ CAN'T</button>
        </div>
      `;

      const btnCan = row.querySelector('.btn-choice-can');
      const btnCant = row.querySelector('.btn-choice-cant');

      btnCan.addEventListener('click', () => {
        if (p.isCan) {
          row.style.borderColor = '#22c55e';
          sounds.playCorrect();
          sounds.speak(p.explanation);
        } else {
          row.style.borderColor = '#ef4444';
          sounds.playWrong();
          sounds.speak(p.explanation);
        }
      });

      btnCant.addEventListener('click', () => {
        if (!p.isCan) {
          row.style.borderColor = '#22c55e';
          sounds.playCorrect();
          sounds.speak(p.explanation);
        } else {
          row.style.borderColor = '#ef4444';
          sounds.playWrong();
          sounds.speak(p.explanation);
        }
      });

      stack.appendChild(row);
    });
  }

  /* ==========================================================================
     SCREEN 8: BUILD YOUR OWN POKÉMON (CREATOR STUDIO)
     ========================================================================== */
  setupCreatorStudio() {
    // 1. Archetype Pills (10 Archetypes)
    const archContainer = document.getElementById('creatorArchetypePills');
    archContainer.innerHTML = '';
    LESSON_DATA.archetypes.forEach(arch => {
      const btn = document.createElement('button');
      btn.className = `choice-pill ${arch.id === this.studentPokemon.archetype ? 'active' : ''}`;
      btn.setAttribute('data-val', arch.id);
      btn.innerHTML = `<span>${arch.emoji}</span> <span>${arch.name}</span>`;

      btn.addEventListener('click', () => {
        archContainer.querySelectorAll('.choice-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.studentPokemon.archetype = arch.id;
        sounds.playClick();
        this.updateCreatorPreview();
      });

      archContainer.appendChild(btn);
    });

    // 2. Size Pills
    document.querySelectorAll('#creatorSizePills .choice-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#creatorSizePills .choice-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.studentPokemon.size = pill.getAttribute('data-val');
        sounds.playClick();
        this.updateCreatorPreview();
      });
    });

    // 3. Look Pills
    document.querySelectorAll('#creatorLookPills .choice-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#creatorLookPills .choice-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.studentPokemon.look = pill.getAttribute('data-val');
        sounds.playClick();
        this.updateCreatorPreview();
      });
    });

    // 4. Color Pills
    document.querySelectorAll('#creatorColorPills .choice-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#creatorColorPills .choice-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.studentPokemon.color = pill.getAttribute('data-val');
        sounds.playClick();
        this.updateCreatorPreview();
      });
    });

    // 5. Feature Pills
    document.querySelectorAll('#creatorFeaturePills .choice-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#creatorFeaturePills .choice-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.studentPokemon.features = pill.getAttribute('data-val');
        sounds.playClick();
        this.updateCreatorPreview();
      });
    });

    // 6. Abilities Grid (Select 2 to 4)
    const abGrid = document.getElementById('creatorAbilitiesGrid');
    abGrid.innerHTML = '';
    LESSON_DATA.abilities.forEach(ab => {
      const btn = document.createElement('button');
      btn.className = `creator-ab-pill ${this.studentPokemon.abilities.includes(ab.id) ? 'active' : ''}`;
      btn.innerHTML = `<span>${ab.emoji}</span> <span>${ab.name}</span>`;

      btn.addEventListener('click', () => {
        const idx = this.studentPokemon.abilities.indexOf(ab.id);
        if (idx !== -1) {
          // Can remove if >= 2
          if (this.studentPokemon.abilities.length > 2) {
            this.studentPokemon.abilities.splice(idx, 1);
            btn.classList.remove('active');
            sounds.playClick();
          } else {
            sounds.playWrong();
          }
        } else {
          // Can add if <= 4
          if (this.studentPokemon.abilities.length < 4) {
            this.studentPokemon.abilities.push(ab.id);
            btn.classList.add('active');
            sounds.playSelect();
          } else {
            sounds.playWrong();
          }
        }
        this.updateCreatorPreview();
      });

      abGrid.appendChild(btn);
    });

    // Random Pokémon Generator Button
    document.getElementById('btnCreateRandomPokemon').addEventListener('click', () => {
      this.generateRandomPokemon();
    });

    // Trigger Reveal Button
    document.getElementById('btnTriggerCreatePokemon').addEventListener('click', () => {
      sounds.playClick();
      this.goToStage(8); // Dramatic Reveal
    });
  }

  generateRandomPokemon() {
    const archs = LESSON_DATA.archetypes;
    const sizes = ['tiny', 'small', 'big', 'huge'];
    const looks = ['cute', 'brave', 'strong', 'scary', 'friendly'];
    const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'black', 'white'];
    const features = ['wings', 'tail', 'horns', 'ears'];

    this.studentPokemon.archetype = archs[Math.floor(Math.random() * archs.length)].id;
    this.studentPokemon.size = sizes[Math.floor(Math.random() * sizes.length)];
    this.studentPokemon.look = looks[Math.floor(Math.random() * looks.length)];
    this.studentPokemon.color = colors[Math.floor(Math.random() * colors.length)];
    this.studentPokemon.features = features[Math.floor(Math.random() * features.length)];

    // 2-3 random abilities
    const shuffledAbs = [...LESSON_DATA.abilities].sort(() => 0.5 - Math.random());
    this.studentPokemon.abilities = [shuffledAbs[0].id, shuffledAbs[1].id];

    sounds.playSelect();
    this.syncCreatorUI();
    this.updateCreatorPreview();
  }

  syncCreatorUI() {
    // Sync archetype pills
    document.querySelectorAll('#creatorArchetypePills .choice-pill').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-val') === this.studentPokemon.archetype);
    });
    // Sync size pills
    document.querySelectorAll('#creatorSizePills .choice-pill').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-val') === this.studentPokemon.size);
    });
    // Sync look pills
    document.querySelectorAll('#creatorLookPills .choice-pill').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-val') === this.studentPokemon.look);
    });
    // Sync color pills
    document.querySelectorAll('#creatorColorPills .choice-pill').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-val') === this.studentPokemon.color);
    });
    // Sync feature pills
    document.querySelectorAll('#creatorFeaturePills .choice-pill').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-val') === this.studentPokemon.features);
    });
    // Sync abilities
    document.querySelectorAll('.creator-ab-pill').forEach(p => {
      const name = p.textContent.trim().toLowerCase();
      const has = this.studentPokemon.abilities.some(a => name.includes(a));
      p.classList.toggle('active', has);
    });
  }

  updateCreatorPreview() {
    const p = this.studentPokemon;
    document.getElementById('specArchetype').textContent = p.archetype.toUpperCase();
    document.getElementById('specAppearance').textContent = `${p.size.toUpperCase()}, ${p.look.toUpperCase()}, ${p.color.toUpperCase()}`;
    document.getElementById('specFeature').textContent = p.features.toUpperCase();
    document.getElementById('specAbilities').textContent = p.abilities.join(', ').toUpperCase();
    document.getElementById('creatorAbilityCount').textContent = `${p.abilities.length}/4`;

    const modelImg = creatures.selectModelImage(p.archetype, p.abilities, p.look, p.size);
    const previewImg = document.getElementById('creatorPreviewImg');
    if (previewImg) {
      previewImg.src = modelImg;
      previewImg.style = creatures.getColorFilter(p.color);
    }
  }

  /* ==========================================================================
     SCREEN 9: DRAMATIC 3-2-1 REVEAL
     ========================================================================== */
  start321Reveal() {
    const countdownBox = document.getElementById('revealCountdownPhase');
    const resultBox = document.getElementById('revealResultPhase');
    const countNum = document.getElementById('countdownNumber');

    countdownBox.classList.remove('hidden');
    resultBox.classList.add('hidden');

    let count = 3;
    countNum.textContent = count;
    sounds.playCountdown(count);

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        countNum.textContent = count;
        sounds.playCountdown(count);
      } else {
        clearInterval(timer);
        countdownBox.classList.add('hidden');
        resultBox.classList.remove('hidden');

        // Create the Pokémon object
        this.createdCreatureObj = creatures.create(this.studentPokemon);
        sounds.playRevealBoom();
        sounds.playCelebration();

        document.getElementById('revealedName').textContent = this.createdCreatureObj.name.toUpperCase();
        document.getElementById('revealedTraits').textContent =
          `${this.studentPokemon.size.toUpperCase()} • ${this.studentPokemon.color.toUpperCase()} • ${this.studentPokemon.look.toUpperCase()} • ${this.studentPokemon.archetype.toUpperCase()}`;

        document.getElementById('revealStageViewport').innerHTML = this.createdCreatureObj.renderCardHTML();

        const badgeWrap = document.getElementById('revealedAbilitiesBadges');
        badgeWrap.innerHTML = '';
        this.studentPokemon.abilities.forEach(ab => {
          badgeWrap.innerHTML += `<span class="badge-ab-pill">⚡ Can ${ab}</span>`;
        });
      }
    }, 1000);

    document.getElementById('btnProceedToSpeaking').addEventListener('click', () => {
      sounds.playClick();
      this.goToStage(9);
    });
  }

  /* ==========================================================================
     SCREEN 10: SPEAKING CHALLENGE
     ========================================================================== */
  setupSpeakingScreen() {
    document.getElementById('btnSpeakLine1').addEventListener('click', () => {
      sounds.speak(document.getElementById('speechLine1').textContent);
    });
    document.getElementById('btnSpeakLine2').addEventListener('click', () => {
      sounds.speak(document.getElementById('speechLine2').textContent);
    });
    document.getElementById('btnSpeakLine3').addEventListener('click', () => {
      sounds.speak(document.getElementById('speechLine3').textContent);
    });
    document.getElementById('btnSpeakLine4').addEventListener('click', () => {
      sounds.speak(document.getElementById('speechLine4').textContent);
    });
    document.getElementById('btnSpeakLine5').addEventListener('click', () => {
      sounds.speak(document.getElementById('speechLine5').textContent);
    });

    document.getElementById('btnSpeakFullSpeech').addEventListener('click', () => {
      this.speakFullPokemonDescription();
    });

    document.getElementById('btnAwardSpeakingStar').addEventListener('click', () => {
      sounds.playCelebration();
      sounds.playStarPowerup();
      sounds.speak("Great English, Trainer! Gold star awarded!");
    });
  }

  prepareSpeakingChallenge() {
    if (!this.createdCreatureObj) {
      this.createdCreatureObj = creatures.create(this.studentPokemon);
    }

    const p = this.studentPokemon;
    document.getElementById('speakingCreatureName').textContent = this.createdCreatureObj.name.toUpperCase();
    document.getElementById('speakingArchetypeBadge').textContent = `${p.archetype.toUpperCase()} ARCHETYPE`;

    const img = document.getElementById('speakingCreatureImg');
    img.src = this.createdCreatureObj.image;
    img.style = creatures.getColorFilter(p.color);

    // Populate sentence frames
    document.querySelector('.slot-size').textContent = p.size;
    document.querySelector('.slot-look').textContent = p.look;
    document.querySelector('.slot-color').textContent = p.color;
    document.querySelector('.slot-feature').textContent = p.features;
    document.querySelector('.slot-ab1').textContent = p.abilities[0];
    document.querySelector('.slot-ab2').textContent = p.abilities[1] || 'jump high';

    // Pick something it CAN'T do
    const allAbIds = LESSON_DATA.abilities.map(a => a.id);
    const cantAb = allAbIds.find(a => !p.abilities.includes(a)) || 'freeze things';
    document.querySelector('.slot-cant').textContent = cantAb;
  }

  speakFullPokemonDescription() {
    const p = this.studentPokemon;
    const fullText = `My Pokémon is ${p.size} and ${p.look}. It is ${p.color}. It has ${p.features}. It can ${p.abilities[0]} and ${p.abilities[1] || 'jump'}.`;
    sounds.speak(fullText);
  }

  /* ==========================================================================
     SCREEN 11: MYSTERY POKÉMON CLASS GAME
     ========================================================================== */
  setupMysteryGame() {
    document.getElementById('btnReadMysteryLines').addEventListener('click', () => {
      const q = LESSON_DATA.mysteryClassQuestions[this.mysteryClassRound];
      if (q) sounds.speak(q.lines.join(' '));
    });
  }

  renderMysteryClassRound() {
    const q = LESSON_DATA.mysteryClassQuestions[this.mysteryClassRound];
    if (!q) {
      this.mysteryClassRound = 0;
      this.nextStage();
      return;
    }

    document.getElementById('mysteryRoundNumber').textContent = this.mysteryClassRound + 1;
    const linesContainer = document.getElementById('mysteryLinesContainer');
    linesContainer.innerHTML = '';
    q.lines.forEach(l => {
      linesContainer.innerHTML += `<div class="mystery-line">"${l}"</div>`;
    });

    document.getElementById('mysteryFeedbackMessage').textContent = 'Listen carefully and tap your guess!';

    const choicesContainer = document.getElementById('mysteryChoicesGrid');
    choicesContainer.innerHTML = '';

    q.options.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'mystery-choice-card';
      card.innerHTML = `
        <img src="${opt.image}" alt="${opt.name}">
        <span>${opt.name}</span>
      `;

      card.addEventListener('click', () => {
        if (opt.id === q.correctId) {
          card.classList.add('correct');
          sounds.playCorrect();
          document.getElementById('mysteryFeedbackMessage').textContent = `🎉 EXCELLENT! That is ${opt.name}!`;
          sounds.speak(`Excellent! It is ${opt.name}!`);

          setTimeout(() => {
            this.mysteryClassRound++;
            if (this.mysteryClassRound < LESSON_DATA.mysteryClassQuestions.length) {
              this.renderMysteryClassRound();
            } else {
              this.mysteryClassRound = 0;
              this.nextStage();
            }
          }, 2000);
        } else {
          card.classList.add('wrong');
          sounds.playWrong();
          document.getElementById('mysteryFeedbackMessage').textContent = `NOPE! Listen again!`;
          setTimeout(() => card.classList.remove('wrong'), 700);
        }
      });

      choicesContainer.appendChild(card);
    });
  }

  /* ==========================================================================
     SCREEN 12: FINAL BOSS CHALLENGE
     ========================================================================== */
  setupBossChallenge() {
    document.getElementById('btnBossConfirmStep').addEventListener('click', () => {
      this.confirmBossStep();
    });
  }

  initBossChallenge() {
    this.bossStars = 0;
    this.bossStep = 1;
    this.updateBossStars();

    const sprite = document.getElementById('bossCreatureImg');
    sprite.className = 'boss-sprite boss-shadow-mode';
    document.getElementById('bossName').textContent = 'SHADOW TITAN';
    document.getElementById('bossName').style.color = '#ef4444';

    this.renderBossStepChips();
  }

  updateBossStars() {
    const stars = document.querySelectorAll('#bossStarRating .star');
    stars.forEach((s, idx) => {
      s.classList.toggle('earned', idx < this.bossStars);
    });
    document.getElementById('bossStarCounterLabel').textContent = `TRAINER LEVEL: ${this.bossStars} / 5 STARS`;
  }

  renderBossStepChips() {
    const grid = document.getElementById('bossChipsGrid');
    grid.innerHTML = '';
    const prompt = document.getElementById('bossPhasePrompt');
    const badge = document.getElementById('bossPhaseBadge');

    if (this.bossStep === 1) {
      badge.textContent = 'STEP 1 / 4';
      prompt.textContent = 'Touch 2 words to describe its APPEARANCE!';
      ['big', 'small', 'strong', 'cute', 'tall', 'scary'].forEach(word => {
        grid.appendChild(this.createBossChip(word));
      });
    } else if (this.bossStep === 2) {
      badge.textContent = 'STEP 2 / 4';
      prompt.textContent = 'What COLOR is the Titan?';
      ['red', 'blue', 'green', 'yellow', 'purple', 'black'].forEach(word => {
        grid.appendChild(this.createBossChip(word));
      });
    } else if (this.bossStep === 3) {
      badge.textContent = 'STEP 3 / 4';
      prompt.textContent = 'What BODY FEATURE does it have?';
      ['wings', 'long ears', 'big horns', 'tiny fins'].forEach(word => {
        grid.appendChild(this.createBossChip(word));
      });
    } else if (this.bossStep === 4) {
      badge.textContent = 'STEP 4 / 4';
      prompt.textContent = 'What can it do? Choose 2 ABILITIES!';
      ['fly', 'swim', 'breathe fire', 'dig', 'freeze things', 'climb'].forEach(word => {
        grid.appendChild(this.createBossChip(word));
      });
    }
  }

  createBossChip(label) {
    const chip = document.createElement('button');
    chip.className = 'boss-chip-btn';
    chip.textContent = label.toUpperCase();
    chip.setAttribute('data-val', label);

    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      sounds.playClick();
    });

    return chip;
  }

  confirmBossStep() {
    const selected = Array.from(document.querySelectorAll('.boss-chip-btn.selected')).map(c => c.getAttribute('data-val'));

    if (this.bossStep === 1) {
      if (selected.includes('big') || selected.includes('strong') || selected.includes('tall') || selected.includes('scary')) {
        this.bossStars += 1;
        this.bossStep++;
        sounds.playBossHit();
        sounds.playStarPowerup();
        this.updateBossStars();
        this.renderBossStepChips();
        sounds.speak("Yes! It is big and strong!");
      } else {
        sounds.playWrong();
      }
    } else if (this.bossStep === 2) {
      if (selected.includes('red') || selected.includes('black')) {
        this.bossStars += 1;
        this.bossStep++;
        sounds.playBossHit();
        sounds.playStarPowerup();
        this.updateBossStars();
        this.renderBossStepChips();
        sounds.speak("Correct! It is red!");
      } else {
        sounds.playWrong();
      }
    } else if (this.bossStep === 3) {
      if (selected.includes('wings')) {
        this.bossStars += 1;
        this.bossStep++;
        sounds.playBossHit();
        sounds.playStarPowerup();
        this.updateBossStars();
        this.renderBossStepChips();
        sounds.speak("Awesome! It has wings!");
      } else {
        sounds.playWrong();
      }
    } else if (this.bossStep === 4) {
      if (selected.includes('fly') || selected.includes('breathe fire')) {
        this.bossStars = 5;
        this.updateBossStars();
        sounds.playCelebration();

        // Tame the boss!
        const sprite = document.getElementById('bossCreatureImg');
        sprite.className = 'boss-sprite boss-tamed-mode';
        document.getElementById('bossName').textContent = 'GOLDEN TITAN (TAMED!)';
        document.getElementById('bossName').style.color = '#facc15';

        sounds.speak("AMAZING! You tamed the Shadow Titan with English! You are a Master Trainer!");

        setTimeout(() => {
          this.nextStage();
        }, 3000);
      } else {
        sounds.playWrong();
      }
    }
  }

  /* ==========================================================================
     SCREEN 13: MASTER TRAINER PROFILE CARD & CERTIFICATE
     ========================================================================== */
  setupProfileCard() {
    document.getElementById('btnPrintProfileCard').addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btnRestartGameFinal').addEventListener('click', () => {
      sounds.playClick();
      this.goToStage(7); // Jump back to Character Creator for another Pokémon
    });
  }

  renderFinalProfileCard() {
    sounds.playCelebration();

    if (!this.createdCreatureObj) {
      this.createdCreatureObj = creatures.create(this.studentPokemon);
    }

    const p = this.studentPokemon;
    document.getElementById('finalPokemonName').textContent = this.createdCreatureObj.name.toUpperCase();
    document.getElementById('finalCardAppearance').textContent = `${p.size.toUpperCase()} • ${p.look.toUpperCase()} • ${p.color.toUpperCase()}`;
    document.getElementById('finalCardFeature').textContent = p.features.toUpperCase();
    document.getElementById('finalCardAbilities').textContent = p.abilities.map(a => a.toUpperCase()).join(', ');

    const allAbIds = LESSON_DATA.abilities.map(a => a.id);
    const cantAb = allAbIds.find(a => !p.abilities.includes(a)) || 'freeze things';
    document.getElementById('finalCardCant').textContent = cantAb.toUpperCase();

    const img = document.getElementById('finalCardImg');
    img.src = this.createdCreatureObj.image;
    img.style = creatures.getColorFilter(p.color);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new PokemonTrainerApp();
  window.app.init();
});
