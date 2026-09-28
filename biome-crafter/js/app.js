/**
 * BIOME CRAFTER: THE NIGHT SURVIVAL (70-MIN MASTER ARC)
 * Reactive State Machine, 3x3 Crafting Grid, Daylight Cycle Canvas & Confetti Engine
 * Zero external runtime dependencies • Web Audio API & Calibrated Natural TTS
 */

(function(root) {
  'use strict';

  // --- REACTIVE PLAYER SESSION STATE ---
  const playerSession = {
    xp: 0,
    currentStage: 1,

    // Daylight Cycle (180s cycle: 100% Day -> 0% Night)
    daylightRemaining: 180,
    daylightInterval: null,

    // Inventory Slots
    inventory: {
      wood: 0,
      stone: 0,
      iron: 0,
      stick: 4,
      coal: 2
    },

    // Stage 1: Biome Scanner
    scannedBiomes: new Set(),

    // Stage 2: Mining Airlock
    miningProgress: {},

    // Stage 3: 2x2 Starter Smithing Bench
    smithing2x2Index: 0,
    smithing2x2Grid: ['', '', '', ''],
    selectedSmithing2x2Item: 'wood',
    craftedSmithing2x2Ids: new Set(),
    craftedSmithingIds: new Set(),

    // Stage 4: Sunset Sorting Drill
    sortingIndex: 0,
    sortingScore: 0,
    sunsetSecondsLeft: 20,
    sunsetTimer: null,
    sunsetDrillFinished: false,
    isSunsetDrillActive: false,

    // Stage 5: 3x3 Tactile Shelter Forge
    activeRecipeIndex: 0,
    selectedPaletteItem: 'wood',
    grid3x3: [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ],
    baseDefenseLevel: 25,
    crafted3x3Ids: new Set(),

    // Stage 6: Creeper Defense
    defenseStepIndex: 0,
    completedDefenseIds: new Set(),
    defenseState: {
      window1: false,
      door: false,
      window2: false
    },

    // Stage 7: Teleprompter Studio
    activeTeleprompterTemplate: null,
    isSpeaking: false,

    // Stage 8: Diagnostic Checkpoint
    quizAnswers: {},
    quizPassed: false
  };

  // --- PROCEDURAL CELESTIAL SKY CANVAS (DAY/NIGHT TRANSITION) ---
  const CelestialSky = {
    canvas: null,
    ctx: null,
    animationId: null,
    stars: [],

    init: function() {
      this.canvas = document.getElementById('celestialCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Pre-generate starfield
      this.stars = [];
      for (let i = 0; i < 90; i++) {
        this.stars.push({
          x: Math.random(),
          y: Math.random(),
          size: Math.random() * 2 + 1,
          twinkle: Math.random() * Math.PI * 2
        });
      }

      this.start();
    },

    resize: function() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    start: function() {
      if (this.animationId) return;
      const loop = () => {
        this.render();
        this.animationId = requestAnimationFrame(loop);
      };
      this.animationId = requestAnimationFrame(loop);
    },

    render: function() {
      if (!this.ctx || !this.canvas) return;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const ctx = this.ctx;

      // Compute day fraction from playerSession
      const dayFrac = Math.max(0, Math.min(1, playerSession.daylightRemaining / 180));
      const isNightStage = (playerSession.currentStage >= 6);

      // Sky gradient: Blue day -> Golden sunset -> Deep obsidian starry night
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      if (isNightStage || dayFrac <= 0.15) {
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.6, '#0f172a');
        grad.addColorStop(1, '#060911');
      } else if (dayFrac <= 0.45) {
        grad.addColorStop(0, '#431407');
        grad.addColorStop(0.5, '#7c2d12');
        grad.addColorStop(1, '#1e1b4b');
      } else {
        grad.addColorStop(0, '#0c4a6e');
        grad.addColorStop(0.6, '#0369a1');
        grad.addColorStop(1, '#0f172a');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Render stars at dusk or night
      const starAlpha = (isNightStage || dayFrac <= 0.4) ? Math.min(1, 1 - dayFrac * 1.5) : 0;
      if (starAlpha > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha * 0.9})`;
        this.stars.forEach(s => {
          s.twinkle += 0.04;
          const sz = s.size * (0.8 + Math.sin(s.twinkle) * 0.2);
          ctx.beginPath();
          ctx.arc(s.x * w, s.y * h, sz, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Render sun or moon
      const orbX = w * 0.85;
      const orbY = (1 - dayFrac) * (h * 0.6) + 70;

      if (!isNightStage && dayFrac > 0.15) {
        // Glowing Voxel Sun
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 30;
        ctx.fillRect(orbX - 22, orbY - 22, 44, 44);
        ctx.shadowBlur = 0;
      } else {
        // Glowing Crescent Moon
        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 24;
        ctx.fillRect(orbX - 18, 60 - 18, 36, 36);
        ctx.shadowBlur = 0;
      }
    }
  };

  // --- ZERO-DEPENDENCY CANVAS CONFETTI ENGINE ---
  const ConfettiEngine = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,

    init: function() {
      this.canvas = document.getElementById('confettiCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    },

    resize: function() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    burst: function(count = 70) {
      if (!this.canvas || !this.ctx) return;
      const colors = ['#10b981', '#f59e0b', '#38bdf8', '#ef4444', '#a855f7', '#facc15'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 280,
          y: window.innerHeight * 0.4 + (Math.random() - 0.5) * 160,
          vx: (Math.random() - 0.5) * 18,
          vy: (Math.random() - 1.2) * 16,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 14,
          opacity: 1,
          gravity: 0.45
        });
      }

      if (!this.animationId) {
        this.render();
      }
    },

    render: function() {
      const self = ConfettiEngine;
      if (!self.ctx || !self.canvas) return;

      self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

      for (let i = self.particles.length - 1; i >= 0; i--) {
        const p = self.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012;

        if (p.opacity <= 0 || p.y > self.canvas.height) {
          self.particles.splice(i, 1);
          continue;
        }

        self.ctx.save();
        self.ctx.translate(p.x, p.y);
        self.ctx.rotate((p.rotation * Math.PI) / 180);
        self.ctx.fillStyle = p.color;
        self.ctx.globalAlpha = Math.max(0, p.opacity);
        self.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        self.ctx.restore();
      }

      if (self.particles.length > 0) {
        self.animationId = requestAnimationFrame(() => self.render());
      } else {
        self.animationId = null;
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      }
    }
  };

  // --- INITIALIZATION ---
  function initGame() {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) {
      console.error('[BiomeCrafter] BIOME_CRAFTER_DATA missing.');
      return;
    }

    playerSession.activeTeleprompterTemplate = data.teleprompterTemplates[0];

    CelestialSky.init();
    ConfettiEngine.init();
    startDaylightClock();

    renderStage1Scanner();
    renderStage2Mining();
    renderStage3Smithing();
    renderStage4Sunset();
    renderStage5Forge();
    renderStage6Defense();
    renderStage7Studio();
    renderStage8Diagnostic();

    updateHUD();
  }

  // --- DAYLIGHT CLOCK CONTROLLER (180s Cycle) ---
  function startDaylightClock() {
    if (playerSession.daylightInterval) clearInterval(playerSession.daylightInterval);

    playerSession.daylightInterval = setInterval(() => {
      if (playerSession.daylightRemaining > 0) {
        playerSession.daylightRemaining--;
        updateDaylightHUD();
      }
    }, 1000);
  }

  function updateDaylightHUD() {
    const fill = document.getElementById('hudDaylightFill');
    const text = document.getElementById('hudDaylightText');
    const icon = document.getElementById('hudDaylightIcon');

    const frac = playerSession.daylightRemaining / 180;
    const pct = Math.max(0, Math.min(100, Math.round(frac * 100)));

    if (fill) {
      fill.style.width = `${pct}%`;
      if (frac <= 0.25) {
        fill.className = 'daylight-fill is-night';
      } else if (frac <= 0.5) {
        fill.className = 'daylight-fill is-sunset';
      } else {
        fill.className = 'daylight-fill';
      }
    }

    if (text && icon) {
      if (frac > 0.5) {
        text.textContent = 'Day';
        text.style.color = '#f59e0b';
        icon.textContent = '☀️';
      } else if (frac > 0.2) {
        text.textContent = 'Sunset';
        text.style.color = '#ef4444';
        icon.textContent = '🌅';
      } else {
        text.textContent = 'Midnight';
        text.style.color = '#38bdf8';
        icon.textContent = '🌙';
      }
    }
  }

  // --- HUD CONTROLLER ---
  function updateHUD() {
    const xpEl = document.getElementById('hudXP');
    if (xpEl) xpEl.textContent = `⭐ +${playerSession.xp} XP`;

    const woodEl = document.getElementById('invWood');
    if (woodEl) woodEl.textContent = playerSession.inventory.wood;

    const stoneEl = document.getElementById('invStone');
    if (stoneEl) stoneEl.textContent = playerSession.inventory.stone;

    const ironEl = document.getElementById('invIron');
    if (ironEl) ironEl.textContent = playerSession.inventory.iron;

    const coalEl = document.getElementById('invCoal');
    if (coalEl) coalEl.textContent = playerSession.inventory.coal;

    const sticksEl = document.getElementById('invSticks');
    if (sticksEl) sticksEl.textContent = playerSession.inventory.stick;

    updateDaylightHUD();
  }

  function addXP(amount) {
    playerSession.xp += amount;
    updateHUD();

    const xpEl = document.getElementById('hudXP');
    if (xpEl) {
      xpEl.classList.remove('bounce');
      void xpEl.offsetWidth;
      xpEl.classList.add('bounce');
    }

    if (root.BiomeAudio) {
      root.BiomeAudio.playXP();
    }

    if (window.AdventureAcademy && typeof window.AdventureAcademy.awardXP === 'function') {
      try {
        window.AdventureAcademy.awardXP(amount);
      } catch (err) {
        console.warn('[BiomeCrafter] awardXP error:', err);
      }
    }
  }

  // --- STAGE ROUTER (1 TO 8) ---
  function switchStage(stageNum) {
    if (stageNum < 1 || stageNum > 8) return;
    playerSession.currentStage = stageNum;

    if (root.BiomeAudio) {
      root.BiomeAudio.playSnap();
    }

    for (let i = 1; i <= 8; i++) {
      const tab = document.getElementById(`tabStage${i}`);
      const view = document.getElementById(`stagePhase${i}`);
      if (tab) {
        if (i === stageNum) tab.classList.add('is-active');
        else tab.classList.remove('is-active');
      }
      if (view) {
        if (i === stageNum) view.classList.add('is-visible');
        else view.classList.remove('is-visible');
      }
    }

    if (stageNum === 3) renderStage3Smithing();
    if (stageNum === 4) startSunsetDrill();
    if (stageNum === 5) renderStage5Forge();
    if (stageNum === 6) renderStage6Defense();
    if (stageNum === 7) renderStage7Studio();
    if (stageNum === 8) renderStage8Diagnostic();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // STAGE 1: BIOME SCANNER & DAYLIGHT RADAR
  // =========================================================================
  function renderStage1Scanner() {
    const data = root.BIOME_CRAFTER_DATA;
    const grid = document.getElementById('scannerCardsGrid');
    if (!grid || !data) return;

    grid.innerHTML = data.biomes.map((b, idx) => {
      const isScanned = playerSession.scannedBiomes.has(b.id);
      return `
        <div class="scanner-card-outer" id="biomeCard-${b.id}" onclick="handleScanBiome('${b.id}')">
          <div class="scanner-card-inner ${isScanned ? 'is-flipped' : ''}">
            
            <!-- FRONT VIEWPORT (65% Full-Bleed 3D Model + 35% Tray) -->
            <div class="scanner-card-front" style="border-color:${b.accent};">
              <div class="card-media-viewport">
                <span class="hud-tag" style="position:absolute; top:12px; left:12px; background:${b.accentGlow}; border-color:${b.accent};">
                  ${b.icon} Biome 0${idx + 1}
                </span>

                <div class="hero-character-box">
                  <img src="${b.mascotImg}" alt="${b.mascotName}" class="hero-character-sprite" loading="lazy">
                  <div class="pedestal-disc" style="background: radial-gradient(ellipse at center, ${b.accentGlow} 0%, transparent 72%);"></div>
                </div>
              </div>

              <div class="card-caption-tray">
                <div style="font-size:1.15rem; font-weight:900; color:#ffffff;">${b.name}</div>
                <div style="font-size:0.84rem; color:${b.accent}; font-weight:800;">Resource: ${b.keyResource}</div>
                <button type="button" class="btn-3d btn-game-torch" style="width:100%; padding:8px 12px; font-size:0.88rem; margin-top:4px;" onclick="event.stopPropagation(); handleScanBiome('${b.id}')">
                  <span>🧭</span> <span>Scan Biome</span>
                </button>
              </div>
            </div>

            <!-- BACK VIEWPORT (Linguistic Formula & Environmental Clue) -->
            <div class="scanner-card-back" style="border-color:${b.accent};">
              <span class="hud-tag" style="align-self:flex-start; background:${b.accentGlow}; border-color:${b.accent};">
                ${b.icon} Scanned &amp; Logged
              </span>

              <div style="background:#1e293b; border:2px solid ${b.accent}; border-radius:14px; padding:12px; margin:10px 0;">
                <div style="font-size:0.75rem; font-weight:900; color:${b.accent}; text-transform:uppercase;">
                  Linguistic Target Formula:
                </div>
                <div style="font-size:1.02rem; font-weight:800; color:#fef08a; margin-top:4px;">
                  "${b.sentenceFrame}"
                </div>
              </div>

              <p style="font-size:0.86rem; color:#cbd5e1; line-height:1.45;">
                ${b.description}
              </p>

              <div style="display:flex; flex-direction:column; gap:6px; width:100%; margin-top:auto;">
                <button type="button" class="btn-3d btn-game-diamond" style="padding:10px 14px; font-size:0.9rem;" onclick="event.stopPropagation(); speakBiomeFormula('${b.id}')">
                  <span>🔊</span> <span>Hear Formula</span>
                </button>
                <div style="font-size:0.76rem; text-align:center; color:#94a3b8; font-weight:800;">
                  Tap to flip back
                </div>
              </div>
            </div>

          </div>
        </div>
      `;
    }).join('');
  }

  function handleScanBiome(biomeId) {
    const cardEl = document.getElementById(`biomeCard-${biomeId}`);
    if (!cardEl) return;

    const inner = cardEl.querySelector('.scanner-card-inner');
    if (!inner) return;

    inner.classList.toggle('is-flipped');
    if (root.BiomeAudio) root.BiomeAudio.playSnap();

    if (!playerSession.scannedBiomes.has(biomeId)) {
      playerSession.scannedBiomes.add(biomeId);
      addXP(5);

      const data = root.BIOME_CRAFTER_DATA;
      if (data && playerSession.scannedBiomes.size === data.biomes.length) {
        const notice = document.getElementById('stage1SuccessNotice');
        if (notice) {
          notice.style.display = 'flex';
          ConfettiEngine.burst(50);
          if (root.BiomeAudio) root.BiomeAudio.playVictoryFanfare();
        }
      }
    }
  }

  function speakBiomeFormula(biomeId) {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;
    const b = data.biomes.find(item => item.id === biomeId);
    if (b && root.BiomeAudio) {
      root.BiomeAudio.speak(b.speechPrompt);
    }
  }

  // =========================================================================
  // STAGE 2: RESOURCE MINING AIRLOCK
  // =========================================================================
  function renderStage2Mining() {
    const grid = document.getElementById('miningAirlockGrid');
    const data = root.BIOME_CRAFTER_DATA;
    if (!grid || !data) return;

    grid.innerHTML = data.miningTasks.map((t, idx) => {
      const currentHits = playerSession.miningProgress[t.id] || 0;
      const pct = Math.max(0, Math.min(100, Math.round(((t.maxHits - currentHits) / t.maxHits) * 100)));
      const isDepleted = (currentHits >= t.maxHits);

      return `
        <div class="mining-target-card" id="miningCard-${t.id}">
          <span class="hud-tag" style="background:#1e293b; border-color:#475569;">
            Deposit 0${idx + 1} • ${t.type.toUpperCase()}
          </span>

          <div class="mining-block-box" onclick="handleMineClick('${t.id}')">
            <img src="${t.img}" alt="${t.title}" style="width:100%; height:100%; object-fit:contain; border-radius:18px; filter:drop-shadow(0 6px 12px rgba(0,0,0,0.6));">
            ${isDepleted ? '<div style="position:absolute; inset:0; background:rgba(16,185,129,0.3); border-radius:18px; display:flex; align-items:center; justify-content:center; font-size:1.8rem; font-weight:900;">✓</div>' : ''}
          </div>

          <div style="width:100%;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:800; margin-bottom:4px; color:#cbd5e1;">
              <span>Durability:</span>
              <span>${t.maxHits - currentHits} / ${t.maxHits} Hits</span>
            </div>
            <div class="mining-durability-track">
              <div class="mining-durability-fill" style="width:${pct}%;"></div>
            </div>
          </div>

          <div style="font-size:0.88rem; font-weight:800; color:#fef08a;">
            "${t.stem}"
          </div>

          <button type="button" class="btn-3d ${isDepleted ? 'btn-game-emerald' : 'btn-game-torch'}" style="width:100%; padding:10px 14px; font-size:0.92rem;" onclick="handleMineClick('${t.id}')" ${isDepleted ? 'disabled' : ''}>
            <span>${t.type === 'wood' ? '🪓 Chop Tree' : '⛏️ Mine Rock'}</span>
          </button>
        </div>
      `;
    }).join('');
  }

  function handleMineClick(taskId) {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;
    const task = data.miningTasks.find(t => t.id === taskId);
    if (!task) return;

    if (!playerSession.miningProgress[taskId]) {
      playerSession.miningProgress[taskId] = 0;
    }

    if (playerSession.miningProgress[taskId] < task.maxHits) {
      playerSession.miningProgress[taskId]++;

      // Audio feedback
      if (root.BiomeAudio) {
        if (task.audio === 'wood') root.BiomeAudio.playWoodChop();
        else root.BiomeAudio.playStoneMine();
      }

      // Check if harvest complete
      if (playerSession.miningProgress[taskId] >= task.maxHits) {
        if (task.type === 'wood') playerSession.inventory.wood += task.yieldCount;
        else if (task.type === 'stone') playerSession.inventory.stone += task.yieldCount;
        else if (task.type === 'iron') playerSession.inventory.iron += task.yieldCount;

        addXP(6);
        ConfettiEngine.burst(30);
        if (root.BiomeAudio) root.BiomeAudio.playHammerSlam();
      }

      updateHUD();
      renderStage2Mining();
    }
  }

  // =========================================================================
  // STAGE 3: THE 2x2 STARTER SMITHING BENCH (Recipe Assembly)
  // =========================================================================
  function renderStage3Smithing() {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;

    const recipes = data.smithing2x2Recipes || [
      {
        id: "sticks-2x2",
        stepNumber: 1,
        name: "4x Wooden Sticks",
        icon: "🥢",
        resultItem: "Sticks",
        img: "assets/torch_item.webp",
        formula: "I need 2 Wood Planks to craft 4 Sticks.",
        ingredientsLabel: "2 Wood Planks (Vertical Column)",
        ghostGrid: ["wood", "", "wood", ""],
        miniGuide: "Place 1 Wood Plank in slot 1 and 1 in slot 3.",
        stampText: "CRAFTED: 4x STICKS! ⭐"
      },
      {
        id: "wood-pick-2x2",
        stepNumber: 2,
        name: "Starter Wooden Pickaxe",
        icon: "⛏️",
        resultItem: "Wooden Pickaxe",
        img: "assets/stone_pickaxe.webp",
        formula: "I need 2 Wood Planks and 2 Sticks to make a Wooden Pickaxe.",
        ingredientsLabel: "2 Wood Planks (Top) + 2 Sticks (Bottom)",
        ghostGrid: ["wood", "wood", "stick", "stick"],
        miniGuide: "Place 2 Wood Planks on top, and 2 Sticks on bottom.",
        stampText: "CRAFTED: STARTER PICKAXE! ⭐"
      }
    ];

    const active = recipes[playerSession.smithing2x2Index] || recipes[0];

    // 1. Render Left Recipe List / Blueprint Preview Card
    const recipeListEl = document.getElementById('smithing2x2RecipeList');
    if (recipeListEl) {
      const isStep1 = (active.id === 'sticks-2x2');
      const formulaChips = isStep1
        ? `<div class="recipe-formula-chip"><span class="chip-item">🪵 Wood</span> <span class="chip-plus">+</span> <span class="chip-item">🪵 Wood</span> <span class="chip-eq">=</span> <span class="chip-result">🥢 4x Sticks</span></div>`
        : `<div class="recipe-formula-chip"><span class="chip-item">🪵 Wood</span> <span class="chip-plus">+</span> <span class="chip-item">🪵 Wood</span> <span class="chip-plus">+</span> <span class="chip-item">🥢 Stick</span> <span class="chip-plus">+</span> <span class="chip-item">🥢 Stick</span> <span class="chip-eq">=</span> <span class="chip-result">⛏️ Pickaxe</span></div>`;

      recipeListEl.innerHTML = `
        <div class="blueprint-preview-card target-step-card">
          <div class="blueprint-media-viewport">
            <span class="step-target-badge">
              ${active.icon} STEP 0${active.stepNumber || (playerSession.smithing2x2Index + 1)} TARGET
            </span>

            <div class="blueprint-subject-stage">
              <img src="${active.img}" alt="${active.name}" class="target-item-hero-img">
              <div class="pedestal-disc target-hero-pedestal"></div>
            </div>
          </div>

          <div class="blueprint-caption-tray">
            <div class="target-card-header">
              <div class="target-card-title">${active.name}</div>
              <div class="target-card-subtitle">${active.tier || 'Crafting Recipe'}</div>
            </div>

            <!-- Simple Visual Formula Chip (No Wordy Instructions) -->
            <div class="formula-chip-wrap">
              <div class="formula-chip-label">Visual Crafting Formula:</div>
              ${formulaChips}
            </div>
          </div>
        </div>
      `;
    }

    // 2. Stepper pills
    const stepperEl = document.getElementById('smithing2x2Stepper');
    if (stepperEl) {
      stepperEl.innerHTML = recipes.map((r, idx) => {
        const isActive = (idx === playerSession.smithing2x2Index);
        const done = playerSession.craftedSmithing2x2Ids.has(r.id);
        return `
          <button type="button" class="recipe-step-pill ${isActive ? 'is-active' : ''} ${done ? 'is-crafted' : ''}" onclick="select2x2Recipe(${idx})">
            <span>${r.icon || '🔨'}</span>
            <span>${done ? '✓ ' : ''}Step 0${idx + 1}: ${r.name}</span>
          </button>
        `;
      }).join('');
    }

    // 3. Formula text
    const formEl = document.getElementById('smithing2x2Formula');
    const ingEl = document.getElementById('smithing2x2Ingredients');
    if (formEl) formEl.textContent = `"${active.formula}"`;
    if (ingEl) ingEl.textContent = `Required: ${active.ingredientsLabel}`;

    // 4. Render 2x2 Grid Sockets with Visual Ghost Blueprints (No Plain Text)
    const gridEl = document.getElementById('grid2x2Sockets');
    if (gridEl) {
      gridEl.innerHTML = [0, 1, 2, 3].map(idx => {
        const currentItem = playerSession.smithing2x2Grid[idx];
        const ghostItem = active.ghostGrid[idx];
        const isGhost = !currentItem && !!ghostItem;

        let displayContent = '';
        let ghostClass = '';

        if (currentItem) {
          if (currentItem === 'wood') {
            displayContent = `<img src="assets/wood_block_transparent.webp" alt="Wood Plank" class="placed-item-sprite">`;
          } else if (currentItem === 'stick') {
            displayContent = `<img src="assets/wooden_sticks_transparent.webp" alt="Sticks" class="placed-item-sprite">`;
          } else {
            displayContent = `<img src="assets/stone_block_transparent.webp" alt="Stone" class="placed-item-sprite">`;
          }
        } else if (isGhost) {
          ghostClass = 'is-ghost-hint';
          if (ghostItem === 'wood') {
            displayContent = `
              <div class="ghost-blueprint-icon">
                <img src="assets/wood_block_transparent.webp" alt="Wood Ghost">
              </div>`;
          } else if (ghostItem === 'stick') {
            displayContent = `
              <div class="ghost-blueprint-icon">
                <img src="assets/wooden_sticks_transparent.webp" alt="Stick Ghost">
              </div>`;
          } else {
            displayContent = `
              <div class="ghost-blueprint-icon">
                <img src="assets/stone_block_transparent.webp" alt="Stone Ghost">
              </div>`;
          }
        }

        return `
          <div class="crafting-socket ${currentItem ? 'is-slotted' : ''} ${ghostClass}" onclick="handleSocket2x2Click(${idx})" title="Slot ${idx + 1}: ${currentItem ? currentItem : (ghostItem ? 'Requires ' + ghostItem : 'Empty')}">
            <span class="socket-index-num">${idx + 1}</span>
            ${displayContent}
          </div>
        `;
      }).join('');
    }

    // 5. Render Inventory Tray for 2x2 Bench
    const trayEl = document.getElementById('smithing2x2InventoryTray');
    if (trayEl) {
      const palette = [
        { key: 'wood', label: 'Wood Planks', iconImg: 'assets/wood_block_transparent.webp', count: Math.max(playerSession.inventory.wood, 4) },
        { key: 'stick', label: 'Sticks', iconImg: 'assets/wooden_sticks_transparent.webp', count: Math.max(playerSession.inventory.stick, 4) }
      ];

      trayEl.innerHTML = palette.map(p => {
        const isSelected = (playerSession.selectedSmithing2x2Item === p.key);
        return `
          <button type="button" class="btn-3d inventory-item-btn ${isSelected ? 'is-selected' : ''}" onclick="selectSmithingPaletteItem('${p.key}')">
            <img src="${p.iconImg}" alt="${p.label}" class="inv-token-img">
            <span class="inv-btn-name">${p.label}</span>
            <span class="inv-count-pill">×${p.count}</span>
          </button>
        `;
      }).join('');
    }

    // 6. Check Match State for Forge Button
    const forgeBtn = document.getElementById('btnForge2x2Item');
    if (forgeBtn) {
      let isMatch = true;
      for (let i = 0; i < 4; i++) {
        if ((playerSession.smithing2x2Grid[i] || '') !== (active.ghostGrid[i] || '')) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        forgeBtn.classList.add('is-ready-to-forge');
        forgeBtn.innerHTML = `<span>✨ Craft ${active.resultItem || 'Tool'}! (+12 XP)</span>`;
      } else {
        forgeBtn.classList.remove('is-ready-to-forge');
        forgeBtn.innerHTML = `<span>🔨 Craft ${active.resultItem || 'Tool'}!</span>`;
      }
    }
  }

  function select2x2Recipe(idx) {
    playerSession.smithing2x2Index = idx;
    playerSession.smithing2x2Grid = ['', '', '', ''];
    if (root.BiomeAudio) root.BiomeAudio.playSnap();
    renderStage3Smithing();
  }

  function selectSmithingPaletteItem(key) {
    playerSession.selectedSmithing2x2Item = key;
    if (root.BiomeAudio) root.BiomeAudio.playSnap();
    renderStage3Smithing();
  }

  function handleSocket2x2Click(idx) {
    if (playerSession.smithing2x2Grid[idx]) {
      // Remove item
      playerSession.smithing2x2Grid[idx] = '';
      if (root.BiomeAudio) root.BiomeAudio.playSnap();
    } else {
      // Place selected item
      playerSession.smithing2x2Grid[idx] = playerSession.selectedSmithing2x2Item;
      if (root.BiomeAudio) root.BiomeAudio.playWoodChop();
    }
    renderStage3Smithing();
  }

  function clear2x2Grid() {
    playerSession.smithing2x2Grid = ['', '', '', ''];
    if (root.BiomeAudio) root.BiomeAudio.playSnap();
    renderStage3Smithing();
  }

  function verify2x2Craft() {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data || !data.smithing2x2Recipes) return;
    const recipe = data.smithing2x2Recipes[playerSession.smithing2x2Index];
    if (!recipe) return;

    let isMatch = true;
    for (let i = 0; i < 4; i++) {
      if ((playerSession.smithing2x2Grid[i] || '') !== (recipe.ghostGrid[i] || '')) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      playerSession.craftedSmithing2x2Ids.add(recipe.id);
      addXP(12);
      if (root.BiomeAudio) {
        root.BiomeAudio.playHammerSlam();
        root.BiomeAudio.playVictoryFanfare();
      }
      ConfettiEngine.burst(40);

      // Rubber stamp animation
      const stamp = document.getElementById('smithingStampSeal');
      const stampText = document.getElementById('smithingStampSealText');
      if (stamp && stampText) {
        stampText.textContent = recipe.stampText;
        stamp.style.display = 'flex';
        stamp.classList.remove('rubber-stamp-anim');
        void stamp.offsetWidth;
        stamp.classList.add('rubber-stamp-anim');
      }

      if (recipe.id === 'sticks-2x2') {
        playerSession.inventory.stick = (playerSession.inventory.stick || 0) + 4;
        updateHUD();
        setTimeout(() => {
          playerSession.smithing2x2Index = 1;
          playerSession.smithing2x2Grid = ['', '', '', ''];
          if (stamp) stamp.style.display = 'none';
          renderStage3Smithing();
        }, 1500);
      } else {
        setTimeout(() => {
          if (stamp) stamp.style.display = 'none';
          renderStage3Smithing();
        }, 1500);
      }
    } else {
      if (root.BiomeAudio) root.BiomeAudio.playSoftFail();
      const grid = document.getElementById('grid2x2Sockets');
      if (grid) {
        grid.style.transform = 'translateX(-6px)';
        setTimeout(() => { if (grid) grid.style.transform = 'translateX(0)'; }, 150);
      }
    }
  }

  // Backwards compatibility
  function speakSmithingFormula(recipeId) {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;
    const r = (data.smithing2x2Recipes && data.smithing2x2Recipes.find(item => item.id === recipeId)) ||
              (data.smithingRecipes && data.smithingRecipes.find(item => item.id === recipeId));
    if (r && root.BiomeAudio) {
      root.BiomeAudio.speak(r.formula);
    }
  }

  function craftSmithingTool(recipeId) {
    verify2x2Craft();
  }

  // =========================================================================
  // STAGE 4: SUNSET EMERGENCY SORTING DRILL (20-Second Active Timer)
  // =========================================================================
  function startSunsetDrill() {
    playerSession.sortingIndex = 0;
    playerSession.sunsetSecondsLeft = 20;
    playerSession.sunsetDrillFinished = false;

    if (playerSession.sunsetTimer) {
      clearInterval(playerSession.sunsetTimer);
    }

    renderStage4Sunset();

    const notice = document.getElementById('sunsetSuccessNotice');
    if (notice) notice.style.display = 'none';

    playerSession.sunsetTimer = setInterval(() => {
      if (playerSession.sunsetSecondsLeft > 0) {
        playerSession.sunsetSecondsLeft--;
        const badgeNum = document.getElementById('sunsetCountdownNum');
        if (badgeNum) badgeNum.textContent = playerSession.sunsetSecondsLeft;

        if (playerSession.sunsetSecondsLeft === 0) {
          finishSunsetDrill();
        }
      }
    }, 1000);
  }

  function renderStage4Sunset() {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;

    const items = data.sortingItems;
    const current = items[playerSession.sortingIndex] || items[0];

    const numEl = document.getElementById('conveyorItemNum');
    const iconEl = document.getElementById('conveyorItemIcon');
    const nameEl = document.getElementById('conveyorItemName');
    const reasonEl = document.getElementById('conveyorItemReason');
    const scoreEl = document.getElementById('sunsetScoreText');

    if (numEl) numEl.textContent = `${playerSession.sortingIndex + 1}`;
    if (iconEl) iconEl.textContent = current.icon;
    if (nameEl) nameEl.textContent = current.name;
    if (reasonEl) reasonEl.textContent = current.reason;
    if (scoreEl) scoreEl.textContent = `Accuracy: ${playerSession.sortingScore} / 12`;
  }

  function handleSortChoice(choice) {
    if (playerSession.sunsetDrillFinished) return;

    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;

    const items = data.sortingItems;
    const current = items[playerSession.sortingIndex];
    if (!current) return;

    const binId = (choice === 'survival' ? 'binSurvival' : 'binLuxury');
    const binEl = document.getElementById(binId);

    if (choice === current.category) {
      playerSession.sortingScore++;
      addXP(2);
      if (root.BiomeAudio) root.BiomeAudio.playSnap();

      if (binEl) {
        binEl.style.transform = 'scale(1.08)';
        setTimeout(() => { if (binEl) binEl.style.transform = 'scale(1)'; }, 150);
      }
    } else {
      if (root.BiomeAudio) root.BiomeAudio.playSoftFail();
      if (binEl) {
        binEl.style.transform = 'translateX(-6px)';
        setTimeout(() => { if (binEl) binEl.style.transform = 'translateX(0)'; }, 150);
      }
    }

    if (playerSession.sortingIndex < items.length - 1) {
      playerSession.sortingIndex++;
      renderStage4Sunset();
    } else {
      finishSunsetDrill();
    }
  }

  function finishSunsetDrill() {
    if (playerSession.sunsetTimer) {
      clearInterval(playerSession.sunsetTimer);
      playerSession.sunsetTimer = null;
    }
    playerSession.sunsetDrillFinished = true;

    addXP(10);
    ConfettiEngine.burst(55);
    if (root.BiomeAudio) root.BiomeAudio.playVictoryFanfare();

    const notice = document.getElementById('sunsetSuccessNotice');
    if (notice) notice.style.display = 'block';
  }

  // =========================================================================
  // STAGE 5: 3x3 TACTILE SHELTER FORGE (VISUAL BLUEPRINT & GHOST GRID)
  // =========================================================================
  function renderStage5Forge() {
    renderForgeRecipeList();
    renderGrid3x3();
    renderPaletteChips();
  }

  function renderForgeRecipeList() {
    const list = document.getElementById('forgeRecipesList');
    const data = root.BIOME_CRAFTER_DATA;
    if (!list || !data || !data.crafting3x3Recipes) return;

    const recipes = data.crafting3x3Recipes;
    const active = recipes[playerSession.activeRecipeIndex] || recipes[0];
    const isCrafted = playerSession.crafted3x3Ids.has(active.id);

    // Stepper pills
    const stepperHtml = `
      <div class="recipe-steps-stepper">
        ${recipes.map((r, idx) => {
          const isActive = (idx === playerSession.activeRecipeIndex);
          const done = playerSession.crafted3x3Ids.has(r.id);
          return `
            <button type="button" class="recipe-step-pill ${isActive ? 'is-active' : ''} ${done ? 'is-crafted' : ''}" onclick="select3x3Recipe(${idx})">
              <span>${r.icon || '🔨'}</span>
              <span>${done ? '✓ ' : ''}Step 0${idx + 1}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;

    // 65% / 35% Visual Blueprint Card
    const previewCardHtml = `
      <div class="blueprint-preview-card">
        <!-- 65% Media Viewport with high-depth item rendering & floating/flaming animation -->
        <div class="blueprint-hero-stage">
          <span class="hud-tag" style="position:absolute; top:12px; left:12px; background:rgba(15,23,42,0.85); border-color:#f59e0b; color:#fef08a; z-index:3;">
            ${active.badge || `Step ${playerSession.activeRecipeIndex + 1} of 3`}
          </span>

          <img src="${active.resultImg}" alt="${active.name}" class="blueprint-item-sprite ${active.previewAnimation || 'floating-door'}" loading="lazy">
          <div class="pedestal-disc" style="background: radial-gradient(ellipse at center, rgba(245, 158, 11, 0.45) 0%, transparent 72%);"></div>
        </div>

        <!-- 35% Caption Tray with target formulas -->
        <div class="blueprint-info-tray">
          <div>
            <div style="font-size:1.15rem; font-weight:900; color:#ffffff;">${active.name}</div>
            <div style="font-size:0.82rem; font-weight:800; color:#f59e0b; margin-top:2px;">
              Required: ${active.ingredientsLabel}
            </div>
          </div>
          <div style="font-size:0.78rem; color:#94a3b8; font-style:italic;">
            "${active.targetFormula}"
          </div>
        </div>
      </div>
    `;

    // Mini Blueprint Schematic Diagram
    const miniBlueprintHtml = `
      <div class="mini-blueprint-box">
        <div class="mini-blueprint-header">
          <span>📐</span> <span>Mini Recipe Blueprint:</span>
        </div>
        <div class="mini-blueprint-grid">
          ${active.pattern.map((row) => {
            return row.map((cell) => {
              if (cell === 'wood') return `<div class="mini-blueprint-cell has-item">🪵</div>`;
              if (cell === 'stone') return `<div class="mini-blueprint-cell has-item">🪨</div>`;
              if (cell === 'iron') return `<div class="mini-blueprint-cell has-item">⚙️</div>`;
              if (cell === 'coal') return `<div class="mini-blueprint-cell has-item">⚫</div>`;
              if (cell === 'stick') return `<div class="mini-blueprint-cell has-item">🥢</div>`;
              return `<div class="mini-blueprint-cell is-empty">·</div>`;
            }).join('');
          }).join('')}
        </div>
        <div style="font-size:0.75rem; color:#94a3b8; text-align:center;">
          ${active.miniGuide || 'Place materials to match this pattern.'}
        </div>
      </div>
    `;

    list.innerHTML = stepperHtml + previewCardHtml + miniBlueprintHtml;

    // Update active goal text in center stage
    const title = document.getElementById('activeCraftGoalTitle');
    const formula = document.getElementById('activeCraftGoalFormula');
    if (title) title.textContent = active.name;
    if (formula) formula.textContent = `"${active.targetFormula}"`;

    // Check stamp
    const seal = document.getElementById('forgeStampSeal');
    if (seal) {
      if (isCrafted) {
        seal.textContent = active.stampText || `${active.name.toUpperCase()} CRAFTED! ⭐`;
        seal.classList.add('is-stamped');
      } else {
        seal.classList.remove('is-stamped');
      }
    }
  }

  function select3x3Recipe(idx) {
    playerSession.activeRecipeIndex = idx;
    clear3x3Grid();
    renderForgeRecipeList();
    if (root.BiomeAudio) root.BiomeAudio.playSnap();
  }

  function renderGrid3x3() {
    const container = document.getElementById('grid3x3Container');
    const data = root.BIOME_CRAFTER_DATA;
    if (!container || !data) return;

    const recipe = data.crafting3x3Recipes[playerSession.activeRecipeIndex];
    let html = '';

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const item = playerSession.grid3x3[r][c];
        const ghostReq = (recipe && recipe.pattern && recipe.pattern[r]) ? recipe.pattern[r][c] : '';

        if (item) {
          let icon = '🪵';
          if (item === 'stone') icon = '🪨';
          else if (item === 'iron') icon = '⚙️';
          else if (item === 'coal') icon = '⚫';
          else if (item === 'stick') icon = '🥢';

          html += `
            <div class="crafting-slot" onclick="handleSocketClick(${r}, ${c})" title="Click to remove ${item}">
              <span class="placed-voxel-icon">${icon}</span>
            </div>
          `;
        } else if (ghostReq) {
          // Render translucent ghost icon inside the slot
          let ghostIcon = '🪵';
          if (ghostReq === 'stone') ghostIcon = '🪨';
          else if (ghostReq === 'iron') ghostIcon = '⚙️';
          else if (ghostReq === 'coal') ghostIcon = '⚫';
          else if (ghostReq === 'stick') ghostIcon = '🥢';

          html += `
            <div class="crafting-slot has-ghost" onclick="handleSocketClick(${r}, ${c})" title="Tap to place ${ghostReq}">
              <span class="ghost-icon">${ghostIcon}</span>
            </div>
          `;
        } else {
          html += `
            <div class="crafting-slot" onclick="handleSocketClick(${r}, ${c})">
            </div>
          `;
        }
      }
    }

    container.innerHTML = html;
    check3x3Match();
  }

  function check3x3Match() {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return false;
    const recipe = data.crafting3x3Recipes[playerSession.activeRecipeIndex];
    if (!recipe) return false;

    let isMatch = true;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (playerSession.grid3x3[r][c] !== recipe.pattern[r][c]) {
          isMatch = false;
          break;
        }
      }
      if (!isMatch) break;
    }

    const forgeBtn = document.getElementById('btnForgeItem');
    if (forgeBtn) {
      if (isMatch) {
        forgeBtn.classList.add('is-ready');
        forgeBtn.innerHTML = '<span>✨ READY! 🔨 FORGE ITEM! ✨</span>';
      } else {
        forgeBtn.classList.remove('is-ready');
        forgeBtn.innerHTML = '<span>🔨</span> <span>Forge Item!</span>';
      }
    }
    return isMatch;
  }

  function handleSocketClick(r, c) {
    const data = root.BIOME_CRAFTER_DATA;
    const recipe = data ? data.crafting3x3Recipes[playerSession.activeRecipeIndex] : null;
    const currentItem = playerSession.grid3x3[r][c];

    if (currentItem) {
      playerSession.grid3x3[r][c] = '';
      if (root.BiomeAudio) root.BiomeAudio.playSnap();
    } else {
      const ghostReq = (recipe && recipe.pattern && recipe.pattern[r]) ? recipe.pattern[r][c] : '';
      if (ghostReq && (!playerSession.selectedPaletteItem || playerSession.selectedPaletteItem === ghostReq)) {
        playerSession.grid3x3[r][c] = ghostReq;
      } else if (playerSession.selectedPaletteItem) {
        playerSession.grid3x3[r][c] = playerSession.selectedPaletteItem;
      } else if (ghostReq) {
        playerSession.grid3x3[r][c] = ghostReq;
      }

      if (root.BiomeAudio) root.BiomeAudio.playWoodChop();
    }

    renderGrid3x3();
  }

  function renderPaletteChips() {
    const row = document.getElementById('paletteChipsRow');
    if (!row) return;

    const items = [
      { id: 'wood', label: 'Wood Planks', icon: '🪵', qty: 'x6' },
      { id: 'stone', label: 'Cobblestone', icon: '🪨', qty: 'x4' },
      { id: 'iron', label: 'Iron Ingots', icon: '⚙️', qty: 'x2' },
      { id: 'coal', label: 'Coal', icon: '⬛', qty: 'x2' },
      { id: 'stick', label: 'Sticks', icon: '🥢', qty: 'x2' }
    ];

    row.innerHTML = items.map(it => {
      const isSelected = (it.id === playerSession.selectedPaletteItem);
      return `
        <button type="button" class="inventory-btn ${isSelected ? 'is-selected' : ''}" onclick="selectPaletteItem('${it.id}')">
          <div class="item-box-48">${it.icon}</div>
          <div class="item-label-group">
            <span class="item-name">${it.label}</span>
            <span class="item-qty-badge">${it.qty}</span>
          </div>
        </button>
      `;
    }).join('');
  }

  function selectPaletteItem(itemId) {
    playerSession.selectedPaletteItem = itemId;
    renderPaletteChips();
    if (root.BiomeAudio) root.BiomeAudio.playSnap();
  }

  function clear3x3Grid() {
    playerSession.grid3x3 = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    const seal = document.getElementById('forgeStampSeal');
    if (seal) seal.classList.remove('is-stamped');
    renderGrid3x3();
  }

  function verify3x3Craft() {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;

    const recipe = data.crafting3x3Recipes[playerSession.activeRecipeIndex];
    if (!recipe) return;

    const isMatch = check3x3Match();
    const seal = document.getElementById('forgeStampSeal');

    if (isMatch) {
      if (root.BiomeAudio) {
        root.BiomeAudio.playHammerSlam();
      }

      if (!playerSession.crafted3x3Ids.has(recipe.id)) {
        playerSession.crafted3x3Ids.add(recipe.id);
        playerSession.baseDefenseLevel = Math.min(100, playerSession.baseDefenseLevel + recipe.defenseBoost);
        addXP(15);
        ConfettiEngine.burst(55);
      }

      if (seal) {
        seal.textContent = recipe.stampText || `${recipe.name.toUpperCase()} CRAFTED! ⭐`;
        seal.classList.add('is-stamped');
      }

      // Update Base Defense HUD and stage meter
      const defNum = document.getElementById('baseDefenseNumber');
      const defFill = document.getElementById('baseDefenseFill');
      if (defNum) defNum.textContent = `${playerSession.baseDefenseLevel}%`;
      if (defFill) defFill.style.width = `${playerSession.baseDefenseLevel}%`;

      renderForgeRecipeList();

      // If next recipe exists, auto-advance after 1.4s
      if (playerSession.activeRecipeIndex < data.crafting3x3Recipes.length - 1) {
        setTimeout(() => {
          playerSession.activeRecipeIndex++;
          clear3x3Grid();
          renderForgeRecipeList();
        }, 1400);
      }
    } else {
      // Soft-fail
      if (root.BiomeAudio) root.BiomeAudio.playSoftFail();
      const grid = document.getElementById('grid3x3Container');
      if (grid) {
        grid.classList.remove('wobble-fail');
        void grid.offsetWidth;
        grid.classList.add('wobble-fail');
      }
      if (seal) seal.classList.remove('is-stamped');
    }
  }

  // =========================================================================
  // STAGE 6: THE MIDNIGHT CREEPER DEFENSE (INTERACTIVE SHELTER SCENE)
  // =========================================================================
  function renderStage6Defense() {
    if (!playerSession.defenseState) {
      playerSession.defenseState = {
        window1: false,
        door: false,
        window2: false
      };
    }

    const state = playerSession.defenseState;
    const titleEl = document.getElementById('defenseAlertTitle');
    const descEl = document.getElementById('defenseAlertDesc');
    const actionsRow = document.getElementById('defenseActionsRow');
    const victoryCallout = document.getElementById('defenseVictoryNotice');

    // Visual elements
    const win1 = document.getElementById('shelterWindow1');
    const win1Glow = document.getElementById('window1TorchGlow');
    const win1Badge = document.getElementById('window1Badge');
    const wallMountLeft = document.getElementById('wallMountLeft');

    const door = document.getElementById('shelterDoorway');
    const doorLeaf = document.getElementById('doorLeaf');
    const doorLockIcon = document.getElementById('doorLockIcon');
    const doorBadge = document.getElementById('doorBadge');
    const doorMob = document.getElementById('doorExteriorMob');

    const win2 = document.getElementById('shelterWindow2');
    const win2Badge = document.getElementById('window2Badge');
    const golemOverlay = document.getElementById('golemSmashOverlay');

    // Sync Window 1 Visuals
    if (state.window1) {
      if (win1) { win1.classList.remove('has-alert'); win1.classList.add('is-lit'); }
      if (win1Glow) win1Glow.style.display = 'block';
      if (win1Badge) win1Badge.textContent = 'West Window: Lit 🕯️';
      if (wallMountLeft) wallMountLeft.classList.add('is-lit');
    } else {
      if (win1) { win1.classList.add('has-alert'); win1.classList.remove('is-lit'); }
      if (win1Glow) win1Glow.style.display = 'none';
      if (win1Badge) win1Badge.textContent = 'West Window (Dark)';
    }

    // Sync Door Visuals
    if (state.door) {
      if (door) { door.classList.remove('has-alert'); door.classList.add('is-locked'); }
      if (doorLeaf) { doorLeaf.classList.remove('open'); doorLeaf.classList.add('shut'); }
      if (doorLockIcon) doorLockIcon.textContent = '🔒';
      if (doorBadge) doorBadge.textContent = 'Main Door: Bolted 🔒';
      if (doorMob) doorMob.style.display = 'none';
    } else {
      if (door) { door.classList.remove('is-locked'); }
      if (doorLeaf) { doorLeaf.classList.add('open'); doorLeaf.classList.remove('shut'); }
      if (doorLockIcon) doorLockIcon.textContent = '🔓';
      if (doorBadge) doorBadge.textContent = 'Main Entrance (Unbolted)';
      if (doorMob) doorMob.style.display = 'flex';
      if (state.window1 && !state.door) {
        if (door) door.classList.add('has-alert');
      }
    }

    // Sync Window 2 Visuals
    if (state.window2) {
      if (win2) { win2.classList.remove('has-alert'); win2.classList.add('is-lit'); }
      if (win2Badge) win2Badge.textContent = 'East Perimeter: Secured 🤖';
      if (golemOverlay) golemOverlay.style.display = 'flex';
    } else {
      if (win2) { win2.classList.remove('is-lit'); }
      if (win2Badge) win2Badge.textContent = 'East Window (Perimeter)';
      if (golemOverlay) golemOverlay.style.display = 'none';
      if (state.door && !state.window2) {
        if (win2) win2.classList.add('has-alert');
      }
    }

    // Determine Active Step & Action Button
    if (!state.window1) {
      if (titleEl) titleEl.textContent = '⚠️ Alert 1 of 3: Dark Shadow at West Window!';
      if (descEl) descEl.textContent = 'The window is dark! Tap window to place a torch and illuminate the shelter!';
      if (actionsRow) {
        actionsRow.innerHTML = `
          <button type="button" class="btn-3d btn-game-torch" onclick="handleDefenseTrigger('torch')" style="font-size:1.15rem; padding:16px 36px;">
            <span>🔥 Place Torch on West Window!</span>
          </button>
        `;
      }
      if (victoryCallout) victoryCallout.style.display = 'none';
    } else if (!state.door) {
      if (titleEl) titleEl.textContent = '⚠️ Alert 2 of 3: Footsteps Outside! Creeper Approaching!';
      if (descEl) descEl.textContent = 'A creeper is at the door! Tap entrance to shut and bolt the heavy oak door!';
      if (actionsRow) {
        actionsRow.innerHTML = `
          <button type="button" class="btn-3d btn-game-torch" onclick="handleDefenseTrigger('lock')" style="font-size:1.15rem; padding:16px 36px;">
            <span>🔒 Shut &amp; Bolt Wooden Door!</span>
          </button>
        `;
      }
      if (victoryCallout) victoryCallout.style.display = 'none';
    } else if (!state.window2) {
      if (titleEl) titleEl.textContent = '⚠️ Alert 3 of 3: Perimeter Breach at East Window!';
      if (descEl) descEl.textContent = 'A mob of creepers has gathered outside! Tap to deploy the Iron Golem defender!';
      if (actionsRow) {
        actionsRow.innerHTML = `
          <button type="button" class="btn-3d btn-game-emerald" onclick="handleDefenseTrigger('golem')" style="font-size:1.15rem; padding:16px 36px;">
            <span>🤖 Deploy Iron Golem Defender!</span>
          </button>
        `;
      }
      if (victoryCallout) victoryCallout.style.display = 'none';
    } else {
      // All 3 Completed!
      if (titleEl) titleEl.textContent = '🎉 PERIMETER FULLY DEFENDED! ALL CREEPERS REPELLED!';
      if (descEl) descEl.textContent = 'Your oak and cobblestone shelter is completely fortified. You survived the midnight siege!';
      if (actionsRow) actionsRow.innerHTML = '';
      if (victoryCallout) victoryCallout.style.display = 'flex';
    }
  }

  function handleDefenseTrigger(actionType) {
    if (!playerSession.defenseState) {
      playerSession.defenseState = { window1: false, door: false, window2: false };
    }
    const state = playerSession.defenseState;
    const log = document.getElementById('defenseSuccessLog');

    if (actionType === 'torch' && !state.window1) {
      state.window1 = true;
      if (root.BiomeAudio) {
        root.BiomeAudio.playWoodChop();
        root.BiomeAudio.playTorchSizzle();
      }
      ConfettiEngine.burst(30);
      addXP(10);
      if (log) log.textContent = '✓ West window illuminated with bright torch! The creeper fled into the dark woods!';
      renderStage6Defense();

      // Sound cue for next threat
      setTimeout(() => {
        if (!state.door && root.BiomeAudio) root.BiomeAudio.playCreeperHiss();
      }, 1100);
    } else if (actionType === 'lock' && !state.door) {
      state.door = true;
      if (root.BiomeAudio) {
        root.BiomeAudio.playDoorThud();
        root.BiomeAudio.playSnap();
      }
      ConfettiEngine.burst(35);
      addXP(10);
      if (log) log.textContent = '✓ Heavy wooden door slammed shut and bolted! Monsters cannot enter!';
      renderStage6Defense();

      setTimeout(() => {
        if (!state.window2 && root.BiomeAudio) root.BiomeAudio.playCreeperHiss();
      }, 1100);
    } else if (actionType === 'golem' && !state.window2) {
      state.window2 = true;
      if (root.BiomeAudio) {
        root.BiomeAudio.playHammerSlam();
        root.BiomeAudio.playVictoryFanfare();
      }
      ConfettiEngine.burst(65);
      addXP(15);
      playerSession.baseDefenseLevel = 100;

      // Update HUD & Meter
      const defNum = document.getElementById('baseDefenseNumber');
      const defFill = document.getElementById('baseDefenseFill');
      if (defNum) defNum.textContent = '100%';
      if (defFill) defFill.style.width = '100%';

      if (log) log.textContent = '✓ Iron Golem deployed! All perimeter creepers smashed and defeated!';
      renderStage6Defense();
    }
  }

  function executeDefenseAction(directiveId) {
    if (!playerSession.defenseState.window1) handleDefenseTrigger('torch');
    else if (!playerSession.defenseState.door) handleDefenseTrigger('lock');
    else if (!playerSession.defenseState.window2) handleDefenseTrigger('golem');
  }

  // =========================================================================
  // STAGE 7: NIGHT SURVIVAL TELEPROMPTER STUDIO
  // =========================================================================
  function renderStage7Studio() {
    const data = root.BIOME_CRAFTER_DATA;
    const list = document.getElementById('teleprompterTemplatesList');
    if (!list || !data) return;

    list.innerHTML = data.teleprompterTemplates.map((tp, idx) => {
      const isSelected = (playerSession.activeTeleprompterTemplate && playerSession.activeTeleprompterTemplate.id === tp.id);
      return `
        <button type="button" class="teleprompter-choice-card ${isSelected ? 'is-selected' : ''}" onclick="selectTeleprompterTemplate('${tp.id}')">
          <div style="font-size:1.02rem; font-weight:900; color:#ffffff;">${tp.title}</div>
          <div style="font-size:0.8rem; color:#94a3b8; margin-top:2px;">3-Sentence Debrief</div>
        </button>
      `;
    }).join('');

    updateTeleprompterScreen();
  }

  function selectTeleprompterTemplate(templateId) {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;
    const found = data.teleprompterTemplates.find(t => t.id === templateId);
    if (found) {
      playerSession.activeTeleprompterTemplate = found;
      if (root.BiomeAudio) root.BiomeAudio.playSnap();
      renderStage7Studio();
    }
  }

  function updateTeleprompterScreen() {
    const tp = playerSession.activeTeleprompterTemplate;
    if (!tp) return;

    const titleEl = document.getElementById('tpActiveBaseName');
    if (titleEl) titleEl.textContent = tp.title;

    const line1 = document.getElementById('tpLine1');
    const line2 = document.getElementById('tpLine2');
    const line3 = document.getElementById('tpLine3');

    if (line1) line1.textContent = tp.line1;
    if (line2) line2.textContent = tp.line2;
    if (line3) line3.textContent = tp.line3;

    const podium = document.getElementById('tpMascotPodium');
    if (podium) {
      podium.innerHTML = `
        <img src="${tp.mascotImg}" alt="Mascot" class="hero-character-sprite" style="max-height:160px;">
        <div class="pedestal-disc" style="background: radial-gradient(ellipse at center, rgba(245,158,11,0.45) 0%, transparent 72%);"></div>
      `;
    }
  }

  function readTeleprompterAloud() {
    const tp = playerSession.activeTeleprompterTemplate;
    if (!tp || playerSession.isSpeaking) return;

    playerSession.isSpeaking = true;
    const btn = document.getElementById('btnReadTeleprompter');
    if (btn) btn.classList.add('is-pressed');

    const lines = [
      { el: document.getElementById('tpLine1'), text: tp.line1 },
      { el: document.getElementById('tpLine2'), text: tp.line2 },
      { el: document.getElementById('tpLine3'), text: tp.line3 }
    ];

    let current = 0;

    function speakNext() {
      if (current >= lines.length) {
        playerSession.isSpeaking = false;
        if (btn) btn.classList.remove('is-pressed');
        lines.forEach((l, idx) => {
          if (l.el) {
            l.el.classList.remove('is-active-line');
            l.el.textContent = l.text;
          }
        });
        if (lines[0].el) lines[0].el.classList.add('is-active-line');
        return;
      }

      // Highlight active line
      lines.forEach((l, idx) => {
        if (l.el) {
          if (idx === current) {
            l.el.classList.add('is-active-line');
            // Split line into word spans for karaoke highlight
            const words = l.text.split(' ');
            l.el.innerHTML = words.map((w, wi) => `<span class="tp-word" id="tpw-${current}-${wi}">${w}</span>`).join(' ');

            // Animate word highlighting
            const totalWords = words.length;
            const wordDelay = Math.max(160, Math.floor(2500 / Math.max(1, totalWords)));
            words.forEach((_, wi) => {
              setTimeout(() => {
                const wSpan = document.getElementById(`tpw-${current}-${wi}`);
                if (wSpan) {
                  wSpan.style.color = '#fef08a';
                  wSpan.style.textShadow = '0 0 12px rgba(254, 240, 138, 0.9)';
                  wSpan.style.fontWeight = '900';
                  wSpan.style.transform = 'scale(1.08)';
                  wSpan.style.display = 'inline-block';
                }
              }, wi * wordDelay);
            });
          } else {
            l.el.classList.remove('is-active-line');
            l.el.textContent = l.text;
          }
        }
      });

      if (root.BiomeAudio) {
        root.BiomeAudio.speak(lines[current].text, () => {
          current++;
          setTimeout(speakNext, 350);
        });
      } else {
        current++;
        setTimeout(speakNext, 1200);
      }
    }

    speakNext();
  }

  function finishSurvivalQuest() {
    const needed = Math.max(0, 200 - playerSession.xp);
    if (needed > 0) {
      addXP(needed);
    }

    if (root.BiomeAudio) {
      root.BiomeAudio.playVictoryFanfare();
    }

    ConfettiEngine.burst(90);

    const diplomaXP = document.getElementById('diplomaTotalXP');
    if (diplomaXP) diplomaXP.textContent = `⭐ +${playerSession.xp} XP`;

    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.add('is-open');
  }

  function closeCompletionModal() {
    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.remove('is-open');
  }

  // =========================================================================
  // STAGE 8: FIELD DIAGNOSTIC & PRINTABLE BLUEPRINT
  // =========================================================================
  function renderStage8Diagnostic() {
    const container = document.getElementById('quizContainer');
    const data = root.BIOME_CRAFTER_DATA;
    if (!container || !data) return;

    container.innerHTML = data.exitQuiz.map((q, idx) => {
      const selected = playerSession.quizAnswers[q.id];
      const isAnswered = (selected !== undefined);

      return `
        <div class="quiz-card" id="quizCard-${q.id}">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="hud-tag" style="background:#1e293b; border-color:#475569;">Question 0${idx + 1}</span>
            ${isAnswered ? (selected === q.correct ? '<span style="color:#10b981; font-weight:900;">✓ Correct</span>' : '<span style="color:#ef4444; font-weight:900;">✗ Review</span>') : ''}
          </div>

          <h4 style="font-size:1.15rem; font-weight:900; color:#ffffff;">${q.question}</h4>

          <div class="quiz-options-grid">
            ${q.options.map((opt, oIdx) => {
              let btnClass = 'quiz-option-btn';
              if (isAnswered) {
                if (oIdx === q.correct) btnClass += ' is-correct';
                else if (oIdx === selected) btnClass += ' is-wrong';
              }
              return `
                <button type="button" class="${btnClass}" onclick="handleQuizAnswer('${q.id}', ${oIdx})" ${isAnswered ? 'disabled' : ''}>
                  ${String.fromCharCode(65 + oIdx)}. ${opt}
                </button>
              `;
            }).join('')}
          </div>

          ${isAnswered ? `
            <div style="background:#060911; border-left:4px solid #38bdf8; padding:10px 14px; font-size:0.85rem; color:#cbd5e1; border-radius:8px;">
              <strong>Rule Explanation:</strong> ${q.explanation}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  function handleQuizAnswer(questionId, optionIndex) {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;
    const q = data.exitQuiz.find(item => item.id === questionId);
    if (!q) return;

    playerSession.quizAnswers[questionId] = optionIndex;

    if (optionIndex === q.correct) {
      addXP(7);
      if (root.BiomeAudio) root.BiomeAudio.playSnap();
    } else {
      if (root.BiomeAudio) root.BiomeAudio.playSoftFail();
    }

    renderStage8Diagnostic();
  }

  function toggleMuteAudio() {
    if (root.BiomeAudio) {
      const isMuted = root.BiomeAudio.toggleMute();
      const btn = document.getElementById('btnMuteToggle');
      if (btn) btn.textContent = isMuted ? '🔇 Muted' : '🔊 Sound';
    }
  }

  // --- EXPOSE GLOBALS TO ROOT ---
  root.switchStage = switchStage;
  root.handleScanBiome = handleScanBiome;
  root.speakBiomeFormula = speakBiomeFormula;

  root.handleMineClick = handleMineClick;

  root.speakSmithingFormula = speakSmithingFormula;
  root.craftSmithingTool = craftSmithingTool;
  root.select2x2Recipe = select2x2Recipe;
  root.selectSmithingPaletteItem = selectSmithingPaletteItem;
  root.handleSocket2x2Click = handleSocket2x2Click;
  root.clear2x2Grid = clear2x2Grid;
  root.verify2x2Craft = verify2x2Craft;

  root.handleSortChoice = handleSortChoice;

  root.select3x3Recipe = select3x3Recipe;
  root.selectPaletteItem = selectPaletteItem;
  root.handleSocketClick = handleSocketClick;
  root.clear3x3Grid = clear3x3Grid;
  root.verify3x3Craft = verify3x3Craft;

  root.executeDefenseAction = executeDefenseAction;
  root.handleDefenseTrigger = handleDefenseTrigger;

  root.selectTeleprompterTemplate = selectTeleprompterTemplate;
  root.readTeleprompterAloud = readTeleprompterAloud;
  root.finishSurvivalQuest = finishSurvivalQuest;
  root.closeCompletionModal = closeCompletionModal;

  root.handleQuizAnswer = handleQuizAnswer;
  root.toggleMuteAudio = toggleMuteAudio;

  // Boot on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }

})(typeof window !== 'undefined' ? window : global);
