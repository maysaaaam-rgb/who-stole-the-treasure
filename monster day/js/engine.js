/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Complete Game Controller & Zero-Fail TAP ➔ TAP State Machine
   ========================================================================== */

class JungleGameEngine {
  constructor() {
    this.currentSceneIdx = 0;
    this.jungleHealth = 70;
    this.scores = { forest: 0, river: 0 };
    this.activeTurn = 'forest';
    this.selectedItem = null;
    this.discoveredHotspots = new Set();
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderCurrentScene();
    this.updateHealthBar(this.jungleHealth);
    this.setupConfetti();
  }

  // Navigation
  goToScene(idx) {
    if (idx < 0 || idx >= window.JUNGLE_DATA.scenes.length) return;
    this.currentSceneIdx = idx;
    this.clearSelection();
    this.discoveredHotspots.clear();
    this.renderCurrentScene();
    window.jungleAudio.playClick();
  }

  nextScene() {
    if (this.currentSceneIdx < window.JUNGLE_DATA.scenes.length - 1) {
      this.goToScene(this.currentSceneIdx + 1);
    } else {
      this.showCertificate();
    }
  }

  prevScene() {
    if (this.currentSceneIdx > 0) {
      this.goToScene(this.currentSceneIdx - 1);
    }
  }

  // Scene Rendering
  renderCurrentScene() {
    const scene = window.JUNGLE_DATA.scenes[this.currentSceneIdx];
    if (!scene) return;

    // Header HUD
    const numEl = document.getElementById('hud-chapter-num');
    const titleEl = document.getElementById('hud-chapter-title');
    if (numEl) numEl.textContent = `Scene ${scene.num}`;
    if (titleEl) titleEl.textContent = scene.title;

    // Narration Speech
    const dialogueEl = document.getElementById('narrator-dialogue-text');
    const speakerEl = document.getElementById('narrator-speaker-name');
    if (dialogueEl && scene.narrator) {
      dialogueEl.innerHTML = this.formatDialogue(scene.narrator.text);
    }
    if (speakerEl && scene.narrator) {
      speakerEl.textContent = scene.narrator.speaker;
    }

    // Teacher HUD
    this.updateTeacherHUD(scene);

    // Render Scene Stage
    const stage = document.getElementById('stage-canvas-area');
    if (!stage) return;

    switch (scene.type) {
      case 'open_explore':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:14px; width:100%; max-width:1150px;">
              <div style="display:flex; justify-content:space-between; width:100%; align-items:center; background:rgba(0,0,0,0.5); padding:10px 24px; border-radius:var(--radius-full); border:1px solid rgba(255,255,255,0.25);">
                <span style="font-family:var(--font-display); font-size:1.2rem; color:#fef3c7; font-weight:800;">
                  👆 TAP any animal or plant to explore Green Valley!
                </span>
                <span class="prediction-badge" style="background:#059669;" id="explore-count">
                  Discovered: 0 / ${scene.hotspots.length}
                </span>
              </div>
              <div style="position:relative; width:100%; height:400px; background:linear-gradient(180deg, #38bdf8 0%, #86efac 45%, #15803d 85%); border-radius:var(--radius-xl); border:4px solid #10b981; overflow:hidden;">
                ${scene.hotspots.map(h => `
                  <button class="explore-spot-btn" data-id="${h.id}" style="position:absolute; left:${h.x}%; top:${h.y}%; transform:translate(-50%, -50%); background:none; border:none; cursor:pointer; touch-action:manipulation;">
                    <div style="background:rgba(255,255,255,0.95); border:3px solid #10b981; border-radius:var(--radius-full); padding:10px 18px; display:flex; align-items:center; gap:10px; box-shadow:var(--shadow-md);">
                      <span style="font-size:2.5rem;">${h.emoji}</span>
                      <span style="font-family:var(--font-display); font-weight:800; font-size:1.15rem; color:#065f46;">${h.name}</span>
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      case 'ranger_eyes':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:14px; width:100%; max-width:1100px;">
              <div style="font-family:var(--font-display); font-size:1.4rem; color:#fef3c7; font-weight:800;">
                🔎 RANGER EYES: Tap the 5 hidden animals in nature!
              </div>
              <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                ${scene.targets.map(t => `
                  <div class="target-check-pill" id="target-pill-${t}" style="background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.35); border-radius:var(--radius-full); padding:8px 18px; color:#fff; font-family:var(--font-display); font-size:1.1rem; font-weight:800;">
                    <span>${t.toUpperCase()}</span> <span>❓</span>
                  </div>
                `).join('')}
              </div>
              <div style="position:relative; width:100%; height:380px; background:#064e3b; border-radius:var(--radius-xl); border:4px solid #34d399; overflow:hidden;">
                <button class="nature-spot-btn" data-target="squirrel" style="position:absolute; top:25%; left:22%; background:none; border:none; padding:10px; cursor:pointer;">
                  ${window.jungleViews.getAnimalAvatar("squirrel", 85)}
                </button>
                <button class="nature-spot-btn" data-target="owl" style="position:absolute; top:18%; left:78%; background:none; border:none; padding:10px; cursor:pointer;">
                  ${window.jungleViews.getAnimalAvatar("owl", 80)}
                </button>
                <button class="nature-spot-btn" data-target="frog" style="position:absolute; top:68%; left:65%; background:none; border:none; padding:10px; cursor:pointer;">
                  ${window.jungleViews.getAnimalAvatar("frog", 85)}
                </button>
                <button class="nature-spot-btn" data-target="fox" style="position:absolute; top:58%; left:42%; background:none; border:none; padding:10px; cursor:pointer;">
                  ${window.jungleViews.getAnimalAvatar("fox", 85)}
                </button>
                <button class="nature-spot-btn" data-target="rabbit" style="position:absolute; top:70%; left:12%; background:none; border:none; padding:10px; cursor:pointer;">
                  ${window.jungleViews.getAnimalAvatar("rabbit", 80)}
                </button>
              </div>
            </div>
          </div>
        `;
        break;

      case 'who_am_i':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:850px;">
              <div class="prediction-badge" style="background:#0284c7;">🐾 WHO AM I?</div>
              <div style="background:#fff; border-radius:var(--radius-xl); border:4px solid #38bdf8; padding:26px; width:100%; box-shadow:var(--shadow-lg); text-align:center;">
                <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:18px;">
                  ${scene.clues.map(c => `
                    <div style="font-family:var(--font-display); font-size:1.4rem; font-weight:700; color:#1e293b; background:#f0f9ff; padding:12px 18px; border-radius:var(--radius-md); border-left:6px solid #0284c7;">
                      ${c}
                    </div>
                  `).join('')}
                </div>
                <div id="who-revealed" style="display:none; margin:14px 0;">
                  ${window.jungleViews.getAnimalAvatar(scene.animalId, 120)}
                  <div style="font-family:var(--font-display); font-size:2.2rem; font-weight:900; color:#059669; margin-top:8px;">
                    IT'S A ${scene.name}! 🌟
                  </div>
                </div>
                <button class="hud-btn hud-btn-teacher" id="btn-reveal-who" style="font-size:1.25rem; padding:14px 32px; margin-top:10px;">
                  <span>👁️ REVEAL ANIMAL ➔</span>
                </button>
              </div>
            </div>
          </div>
        `;
        break;

      case 'where_live':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1150px;">
              <div style="font-family:var(--font-display); font-size:1.35rem; color:#fef3c7; font-weight:800;">
                👇 STEP 1: Tap Animal ➔ STEP 2: Tap its Real Home Environment!
              </div>
              <div class="habitat-zones-container">
                <div class="habitat-zone-card forest-zone tap-target biome-target" data-biome="forest">
                  <div class="habitat-header">Forest 🌲</div>
                  <div class="habitat-actor-slot" id="slot-forest">❓ Tap Here</div>
                  <div class="habitat-tag">Trees, moss & acorns</div>
                </div>
                <div class="habitat-zone-card pond-zone tap-target biome-target" data-biome="pond">
                  <div class="habitat-header">Pond 💧</div>
                  <div class="habitat-actor-slot" id="slot-pond">❓ Tap Here</div>
                  <div class="habitat-tag">Water & lily pads</div>
                </div>
                <div class="habitat-zone-card river-zone tap-target biome-target" data-biome="river">
                  <div class="habitat-header">River 🌊</div>
                  <div class="habitat-actor-slot" id="slot-river">❓ Tap Here</div>
                  <div class="habitat-tag">Flowing clean water</div>
                </div>
                <div class="habitat-zone-card grassland-zone tap-target biome-target" data-biome="grassland">
                  <div class="habitat-header">Grassland 🌾</div>
                  <div class="habitat-actor-slot" id="slot-grassland">❓ Tap Here</div>
                  <div class="habitat-tag">Tall grass & clover</div>
                </div>
              </div>
              <div class="items-palette">
                ${scene.pairs.map(p => `
                  <button class="item-card tap-item biome-animal-btn" data-id="${p.id}" data-target="${p.target}" style="padding:14px 22px;">
                    <span class="item-label" style="font-size:1.3rem;">${p.name}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      case 'what_need':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; max-width:1050px;">
              <div style="font-family:var(--font-display); font-size:1.4rem; color:#fef3c7; font-weight:800;">
                👇 STEP 1: Tap a Need Item ➔ STEP 2: Tap Suki to Deliver It!
              </div>
              <div class="animal-stage-actor tap-target" id="target-suki-needs" data-target="suki-needs" style="background:rgba(255,255,255,0.18); border:4px dashed #34d399; border-radius:var(--radius-xl); padding:20px 40px; cursor:pointer;">
                ${window.jungleViews.getAnimalAvatar("squirrel", 120)}
                <div class="actor-name-tag">🐿️ Suki's Needs Delivered!</div>
              </div>
              <div class="items-palette">
                ${scene.items.map(it => `
                  <button class="item-card tap-item needs-item-btn" data-need="${it.id}">
                    <span class="item-label" style="font-size:1.3rem;">${it.name}</span>
                    <span style="font-size:0.9rem; color:#475569;">${it.desc}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      case 'homes':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1050px;">
              <div class="prediction-badge" style="background:#d97706;">
                🏠 SHELTER = A safe place to rest and hide from danger
              </div>
              <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:16px; width:100%;">
                ${scene.pairs.map(p => `
                  <div style="background:#fff; border-radius:var(--radius-xl); border:3px solid #10b981; padding:18px 24px; display:flex; align-items:center; justify-content:space-between; box-shadow:var(--shadow-md);">
                    <div style="font-family:var(--font-display); font-size:1.4rem; font-weight:800; color:#1e293b;">
                      ${p.animal}
                    </div>
                    <span style="font-size:2rem; color:#10b981;">➔</span>
                    <div style="background:#ecfdf5; border:2px solid #34d399; border-radius:var(--radius-full); padding:8px 22px; font-family:var(--font-display); font-size:1.3rem; font-weight:800; color:#065f46;">
                      ${p.shelter}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      case 'habitat_reveal':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="background:rgba(255,255,255,0.97); border-radius:var(--radius-xl); border:4px solid #10b981; padding:28px; text-align:center; max-width:900px; box-shadow:var(--shadow-lg);">
              <div style="font-family:var(--font-display); font-size:2.4rem; font-weight:900; color:#065f46; margin-bottom:12px;">
                🏡 HABITAT = An Animal's Home
              </div>
              <div style="display:flex; justify-content:space-around; align-items:center; margin:20px 0; background:#f0fdf4; padding:20px; border-radius:var(--radius-lg);">
                <span style="font-size:3.5rem;">🐸</span>
                <span style="font-size:2rem;">+</span>
                <span style="font-size:3.5rem;">💧</span>
                <span style="font-size:2rem;">+</span>
                <span style="font-size:3.5rem;">🌿</span>
                <span style="font-size:2rem;">=</span>
                <span style="font-family:var(--font-display); font-size:1.8rem; font-weight:900; color:#0284c7;">Pond Habitat</span>
              </div>
              <p style="font-size:1.3rem; color:#334155; font-weight:700;">
                A habitat gives an animal food, water, and shelter to stay alive!
              </p>
            </div>
          </div>
        `;
        break;

      case 'food_feeder':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:18px; width:100%; max-width:1100px;">
              <div style="font-family:var(--font-display); font-size:1.35rem; color:#fef3c7; font-weight:800;">
                👇 STEP 1: Tap Food ➔ STEP 2: Tap the Animal to Feed It!
              </div>
              <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
                ${scene.pairs.map(p => `
                  <div class="animal-stage-actor tap-target feed-animal-target" data-animal="${p.animalId}" style="padding:14px 20px; background:#fff; border-radius:var(--radius-xl); border:4px solid #cbd5e1; cursor:pointer;">
                    ${window.jungleViews.getAnimalAvatar(p.animalId, 95)}
                    <div class="actor-name-tag" style="font-size:1.05rem;">${p.animal}</div>
                    <div class="fed-status-tag" style="font-size:0.9rem; color:#059669; font-weight:800; margin-top:4px;">Hungry 😋</div>
                  </div>
                `).join('')}
              </div>
              <div class="items-palette">
                ${scene.pairs.map(p => `
                  <button class="item-card tap-item feed-food-btn" data-animal-match="${p.animalId}">
                    <span class="item-emoji">${p.foodEmoji}</span>
                    <span class="item-label">${p.foodName}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      case 'predator_prey':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1000px;">
              <div style="font-family:var(--font-display); font-size:1.5rem; color:#fef3c7; font-weight:800; text-align:center;">
                🦊 WHO EATS WHO? (Predator vs Prey)
              </div>
              <div style="display:flex; align-items:center; justify-content:center; gap:20px; width:100%; background:rgba(255,255,255,0.97); padding:24px; border-radius:var(--radius-xl); box-shadow:var(--shadow-lg);">
                <div style="text-align:center;">
                  <span style="font-size:3.8rem;">🌱</span>
                  <div style="font-family:var(--font-display); font-weight:800; color:#15803d; font-size:1.2rem;">Green Plant</div>
                  <div style="font-size:0.9rem; color:#475569;">Producer</div>
                </div>
                <span style="font-size:2.8rem; color:#f59e0b;">➔</span>
                <div style="text-align:center;">
                  ${window.jungleViews.getAnimalAvatar("rabbit", 95)}
                  <div style="font-family:var(--font-display); font-weight:800; color:#0369a1; font-size:1.2rem;">Rabbit 🐇</div>
                  <div class="prediction-badge" style="background:#0284c7; font-size:0.9rem; padding:4px 12px; margin-top:4px;">PREY 🐇</div>
                </div>
                <span style="font-size:2.8rem; color:#f59e0b;">➔</span>
                <div style="text-align:center;">
                  ${window.jungleViews.getAnimalAvatar("fox", 95)}
                  <div style="font-family:var(--font-display); font-weight:800; color:#b91c1c; font-size:1.2rem;">Fox 🦊</div>
                  <div class="prediction-badge" style="background:#dc2626; font-size:0.9rem; padding:4px 12px; margin-top:4px;">PREDATOR 🦊</div>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case 'food_chain':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:18px; width:100%; max-width:1000px;">
              <div style="font-family:var(--font-display); font-size:1.45rem; color:#fef3c7; font-weight:800;">
                👇 Build the Food Chain: Tap 1. Plant 🌱 ➔ Tap 2. Rabbit 🐇 ➔ Tap 3. Fox 🦊
              </div>
              <div style="display:flex; gap:18px; justify-content:center; width:100%;">
                <div class="tap-target chain-slot" data-step="1" style="flex:1; max-width:220px; height:180px; background:#fff; border:4px dashed #10b981; border-radius:var(--radius-xl); display:flex; flex-direction:column; align-items:center; justify-content:center;">
                  <span style="font-family:var(--font-display); font-weight:900; color:#10b981; font-size:1.4rem;">1. Producer</span>
                  <span class="slot-val" style="font-size:3rem; margin-top:8px;">❓</span>
                </div>
                <div style="font-size:2.5rem; color:#f59e0b; align-self:center;">➔</div>
                <div class="tap-target chain-slot" data-step="2" style="flex:1; max-width:220px; height:180px; background:#fff; border:4px dashed #0284c7; border-radius:var(--radius-xl); display:flex; flex-direction:column; align-items:center; justify-content:center;">
                  <span style="font-family:var(--font-display); font-weight:900; color:#0284c7; font-size:1.4rem;">2. Prey</span>
                  <span class="slot-val" style="font-size:3rem; margin-top:8px;">❓</span>
                </div>
                <div style="font-size:2.5rem; color:#f59e0b; align-self:center;">➔</div>
                <div class="tap-target chain-slot" data-step="3" style="flex:1; max-width:220px; height:180px; background:#fff; border:4px dashed #dc2626; border-radius:var(--radius-xl); display:flex; flex-direction:column; align-items:center; justify-content:center;">
                  <span style="font-family:var(--font-display); font-weight:900; color:#dc2626; font-size:1.4rem;">3. Predator</span>
                  <span class="slot-val" style="font-size:3rem; margin-top:8px;">❓</span>
                </div>
              </div>
              <div class="items-palette">
                <button class="item-card tap-item chain-btn" data-step="1" data-emoji="🌱">
                  <span class="item-emoji">🌱</span>
                  <span class="item-label">Green Plant</span>
                </button>
                <button class="item-card tap-item chain-btn" data-step="2" data-emoji="🐇">
                  <span class="item-emoji">🐇</span>
                  <span class="item-label">Rabbit (Prey)</span>
                </button>
                <button class="item-card tap-item chain-btn" data-step="3" data-emoji="🦊">
                  <span class="item-emoji">🦊</span>
                  <span class="item-label">Fox (Predator)</span>
                </button>
              </div>
            </div>
          </div>
        `;
        break;

      case 'ecosystem_map':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:14px; width:100%; max-width:1100px;">
              <div style="font-family:var(--font-display); font-size:1.6rem; color:#fbbf24; font-weight:900;">
                🌎 ECOSYSTEM = Everything is Connected!
              </div>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:14px; width:100%;">
                <div style="background:#fff; border:3px solid #10b981; border-radius:var(--radius-xl); padding:18px; text-align:center;">
                  <div style="font-family:var(--font-display); font-size:1.3rem; font-weight:900; color:#065f46;">🌲 Forest ➔ 🐿️ Squirrel</div>
                  <div style="color:#475569; font-weight:700; margin-top:4px;">Gives shelter & acorns</div>
                </div>
                <div style="background:#fff; border:3px solid #10b981; border-radius:var(--radius-xl); padding:18px; text-align:center;">
                  <div style="font-family:var(--font-display); font-size:1.3rem; font-weight:900; color:#065f46;">💧 River ➔ 🦝 Raccoon</div>
                  <div style="color:#475569; font-weight:700; margin-top:4px;">Clean drinking water</div>
                </div>
                <div style="background:#fff; border:3px solid #10b981; border-radius:var(--radius-xl); padding:18px; text-align:center;">
                  <div style="font-family:var(--font-display); font-size:1.3rem; font-weight:900; color:#065f46;">🌿 Plant ➔ 🐇 Rabbit</div>
                  <div style="color:#475569; font-weight:700; margin-top:4px;">Primary food energy</div>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case 'word_wall_view':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="background:rgba(255,255,255,0.97); border-radius:var(--radius-xl); border:4px solid #10b981; padding:24px; text-align:center; max-width:960px;">
              <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:900; color:#065f46; margin-bottom:12px;">
                🖼️ VISUAL VOCABULARY WORD WALL
              </div>
              <p style="font-size:1.2rem; color:#334155; font-weight:700; margin-bottom:16px;">
                Tap any vocabulary word below to hear it spoken and see its meaning!
              </p>
              <button class="hud-btn hud-btn-teacher" id="btn-open-wall-from-scene" style="font-size:1.3rem; padding:14px 32px; margin:0 auto;">
                <span>🖼️ OPEN FULL WORD WALL ➔</span>
              </button>
            </div>
          </div>
        `;
        break;

      case 'story_preview':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1100px;">
              <div style="font-family:var(--font-display); font-size:1.45rem; color:#fef3c7; font-weight:800;">
                🔮 Story Preview: What will happen in Green Valley?
              </div>
              <div style="display:flex; gap:14px; width:100%; justify-content:center;">
                <div style="flex:1; max-width:260px; background:#fff; border-radius:var(--radius-xl); padding:18px 14px; text-align:center; border:3px solid #cbd5e1;">
                  <div style="font-size:2.8rem;">🌿</div>
                  <div style="font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:#065f46;">1. Living Jungle</div>
                </div>
                <div style="flex:1; max-width:260px; background:#fff; border-radius:var(--radius-xl); padding:18px 14px; text-align:center; border:3px solid #cbd5e1;">
                  <div style="font-size:2.8rem;">⛈️</div>
                  <div style="font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:#ef4444;">2. Big Storm</div>
                </div>
                <div style="flex:1; max-width:260px; background:#fff; border-radius:var(--radius-xl); padding:18px 14px; text-align:center; border:3px solid #cbd5e1;">
                  <div style="font-size:2.8rem;">🐾</div>
                  <div style="font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:#d97706;">3. Animals in Need</div>
                </div>
                <div style="flex:1; max-width:260px; background:#fff; border-radius:var(--radius-xl); padding:18px 14px; text-align:center; border:3px solid #cbd5e1;">
                  <div style="font-size:2.8rem;">🎖️</div>
                  <div style="font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:#0284c7;">4. Rangers Rescue</div>
                </div>
              </div>
              <button class="hud-btn hud-btn-teacher" id="btn-enter-storm-story" style="margin-top:14px; font-size:1.35rem; padding:16px 36px; background:linear-gradient(135deg, #ef4444, #b91c1c); border-color:#fca5a5;">
                <span>⛈️ ENTER THE GREAT STORM ➔</span>
              </button>
            </div>
          </div>
        `;
        break;

      case 'storm_event':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px;">
              <div class="lightning-flash" id="lightning-fx"></div>
              <div style="font-family:var(--font-display); font-size:2.6rem; color:#fca5a5; font-weight:900;">
                ⛈️ JUNGLE EMERGENCY ALERT! 🚨
              </div>
              <div style="font-family:var(--font-display); font-size:1.4rem; color:#f8fafc; max-width:750px;">
                A fierce storm struck Green Valley! Trees have fallen and water is dirty!
              </div>
              <button class="hud-btn hud-btn-teacher" id="btn-start-rescue" style="font-size:1.3rem; padding:16px 36px; background:linear-gradient(135deg, #10b981, #059669); border-color:#6ee7b7; margin-top:20px;">
                <span>🛡️ START RESCUE MISSIONS ➔</span>
              </button>
            </div>
          </div>
        `;
        this.triggerStormFX();
        break;

      case 'prediction':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; max-width:900px;">
              <div class="prediction-badge" style="background:#0284c7;">🔮 PREDICTION CHALLENGE</div>
              <div class="choice-cards-row">
                ${scene.options.map(opt => `
                  <button class="choice-card-btn pred-choice-btn" data-correct="${opt.correct}">
                    <div class="choice-letter">${opt.id}</div>
                    <div class="choice-text">${opt.text}</div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      case 'suki_habitat':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%;">
              <div style="font-family:var(--font-display); font-size:1.35rem; color:#fef3c7; font-weight:800;">
                👇 STEP 1: Tap Suki ➔ STEP 2: Tap the Forest Habitat!
              </div>
              <button class="animal-stage-actor tap-item" id="suki-actor-btn" style="background:none; border:none;">
                ${window.jungleViews.getAnimalAvatar("squirrel", 115)}
                <div class="actor-name-tag">🐿️ Suki the Squirrel</div>
              </button>
              <div class="habitat-zones-container">
                <div class="habitat-zone-card forest-zone tap-target suki-zone-target" data-correct="true">
                  <div class="habitat-header">Forest 🌲</div>
                  <div class="habitat-actor-slot" id="slot-suki-forest">❓ Tap Here</div>
                  <div class="habitat-tag">Trees, leaves & acorns</div>
                </div>
                <div class="habitat-zone-card pond-zone tap-target suki-zone-target" data-correct="false">
                  <div class="habitat-header">Pond 💧</div>
                  <div class="habitat-actor-slot">❌</div>
                  <div class="habitat-tag">Water only</div>
                </div>
                <div class="habitat-zone-card desert-zone tap-target suki-zone-target" data-correct="false">
                  <div class="habitat-header">Desert 🏜️</div>
                  <div class="habitat-actor-slot">❌</div>
                  <div class="habitat-tag">No trees</div>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case 'detective_mystery':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; max-width:900px;">
              <div class="prediction-badge" style="background:#0284c7;">🔎 RANGER DETECTIVE</div>
              <div class="choice-cards-row">
                ${scene.options.map(opt => `
                  <button class="choice-card-btn detective-btn" data-correct="${opt.correct}">
                    <span style="font-size:3rem;">${opt.emoji}</span>
                    <div class="choice-text">${opt.name}</div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      case 'timeline_view':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; max-width:1050px;">
              <div style="font-family:var(--font-display); font-size:1.4rem; color:#fef3c7; font-weight:800;">
                🔢 Cause & Effect Sequence: 1 ➔ 2 ➔ 3 ➔ 4
              </div>
              <div style="display:flex; gap:16px; width:100%; justify-content:center;">
                <div class="item-card" style="flex:1;"><span class="item-emoji">⛈️</span><span class="item-label">1. Storm</span></div>
                <div class="item-card" style="flex:1;"><span class="item-emoji">🌳💥</span><span class="item-label">2. Tree Falls</span></div>
                <div class="item-card" style="flex:1;"><span class="item-emoji">🐿️💔</span><span class="item-label">3. Loses Shelter</span></div>
                <div class="item-card" style="flex:1;"><span class="item-emoji">🔎🏡</span><span class="item-label">4. Searches Home</span></div>
              </div>
            </div>
          </div>
        `;
        break;

      case 'prediction_token':
        stage.innerHTML = `
          <div class="stage-board">
            <div class="prediction-machine-stage">
              <div style="font-family:var(--font-display); font-size:1.5rem; color:#fbbf24; font-weight:900;">
                ⚙️ JUNGLE PREDICTION MACHINE
              </div>
              <div class="sentence-builder-display">
                <span class="sentence-chunk">The fish</span>
                <div class="sentence-slot-token" id="token-slot">______</div>
                <span class="sentence-chunk">survive without clean water.</span>
              </div>
              <div class="modal-word-bank">
                ${scene.tokens.map(tok => `
                  <button class="word-token-btn machine-token-btn" data-token="${tok}" data-correct="${tok === scene.correct}">${tok}</button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      case 'speaking_studio':
        stage.innerHTML = `
          <div class="stage-board">
            <div class="speaking-report-stage">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-family:var(--font-display); font-size:1.8rem; color:var(--primary-dark); font-weight:900;">
                  🎙️ OFFICIAL RANGER SPEAKING REPORT
                </div>
                <div class="prediction-badge" style="background:#059669;">A1+ Speaking</div>
              </div>
              <div class="report-sentence-grid">
                <div class="report-sentence-line"><span>This is a</span> <span class="report-fill-pill">🐸 Poppy the Frog</span>.</div>
                <div class="report-sentence-line"><span>It lives</span> <span class="report-fill-pill">near ponds and wetlands</span>.</div>
                <div class="report-sentence-line"><span>It eats</span> <span class="report-fill-pill">insects and flies</span>.</div>
                <div class="report-sentence-line"><span>It needs</span> <span class="report-fill-pill">clean water for its skin</span>.</div>
                <div class="report-sentence-line"><span>If <b>the pond dries</b>, it will</span> <span class="report-fill-pill">look for another wet place</span>.</div>
              </div>
              <div class="report-actions-row">
                <button class="report-btn report-btn-speak" id="btn-read-report"><span>🔊 Read Aloud</span></button>
                <button class="report-btn report-btn-cert" id="btn-cert"><span>🎖️ Ranger Certificate</span></button>
              </div>
            </div>
          </div>
        `;
        break;

      default:
        stage.innerHTML = `<div class="stage-board"><div style="color:#fff;">Loading...</div></div>`;
    }

    this.attachSceneHandlers(scene);

    if (window.jungleAudio.isSpeechEnabled && scene.narrator) {
      window.jungleAudio.speak(scene.narrator.text);
    }
  }

  formatDialogue(text) {
    return text
      .replace(/\b(will|WILL)\b/g, '<span style="color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:8px;">$1</span>')
      .replace(/\b(might|MIGHT|may|MAY|could|COULD)\b/g, '<span style="color:#7c3aed; background:#ede9fe; padding:2px 8px; border-radius:8px;">$1</span>')
      .replace(/\b(if|IF|If)\b/g, '<span style="color:#d97706; background:#fef3c7; padding:2px 8px; border-radius:8px;">$1</span>')
      .replace(/\b(HABITAT|PREDATOR|PREY|ECOSYSTEM|SHELTER|FOOD)\b/g, '<span style="color:#059669; font-weight:800; text-decoration:underline;">$1</span>');
  }

  // TAP ➔ TAP State Management
  selectItem(el) {
    this.clearSelection();
    this.selectedItem = el;
    el.classList.add('is-selected');
    document.querySelectorAll('.tap-target').forEach(tgt => tgt.classList.add('target-available'));
    window.jungleAudio.playClick();
  }

  clearSelection() {
    if (this.selectedItem) {
      this.selectedItem.classList.remove('is-selected');
      this.selectedItem = null;
    }
    document.querySelectorAll('.tap-target').forEach(tgt => tgt.classList.remove('target-available'));
  }

  attachSceneHandlers(scene) {
    // 1. Tap Items
    document.querySelectorAll('.tap-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.selectedItem === item) {
          this.clearSelection();
        } else {
          this.selectItem(item);
        }
      });
    });

    // 2. Open Explore Hotspots
    document.querySelectorAll('.explore-spot-btn').forEach(spot => {
      spot.addEventListener('click', () => {
        const id = spot.getAttribute('data-id');
        const animal = window.JUNGLE_DATA.animals[id];
        if (animal) {
          window.jungleAudio.speak(animal.name);
          spot.classList.add('anim-hop-in');
          this.discoveredHotspots.add(id);
          const count = document.getElementById('explore-count');
          if (count) count.textContent = `Discovered: ${this.discoveredHotspots.size} / ${scene.hotspots.length}`;
          this.addTeamPoint(this.activeTurn, 1);
        }
      });
    });

    // 3. Nature Spot Targets (Chapter 2)
    document.querySelectorAll('.nature-spot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        const pill = document.getElementById(`target-pill-${target}`);
        if (pill) {
          pill.style.background = '#059669';
          pill.style.borderColor = '#6ee7b7';
          pill.innerHTML = `<span>${target.toUpperCase()}</span> <span>✅</span>`;
          window.jungleAudio.playSuccess();
          this.addTeamPoint(this.activeTurn, 1);
        }
      });
    });

    // 4. Who Am I Reveal
    const revealWhoBtn = document.getElementById('btn-reveal-who');
    if (revealWhoBtn) {
      revealWhoBtn.addEventListener('click', () => {
        const rev = document.getElementById('who-revealed');
        if (rev) rev.style.display = 'block';
        window.jungleAudio.playSuccess();
        this.addTeamPoint(this.activeTurn, 2);
        revealWhoBtn.style.display = 'none';
      });
    }

    // 5. Where Live Biomes
    document.querySelectorAll('.biome-target').forEach(tgt => {
      tgt.addEventListener('click', () => {
        if (this.selectedItem && this.selectedItem.classList.contains('biome-animal-btn')) {
          const expected = this.selectedItem.getAttribute('data-target');
          const biome = tgt.getAttribute('data-biome');
          if (expected === biome) {
            const label = this.selectedItem.querySelector('.item-label')?.textContent || '';
            const slot = tgt.querySelector('.habitat-actor-slot');
            if (slot) slot.textContent = `✅ ${label}`;
            tgt.classList.add('anim-hop-in');
            this.selectedItem.style.display = 'none';
            this.clearSelection();
            window.jungleAudio.playSuccess();
            this.addTeamPoint(this.activeTurn, 1);
          } else {
            tgt.classList.add('shake-target');
            window.jungleAudio.playHint();
            setTimeout(() => tgt.classList.remove('shake-target'), 600);
          }
        }
      });
    });

    // 6. Suki Needs Target
    const sukiNeedsTgt = document.getElementById('target-suki-needs');
    if (sukiNeedsTgt) {
      sukiNeedsTgt.addEventListener('click', () => {
        if (this.selectedItem && this.selectedItem.classList.contains('needs-item-btn')) {
          this.selectedItem.style.display = 'none';
          this.clearSelection();
          sukiNeedsTgt.classList.add('anim-hop-in');
          window.jungleAudio.playSuccess();
          this.addTeamPoint(this.activeTurn, 1);
        }
      });
    }

    // 7. Feeding Target
    document.querySelectorAll('.feed-animal-target').forEach(tgt => {
      tgt.addEventListener('click', () => {
        if (this.selectedItem && this.selectedItem.classList.contains('feed-food-btn')) {
          const animalId = tgt.getAttribute('data-animal');
          const match = this.selectedItem.getAttribute('data-animal-match');
          if (animalId === match) {
            const status = tgt.querySelector('.fed-status-tag');
            if (status) status.textContent = 'Full & Happy! 💚';
            tgt.classList.add('anim-hop-in');
            this.selectedItem.style.display = 'none';
            this.clearSelection();
            window.jungleAudio.playMunch();
            this.addTeamPoint(this.activeTurn, 1);
          } else {
            tgt.classList.add('shake-target');
            window.jungleAudio.playHint();
            setTimeout(() => tgt.classList.remove('shake-target'), 600);
          }
        }
      });
    });

    // 8. Food Chain Slots
    document.querySelectorAll('.chain-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        if (this.selectedItem && this.selectedItem.classList.contains('chain-btn')) {
          const slotStep = slot.getAttribute('data-step');
          const cardStep = this.selectedItem.getAttribute('data-step');
          if (slotStep === cardStep) {
            const emoji = this.selectedItem.getAttribute('data-emoji');
            slot.querySelector('.slot-val').textContent = emoji;
            slot.classList.add('anim-hop-in');
            this.selectedItem.style.display = 'none';
            this.clearSelection();
            window.jungleAudio.playSuccess();
            this.addTeamPoint(this.activeTurn, 1);
          } else {
            slot.classList.add('shake-target');
            window.jungleAudio.playHint();
            setTimeout(() => slot.classList.remove('shake-target'), 600);
          }
        }
      });
    });

    // 9. Suki Habitat Rescue
    document.querySelectorAll('.suki-zone-target').forEach(zone => {
      zone.addEventListener('click', () => {
        if (this.selectedItem && this.selectedItem.id === 'suki-actor-btn') {
          const isCorrect = zone.getAttribute('data-correct') === 'true';
          if (isCorrect) {
            document.getElementById('slot-suki-forest').textContent = '🐿️ Safe!';
            zone.classList.add('anim-hop-in');
            this.selectedItem.style.display = 'none';
            this.clearSelection();
            window.jungleAudio.playSuccess();
            this.addTeamPoint(this.activeTurn, 2);
          } else {
            zone.classList.add('shake-target');
            window.jungleAudio.playHint();
            setTimeout(() => zone.classList.remove('shake-target'), 600);
          }
        }
      });
    });

    // 10. Prediction & Detective Choices
    document.querySelectorAll('.pred-choice-btn, .detective-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        if (isCorrect) {
          btn.classList.add('correct-choice');
          window.jungleAudio.playSuccess();
          this.changeHealth(10);
          this.addTeamPoint(this.activeTurn, 2);
        } else {
          btn.classList.add('shake-target');
          window.jungleAudio.playHint();
          setTimeout(() => btn.classList.remove('shake-target'), 600);
        }
      });
    });

    // 11. Prediction Machine Tokens
    document.querySelectorAll('.machine-token-btn').forEach(tok => {
      tok.addEventListener('click', () => {
        const token = tok.getAttribute('data-token');
        const isCorrect = tok.getAttribute('data-correct') === 'true';
        const slot = document.getElementById('token-slot');
        if (slot) {
          slot.textContent = token;
          if (isCorrect) {
            slot.classList.add('anim-hop-in');
            window.jungleAudio.playSuccess();
            this.addTeamPoint(this.activeTurn, 2);
          } else {
            slot.classList.add('shake-target');
            window.jungleAudio.playHint();
            setTimeout(() => slot.classList.remove('shake-target'), 600);
          }
        }
      });
    });

    // 12. Transitions & Speaking Studio
    const startStoryBtn = document.getElementById('btn-enter-storm-story');
    if (startStoryBtn) startStoryBtn.addEventListener('click', () => this.nextScene());

    const rescueBtn = document.getElementById('btn-start-rescue');
    if (rescueBtn) rescueBtn.addEventListener('click', () => this.nextScene());

    const openWallSceneBtn = document.getElementById('btn-open-wall-from-scene');
    if (openWallSceneBtn) openWallSceneBtn.addEventListener('click', () => this.openWordWall());

    const speakReportBtn = document.getElementById('btn-read-report');
    if (speakReportBtn) {
      speakReportBtn.addEventListener('click', () => {
        window.jungleAudio.speak("This is Poppy the Frog. It lives near ponds and wetlands. It eats insects and flies. It needs clean water for its skin. If the pond dries, it will look for another wet place.");
      });
    }

    const certBtn = document.getElementById('btn-cert');
    if (certBtn) certBtn.addEventListener('click', () => this.showCertificate());
  }

  // Health System
  changeHealth(delta) {
    this.jungleHealth = Math.max(10, Math.min(100, this.jungleHealth + delta));
    this.updateHealthBar(this.jungleHealth);
  }

  updateHealthBar(health) {
    const fill = document.getElementById('jungle-health-fill');
    const pct = document.getElementById('jungle-health-pct');
    const viewport = document.getElementById('stage-viewport');
    if (fill) fill.style.width = `${health}%`;
    if (pct) pct.textContent = `${health}%`;
    if (viewport) {
      if (health < 40) viewport.classList.add('polluted-mode');
      else if (health >= 80) viewport.classList.add('healthy-mode');
      else viewport.classList.remove('polluted-mode', 'healthy-mode');
    }
  }

  triggerStormFX() {
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
    setTimeout(() => window.jungleAudio.playTreeCrash(), 1800);
  }

  // Teams
  addTeamPoint(team, points = 1) {
    if (!this.scores[team] && this.scores[team] !== 0) return;
    this.scores[team] += points;
    const scoreEl = document.getElementById(`score-${team}`);
    if (scoreEl) scoreEl.textContent = this.scores[team];
    window.jungleAudio.playStarPoint();
    this.launchConfetti(25);
  }

  switchActiveTurn(team) {
    this.activeTurn = team;
    document.querySelectorAll('.team-score-card').forEach(c => c.classList.remove('active-turn'));
    const card = document.getElementById(`team-card-${team}`);
    if (card) card.classList.add('active-turn');
  }

  // Teacher HUD
  updateTeacherHUD(scene) {
    const say = document.getElementById('teacher-script-say');
    const doEl = document.getElementById('teacher-script-do');
    const sel = document.getElementById('teacher-chapter-select');
    if (scene.guide) {
      if (say) say.textContent = scene.guide.say;
      if (doEl) doEl.textContent = scene.guide.do;
    }
    if (sel) sel.value = this.currentSceneIdx;
  }

  toggleTeacherDrawer() {
    const drawer = document.getElementById('teacher-drawer');
    const btn = document.getElementById('btn-toggle-teacher');
    if (drawer) {
      drawer.classList.toggle('open');
      if (btn) btn.classList.toggle('active');
    }
  }

  // Word Wall
  openWordWall() {
    const modal = document.getElementById('word-wall-modal');
    if (modal) {
      window.jungleViews.renderVisualWordWall(modal);
      modal.classList.add('active');

      document.querySelectorAll('.word-wall-card').forEach(card => {
        card.addEventListener('click', () => {
          const word = card.getAttribute('data-word');
          const desc = card.getAttribute('data-desc');
          window.jungleAudio.speak(`${word}. ${desc}`);
          card.classList.add('anim-hop-in');
          setTimeout(() => card.classList.remove('anim-hop-in'), 500);
        });
      });

      const closeBtn = document.getElementById('btn-close-word-wall');
      if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
  }

  // Certificate
  showCertificate() {
    const modal = document.getElementById('certificate-modal');
    if (modal) {
      document.getElementById('cert-forest-score').textContent = this.scores.forest;
      document.getElementById('cert-river-score').textContent = this.scores.river;
      modal.classList.add('active');
      window.jungleAudio.playFanfare();
      this.launchConfetti(120);
    }
  }

  hideCertificate() {
    const modal = document.getElementById('certificate-modal');
    if (modal) modal.classList.remove('active');
  }

  // Global Event Listeners
  bindEvents() {
    const nextBtn = document.getElementById('nav-btn-next');
    const prevBtn = document.getElementById('nav-btn-prev');
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextScene());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevScene());

    const teacherToggle = document.getElementById('btn-toggle-teacher');
    const teacherClose = document.getElementById('btn-close-teacher-drawer');
    if (teacherToggle) teacherToggle.addEventListener('click', () => this.toggleTeacherDrawer());
    if (teacherClose) teacherClose.addEventListener('click', () => this.toggleTeacherDrawer());

    const wordWallBtn = document.getElementById('btn-open-word-wall');
    if (wordWallBtn) wordWallBtn.addEventListener('click', () => this.openWordWall());

    const muteBtn = document.getElementById('btn-toggle-mute');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = window.jungleAudio.toggleMute();
        muteBtn.innerHTML = isMuted ? '<span>🔇</span>' : '<span>🔊</span>';
      });
    }

    const narrateBtn = document.getElementById('narrator-speak-btn');
    if (narrateBtn) {
      narrateBtn.addEventListener('click', () => {
        const scene = window.JUNGLE_DATA.scenes[this.currentSceneIdx];
        if (scene && scene.narrator) window.jungleAudio.speak(scene.narrator.text);
      });
    }

    const fullBtn = document.getElementById('btn-toggle-fullscreen');
    if (fullBtn) {
      fullBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        else document.exitFullscreen();
      });
    }

    const addForest = document.getElementById('btn-add-forest');
    const addRiver = document.getElementById('btn-add-river');
    if (addForest) {
      addForest.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addTeamPoint('forest', 1);
        this.switchActiveTurn('forest');
      });
    }
    if (addRiver) {
      addRiver.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addTeamPoint('river', 1);
        this.switchActiveTurn('river');
      });
    }

    // Soundboard
    document.querySelectorAll('[data-fx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const fx = btn.getAttribute('data-fx');
        if (fx === 'wind') window.jungleAudio.playWind();
        if (fx === 'thunder') window.jungleAudio.playThunder();
        if (fx === 'crash') window.jungleAudio.playTreeCrash();
        if (fx === 'munch') window.jungleAudio.playMunch();
        if (fx === 'fanfare') window.jungleAudio.playFanfare();
      });
    });

    // Populate Teacher Dropdown
    const sel = document.getElementById('teacher-chapter-select');
    if (sel) {
      window.JUNGLE_DATA.scenes.forEach((s, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `Scene ${s.num}: ${s.title}`;
        sel.appendChild(opt);
      });
      sel.addEventListener('change', (e) => this.goToScene(parseInt(e.target.value)));
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') this.nextScene();
      else if (e.key === 'ArrowLeft') this.prevScene();
      else if (e.key === 't' || e.key === 'T') this.toggleTeacherDrawer();
      else if (e.key === 'w' || e.key === 'W') this.openWordWall();
    });
  }

  // Confetti
  setupConfetti() {
    this.canvas = document.getElementById('confetti-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  launchConfetti(count = 30) {
    const colors = ['#10b981', '#f59e0b', '#38bdf8', '#fbbf24', '#f43f5e', '#a78bfa'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: -20,
        r: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 5 + 3,
        tilt: Math.random() * 10,
        tiltSpeed: Math.random() * 0.1 + 0.05
      });
    }
    this.animateConfetti();
  }

  animateConfetti() {
    if (!this.ctx || this.particles.length === 0) return;
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.tilt += p.tiltSpeed;
      this.ctx.beginPath();
      this.ctx.fillStyle = p.color;
      this.ctx.ellipse(p.x, p.y, p.r, p.r / 2, p.tilt, 0, Math.PI * 2);
      this.ctx.fill();

      if (p.y > window.innerHeight) this.particles.splice(i, 1);
    }

    if (this.particles.length > 0) requestAnimationFrame(() => this.animateConfetti());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.jungleGame = new JungleGameEngine();
});
