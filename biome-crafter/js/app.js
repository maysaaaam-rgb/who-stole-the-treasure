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

    // Inventory Slots (Starting supply for Stage 3 Sandbox Crafting)
    inventory: {
      wood: 12,
      stone: 12,
      iron: 8,
      stick: 12,
      coal: 8
    },

    // Stage 1: Biome Scanner
    scannedBiomes: new Set(),

    // Stage 2: Mining Airlock
    miningProgress: {},

    // Stage 3: The Blacksmith's 3x3 Crafting Table (Sandbox)
    smithing3x3Grid: ['', '', '', '', '', '', '', '', ''],
    selectedSmithing3x3Item: 'wood',
    discoveredRecipes: new Set(),
    matchedRecipe: null,
    craftedSmithing3x3Ids: new Set(),
    get smithing2x2Index() { return 0; },
    set smithing2x2Index(v) {},
    get smithing2x2Grid() { return this.smithing3x3Grid; },
    set smithing2x2Grid(v) { this.smithing3x3Grid = v; },
    get selectedSmithing2x2Item() { return this.selectedSmithing3x3Item; },
    set selectedSmithing2x2Item(v) { this.selectedSmithing3x3Item = v; },
    get craftedSmithing2x2Ids() { return this.discoveredRecipes; },
    get craftedSmithingIds() { return this.discoveredRecipes; },

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
  // =========================================================================
  // STAGE 3: THE BLACKSMITH'S 3x3 CRAFTING TABLE (AUTHENTIC SANDBOX)
  // =========================================================================
  let draggedSmithingItem = null;

  const SMITHING_SPRITES = {
    wood: 'assets/wood_block_transparent.webp',
    stone: 'assets/stone_block_transparent.webp',
    iron: 'assets/iron_ingot_transparent.webp',
    stick: 'assets/wooden_sticks_transparent.webp',
    coal: 'assets/coal_lump_transparent.webp'
  };

  const SMITHING_LABELS = {
    wood: 'Oak Planks',
    stone: 'Cobblestone',
    iron: 'Iron Ingots',
    stick: 'Wooden Sticks',
    coal: 'Coal Lump'
  };

  function matchesGridPattern(gridA, gridB) {
    if (!gridA || !gridB || gridA.length !== 9 || gridB.length !== 9) return false;
    for (let i = 0; i < 9; i++) {
      const itemA = gridA[i] || '';
      const itemB = gridB[i] || '';
      if (itemA !== itemB) return false;
    }
    return true;
  }

  function findMatchingRecipe(grid) {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data || !data.recipeRegistry) return null;

    for (const recipe of data.recipeRegistry) {
      if (matchesGridPattern(grid, recipe.grid)) return recipe;
      if (recipe.altGrids && recipe.altGrids.length) {
        for (const alt of recipe.altGrids) {
          if (matchesGridPattern(grid, alt)) return recipe;
        }
      }
    }
    return null;
  }

  function renderStage3Smithing() {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;

    const recipes = data.recipeRegistry || [];

    // 1. Update Blacksmith's Discovery Tome Progress Count
    const tomeProgressEl = document.getElementById('tomeProgressCount');
    if (tomeProgressEl) {
      tomeProgressEl.textContent = `Discovered: ${playerSession.discoveredRecipes.size} / ${recipes.length}`;
    }

    // 2. Render Left Blacksmith's Discovery Tome List
    const tomeListEl = document.getElementById('blacksmithTomeList');
    if (tomeListEl) {
      tomeListEl.innerHTML = recipes.map(r => {
        const isDiscovered = playerSession.discoveredRecipes.has(r.id);
        if (isDiscovered) {
          const filterStyle = r.imgFilter ? `style="filter: ${r.imgFilter};"` : '';
          return `
            <div class="tome-item-card is-discovered" title="${r.name} - ${r.desc}">
              <div class="tome-card-thumb-wrap">
                <img src="${r.img}" alt="${r.name}" class="tome-card-thumb" ${filterStyle}>
              </div>
              <div class="tome-card-info">
                <div class="tome-card-name">${r.name}</div>
                <div class="tome-card-sub">${r.category} • ⭐ +${r.xp} XP</div>
              </div>
              <div class="tome-card-status">
                <span class="tome-check-pill">✓ DISCOVERED</span>
              </div>
            </div>
          `;
        } else {
          return `
            <div class="tome-item-card is-undiscovered" title="Experiment with materials on the 3×3 grid to discover!">
              <div class="tome-card-thumb-wrap">
                <span class="tome-mystery-icon">🔒</span>
              </div>
              <div class="tome-card-info">
                <div class="tome-card-name">??? Undiscovered Blueprint</div>
                <div class="tome-card-sub">${r.category}</div>
              </div>
              <div class="tome-card-status">
                <span class="tome-lock-pill">LOCKED</span>
              </div>
            </div>
          `;
        }
      }).join('');
    }

    // 3. Render 3x3 Oak Crafting Grid Sockets (9 Slots: 0 to 8 - Completely clean & empty by default)
    const gridEl = document.getElementById('grid2x2Sockets') || document.getElementById('crafting3x3Grid');
    if (gridEl) {
      gridEl.innerHTML = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => {
        const slottedItem = playerSession.smithing3x3Grid[idx];

        if (slottedItem) {
          const spriteSrc = SMITHING_SPRITES[slottedItem] || 'assets/wood_block_transparent.webp';
          const label = SMITHING_LABELS[slottedItem] || slottedItem;
          return `
            <div class="crafting-socket is-slotted"
                 onclick="handleSocketClick(${idx})"
                 title="Slot ${idx + 1}: ${label} (Click to return to backpack)">
              <img src="${spriteSrc}" alt="${label}" class="placed-item-sprite">
            </div>
          `;
        } else {
          return `
            <div class="crafting-socket"
                 onclick="handleSocketClick(${idx})"
                 ondragover="handleSmithingDragOver(event)"
                 ondragleave="handleSmithingDragLeave(event)"
                 ondrop="handleSmithingDrop(event, ${idx})"
                 title="Slot ${idx + 1}: Empty (Click or drag to place)">
            </div>
          `;
        }
      }).join('');
    }

    // 4. Render Tactile Inventory Palette (5 Materials with 3D Bevels & Live Counts)
    const trayEl = document.getElementById('smithing2x2InventoryTray') || document.getElementById('smithingInventoryTray');
    if (trayEl) {
      const palette = [
        { key: 'wood', label: 'Oak Planks', iconImg: SMITHING_SPRITES.wood, count: playerSession.inventory.wood || 0 },
        { key: 'stone', label: 'Cobblestone', iconImg: SMITHING_SPRITES.stone, count: playerSession.inventory.stone || 0 },
        { key: 'iron', label: 'Iron Ingots', iconImg: SMITHING_SPRITES.iron, count: playerSession.inventory.iron || 0 },
        { key: 'stick', label: 'Sticks', iconImg: SMITHING_SPRITES.stick, count: playerSession.inventory.stick || 0 },
        { key: 'coal', label: 'Coal Lump', iconImg: SMITHING_SPRITES.coal, count: playerSession.inventory.coal || 0 }
      ];

      trayEl.innerHTML = palette.map(p => {
        const isSelected = (playerSession.selectedSmithing3x3Item === p.key);
        return `
          <button type="button" 
                  class="btn-3d inventory-item-btn ${isSelected ? 'is-selected' : ''}" 
                  draggable="true"
                  ondragstart="handleSmithingDragStart(event, '${p.key}')"
                  onclick="selectSmithingPaletteItem('${p.key}')"
                  title="Select ${p.label} (Stock: ${p.count})">
            <img src="${p.iconImg}" alt="${p.label}" class="inv-token-img">
            <span class="inv-btn-name">${p.label}</span>
            <span class="inv-count-pill">×${p.count}</span>
          </button>
        `;
      }).join('');
    }

    // 5. Evaluate Live Spatial Recipe Recognition
    const matched = findMatchingRecipe(playerSession.smithing3x3Grid);
    playerSession.matchedRecipe = matched;

    // 6. Update Connecting Flow Arrow
    const arrowEl = document.getElementById('forgeFlowArrow');
    if (arrowEl) {
      if (matched) arrowEl.classList.add('is-active');
      else arrowEl.classList.remove('is-active');
    }

    // 7. Update Output Chamber Header Status
    const statusPill = document.getElementById('outputStatusPill');
    if (statusPill) {
      if (matched) {
        statusPill.textContent = 'READY TO FORGE! ⚡';
        statusPill.classList.add('is-active');
      } else {
        statusPill.textContent = 'Awaiting Recipe';
        statusPill.classList.remove('is-active');
      }
    }

    // 8. Update 140px x 140px Output Anvil Socket & Claim Trigger
    const outputSocketEl = document.getElementById('outputAnvilSocket');
    const claimContainerEl = document.getElementById('outputClaimContainer');

    if (outputSocketEl) {
      if (matched) {
        outputSocketEl.classList.add('is-craftable');
        const filterStyle = matched.imgFilter ? `style="filter: ${matched.imgFilter};"` : '';
        outputSocketEl.innerHTML = `
          <div class="output-item-preview">
            <img src="${matched.img}" alt="${matched.name}" class="output-item-img" ${filterStyle}>
            <span class="output-item-name">${matched.name}</span>
            <span class="output-item-xp">⭐ +${matched.xp} XP</span>
          </div>
        `;
        outputSocketEl.title = `Click to Forge & Claim ${matched.name}!`;

        if (claimContainerEl) {
          claimContainerEl.innerHTML = `
            <button type="button" class="btn-3d btn-claim-output" onclick="claimCraftedOutput()">
              <span>⚡ CLAIM ${matched.name.toUpperCase()}!</span>
            </button>
          `;
        }
      } else {
        outputSocketEl.classList.remove('is-craftable');
        outputSocketEl.innerHTML = `
          <div class="output-empty-state">
            <span class="output-empty-icon">⚒️</span>
            <span class="output-empty-hint">Arrange 3×3 Recipe</span>
          </div>
        `;
        outputSocketEl.title = 'Arrange materials on 3×3 workbench to reveal recipe';

        if (claimContainerEl) {
          claimContainerEl.innerHTML = '';
        }
      }
    }
  }

  function selectSmithingPaletteItem(key) {
    playerSession.selectedSmithing3x3Item = key;
    if (root.BiomeAudio) root.BiomeAudio.playSnap();
    renderStage3Smithing();
  }

  function handleSocketClick(idx) {
    const currentSlotted = playerSession.smithing3x3Grid[idx];

    if (currentSlotted) {
      // Return slotted material to backpack
      playerSession.inventory[currentSlotted] = (playerSession.inventory[currentSlotted] || 0) + 1;
      playerSession.smithing3x3Grid[idx] = '';
      if (root.BiomeAudio) root.BiomeAudio.playSnap();
      updateHUD();
      renderStage3Smithing();
    } else {
      // Dock currently selected material into empty slot
      const selected = playerSession.selectedSmithing3x3Item;
      if (!selected) return;

      if ((playerSession.inventory[selected] || 0) <= 0) {
        if (root.BiomeAudio) {
          root.BiomeAudio.playSoftFail();
          root.BiomeAudio.speak("Out of " + (SMITHING_LABELS[selected] || selected) + "! Mine or chop more in Stage 2.");
        }
        return;
      }

      playerSession.inventory[selected]--;
      playerSession.smithing3x3Grid[idx] = selected;
      if (root.BiomeAudio) root.BiomeAudio.playSnap();
      updateHUD();
      renderStage3Smithing();
    }
  }

  function handleSmithingDragStart(event, key) {
    draggedSmithingItem = key;
    playerSession.selectedSmithing3x3Item = key;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', key);
      event.dataTransfer.effectAllowed = 'copyMove';
    }
  }

  function handleSmithingDragOver(event) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    const socket = event.currentTarget;
    if (socket && !socket.classList.contains('is-drag-hover')) {
      socket.classList.add('is-drag-hover');
    }
  }

  function handleSmithingDragLeave(event) {
    const socket = event.currentTarget;
    if (socket) {
      socket.classList.remove('is-drag-hover');
    }
  }

  function handleSmithingDrop(event, idx) {
    event.preventDefault();
    const socket = event.currentTarget;
    if (socket) {
      socket.classList.remove('is-drag-hover');
    }
    const itemKey = (event.dataTransfer && event.dataTransfer.getData('text/plain')) || draggedSmithingItem || playerSession.selectedSmithing3x3Item;
    if (itemKey) {
      const old = playerSession.smithing3x3Grid[idx];
      if (old) {
        playerSession.inventory[old] = (playerSession.inventory[old] || 0) + 1;
      }
      if ((playerSession.inventory[itemKey] || 0) > 0) {
        playerSession.inventory[itemKey]--;
        playerSession.smithing3x3Grid[idx] = itemKey;
        if (root.BiomeAudio) root.BiomeAudio.playSnap();
        updateHUD();
        renderStage3Smithing();
      } else {
        if (root.BiomeAudio) root.BiomeAudio.playSoftFail();
      }
    }
  }

  function clearSmithingGrid() {
    for (let i = 0; i < 9; i++) {
      const it = playerSession.smithing3x3Grid[i];
      if (it) {
        playerSession.inventory[it] = (playerSession.inventory[it] || 0) + 1;
        playerSession.smithing3x3Grid[i] = '';
      }
    }
    if (root.BiomeAudio) root.BiomeAudio.playSnap();
    updateHUD();
    renderStage3Smithing();
  }

  function triggerWorkbenchSparks() {
    const frame = document.getElementById('smithing3x3Frame') || document.querySelector('.smithing-3x3-frame');
    if (!frame) return;

    for (let i = 0; i < 28; i++) {
      const spark = document.createElement('div');
      spark.className = 'forge-spark-particle';
      const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.4;
      const distance = 80 + Math.random() * 130;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      spark.style.setProperty('--tx', `${tx}px`);
      spark.style.setProperty('--ty', `${ty}px`);
      spark.style.left = '50%';
      spark.style.top = '50%';
      spark.style.background = Math.random() > 0.45 ? '#f59e0b' : '#38bdf8';
      frame.appendChild(spark);
      setTimeout(() => spark.remove(), 950);
    }
  }

  function claimCraftedOutput() {
    const recipe = playerSession.matchedRecipe || findMatchingRecipe(playerSession.smithing3x3Grid);
    if (!recipe) {
      if (root.BiomeAudio) root.BiomeAudio.playSoftFail();
      return;
    }

    const frame = document.getElementById('smithing3x3Frame');
    const stage = document.getElementById('stagePhase3');

    // 1. Consume materials from workbench grid
    playerSession.smithing3x3Grid = new Array(9).fill('');
    playerSession.matchedRecipe = null;

    // 2. Add to discovered recipes
    playerSession.discoveredRecipes.add(recipe.id);

    // 3. Audio & Haptic Anvil Slam
    if (root.BiomeAudio) {
      if (root.BiomeAudio.playAnvilStrike) root.BiomeAudio.playAnvilStrike();
      else if (root.BiomeAudio.playHammerSlam) root.BiomeAudio.playHammerSlam();

      setTimeout(() => {
        if (root.BiomeAudio.playFanfare) root.BiomeAudio.playFanfare();
        else if (root.BiomeAudio.playVictoryFanfare) root.BiomeAudio.playVictoryFanfare();
      }, 350);
    }

    // 4. Visual impact animations
    if (frame) {
      frame.classList.add('is-striking');
    }
    if (stage) {
      stage.classList.add('screen-shake');
      setTimeout(() => stage.classList.remove('screen-shake'), 1200);
    }

    triggerWorkbenchSparks();
    ConfettiEngine.burst(85);
    addXP(recipe.xp || 35);

    // 5. Rubber stamp animation on workbench
    const stamp = document.getElementById('smithingStampSeal');
    const stampText = document.getElementById('smithingStampSealText');
    if (stamp && stampText) {
      stampText.textContent = `FORGED: ${recipe.name.toUpperCase()}! ⭐`;
      stamp.style.display = 'flex';
      stamp.classList.remove('rubber-stamp-anim');
      void stamp.offsetWidth;
      stamp.classList.add('rubber-stamp-anim');
    }

    // 6. Update UI & open reward discovery modal
    updateHUD();
    renderStage3Smithing();

    setTimeout(() => {
      if (frame) frame.classList.remove('is-striking');
      if (stamp) stamp.style.display = 'none';
      showDiscoveryRewardModal(recipe);
    }, 1300);
  }

  function showDiscoveryRewardModal(recipe) {
    if (!recipe) return;

    const titleEl = document.getElementById('rewardModalTitle');
    const subEl = document.getElementById('rewardModalSubtitle');
    const imgEl = document.getElementById('rewardModalImg');
    const xpEl = document.getElementById('rewardModalXP');
    const sentEl = document.getElementById('rewardModalSentence');
    const contBtn = document.getElementById('rewardModalContinueBtn');

    if (titleEl) titleEl.textContent = `${recipe.name.toUpperCase()} FORGED!`;
    if (subEl) subEl.textContent = `${recipe.category} Discovered & Added to Tome`;
    if (imgEl) {
      imgEl.src = recipe.img;
      imgEl.alt = recipe.name;
      if (recipe.imgFilter) imgEl.style.filter = recipe.imgFilter;
      else imgEl.style.filter = 'none';
    }
    if (xpEl) xpEl.innerHTML = `<span>⭐ +${recipe.xp} XP REWARDED!</span>`;
    if (sentEl) sentEl.textContent = recipe.desc || "Item successfully forged in the 3x3 Crafting Table.";
    if (contBtn) contBtn.innerHTML = `<span>Keep Crafting ⚒️ →</span>`;

    const modal = document.getElementById('smithingRewardModal');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('is-open');
    }
  }

  function handleCloseSmithingReward(e) {
    if (e && e.target && e.target.id === 'smithingRewardModal') {
      const modal = document.getElementById('smithingRewardModal');
      if (modal) modal.style.display = 'none';
    }
  }

  function continueAfterPickaxeReward() {
    const modal = document.getElementById('smithingRewardModal');
    if (modal) modal.style.display = 'none';
    renderStage3Smithing();
  }

  // Backwards compatibility aliases
  function handleSocket2x2Click(idx) { handleSocketClick(idx); }
  function clear2x2Grid() { clearSmithingGrid(); }
  function verify2x2Craft() { claimCraftedOutput(); }
  function select2x2Recipe(idx) { renderStage3Smithing(); }
  function speakStage3Formula() {}
  function speakSmithingFormula(id) {}
  function craftSmithingTool(id) { claimCraftedOutput(); }

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
  root.speakStage3Formula = speakStage3Formula;
  root.craftSmithingTool = craftSmithingTool;
  root.select2x2Recipe = select2x2Recipe;
  root.selectSmithingPaletteItem = selectSmithingPaletteItem;
  root.handleSocket2x2Click = handleSocket2x2Click;
  root.clear2x2Grid = clear2x2Grid;
  root.verify2x2Craft = verify2x2Craft;
  root.showSmithingRewardModal = showSmithingRewardModal;
  root.handleCloseSmithingReward = handleCloseSmithingReward;
  root.continueAfterPickaxeReward = continueAfterPickaxeReward;
  root.handleSmithingDragStart = handleSmithingDragStart;
  root.handleSmithingDragOver = handleSmithingDragOver;
  root.handleSmithingDragLeave = handleSmithingDragLeave;
  root.handleSmithingDrop = handleSmithingDrop;
  root.handleWordBankClick = handleWordBankClick;
  root.handleSentenceSlotClick = handleSentenceSlotClick;
  root.verifySentenceGate = verifySentenceGate;

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
