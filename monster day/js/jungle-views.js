/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Dynamic Stage & SVG Vector Renderer
   ========================================================================== */

class JungleViewsRenderer {
  constructor() {}

  // =========================================================================
  // HIGH FIDELITY ANIMAL SVG ICONS & AVATARS
  // =========================================================================
  getAnimalAvatar(animalKey, size = 120) {
    const avatars = {
      squirrel: `
        <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="actor-avatar-svg">
          <circle cx="50" cy="50" r="46" fill="#fef3c7" stroke="#d97706" stroke-width="4"/>
          <!-- Bushy Tail -->
          <path d="M 68 75 C 92 65 95 25 78 20 C 65 18 62 35 68 45 C 72 52 70 65 65 72 Z" fill="#b45309" stroke="#78350f" stroke-width="2.5"/>
          <!-- Body -->
          <ellipse cx="48" cy="62" rx="20" ry="22" fill="#d97706"/>
          <ellipse cx="46" cy="64" rx="14" ry="16" fill="#fef3c7"/>
          <!-- Head -->
          <circle cx="44" cy="40" r="16" fill="#d97706"/>
          <!-- Ears -->
          <polygon points="34,28 38,18 42,28" fill="#b45309"/>
          <polygon points="48,28 52,18 56,28" fill="#b45309"/>
          <!-- Eyes -->
          <circle cx="39" cy="38" r="3.5" fill="#1e293b"/>
          <circle cx="40" cy="37" r="1.2" fill="#ffffff"/>
          <circle cx="49" cy="38" r="3.5" fill="#1e293b"/>
          <circle cx="50" cy="37" r="1.2" fill="#ffffff"/>
          <!-- Nose & Cheeks -->
          <ellipse cx="44" cy="44" rx="3" ry="2" fill="#78350f"/>
          <circle cx="35" cy="43" r="3" fill="#fca5a5" opacity="0.6"/>
          <circle cx="53" cy="43" r="3" fill="#fca5a5" opacity="0.6"/>
          <!-- Paws holding acorn -->
          <ellipse cx="40" cy="58" rx="4" ry="3" fill="#b45309"/>
          <ellipse cx="48" cy="58" rx="4" ry="3" fill="#b45309"/>
          <circle cx="44" cy="58" r="4" fill="#78350f"/>
        </svg>
      `,
      raccoon: `
        <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="actor-avatar-svg">
          <circle cx="50" cy="50" r="46" fill="#f1f5f9" stroke="#475569" stroke-width="4"/>
          <!-- Ears -->
          <polygon points="30,30 35,16 44,28" fill="#334155"/>
          <polygon points="56,28 65,16 70,30" fill="#334155"/>
          <!-- Head -->
          <circle cx="50" cy="46" r="22" fill="#64748b"/>
          <!-- Bandit Mask -->
          <path d="M 32 44 Q 50 48 68 44 Q 65 54 50 52 Q 35 54 32 44 Z" fill="#1e293b"/>
          <!-- White Patches -->
          <circle cx="40" cy="44" r="7" fill="#ffffff"/>
          <circle cx="60" cy="44" r="7" fill="#ffffff"/>
          <!-- Eyes -->
          <circle cx="40" cy="44" r="3.5" fill="#0f172a"/>
          <circle cx="41" cy="43" r="1.2" fill="#ffffff"/>
          <circle cx="60" cy="44" r="3.5" fill="#0f172a"/>
          <circle cx="61" cy="43" r="1.2" fill="#ffffff"/>
          <!-- Snout -->
          <ellipse cx="50" cy="54" rx="8" ry="6" fill="#ffffff"/>
          <ellipse cx="50" cy="52" rx="3.5" ry="2.5" fill="#0f172a"/>
        </svg>
      `,
      frog: `
        <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="actor-avatar-svg">
          <circle cx="50" cy="50" r="46" fill="#ecfdf5" stroke="#059669" stroke-width="4"/>
          <!-- Lily Pad Base -->
          <path d="M 20 78 C 30 68 70 68 80 78 C 75 88 25 88 20 78 Z" fill="#34d399" opacity="0.6"/>
          <!-- Frog Body -->
          <ellipse cx="50" cy="60" rx="24" ry="18" fill="#10b981"/>
          <ellipse cx="50" cy="62" rx="16" ry="11" fill="#a7f3d0"/>
          <!-- Big Eye Orbs -->
          <circle cx="36" cy="36" r="13" fill="#10b981"/>
          <circle cx="64" cy="36" r="13" fill="#10b981"/>
          <circle cx="36" cy="36" r="8" fill="#ffffff"/>
          <circle cx="64" cy="36" r="8" fill="#ffffff"/>
          <!-- Eye Pupils -->
          <circle cx="37" cy="36" r="4.5" fill="#064e3b"/>
          <circle cx="38" cy="35" r="1.5" fill="#ffffff"/>
          <circle cx="63" cy="36" r="4.5" fill="#064e3b"/>
          <circle cx="64" cy="35" r="1.5" fill="#ffffff"/>
          <!-- Frog Smile -->
          <path d="M 38 52 Q 50 62 62 52" stroke="#064e3b" stroke-width="3" fill="none" stroke-linecap="round"/>
          <circle cx="34" cy="50" r="3.5" fill="#f43f5e" opacity="0.5"/>
          <circle cx="66" cy="50" r="3.5" fill="#f43f5e" opacity="0.5"/>
        </svg>
      `,
      bear: `
        <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="actor-avatar-svg">
          <circle cx="50" cy="50" r="46" fill="#fef3c7" stroke="#78350f" stroke-width="4"/>
          <!-- Round Ears -->
          <circle cx="30" cy="28" r="12" fill="#78350f"/>
          <circle cx="30" cy="28" r="6" fill="#d97706"/>
          <circle cx="70" cy="28" r="12" fill="#78350f"/>
          <circle cx="70" cy="28" r="6" fill="#d97706"/>
          <!-- Head -->
          <circle cx="50" cy="52" r="26" fill="#78350f"/>
          <!-- Snout -->
          <ellipse cx="50" cy="58" rx="14" ry="10" fill="#fde68a"/>
          <ellipse cx="50" cy="54" rx="6" ry="4" fill="#3b1d07"/>
          <path d="M 50 58 L 50 63 M 45 62 Q 50 66 55 62" stroke="#3b1d07" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <!-- Eyes -->
          <circle cx="40" cy="45" r="3.5" fill="#3b1d07"/>
          <circle cx="41" cy="44" r="1" fill="#ffffff"/>
          <circle cx="60" cy="45" r="3.5" fill="#3b1d07"/>
          <circle cx="61" cy="44" r="1" fill="#ffffff"/>
        </svg>
      `,
      rabbit: `
        <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="actor-avatar-svg">
          <circle cx="50" cy="50" r="46" fill="#fdf2f8" stroke="#f472b6" stroke-width="4"/>
          <!-- Tall Long Ears -->
          <ellipse cx="38" cy="24" rx="7" ry="18" fill="#ffffff" stroke="#f472b6" stroke-width="2"/>
          <ellipse cx="38" cy="24" rx="4" ry="12" fill="#fbcfe8"/>
          <ellipse cx="62" cy="24" rx="7" ry="18" fill="#ffffff" stroke="#f472b6" stroke-width="2"/>
          <ellipse cx="62" cy="24" rx="4" ry="12" fill="#fbcfe8"/>
          <!-- Head -->
          <circle cx="50" cy="55" r="22" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
          <!-- Cute Eyes -->
          <ellipse cx="41" cy="52" rx="3.5" ry="4.5" fill="#334155"/>
          <circle cx="42" cy="50" r="1.5" fill="#ffffff"/>
          <ellipse cx="59" cy="52" rx="3.5" ry="4.5" fill="#334155"/>
          <circle cx="60" cy="50" r="1.5" fill="#ffffff"/>
          <!-- Pink Nose & Whiskers -->
          <polygon points="48,58 52,58 50,61" fill="#f472b6"/>
          <!-- Whiskers -->
          <line x1="30" y1="58" x2="42" y2="60" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="30" y1="64" x2="42" y2="63" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="70" y1="58" x2="58" y2="60" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="70" y1="64" x2="58" y2="63" stroke="#94a3b8" stroke-width="1.5"/>
        </svg>
      `,
      fox: `
        <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="actor-avatar-svg">
          <circle cx="50" cy="50" r="46" fill="#fff7ed" stroke="#ea580c" stroke-width="4"/>
          <!-- Triangular Pointed Ears -->
          <polygon points="26,38 32,16 46,32" fill="#ea580c"/>
          <polygon points="30,34 33,22 40,32" fill="#1e293b"/>
          <polygon points="54,32 68,16 74,38" fill="#ea580c"/>
          <polygon points="60,32 67,22 70,34" fill="#1e293b"/>
          <!-- Head / Face -->
          <polygon points="24,44 50,76 76,44" fill="#ea580c"/>
          <polygon points="32,46 50,72 68,46" fill="#ffffff"/>
          <!-- Eyes -->
          <ellipse cx="40" cy="48" rx="4" ry="2.5" fill="#1e293b" transform="rotate(-10, 40, 48)"/>
          <ellipse cx="60" cy="48" rx="4" ry="2.5" fill="#1e293b" transform="rotate(10, 60, 48)"/>
          <!-- Snout Tip -->
          <circle cx="50" cy="73" r="3.5" fill="#0f172a"/>
        </svg>
      `,
      owl: `
        <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="actor-avatar-svg">
          <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#64748b" stroke-width="4"/>
          <!-- Tuft Feathers -->
          <polygon points="30,32 34,18 42,30" fill="#475569"/>
          <polygon points="58,30 66,18 70,32" fill="#475569"/>
          <!-- Body -->
          <ellipse cx="50" cy="54" rx="24" ry="22" fill="#64748b"/>
          <!-- Big Round Eye Mask -->
          <circle cx="38" cy="45" r="12" fill="#fef08a"/>
          <circle cx="38" cy="45" r="6" fill="#0f172a"/>
          <circle cx="39" cy="43" r="2" fill="#ffffff"/>
          <circle cx="62" cy="45" r="12" fill="#fef08a"/>
          <circle cx="62" cy="45" r="6" fill="#0f172a"/>
          <circle cx="63" cy="43" r="2" fill="#ffffff"/>
          <!-- Beak -->
          <polygon points="46,52 54,52 50,60" fill="#f59e0b"/>
        </svg>
      `
    };

    return avatars[animalKey] || avatars.squirrel;
  }

  // =========================================================================
  // CHAPTER 1: LIVING JUNGLE & NEEDS SURVIVAL WHEEL
  // =========================================================================
  renderChapter1(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div class="needs-wheel-stage">
          <!-- Central Animal Need Target -->
          <div class="survival-ring-target drop-target" data-target="survival-ring">
            <div class="animal-stage-actor">
              ${this.getAnimalAvatar("squirrel", 130)}
              <div class="actor-name-tag">🐿️ Suki the Squirrel</div>
            </div>
            <div class="survival-slots-container">
              <div class="survival-slot" id="slot-food" title="Food Slot" data-need="food">❓</div>
              <div class="survival-slot" id="slot-water" title="Water Slot" data-need="water">❓</div>
              <div class="survival-slot" id="slot-shelter" title="Shelter Slot" data-need="shelter">❓</div>
            </div>
          </div>

          <!-- Items Palette to Drag/Tap -->
          <div class="items-palette">
            <div style="width:100%; text-align:center; color:#fff; font-family:var(--font-display); font-weight:700; margin-bottom:8px;">
              👇 Drag or Tap the 3 Basic Needs:
            </div>
            ${chapter.availableItems.map(item => `
              <div class="item-card draggable-item" data-id="${item.id}" data-correct="${item.correct}">
                <span class="item-emoji">${item.emoji}</span>
                <span class="item-label">${item.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 2: THE GREAT STORM ANIMATION
  // =========================================================================
  renderChapter2(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div class="storm-stage">
          <div class="lightning-flash" id="lightning-fx"></div>
          <div style="font-family:var(--font-display); font-size:2.4rem; color:#fca5a5; font-weight:900; text-shadow:0 4px 12px rgba(0,0,0,0.8); margin-bottom:12px;">
            ⛈️ JUNGLE EMERGENCY ALERT! 🚨
          </div>
          <div style="font-family:var(--font-display); font-size:1.35rem; color:#f8fafc; max-width:750px;">
            A fierce storm struck Green Valley! Look at what was damaged:
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
  }

  // =========================================================================
  // PREDICTION CHOICE COMPONENT (WILL / MIGHT / IF)
  // =========================================================================
  renderPredictionChoice(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div class="prediction-box-container">
          <!-- Active Character Avatar -->
          <div class="animal-stage-actor">
            ${this.getAnimalAvatar(chapter.targetAnimal || "squirrel", 120)}
            <div class="actor-name-tag">${chapter.title}</div>
            <div class="actor-status-bubble">😟</div>
          </div>

          <!-- Grammar / Logic Badge -->
          ${chapter.badge ? `
            <div class="prediction-badge badge-${chapter.badge.type}">
              <span>🔮</span>
              <span>${chapter.badge.text}</span>
            </div>
          ` : ''}

          <!-- Multiple Choices (Smart Screen Touch Buttons) -->
          <div class="choice-cards-row">
            ${chapter.options.map((opt, idx) => `
              <button class="choice-card-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                <div class="choice-letter">${opt.id}</div>
                <div class="choice-text">${opt.text}</div>
              </button>
            `).join('')}
          </div>

          <!-- Sub-task Container (Appears after correct prediction) -->
          <div id="prediction-subtask" style="display:none; width:100%; text-align:center; margin-top:14px;">
            ${chapter.subTask ? `
              <div style="font-family:var(--font-display); font-size:1.2rem; color:#fef3c7; font-weight:700; margin-bottom:10px;">
                ${chapter.subTask.prompt}
              </div>
              <div class="items-palette" style="display:inline-flex;">
                ${chapter.subTask.items.map(it => `
                  <div class="item-card draggable-item" data-id="${it.id}">
                    <span class="item-emoji">${it.emoji}</span>
                    <span class="item-label">${it.name}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${chapter.interactiveAction ? `
              <div style="font-family:var(--font-display); font-size:1.2rem; color:#fef3c7; font-weight:700; margin-bottom:12px;">
                ${chapter.interactiveAction.prompt}
              </div>
              <div style="display:flex; gap:16px; justify-content:center;">
                <button class="hud-btn berry-bush-btn" data-bush="1" style="font-size:2rem; padding:16px 22px; background:#065f46;">🌿 ❓</button>
                <button class="hud-btn berry-bush-btn" data-bush="2" style="font-size:2rem; padding:16px 22px; background:#065f46;">🌿 🍓</button>
                <button class="hud-btn berry-bush-btn" data-bush="3" style="font-size:2rem; padding:16px 22px; background:#065f46;">🌿 ❓</button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 4: HABITAT SELECTOR & DRAG
  // =========================================================================
  renderHabitatDrag(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%;">
          <!-- Draggable Animal -->
          <div class="animal-stage-actor draggable-item" data-animal="${chapter.animalId}" style="cursor:grab;">
            ${this.getAnimalAvatar(chapter.animalId, 110)}
            <div class="actor-name-tag">🐿️ Drag Suki to her Habitat</div>
          </div>

          <!-- 3 Habitat Zones -->
          <div class="habitat-zones-container">
            ${chapter.zones.map(z => `
              <div class="habitat-zone-card ${z.id}-zone drop-target" data-zone="${z.id}" data-correct="${z.correct}">
                <div class="habitat-header">
                  <span>${z.emoji}</span>
                  <span>${z.name}</span>
                </div>
                <div class="habitat-actor-slot">
                  ❓
                </div>
                <div class="habitat-tag">${z.desc}</div>
              </div>
            `).join('')}
          </div>

          <!-- Reasoning Followup Modal Area -->
          <div id="habitat-reasoning-area" style="display:none; width:100%; max-width:800px; background:rgba(255,255,255,0.96); border-radius:var(--radius-xl); padding:16px; box-shadow:var(--shadow-lg); text-align:center;">
            <div style="font-family:var(--font-display); font-size:1.3rem; color:var(--primary-dark); font-weight:800; margin-bottom:10px;">
              🤔 ${chapter.reasoningQuestion.question}
            </div>
            <div class="choice-cards-row">
              ${chapter.reasoningQuestion.options.map(opt => `
                <button class="choice-card-btn habitat-reason-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                  <div class="choice-letter">${opt.id}</div>
                  <div class="choice-text">${opt.text}</div>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 8: RANGER DETECTIVE (MYSTERY CASES)
  // =========================================================================
  renderDetectiveMystery(container, chapter, currentCaseIdx = 0) {
    const currentCase = chapter.cases[currentCaseIdx] || chapter.cases[0];
    container.innerHTML = `
      <div class="stage-board">
        <div class="detective-stage">
          <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
            <span class="prediction-badge" style="background:#0284c7; border:2px solid #7dd3fc;">
              🔎 Detective Mystery Case ${currentCaseIdx + 1} of ${chapter.cases.length}
            </span>
          </div>

          <div class="clue-cards-holder">
            ${currentCase.clues.map((clue, idx) => `
              <div class="clue-card">
                <div class="clue-number-badge">#${idx + 1}</div>
                <div class="clue-text">${clue}</div>
              </div>
            `).join('')}
          </div>

          <div style="font-family:var(--font-display); font-size:1.5rem; color:#fef3c7; font-weight:800; text-shadow:0 2px 4px rgba(0,0,0,0.5);">
            ❓ ${currentCase.question}
          </div>

          <div class="choice-cards-row">
            ${currentCase.options.map(opt => `
              <button class="choice-card-btn detective-choice-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                <span style="font-size:2.8rem;">${opt.emoji}</span>
                <div class="choice-text">${opt.name}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 9: FEED THE ANIMALS DIET MATCHER
  // =========================================================================
  renderFeedMatcher(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; max-width:1100px;">
          <!-- Hungry Animals Row -->
          <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
            ${chapter.pairs.map(p => `
              <div class="animal-stage-actor drop-target feed-drop-target" data-animal="${p.animal}" style="padding:10px; background:rgba(255,255,255,0.15); border-radius:var(--radius-xl);">
                ${this.getAnimalAvatar(p.animal, 95)}
                <div class="actor-name-tag" style="font-size:0.95rem;">${p.animalEmoji} ${p.animalName}</div>
                <div class="fed-status-badge" id="fed-${p.animal}" style="font-size:0.85rem; color:#fef3c7; font-weight:700;">Hungry 😋</div>
              </div>
            `).join('')}
          </div>

          <!-- Foods Tray -->
          <div class="items-palette" style="gap:18px;">
            <div style="width:100%; text-align:center; color:#fff; font-family:var(--font-display); font-weight:700;">
              🥦 Drag or Tap food to feed each hungry animal:
            </div>
            ${chapter.pairs.map(p => `
              <div class="item-card draggable-item feed-food-item" data-food="${p.food}" data-match="${p.animal}">
                <span class="item-emoji">${p.foodEmoji}</span>
                <span class="item-label">${p.foodName}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 10: WHAT HAPPENS FIRST? (TIMELINE SEQUENCER)
  // =========================================================================
  renderTimelineOrder(container, chapter) {
    // Shuffle cards for challenge
    const shuffled = [...chapter.cards].sort(() => Math.random() - 0.5);
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; max-width:1050px;">
          <div style="font-family:var(--font-display); font-size:1.35rem; color:#fef3c7; font-weight:800; text-align:center;">
            🔢 Drag the cards into the correct 1 ➔ 2 ➔ 3 ➔ 4 sequence:
          </div>

          <!-- 4 Target Sequence Slots -->
          <div style="display:flex; gap:16px; width:100%; justify-content:center;">
            ${[1, 2, 3, 4].map(num => `
              <div class="drop-target timeline-slot" data-slot="${num}" style="flex:1; max-width:230px; min-height:160px; background:rgba(0,0,0,0.4); border:3px dashed #34d399; border-radius:var(--radius-xl); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:12px;">
                <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:900; color:#34d399; margin-bottom:6px;">#${num}</div>
                <div class="slot-content" style="font-size:0.9rem; color:#cbd5e1; text-align:center;">Empty Slot</div>
              </div>
            `).join('')}
          </div>

          <!-- Mixed Available Cards -->
          <div class="items-palette" style="display:flex; gap:14px; justify-content:center;">
            ${shuffled.map(c => `
              <div class="item-card draggable-item timeline-card" data-order="${c.order}" data-id="${c.id}" style="max-width:210px; cursor:grab;">
                <span class="item-emoji">${c.emoji}</span>
                <span class="item-label" style="font-size:1rem;">${c.title}</span>
                <span style="font-size:0.8rem; color:#475569; text-align:center;">${c.text}</span>
              </div>
            `).join('')}
          </div>

          <!-- Followup Prediction Area -->
          <div id="timeline-followup" style="display:none; width:100%; max-width:850px; background:#fff; border-radius:var(--radius-xl); padding:16px; box-shadow:var(--shadow-lg); text-align:center;">
            <div style="font-family:var(--font-display); font-size:1.35rem; color:var(--primary-dark); font-weight:800; margin-bottom:12px;">
              🔮 ${chapter.followUp.question}
            </div>
            <div class="choice-cards-row">
              ${chapter.followUp.options.map(opt => `
                <button class="choice-card-btn timeline-predict-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                  <div class="choice-letter">${opt.id}</div>
                  <div class="choice-text">${opt.text}</div>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 12: BUILD THE FOOD CHAIN
  // =========================================================================
  renderFoodChainBuilder(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%;">
          <div style="font-family:var(--font-display); font-size:1.3rem; color:#fef3c7; font-weight:800;">
            🔗 Drag cards to build the Food Chain: Producer ➔ Prey ➔ Predator
          </div>

          <!-- Food Chain Slots with Connecting Energy Arrows -->
          <div class="food-chain-builder">
            <div class="chain-node-slot drop-target" data-pos="1" data-expect="plant">
              <span class="chain-role-tag tag-producer">🌱 Producer</span>
              <div class="node-slot-placeholder">❓ Drag Here</div>
            </div>

            <div class="chain-arrow-connect">➔</div>

            <div class="chain-node-slot drop-target" data-pos="2" data-expect="rabbit">
              <span class="chain-role-tag tag-prey">🐇 Prey</span>
              <div class="node-slot-placeholder">❓ Drag Here</div>
            </div>

            <div class="chain-arrow-connect">➔</div>

            <div class="chain-node-slot drop-target" data-pos="3" data-expect="fox">
              <span class="chain-role-tag tag-predator">🦊 Predator</span>
              <div class="node-slot-placeholder">❓ Drag Here</div>
            </div>
          </div>

          <!-- Cards Palette -->
          <div class="items-palette">
            ${chapter.availableCards.map(c => `
              <div class="item-card draggable-item food-chain-card" data-id="${c.id}">
                <span class="item-emoji">${c.emoji}</span>
                <span class="item-label">${c.name}</span>
                <span style="font-size:0.8rem; color:#475569;">${c.role}</span>
              </div>
            `).join('')}
          </div>

          <!-- Vocabulary Cards -->
          <div style="display:flex; gap:16px; margin-top:8px;">
            ${chapter.vocabulary.map(v => `
              <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:var(--radius-lg); padding:8px 16px; color:#fff; font-size:0.9rem;">
                <b style="color:#fbbf24;">${v.word}:</b> ${v.desc}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 13: ECOSYSTEM CASCADE SIMULATION
  // =========================================================================
  renderEcosystemCascade(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:18px; width:100%; max-width:950px;">
          <!-- Visual Cascade Trophic Levels -->
          <div style="display:flex; gap:24px; align-items:center; justify-content:center; width:100%; background:rgba(0,0,0,0.4); padding:16px; border-radius:var(--radius-xl); border:2px solid rgba(255,255,255,0.2);">
            <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
              <span style="font-size:3rem;" id="cascade-plant-emoji">🌱🌱🌱</span>
              <span style="font-family:var(--font-display); color:#86efac; font-weight:800;">Plants</span>
            </div>
            <span style="font-size:2rem; color:#fbbf24;">➔</span>
            <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
              <span style="font-size:3rem;" id="cascade-rabbit-emoji">🐇🐇🐇</span>
              <span style="font-family:var(--font-display); color:#7dd3fc; font-weight:800;">Rabbits (Prey)</span>
            </div>
            <span style="font-size:2rem; color:#fbbf24;">➔</span>
            <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
              <span style="font-size:3rem;" id="cascade-fox-emoji">🦊🦊</span>
              <span style="font-family:var(--font-display); color:#fca5a5; font-weight:800;">Foxes (Predator)</span>
            </div>
          </div>

          <!-- Question 1 -->
          <div class="cascade-step-box" id="cascade-step-1" style="width:100%; text-align:center;">
            <div style="font-family:var(--font-display); font-size:1.35rem; color:#fef3c7; font-weight:800; margin-bottom:12px;">
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

          <!-- Question 2 (Appears after Q1) -->
          <div class="cascade-step-box" id="cascade-step-2" style="display:none; width:100%; text-align:center;">
            <div style="font-family:var(--font-display); font-size:1.35rem; color:#fef3c7; font-weight:800; margin-bottom:12px;">
              ${chapter.steps[1].question}
            </div>
            <div class="choice-cards-row">
              ${chapter.steps[1].options.map(opt => `
                <button class="choice-card-btn cascade-q2-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                  <div class="choice-letter">${opt.id}</div>
                  <div class="choice-text">${opt.text}</div>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 14: THE PREDICTION MACHINE
  // =========================================================================
  renderPredictionMachine(container, chapter, currentRoundIdx = 0) {
    const round = chapter.rounds[currentRoundIdx] || chapter.rounds[0];
    container.innerHTML = `
      <div class="stage-board">
        <div class="prediction-machine-stage">
          <!-- Machine Header Lights -->
          <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
            <div class="machine-header-lights">
              <div class="machine-light lit-green"></div>
              <div class="machine-light lit-amber"></div>
              <div class="machine-light lit-blue"></div>
            </div>
            <div style="font-family:var(--font-display); font-size:1.4rem; color:#fbbf24; font-weight:900;">
              ⚙️ JUNGLE PREDICTION MACHINE (${currentRoundIdx + 1}/${chapter.rounds.length})
            </div>
            <div class="machine-header-lights">
              <div class="machine-light lit-blue"></div>
              <div class="machine-light lit-amber"></div>
              <div class="machine-light lit-green"></div>
            </div>
          </div>

          <!-- Scenario Card -->
          <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:var(--radius-lg); padding:10px 20px; color:#f8fafc; font-family:var(--font-display); font-size:1.2rem; font-weight:700;">
            ${round.scenario}
          </div>

          <!-- Sentence Builder Display Screen -->
          <div class="sentence-builder-display">
            <span class="sentence-chunk">${round.prefix}</span>
            <div class="sentence-slot-token drop-target" id="machine-slot" data-expect="${round.correctToken}">
              ${round.blank}
            </div>
            <span class="sentence-chunk">${round.suffix}</span>
          </div>

          <!-- Modal Word Bank Buttons -->
          <div class="modal-word-bank">
            ${round.tokens.map(tok => `
              <button class="word-token-btn draggable-item token-${tok.toLowerCase().replace("'", '')}" data-token="${tok}">
                ${tok}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 15: BEFORE AND AFTER COMPARATOR
  // =========================================================================
  renderBeforeAfter(container, chapter) {
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%;">
          <div class="before-after-container">
            <!-- Before Card -->
            <div class="compare-card before-card">
              <div class="compare-header">
                <span>🌲 Healthy Jungle</span>
                <span>${chapter.beforeState.title}</span>
              </div>
              <div class="compare-body">
                <div class="compare-feature-row"><span>🌲</span> ${chapter.beforeState.trees}</div>
                <div class="compare-feature-row"><span>💧</span> ${chapter.beforeState.water}</div>
                <div class="compare-feature-row"><span>🌱</span> ${chapter.beforeState.plants}</div>
                <div class="compare-feature-row"><span>🐾</span> ${chapter.beforeState.animals}</div>
              </div>
            </div>

            <!-- After Card -->
            <div class="compare-card after-card">
              <div class="compare-header">
                <span>⛈️ Storm Impact</span>
                <span>${chapter.afterState.title}</span>
              </div>
              <div class="compare-body">
                <div class="compare-feature-row"><span>💥</span> ${chapter.afterState.trees}</div>
                <div class="compare-feature-row"><span>🟤</span> ${chapter.afterState.water}</div>
                <div class="compare-feature-row"><span>🥀</span> ${chapter.afterState.plants}</div>
                <div class="compare-feature-row"><span>😟</span> ${chapter.afterState.animals}</div>
              </div>
            </div>
          </div>

          <!-- Analysis Question -->
          <div style="width:100%; max-width:850px; text-align:center;">
            <div style="font-family:var(--font-display); font-size:1.3rem; color:#fef3c7; font-weight:800; margin-bottom:10px;">
              ${chapter.question.prompt}
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
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 16: ANIMAL EMERGENCY SIMULATOR
  // =========================================================================
  renderEmergencySimulator(container, chapter, currentMissionIdx = 0, currentStep = 1) {
    const mission = chapter.missions[currentMissionIdx] || chapter.missions[0];
    container.innerHTML = `
      <div class="stage-board">
        <div class="emergency-simulator-stage">
          <!-- Mission Tabs -->
          <div class="mission-selector-bar">
            ${chapter.missions.map((m, idx) => `
              <button class="mission-tab-btn ${idx === currentMissionIdx ? 'active-mission' : ''}" data-idx="${idx}">
                <span>${m.name}</span>
              </button>
            `).join('')}
          </div>

          <!-- 4 Steps Flow Indicator -->
          <div class="emergency-step-indicator">
            <div class="step-node ${currentStep >= 1 ? 'step-active' : ''} ${currentStep > 1 ? 'step-done' : ''}">
              <span>1️⃣ Predict</span>
            </div>
            <div class="step-node ${currentStep >= 2 ? 'step-active' : ''} ${currentStep > 2 ? 'step-done' : ''}">
              <span>2️⃣ Solve</span>
            </div>
            <div class="step-node ${currentStep >= 3 ? 'step-active' : ''} ${currentStep > 3 ? 'step-done' : ''}">
              <span>3️⃣ Act / Drag</span>
            </div>
            <div class="step-node ${currentStep >= 4 ? 'step-active' : ''}">
              <span>4️⃣ Consequence</span>
            </div>
          </div>

          <!-- Active Step Stage Content -->
          <div style="background:rgba(255,255,255,0.95); border-radius:var(--radius-xl); padding:20px; box-shadow:var(--shadow-lg); text-align:center;">
            <div class="animal-stage-actor" style="margin-bottom:12px;">
              ${this.getAnimalAvatar(mission.animal, 90)}
              <div class="actor-name-tag">${mission.name} — Emergency: ${mission.problem}</div>
            </div>

            ${currentStep === 1 ? `
              <div style="font-family:var(--font-display); font-size:1.3rem; color:var(--primary-dark); font-weight:800; margin-bottom:12px;">
                🔮 STEP 1: ${mission.step1_predict.q}
              </div>
              <div class="choice-cards-row">
                ${mission.step1_predict.options.map(opt => `
                  <button class="choice-card-btn sim-step1-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                    <div class="choice-letter">${opt.id}</div>
                    <div class="choice-text">${opt.text}</div>
                  </button>
                `).join('')}
              </div>
            ` : ''}

            ${currentStep === 2 ? `
              <div style="font-family:var(--font-display); font-size:1.3rem; color:var(--primary-dark); font-weight:800; margin-bottom:12px;">
                💡 STEP 2: ${mission.step2_solve.q}
              </div>
              <div class="choice-cards-row">
                ${mission.step2_solve.options.map(opt => `
                  <button class="choice-card-btn sim-step2-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                    <div class="choice-letter">${opt.id}</div>
                    <div class="choice-text">${opt.text}</div>
                  </button>
                `).join('')}
              </div>
            ` : ''}

            ${currentStep === 3 ? `
              <div style="font-family:var(--font-display); font-size:1.3rem; color:var(--primary-dark); font-weight:800; margin-bottom:12px;">
                🖐️ STEP 3: Drag the solution into place!
              </div>
              <div style="display:flex; justify-content:space-around; align-items:center; margin:16px 0;">
                <div class="item-card draggable-item sim-action-item" style="cursor:grab;">
                  <span class="item-emoji">🛠️</span>
                  <span class="item-label">${mission.step3_drag.item}</span>
                </div>
                <div class="drop-target sim-action-target" style="padding:20px 40px; background:#dcfce7; border:3px dashed #10b981; border-radius:var(--radius-lg); font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:#065f46;">
                  🎯 Target: ${mission.step3_drag.target}
                </div>
              </div>
            ` : ''}

            ${currentStep === 4 ? `
              <div style="font-family:var(--font-display); font-size:1.6rem; color:#059669; font-weight:900; margin-bottom:12px;">
                ${mission.consequence}
              </div>
              <button class="hud-btn hud-btn-teacher" id="btn-next-mission" style="font-size:1.2rem; padding:12px 24px;">
                <span>✨ NEXT EMERGENCY MISSION ➔</span>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 17: FINAL CRISIS HUB & 4 CHALLENGES
  // =========================================================================
  renderFinalCrisisHub(container, chapter, activeChallengeId = 'c1') {
    const data = window.JUNGLE_DATA.finalChallengesData;
    container.innerHTML = `
      <div class="stage-board">
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1050px;">
          <!-- Challenge Sub-Navigation -->
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <button class="hud-btn ${activeChallengeId === 'c1' ? 'active' : ''}" data-chall="c1">1. Habitats 🏠</button>
            <button class="hud-btn ${activeChallengeId === 'c2' ? 'active' : ''}" data-chall="c2">2. Food 🍎</button>
            <button class="hud-btn ${activeChallengeId === 'c3' ? 'active' : ''}" data-chall="c3">3. Food Chains 🔗</button>
            <button class="hud-btn ${activeChallengeId === 'c4' ? 'active' : ''}" data-chall="c4">4. Save Jungle 🌎</button>
          </div>

          <!-- Challenge 1 Content: Restore Habitats -->
          ${activeChallengeId === 'c1' ? `
            <div style="background:rgba(255,255,255,0.96); border-radius:var(--radius-xl); padding:20px; width:100%; text-align:center;">
              <div style="font-family:var(--font-display); font-size:1.35rem; color:var(--primary-dark); font-weight:800; margin-bottom:12px;">
                ${data.c1_habitats.prompt}
              </div>
              <div style="display:flex; gap:16px; justify-content:center; margin-bottom:16px;">
                ${data.c1_habitats.items.map(it => `
                  <div class="item-card draggable-item c1-animal" data-target="${it.target}" style="cursor:grab;">
                    <span class="item-emoji">${it.emoji}</span>
                    <span class="item-label">${it.name}</span>
                  </div>
                `).join('')}
              </div>
              <div style="display:flex; gap:16px; justify-content:center;">
                ${data.c1_habitats.targets.map(tg => `
                  <div class="drop-target c1-zone" data-zone="${tg.id}" style="flex:1; max-width:280px; padding:20px; background:#ecfdf5; border:3px dashed #10b981; border-radius:var(--radius-xl);">
                    <div style="font-size:2.5rem;">${tg.emoji}</div>
                    <div style="font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:#065f46;">${tg.name}</div>
                    <div class="c1-slot-status" style="font-size:0.9rem; color:#059669;">Slot Empty</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Challenge 2 Content: Restore Food -->
          ${activeChallengeId === 'c2' ? `
            <div style="background:rgba(255,255,255,0.96); border-radius:var(--radius-xl); padding:20px; width:100%; text-align:center;">
              <div style="font-family:var(--font-display); font-size:1.35rem; color:var(--primary-dark); font-weight:800; margin-bottom:12px;">
                ${data.c2_food.prompt}
              </div>
              <div class="items-palette">
                ${data.c2_food.pairs.map(p => `
                  <div class="item-card c2-pair-card" style="padding:12px 18px;">
                    <span style="font-size:2.5rem;">${p.animalEmoji} ➔ ${p.foodEmoji}</span>
                    <span class="item-label">${p.animalName} eats ${p.foodName}</span>
                    <button class="hud-btn c2-feed-btn" style="margin-top:6px; font-size:0.85rem; height:36px;">Feed Animal ✨</button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Challenge 3 Content: Food Chains -->
          ${activeChallengeId === 'c3' ? `
            <div style="background:rgba(255,255,255,0.96); border-radius:var(--radius-xl); padding:20px; width:100%; text-align:center;">
              <div style="font-family:var(--font-display); font-size:1.35rem; color:var(--primary-dark); font-weight:800; margin-bottom:12px;">
                ${data.c3_chains.prompt}
              </div>
              <div style="display:flex; flex-direction:column; gap:16px;">
                <div style="background:#f0fdf4; border:2px solid #86efac; border-radius:var(--radius-lg); padding:14px; display:flex; align-items:center; justify-content:space-around; font-family:var(--font-display); font-size:1.25rem; font-weight:800; color:#15803d;">
                  <span>🌱 Green Plant</span> <span>➔</span> <span>🐇 Pip the Rabbit</span> <span>➔</span> <span>🦊 Flash the Fox</span>
                  <button class="hud-btn c3-chain-btn" style="height:40px; font-size:0.95rem;">Lock Chain 🔒</button>
                </div>
                <div style="background:#f0fdf4; border:2px solid #86efac; border-radius:var(--radius-lg); padding:14px; display:flex; align-items:center; justify-content:space-around; font-family:var(--font-display); font-size:1.25rem; font-weight:800; color:#15803d;">
                  <span>🌰 Oak Acorn</span> <span>➔</span> <span>🐿️ Suki the Squirrel</span> <span>➔</span> <span>🦉 Ollie the Owl</span>
                  <button class="hud-btn c3-chain-btn" style="height:40px; font-size:0.95rem;">Lock Chain 🔒</button>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Challenge 4 Content: Save Ecosystem Decision -->
          ${activeChallengeId === 'c4' ? `
            <div style="background:rgba(255,255,255,0.96); border-radius:var(--radius-xl); padding:20px; width:100%; text-align:center;">
              <div style="font-family:var(--font-display); font-size:1.4rem; color:var(--primary-dark); font-weight:800; margin-bottom:14px;">
                🌎 ${data.c4_decision.prompt}
              </div>
              <div class="choice-cards-row">
                ${data.c4_decision.options.map(opt => `
                  <button class="choice-card-btn c4-decision-btn" data-id="${opt.id}" data-correct="${opt.correct}">
                    <div class="choice-letter">${opt.id}</div>
                    <div class="choice-text">${opt.text}</div>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // CHAPTER 30: FINAL RANGER REPORT (SPEAKING STUDIO)
  // =========================================================================
  renderSpeakingReport(container, selectedAnimalId = 'frog') {
    const reportData = window.JUNGLE_DATA.speakingReport;
    const selected = reportData.animals.find(a => a.id === selectedAnimalId) || reportData.animals[0];

    container.innerHTML = `
      <div class="stage-board">
        <div class="speaking-report-stage">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-family:var(--font-display); font-size:1.6rem; color:var(--primary-dark); font-weight:900;">
              🎙️ OFFICIAL RANGER SPEAKING REPORT
            </div>
            <div class="prediction-badge" style="background:#059669;">A1+ / A2 Speaking</div>
          </div>

          <!-- Animal Selector -->
          <div class="report-animal-picker">
            ${reportData.animals.map(a => `
              <div class="picker-animal-card ${a.id === selectedAnimalId ? 'selected' : ''}" data-id="${a.id}">
                <span style="font-size:2.2rem;">${a.emoji}</span>
                <span style="font-family:var(--font-display); font-weight:800; font-size:0.95rem;">${a.name}</span>
              </div>
            `).join('')}
          </div>

          <!-- Sentence Frame Presentation -->
          <div class="report-sentence-grid">
            <div class="report-sentence-line">
              <span>This is a</span>
              <span class="report-fill-pill">${selected.emoji} ${selected.name}</span>.
            </div>
            <div class="report-sentence-line">
              <span>It lives</span>
              <span class="report-fill-pill">${selected.habitat}</span>.
            </div>
            <div class="report-sentence-line">
              <span>It eats</span>
              <span class="report-fill-pill">${selected.food}</span>.
            </div>
            <div class="report-sentence-line">
              <span>It needs</span>
              <span class="report-fill-pill">${selected.needs}</span>.
            </div>
            <div class="report-sentence-line">
              <span>If <b>${selected.ifClause}</b>, it will</span>
              <span class="report-fill-pill">${selected.willAction}</span>.
            </div>
            <div class="report-sentence-line">
              <span>It might do this because</span>
              <span class="report-fill-pill">${selected.mightReason}</span>.
            </div>
          </div>

          <!-- Actions -->
          <div class="report-actions-row">
            <button class="report-btn report-btn-speak" id="btn-read-report">
              <span>🔊 Read Report Aloud</span>
            </button>
            <button class="report-btn report-btn-cert" id="btn-show-certificate">
              <span>🎖️ Get Ranger Certificate</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

// Global instance
window.jungleViews = new JungleViewsRenderer();
