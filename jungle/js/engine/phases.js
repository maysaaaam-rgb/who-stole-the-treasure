/**
 * 🌿 LIFE IN THE JUNGLE: THE JUNGLE RANGERS
 * Phase View Renderers for all 22 Phases
 */

import { ANIMALS, renderAnimalSVG } from '../data/animals.js';
import { ASSETS, renderEnvironmentBackdrop } from '../data/assets.js';
import { PHASES } from '../data/phases.js';
import { audio } from '../services/audio.js';
import { interaction } from '../services/interaction.js';
import { renderPredictionMachine } from './predictionMachine.js';
import { state } from './state.js';

export class PhaseManager {
  constructor(containerElement) {
    this.container = containerElement;
  }

  renderCurrentPhase() {
    this.container.innerHTML = '';
    const phaseData = PHASES.find(p => p.id === state.currentPhaseIndex + 1 && (p.subActivity === undefined || p.subActivity === state.currentSubActivity)) || PHASES[0];

    // Build outer layout wrapper
    const phaseWrapper = document.createElement('div');
    phaseWrapper.className = `phase-view-container phase-${phaseData.id}`;

    // Environment Backdrop
    let habitatState = 'healthy';
    if (phaseData.id === 4) habitatState = 'storm';
    else if (phaseData.id >= 5 && phaseData.id <= 8) habitatState = 'damaged';
    else if (phaseData.id >= 9 && phaseData.id <= 18) habitatState = 'recovering';
    else if (phaseData.id >= 19) habitatState = 'healthy';

    const backdropHTML = renderEnvironmentBackdrop(phaseData.habitat || 'forest', habitatState);

    phaseWrapper.innerHTML = `
      ${backdropHTML}
      <div class="phase-ui-layer">
        <!-- Top Phase Header & Instruction -->
        <div class="phase-header-card">
          <div class="header-badge-row">
            <span class="phase-category-badge">${phaseData.badge || '🌿 JUNGLE ADVENTURE'}</span>
            <span class="phase-title-text">${phaseData.title}</span>
          </div>
          <div class="phase-instruction-box">
            <button class="btn-replay-narration" title="Hear instruction again">🔊</button>
            <p class="phase-instruction-text">${phaseData.instruction}</p>
          </div>
        </div>

        <!-- Main Interactive Content Stage -->
        <div class="phase-stage-content" id="phase-stage-content"></div>

        <!-- Bottom Dialogue & Consequence Banner -->
        <div class="phase-bottom-bar">
          <div class="phase-feedback-box" id="phase-feedback-box">
            <span class="feedback-icon">🌿</span>
            <span class="feedback-text">${phaseData.narration}</span>
          </div>
          <div class="phase-nav-actions">
            <button class="btn-prev-stage ${state.currentPhaseIndex === 0 && state.currentSubActivity === 1 ? 'hidden' : ''}">◀ Back</button>
            <button class="btn-next-stage pulse-glow">Next ▶</button>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(phaseWrapper);

    // Bind Navigation & Audio
    const nextBtn = phaseWrapper.querySelector('.btn-next-stage');
    const prevBtn = phaseWrapper.querySelector('.btn-prev-stage');
    const replayBtn = phaseWrapper.querySelector('.btn-replay-narration');
    const feedbackText = phaseWrapper.querySelector('.feedback-text');

    nextBtn.addEventListener('pointerdown', () => {
      audio.playTap();
      state.nextPhase();
    });

    prevBtn.addEventListener('pointerdown', () => {
      audio.playTap();
      state.prevPhase();
    });

    replayBtn.addEventListener('pointerdown', () => {
      audio.playTap();
      audio.speak(phaseData.narration, feedbackText);
    });

    // Auto speak narration at stage start
    setTimeout(() => {
      audio.speak(phaseData.narration, feedbackText);
    }, 400);

    // Mount specific stage interactive logic
    const stageContent = phaseWrapper.querySelector('#phase-stage-content');
    this.mountStageSpecificView(phaseData, stageContent, feedbackText, nextBtn);
  }

  mountStageSpecificView(phaseData, stageEl, feedbackEl, nextBtn) {
    switch (phaseData.type) {
      case 'meet_animals':
        this.renderMeetAnimals(phaseData, stageEl, feedbackEl);
        break;
      case 'find_animal':
        this.renderFindAnimal(phaseData, stageEl, feedbackEl);
        break;
      case 'animal_needs':
        this.renderAnimalNeeds(phaseData, stageEl, feedbackEl);
        break;
      case 'habitats_match':
        this.renderHabitatsMatch(phaseData, stageEl, feedbackEl);
        break;
      case 'shelter_match':
        this.renderShelterMatch(phaseData, stageEl, feedbackEl);
        break;
      case 'food_match':
        this.renderFoodMatch(phaseData, stageEl, feedbackEl);
        break;
      case 'predator_prey':
        this.renderPredatorPrey(phaseData, stageEl, feedbackEl);
        break;
      case 'food_chain_builder':
        this.renderFoodChainBuilder(phaseData, stageEl, feedbackEl);
        break;
      case 'habitat_concept':
        this.renderHabitatConcept(phaseData, stageEl, feedbackEl);
        break;
      case 'vocab_review':
        this.renderVocabReview(phaseData, stageEl, feedbackEl);
        break;
      case 'story_intro':
        this.renderStoryIntro(phaseData, stageEl, feedbackEl);
        break;
      case 'storm_cinematic':
        this.renderStormCinematic(phaseData, stageEl, feedbackEl);
        break;
      case 'ranger_detective':
        this.renderRangerDetective(phaseData, stageEl, feedbackEl);
        break;
      case 'suki_rescue':
        this.renderSukiRescue(phaseData, stageEl, feedbackEl);
        break;
      case 'rico_rescue':
        this.renderRicoRescue(phaseData, stageEl, feedbackEl);
        break;
      case 'poppy_pond':
        this.renderPoppyPond(phaseData, stageEl, feedbackEl);
        break;
      case 'boris_food':
        this.renderBorisFood(phaseData, stageEl, feedbackEl);
        break;
      case 'feed_animals':
        this.renderFeedAnimals(phaseData, stageEl, feedbackEl);
        break;
      case 'story_sequencing':
        this.renderStorySequencing(phaseData, stageEl, feedbackEl);
        break;
      case 'cause_effect_plants':
        this.renderCauseEffectPlants(phaseData, stageEl, feedbackEl);
        break;
      case 'food_chain_challenge':
        this.renderFoodChainChallenge(phaseData, stageEl, feedbackEl);
        break;
      case 'web_of_life':
        this.renderWebOfLife(phaseData, stageEl, feedbackEl);
        break;
      case 'prediction_machine':
        this.renderPredictionMachineStage(phaseData, stageEl, feedbackEl);
        break;
      case 'before_after':
        this.renderBeforeAfter(phaseData, stageEl, feedbackEl);
        break;
      case 'emergency_simulator':
        this.renderEmergencySimulator(phaseData, stageEl, feedbackEl);
        break;
      case 'crisis_status':
        this.renderCrisisStatus(phaseData, stageEl, feedbackEl);
        break;
      case 'full_restoration':
        this.renderFullRestoration(phaseData, stageEl, feedbackEl);
        break;
      case 'celebration':
        this.renderCelebration(phaseData, stageEl, feedbackEl);
        break;
      case 'final_prediction':
        this.renderFinalPrediction(phaseData, stageEl, feedbackEl);
        break;
      case 'ranger_report':
        this.renderRangerReport(phaseData, stageEl, feedbackEl);
        break;
      default:
        stageEl.innerHTML = `<div class="placeholder-stage">Stage content ready</div>`;
    }
  }

  // ==========================================================
  // SPECIFIC PHASE VIEW IMPLEMENTATIONS
  // ==========================================================

  // Phase 1 Activity 1: Meet the Animals
  renderMeetAnimals(data, stage, feedback) {
    stage.innerHTML = `
      <div class="meet-animals-grid">
        ${data.animals.map(id => {
          const a = ANIMALS[id];
          return `
            <div class="animal-meet-card" data-animal="${id}">
              <div class="animal-avatar">${renderAnimalSVG(id, 'happy', 110, 110)}</div>
              <div class="animal-name-badge">${a.name} the ${a.species}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    stage.querySelectorAll('.animal-meet-card').forEach(card => {
      card.addEventListener('pointerdown', () => {
        audio.playSuccess();
        const animalId = card.dataset.animal;
        const sentence = data.targetSentences[animalId];
        card.classList.add('jump-bounce');
        setTimeout(() => card.classList.remove('jump-bounce'), 600);
        feedback.innerHTML = `<strong>${ANIMALS[animalId].title}</strong>: "${sentence}"`;
        audio.speak(sentence, feedback);
      });
    });
  }

  // Phase 1 Activity 2: Find the Animal!
  renderFindAnimal(data, stage, feedback) {
    let currentRoundIdx = 0;
    const renderRound = () => {
      const round = data.rounds[currentRoundIdx];
      stage.innerHTML = `
        <div class="find-animal-box">
          <div class="find-prompt-banner">
            <span class="search-icon">🔍</span>
            <span class="search-target-text">${round.prompt}</span>
          </div>
          <div class="find-scene-canvas">
            <div class="hidden-target-animal" data-target="${round.target}">
              ${renderAnimalSVG(round.target, 'happy', 120, 120)}
            </div>
          </div>
        </div>
      `;

      const targetEl = stage.querySelector('.hidden-target-animal');
      targetEl.addEventListener('pointerdown', () => {
        audio.playSuccess();
        targetEl.classList.add('sparkle-glow', 'jump-bounce');
        feedback.textContent = `You found the ${ANIMALS[round.target].species}! Great job!`;
        audio.speak(feedback.textContent, feedback);

        setTimeout(() => {
          if (currentRoundIdx < data.rounds.length - 1) {
            currentRoundIdx++;
            renderRound();
          } else {
            feedback.textContent = 'Awesome Ranger skills! All animals found!';
            audio.speak(feedback.textContent, feedback);
          }
        }, 2000);
      });
    };
    renderRound();
  }

  // Phase 1 Activity 3: What Does It Need?
  renderAnimalNeeds(data, stage, feedback) {
    let roundIdx = 0;
    const renderRound = () => {
      const r = data.rounds[roundIdx];
      const anim = ANIMALS[r.animal];

      stage.innerHTML = `
        <div class="animal-needs-container">
          <div class="needs-character-view">
            <div class="needs-animal-render">${renderAnimalSVG(r.animal, r.emotion, 170, 170)}</div>
            <div class="needs-speech-bubble">${r.question}</div>
          </div>
          <div class="needs-options-row">
            ${r.options.map(opt => `
              <button class="btn-need-card" data-need="${opt}">
                ${ASSETS.needs[opt].svg}
                <span class="need-label">${ASSETS.needs[opt].name}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      stage.querySelectorAll('.btn-need-card').forEach(btn => {
        btn.addEventListener('pointerdown', () => {
          const chosen = btn.dataset.need;
          if (chosen === r.targetNeed) {
            audio.playSuccess();
            if (chosen === 'water') audio.playWaterDrink();
            if (chosen === 'food') audio.playAnimalChew();

            btn.classList.add('sparkle-glow');
            stage.querySelector('.needs-animal-render').innerHTML = renderAnimalSVG(r.animal, r.consequenceEmotion, 170, 170);
            feedback.textContent = r.consequenceSentence;
            audio.speak(r.consequenceSentence, feedback);

            setTimeout(() => {
              if (roundIdx < data.rounds.length - 1) {
                roundIdx++;
                renderRound();
              }
            }, 2500);
          } else {
            audio.playGentleRetry();
            btn.classList.add('shake-error');
            setTimeout(() => btn.classList.remove('shake-error'), 500);
          }
        });
      });
    };
    renderRound();
  }

  // Phase 1 Activity 4: Where Does It Live?
  renderHabitatsMatch(data, stage, feedback) {
    stage.innerHTML = `
      <div class="habitat-match-grid">
        <div class="match-column animals-col">
          <div class="col-title">1. Tap Animal:</div>
          <div class="match-items-stack">
            ${data.pairs.map(p => `
              <div class="match-source-card" data-animal="${p.animal}">
                ${renderAnimalSVG(p.animal, 'happy', 80, 80)}
                <span>${ANIMALS[p.animal].name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="match-column habitats-col">
          <div class="col-title">2. Tap Habitat:</div>
          <div class="match-items-stack">
            ${['pond', 'river', 'mountain', 'forest'].map(h => `
              <div class="match-target-habitat-card" data-habitat="${h}">
                <span class="hab-badge">${ASSETS.habitats[h].badgeIcon}</span>
                <span class="hab-name">${ASSETS.habitats[h].name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    let selectedAnimal = null;
    let selectedEl = null;

    stage.querySelectorAll('.match-source-card').forEach(card => {
      card.addEventListener('pointerdown', () => {
        audio.playTap();
        stage.querySelectorAll('.match-source-card').forEach(c => c.classList.remove('tap-selected'));
        card.classList.add('tap-selected');
        selectedAnimal = card.dataset.animal;
        selectedEl = card;
      });
    });

    stage.querySelectorAll('.match-target-habitat-card').forEach(target => {
      target.addEventListener('pointerdown', () => {
        if (!selectedAnimal) {
          audio.playGentleRetry();
          return;
        }
        const targetHab = target.dataset.habitat;
        const correctPair = data.pairs.find(p => p.animal === selectedAnimal);

        if (correctPair && correctPair.targetHabitat === targetHab) {
          audio.playSuccess();
          target.classList.add('sparkle-glow', 'matched');
          selectedEl.classList.add('source-used');
          feedback.textContent = correctPair.text;
          audio.speak(correctPair.text, feedback);
          selectedAnimal = null;
          selectedEl = null;
        } else {
          audio.playGentleRetry();
          target.classList.add('shake-error');
          setTimeout(() => target.classList.remove('shake-error'), 500);
        }
      });
    });
  }

  // Phase 1 Activity 5: Animal Homes
  renderShelterMatch(data, stage, feedback) {
    stage.innerHTML = `
      <div class="shelter-match-view">
        <div class="sources-panel">
          ${data.items.map(item => `
            <div class="shelter-animal-chip" data-animal="${item.animal}" data-shelter="${item.shelter}">
              ${renderAnimalSVG(item.animal, 'happy', 75, 75)}
              <span>${ANIMALS[item.animal].species}</span>
            </div>
          `).join('')}
        </div>

        <div class="targets-panel">
          ${data.items.map(item => `
            <div class="shelter-target-plate" data-shelter="${item.shelter}">
              ${ASSETS.shelters[item.shelter].svg}
              <span class="shelter-name-tag">${item.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    let selected = null;
    let selectedEl = null;

    stage.querySelectorAll('.shelter-animal-chip').forEach(chip => {
      chip.addEventListener('pointerdown', () => {
        audio.playTap();
        stage.querySelectorAll('.shelter-animal-chip').forEach(c => c.classList.remove('tap-selected'));
        chip.classList.add('tap-selected');
        selected = chip.dataset.shelter;
        selectedEl = chip;
      });
    });

    stage.querySelectorAll('.shelter-target-plate').forEach(plate => {
      plate.addEventListener('pointerdown', () => {
        if (!selected) return;
        if (plate.dataset.shelter === selected) {
          audio.playSuccess();
          plate.classList.add('sparkle-glow', 'matched');
          selectedEl.classList.add('source-used');
          const matchedItem = data.items.find(i => i.shelter === selected);
          feedback.textContent = matchedItem.sentence;
          audio.speak(matchedItem.sentence, feedback);
          selected = null;
          selectedEl = null;
        } else {
          audio.playGentleRetry();
          plate.classList.add('shake-error');
          setTimeout(() => plate.classList.remove('shake-error'), 500);
        }
      });
    });
  }

  // Phase 1 Activity 6: Food
  renderFoodMatch(data, stage, feedback) {
    let roundIdx = 0;
    const renderRound = () => {
      const r = data.rounds[roundIdx];
      const anim = ANIMALS[r.animal];

      stage.innerHTML = `
        <div class="food-match-stage">
          <div class="food-animal-plate">
            ${renderAnimalSVG(r.animal, 'hungry', 160, 160)}
            <div class="food-prompt-text">${r.prompt}</div>
          </div>
          <div class="food-choices-row">
            ${[r.correctFood, ...r.wrongFoods].sort().map(foodKey => `
              <button class="btn-food-choice" data-food="${foodKey}">
                ${ASSETS.foods[foodKey] ? ASSETS.foods[foodKey].svg : '🍎'}
                <span class="food-choice-title">${ASSETS.foods[foodKey] ? ASSETS.foods[foodKey].name : foodKey}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      stage.querySelectorAll('.btn-food-choice').forEach(btn => {
        btn.addEventListener('pointerdown', () => {
          if (btn.dataset.food === r.correctFood) {
            audio.playSuccess();
            audio.playAnimalChew();
            btn.classList.add('sparkle-glow');
            stage.querySelector('.food-animal-plate').innerHTML = `
              ${renderAnimalSVG(r.animal, 'eating', 160, 160)}
              <div class="food-prompt-text">Munch! Yummy!</div>
            `;
            feedback.textContent = `${anim.title} eats ${ASSETS.foods[r.correctFood].name}!`;
            audio.speak(feedback.textContent, feedback);

            setTimeout(() => {
              if (roundIdx < data.rounds.length - 1) {
                roundIdx++;
                renderRound();
              }
            }, 2500);
          } else {
            audio.playGentleRetry();
            btn.classList.add('shake-error');
            setTimeout(() => btn.classList.remove('shake-error'), 500);
          }
        });
      });
    };
    renderRound();
  }

  // Phase 1 Activity 7: Predator and Prey
  renderPredatorPrey(data, stage, feedback) {
    let scIdx = 0;
    const renderScenario = () => {
      const s = data.scenarios[scIdx];
      stage.innerHTML = `
        <div class="predator-prey-duel">
          <div class="role-card predator-card" data-role="predator">
            <span class="role-badge">PREDATOR 🦁</span>
            ${renderAnimalSVG(s.predator, 'excited', 140, 140)}
            <div class="role-name">${ANIMALS[s.predator].name} the ${ANIMALS[s.predator].species}</div>
            <div class="role-action">HUNTS!</div>
          </div>

          <div class="vs-divider">➔</div>

          <div class="role-card prey-card" data-role="prey">
            <span class="role-badge">PREY 🐰</span>
            ${renderAnimalSVG(s.prey, 'scared', 140, 140)}
            <div class="role-name">${ANIMALS[s.prey].name} the ${ANIMALS[s.prey].species}</div>
            <div class="role-action">HIDES!</div>
          </div>
        </div>
      `;

      stage.querySelector('.predator-card').addEventListener('pointerdown', () => {
        audio.playTap();
        feedback.textContent = s.predatorSentence;
        audio.speak(s.predatorSentence, feedback);
      });

      stage.querySelector('.prey-card').addEventListener('pointerdown', () => {
        audio.playTap();
        feedback.textContent = s.preySentence;
        audio.speak(s.preySentence, feedback);
      });
    };
    renderScenario();
  }

  // Phase 1 Activity 8: Food Chain Builder
  renderFoodChainBuilder(data, stage, feedback) {
    const chain = data.chains[0];
    let userOrder = [];

    stage.innerHTML = `
      <div class="food-chain-builder-view">
        <div class="chain-slots-row">
          <div class="chain-slot" id="cslot-0">Slot 1: Producer 🌱</div>
          <div class="chain-arrow">➔</div>
          <div class="chain-slot" id="cslot-1">Slot 2: Herbivore 🐰</div>
          <div class="chain-arrow">➔</div>
          <div class="chain-slot" id="cslot-2">Slot 3: Predator 🦊</div>
        </div>

        <div class="chain-items-deck">
          ${chain.items.map(item => `
            <button class="btn-chain-item" data-id="${item.id}">
              <span class="item-icon">${item.icon}</span>
              <span class="item-name">${item.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.btn-chain-item').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        if (btn.classList.contains('used')) return;
        audio.playTap();

        const slotIndex = userOrder.length;
        if (slotIndex < 3) {
          const expected = ['plant', 'rabbit', 'fox'][slotIndex];
          if (btn.dataset.id === expected) {
            audio.playSuccess();
            btn.classList.add('used');
            userOrder.push(btn.dataset.id);
            const slot = stage.querySelector(`#cslot-${slotIndex}`);
            slot.textContent = btn.textContent;
            slot.classList.add('filled', 'sparkle-glow');

            if (userOrder.length === 3) {
              feedback.textContent = chain.sentence;
              audio.speak(chain.sentence, feedback);
            }
          } else {
            audio.playGentleRetry();
            btn.classList.add('shake-error');
            setTimeout(() => btn.classList.remove('shake-error'), 500);
          }
        }
      });
    });
  }

  // Phase 1 Activity 9: Habitat Concept
  renderHabitatConcept(data, stage, feedback) {
    let collected = new Set();
    const items = [
      { id: 'food', label: 'Nutritious Food 🍎', valid: true },
      { id: 'water', label: 'Clean Water 💧', valid: true },
      { id: 'shelter', label: 'Safe Shelter 🏠', valid: true },
      { id: 'space', label: 'Natural Space 🌳', valid: true },
      { id: 'plastic_toys', label: 'Plastic Toys 🧸', valid: false }
    ];

    stage.innerHTML = `
      <div class="habitat-concept-view">
        <div class="concept-globe-center">
          <div class="globe-icon">🌍</div>
          <div class="globe-title">COMPLETE HABITAT</div>
          <div class="collected-count">Needs 4 Elements</div>
        </div>
        <div class="concept-elements-grid">
          ${items.map(item => `
            <button class="btn-concept-item" data-id="${item.id}">
              ${item.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.btn-concept-item').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        const id = btn.dataset.id;
        const itemObj = items.find(i => i.id === id);

        if (itemObj.valid) {
          audio.playSuccess();
          btn.classList.add('sparkle-glow', 'used');
          collected.add(id);
          stage.querySelector('.collected-count').textContent = `Collected ${collected.size} / 4 elements!`;

          if (collected.size === 4) {
            feedback.textContent = data.definition;
            audio.speak(data.definition, feedback);
          }
        } else {
          audio.playGentleRetry();
          btn.classList.add('shake-error');
          setTimeout(() => btn.classList.remove('shake-error'), 500);
        }
      });
    });
  }

  // Phase 2: Visual Vocabulary Review
  renderVocabReview(data, stage, feedback) {
    stage.innerHTML = `
      <div class="vocab-review-deck">
        ${data.cards.map(c => `
          <div class="vocab-card" data-word="${c.word}">
            <span class="vocab-icon">${c.icon}</span>
            <span class="vocab-word">${c.word}</span>
          </div>
        `).join('')}
      </div>
    `;

    stage.querySelectorAll('.vocab-card').forEach(card => {
      card.addEventListener('pointerdown', () => {
        audio.playSuccess();
        const word = card.dataset.word;
        const cardObj = data.cards.find(c => c.word === word);
        card.classList.add('sparkle-glow', 'jump-bounce');
        setTimeout(() => card.classList.remove('jump-bounce'), 600);
        feedback.innerHTML = `<strong>${cardObj.word}</strong>: "${cardObj.sentence}"`;
        audio.speak(cardObj.sentence, feedback);
      });
    });
  }

  // Phase 3: Story Begins
  renderStoryIntro(data, stage, feedback) {
    stage.innerHTML = `
      <div class="story-intro-card">
        <div class="ranger-badge-large">🛡️</div>
        <h1 class="story-main-title">LIFE IN THE JUNGLE</h1>
        <h2 class="story-sub-title">THE JUNGLE RANGERS</h2>
        <div class="healthy-animals-row">
          ${renderAnimalSVG('squirrel', 'happy', 90, 90)}
          ${renderAnimalSVG('frog', 'happy', 90, 90)}
          ${renderAnimalSVG('raccoon', 'happy', 90, 90)}
          ${renderAnimalSVG('bear', 'happy', 90, 90)}
        </div>
        <div class="ranger-motto">"Explore • Protect • Restore"</div>
      </div>
    `;
  }

  // Phase 4: The Great Storm
  renderStormCinematic(data, stage, feedback) {
    audio.playThunder();
    stage.innerHTML = `
      <div class="storm-cinematic-view">
        <div class="storm-alert-box">
          <div class="storm-icon-big">🌩️⚡🌧️</div>
          <h1 class="storm-title">A BIG STORM!</h1>
          <p class="storm-desc">Dark clouds, heavy wind, and lightning roll over the jungle!</p>
        </div>
        <div class="scared-animals-row">
          ${renderAnimalSVG('squirrel', 'scared', 110, 110)}
          ${renderAnimalSVG('frog', 'worried', 110, 110)}
          ${renderAnimalSVG('raccoon', 'scared', 110, 110)}
        </div>
      </div>
    `;
  }

  // Phase 5: Ranger Detective
  renderRangerDetective(data, stage, feedback) {
    let cluesFound = 0;
    stage.innerHTML = `
      <div class="detective-investigation-view">
        <div class="detective-hud">
          <span class="hud-badge">🔍 Clues Found: <strong id="clue-counter">0 / 4</strong></span>
        </div>
        <div class="detective-hotspots-canvas">
          ${data.clues.map(c => `
            <div class="clue-hotspot" data-id="${c.id}" style="left: ${c.x}%; top: ${c.y}%">
              <span class="hotspot-pulse"></span>
              <span class="hotspot-icon">${c.icon}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.clue-hotspot').forEach(spot => {
      spot.addEventListener('pointerdown', () => {
        if (spot.classList.contains('found')) return;
        audio.playSuccess();
        spot.classList.add('found', 'sparkle-glow');
        cluesFound++;
        stage.querySelector('#clue-counter').textContent = `${cluesFound} / 4`;

        const clueObj = data.clues.find(c => c.id === spot.dataset.id);
        feedback.innerHTML = `<strong>${clueObj.title}</strong>: ${clueObj.text}`;
        audio.speak(clueObj.text, feedback);
      });
    });
  }

  // Phase 6: Suki Rescue
  renderSukiRescue(data, stage, feedback) {
    let stepIdx = 0;
    const renderStep = () => {
      const step = data.steps[stepIdx];
      stage.innerHTML = `
        <div class="rescue-stage-view">
          <div class="rescue-hero-box">
            ${renderAnimalSVG('squirrel', stepIdx === data.steps.length - 1 ? 'happy' : 'worried', 160, 160)}
            <div class="rescue-speech">Help Suki fix her tree home!</div>
          </div>
          <div class="rescue-action-area">
            <button class="btn-rescue-action pulse-glow">
              <span class="action-icon">${step.icon}</span>
              <span>${step.prompt}</span>
            </button>
          </div>
        </div>
      `;

      stage.querySelector('.btn-rescue-action').addEventListener('pointerdown', () => {
        audio.playSuccess();
        if (stepIdx < data.steps.length - 1) {
          stepIdx++;
          renderStep();
        } else {
          feedback.textContent = data.outcomeSentence;
          audio.speak(data.outcomeSentence, feedback);
        }
      });
    };
    renderStep();
  }

  // Phase 7: Rico Rescue
  renderRicoRescue(data, stage, feedback) {
    let cleared = 0;
    stage.innerHTML = `
      <div class="river-cleanup-view">
        <div class="cleanup-character">
          ${renderAnimalSVG('raccoon', 'worried', 140, 140)}
          <div class="cleanup-bubble">The river has mud & debris! Tap them!</div>
        </div>
        <div class="cleanup-river-zone">
          ${data.debrisItems.map(d => `
            <button class="btn-debris-item" data-id="${d.id}" style="left: ${d.x}%; top: ${d.y}%">
              ${d.icon}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.btn-debris-item').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        if (btn.classList.contains('cleaned')) return;
        audio.playSuccess();
        btn.classList.add('cleaned');
        cleared++;

        if (cleared === data.debrisItems.length) {
          stage.querySelector('.cleanup-character').innerHTML = `
            ${renderAnimalSVG('raccoon', 'happy', 140, 140)}
            <div class="cleanup-bubble">The river is clean! Thank you!</div>
          `;
          feedback.textContent = data.outcomeSentence;
          audio.speak(data.outcomeSentence, feedback);
        }
      });
    });
  }

  // Phase 8: Poppy Pond
  renderPoppyPond(data, stage, feedback) {
    stage.innerHTML = `
      <div class="poppy-pond-stage">
        <div class="poppy-view">
          ${renderAnimalSVG('frog', 'worried', 150, 150)}
          <div class="poppy-prediction-bubble">${data.prediction.question}</div>
        </div>
        <div class="poppy-prediction-options">
          ${data.prediction.options.map((opt, idx) => `
            <button class="btn-pred-choice" data-index="${idx}">
              ${opt.text}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.btn-pred-choice').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        const idx = parseInt(btn.dataset.index);
        const opt = data.prediction.options[idx];

        if (opt.correct) {
          audio.playSuccess();
          btn.classList.add('sparkle-glow');
          stage.innerHTML = `
            <div class="poppy-action-view">
              ${renderAnimalSVG('frog', 'excited', 160, 160)}
              <button class="btn-unblock-stream pulse-glow">
                🌊 Tap to unblock fresh water stream!
              </button>
            </div>
          `;
          stage.querySelector('.btn-unblock-stream').addEventListener('pointerdown', () => {
            audio.playSuccess();
            audio.playWaterDrink();
            feedback.textContent = data.outcomeSentence;
            audio.speak(data.outcomeSentence, feedback);
          });
        } else {
          audio.playGentleRetry();
          btn.classList.add('shake-error');
          setTimeout(() => btn.classList.remove('shake-error'), 500);
        }
      });
    });
  }

  // Phase 9: Boris Food
  renderBorisFood(data, stage, feedback) {
    let step = 0;
    const renderStep = () => {
      const s = data.steps[step];
      stage.innerHTML = `
        <div class="boris-food-view">
          <div class="boris-character-plate">
            ${renderAnimalSVG('bear', step === 2 ? 'happy' : 'hungry', 160, 160)}
            <div class="boris-status">Boris needs wild berries & river fish!</div>
          </div>
          <button class="btn-boris-action pulse-glow">
            <span>${s.icon}</span> ${s.prompt}
          </button>
        </div>
      `;

      stage.querySelector('.btn-boris-action').addEventListener('pointerdown', () => {
        audio.playSuccess();
        if (step < data.steps.length - 1) {
          step++;
          renderStep();
        } else {
          feedback.textContent = data.outcomeSentence;
          audio.speak(data.outcomeSentence, feedback);
        }
      });
    };
    renderStep();
  }

  // Phase 10: Feed the Animals
  renderFeedAnimals(data, stage, feedback) {
    stage.innerHTML = `
      <div class="feed-animals-grid">
        ${data.animalsToFeed.map(a => `
          <div class="feed-animal-card" data-animal="${a.animal}" data-food="${a.targetFood}">
            ${renderAnimalSVG(a.animal, 'hungry', 110, 110)}
            <div class="animal-feed-label">${ANIMALS[a.animal].name}</div>
            <div class="feed-drop-slot">Drop Food Here</div>
          </div>
        `).join('')}
      </div>

      <div class="food-bank-bar">
        ${data.animalsToFeed.map(a => `
          <button class="btn-food-feed-item" data-food="${a.targetFood}">
            ${ASSETS.foods[a.targetFood] ? ASSETS.foods[a.targetFood].svg : '🍎'}
            <span>${a.label}</span>
          </button>
        `).join('')}
      </div>
    `;

    let selectedFood = null;
    let selectedEl = null;

    stage.querySelectorAll('.btn-food-feed-item').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        audio.playTap();
        stage.querySelectorAll('.btn-food-feed-item').forEach(b => b.classList.remove('tap-selected'));
        btn.classList.add('tap-selected');
        selectedFood = btn.dataset.food;
        selectedEl = btn;
      });
    });

    stage.querySelectorAll('.feed-animal-card').forEach(card => {
      card.addEventListener('pointerdown', () => {
        if (!selectedFood) return;
        if (card.dataset.food === selectedFood) {
          audio.playSuccess();
          audio.playAnimalChew();
          card.classList.add('sparkle-glow', 'fed');
          card.querySelector('.feed-drop-slot').textContent = 'Full & Happy! ❤️';
          selectedEl.classList.add('source-used');
          selectedFood = null;
          selectedEl = null;
        } else {
          audio.playGentleRetry();
          card.classList.add('shake-error');
          setTimeout(() => card.classList.remove('shake-error'), 500);
        }
      });
    });
  }

  // Phase 11: Story Sequencing
  renderStorySequencing(data, stage, feedback) {
    let order = [];
    stage.innerHTML = `
      <div class="sequencing-view">
        <div class="sequence-slots-row">
          ${[1, 2, 3, 4, 5].map(n => `
            <div class="seq-slot" id="seq-slot-${n}">Step ${n}</div>
          `).join('')}
        </div>

        <div class="sequence-cards-deck">
          ${data.cards.map(c => `
            <button class="btn-seq-card" data-step="${c.step}">
              <span class="seq-icon">${c.icon}</span>
              <span class="seq-text">${c.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.btn-seq-card').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        if (btn.classList.contains('used')) return;
        audio.playTap();

        const currentStep = order.length + 1;
        const clickedStep = parseInt(btn.dataset.step);

        if (clickedStep === currentStep) {
          audio.playSuccess();
          btn.classList.add('used');
          order.push(clickedStep);
          const slot = stage.querySelector(`#seq-slot-${currentStep}`);
          slot.textContent = btn.querySelector('.seq-text').textContent;
          slot.classList.add('filled', 'sparkle-glow');

          if (order.length === 5) {
            feedback.textContent = 'Great job! You put the story in perfect order!';
            audio.speak(feedback.textContent, feedback);
          }
        } else {
          audio.playGentleRetry();
          btn.classList.add('shake-error');
          setTimeout(() => btn.classList.remove('shake-error'), 500);
        }
      });
    });
  }

  // Phase 12: Cause and Effect Plants
  renderCauseEffectPlants(data, stage, feedback) {
    let qIdx = 0;
    const renderQ = () => {
      const q = data.questions[qIdx];
      stage.innerHTML = `
        <div class="cause-effect-view">
          <div class="ce-question-box">${q.question}</div>
          <div class="ce-options-stack">
            ${q.options.map(opt => `
              <button class="btn-ce-option" data-correct="${opt.correct}">
                ${opt.text}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      stage.querySelectorAll('.btn-ce-option').forEach(btn => {
        btn.addEventListener('pointerdown', () => {
          if (btn.dataset.correct === 'true') {
            audio.playSuccess();
            btn.classList.add('sparkle-glow');
            feedback.textContent = q.explanation;
            audio.speak(q.explanation, feedback);

            setTimeout(() => {
              if (qIdx < data.questions.length - 1) {
                qIdx++;
                renderQ();
              }
            }, 3000);
          } else {
            audio.playGentleRetry();
            btn.classList.add('shake-error');
            setTimeout(() => btn.classList.remove('shake-error'), 500);
          }
        });
      });
    };
    renderQ();
  }

  // Phase 13: Food Chain Challenge
  renderFoodChainChallenge(data, stage, feedback) {
    stage.innerHTML = `
      <div class="food-chain-challenge-view">
        <div class="full-chain-row">
          ${data.chain.map((c, idx) => `
            <div class="chain-node" id="cnode-${c.id}">
              <div class="node-title">${c.name}</div>
              <div class="node-role">${c.role}</div>
            </div>
            ${idx < data.chain.length - 1 ? '<span class="node-arrow">➔</span>' : ''}
          `).join('')}
        </div>

        <div class="chain-scissors-action">
          <button class="btn-cut-link pulse-glow">
            ✂️ Cut the "Plants" link to see cascade effect!
          </button>
        </div>
      </div>
    `;

    stage.querySelector('.btn-cut-link').addEventListener('pointerdown', () => {
      audio.playThunder();
      stage.querySelectorAll('.chain-node').forEach(node => node.classList.add('shattered-link'));
      feedback.textContent = 'Without plants, insects lose food, frogs struggle, and owls lose prey! Everything depends on plants!';
      audio.speak(feedback.textContent, feedback);
    });
  }

  // Phase 14: Web of Life
  renderWebOfLife(data, stage, feedback) {
    stage.innerHTML = `
      <div class="web-of-life-canvas">
        <div class="nodes-constellation">
          ${data.nodes.map(n => `
            <button class="btn-web-node" data-id="${n.id}">
              ${n.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.btn-web-node').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        audio.playSuccess();
        stage.querySelectorAll('.btn-web-node').forEach(b => b.classList.remove('active-glow'));
        btn.classList.add('active-glow', 'sparkle-glow');
        const nodeObj = data.nodes.find(n => n.id === btn.dataset.id);
        feedback.textContent = nodeObj.sentence;
        audio.speak(nodeObj.sentence, feedback);
      });
    });
  }

  // Phase 15: Prediction Machine
  renderPredictionMachineStage(data, stage, feedback) {
    stage.appendChild(renderPredictionMachine(data.scenarios[0], (success) => {
      feedback.textContent = 'Awesome science prediction, Ranger!';
    }));
  }

  // Phase 16: Before & After
  renderBeforeAfter(data, stage, feedback) {
    stage.innerHTML = `
      <div class="before-after-view">
        <div class="split-side healthy-side">
          <div class="side-badge">HEALTHY ECOSYSTEM 🌿</div>
          <p>Clean water, green trees, safe shelters.</p>
        </div>
        <div class="split-side damaged-side">
          <div class="side-badge">DAMAGED ECOSYSTEM 🌧️</div>
          <p>Muddy water, fallen branches, scattered food.</p>
        </div>
      </div>
    `;
  }

  // Phase 17: Emergency Simulator
  renderEmergencySimulator(data, stage, feedback) {
    let emIdx = 0;
    const renderEm = () => {
      const em = data.emergencies[emIdx];
      stage.innerHTML = `
        <div class="emergency-card-view">
          <div class="em-title">${em.title}</div>
          <div class="em-animal-box">${renderAnimalSVG(em.animal, 'scared', 130, 130)}</div>
          <div class="em-prompt">${em.prompt}</div>
          <div class="em-choices-row">
            ${em.actionChoice.map((choice, idx) => `
              <button class="btn-em-choice" data-index="${idx}">
                ${choice}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      stage.querySelectorAll('.btn-em-choice').forEach(btn => {
        btn.addEventListener('pointerdown', () => {
          if (parseInt(btn.dataset.index) === em.correctIndex) {
            audio.playSuccess();
            btn.classList.add('sparkle-glow');
            feedback.textContent = em.result;
            audio.speak(em.result, feedback);

            setTimeout(() => {
              if (emIdx < data.emergencies.length - 1) {
                emIdx++;
                renderEm();
              }
            }, 2500);
          } else {
            audio.playGentleRetry();
            btn.classList.add('shake-error');
            setTimeout(() => btn.classList.remove('shake-error'), 500);
          }
        });
      });
    };
    renderEm();
  }

  // Phase 18: Crisis Status
  renderCrisisStatus(data, stage, feedback) {
    stage.innerHTML = `
      <div class="crisis-dashboard">
        <div class="crisis-meter-bar">
          <div class="meter-fill" style="width: 25%">ECOSYSTEM HEALTH: 25%</div>
        </div>
        <div class="zones-status-grid">
          ${data.zones.map(z => `
            <div class="zone-card">
              <span class="zone-icon">${z.icon}</span>
              <span class="zone-name">${z.name}</span>
              <span class="zone-status">${z.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Phase 19: Full Ecosystem Restoration
  renderFullRestoration(data, stage, feedback) {
    let completed = 0;
    stage.innerHTML = `
      <div class="full-restoration-view">
        <div class="resto-hud">
          <span class="hud-text">Restoration Actions: <strong id="resto-counter">0 / 5</strong></span>
        </div>
        <div class="resto-tools-deck">
          ${data.actions.map(act => `
            <button class="btn-resto-action" data-id="${act.id}">
              <span class="action-icon">${act.icon}</span>
              <span>${act.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    stage.querySelectorAll('.btn-resto-action').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        if (btn.classList.contains('restored')) return;
        audio.playSuccess();
        btn.classList.add('restored', 'sparkle-glow');
        completed++;
        state.restoreZone(btn.dataset.id);
        stage.querySelector('#resto-counter').textContent = `${completed} / 5`;

        const actObj = data.actions.find(a => a.id === btn.dataset.id);
        feedback.textContent = actObj.message;
        audio.speak(actObj.message, feedback);
      });
    });
  }

  // Phase 20: Celebration
  renderCelebration(data, stage, feedback) {
    audio.playFanfare();
    stage.innerHTML = `
      <div class="celebration-view">
        <div class="celebration-title">🌿 JUNGLE SAVED! 🌿</div>
        <div class="gold-medal-award">🥇 JUNGLE RANGER GOLD MEDAL</div>
        <div class="celebrating-animals-grid">
          ${renderAnimalSVG('squirrel', 'excited', 100, 100)}
          ${renderAnimalSVG('frog', 'happy', 100, 100)}
          ${renderAnimalSVG('raccoon', 'excited', 100, 100)}
          ${renderAnimalSVG('bear', 'happy', 100, 100)}
          ${renderAnimalSVG('rabbit', 'excited', 100, 100)}
          ${renderAnimalSVG('bird', 'excited', 100, 100)}
        </div>
      </div>
    `;
  }

  // Phase 21: Final Prediction
  renderFinalPrediction(data, stage, feedback) {
    let answered = 0;
    stage.innerHTML = `
      <div class="final-prediction-view">
        ${data.sentences.map((s, idx) => `
          <div class="future-sentence-row" data-index="${idx}">
            <div class="sentence-template">${s.template}</div>
            <div class="future-choice-buttons">
              ${s.options.map(opt => `
                <button class="btn-future-choice" data-correct="${opt === s.correct}">
                  ${opt}
                </button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    stage.querySelectorAll('.btn-future-choice').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        if (btn.dataset.correct === 'true') {
          audio.playSuccess();
          btn.classList.add('sparkle-glow', 'correct');
          answered++;
          if (answered === data.sentences.length) {
            feedback.textContent = 'All future predictions complete! The jungle will thrive!';
            audio.speak(feedback.textContent, feedback);
          }
        } else {
          audio.playGentleRetry();
          btn.classList.add('shake-error');
          setTimeout(() => btn.classList.remove('shake-error'), 500);
        }
      });
    });
  }

  // Phase 22: Final Ranger Report
  renderRangerReport(data, stage, feedback) {
    stage.innerHTML = `
      <div class="ranger-certificate-view">
        <div class="cert-border">
          <div class="cert-header">
            <span class="cert-badge">⭐ OFFICIAL JUNGLE RANGER CERTIFICATE ⭐</span>
            <h1 class="cert-title">JUNGLE DEFENDER AWARD</h1>
          </div>
          <div class="cert-prompts-list">
            ${data.prompts.map((p, idx) => `
              <div class="cert-prompt-item">
                <div class="cert-label">${p.label}</div>
                <div class="cert-options-row">
                  ${p.options.map(opt => `
                    <button class="btn-cert-option" data-correct="${opt === p.correct}">
                      ${opt}
                    </button>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    stage.querySelectorAll('.btn-cert-option').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        if (btn.dataset.correct === 'true') {
          audio.playSuccess();
          btn.classList.add('sparkle-glow', 'correct');
        } else {
          audio.playGentleRetry();
          btn.classList.add('shake-error');
          setTimeout(() => btn.classList.remove('shake-error'), 500);
        }
      });
    });
  }
}
