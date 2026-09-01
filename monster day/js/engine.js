/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Zero-Fail TAP ➔ TAP Engine with Storybook Visual Hierarchy
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

  // =========================================================================
  // SCENE RENDERER (IMAGE-FIRST VISUAL HIERARCHY)
  // =========================================================================
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
      // 1. Open Explore Green Valley
      case 'open_explore':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:12px; width:100%; max-width:1200px;">
              <div style="display:flex; justify-content:space-between; width:100%; align-items:center; background:rgba(0,0,0,0.5); padding:10px 24px; border-radius:var(--radius-full); border:1px solid rgba(255,255,255,0.25);">
                <span style="font-family:var(--font-display); font-size:1.25rem; color:#fef3c7; font-weight:800;">
                  👆 TAP the animals to explore Green Valley!
                </span>
                <span class="prediction-badge" style="background:#059669;" id="explore-count">
                  Discovered: 0 / ${scene.hotspots.length}
                </span>
              </div>
              <div style="position:relative; width:100%; height:420px; background:linear-gradient(180deg, #38bdf8 0%, #86efac 45%, #15803d 85%); border-radius:var(--radius-xl); border:4px solid #10b981; overflow:hidden; box-shadow:var(--shadow-lg);">
                <svg viewBox="0 0 1000 420" width="100%" height="100%" preserveAspectRatio="none" style="position:absolute; top:0; left:0;">
                  <!-- Living Landscape Details -->
                  <polygon points="0,220 180,120 360,240 540,110 750,230 1000,160 1000,420 0,420" fill="#047857" opacity="0.45"/>
                  <circle cx="220" cy="180" r="110" fill="#15803d"/>
                  <circle cx="450" cy="170" r="95" fill="#166534"/>
                  <path d="M 500 240 Q 650 250 680 320 Q 720 420 800 420 L 580 420 Q 560 330 460 270 Z" fill="#38bdf8"/>
                  <ellipse cx="720" cy="350" rx="100" ry="40" fill="#0284c7" opacity="0.85"/>
                </svg>
                ${scene.hotspots.map(h => `
                  <button class="explore-spot-btn tap-item" data-id="${h.id}" style="position:absolute; left:${h.x}%; top:${h.y}%; transform:translate(-50%, -50%); background:none; border:none; cursor:pointer;">
                    <div style="background:rgba(255,255,255,0.96); border:3px solid #10b981; border-radius:var(--radius-full); padding:10px 20px; display:flex; align-items:center; gap:12px; box-shadow:var(--shadow-md);">
                      <span style="font-size:2.8rem;">${h.emoji}</span>
                      <span style="font-family:var(--font-display); font-weight:800; font-size:1.25rem; color:#065f46;">${h.name}</span>
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      // 2. Ranger Eyes (Find Hidden Animals)
      case 'ranger_eyes':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:14px; width:100%; max-width:1150px;">
              <div style="font-family:var(--font-display); font-size:1.45rem; color:#fef3c7; font-weight:800;">
                🔎 RANGER EYES: Tap the 5 hidden animals in nature!
              </div>
              <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                ${scene.targets.map(t => `
                  <div class="target-check-pill" id="target-pill-${t}" style="background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.35); border-radius:var(--radius-full); padding:8px 20px; color:#fff; font-family:var(--font-display); font-size:1.15rem; font-weight:800;">
                    <span>${t.toUpperCase()}</span> <span>❓</span>
                  </div>
                `).join('')}
              </div>
              <div style="position:relative; width:100%; height:400px; background:#064e3b; border-radius:var(--radius-xl); border:4px solid #34d399; overflow:hidden; box-shadow:var(--shadow-lg);">
                <button class="nature-spot-btn" data-target="squirrel" style="position:absolute; top:20%; left:22%; background:none; border:none; cursor:pointer;">
                  ${window.jungleViews.getSuki("happy", 110)}
                </button>
                <button class="nature-spot-btn" data-target="frog" style="position:absolute; top:62%; left:65%; background:none; border:none; cursor:pointer;">
                  ${window.jungleViews.getPoppy("happy", 110)}
                </button>
                <button class="nature-spot-btn" data-target="fox" style="position:absolute; top:52%; left:42%; background:none; border:none; cursor:pointer;">
                  ${window.jungleViews.getFox("happy", 115)}
                </button>
                <button class="nature-spot-btn" data-target="rabbit" style="position:absolute; top:65%; left:12%; background:none; border:none; cursor:pointer;">
                  ${window.jungleViews.getRabbit("happy", 110)}
                </button>
                <button class="nature-spot-btn" data-target="owl" style="position:absolute; top:15%; left:80%; background:none; border:none; cursor:pointer;">
                  <span style="font-size:4rem;">🦉</span>
                </button>
              </div>
            </div>
          </div>
        `;
        break;

      // 3. Who Am I? Clues
      case 'who_am_i':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:900px;">
              <div class="prediction-badge" style="background:#0284c7; font-size:1.3rem;">🐾 WHO AM I?</div>
              <div style="background:#fff; border-radius:var(--radius-xl); border:4px solid #38bdf8; padding:28px; width:100%; box-shadow:var(--shadow-lg); text-align:center;">
                <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                  ${scene.clues.map(c => `
                    <div style="font-family:var(--font-display); font-size:1.45rem; font-weight:800; color:#1e293b; background:#f0f9ff; padding:14px 20px; border-radius:var(--radius-md); border-left:6px solid #0284c7;">
                      ${c}
                    </div>
                  `).join('')}
                </div>
                <div id="who-revealed" style="display:none; margin:16px 0;">
                  ${window.jungleViews.getSuki("happy", 160)}
                  <div style="font-family:var(--font-display); font-size:2.4rem; font-weight:900; color:#059669; margin-top:10px;">
                    IT'S SUKI THE SQUIRREL! 🌟
                  </div>
                </div>
                <button class="hud-btn hud-btn-teacher" id="btn-reveal-who" style="font-size:1.35rem; padding:16px 36px; margin:0 auto;">
                  <span>👁️ REVEAL ANIMAL ➔</span>
                </button>
              </div>
            </div>
          </div>
        `;
        break;

      // 4. Where Do I Live? (Tap Animal ➔ Tap Biome)
      case 'where_live':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1200px;">
              <div style="font-family:var(--font-display); font-size:1.4rem; color:#fef3c7; font-weight:800;">
                👇 STEP 1: Tap Animal ➔ STEP 2: Tap its Real Home!
              </div>
              <div class="habitat-zones-container">
                <div class="habitat-zone-card forest-zone tap-target biome-target" data-biome="forest">
                  <div class="habitat-header">Forest 🌲</div>
                  <div class="habitat-actor-slot" id="slot-forest">❓ Tap Destination</div>
                  <div class="habitat-tag">Tall oak trees & acorns</div>
                </div>
                <div class="habitat-zone-card pond-zone tap-target biome-target" data-biome="pond">
                  <div class="habitat-header">Pond 💧</div>
                  <div class="habitat-actor-slot" id="slot-pond">❓ Tap Destination</div>
                  <div class="habitat-tag">Water lilies & reeds</div>
                </div>
                <div class="habitat-zone-card river-zone tap-target biome-target" data-biome="river">
                  <div class="habitat-header">River 🌊</div>
                  <div class="habitat-actor-slot" id="slot-river">❓ Tap Destination</div>
                  <div class="habitat-tag">Freshwater stream</div>
                </div>
                <div class="habitat-zone-card grassland-zone tap-target biome-target" data-biome="grassland">
                  <div class="habitat-header">Grassland 🌾</div>
                  <div class="habitat-actor-slot" id="slot-grassland">❓ Tap Destination</div>
                  <div class="habitat-tag">Tall grass & clover</div>
                </div>
              </div>
              <div class="items-palette">
                <button class="item-card tap-item biome-animal-btn" data-id="squirrel" data-target="forest">
                  ${window.jungleViews.getSuki("happy", 75)}
                  <span class="item-label">Squirrel 🐿️</span>
                </button>
                <button class="item-card tap-item biome-animal-btn" data-id="frog" data-target="pond">
                  ${window.jungleViews.getPoppy("happy", 75)}
                  <span class="item-label">Frog 🐸</span>
                </button>
                <button class="item-card tap-item biome-animal-btn" data-id="rabbit" data-target="grassland">
                  ${window.jungleViews.getRabbit("happy", 75)}
                  <span class="item-label">Rabbit 🐇</span>
                </button>
                <button class="item-card tap-item biome-animal-btn" data-id="raccoon" data-target="river">
                  ${window.jungleViews.getRico("happy", 75)}
                  <span class="item-label">Raccoon 🦝</span>
                </button>
              </div>
            </div>
          </div>
        `;
        break;

      // 5. What Do I Need?
      case 'what_need':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; max-width:1050px;">
              <div style="font-family:var(--font-display); font-size:1.45rem; color:#fef3c7; font-weight:800;">
                👇 What does Suki need? Tap Food, Water, and Shelter!
              </div>
              <div class="animal-stage-actor tap-target" id="target-suki-needs" style="background:rgba(255,255,255,0.18); border:4px dashed #34d399; border-radius:var(--radius-xl); padding:20px 50px; cursor:pointer;">
                ${window.jungleViews.getSuki("happy", 150)}
                <div class="actor-name-tag">🐿️ Suki's Survival Triangle</div>
              </div>
              <div class="items-palette">
                ${scene.items.map(it => `
                  <button class="item-card tap-item needs-item-btn" data-need="${it.id}">
                    <span class="item-label" style="font-size:1.35rem;">${it.name}</span>
                    <span style="font-size:0.95rem; color:#475569; font-weight:700;">${it.desc}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      // 6. Animal Homes (Shelter)
      case 'homes':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1050px;">
              <div class="prediction-badge" style="background:#d97706; font-size:1.25rem;">
                🏠 SHELTER = A safe place to rest and hide from danger
              </div>
              <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:16px; width:100%;">
                <div style="background:#fff; border-radius:var(--radius-xl); border:3px solid #10b981; padding:18px 24px; display:flex; align-items:center; justify-content:space-between; box-shadow:var(--shadow-md);">
                  <div style="display:flex; align-items:center; gap:12px;">
                    ${window.jungleViews.getRabbit("happy", 75)}
                    <span style="font-family:var(--font-display); font-size:1.35rem; font-weight:800;">Rabbit 🐇</span>
                  </div>
                  <span style="font-size:2rem; color:#10b981;">➔</span>
                  <div style="background:#ecfdf5; border:2px solid #34d399; border-radius:var(--radius-full); padding:10px 22px; font-family:var(--font-display); font-size:1.25rem; font-weight:800; color:#065f46;">
                    Burrow 🕳️
                  </div>
                </div>
                <div style="background:#fff; border-radius:var(--radius-xl); border:3px solid #10b981; padding:18px 24px; display:flex; align-items:center; justify-content:space-between; box-shadow:var(--shadow-md);">
                  <div style="display:flex; align-items:center; gap:12px;">
                    ${window.jungleViews.getFox("happy", 75)}
                    <span style="font-family:var(--font-display); font-size:1.35rem; font-weight:800;">Fox 🦊</span>
                  </div>
                  <span style="font-size:2rem; color:#10b981;">➔</span>
                  <div style="background:#ecfdf5; border:2px solid #34d399; border-radius:var(--radius-full); padding:10px 22px; font-family:var(--font-display); font-size:1.25rem; font-weight:800; color:#065f46;">
                    Den 🕳️
                  </div>
                </div>
                <div style="background:#fff; border-radius:var(--radius-xl); border:3px solid #10b981; padding:18px 24px; display:flex; align-items:center; justify-content:space-between; box-shadow:var(--shadow-md);">
                  <div style="display:flex; align-items:center; gap:12px;">
                    ${window.jungleViews.getSuki("happy", 75)}
                    <span style="font-family:var(--font-display); font-size:1.35rem; font-weight:800;">Squirrel 🐿️</span>
                  </div>
                  <span style="font-size:2rem; color:#10b981;">➔</span>
                  <div style="background:#ecfdf5; border:2px solid #34d399; border-radius:var(--radius-full); padding:10px 22px; font-family:var(--font-display); font-size:1.25rem; font-weight:800; color:#065f46;">
                    Tree Hollow 🌳
                  </div>
                </div>
                <div style="background:#fff; border-radius:var(--radius-xl); border:3px solid #10b981; padding:18px 24px; display:flex; align-items:center; justify-content:space-between; box-shadow:var(--shadow-md);">
                  <div style="display:flex; align-items:center; gap:12px;">
                    <span style="font-size:3.5rem;">🐦</span>
                    <span style="font-family:var(--font-display); font-size:1.35rem; font-weight:800;">Bird 🐦</span>
                  </div>
                  <span style="font-size:2rem; color:#10b981;">➔</span>
                  <div style="background:#ecfdf5; border:2px solid #34d399; border-radius:var(--radius-full); padding:10px 22px; font-family:var(--font-display); font-size:1.25rem; font-weight:800; color:#065f46;">
                    Nest 🪺
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      // 7. Discover Habitat
      case 'habitat_reveal':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="background:rgba(255,255,255,0.97); border-radius:var(--radius-xl); border:4px solid #10b981; padding:30px; text-align:center; max-width:980px; box-shadow:var(--shadow-lg);">
              <div style="font-family:var(--font-display); font-size:2.6rem; font-weight:900; color:#065f46; margin-bottom:14px;">
                🏡 HABITAT = An Animal's Home
              </div>
              <div style="display:flex; justify-content:space-around; align-items:center; margin:22px 0; background:#f0fdf4; padding:22px; border-radius:var(--radius-xl);">
                ${window.jungleViews.getPoppy("happy", 110)}
                <span style="font-size:2.4rem; font-weight:900; color:#10b981;">+</span>
                <span style="font-size:4rem;">💧</span>
                <span style="font-size:2.4rem; font-weight:900; color:#10b981;">+</span>
                <span style="font-size:4rem;">🌿</span>
                <span style="font-size:2.4rem; font-weight:900; color:#10b981;">=</span>
                <span style="font-family:var(--font-display); font-size:2rem; font-weight:900; color:#0284c7;">Pond Habitat</span>
              </div>
              <p style="font-size:1.4rem; color:#334155; font-weight:800;">
                A habitat gives an animal food, water, and shelter to survive!
              </p>
            </div>
          </div>
        `;
        break;

      // 8. Discover Food (Feeding Target Animals)
      case 'food_feeder':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:18px; width:100%; max-width:1150px;">
              <div style="font-family:var(--font-display); font-size:1.4rem; color:#fef3c7; font-weight:800;">
                👇 STEP 1: Tap Food ➔ STEP 2: Tap the Animal to Feed It!
              </div>
              <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
                <div class="animal-stage-actor tap-target feed-animal-target" data-animal="squirrel" style="padding:14px 22px; background:#fff; border-radius:var(--radius-xl); border:4px solid #cbd5e1; cursor:pointer;">
                  ${window.jungleViews.getSuki("happy", 100)}
                  <div class="actor-name-tag">Squirrel 🐿️</div>
                  <div class="fed-status-tag" style="font-size:0.95rem; color:#059669; font-weight:800; margin-top:4px;">Hungry 😋</div>
                </div>
                <div class="animal-stage-actor tap-target feed-animal-target" data-animal="frog" style="padding:14px 22px; background:#fff; border-radius:var(--radius-xl); border:4px solid #cbd5e1; cursor:pointer;">
                  ${window.jungleViews.getPoppy("happy", 100)}
                  <div class="actor-name-tag">Frog 🐸</div>
                  <div class="fed-status-tag" style="font-size:0.95rem; color:#059669; font-weight:800; margin-top:4px;">Hungry 😋</div>
                </div>
                <div class="animal-stage-actor tap-target feed-animal-target" data-animal="rabbit" style="padding:14px 22px; background:#fff; border-radius:var(--radius-xl); border:4px solid #cbd5e1; cursor:pointer;">
                  ${window.jungleViews.getRabbit("happy", 100)}
                  <div class="actor-name-tag">Rabbit 🐇</div>
                  <div class="fed-status-tag" style="font-size:0.95rem; color:#059669; font-weight:800; margin-top:4px;">Hungry 😋</div>
                </div>
              </div>
              <div class="items-palette">
                <button class="item-card tap-item feed-food-btn" data-animal-match="squirrel">
                  <span class="item-emoji">🌰</span>
                  <span class="item-label">Nuts & Acorns</span>
                </button>
                <button class="item-card tap-item feed-food-btn" data-animal-match="frog">
                  <span class="item-emoji">🪲</span>
                  <span class="item-label">Insects & Flies</span>
                </button>
                <button class="item-card tap-item feed-food-btn" data-animal-match="rabbit">
                  <span class="item-emoji">🌿</span>
                  <span class="item-label">Green Plants</span>
                </button>
              </div>
            </div>
          </div>
        `;
        break;

      // 9. Who Eats Who? (Predator & Prey)
      case 'predator_prey':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:18px; width:100%; max-width:1050px;">
              <div style="font-family:var(--font-display); font-size:1.6rem; color:#fef3c7; font-weight:800; text-align:center;">
                🦊 WHO EATS WHO? (Predator vs Prey)
              </div>
              <div style="display:flex; align-items:center; justify-content:center; gap:20px; width:100%; background:rgba(255,255,255,0.98); padding:28px; border-radius:var(--radius-xl); box-shadow:var(--shadow-lg);">
                <div style="text-align:center;">
                  <span style="font-size:4rem;">🌱</span>
                  <div style="font-family:var(--font-display); font-weight:800; color:#15803d; font-size:1.3rem;">Green Plant</div>
                  <div style="font-size:1rem; color:#475569; font-weight:700;">Producer</div>
                </div>
                <span style="font-size:3rem; color:#f59e0b;">➔</span>
                <div style="text-align:center;">
                  ${window.jungleViews.getRabbit("happy", 110)}
                  <div style="font-family:var(--font-display); font-weight:800; color:#0369a1; font-size:1.3rem;">Rabbit 🐇</div>
                  <div class="prediction-badge" style="background:#0284c7; font-size:0.95rem; padding:4px 14px; margin-top:4px;">PREY 🐇</div>
                </div>
                <span style="font-size:3rem; color:#f59e0b;">➔</span>
                <div style="text-align:center;">
                  ${window.jungleViews.getFox("happy", 110)}
                  <div style="font-family:var(--font-display); font-weight:800; color:#b91c1c; font-size:1.3rem;">Fox 🦊</div>
                  <div class="prediction-badge" style="background:#dc2626; font-size:0.95rem; padding:4px 14px; margin-top:4px;">PREDATOR 🦊</div>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      // 14. The Great Storm
      case 'storm_event':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px;">
              <div class="lightning-flash" id="lightning-fx"></div>
              <div style="display:flex; gap:20px; align-items:center; justify-content:center;">
                ${window.jungleViews.getSuki("worried", 130)}
                ${window.jungleViews.getPoppy("worried", 130)}
                ${window.jungleViews.getRico("worried", 130)}
              </div>
              <div style="font-family:var(--font-display); font-size:2.8rem; color:#fca5a5; font-weight:900;">
                ⛈️ JUNGLE EMERGENCY ALERT! 🚨
              </div>
              <div style="font-family:var(--font-display); font-size:1.5rem; color:#f8fafc; max-width:800px;">
                A fierce storm struck Green Valley! Trees have fallen and water is dirty!
              </div>
              <button class="hud-btn hud-btn-teacher" id="btn-start-rescue" style="font-size:1.4rem; padding:18px 40px; background:linear-gradient(135deg, #10b981, #059669); border-color:#6ee7b7; margin-top:16px;">
                <span>🛡️ START RESCUE MISSIONS ➔</span>
              </button>
            </div>
          </div>
        `;
        this.triggerStormFX();
        break;

      // 15. Suki's Tree is Gone
      case 'prediction':
        const animalAvatar = scene.id === "s15-suki-tree" 
          ? window.jungleViews.getSuki("worried", 140)
          : scene.id === "s17-rico-water"
          ? window.jungleViews.getRico("worried", 140)
          : scene.id === "s18-poppy-pond"
          ? window.jungleViews.getPoppy("worried", 140)
          : scene.id === "s19-boris-berries"
          ? window.jungleViews.getBoris("berries", 140)
          : "";

        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:18px; width:100%; max-width:960px;">
              ${animalAvatar ? `<div>${animalAvatar}</div>` : ''}
              <div class="prediction-badge" style="background:#0284c7; font-size:1.25rem;">🔮 PREDICTION CHALLENGE</div>
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

      // 16. Suki New Home
      case 'suki_habitat':
        stage.innerHTML = `
          <div class="stage-board">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; max-width:1150px;">
              <div style="font-family:var(--font-display); font-size:1.4rem; color:#fef3c7; font-weight:800;">
                👇 STEP 1: Tap Suki ➔ STEP 2: Tap the Forest Habitat!
              </div>
              <button class="animal-stage-actor tap-item" id="suki-actor-btn" style="background:none; border:none; cursor:pointer;">
                ${window.jungleViews.getSuki("worried", 135)}
                <div class="actor-name-tag">🐿️ Suki Needs a Home!</div>
              </button>
              <div class="habitat-zones-container">
                <div class="habitat-zone-card forest-zone tap-target suki-zone-target" data-correct="true">
                  <div class="habitat-header">Forest 🌲</div>
                  <div class="habitat-actor-slot" id="slot-suki-forest">❓ Tap Here</div>
                  <div class="habitat-tag">Tall oak trees & acorns</div>
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

      // Default fallback for any other scenes
      default:
        stage.innerHTML = `<div class="stage-board"><div style="color:#fff; font-size:1.5rem;">Loading scene...</div></div>`;
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
    document.querySelectorAll('.tap-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.selectedItem === item) this.clearSelection();
        else this.selectItem(item);
      });
    });

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

    document.querySelectorAll('.pred-choice-btn').forEach(btn => {
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

    const rescueBtn = document.getElementById('btn-start-rescue');
    if (rescueBtn) rescueBtn.addEventListener('click', () => this.nextScene());
  }

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
