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

    // Stage 3: Tool Smithing Bench
    craftedSmithingIds: new Set(),

    // Stage 4: Sunset Sorting Drill
    sortingIndex: 0,
    sortingScore: 0,
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
  // STAGE 3: THE TOOL SMITHING BENCH
  // =========================================================================
  function renderStage3Smithing() {
    const grid = document.getElementById('smithingGridContainer');
    const data = root.BIOME_CRAFTER_DATA;
    if (!grid || !data) return;

    grid.innerHTML = data.smithingRecipes.map((r, idx) => {
      const isCrafted = playerSession.craftedSmithingIds.has(r.id);

      return `
        <div class="smithing-recipe-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="hud-tag" style="background:#b45309; border-color:#f59e0b;">${r.tier}</span>
            <span style="font-size:0.85rem; color:#94a3b8; font-weight:800;">Recipe 0${idx + 1}</span>
          </div>

          <div style="display:flex; align-items:center; gap:16px;">
            <img src="${r.img}" alt="${r.name}" style="width:90px; height:90px; object-fit:contain; border-radius:16px; background:#060911; padding:8px; border:2px solid #334155;">
            <div>
              <h4 style="font-size:1.35rem; font-weight:900; color:#ffffff;">${r.name}</h4>
              <p style="font-size:0.88rem; color:#94a3b8; margin-top:2px;">${r.purpose}</p>
            </div>
          </div>

          <!-- Linguistic Formula Box -->
          <div style="background:#060911; border:2px solid #f59e0b; border-radius:16px; padding:14px;">
            <div style="font-size:0.75rem; font-weight:900; color:#f59e0b; text-transform:uppercase;">
              Linguistic Production Formula:
            </div>
            <div style="font-size:1.05rem; font-weight:800; color:#fef08a; margin-top:4px;">
              "${r.formula}"
            </div>
          </div>

          <div style="display:flex; gap:12px; margin-top:auto;">
            <button type="button" class="btn-3d btn-game-diamond" style="flex:1; padding:12px 16px; font-size:0.92rem;" onclick="speakSmithingFormula('${r.id}')">
              <span>🔊</span> <span>Hear Formula</span>
            </button>
            <button type="button" class="btn-3d ${isCrafted ? 'btn-game-emerald' : 'btn-game-torch'}" style="flex:1.4; padding:12px 16px; font-size:0.95rem;" onclick="craftSmithingTool('${r.id}')" ${isCrafted ? 'disabled' : ''}>
              <span>${isCrafted ? '✓ CRAFTED!' : '🔨 Craft Tool (+12 XP)'}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function speakSmithingFormula(recipeId) {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;
    const r = data.smithingRecipes.find(item => item.id === recipeId);
    if (r && root.BiomeAudio) {
      root.BiomeAudio.speak(r.formula);
    }
  }

  function craftSmithingTool(recipeId) {
    if (!playerSession.craftedSmithingIds.has(recipeId)) {
      playerSession.craftedSmithingIds.add(recipeId);
      addXP(12);
      if (root.BiomeAudio) root.BiomeAudio.playHammerSlam();
      ConfettiEngine.burst(40);
      renderStage3Smithing();
    }
  }

  // =========================================================================
  // STAGE 4: SUNSET EMERGENCY SORTING DRILL
  // =========================================================================
  function renderStage4Sunset() {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;

    const items = data.sortingItems;
    const current = items[playerSession.sortingIndex] || items[0];

    const numEl = document.getElementById('conveyorItemNum');
    const iconEl = document.getElementById('conveyorItemIcon');
    const nameEl = document.getElementById('conveyorItemName');
    const reasonEl = document.getElementById('conveyorItemReason');

    if (numEl) numEl.textContent = `${playerSession.sortingIndex + 1}`;
    if (iconEl) iconEl.textContent = current.icon;
    if (nameEl) nameEl.textContent = current.name;
    if (reasonEl) reasonEl.textContent = current.reason;
  }

  function handleSortChoice(choice) {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;

    const items = data.sortingItems;
    const current = items[playerSession.sortingIndex];
    if (!current) return;

    const card = document.getElementById('conveyorCard');

    if (choice === current.category) {
      // Correct sort
      playerSession.sortingScore++;
      addXP(2);
      if (root.BiomeAudio) root.BiomeAudio.playSnap();

      if (card) {
        card.style.transform = 'scale(1.05)';
        setTimeout(() => { if (card) card.style.transform = 'scale(1)'; }, 150);
      }
    } else {
      // Soft-fail wobble
      if (root.BiomeAudio) root.BiomeAudio.playSoftFail();
      if (card) {
        card.style.transform = 'translateX(-8px)';
        setTimeout(() => { if (card) card.style.transform = 'translateX(0)'; }, 150);
      }
    }

    if (playerSession.sortingIndex < items.length - 1) {
      playerSession.sortingIndex++;
      renderStage4Sunset();
    } else {
      // Completed drill
      addXP(10);
      ConfettiEngine.burst(50);
      if (root.BiomeAudio) root.BiomeAudio.playVictoryFanfare();
    }
  }

  // =========================================================================
  // STAGE 5: 3x3 TACTILE SHELTER FORGE
  // =========================================================================
  function renderStage5Forge() {
    renderForgeRecipeList();
    renderGrid3x3();
    renderPaletteChips();
  }

  function renderForgeRecipeList() {
    const list = document.getElementById('forgeRecipesList');
    const data = root.BIOME_CRAFTER_DATA;
    if (!list || !data) return;

    list.innerHTML = data.crafting3x3Recipes.map((r, idx) => {
      const isSelected = (idx === playerSession.activeRecipeIndex);
      const isCrafted = playerSession.crafted3x3Ids.has(r.id);

      return `
        <button type="button" class="teleprompter-choice-card ${isSelected ? 'is-selected' : ''}" onclick="select3x3Recipe(${idx})" style="border-left: 4px solid var(--accent-torch);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:1.05rem; font-weight:900; color:#ffffff;">${r.name}</span>
            ${isCrafted ? '<span style="font-size:0.75rem; color:#10b981; font-weight:900;">✓ BUILT</span>' : ''}
          </div>
          <div style="font-size:0.8rem; color:#94a3b8; margin-top:4px;">
            ${r.ingredientsLabel}
          </div>
        </button>
      `;
    }).join('');

    const active = data.crafting3x3Recipes[playerSession.activeRecipeIndex];
    if (active) {
      const title = document.getElementById('activeCraftGoalTitle');
      const formula = document.getElementById('activeCraftGoalFormula');
      if (title) title.textContent = active.name;
      if (formula) formula.textContent = `"${active.targetFormula}"`;
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
    if (!container) return;

    let html = '';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const item = playerSession.grid3x3[r][c];
        let icon = '';
        if (item === 'wood') icon = '🪵';
        else if (item === 'stone') icon = '🪨';
        else if (item === 'iron') icon = '⛓️';
        else if (item === 'coal') icon = '⚫';
        else if (item === 'stick') icon = '🥢';

        html += `
          <div class="crafting-slot" onclick="handleSocketClick(${r}, ${c})">
            ${icon}
          </div>
        `;
      }
    }
    container.innerHTML = html;
  }

  function renderPaletteChips() {
    const row = document.getElementById('paletteChipsRow');
    if (!row) return;

    const items = [
      { id: 'wood', label: 'Wood Planks', icon: '🪵' },
      { id: 'stone', label: 'Cobblestone', icon: '🪨' },
      { id: 'iron', label: 'Iron Ingot', icon: '⛓️' },
      { id: 'coal', label: 'Coal Lump', icon: '⚫' },
      { id: 'stick', label: 'Wooden Stick', icon: '🥢' }
    ];

    row.innerHTML = items.map(it => {
      const isActive = (it.id === playerSession.selectedPaletteItem);
      return `
        <button type="button" class="palette-item-chip ${isActive ? 'is-active' : ''}" onclick="selectPaletteItem('${it.id}')">
          <span>${it.icon}</span> <span>${it.label}</span>
        </button>
      `;
    }).join('');
  }

  function selectPaletteItem(itemId) {
    playerSession.selectedPaletteItem = itemId;
    renderPaletteChips();
    if (root.BiomeAudio) root.BiomeAudio.playSnap();
  }

  function handleSocketClick(r, c) {
    if (playerSession.grid3x3[r][c] === playerSession.selectedPaletteItem) {
      playerSession.grid3x3[r][c] = '';
    } else {
      playerSession.grid3x3[r][c] = playerSession.selectedPaletteItem;
    }

    if (root.BiomeAudio) root.BiomeAudio.playSnap();
    renderGrid3x3();
  }

  function clear3x3Grid() {
    playerSession.grid3x3 = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    renderGrid3x3();
  }

  function verify3x3Craft() {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;

    const recipe = data.crafting3x3Recipes[playerSession.activeRecipeIndex];
    if (!recipe) return;

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

    const seal = document.getElementById('forgeStampSeal');

    if (isMatch) {
      // Craft success
      if (root.BiomeAudio) {
        root.BiomeAudio.playHammerSlam();
      }

      if (!playerSession.crafted3x3Ids.has(recipe.id)) {
        playerSession.crafted3x3Ids.add(recipe.id);
        playerSession.baseDefenseLevel = Math.min(100, playerSession.baseDefenseLevel + recipe.defenseBoost);
        addXP(15);
        ConfettiEngine.burst(45);
      }

      if (seal) seal.classList.add('is-stamped');

      // Update Base Defense HUD
      const defNum = document.getElementById('baseDefenseNumber');
      const defFill = document.getElementById('baseDefenseFill');
      if (defNum) defNum.textContent = `${playerSession.baseDefenseLevel}%`;
      if (defFill) defFill.style.width = `${playerSession.baseDefenseLevel}%`;

      renderForgeRecipeList();
    } else {
      // Soft-fail
      if (root.BiomeAudio) root.BiomeAudio.playSoftFail();
      if (seal) seal.classList.remove('is-stamped');
    }
  }

  // =========================================================================
  // STAGE 6: THE MIDNIGHT CREEPER DEFENSE
  // =========================================================================
  function renderStage6Defense() {
    const data = root.BIOME_CRAFTER_DATA;
    const actionsRow = document.getElementById('defenseActionsRow');
    if (!data || !actionsRow) return;

    const currentDirective = data.defenseDirectives[playerSession.defenseStepIndex] || data.defenseDirectives[0];

    const titleEl = document.getElementById('defenseAlertTitle');
    const descEl = document.getElementById('defenseAlertDesc');
    if (titleEl) titleEl.textContent = currentDirective.alert;
    if (descEl) descEl.textContent = currentDirective.threat;

    actionsRow.innerHTML = `
      <button type="button" class="btn-3d btn-game-torch" onclick="executeDefenseAction('${currentDirective.id}')" style="font-size:1.15rem; padding:16px 32px;">
        <span>${currentDirective.actionBtn}</span>
      </button>
    `;
  }

  function executeDefenseAction(directiveId) {
    const data = root.BIOME_CRAFTER_DATA;
    if (!data) return;

    const directive = data.defenseDirectives.find(d => d.id === directiveId);
    if (!directive) return;

    if (root.BiomeAudio) {
      root.BiomeAudio.playCreeperHiss();
      root.BiomeAudio.playSnap();
    }

    const log = document.getElementById('defenseSuccessLog');
    if (log) log.textContent = `✓ ${directive.reactionSuccess}`;

    if (!playerSession.completedDefenseIds.has(directiveId)) {
      playerSession.completedDefenseIds.add(directiveId);
      addXP(10);
      ConfettiEngine.burst(35);
    }

    if (playerSession.defenseStepIndex < data.defenseDirectives.length - 1) {
      playerSession.defenseStepIndex++;
      setTimeout(() => {
        renderStage6Defense();
      }, 1000);
    } else {
      if (log) log.textContent = '🎉 PERIMETER FULLY DEFENDED! ALL CREEPERS REPELLED!';
      if (root.BiomeAudio) root.BiomeAudio.playVictoryFanfare();
    }
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
        lines.forEach(l => { if (l.el) l.el.classList.remove('is-active-line'); });
        if (lines[0].el) lines[0].el.classList.add('is-active-line');
        return;
      }

      lines.forEach((l, idx) => {
        if (l.el) {
          if (idx === current) l.el.classList.add('is-active-line');
          else l.el.classList.remove('is-active-line');
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

  root.handleSortChoice = handleSortChoice;

  root.select3x3Recipe = select3x3Recipe;
  root.selectPaletteItem = selectPaletteItem;
  root.handleSocketClick = handleSocketClick;
  root.clear3x3Grid = clear3x3Grid;
  root.verify3x3Craft = verify3x3Craft;

  root.executeDefenseAction = executeDefenseAction;

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
