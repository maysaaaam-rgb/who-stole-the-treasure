/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Complete Game Controller, Interaction Engine & Word Wall Manager
   ========================================================================== */

class JungleGameEngine {
  constructor() {
    this.currentChapterIdx = 0;
    this.jungleHealth = 70;
    this.scores = { forest: 0, river: 0 };
    this.activeTurn = 'forest';
    this.selectedDraggable = null;
    this.discoveredHotspots = new Set();
    this.activeSubState = {
      whoAmIIdx: 0,
      detectiveCaseIdx: 0,
      machineRoundIdx: 0,
      emergencyMissionIdx: 0,
      emergencyStep: 1,
      finalChallengeId: 'c1',
      selectedReportAnimal: 'frog'
    };

    this.init();
  }

  init() {
    this.bindGlobalEvents();
    this.renderCurrentChapter();
    this.updateHealthBar(this.jungleHealth);
    this.setupConfetti();
  }

  // =========================================================================
  // CHAPTER NAVIGATION & RENDERING
  // =========================================================================
  goToChapter(idx) {
    if (idx < 0 || idx >= window.JUNGLE_DATA.chapters.length) return;
    this.currentChapterIdx = idx;
    this.discoveredHotspots.clear();
    this.activeSubState = {
      whoAmIIdx: 0,
      detectiveCaseIdx: 0,
      machineRoundIdx: 0,
      emergencyMissionIdx: 0,
      emergencyStep: 1,
      finalChallengeId: 'c1',
      selectedReportAnimal: 'frog'
    };
    this.renderCurrentChapter();
    window.jungleAudio.playClick();
  }

  nextChapter() {
    if (this.currentChapterIdx < window.JUNGLE_DATA.chapters.length - 1) {
      this.goToChapter(this.currentChapterIdx + 1);
    } else {
      this.renderSpeakingStudio();
    }
  }

  prevChapter() {
    if (this.currentChapterIdx > 0) {
      this.goToChapter(this.currentChapterIdx - 1);
    }
  }

  renderCurrentChapter() {
    const chapter = window.JUNGLE_DATA.chapters[this.currentChapterIdx];
    if (!chapter) return;

    // Update Top HUD
    const chapterNumEl = document.getElementById('hud-chapter-num');
    const chapterTitleEl = document.getElementById('hud-chapter-title');
    if (chapterNumEl) chapterNumEl.textContent = `Ch. ${chapter.number}`;
    if (chapterTitleEl) chapterTitleEl.textContent = chapter.title;

    // Update Narration Bar
    const dialogueEl = document.getElementById('narrator-dialogue-text');
    const speakerEl = document.getElementById('narrator-speaker-name');
    if (dialogueEl && chapter.narrator) {
      dialogueEl.innerHTML = this.formatDialogueText(chapter.narrator.text);
    }
    if (speakerEl && chapter.narrator) {
      speakerEl.textContent = chapter.narrator.speaker;
    }

    // Update Teacher HUD Drawer
    this.updateTeacherHUD(chapter);

    // Render Stage View
    const stageContainer = document.getElementById('stage-canvas-area');
    if (!stageContainer) return;

    switch (chapter.type) {
      case 'open_exploration':
        window.jungleViews.renderOpenExploration(stageContainer, chapter);
        break;
      case 'ranger_eyes_search':
        window.jungleViews.renderRangerEyes(stageContainer, chapter);
        break;
      case 'who_am_i_puzzles':
        window.jungleViews.renderWhoAmI(stageContainer, chapter, this.activeSubState.whoAmIIdx);
        break;
      case 'match_word_picture':
        window.jungleViews.renderMatchAnimal(stageContainer, chapter);
        break;
      case 'where_does_it_live':
        window.jungleViews.renderWhereDoesItLive(stageContainer, chapter);
        break;
      case 'what_needs_matching':
        window.jungleViews.renderWhereDoesItLive(stageContainer, chapter); // fallback or matching
        break;
      case 'shelter_matching':
        window.jungleViews.renderAnimalHomes(stageContainer, chapter);
        break;
      case 'visual_habitat_reveal':
        window.jungleViews.renderAnimalHomes(stageContainer, chapter);
        break;
      case 'food_diet_feeder':
        window.jungleViews.renderMatchAnimal(stageContainer, chapter);
        break;
      case 'predator_prey_interactive':
        window.jungleViews.renderPredatorPrey(stageContainer, chapter);
        break;
      case 'food_chain_sequencer':
        window.jungleViews.renderPredatorPrey(stageContainer, chapter);
        break;
      case 'ecosystem_connection_map':
        window.jungleViews.renderEcosystemMap(stageContainer, chapter);
        break;
      case 'story_preview_strip':
        window.jungleViews.renderStoryPreview(stageContainer, chapter);
        break;
      case 'storm_animation':
        stageContainer.innerHTML = `
          <div class="stage-board">
            <div class="storm-stage">
              <div class="lightning-flash" id="lightning-fx"></div>
              <div style="font-family:var(--font-display); font-size:2.4rem; color:#fca5a5; font-weight:900; margin-bottom:12px;">
                ⛈️ JUNGLE EMERGENCY ALERT! 🚨
              </div>
              <div style="font-family:var(--font-display); font-size:1.35rem; color:#f8fafc; max-width:750px;">
                A fierce storm struck Green Valley! Trees have fallen and water is dirty!
              </div>
              <div class="storm-elements-grid">
                ${chapter.damages.map(d => `
                  <div class="storm-damage-card">
                    <span class="damage-icon">${d.icon}</span>
                    <span class="damage-title">${d.title}</span>
                    <span class="damage-desc">${d.desc}</span>
                  </div>
                `).join('')}
              </div>
              <button class="hud-btn hud-btn-teacher" id="btn-start-emergency-rescue" style="margin-top:24px; font-size:1.25rem; padding:12px 28px; background:linear-gradient(135deg, #10b981, #059669); border-color:#6ee7b7;">
                <span>🛡️ START RESCUE MISSION ➔</span>
              </button>
            </div>
          </div>
        `;
        this.triggerStormEffects();
        break;
      case 'prediction_choice':
        stageContainer.innerHTML = `
          <div class="stage-board">
            <div class="prediction-box-container">
              <div class="animal-stage-actor">
                ${window.jungleViews.getAnimalAvatar(chapter.animalId || "squirrel", 115)}
                <div class="actor-name-tag">${chapter.title}</div>
              </div>
              ${chapter.badge ? `
                <div class="prediction-badge badge-${chapter.badge.type}">
                  <span>🔮</span>
                  <span>${chapter.badge.text}</span>
                </div>
              ` : ''}
              <div class="choice-cards-row">
                ${chapter.options.map(opt => `
                  <button class="choice-card-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                    <div class="choice-letter">${opt.id}</div>
                    <div class="choice-text">${opt.text}</div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;
      case 'habitat_drag':
        stageContainer.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%;">
              <div class="animal-stage-actor draggable-item" data-animal="${chapter.animalId}" style="cursor:grab;">
                ${window.jungleViews.getAnimalAvatar(chapter.animalId, 110)}
                <div class="actor-name-tag">🐿️ Drag Suki to her Habitat</div>
              </div>
              <div class="habitat-zones-container">
                ${chapter.zones.map(z => `
                  <div class="habitat-zone-card ${z.id}-zone drop-target" data-zone="${z.id}" data-correct="${z.correct}">
                    <div class="habitat-header"><span>${z.emoji}</span><span>${z.name}</span></div>
                    <div class="habitat-actor-slot">❓</div>
                    <div class="habitat-tag">${z.desc}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;
      case 'detective_mystery':
        const curCase = chapter.cases[this.activeSubState.detectiveCaseIdx] || chapter.cases[0];
        stageContainer.innerHTML = `
          <div class="stage-board">
            <div class="detective-stage">
              <span class="prediction-badge" style="background:#0284c7;">
                🔎 Mystery Case ${this.activeSubState.detectiveCaseIdx + 1} of ${chapter.cases.length}
              </span>
              <div class="clue-cards-holder">
                ${curCase.clues.map((clue, idx) => `
                  <div class="clue-card">
                    <div class="clue-number-badge">#${idx + 1}</div>
                    <div class="clue-text">${clue}</div>
                  </div>
                `).join('')}
              </div>
              <div class="choice-cards-row">
                ${curCase.options.map(opt => `
                  <button class="choice-card-btn detective-choice-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                    <span style="font-size:2.8rem;">${opt.emoji}</span>
                    <div class="choice-text">${opt.name}</div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;
      case 'timeline_order':
        stageContainer.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; max-width:1050px;">
              <div style="font-family:var(--font-display); font-size:1.35rem; color:#fef3c7; font-weight:800;">
                🔢 Drag cards into correct order: 1 ➔ 2 ➔ 3 ➔ 4
              </div>
              <div style="display:flex; gap:16px; width:100%; justify-content:center;">
                ${chapter.cards.map(c => `
                  <div class="item-card" style="flex:1; max-width:230px;">
                    <span class="item-emoji">${c.emoji}</span>
                    <span class="item-label">${c.title}</span>
                    <span style="font-size:0.85rem; color:#475569;">${c.text}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;
      case 'ecosystem_cascade':
        stageContainer.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:18px; width:100%; max-width:950px;">
              <div style="font-family:var(--font-display); font-size:1.35rem; color:#fef3c7; font-weight:800;">
                ${chapter.steps[0].question}
              </div>
              <div class="choice-cards-row">
                ${chapter.steps[0].options.map(opt => `
                  <button class="choice-card-btn cascade-q1-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                    <div class="choice-letter">${opt.id}</div>
                    <div class="choice-text">${opt.text}</div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;
      case 'prediction_machine':
        const round = chapter.rounds[this.activeSubState.machineRoundIdx] || chapter.rounds[0];
        stageContainer.innerHTML = `
          <div class="stage-board">
            <div class="prediction-machine-stage">
              <div style="font-family:var(--font-display); font-size:1.4rem; color:#fbbf24; font-weight:900;">
                ⚙️ JUNGLE PREDICTION MACHINE (${this.activeSubState.machineRoundIdx + 1}/${chapter.rounds.length})
              </div>
              <div style="color:#fff; font-size:1.15rem; font-weight:700;">${round.scenario}</div>
              <div class="sentence-builder-display">
                <span class="sentence-chunk">${round.prefix}</span>
                <div class="sentence-slot-token" id="machine-slot">${round.blank}</div>
                <span class="sentence-chunk">${round.suffix}</span>
              </div>
              <div class="modal-word-bank">
                ${round.tokens.map(tok => `
                  <button class="word-token-btn" data-token="${tok}">${tok}</button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;
      case 'before_after_compare':
        stageContainer.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%;">
              <div class="before-after-container">
                <div class="compare-card before-card">
                  <div class="compare-header"><span>🌲 Healthy Jungle</span><span>${chapter.beforeState.title}</span></div>
                  <div class="compare-body">
                    <div class="compare-feature-row"><span>🌲</span> ${chapter.beforeState.trees}</div>
                    <div class="compare-feature-row"><span>💧</span> ${chapter.beforeState.water}</div>
                    <div class="compare-feature-row"><span>🌱</span> ${chapter.beforeState.plants}</div>
                    <div class="compare-feature-row"><span>🐾</span> ${chapter.beforeState.animals}</div>
                  </div>
                </div>
                <div class="compare-card after-card">
                  <div class="compare-header"><span>⛈️ Storm Impact</span><span>${chapter.afterState.title}</span></div>
                  <div class="compare-body">
                    <div class="compare-feature-row"><span>💥</span> ${chapter.afterState.trees}</div>
                    <div class="compare-feature-row"><span>🟤</span> ${chapter.afterState.water}</div>
                    <div class="compare-feature-row"><span>🥀</span> ${chapter.afterState.plants}</div>
                    <div class="compare-feature-row"><span>😟</span> ${chapter.afterState.animals}</div>
                  </div>
                </div>
              </div>
              <div class="choice-cards-row">
                ${chapter.question.options.map(opt => `
                  <button class="choice-card-btn before-after-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                    <div class="choice-letter">${opt.id}</div>
                    <div class="choice-text">${opt.text}</div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;
      case 'emergency_simulator':
        const mission = chapter.missions[this.activeSubState.emergencyMissionIdx] || chapter.missions[0];
        stageContainer.innerHTML = `
          <div class="stage-board">
            <div class="emergency-simulator-stage">
              <div class="emergency-step-indicator">
                <div class="step-node ${this.activeSubState.emergencyStep >= 1 ? 'step-active' : ''}"><span>1️⃣ Predict</span></div>
                <div class="step-node ${this.activeSubState.emergencyStep >= 2 ? 'step-active' : ''}"><span>2️⃣ Solve</span></div>
                <div class="step-node ${this.activeSubState.emergencyStep >= 3 ? 'step-active' : ''}"><span>3️⃣ Act / Drag</span></div>
                <div class="step-node ${this.activeSubState.emergencyStep >= 4 ? 'step-active' : ''}"><span>4️⃣ Consequence</span></div>
              </div>
              <div style="background:#fff; border-radius:var(--radius-xl); padding:20px; text-align:center;">
                <div class="actor-name-tag" style="margin-bottom:12px;">${mission.name} — ${mission.problem}</div>
                ${this.activeSubState.emergencyStep === 1 ? `
                  <div style="font-size:1.3rem; font-weight:800; margin-bottom:12px; color:#065f46;">${mission.step1_predict.q}</div>
                  <div class="choice-cards-row">
                    ${mission.step1_predict.options.map(opt => `
                      <button class="choice-card-btn sim-step1-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                        <div class="choice-letter">${opt.id}</div>
                        <div class="choice-text">${opt.text}</div>
                      </button>
                    `).join('')}
                  </div>
                ` : `
                  <div style="font-size:1.5rem; font-weight:900; color:#059669; margin-bottom:12px;">${mission.consequence}</div>
                  <button class="hud-btn hud-btn-teacher" id="btn-next-mission" style="font-size:1.2rem; padding:12px 24px;">
                    <span>✨ NEXT MISSION ➔</span>
                  </button>
                `}
              </div>
            </div>
          </div>
        `;
        break;
      case 'final_crisis_hub':
        stageContainer.innerHTML = `
          <div class="stage-board">
            <div style="background:rgba(255,255,255,0.96); border-radius:var(--radius-xl); padding:24px; text-align:center; max-width:900px;">
              <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:900; color:#065f46; margin-bottom:12px;">
                🌟 RESTORE THE JUNGLE ECOSYSTEM
              </div>
              <div class="choice-cards-row">
                <button class="choice-card-btn c4-decision-btn" data-correct="true">
                  <div class="choice-text">🌳 Protect the forest, plant trees, and keep water clean!</div>
                </button>
              </div>
            </div>
          </div>
        `;
        break;
      default:
        stageContainer.innerHTML = `<div class="stage-board"><div style="color:#fff;">Active chapter...</div></div>`;
    }

    // Attach Interaction Handlers for the newly rendered elements
    this.attachStageInteractionHandlers(chapter);

    // Speak Narration Line automatically if speech enabled
    if (window.jungleAudio.isSpeechEnabled && chapter.narrator) {
      window.jungleAudio.speak(chapter.narrator.spokenText || chapter.narrator.text);
    }
  }

  formatDialogueText(text) {
    return text
      .replace(/\b(will|WILL)\b/g, '<span class="highlight-will">$1</span>')
      .replace(/\b(might|MIGHT|may|MAY|could|COULD)\b/g, '<span class="highlight-might">$1</span>')
      .replace(/\b(if|IF|If)\b/g, '<span class="highlight-if">$1</span>')
      .replace(/\b(HABITAT|PREDATOR|PREY|ECOSYSTEM|SHELTER|FOOD)\b/g, '<span class="highlight-vocab">$1</span>');
  }

  // =========================================================================
  // JUNGLE HEALTH SYSTEM & ENVIRONMENT REACTIVITY
  // =========================================================================
  changeHealth(delta) {
    this.jungleHealth = Math.max(10, Math.min(100, this.jungleHealth + delta));
    this.updateHealthBar(this.jungleHealth);
  }

  updateHealthBar(health) {
    const fillEl = document.getElementById('jungle-health-fill');
    const pctEl = document.getElementById('jungle-health-pct');
    const viewport = document.getElementById('stage-viewport');

    if (fillEl) fillEl.style.width = `${health}%`;
    if (pctEl) pctEl.textContent = `${health}%`;

    if (viewport) {
      if (health < 40) {
        viewport.classList.add('polluted-mode');
        viewport.classList.remove('healthy-mode');
      } else if (health >= 80) {
        viewport.classList.add('healthy-mode');
        viewport.classList.remove('polluted-mode');
      } else {
        viewport.classList.remove('polluted-mode', 'healthy-mode');
      }
    }
  }

  triggerStormEffects() {
    const flash = document.getElementById('lightning-fx');
    const viewport = document.getElementById('stage-viewport');
    if (viewport) viewport.classList.add('storm-mode');

    window.jungleAudio.playWind();
    setTimeout(() => {
      window.jungleAudio.playThunder();
      if (flash) {
        flash.classList.add('flash-active');
        setTimeout(() => flash.classList.remove('flash-active'), 120);
        setTimeout(() => flash.classList.add('flash-active'), 250);
        setTimeout(() => flash.classList.remove('flash-active'), 350);
      }
    }, 800);

    setTimeout(() => {
      window.jungleAudio.playTreeCrash();
    }, 1800);
  }

  // =========================================================================
  // CLASSROOM TEAM POINTS
  // =========================================================================
  addTeamPoint(team, points = 1) {
    if (!this.scores[team] && this.scores[team] !== 0) return;
    this.scores[team] += points;

    const scoreEl = document.getElementById(`score-${team}`);
    if (scoreEl) scoreEl.textContent = this.scores[team];

    window.jungleAudio.playStarPoint();
    this.launchMiniConfetti();
  }

  switchActiveTurn(team) {
    this.activeTurn = team;
    document.querySelectorAll('.team-score-card').forEach(c => c.classList.remove('active-turn'));
    const card = document.getElementById(`team-card-${team}`);
    if (card) card.classList.add('active-turn');
  }

  // =========================================================================
  // INTERACTION HANDLERS FOR ALL CHAPTERS
  // =========================================================================
  attachStageInteractionHandlers(chapter) {
    this.initDragAndDrop();

    // 1. Exploration Hotspots
    document.querySelectorAll('.explore-hotspot').forEach(spot => {
      spot.addEventListener('click', () => {
        const id = spot.getAttribute('data-id');
        const animal = window.JUNGLE_DATA.animals[id];
        if (animal) {
          window.jungleAudio.speak(animal.name);
          spot.style.transform = 'translate(-50%, -50%) scale(1.25)';
          setTimeout(() => spot.style.transform = 'translate(-50%, -50%) scale(1)', 400);

          this.discoveredHotspots.add(id);
          const counter = document.getElementById('explore-found-count');
          if (counter) counter.textContent = `Found: ${this.discoveredHotspots.size} / ${chapter.hotspots.length}`;

          this.addTeamPoint(this.activeTurn, 1);
        }
      });
    });

    // 2. Ranger Eyes Targets
    document.querySelectorAll('.nature-spot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const pill = document.getElementById(`target-pill-${targetId}`);
        if (pill) {
          pill.style.background = '#059669';
          pill.style.borderColor = '#6ee7b7';
          pill.innerHTML = `<span>${targetId.toUpperCase()}</span> <span>✅</span>`;
          window.jungleAudio.playSuccess();
          this.addTeamPoint(this.activeTurn, 1);
        }
      });
    });

    // 3. Who Am I Reveal Button
    const revealWhoBtn = document.getElementById('btn-reveal-who-am-i');
    if (revealWhoBtn) {
      revealWhoBtn.addEventListener('click', () => {
        const rev = document.getElementById('who-am-i-revealed');
        if (rev) rev.style.display = 'block';
        window.jungleAudio.playSuccess();
        this.addTeamPoint(this.activeTurn, 2);
        revealWhoBtn.style.display = 'none';
      });
    }

    // 4. Word-Picture Match Check
    document.querySelectorAll('.animal-match-target').forEach(tgt => {
      tgt.addEventListener('click', () => {
        if (this.selectedDraggable) {
          const word = this.selectedDraggable.getAttribute('data-word');
          const animal = tgt.getAttribute('data-animal');
          if (word === animal) {
            tgt.querySelector('.matched-slot-label').textContent = `✅ ${word.toUpperCase()}`;
            tgt.querySelector('.matched-slot-label').style.background = '#d1fae5';
            tgt.querySelector('.matched-slot-label').style.color = '#065f46';
            this.selectedDraggable.style.display = 'none';
            this.selectedDraggable = null;
            window.jungleAudio.playSuccess();
            this.addTeamPoint(this.activeTurn, 1);
          } else {
            tgt.classList.add('drop-wrong-shake');
            window.jungleAudio.playHint();
            setTimeout(() => tgt.classList.remove('drop-wrong-shake'), 600);
          }
        }
      });
    });

    // 5. Begin Storm Story Button
    const startStormBtn = document.getElementById('btn-begin-storm-story');
    if (startStormBtn) {
      startStormBtn.addEventListener('click', () => this.nextChapter());
    }

    // 6. Choice Cards (Prediction / Questions)
    document.querySelectorAll('.choice-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        if (isCorrect) {
          btn.classList.add('correct-choice');
          window.jungleAudio.playSuccess();
          this.changeHealth(chapter.healthChange || 10);
          this.addTeamPoint(this.activeTurn, 2);
        } else {
          btn.classList.add('drop-wrong-shake');
          window.jungleAudio.playHint();
          setTimeout(() => btn.classList.remove('drop-wrong-shake'), 600);
        }
      });
    });

    // 7. Prediction Machine Tokens
    document.querySelectorAll('.word-token-btn').forEach(tokBtn => {
      tokBtn.addEventListener('click', () => {
        const token = tokBtn.getAttribute('data-token');
        const slot = document.getElementById('machine-slot');
        const round = chapter.rounds && chapter.rounds[this.activeSubState.machineRoundIdx];
        if (slot && round) {
          slot.textContent = token;
          if (token === round.correctToken) {
            window.jungleAudio.playSuccess();
            this.addTeamPoint(this.activeTurn, 2);
            setTimeout(() => {
              if (this.activeSubState.machineRoundIdx < chapter.rounds.length - 1) {
                this.activeSubState.machineRoundIdx++;
                this.renderCurrentChapter();
              } else {
                this.nextChapter();
              }
            }, 1000);
          } else {
            slot.classList.add('drop-wrong-shake');
            window.jungleAudio.playHint();
            setTimeout(() => slot.classList.remove('drop-wrong-shake'), 600);
          }
        }
      });
    });

    // 8. Emergency Simulator Step Buttons
    document.querySelectorAll('.sim-step1-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.getAttribute('data-correct') === 'true') {
          btn.classList.add('correct-choice');
          window.jungleAudio.playSuccess();
          this.addTeamPoint(this.activeTurn, 2);
          setTimeout(() => {
            this.activeSubState.emergencyStep = 4;
            this.renderCurrentChapter();
          }, 800);
        } else {
          btn.classList.add('drop-wrong-shake');
          window.jungleAudio.playHint();
          setTimeout(() => btn.classList.remove('drop-wrong-shake'), 600);
        }
      });
    });

    const nextMissionBtn = document.getElementById('btn-next-mission');
    if (nextMissionBtn) {
      nextMissionBtn.addEventListener('click', () => {
        if (this.activeSubState.emergencyMissionIdx < chapter.missions.length - 1) {
          this.activeSubState.emergencyMissionIdx++;
          this.activeSubState.emergencyStep = 1;
          this.renderCurrentChapter();
        } else {
          this.nextChapter();
        }
      });
    }

    const rescueStartBtn = document.getElementById('btn-start-emergency-rescue');
    if (rescueStartBtn) {
      rescueStartBtn.addEventListener('click', () => this.nextChapter());
    }
  }

  // =========================================================================
  // SMART SCREEN DRAG & DROP + TAP TO PLACE
  // =========================================================================
  initDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable-item');
    const dropTargets = document.querySelectorAll('.drop-target');

    draggables.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.selectedDraggable === item) {
          item.classList.remove('tap-selected');
          this.selectedDraggable = null;
        } else {
          if (this.selectedDraggable) {
            this.selectedDraggable.classList.remove('tap-selected');
          }
          this.selectedDraggable = item;
          item.classList.add('tap-selected');
          window.jungleAudio.playClick();
        }
      });

      item.addEventListener('pointerdown', (e) => {
        item.setPointerCapture(e.pointerId);
        item.classList.add('is-dragging');
        this.selectedDraggable = item;
      });

      item.addEventListener('pointerup', (e) => {
        item.releasePointerCapture(e.pointerId);
        item.classList.remove('is-dragging');

        const dropElem = document.elementFromPoint(e.clientX, e.clientY);
        if (dropElem) {
          const target = dropElem.closest('.drop-target');
          if (target) {
            this.handleDrop(item, target);
          }
        }
      });
    });

    dropTargets.forEach(target => {
      target.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.selectedDraggable) {
          this.handleDrop(this.selectedDraggable, target);
          this.selectedDraggable.classList.remove('tap-selected');
          this.selectedDraggable = null;
        }
      });
    });
  }

  handleDrop(item, target) {
    if (target.classList.contains('habitat-zone-card')) {
      const isCorrect = target.getAttribute('data-correct') === 'true';
      if (isCorrect) {
        target.querySelector('.habitat-actor-slot').textContent = '🐿️ Safe!';
        target.classList.add('drop-correct');
        window.jungleAudio.playSuccess();
        this.addTeamPoint(this.activeTurn, 2);
      } else {
        target.classList.add('drop-wrong-shake');
        window.jungleAudio.playHint();
        setTimeout(() => target.classList.remove('drop-wrong-shake'), 600);
      }
    }
  }

  // =========================================================================
  // TEACHER HUD DRAWER & GUIDE
  // =========================================================================
  updateTeacherHUD(chapter) {
    const scriptBox = document.getElementById('teacher-script-say');
    const doBox = document.getElementById('teacher-script-do');
    const nextBox = document.getElementById('teacher-script-next');
    const chapterSelect = document.getElementById('teacher-chapter-select');

    if (chapter.teacherGuide) {
      if (scriptBox) scriptBox.textContent = chapter.teacherGuide.say;
      if (doBox) doBox.textContent = chapter.teacherGuide.do;
      if (nextBox) nextBox.textContent = chapter.teacherGuide.next;
    }

    if (chapterSelect) {
      chapterSelect.value = this.currentChapterIdx;
    }
  }

  toggleTeacherDrawer() {
    const drawer = document.getElementById('teacher-drawer');
    const btn = document.getElementById('btn-toggle-teacher');
    if (drawer) {
      drawer.classList.toggle('open');
      if (btn) btn.classList.toggle('active');
    }
  }

  // =========================================================================
  // VISUAL WORD WALL MODAL
  // =========================================================================
  openWordWall() {
    const modal = document.getElementById('word-wall-modal');
    if (modal) {
      window.jungleViews.renderVisualWordWallModal(modal);
      modal.classList.add('active');

      document.querySelectorAll('.word-wall-card').forEach(card => {
        card.addEventListener('click', () => {
          const word = card.getAttribute('data-word');
          const desc = card.getAttribute('data-desc');
          window.jungleAudio.speak(`${word}. ${desc}`);
          card.style.transform = 'scale(1.08)';
          card.style.borderColor = '#10b981';
          setTimeout(() => card.style.transform = 'scale(1)', 300);
        });
      });

      const closeBtn = document.getElementById('btn-close-word-wall');
      if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
  }

  // =========================================================================
  // SPEAKING STUDIO & CERTIFICATE MODAL
  // =========================================================================
  renderSpeakingStudio() {
    const stageContainer = document.getElementById('stage-canvas-area');
    if (stageContainer) {
      const reportData = window.JUNGLE_DATA.speakingReport;
      const selected = reportData.animals.find(a => a.id === this.activeSubState.selectedReportAnimal) || reportData.animals[0];

      stageContainer.innerHTML = `
        <div class="stage-board">
          <div class="speaking-report-stage">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-family:var(--font-display); font-size:1.6rem; color:var(--primary-dark); font-weight:900;">
                🎙️ OFFICIAL RANGER SPEAKING REPORT
              </div>
              <div class="prediction-badge" style="background:#059669;">A1+ / A2 Speaking</div>
            </div>
            <div class="report-sentence-grid">
              <div class="report-sentence-line"><span>This is a</span> <span class="report-fill-pill">${selected.emoji} ${selected.name}</span>.</div>
              <div class="report-sentence-line"><span>It lives</span> <span class="report-fill-pill">${selected.habitat}</span>.</div>
              <div class="report-sentence-line"><span>It eats</span> <span class="report-fill-pill">${selected.food}</span>.</div>
              <div class="report-sentence-line"><span>It needs</span> <span class="report-fill-pill">${selected.needs}</span>.</div>
              <div class="report-sentence-line"><span>If <b>${selected.ifClause}</b>, it will</span> <span class="report-fill-pill">${selected.willAction}</span>.</div>
              <div class="report-sentence-line"><span>It might do this because</span> <span class="report-fill-pill">${selected.mightReason}</span>.</div>
            </div>
            <div class="report-actions-row">
              <button class="report-btn report-btn-speak" id="btn-read-report"><span>🔊 Read Report Aloud</span></button>
              <button class="report-btn report-btn-cert" id="btn-show-certificate"><span>🎖️ Get Ranger Certificate</span></button>
            </div>
          </div>
        </div>
      `;

      const speakBtn = document.getElementById('btn-read-report');
      if (speakBtn) {
        speakBtn.addEventListener('click', () => {
          const speechText = `This is a ${selected.name}. It lives ${selected.habitat}. It eats ${selected.food}. It needs ${selected.needs}. If ${selected.ifClause}, it will ${selected.willAction}. It might do this because ${selected.mightReason}.`;
          window.jungleAudio.speak(speechText);
        });
      }

      const certBtn = document.getElementById('btn-show-certificate');
      if (certBtn) {
        certBtn.addEventListener('click', () => this.showCertificateModal());
      }
    }
  }

  showCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    if (modal) {
      document.getElementById('cert-forest-score').textContent = this.scores.forest;
      document.getElementById('cert-river-score').textContent = this.scores.river;
      modal.classList.add('active');
      window.jungleAudio.playFanfare();
      this.launchVictoryConfetti();
    }
  }

  hideCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    if (modal) modal.classList.remove('active');
  }

  // =========================================================================
  // GLOBAL EVENT BINDINGS
  // =========================================================================
  bindGlobalEvents() {
    const nextBtn = document.getElementById('nav-btn-next');
    const prevBtn = document.getElementById('nav-btn-prev');
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextChapter());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevChapter());

    const teacherToggleBtn = document.getElementById('btn-toggle-teacher');
    const teacherCloseBtn = document.getElementById('btn-close-teacher-drawer');
    if (teacherToggleBtn) teacherToggleBtn.addEventListener('click', () => this.toggleTeacherDrawer());
    if (teacherCloseBtn) teacherCloseBtn.addEventListener('click', () => this.toggleTeacherDrawer());

    const wordWallBtn = document.getElementById('btn-open-word-wall');
    if (wordWallBtn) wordWallBtn.addEventListener('click', () => this.openWordWall());

    const muteBtn = document.getElementById('btn-toggle-mute');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = window.jungleAudio.toggleMute();
        muteBtn.innerHTML = isMuted ? '<span>🔇</span>' : '<span>🔊</span>';
      });
    }

    const narratorSpeakBtn = document.getElementById('narrator-speak-btn');
    if (narratorSpeakBtn) {
      narratorSpeakBtn.addEventListener('click', () => {
        const chapter = window.JUNGLE_DATA.chapters[this.currentChapterIdx];
        if (chapter && chapter.narrator) {
          window.jungleAudio.speak(chapter.narrator.spokenText || chapter.narrator.text);
        }
      });
    }

    const fullscreenBtn = document.getElementById('btn-toggle-fullscreen');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => console.log(err));
        } else {
          document.exitFullscreen();
        }
      });
    }

    const addForestBtn = document.getElementById('btn-add-forest');
    const addRiverBtn = document.getElementById('btn-add-river');
    if (addForestBtn) {
      addForestBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addTeamPoint('forest', 1);
        this.switchActiveTurn('forest');
      });
    }
    if (addRiverBtn) {
      addRiverBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addTeamPoint('river', 1);
        this.switchActiveTurn('river');
      });
    }

    // Populate Teacher Chapter Select
    const chapterSelect = document.getElementById('teacher-chapter-select');
    if (chapterSelect) {
      window.JUNGLE_DATA.chapters.forEach((chap, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `Ch ${chap.number}: ${chap.title}`;
        chapterSelect.appendChild(opt);
      });
      chapterSelect.addEventListener('change', (e) => {
        this.goToChapter(parseInt(e.target.value));
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        this.nextChapter();
      } else if (e.key === 'ArrowLeft') {
        this.prevChapter();
      } else if (e.key === 't' || e.key === 'T') {
        this.toggleTeacherDrawer();
      } else if (e.key === 'w' || e.key === 'W') {
        this.openWordWall();
      }
    });
  }

  // =========================================================================
  // CELEBRATION CONFETTI ENGINE
  // =========================================================================
  setupConfetti() {
    this.confettiCanvas = document.getElementById('confetti-canvas');
    if (!this.confettiCanvas) return;
    this.confettiCtx = this.confettiCanvas.getContext('2d');
    this.confettiParticles = [];

    const resize = () => {
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
  }

  launchMiniConfetti() {
    for (let i = 0; i < 25; i++) {
      this.confettiParticles.push(this.createConfettiParticle());
    }
    this.animateConfetti();
  }

  launchVictoryConfetti() {
    for (let i = 0; i < 120; i++) {
      this.confettiParticles.push(this.createConfettiParticle());
    }
    this.animateConfetti();
  }

  createConfettiParticle() {
    const colors = ['#10b981', '#f59e0b', '#38bdf8', '#fbbf24', '#f43f5e', '#a78bfa'];
    return {
      x: Math.random() * window.innerWidth,
      y: -20,
      r: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 5 + 3,
      tilt: Math.random() * 10,
      tiltSpeed: Math.random() * 0.1 + 0.05
    };
  }

  animateConfetti() {
    if (!this.confettiCtx || this.confettiParticles.length === 0) return;
    this.confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const p = this.confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.tilt += p.tiltSpeed;

      this.confettiCtx.beginPath();
      this.confettiCtx.fillStyle = p.color;
      this.confettiCtx.ellipse(p.x, p.y, p.r, p.r / 2, p.tilt, 0, Math.PI * 2);
      this.confettiCtx.fill();

      if (p.y > window.innerHeight) {
        this.confettiParticles.splice(i, 1);
      }
    }

    if (this.confettiParticles.length > 0) {
      requestAnimationFrame(() => this.animateConfetti());
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.jungleGame = new JungleGameEngine();
});
