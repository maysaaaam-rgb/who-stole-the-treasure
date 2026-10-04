/**
 * ENGLISH ADVENTURE ACADEMY — MYSTERY BOX UNBOXING & TRADING ENGINE
 * js/mystery-box-modal.js
 * 
 * Provides:
 * 1. 3D Isometric Animated Chests (WOODEN, GILDED, CELESTIAL)
 * 2. 4-Step Cinematic Unboxing Sequence:
 *    - Step 1 (0-1.2s): Chest Rattle & Shake
 *    - Step 2 (1.2-1.8s): Volumetric Rarity Beam Radiance
 *    - Step 3 (1.8s): Lid Fly-Open + Polyphonic Web Audio Fanfare + Canvas 2D Confetti Burst
 *    - Step 4 (2.0s): Reward Item Float-Up with Spring Scale-In Bounce
 * 3. Reward Reveal Card with [ Equip to Monster ] and [ Send to Backpack ]
 * 4. Interactive Gifting & Trading Cabinet UI (Showcase Cabinet, Item Slots, Lock Toggle)
 */

(function(root) {
  'use strict';

  // =========================================================================
  // RARITY DESIGN SYSTEM & SOUND SYNTHESIS
  // =========================================================================
  const RARITY_CONFIG = {
    common: {
      label: 'Common',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.65)',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      tag: '🌿 COMMON'
    },
    rare: {
      label: 'Rare',
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.75)',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
      tag: '💎 RARE'
    },
    epic: {
      label: 'Epic',
      color: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.85)',
      gradient: 'linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)',
      tag: '🔮 EPIC'
    },
    legendary: {
      label: 'Legendary',
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.95)',
      gradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fef08a 100%)',
      tag: '👑 LEGENDARY'
    }
  };

  // Polyphonic Web Audio Synthesizer (Strictly conforming to AGENTS.md 1.3)
  function playUnboxingAudioSequence(rarityKey) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // 1. Rattle / Tick sound (wooden / metallic tension click)
      const rattleCount = 6;
      for (let i = 0; i < rattleCount; i++) {
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(140 + i * 25, now + i * 0.18);
        clickGain.gain.setValueAtTime(0.12, now + i * 0.18);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.08);
        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start(now + i * 0.18);
        clickOsc.stop(now + i * 0.18 + 0.1);
      }

      // 2. Rising Energy Whoosh at 1.2s
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, now + 1.2);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 1.8);
      filter.Q.value = 3.0;

      const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.7, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let j = 0; j < data.length; j++) {
        data[j] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now + 1.2);
      noiseGain.gain.linearRampToValueAtTime(0.18, now + 1.75);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.85);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now + 1.2);
      noise.stop(now + 1.9);

      // 3. Victory Fanfare at 1.8s (Ascending C-Major pentatonic dual-oscillator ADSR chord)
      // Base notes: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
      const chord = [
        { freq: 523.25, time: 1.80, dur: 0.6 },
        { freq: 659.25, time: 1.95, dur: 0.6 },
        { freq: 783.99, time: 2.10, dur: 0.7 },
        { freq: 1046.50, time: 2.25, dur: 1.2 }
      ];

      // Add high sparkle for Epic / Legendary
      if (rarityKey === 'legendary' || rarityKey === 'epic') {
        chord.push({ freq: 1318.51, time: 2.40, dur: 1.4 }); // E6
      }

      chord.forEach(note => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(note.freq, now + note.time);
        osc2.frequency.setValueAtTime(note.freq * 1.002, now + note.time); // Subtle chorus detune

        noteGain.gain.setValueAtTime(0.001, now + note.time);
        noteGain.gain.linearRampToValueAtTime(0.25, now + note.time + 0.05); // Attack
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur); // Decay

        osc1.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(ctx.destination);

        osc1.start(now + note.time);
        osc2.start(now + note.time);
        osc1.stop(now + note.time + note.dur + 0.1);
        osc2.stop(now + note.time + note.dur + 0.1);
      });
    } catch (e) {
      console.warn('[MysteryBox] Procedural audio synthesis error:', e);
    }
  }

  // =========================================================================
  // CANVAS 2D CONFETTI & STAR BURST ENGINE
  // =========================================================================
  function launchConfettiBurst(canvas, colorHex) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth || 400;
    const height = canvas.height = canvas.offsetHeight || 400;

    const particles = [];
    const colors = [colorHex, '#ffffff', '#fbbf24', '#38bdf8', '#a855f7', '#10b981'];

    for (let i = 0; i < 90; i++) {
      const angle = (Math.PI * 2 * Math.random());
      const speed = 4 + Math.random() * 9;
      particles.push({
        x: width / 2,
        y: height / 2 + 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 3 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        alpha: 1,
        shape: Math.random() > 0.4 ? 'star' : 'square'
      });
    }

    let animId = null;
    const startTime = performance.now();

    function render(time) {
      const elapsed = (time - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // Gravity
        p.vx *= 0.98; // Drag
        p.rotation += p.vRot;
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === 'star') {
            // Draw 4-point sparkle star
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.quadraticCurveTo(0, 0, p.size, 0);
            ctx.quadraticCurveTo(0, 0, 0, p.size);
            ctx.quadraticCurveTo(0, 0, -p.size, 0);
            ctx.quadraticCurveTo(0, 0, 0, -p.size);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          }
          ctx.restore();
        }
      });

      if (aliveCount > 0 && elapsed < 3.0) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }

    animId = requestAnimationFrame(render);
  }

  // =========================================================================
  // 3D ISOMETRIC CHEST SVG RENDERER
  // =========================================================================
  function render3DChestSVG(tier = 'WOODEN', isOpened = false) {
    const t = String(tier).toUpperCase();

    // Color definitions per tier: BRONZE (copper), WOODEN = Silver, GILDED = Gold, CELESTIAL = Diamond
    let bodyMain = '#64748b'; // Brushed silver
    let bodySide = '#334155';
    let trimMain = '#e2e8f0';
    let trimDark = '#94a3b8';
    let glowColor = '#cbd5e1';
    let lockGem = '#38bdf8';
    let runesMarkup = '';

    if (t === 'BRONZE') {
      bodyMain = '#9a5b2c'; // Warm copper
      bodySide = '#6b3a17';
      trimMain = '#fdba74';
      trimDark = '#9a3412';
      glowColor = '#f59e0b';
      lockGem = '#fdba74';
    } else if (t === 'GILDED') {
      bodyMain = '#b45309';
      bodySide = '#78350f';
      trimMain = '#fef08a';
      trimDark = '#ca8a04';
      glowColor = '#facc15';
      lockGem = '#ef4444'; // Embedded ruby
      runesMarkup = `
        <circle cx="75" cy="115" r="4" fill="${glowColor}" opacity="0.8" filter="blur(1px)"/>
        <circle cx="125" cy="115" r="4" fill="${glowColor}" opacity="0.8" filter="blur(1px)"/>
      `;
    } else if (t === 'CELESTIAL') {
      bodyMain = '#0e7490'; // Icy diamond crystal
      bodySide = '#164e63';
      trimMain = '#cffafe'; // Bright crystal trim
      trimDark = '#22d3ee';
      glowColor = '#67e8f9'; // Diamond glow
      lockGem = '#e0f2fe';
      runesMarkup = `
        <polygon points="68,118 74,110 80,118 74,130" fill="#e0f2fe" opacity="0.9"/>
        <polygon points="120,118 126,110 132,118 126,130" fill="#e0f2fe" opacity="0.9"/>
        <polygon points="94,126 100,116 106,126 100,140" fill="#ffffff" opacity="0.95"/>
      `;
    }

    return `
      <svg class="chest-svg-rig ${isOpened ? 'is-opened' : ''}" viewBox="0 0 200 200" width="100%" height="100%" style="overflow: visible;">
        <defs>
          <radialGradient id="chestGlow-${t}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="${glowColor}" stop-opacity="0"/>
          </radialGradient>
          <filter id="chestShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity="0.65"/>
          </filter>
        </defs>

        <!-- Pedestal reflection shadow -->
        <ellipse cx="100" cy="172" rx="68" ry="18" fill="rgba(0,0,0,0.55)" class="chest-pedestal-shadow" />

        <!-- Ambient Tier Aura -->
        <circle cx="100" cy="120" r="75" fill="url(#chestGlow-${t})" class="chest-ambient-glow" />

        <!-- 3D Chest Base (Lower Body) -->
        <g id="chest-base-group" filter="url(#chestShadow)">
          <!-- Main Chest Body -->
          <path d="M 40 95 L 160 95 L 152 155 L 48 155 Z" fill="${bodyMain}" stroke="${trimDark}" stroke-width="3" />
          <!-- Shadow side facet -->
          <path d="M 40 95 L 48 155 L 48 155 L 40 95 Z" fill="${bodySide}" />
          
          <!-- Reinforced Corner Brackets -->
          <path d="M 40 95 L 56 95 L 60 155 L 48 155 Z" fill="${trimDark}" />
          <path d="M 160 95 L 144 95 L 140 155 L 152 155 Z" fill="${trimDark}" />
          <line x1="40" y1="125" x2="160" y2="125" stroke="${trimDark}" stroke-width="4" />

          <!-- Rivets -->
          <circle cx="48" cy="105" r="2.5" fill="${trimMain}"/>
          <circle cx="48" cy="145" r="2.5" fill="${trimMain}"/>
          <circle cx="152" cy="105" r="2.5" fill="${trimMain}"/>
          <circle cx="152" cy="145" r="2.5" fill="${trimMain}"/>

          <!-- Decorative Runes -->
          ${runesMarkup}

          <!-- Golden Lock Escutcheon Plate -->
          <rect x="86" y="90" width="28" height="34" rx="4" fill="${trimDark}" stroke="${trimMain}" stroke-width="2" />
          <circle cx="100" cy="104" r="6" fill="${lockGem}" />
          <path d="M 98 107 L 98 116 L 102 116 L 102 107 Z" fill="#1e293b" />
        </g>

        <!-- 3D Chest Animated Lid (Upper Pivot) -->
        <g id="chest-lid-group" class="chest-lid-hinge" style="transform-origin: 100px 92px; transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          <!-- Lid Dome Arc -->
          <path d="M 36 94 Q 100 50 164 94 L 160 98 L 40 98 Z" fill="${bodyMain}" stroke="${trimDark}" stroke-width="3" />
          <!-- Lid Reinforcement Straps -->
          <path d="M 52 96 Q 100 55 148 96 L 140 96 Q 100 62 60 96 Z" fill="${trimDark}" />
          <!-- Lid Handle -->
          <rect x="88" y="58" width="24" height="7" rx="3" fill="${trimMain}" stroke="${trimDark}" stroke-width="1.5" />
          <!-- Front Lip Latch -->
          <rect x="88" y="90" width="24" height="12" rx="3" fill="${trimMain}" stroke="${trimDark}" stroke-width="1.5" />
        </g>
      </svg>
    `;
  }

  // =========================================================================
  // UNBOXING MODAL CONTROLLER (4-STEP CINEMATIC FLOW)
  // =========================================================================
  class MysteryBoxModalController {
    constructor() {
      this.activeBox = null;
      this.activeStudent = null;
      this.isUnboxingInProgress = false;
      this.openedPayload = null;
      this.onCompleteCallback = null;
    }

    /**
     * Launch unboxing for a specific box ID or instantiate a free test box
     */
    openUnboxing(boxId, studentId, options = {}) {
      const store = window.store || window.schoolStore;
      if (!store) {
        alert('School storage engine is loading. Please try again.');
        return;
      }

      this.activeStudent = studentId ? store.getStudent(studentId) : store.getActiveStudent() || (store.getStudents() && store.getStudents()[0]);
      if (!this.activeStudent) {
        alert('Please select an active student first.');
        return;
      }

      let box = boxId ? (store.getMysteryBoxes(this.activeStudent.id, true) || []).find(b => b.id === boxId) : null;
      if (!box) {
        // If teacher is previewing or no box passed, create a fresh box
        const defaultTier = options.tier || 'WOODEN';
        box = store.grantMysteryBox(this.activeStudent.id, defaultTier);
      }

      this.activeBox = box;
      this.openedPayload = null;
      this.isUnboxingInProgress = false;
      this.onCompleteCallback = options.onComplete || null;

      this._renderModal();
    }

    _renderModal() {
      let modalEl = document.getElementById('modal-mystery-box-unboxing');
      if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.id = 'modal-mystery-box-unboxing';
        modalEl.className = 'mystery-box-modal-overlay';
        document.body.appendChild(modalEl);
      }

      const box = this.activeBox;
      const student = this.activeStudent;
      const tier = (box.boxTier || 'WOODEN').toUpperCase();

      const tInfo = (window.boxTierInfo ? window.boxTierInfo(tier) : { icon: '🥈', name: 'Silver Box', pill: 'tier-wooden' });
      let tierBadge = '<span class="box-tier-pill ' + tInfo.pill + '">' + tInfo.icon + ' ' + tInfo.name.toUpperCase() + '</span>';

      modalEl.innerHTML = `
        <div class="mystery-box-modal-content">
          <!-- Close button -->
          <button type="button" class="mystery-box-close-btn" onclick="window.MysteryBoxModal.close()" aria-label="Close unboxing">✕</button>

          <!-- Stage Viewport -->
          <div class="unboxing-stage" id="unboxing-stage">
            <!-- Volumetric Light Beams (Radiates in Step 2) -->
            <div class="rarity-light-beams" id="rarity-light-beams"></div>

            <!-- Canvas 2D Particle Burst -->
            <canvas id="unboxing-confetti-canvas" class="unboxing-confetti-canvas"></canvas>

            <!-- 3D Centered Chest Stage -->
            <div class="chest-rig-container" id="chest-rig-container" onclick="window.MysteryBoxModal.triggerOpenSequence()">
              ${render3DChestSVG(tier, false)}
            </div>

            <!-- Floating Reward Drop Reveal (Step 4) -->
            <div class="reward-drop-reveal" id="reward-drop-reveal" style="display: none;">
              <!-- Dynamic reward card populated upon step 4 -->
            </div>
          </div>

          <!-- Bottom Action Deck -->
          <div class="unboxing-action-deck" id="unboxing-action-deck">
            <div style="margin-bottom: 8px;">
              ${tierBadge}
            </div>
            <h2 class="unboxing-title" id="unboxing-title">Ready to Unlock?</h2>
            <p class="unboxing-subtitle" id="unboxing-subtitle">Tap the chest to break the seal and discover rare monster cosmetics!</p>
            
            <button type="button" id="btn-unboxing-action" class="btn-3d btn-3d-primary btn-unboxing-pulse" onclick="window.MysteryBoxModal.triggerOpenSequence()">
              ✨ Tap to Unlock Chest ✨
            </button>
          </div>
        </div>
      `;

      modalEl.style.display = 'flex';
      setTimeout(() => modalEl.classList.add('is-active'), 10);
    }

    triggerOpenSequence() {
      if (this.isUnboxingInProgress || this.openedPayload) return;
      this.isUnboxingInProgress = true;

      const store = window.store || window.schoolStore;
      const res = store.openMysteryBox(this.activeBox.id, this.activeStudent.id);
      if (!res.success) {
        alert(res.error || 'Failed to open mystery box.');
        this.isUnboxingInProgress = false;
        return;
      }
      this.openedPayload = res;

      const stage = document.getElementById('unboxing-stage');
      const chestRig = document.getElementById('chest-rig-container');
      const beams = document.getElementById('rarity-light-beams');
      const confettiCanvas = document.getElementById('unboxing-confetti-canvas');
      const rewardDrop = document.getElementById('reward-drop-reveal');
      const titleEl = document.getElementById('unboxing-title');
      const subEl = document.getElementById('unboxing-subtitle');
      const actionBtn = document.getElementById('btn-unboxing-action');

      if (actionBtn) {
        actionBtn.style.display = 'none';
      }

      const item = res.item;
      const rarity = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common;

      // STEP 1 (0 - 1.2s): Chest Rattle & Shake
      if (titleEl) titleEl.textContent = 'Breaking seal...';
      if (subEl) subEl.textContent = 'The magical lock is vibrating with ancient energy!';
      if (chestRig) chestRig.classList.add('chest-rattling');

      // Trigger Web Audio synthesis sequence
      playUnboxingAudioSequence(item.rarity);

      // STEP 2 (1.2s - 1.8s): Volumetric Rarity Light Beams
      setTimeout(() => {
        if (chestRig) chestRig.classList.remove('chest-rattling');
        if (beams) {
          beams.style.setProperty('--beam-color', rarity.color);
          beams.classList.add('beam-glowing');
        }
        if (titleEl) titleEl.textContent = 'Energy surge detected!';
      }, 1200);

      // STEP 3 (1.8s): Lid Fly-Open + Confetti Burst
      setTimeout(() => {
        const lidGroup = document.getElementById('chest-lid-group');
        if (lidGroup) {
          lidGroup.style.transform = 'perspective(600px) rotateX(-115deg) translateY(-14px)';
        }
        if (confettiCanvas) {
          launchConfettiBurst(confettiCanvas, rarity.color);
        }
        if (titleEl) titleEl.textContent = 'CHEST OPENED!';
      }, 1800);

      // STEP 4 (2.0s): Item Floats Up with Scale-In Spring Bounce
      setTimeout(() => {
        if (rewardDrop) {
          rewardDrop.innerHTML = `
            <div class="reward-card-unboxed" style="border: 2px solid ${rarity.color}; box-shadow: 0 0 28px ${rarity.glow};">
              <div class="reward-rarity-pill" style="background: ${rarity.gradient}; color: #ffffff;">
                ${rarity.tag}
              </div>
              <div class="reward-media-viewport">
                <div class="reward-icon-display">${item.icon || '✨'}</div>
                <div class="reward-pedestal-disc" style="background: radial-gradient(circle, ${rarity.glow} 0%, transparent 70%);"></div>
              </div>
              <div class="reward-caption-tray">
                <div class="reward-category-label">${String(item.category || 'Cosmetic').toUpperCase()}</div>
                <h3 class="reward-item-name">${item.name}</h3>
                <p class="reward-item-desc">${item.description || 'Exclusive custom monster equipment.'}</p>
                
                ${res.isDuplicate ? `
                  <div class="reward-duplicate-badge">
                    ${res.bonusCoins ? '🪙 You already had it! Converted to <strong>+' + res.bonusCoins + ' coins</strong>' : '⭐ Duplicate! Converted to <strong>+50 Star XP</strong>'}
                  </div>
                ` : ''}

                <div class="reward-modal-actions">
                  ${(res.reward && res.reward.type && res.reward.type !== 'item') ? (
                    res.reward.type === 'extra' ? `
                  <button type="button" class="btn-3d btn-3d-primary" onclick="window.MysteryBoxModal.equipExtra('${res.reward.kind}','${item.id}')">
                    ✨ Wear it now
                  </button>
                  <button type="button" class="btn-3d btn-3d-secondary" onclick="window.MysteryBoxModal.sendToBackpack()">
                    👍 Keep it for later
                  </button>` : `
                  <button type="button" class="btn-3d btn-3d-primary" onclick="window.MysteryBoxModal.close()">
                    🎉 Great!
                  </button>`
                  ) : `
                  <button type="button" class="btn-3d btn-3d-primary" onclick="window.MysteryBoxModal.equipDrop('${item.id}')">
                    ⚡ Equip to Monster
                  </button>
                  <button type="button" class="btn-3d btn-3d-secondary" onclick="window.MysteryBoxModal.sendToBackpack()">
                    🎒 Send to Backpack
                  </button>`}
                </div>
              </div>
            </div>
          `;
          rewardDrop.style.display = 'block';
          rewardDrop.classList.add('reward-bounce-in');
        }

        if (titleEl) titleEl.style.display = 'none';
        if (subEl) subEl.style.display = 'none';
        this.isUnboxingInProgress = false;

        // Trigger store notification and soundboard if present
        if (window.classSoundboard && window.classSoundboard.playCoinReward) {
          window.classSoundboard.playCoinReward();
        }
      }, 2000);
    }

    equipDrop(itemId) {
      const store = window.store || window.schoolStore;
      if (store && this.activeStudent) {
        store.equipInventoryItem(this.activeStudent.id, itemId);
        if (window.showNotification) {
          window.showNotification('🎉 Item equipped to ' + this.activeStudent.firstName + '\'s monster companion!', 'success');
        }
      }
      this.close();
    }

    equipExtra(kind, id) {
      try {
        if (window.ClassroomStore && window.ClassroomStore.cosmetics && this.activeStudent) {
          const r = window.ClassroomStore.cosmetics.equip(this.activeStudent.id, kind, id);
          if (r && r.success && kind === 'sound' && window.ClassroomCosmetics) window.ClassroomCosmetics.playSound(id);
          if (window.showNotification) window.showNotification('✨ Now wearing it!', 'success');
        }
      } catch (e) { /* ignore */ }
      this.close();
    }

    sendToBackpack() {
      if (window.showNotification) {
        window.showNotification('🎒 Item safely stored in your Student Backpack!', 'success');
      }
      this.close();
    }

    close() {
      const modalEl = document.getElementById('modal-mystery-box-unboxing');
      if (modalEl) {
        modalEl.classList.remove('is-active');
        setTimeout(() => {
          modalEl.style.display = 'none';
          if (this.onCompleteCallback) {
            try { this.onCompleteCallback(); } catch (e) {}
          }
        }, 250);
      }
    }
  }

  // =========================================================================
  // INTERACTIVE GIFTING & TRADING CABINET CONTROLLER
  // =========================================================================
  class TradingCabinetController {
    constructor() {
      this.selectedStudentId = null;
      this.partnerStudentId = null;
      this.selectedMyItemId = null;
      this.selectedPartnerItemId = null;
      this.peerNote = '';
      this.isConfirmedLocked = false;
    }

    openCabinet(studentId = null) {
      const store = window.store || window.schoolStore;
      if (!store) return;

      const students = store.getStudents() || [];
      if (students.length === 0) {
        alert('No students found in active roster.');
        return;
      }

      this.selectedStudentId = studentId || (store.getActiveStudent() && store.getActiveStudent().id) || students[0].id;
      this.partnerStudentId = students.find(s => s.id !== this.selectedStudentId) ? students.find(s => s.id !== this.selectedStudentId).id : students[0].id;
      this.selectedMyItemId = null;
      this.selectedPartnerItemId = null;
      this.peerNote = '';
      this.isConfirmedLocked = false;

      this._renderCabinetModal();
    }

    _renderCabinetModal() {
      let modalEl = document.getElementById('modal-trading-cabinet');
      if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.id = 'modal-trading-cabinet';
        modalEl.className = 'trading-cabinet-overlay';
        document.body.appendChild(modalEl);
      }

      const store = window.store || window.schoolStore;
      const allStudents = store.getStudents() || [];
      const currentStudent = store.getStudent(this.selectedStudentId) || allStudents[0];
      const partnerStudent = store.getStudent(this.partnerStudentId);

      const myBoxes = store.getMysteryBoxes ? store.getMysteryBoxes(currentStudent.id, false) : [];
      const myInventory = store.getStudentInventory ? store.getStudentInventory(currentStudent.id) : [];
      const partnerInventory = partnerStudent && store.getStudentInventory ? store.getStudentInventory(partnerStudent.id) : [];
      const activeTrades = store.getTrades ? store.getTrades(currentStudent.id) : [];

      modalEl.innerHTML = `
        <div class="trading-cabinet-window">
          <!-- Cabinet Header -->
          <div class="cabinet-header">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:1.6rem;">🪵</span>
              <div>
                <h2 style="font-size:1.35rem; font-weight:900; margin:0; color:#ffffff;">Royal Trading Cabinet &amp; Vault</h2>
                <p style="font-size:0.82rem; color:#94a3b8; margin:2px 0 0 0;">Gift cosmetics to classmates or propose bilateral treasure swaps.</p>
              </div>
            </div>
            <button type="button" class="btn-sm-secondary" onclick="window.TradingCabinet.close()" style="font-weight:700;">✕ Close</button>
          </div>

          <!-- Two-Pane Showcase Cabinet -->
          <div class="cabinet-panes-grid">
            <!-- LEFT PANE: My Available Mystery Boxes & Backpack Inventory -->
            <div class="cabinet-pane cabinet-left-pane">
              <div class="pane-header">
                <h3 style="font-size:1rem; font-weight:800; margin:0; color:#38bdf8;">🎒 ${currentStudent.firstName}'s Treasure Chests &amp; Backpack</h3>
                <span style="font-size:0.75rem; color:#94a3b8;">${myBoxes.length} Boxes · ${myInventory.length} Items</span>
              </div>

              <!-- Unopened Mystery Boxes -->
              <div style="margin-bottom:18px;">
                <div style="font-size:0.75rem; font-weight:800; color:#cbd5e1; text-transform:uppercase; margin-bottom:8px; letter-spacing:0.04em;">🎁 Unopened Mystery Boxes (${myBoxes.length})</div>
                <div style="display:flex; flex-direction:column; gap:8px; max-height:160px; overflow-y:auto;">
                  ${myBoxes.length === 0 ? `
                    <div style="padding:14px; text-align:center; font-size:0.8rem; color:#64748b; background:rgba(0,0,0,0.25); border-radius:10px;">
                      No unopened boxes. Earn boxes via Level XP or ask your teacher!
                    </div>
                  ` : myBoxes.map(b => `
                    <div class="cabinet-box-row">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:1.4rem;">${window.boxTierInfo ? window.boxTierInfo(b.boxTier).icon : '🎁'}</span>
                        <div>
                          <div style="font-weight:800; font-size:0.84rem; color:#ffffff;">${b.boxTier} CHEST</div>
                          <div style="font-size:0.7rem; color:#94a3b8;">Ready to unlock</div>
                        </div>
                      </div>
                      <button type="button" class="btn-3d btn-3d-primary" onclick="window.TradingCabinet.openBoxNow('${b.id}')" style="font-size:0.75rem; padding:5px 12px;">
                        🎁 Open
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Backpack Inventory Items -->
              <div>
                <div style="font-size:0.75rem; font-weight:800; color:#cbd5e1; text-transform:uppercase; margin-bottom:8px; letter-spacing:0.04em;">🎨 Owned Collectibles (${myInventory.length})</div>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(110px, 1fr)); gap:10px; max-height:240px; overflow-y:auto; padding:2px;">
                  ${myInventory.length === 0 ? `
                    <div style="grid-column:1/-1; padding:20px; text-align:center; font-size:0.8rem; color:#64748b; background:rgba(0,0,0,0.25); border-radius:10px;">
                      Backpack is empty. Open a Mystery Box to obtain cosmetics!
                    </div>
                  ` : myInventory.map(item => {
                    const rarity = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common;
                    const isSelected = this.selectedMyItemId === item.itemId;
                    return `
                      <div class="cabinet-item-card ${isSelected ? 'is-selected' : ''}" onclick="window.TradingCabinet.selectMyItem('${item.itemId}')" style="border-color:${isSelected ? '#38bdf8' : rarity.color};">
                        <div style="font-size:1.8rem; margin-bottom:4px;">${item.icon || '✨'}</div>
                        <div style="font-size:0.78rem; font-weight:800; color:#ffffff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%;">${item.name}</div>
                        <div style="font-size:0.65rem; color:${rarity.color}; font-weight:700; text-transform:uppercase;">${rarity.label}</div>
                        ${item.quantity > 1 ? `<span class="cabinet-item-qty">x${item.quantity}</span>` : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            <!-- RIGHT PANE: Bilateral Trading & Gifting Exchange -->
            <div class="cabinet-pane cabinet-right-pane">
              <div class="pane-header">
                <h3 style="font-size:1rem; font-weight:800; margin:0; color:#f59e0b;">🤝 Trading Exchange Table</h3>
                <span style="font-size:0.75rem; color:#94a3b8;">Peer Exchange</span>
              </div>

              <!-- Classmate Partner Selector -->
              <div style="margin-bottom:14px;">
                <label style="display:block; font-size:0.78rem; font-weight:700; color:#cbd5e1; margin-bottom:4px;">Select Trading Partner:</label>
                <select id="cabinet-partner-select" class="form-input" onchange="window.TradingCabinet.changePartner(this.value)" style="width:100%; font-size:0.84rem; background:#0f172a; color:#ffffff; border:1px solid #334155; border-radius:8px; padding:6px 10px;">
                  ${allStudents.filter(s => s.id !== currentStudent.id).map(s => `
                    <option value="${s.id}" ${s.id === this.partnerStudentId ? 'selected' : ''}>
                      🧒 ${s.firstName} ${s.lastName} (${s.grade || 'Grade 4B'})
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Two Exchange Slots -->
              <div class="trade-slots-row">
                <!-- Slot 1: You Offer -->
                <div class="trade-slot-card">
                  <div class="trade-slot-title">You Give (From Backpack)</div>
                  <div class="trade-slot-box" id="trade-slot-give">
                    ${this.selectedMyItemId ? this._renderSlotItem(myInventory.find(i => i.itemId === this.selectedMyItemId)) : '<span style="color:#64748b; font-size:0.8rem;">Tap an item on the left to offer</span>'}
                  </div>
                </div>

                <!-- Arrow divider -->
                <div style="font-size:1.6rem; color:#f59e0b;">⇄</div>

                <!-- Slot 2: You Request / Free Gift -->
                <div class="trade-slot-card">
                  <div class="trade-slot-title">${partnerStudent ? partnerStudent.firstName + '\'s Item' : 'Requested Item'}</div>
                  <div class="trade-slot-box" id="trade-slot-receive">
                    ${this.selectedPartnerItemId ? 
                      this._renderSlotItem(partnerInventory.find(i => i.itemId === this.selectedPartnerItemId)) : 
                      `<select onchange="window.TradingCabinet.selectPartnerItem(this.value)" style="width:100%; font-size:0.76rem; background:#0f172a; color:#ffffff; border:1px solid #334155; border-radius:6px; padding:4px;">
                        <option value="">🎁 Free Gift (Nothing Requested)</option>
                        ${partnerInventory.map(it => `<option value="${it.itemId}">${it.icon || '✨'} ${it.name} (${it.rarity})</option>`).join('')}
                      </select>`
                    }
                  </div>
                </div>
              </div>

              <!-- Peer Note -->
              <div style="margin-bottom:14px;">
                <label style="display:block; font-size:0.75rem; font-weight:700; color:#cbd5e1; margin-bottom:4px;">Encouraging Peer Note:</label>
                <input type="text" id="cabinet-trade-note" class="form-input" placeholder="e.g. Good luck on the reading quest! Hope you enjoy this hat!" value="${this.peerNote}" oninput="window.TradingCabinet.peerNote = this.value" style="width:100%; font-size:0.82rem; background:#0f172a; color:#ffffff; border:1px solid #334155; border-radius:8px; padding:6px 10px;" />
              </div>

              <!-- Double-Confirmation Lock Toggle -->
              <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:10px; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between;">
                <div>
                  <div style="font-size:0.82rem; font-weight:800; color:#ffffff;">🔒 Double-Confirmation Lock</div>
                  <div style="font-size:0.72rem; color:#94a3b8;">Both students verify exchange terms before finalizing</div>
                </div>
                <label class="switch-toggle">
                  <input type="checkbox" id="cabinet-lock-toggle" ${this.isConfirmedLocked ? 'checked' : ''} onchange="window.TradingCabinet.toggleLock(this.checked)" />
                  <span class="slider round"></span>
                </label>
              </div>

              <!-- Submit Action Button -->
              <button type="button" class="btn-3d btn-3d-primary" onclick="window.TradingCabinet.submitTrade()" style="width:100%; font-size:0.92rem; padding:10px; justify-content:center;">
                ✨ Save and Accept Trade ✨
              </button>

              <!-- Recent Trade History -->
              ${activeTrades.length > 0 ? `
                <div style="margin-top:16px; border-top:1px solid rgba(255,255,255,0.08); padding-top:12px;">
                  <div style="font-size:0.75rem; font-weight:800; color:#cbd5e1; margin-bottom:6px;">Recent Trade Proposals (${activeTrades.length})</div>
                  <div style="display:flex; flex-direction:column; gap:6px; max-height:100px; overflow-y:auto;">
                    ${activeTrades.slice(0, 3).map(tr => `
                      <div style="font-size:0.75rem; background:rgba(0,0,0,0.3); border-radius:6px; padding:6px 10px; display:flex; justify-content:space-between; align-items:center;">
                        <span>Status: <strong style="color:${tr.status === 'accepted' ? '#10b981' : '#f59e0b'}; text-transform:uppercase;">${tr.status}</strong> (${tr.message || 'Friendly gift'})</span>
                        ${tr.status === 'pending' && tr.receiverId === currentStudent.id ? `
                          <button type="button" class="btn-sm-secondary" onclick="window.TradingCabinet.acceptTrade('${tr.id}')" style="font-size:0.7rem; padding:2px 6px;">Accept ✓</button>
                        ` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      modalEl.style.display = 'flex';
      setTimeout(() => modalEl.classList.add('is-active'), 10);
    }

    _renderSlotItem(item) {
      if (!item) return '<span style="color:#64748b; font-size:0.8rem;">Item not found</span>';
      const rarity = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.common;
      return `
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.5rem;">${item.icon || '✨'}</span>
          <div style="text-align:left;">
            <div style="font-weight:800; font-size:0.82rem; color:#ffffff;">${item.name}</div>
            <div style="font-size:0.68rem; color:${rarity.color}; font-weight:700;">${rarity.label}</div>
          </div>
        </div>
      `;
    }

    changePartner(partnerId) {
      this.partnerStudentId = partnerId;
      this.selectedPartnerItemId = null;
      this._renderCabinetModal();
    }

    selectMyItem(itemId) {
      this.selectedMyItemId = itemId;
      this._renderCabinetModal();
    }

    selectPartnerItem(itemId) {
      this.selectedPartnerItemId = itemId || null;
      this._renderCabinetModal();
    }

    toggleLock(checked) {
      this.isConfirmedLocked = Boolean(checked);
    }

    openBoxNow(boxId) {
      this.close();
      if (window.MysteryBoxModal) {
        window.MysteryBoxModal.openUnboxing(boxId, this.selectedStudentId, {
          onComplete: () => {
            this.openCabinet(this.selectedStudentId);
          }
        });
      }
    }

    submitTrade() {
      if (!this.selectedMyItemId) {
        alert('Please choose an item from your backpack to trade or gift.');
        return;
      }
      if (!this.isConfirmedLocked) {
        alert('Please toggle the "Double-Confirmation Lock" switch to confirm this trade.');
        return;
      }

      const store = window.store || window.schoolStore;
      const trade = store.createTrade({
        senderId: this.selectedStudentId,
        receiverId: this.partnerStudentId,
        senderItemId: this.selectedMyItemId,
        receiverItemId: this.selectedPartnerItemId,
        message: this.peerNote
      });

      // Auto-accept if friendly gift or both verified
      store.acceptTrade(trade.id);

      if (window.showNotification) {
        window.showNotification('🎉 Trade accepted and completed! Items have been transferred.', 'success');
      }

      this.selectedMyItemId = null;
      this.selectedPartnerItemId = null;
      this.isConfirmedLocked = false;
      this._renderCabinetModal();
    }

    acceptTrade(tradeId) {
      const store = window.store || window.schoolStore;
      store.acceptTrade(tradeId);
      if (window.showNotification) {
        window.showNotification('✓ Trade accepted and completed!', 'success');
      }
      this._renderCabinetModal();
    }

    close() {
      const modalEl = document.getElementById('modal-trading-cabinet');
      if (modalEl) {
        modalEl.classList.remove('is-active');
        setTimeout(() => {
          modalEl.style.display = 'none';
        }, 200);
      }
    }
  }

  // =========================================================================
  // EXPORT SINGLETONS & GLOBAL BINDINGS
  // =========================================================================
  const mysteryBoxModal = new MysteryBoxModalController();
  const tradingCabinet = new TradingCabinetController();

  root.MysteryBoxModal = mysteryBoxModal;
  root.TradingCabinet = tradingCabinet;

  if (typeof window !== 'undefined') {
    window.MysteryBoxModal = mysteryBoxModal;
    window.TradingCabinet = tradingCabinet;
    window.openMysteryBoxModal = function(boxId, studentId, opts) {
      mysteryBoxModal.openUnboxing(boxId, studentId, opts);
    };
    window.openTradingCabinet = function(studentId) {
      tradingCabinet.openCabinet(studentId);
    };
  }

})(typeof window !== 'undefined' ? window : global);
