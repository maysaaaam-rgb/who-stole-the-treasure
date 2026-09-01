/* ==========================================================================
   🌿 LIFE IN THE JUNGLE — THE JUNGLE RANGERS
   Zero-Fail TAP ➔ TAP Engine with 75% Cinematic Visual Storybook Scenes
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
  // SCENE RENDERER (75% CINEMATIC VISUAL + 25% STUDENT ACTION)
  // =========================================================================
  renderCurrentScene() {
    const scene = window.JUNGLE_DATA.scenes[this.currentSceneIdx];
    if (!scene) return;

    // Header HUD
    const numEl = document.getElementById('hud-chapter-num');
    const titleEl = document.getElementById('hud-chapter-title');
    if (numEl) numEl.textContent = `Scene ${scene.num}`;
    if (titleEl) titleEl.textContent = scene.title;

    // Teacher Guide
    this.updateTeacherHUD(scene);

    // Render 75% Visual Stage + 25% Action Strip
    const stage = document.getElementById('stage-canvas-area');
    if (!stage) return;

    switch (scene.type) {
      // 1. Living Green Valley Panorama
      case 'open_explore':
        stage.innerHTML = `
          <div class="cinematic-scene-container" id="visual-scene-box"></div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🌿</div>
              <div class="story-sentence-text">
                Welcome to Green Valley! <span class="vocab-highlight-tag">👆 TOUCH</span> any animal to discover its home!
              </div>
            </div>
          </div>
        `;
        window.jungleViews.renderLivingValleyPanorama(
          document.getElementById('visual-scene-box'),
          scene.hotspots
        );
        break;

      // 2. Ranger Eyes (Find It!)
      case 'ranger_eyes':
        stage.innerHTML = `
          <div class="cinematic-scene-container" id="visual-scene-box"></div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🔎</div>
              <div class="story-sentence-text">
                <span class="vocab-highlight-tag">RANGER EYES:</span> Tap the 5 hidden animals in nature!
              </div>
            </div>
            <div class="action-buttons-row">
              ${scene.targets.map(t => `
                <div class="target-check-pill" id="target-pill-${t}" style="background:#f1f5f9; border:3px solid #cbd5e1; border-radius:var(--radius-full); padding:8px 20px; font-family:var(--font-display); font-size:1.15rem; font-weight:900; color:#1e293b;">
                  <span>${t.toUpperCase()}</span> <span>❓</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        window.jungleViews.renderLivingValleyPanorama(
          document.getElementById('visual-scene-box'),
          [
            { id: "squirrel", name: "Squirrel 🐿️", x: 20, y: 35, emoji: "🐿️" },
            { id: "frog", name: "Frog 🐸", x: 68, y: 75, emoji: "🐸" },
            { id: "fox", name: "Fox 🦊", x: 78, y: 64, emoji: "🦊" },
            { id: "rabbit", name: "Rabbit 🐇", x: 84, y: 64, emoji: "🐇" },
            { id: "owl", name: "Owl 🦉", x: 86, y: 22, emoji: "🦉" }
          ]
        );
        break;

      // 3. Who Am I?
      case 'who_am_i':
        stage.innerHTML = `
          <div class="cinematic-scene-container">
            <div style="display:flex; align-items:center; justify-content:center; gap:40px; width:100%; height:100%; background:radial-gradient(circle, #065f46 0%, #022c22 100%); padding:20px;">
              <div id="who-revealed-box" style="text-align:center;">
                ${window.jungleViews.getSuki("happy", 220)}
                <div style="font-family:var(--font-display); font-size:2.4rem; font-weight:900; color:#fbbf24; margin-top:8px;">
                  SUKI THE SQUIRREL! 🌟
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:14px; max-width:480px;">
                ${scene.clues.map(c => `
                  <div style="font-family:var(--font-display); font-size:1.5rem; font-weight:800; color:#1e293b; background:#fff; padding:14px 22px; border-radius:var(--radius-lg); border-left:8px solid #f59e0b; box-shadow:var(--shadow-md);">
                    ${c}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🐾</div>
              <div class="story-sentence-text">
                I live in trees. I eat nuts. <span class="vocab-highlight-tag">WHO AM I?</span>
              </div>
            </div>
            <div class="action-buttons-row">
              <button class="smart-choice-btn correct-choice" onclick="window.jungleAudio.playSuccess(); window.jungleGame.addTeamPoint(window.jungleGame.activeTurn, 2);">
                <span class="choice-icon">🐿️</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">Squirrel</span></div>
              </button>
              <button class="smart-choice-btn" onclick="window.jungleAudio.playHint();">
                <span class="choice-icon">🐸</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">Frog</span></div>
              </button>
              <button class="smart-choice-btn" onclick="window.jungleAudio.playHint();">
                <span class="choice-icon">🐻</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">Bear</span></div>
              </button>
            </div>
          </div>
        `;
        break;

      // 4. Where Do I Live? (Habitat Placement)
      case 'where_live':
        stage.innerHTML = `
          <div class="cinematic-scene-container">
            <div class="habitat-zones-container" style="padding:16px;">
              <div class="habitat-zone-card forest-zone tap-target biome-target" data-biome="forest">
                <div class="habitat-header">Forest 🌲</div>
                <div class="habitat-actor-slot" id="slot-forest">❓ Tap Destination</div>
                <div class="habitat-tag">Trees & acorns</div>
              </div>
              <div class="habitat-zone-card pond-zone tap-target biome-target" data-biome="pond">
                <div class="habitat-header">Pond 💧</div>
                <div class="habitat-actor-slot" id="slot-pond">❓ Tap Destination</div>
                <div class="habitat-tag">Water lilies</div>
              </div>
              <div class="habitat-zone-card river-zone tap-target biome-target" data-biome="river">
                <div class="habitat-header">River 🌊</div>
                <div class="habitat-actor-slot" id="slot-river">❓ Tap Destination</div>
                <div class="habitat-tag">Clean stream</div>
              </div>
              <div class="habitat-zone-card grassland-zone tap-target biome-target" data-biome="grassland">
                <div class="habitat-header">Grassland 🌾</div>
                <div class="habitat-actor-slot" id="slot-grassland">❓ Tap Destination</div>
                <div class="habitat-tag">Tall clover grass</div>
              </div>
            </div>
          </div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🏡</div>
              <div class="story-sentence-text">
                <span class="vocab-highlight-tag">WHERE DO I LIVE?</span> Tap an animal ➔ Tap its home environment!
              </div>
            </div>
            <div class="action-buttons-row">
              <button class="smart-choice-btn tap-item biome-animal-btn" data-id="squirrel" data-target="forest">
                <span class="choice-icon">🐿️</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">Squirrel</span></div>
              </button>
              <button class="smart-choice-btn tap-item biome-animal-btn" data-id="frog" data-target="pond">
                <span class="choice-icon">🐸</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">Frog</span></div>
              </button>
              <button class="smart-choice-btn tap-item biome-animal-btn" data-id="rabbit" data-target="grassland">
                <span class="choice-icon">🐇</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">Rabbit</span></div>
              </button>
              <button class="smart-choice-btn tap-item biome-animal-btn" data-id="raccoon" data-target="river">
                <span class="choice-icon">🦝</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">Raccoon</span></div>
              </button>
            </div>
          </div>
        `;
        break;

      // 5. What Do I Need?
      case 'what_need':
        stage.innerHTML = `
          <div class="cinematic-scene-container">
            <div style="display:flex; align-items:center; justify-content:center; gap:30px; width:100%; height:100%; background:radial-gradient(circle, #047857 0%, #022c22 100%); padding:20px;">
              <div class="tap-target" id="target-suki-needs" style="text-align:center; background:rgba(255,255,255,0.15); border:4px dashed #34d399; border-radius:var(--radius-xl); padding:20px 40px; cursor:pointer;">
                ${window.jungleViews.getSuki("happy", 180)}
                <div style="background:#fef3c7; color:#78350f; font-family:var(--font-display); font-weight:900; font-size:1.3rem; padding:6px 20px; border-radius:var(--radius-full); margin-top:8px;">
                  🐿️ Suki's Survival Triangle
                </div>
              </div>
            </div>
          </div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🍎</div>
              <div class="story-sentence-text">
                Animals need <span class="vocab-highlight-tag">FOOD</span>, <span class="vocab-highlight-tag">WATER</span>, and <span class="vocab-highlight-tag">SHELTER</span> to live! Tap all 3!
              </div>
            </div>
            <div class="action-buttons-row">
              <button class="smart-choice-btn tap-item needs-item-btn" data-need="food">
                <span class="choice-icon">🌰</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">1. FOOD</span><span class="choice-sub-text">Nuts & acorns</span></div>
              </button>
              <button class="smart-choice-btn tap-item needs-item-btn" data-need="water">
                <span class="choice-icon">💧</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">2. WATER</span><span class="choice-sub-text">Clean drinking stream</span></div>
              </button>
              <button class="smart-choice-btn tap-item needs-item-btn" data-need="shelter">
                <span class="choice-icon">🏠</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">3. SHELTER</span><span class="choice-sub-text">Safe oak tree hollow</span></div>
              </button>
            </div>
          </div>
        `;
        break;

      // 6. Animal Homes (Shelter Discovery)
      case 'homes':
        stage.innerHTML = `
          <div class="cinematic-scene-container" id="visual-scene-box"></div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🏠</div>
              <div class="story-sentence-text">
                <span class="vocab-highlight-tag">SHELTER</span> = A safe place where an animal rests and hides from danger!
              </div>
            </div>
          </div>
        `;
        window.jungleViews.renderShelterDiscoveryScene(document.getElementById('visual-scene-box'));
        break;

      // 7. Discover Habitat
      case 'habitat_reveal':
        stage.innerHTML = `
          <div class="cinematic-scene-container">
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; width:100%; height:100%; background:radial-gradient(circle, #0284c7 0%, #022c22 100%); padding:24px;">
              <div style="font-family:var(--font-display); font-size:3rem; font-weight:900; color:#fff; text-shadow:0 4px 12px rgba(0,0,0,0.5);">
                🏡 HABITAT = An Animal's Natural Home
              </div>
              <div style="display:flex; justify-content:space-around; align-items:center; background:rgba(255,255,255,0.96); padding:24px 36px; border-radius:var(--radius-xl); box-shadow:var(--shadow-lg); gap:20px;">
                ${window.jungleViews.getPoppy("happy", 130)}
                <span style="font-size:2.8rem; font-weight:900; color:#10b981;">+</span>
                <span style="font-size:4.5rem;">💧</span>
                <span style="font-size:2.8rem; font-weight:900; color:#10b981;">+</span>
                <span style="font-size:4.5rem;">🌿</span>
                <span style="font-size:2.8rem; font-weight:900; color:#10b981;">=</span>
                <span style="font-family:var(--font-display); font-size:2.4rem; font-weight:900; color:#0284c7;">Pond Habitat</span>
              </div>
            </div>
          </div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🏡</div>
              <div class="story-sentence-text">
                A <span class="vocab-highlight-tag">HABITAT</span> provides everything an animal needs: food, water, and shelter!
              </div>
            </div>
          </div>
        `;
        break;

      // 8. Discover Food (Feeding Target Animals)
      case 'food_feeder':
        stage.innerHTML = `
          <div class="cinematic-scene-container">
            <div style="display:flex; align-items:center; justify-content:space-around; width:100%; height:100%; background:radial-gradient(circle, #15803d 0%, #022c22 100%); padding:20px;">
              <div class="animal-stage-actor tap-target feed-animal-target" data-animal="squirrel" style="padding:16px 24px; background:#fff; border-radius:var(--radius-xl); border:4px solid #cbd5e1; cursor:pointer; text-align:center;">
                ${window.jungleViews.getSuki("happy", 135)}
                <div class="actor-name-tag" style="font-size:1.2rem;">Squirrel 🐿️</div>
                <div class="fed-status-tag" style="font-size:1rem; color:#059669; font-weight:800; margin-top:4px;">Hungry 😋</div>
              </div>
              <div class="animal-stage-actor tap-target feed-animal-target" data-animal="frog" style="padding:16px 24px; background:#fff; border-radius:var(--radius-xl); border:4px solid #cbd5e1; cursor:pointer; text-align:center;">
                ${window.jungleViews.getPoppy("happy", 135)}
                <div class="actor-name-tag" style="font-size:1.2rem;">Frog 🐸</div>
                <div class="fed-status-tag" style="font-size:1rem; color:#059669; font-weight:800; margin-top:4px;">Hungry 😋</div>
              </div>
              <div class="animal-stage-actor tap-target feed-animal-target" data-animal="rabbit" style="padding:16px 24px; background:#fff; border-radius:var(--radius-xl); border:4px solid #cbd5e1; cursor:pointer; text-align:center;">
                ${window.jungleViews.getRabbit("happy", 135)}
                <div class="actor-name-tag" style="font-size:1.2rem;">Rabbit 🐇</div>
                <div class="fed-status-tag" style="font-size:1rem; color:#059669; font-weight:800; margin-top:4px;">Hungry 😋</div>
              </div>
            </div>
          </div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🍓</div>
              <div class="story-sentence-text">
                <span class="vocab-highlight-tag">FEED THE ANIMALS:</span> Tap Food ➔ Tap the hungry animal!
              </div>
            </div>
            <div class="action-buttons-row">
              <button class="smart-choice-btn tap-item feed-food-btn" data-animal-match="squirrel">
                <span class="choice-icon">🌰</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">Nuts & Acorns</span></div>
              </button>
              <button class="smart-choice-btn tap-item feed-food-btn" data-animal-match="frog">
                <span class="choice-icon">🪲</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">Insects & Flies</span></div>
              </button>
              <button class="smart-choice-btn tap-item feed-food-btn" data-animal-match="rabbit">
                <span class="choice-icon">🌿</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">Green Plants</span></div>
              </button>
            </div>
          </div>
        `;
        break;

      // 9. Predator vs Prey
      case 'predator_prey':
        stage.innerHTML = `
          <div class="cinematic-scene-container" id="visual-scene-box"></div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🦊</div>
              <div class="story-sentence-text">
                The <span class="vocab-highlight-tag">PREDATOR</span> (Fox 🦊) hunts other animals. The <span class="vocab-highlight-tag">PREY</span> (Rabbit 🐇) is hunted!
              </div>
            </div>
          </div>
        `;
        window.jungleViews.renderPredatorPreyScene(document.getElementById('visual-scene-box'));
        break;

      // 10. Build Food Chain
      case 'food_chain':
        stage.innerHTML = `
          <div class="cinematic-scene-container">
            <div style="display:flex; align-items:center; justify-content:center; gap:20px; width:100%; height:100%; background:radial-gradient(circle, #065f46 0%, #022c22 100%); padding:20px;">
              <div class="tap-target chain-slot" data-step="1" style="flex:1; max-width:240px; height:200px; background:#fff; border:4px dashed #10b981; border-radius:var(--radius-xl); display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <span style="font-family:var(--font-display); font-weight:900; color:#10b981; font-size:1.5rem;">1. Plant 🌱</span>
                <span class="slot-val" style="font-size:3.5rem; margin-top:8px;">❓</span>
              </div>
              <div style="font-size:3.5rem; color:#f59e0b; font-weight:900;">➔</div>
              <div class="tap-target chain-slot" data-step="2" style="flex:1; max-width:240px; height:200px; background:#fff; border:4px dashed #0284c7; border-radius:var(--radius-xl); display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <span style="font-family:var(--font-display); font-weight:900; color:#0284c7; font-size:1.5rem;">2. Prey 🐇</span>
                <span class="slot-val" style="font-size:3.5rem; margin-top:8px;">❓</span>
              </div>
              <div style="font-size:3.5rem; color:#f59e0b; font-weight:900;">➔</div>
              <div class="tap-target chain-slot" data-step="3" style="flex:1; max-width:240px; height:200px; background:#fff; border:4px dashed #dc2626; border-radius:var(--radius-xl); display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <span style="font-family:var(--font-display); font-weight:900; color:#dc2626; font-size:1.5rem;">3. Predator 🦊</span>
                <span class="slot-val" style="font-size:3.5rem; margin-top:8px;">❓</span>
              </div>
            </div>
          </div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🔗</div>
              <div class="story-sentence-text">
                <span class="vocab-highlight-tag">BUILD THE FOOD CHAIN:</span> Tap 1. Plant 🌱 ➔ Tap 2. Rabbit 🐇 ➔ Tap 3. Fox 🦊!
              </div>
            </div>
            <div class="action-buttons-row">
              <button class="smart-choice-btn tap-item chain-btn" data-step="1" data-emoji="🌱">
                <span class="choice-icon">🌱</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">1. Green Plant</span></div>
              </button>
              <button class="smart-choice-btn tap-item chain-btn" data-step="2" data-emoji="🐇">
                <span class="choice-icon">🐇</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">2. Rabbit (Prey)</span></div>
              </button>
              <button class="smart-choice-btn tap-item chain-btn" data-step="3" data-emoji="🦊">
                <span class="choice-icon">🦊</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">3. Fox (Predator)</span></div>
              </button>
            </div>
          </div>
        `;
        break;

      // 14. The Great Storm
      case 'storm_event':
        stage.innerHTML = `
          <div class="cinematic-scene-container" id="visual-scene-box"></div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🚨</div>
              <div class="story-sentence-text" style="color:#dc2626;">
                <span class="vocab-highlight-tag" style="background:#fee2e2; border-color:#ef4444; color:#991b1b;">EMERGENCY ALERT:</span> A fierce storm struck Green Valley! Trees have fallen and river water is dirty!
              </div>
            </div>
            <div class="action-buttons-row">
              <button class="smart-choice-btn" id="btn-start-rescue" style="background:linear-gradient(135deg, #10b981, #059669); border-color:#6ee7b7; color:#fff; max-width:400px;">
                <span class="choice-icon">🛡️</span>
                <div class="choice-text-wrap"><span class="choice-primary-text" style="color:#fff;">START RESCUE MISSIONS ➔</span></div>
              </button>
            </div>
          </div>
        `;
        window.jungleViews.renderGreatStormScene(document.getElementById('visual-scene-box'));
        this.triggerStormFX();
        break;

      // 15. Suki's Tree is Gone
      case 'prediction':
        stage.innerHTML = `
          <div class="cinematic-scene-container">
            <div style="display:flex; align-items:center; justify-content:center; gap:30px; width:100%; height:100%; background:radial-gradient(circle, #334155 0%, #0f172a 100%); padding:20px;">
              ${window.jungleViews.getSuki("worried", 190)}
              <div style="background:#fff; border-radius:var(--radius-xl); border:4px solid #ef4444; padding:24px; max-width:480px; box-shadow:var(--shadow-lg);">
                <div style="font-family:var(--font-display); font-size:2rem; font-weight:900; color:#b91c1c; margin-bottom:8px;">
                  Suki's Tree has Fallen! (🌳 💥)
                </div>
                <div style="font-size:1.3rem; color:#475569; font-weight:800;">
                  What WILL happen to Suki?
                </div>
              </div>
            </div>
          </div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🔮</div>
              <div class="story-sentence-text">
                <span class="vocab-highlight-tag">PREDICTION:</span> What WILL happen to Suki?
              </div>
            </div>
            <div class="action-buttons-row">
              ${scene.options.map(opt => `
                <button class="smart-choice-btn pred-choice-btn" data-correct="${opt.correct}">
                  <span class="choice-icon">${opt.correct ? '🏠' : '❌'}</span>
                  <div class="choice-text-wrap"><span class="choice-primary-text">${opt.text}</span></div>
                </button>
              `).join('')}
            </div>
          </div>
        `;
        break;

      // 16. Find Suki a New Home
      case 'suki_habitat':
        stage.innerHTML = `
          <div class="cinematic-scene-container">
            <div class="habitat-zones-container" style="padding:16px;">
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
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🐿️</div>
              <div class="story-sentence-text">
                <span class="vocab-highlight-tag">RESCUE SUKI:</span> Tap Suki ➔ Tap the Forest Habitat to give her a safe home!
              </div>
            </div>
            <div class="action-buttons-row">
              <button class="smart-choice-btn tap-item" id="suki-actor-btn" style="max-width:320px;">
                <span class="choice-icon">🐿️</span>
                <div class="choice-text-wrap"><span class="choice-primary-text">Suki the Squirrel</span></div>
              </button>
            </div>
          </div>
        `;
        break;

      default:
        stage.innerHTML = `
          <div class="cinematic-scene-container" id="visual-scene-box"></div>
          <div class="story-action-strip">
            <div class="story-dialogue-row">
              <div class="speaker-badge-avatar">🌿</div>
              <div class="story-sentence-text">${scene.title}</div>
            </div>
          </div>
        `;
        window.jungleViews.renderLivingValleyPanorama(document.getElementById('visual-scene-box'));
    }

    this.attachSceneHandlers(scene);

    if (window.jungleAudio.isSpeechEnabled && scene.narrator) {
      window.jungleAudio.speak(scene.narrator.text);
    }
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
          this.addTeamPoint(this.activeTurn, 1);
        }
      });
    });

    document.querySelectorAll('.biome-target').forEach(tgt => {
      tgt.addEventListener('click', () => {
        if (this.selectedItem && this.selectedItem.classList.contains('biome-animal-btn')) {
          const expected = this.selectedItem.getAttribute('data-target');
          const biome = tgt.getAttribute('data-biome');
          if (expected === biome) {
            const label = this.selectedItem.querySelector('.choice-primary-text')?.textContent || '';
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
    if (fill) fill.style.width = `${health}%`;
    if (pct) pct.textContent = `${health}%`;
  }

  triggerStormFX() {
    const flash = document.getElementById('lightning-fx');
    window.jungleAudio.playWind();
    setTimeout(() => {
      window.jungleAudio.playThunder();
      if (flash) {
        flash.style.opacity = '1';
        setTimeout(() => flash.style.opacity = '0', 120);
        setTimeout(() => flash.style.opacity = '1', 250);
        setTimeout(() => flash.style.opacity = '0', 350);
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
