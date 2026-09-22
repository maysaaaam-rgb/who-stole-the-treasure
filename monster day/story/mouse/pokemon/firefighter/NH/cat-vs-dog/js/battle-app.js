/**
 * CAT VS. DOG: PREPOSITION CATAPULT — MASTER ARCADE & PEDAGOGICAL ENGINE
 * 4-Stage Arc: Preposition Explorer -> Spatial Lab -> 3D Catapult Arena -> Live Studio
 * 60 FPS Canvas Physics, SVG Rig Bitmaps, Dynamic Pupil Tracking, Web Audio Synth
 */

(function(root) {
  'use strict';

  class CatVsDogEngine {
    constructor() {
      this.currentStage = 1; // 1: Explorer, 2: Lab, 3: Arena, 4: Studio
      this.inspectedDioramas = new Set();
      this.labCompleted = false;
      this.currentLabIndex = 0;
      this.unlockedBonusWeapons = false;

      // Arena Physics & State
      this.canvas = null;
      this.ctx = null;
      this.animationFrameId = null;
      this.lastTimestamp = 0;
      this.gameTime = 0;

      this.mode = '1p'; // '1p' (vs AI) or '2p' (Smartboard)
      this.activeTurn = 'cat'; // 'cat' or 'dog'
      this.winner = null;

      // Stats
      this.catHP = 100;
      this.dogHP = 100;
      this.windSpeed = 2.5; // -15 to +15 km/h
      this.currentAngle = 45; // 25 to 75 deg
      this.currentPower = 0; // 0 to 100
      this.isCharging = false;
      this.chargeDir = 1;
      this.selectedWeaponId = 'fish';

      // Screen Shake
      this.screenShake = 0;

      // Physics Objects
      this.projectile = null;
      this.particles = [];
      this.comicDecals = [];

      // Bitmaps Cache
      this.bitmaps = {};
      this.bitmapsLoaded = false;

      // Sound Guard
      this.audioStarted = false;
    }

    init() {
      this._loadBitmaps();
      this._bindHeader();
      this._initStage1Explorer();
      this._initStage2Lab();
      this._initStage3Arena();
      this._initStage4Studio();
      this._initGlobalAudioUnlock();

      // Show initial stage
      this.goToStage(1);
    }

    // Pre-cache SVG data URIs into Image() elements for 60fps canvas blitting
    _loadBitmaps() {
      const assets = root.BATTLE_DATA.SVG_ASSETS;
      const keys = Object.keys(assets);
      let loadedCount = 0;

      keys.forEach(key => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === keys.length) {
            this.bitmapsLoaded = true;
          }
        };
        img.src = assets[key];
        this.bitmaps[key] = img;
      });
    }

    _initGlobalAudioUnlock() {
      const unlock = () => {
        if (!this.audioStarted && root.BattleAudio) {
          root.BattleAudio.ensureAudioContext();
          this.audioStarted = true;
        }
      };
      window.addEventListener('click', unlock, { once: true });
      window.addEventListener('touchstart', unlock, { once: true });
    }

    _bindHeader() {
      // Stepper pill clicks
      document.querySelectorAll('.step-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const targetStage = parseInt(pill.dataset.stage, 10);
          if (targetStage === 1 || 
             (targetStage === 2 && this.inspectedDioramas.size >= 4) ||
             (targetStage === 3 && this.labCompleted) ||
             (targetStage === 4 && this.winner)) {
            this.goToStage(targetStage);
          } else {
            this.showToast('⚠️ Complete the previous stage first!');
          }
        });
      });

      // BGM Toggle
      const bgmBtn = document.getElementById('btn-bgm-toggle');
      if (bgmBtn) {
        bgmBtn.addEventListener('click', () => {
          if (!root.BattleAudio) return;
          if (root.BattleAudio.bgmPlaying) {
            root.BattleAudio.stopBGM();
            bgmBtn.style.opacity = '0.5';
          } else {
            root.BattleAudio.startBGM();
            bgmBtn.style.opacity = '1';
          }
        });
      }

      // Audio Mute Toggle
      const muteBtn = document.getElementById('btn-mute-toggle');
      if (muteBtn) {
        muteBtn.addEventListener('click', () => {
          if (!root.BattleAudio) return;
          const muted = root.BattleAudio.toggleMute();
          muteBtn.textContent = muted ? '🔇' : '🔊';
        });
      }
    }

    goToStage(stageNum) {
      this.currentStage = stageNum;

      // Update Nav Stepper
      document.querySelectorAll('.step-pill').forEach(pill => {
        const s = parseInt(pill.dataset.stage, 10);
        pill.classList.remove('active');
        if (s === stageNum) {
          pill.classList.add('active');
        }
      });

      // Update Viewports
      document.querySelectorAll('.stage-viewport').forEach(vp => {
        vp.classList.remove('active');
      });
      const currentVp = document.getElementById(`stage-${stageNum}-viewport`);
      if (currentVp) currentVp.classList.add('active');

      if (stageNum === 3) {
        this._startArenaLoop();
      } else {
        this._stopArenaLoop();
      }

      if (stageNum === 4) {
        this._setupTeleprompter();
      }
    }

    // ==========================================================================
    // STAGE 1: 3D PREPOSITION EXPLORER
    // ==========================================================================
    _initStage1Explorer() {
      const container = document.getElementById('diorama-cards-grid');
      if (!container) return;

      container.innerHTML = '';
      root.BATTLE_DATA.DIORAMAS.forEach(diorama => {
        const card = document.createElement('div');
        card.className = 'diorama-card';
        card.id = `diorama-${diorama.id}`;
        card.innerHTML = `
          <div class="diorama-art-box">
            ${diorama.svgScene}
          </div>
          <div class="diorama-header">
            <span class="diorama-pill" style="background: ${diorama.color}">${diorama.prep}</span>
            <span class="diorama-status" id="status-${diorama.id}">⚪ Unseen</span>
          </div>
          <p class="diorama-sentence">${diorama.sentence}</p>
          <p class="diorama-rule">${diorama.ruleText}</p>
        `;

        card.addEventListener('click', () => {
          this._inspectDiorama(diorama, card);
        });

        container.appendChild(card);
      });

      // Continue Button
      const contBtn = document.getElementById('btn-explorer-continue');
      if (contBtn) {
        contBtn.addEventListener('click', () => {
          if (this.inspectedDioramas.size >= 4) {
            this.goToStage(2);
          } else {
            this.showToast('Tap all 4 cards to listen and unlock Stage 2!');
          }
        });
      }
    }

    _inspectDiorama(diorama, cardEl) {
      if (root.BattleAudio) {
        root.BattleAudio.playBellChime();
        root.BattleAudio.speak(diorama.speechText);
      }

      // Visual feedback
      document.querySelectorAll('.diorama-card').forEach(c => c.classList.remove('active-reading'));
      cardEl.classList.add('active-reading', 'inspected');

      const statusEl = document.getElementById(`status-${diorama.id}`);
      if (statusEl) statusEl.textContent = '✅ Mastered';

      this.inspectedDioramas.add(diorama.id);

      // Check unlock
      if (this.inspectedDioramas.size >= 4) {
        const pill1 = document.querySelector('.step-pill[data-stage="1"]');
        if (pill1) pill1.classList.add('completed');

        const contBtn = document.getElementById('btn-explorer-continue');
        if (contBtn) {
          contBtn.classList.remove('disabled');
          contBtn.classList.add('btn-emerald');
          contBtn.innerHTML = '✨ Stage 2 Unlocked! (+30 XP) ➔';
        }
      }
    }

    // ==========================================================================
    // STAGE 2: SPATIAL PLACEMENT LAB (DRAG & SNAP)
    // ==========================================================================
    _initStage2Lab() {
      this._updateLabInstruction();
      this._setupDraggable('token-cat', 'socket-cat', 'cat_on_top');
      this._setupDraggable('token-dog', 'socket-dog', 'dog_behind');
    }

    _updateLabInstruction() {
      const challenge = root.BATTLE_DATA.LAB_CHALLENGES[this.currentLabIndex] || root.BATTLE_DATA.LAB_CHALLENGES[0];
      const textEl = document.getElementById('lab-instruction');
      if (textEl) {
        textEl.innerHTML = `<strong>Challenge ${this.currentLabIndex + 1}/2:</strong> ${challenge.instruction}`;
      }
      if (root.BattleAudio) {
        root.BattleAudio.speak(challenge.speechPrompt);
      }
    }

    _setupDraggable(tokenId, socketId, challengeId) {
      const token = document.getElementById(tokenId);
      const socket = document.getElementById(socketId);
      if (!token || !socket) return;

      let isDragging = false;
      let startX, startY;
      let initialLeft, initialTop;

      const onPointerDown = (e) => {
        if (token.classList.contains('snapped')) return;
        isDragging = true;
        token.setPointerCapture(e.pointerId);

        const rect = token.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = token.offsetLeft;
        initialTop = token.offsetTop;

        socket.classList.add('highlight');
      };

      const onPointerMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        token.style.position = 'absolute';
        token.style.left = `${initialLeft + dx}px`;
        token.style.top = `${initialTop + dy}px`;
        token.style.zIndex = '50';
      };

      const onPointerUp = (e) => {
        if (!isDragging) return;
        isDragging = false;
        socket.classList.remove('highlight');

        // Check bounding overlap
        const tokenRect = token.getBoundingClientRect();
        const socketRect = socket.getBoundingClientRect();

        const overlapX = Math.abs((tokenRect.left + tokenRect.width / 2) - (socketRect.left + socketRect.width / 2));
        const overlapY = Math.abs((tokenRect.top + tokenRect.height / 2) - (socketRect.top + socketRect.height / 2));

        if (overlapX < 60 && overlapY < 60) {
          // Successful Snap!
          this._snapToken(token, socket, challengeId);
        } else {
          // Snap back
          token.style.position = '';
          token.style.left = '';
          token.style.top = '';
          token.style.zIndex = '';
        }
      };

      token.addEventListener('pointerdown', onPointerDown);
      token.addEventListener('pointermove', onPointerMove);
      token.addEventListener('pointerup', onPointerUp);
      token.addEventListener('pointercancel', onPointerUp);
    }

    _snapToken(token, socket, challengeId) {
      token.classList.add('snapped');
      socket.classList.add('snapped');
      socket.innerHTML = '';
      socket.appendChild(token);

      token.style.position = 'relative';
      token.style.left = '0px';
      token.style.top = '0px';
      token.style.zIndex = '10';

      if (root.BattleAudio) {
        root.BattleAudio.playSnapClick();
      }
      this._spawnConfetti(socket);

      const challenge = root.BATTLE_DATA.LAB_CHALLENGES.find(c => c.id === challengeId);
      if (challenge && root.BattleAudio) {
        root.BattleAudio.speak(challenge.successAudio);
      }

      this.currentLabIndex++;
      if (this.currentLabIndex < root.BATTLE_DATA.LAB_CHALLENGES.length) {
        setTimeout(() => {
          this._updateLabInstruction();
        }, 1200);
      } else {
        // Complete Lab!
        this.labCompleted = true;
        this.unlockedBonusWeapons = true;
        const pill2 = document.querySelector('.step-pill[data-stage="2"]');
        if (pill2) pill2.classList.add('completed');

        setTimeout(() => {
          this.showToast('🎉 Lab Complete! Bonus Arsenal Unlocked: Water Balloon & Iron Anvil!');
          setTimeout(() => {
            this.goToStage(3);
          }, 1800);
        }, 800);
      }
    }

    _spawnConfetti(targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const colors = ['#38bdf8', '#ea580c', '#10b981', '#f59e0b', '#ec4899'];
      for (let i = 0; i < 25; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti-particle';
        conf.style.left = `${rect.left + Math.random() * rect.width}px`;
        conf.style.top = `${rect.top}px`;
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 1800);
      }
    }

    // ==========================================================================
    // STAGE 3: 3D ALLEY CATAPULT ARENA (60 FPS CANVAS & PHYSICS)
    // ==========================================================================
    _initStage3Arena() {
      this.canvas = document.getElementById('battleCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      // Set internal resolution
      this.canvas.width = 960;
      this.canvas.height = 480;

      this._bindArenaControls();
      this._generateWind();
      this._renderWeaponsBar();
    }

    _bindArenaControls() {
      // Angle Slider
      const angleSlider = document.getElementById('angleSlider');
      const angleValue = document.getElementById('angleValue');
      if (angleSlider && angleValue) {
        angleSlider.addEventListener('input', (e) => {
          this.currentAngle = parseInt(e.target.value, 10);
          angleValue.textContent = `${this.currentAngle}°`;
        });
      }

      // Fire / Charge Button
      const fireBtn = document.getElementById('btn-fire');
      const powerMeter = document.getElementById('powerMeter');

      const startCharge = (e) => {
        e.preventDefault();
        if (this.projectile || this.activeTurn !== 'cat') return;
        this.isCharging = true;
        this.currentPower = 10;
        fireBtn.classList.add('depressed');
      };

      const endCharge = (e) => {
        e.preventDefault();
        if (!this.isCharging) return;
        this.isCharging = false;
        fireBtn.classList.remove('depressed');
        this._launchProjectile('cat', this.currentAngle, this.currentPower);
        this.currentPower = 0;
        if (powerMeter) powerMeter.style.width = '0%';
      };

      if (fireBtn) {
        fireBtn.addEventListener('mousedown', startCharge);
        window.addEventListener('mouseup', endCharge);
        fireBtn.addEventListener('touchstart', startCharge);
        window.addEventListener('touchend', endCharge);
      }
    }

    _renderWeaponsBar() {
      const container = document.getElementById('weapons-selector');
      if (!container) return;
      container.innerHTML = '';

      root.BATTLE_DATA.WEAPONS.forEach(w => {
        const btn = document.createElement('div');
        btn.className = `weapon-btn ${w.id === this.selectedWeaponId ? 'active' : ''}`;
        btn.id = `weapon-btn-${w.id}`;
        btn.innerHTML = `
          <img src="${w.iconSvg}" alt="${w.name}"/>
          <span class="weapon-name">${w.name}</span>
        `;
        btn.addEventListener('click', () => {
          this.selectedWeaponId = w.id;
          document.querySelectorAll('.weapon-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.showToast(`Selected: ${w.name} (${w.damage} DMG)`);
        });
        container.appendChild(btn);
      });
    }

    _generateWind() {
      // Wind speed between -12 and +12
      this.windSpeed = (Math.random() * 24 - 12);
      const windVal = document.getElementById('windValue');
      const windArrow = document.getElementById('windArrow');
      if (windVal) {
        windVal.textContent = `${Math.abs(Math.round(this.windSpeed))} km/h`;
      }
      if (windArrow) {
        windArrow.textContent = this.windSpeed >= 0 ? '➔' : '⬅';
        windArrow.style.color = this.windSpeed >= 0 ? '#38bdf8' : '#fb923c';
      }
    }

    _startArenaLoop() {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      this.lastTimestamp = performance.now();
      const loop = (timestamp) => {
        const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
        this.lastTimestamp = timestamp;
        this.gameTime += dt;

        this._update(dt);
        this._render();

        this.animationFrameId = requestAnimationFrame(loop);
      };
      this.animationFrameId = requestAnimationFrame(loop);
    }

    _stopArenaLoop() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }

    _update(dt) {
      // Charge Meter Physics
      if (this.isCharging) {
        this.currentPower += dt * 90 * this.chargeDir;
        if (this.currentPower >= 100) {
          this.currentPower = 100;
          this.chargeDir = -1;
        } else if (this.currentPower <= 15) {
          this.currentPower = 15;
          this.chargeDir = 1;
        }
        const meter = document.getElementById('powerMeter');
        if (meter) meter.style.width = `${this.currentPower}%`;
      }

      // Projectile Physics
      if (this.projectile) {
        const p = this.projectile;
        const weapon = root.BATTLE_DATA.WEAPONS.find(w => w.id === p.weaponId) || root.BATTLE_DATA.WEAPONS[0];

        // Apply Forces: Gravity, Wind, Drag
        const gravity = 980 * weapon.gravityMultiplier;
        const windForce = this.windSpeed * 12;

        p.vx += windForce * dt;
        p.vy += gravity * dt;

        p.vx *= weapon.airResistance;
        p.vy *= weapon.airResistance;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        p.rotation += (p.vx > 0 ? 1 : -1) * 6 * dt;

        // Trail particle
        if (Math.random() < 0.6) {
          this.particles.push({
            x: p.x,
            y: p.y,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            size: Math.random() * 4 + 2,
            color: p.owner === 'cat' ? '#38bdf8' : '#fb923c',
            alpha: 0.8,
            life: 0.4
          });
        }

        // Collision: Central Fence (x: 440 to 520, y: 190 to 440)
        if (p.x >= 450 && p.x <= 510 && p.y >= 210 && p.y <= 440) {
          this._onFenceHit(p);
          return;
        }

        // Collision: Targets
        if (p.owner === 'cat' && p.x >= 790 && p.x <= 890 && p.y >= 280 && p.y <= 410) {
          this._onTargetHit('dog', p);
          return;
        } else if (p.owner === 'dog' && p.x >= 70 && p.x <= 170 && p.y >= 280 && p.y <= 410) {
          this._onTargetHit('cat', p);
          return;
        }

        // Collision: Ground (y: 430)
        if (p.y >= 430) {
          this._onGroundHit(p);
          return;
        }

        // Out of Bounds
        if (p.x < -100 || p.x > 1060) {
          this._clearProjectile();
          this._nextTurn();
        }
      }

      // Update Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const pt = this.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.alpha -= dt / pt.life;
        if (pt.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }

      // Decay Screen Shake
      if (this.screenShake > 0) {
        this.screenShake = Math.max(0, this.screenShake - dt * 25);
      }
    }

    _launchProjectile(owner, angleDeg, powerPct) {
      const rad = (angleDeg * Math.PI) / 180;
      const velocity = (powerPct / 100) * 880 + 260; // 260 to 1140 px/s

      const startX = owner === 'cat' ? 140 : 820;
      const startY = 320;
      const dir = owner === 'cat' ? 1 : -1;

      this.projectile = {
        owner,
        weaponId: this.selectedWeaponId,
        x: startX,
        y: startY,
        vx: Math.cos(rad) * velocity * dir,
        vy: -Math.sin(rad) * velocity,
        rotation: 0
      };

      if (root.BattleAudio) {
        root.BattleAudio.startArtilleryWhistle();
      }
    }

    _onFenceHit(p) {
      if (root.BattleAudio) {
        root.BattleAudio.stopArtilleryWhistle();
        root.BattleAudio.playWoodSplinter();
      }
      this.screenShake = 6;
      this._spawnBurst(p.x, p.y, '#b45309', 18);
      this._clearProjectile();

      this.showToast('🪵 Too low! Aim higher OVER the fence!');
      if (root.BattleAudio) {
        root.BattleAudio.speak('Too low! Aim higher OVER the fence!');
      }

      setTimeout(() => this._nextTurn(), 1400);
    }

    _onTargetHit(target, p) {
      if (root.BattleAudio) {
        root.BattleAudio.stopArtilleryWhistle();
        root.BattleAudio.playImpactCrunch();
      }
      this.screenShake = 12;
      this._spawnBurst(p.x, p.y, '#ef4444', 30);

      const weapon = root.BATTLE_DATA.WEAPONS.find(w => w.id === p.weaponId) || root.BATTLE_DATA.WEAPONS[0];
      if (target === 'dog') {
        this.dogHP = Math.max(0, this.dogHP - weapon.damage);
        const hpEl = document.getElementById('dog-hp-fill');
        if (hpEl) hpEl.style.width = `${this.dogHP}%`;
        if (root.BattleAudio) root.BattleAudio.playDogVocal();
      } else {
        this.catHP = Math.max(0, this.catHP - weapon.damage);
        const hpEl = document.getElementById('cat-hp-fill');
        if (hpEl) hpEl.style.width = `${this.catHP}%`;
        if (root.BattleAudio) root.BattleAudio.playCatVocal();
      }

      this._clearProjectile();
      this.showToast(`💥 Direct hit OVER the fence! (-${weapon.damage} HP)`);
      if (root.BattleAudio) {
        root.BattleAudio.speak('Direct hit OVER the fence!');
      }

      // Check Match Victory
      if (this.dogHP <= 0) {
        this._onVictory('Cat');
        return;
      } else if (this.catHP <= 0) {
        this._onVictory('Dog');
        return;
      }

      // Pop CEFR Challenge question before next turn
      setTimeout(() => {
        this._showQuestionModal(() => {
          this._nextTurn();
        });
      }, 1200);
    }

    _onGroundHit(p) {
      if (root.BattleAudio) {
        root.BattleAudio.stopArtilleryWhistle();
      }
      this._spawnBurst(p.x, 430, '#64748b', 10);
      this._clearProjectile();
      setTimeout(() => this._nextTurn(), 600);
    }

    _clearProjectile() {
      if (this.projectile && root.BattleAudio) {
        root.BattleAudio.stopArtilleryWhistle();
      }
      this.projectile = null;
    }

    _nextTurn() {
      this._generateWind();
      this.activeTurn = this.activeTurn === 'cat' ? 'dog' : 'cat';

      if (this.activeTurn === 'dog' && this.mode === '1p') {
        // AI Turn
        setTimeout(() => {
          this._executeAITurn();
        }, 1000);
      }
    }

    _executeAITurn() {
      // AI calculates trajectory
      const aiAngle = 40 + Math.random() * 25; // 40 to 65
      const aiPower = 55 + Math.random() * 30; // 55 to 85
      this._launchProjectile('dog', aiAngle, aiPower);
    }

    _onVictory(winnerName) {
      this.winner = winnerName;
      const pill3 = document.querySelector('.step-pill[data-stage="3"]');
      if (pill3) pill3.classList.add('completed');
      const pill4 = document.querySelector('.step-pill[data-stage="4"]');
      if (pill4) pill4.classList.add('completed');

      if (root.BattleAudio) {
        root.BattleAudio.playVictoryFanfare();
      }

      this.showToast(`🏆 Match Victory! ${winnerName} Wins! Proceeding to Studio...`);
      setTimeout(() => {
        this.goToStage(4);
      }, 2000);
    }

    _spawnBurst(x, y, color, count) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 180 + 40;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: Math.random() * 5 + 3,
          color,
          alpha: 1.0,
          life: 0.5
        });
      }
    }

    // ==========================================================================
    // 60 FPS CANVAS RENDERING
    // ==========================================================================
    _render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.save();

      // Screen Shake
      if (this.screenShake > 0) {
        const sx = (Math.random() - 0.5) * this.screenShake;
        const sy = (Math.random() - 0.5) * this.screenShake;
        ctx.translate(sx, sy);
      }

      // 1. Atmospheric Alley Backdrop
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#070b14');
      skyGrad.addColorStop(0.65, '#0f172a');
      skyGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Distant Alley Bricks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let y = 50; y < 400; y += 22) {
        const offset = (y % 44 === 0) ? 0 : 25;
        for (let x = -20 + offset; x < w; x += 55) {
          ctx.fillRect(x, y, 48, 16);
        }
      }

      // Streetlamp Conical Light Beam
      const lampGrad = ctx.createRadialGradient(120, 40, 10, 140, 240, 260);
      lampGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      lampGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.12)');
      lampGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = lampGrad;
      ctx.beginPath();
      ctx.moveTo(120, 40);
      ctx.lineTo(20, 440);
      ctx.lineTo(260, 440);
      ctx.closePath();
      ctx.fill();

      // 2. Cobblestone Ground & Grass
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 430, w, 50);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 426, w, 4);

      // Yard Grass on Right
      ctx.fillStyle = '#065f46';
      ctx.fillRect(490, 430, w - 490, 50);
      ctx.fillStyle = '#059669';
      ctx.fillRect(490, 426, w - 490, 4);

      // 3. Central Wooden Barrier Fence (Beveled Planks & Studs)
      if (this.bitmaps.fence) {
        ctx.drawImage(this.bitmaps.fence, 450, 200, 70, 230);
      }

      // 4. Cat Base: Metal Trash Can
      if (this.bitmaps.trashbin) {
        ctx.drawImage(this.bitmaps.trashbin, 90, 320, 85, 110);
      }

      // 5. Dog Base: Ceramic Bowl
      if (this.bitmaps.dogbowl) {
        ctx.drawImage(this.bitmaps.dogbowl, 770, 375, 75, 55);
      }

      // 6. Idle Bobbing & Dynamic Eye Tracking
      const bobCat = Math.sin(this.gameTime * 3) * 3;
      const bobDog = Math.cos(this.gameTime * 3) * 3;

      // Draw Shadow Ellipses
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(132, 330, 24, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(835, 430, 32, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw Blue Alley Cat (On top of trash can)
      if (this.bitmaps.cat) {
        ctx.drawImage(this.bitmaps.cat, 82, 230 + bobCat, 100, 100);
      }

      // Draw Brown Yard Dog (Behind fence / in yard)
      if (this.bitmaps.dog) {
        ctx.drawImage(this.bitmaps.dog, 785, 330 + bobDog, 100, 100);
      }

      // 7. Trajectory Guideline (15% Preview for Cat)
      if (!this.projectile && this.activeTurn === 'cat') {
        this._renderTrajectoryGuideline(ctx);
      }

      // 8. Render Flying Projectile (Vector Sprite Bitmaps)
      if (this.projectile) {
        const p = this.projectile;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const bmpKey = `projectile_${p.weaponId}`;
        const bmp = this.bitmaps[bmpKey] || this.bitmaps.projectile_fish;
        if (bmp) {
          ctx.drawImage(bmp, -22, -14, 44, 28);
        }
        ctx.restore();
      }

      // 9. Render Particles
      this.particles.forEach(pt => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();
    }

    _renderTrajectoryGuideline(ctx) {
      const rad = (this.currentAngle * Math.PI) / 180;
      const v = 500;
      let x = 140;
      let y = 320;
      let vx = Math.cos(rad) * v;
      let vy = -Math.sin(rad) * v;
      const g = 980;

      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let i = 0; i < 12; i++) {
        x += vx * 0.025;
        y += vy * 0.025;
        vy += g * 0.025;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // ==========================================================================
    // STAGE 4: LIVE TELEPROMPTER STUDIO (ORAL PRODUCTION)
    // ==========================================================================
    _initStage4Studio() {
      const broadcastBtn = document.getElementById('btn-broadcast-report');
      if (broadcastBtn) {
        broadcastBtn.addEventListener('click', () => {
          this._startBroadcast();
        });
      }

      const replayBtn = document.getElementById('btn-studio-replay');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          this.catHP = 100;
          this.dogHP = 100;
          this.winner = null;
          const hpCat = document.getElementById('cat-hp-fill');
          const hpDog = document.getElementById('dog-hp-fill');
          if (hpCat) hpCat.style.width = '100%';
          if (hpDog) hpDog.style.width = '100%';
          this.goToStage(1);
        });
      }
    }

    _setupTeleprompter() {
      const mascotImg = document.getElementById('podium-mascot-img');
      const winnerTitle = document.getElementById('winner-team-title');
      if (mascotImg && winnerTitle) {
        const isCat = (this.winner || 'Cat') === 'Cat';
        mascotImg.src = isCat ? root.BATTLE_DATA.SVG_ASSETS.cat : root.BATTLE_DATA.SVG_ASSETS.dog;
        winnerTitle.textContent = `${this.winner || 'Cat'} Champions!`;
      }

      // Populate Teleprompter Script with wrap spans for real-time karaoke highlight
      const scriptBox = document.getElementById('teleprompter-script-content');
      if (!scriptBox) return;

      scriptBox.innerHTML = '';
      root.BATTLE_DATA.TELEPROMPTER_SCRIPT.forEach((line, sIdx) => {
        const p = document.createElement('div');
        p.className = 'script-sentence';

        const words = line.text.split(' ');
        words.forEach((w, wIdx) => {
          const span = document.createElement('span');
          span.className = 'script-word';
          span.id = `tele-word-${sIdx}-${wIdx}`;
          span.textContent = w + ' ';
          if (line.prep && w.toUpperCase().includes(line.prep)) {
            span.classList.add('script-prep');
          }
          p.appendChild(span);
        });

        scriptBox.appendChild(p);
      });
    }

    _startBroadcast() {
      const fullText = root.BATTLE_DATA.TELEPROMPTER_SCRIPT.map(s => s.text).join(' ');
      const wordsSpans = Array.from(document.querySelectorAll('.script-word'));

      wordsSpans.forEach(s => s.classList.remove('active-reading'));

      let wordPointer = 0;
      if (root.BattleAudio) {
        root.BattleAudio.speak(
          fullText,
          () => {
            // Word boundary callback
            wordsSpans.forEach(s => s.classList.remove('active-reading'));
            if (wordsSpans[wordPointer]) {
              wordsSpans[wordPointer].classList.add('active-reading');
              wordPointer++;
            }
          },
          () => {
            // End of speech
            wordsSpans.forEach(s => s.classList.remove('active-reading'));
            this.showToast('🎙️ Live Broadcast Completed! Excellent Speaking!');
          }
        );
      }
    }

    // ==========================================================================
    // CEFR A1 QUESTION MODAL
    // ==========================================================================
    _showQuestionModal(onClose) {
      const modal = document.getElementById('question-modal');
      const promptEl = document.getElementById('question-prompt-text');
      const optionsGrid = document.getElementById('question-options-grid');
      if (!modal || !promptEl || !optionsGrid) {
        if (onClose) onClose();
        return;
      }

      const q = root.BATTLE_DATA.QUESTIONS[Math.floor(Math.random() * root.BATTLE_DATA.QUESTIONS.length)];
      promptEl.textContent = q.sentence;
      optionsGrid.innerHTML = '';

      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;

        btn.addEventListener('click', () => {
          if (opt === q.correct) {
            btn.classList.add('correct');
            if (root.BattleAudio) root.BattleAudio.playBellChime();
            this.showToast('✨ Correct Preposition! (+15 XP)');
            setTimeout(() => {
              modal.classList.remove('active');
              if (onClose) onClose();
            }, 800);
          } else {
            btn.classList.add('wrong');
            this.showToast(`Not quite! ${q.explanation}`);
            setTimeout(() => {
              modal.classList.remove('active');
              if (onClose) onClose();
            }, 1600);
          }
        });

        optionsGrid.appendChild(btn);
      });

      modal.classList.add('active');
    }

    showToast(message) {
      const toast = document.getElementById('comic-toast');
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('visible');
      setTimeout(() => {
        toast.classList.remove('visible');
      }, 2200);
    }
  }

  // Auto-launch when DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    root.CatVsDogApp = new CatVsDogEngine();
    root.CatVsDogApp.init();
  });

})(typeof window !== 'undefined' ? window : this);
