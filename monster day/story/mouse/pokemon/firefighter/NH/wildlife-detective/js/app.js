/**
 * WILDLIFE DETECTIVE: APP ENGINE & REACTIVE ARENA
 * English Adventure Academy | Grade 4 ESL / CEFR A1+ CLIL
 * Theme: "Keep It Wild! Buy the Toy Lamp!"
 */

(function(root) {
  'use strict';

  class WildlifeDetectiveApp {
    constructor() {
      this.stage = 1; // 1: Scanner, 2: Showdown, 3: Studio
      this.xp = 0;
      this.unlockedCards = new Set();
      this.scenarioIndex = 0;
      this.unlockedAdaptations = new Set();
      this.isBroadcasting = false;
      this.confettiActive = false;
      this.confettiParticles = [];
    }

    init() {
      this.sound = root.soundEngine || (root.SoundEngine ? new root.SoundEngine() : null);
      this.data = root.GAME_DATA || {};

      this._setupAudioUnlock();
      this._setupConfetti();
      this.renderStage();
    }

    _setupAudioUnlock() {
      const unlock = () => {
        if (this.sound) this.sound.init();
      };
      window.addEventListener('click', unlock, { once: true });
      window.addEventListener('touchstart', unlock, { once: true });
    }

    addXP(amount, message) {
      this.xp += amount;
      const xpEl = document.getElementById('xp-val');
      if (xpEl) xpEl.textContent = this.xp;
      if (message) this.showToast(message);
    }

    updateMeter(stageNum, labelText, percent) {
      const lbl = document.getElementById('phase-label');
      const pct = document.getElementById('progress-percent');
      const fill = document.getElementById('meter-fill');

      if (lbl) lbl.textContent = labelText;
      if (pct) pct.textContent = `${percent}%`;
      if (fill) fill.style.width = `${percent}%`;
    }

    renderStage() {
      const stageEl = document.getElementById('stage');
      if (!stageEl) return;

      if (this.stage === 1) {
        this.renderStage1(stageEl);
      } else if (this.stage === 2) {
        this.renderStage2(stageEl);
      } else if (this.stage === 3) {
        this.renderStage3(stageEl);
      }
    }

    // ==========================================================================
    // STAGE 1: HABITAT FLIP CARDS
    // ==========================================================================
    renderStage1(container) {
      this.updateMeter(1, 'Stage 1: Habitat Scanner', 33);
      const cards = this.data.phase1Cards || [];

      container.innerHTML = `
        <div class="stage-prompt">
          <h2>Stage 1: Wild Animal Habitats</h2>
          <p>Tap each card to flip and discover what each wild animal needs in nature!</p>
          <div class="pill-target">Grammar: The [animal] needs [requirement].</div>
        </div>

        <div class="card-deck" id="card-deck">
          ${cards.map((c, i) => `
            <div class="flip-card ${this.unlockedCards.has(c.id) ? 'flipped' : ''}" data-id="${c.id}" id="flip-${c.id}">
              <div class="card-face card-front">
                <div style="width: 100px; height: 90px; display:flex; align-items:center; justify-content:center;">
                  ${c.svg}
                </div>
                <div style="font-weight: 800; font-size: 1.15rem; color: #fff;">${c.name}</div>
                <div style="font-size: 0.8rem; color: #34d399; font-weight:700;">🔄 TAP TO EXAMINE</div>
              </div>
              <div class="card-face card-back">
                <div style="font-weight: 800; font-size: 1.1rem; color: #38bdf8;">${c.name}</div>
                <p style="font-size: 0.9rem; color: #cbd5e1; font-weight:600; line-height:1.4;">${c.requirement}</p>
                <div class="card-badge-unlocked">✅ VERIFIED WILD</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div id="stage1-action-row" style="margin-top: 24px; min-height: 64px;">
          ${this.unlockedCards.size >= cards.length ? `
            <button class="btn-3d btn-green" id="btn-to-stage2">Enter Stage 2: Viral Showdown ➔</button>
          ` : ''}
        </div>
      `;

      cards.forEach(c => {
        const el = document.getElementById(`flip-${c.id}`);
        if (!el) return;
        el.addEventListener('click', () => {
          if (this.sound) this.sound.playSnap();
          el.classList.toggle('flipped');

          if (!this.unlockedCards.has(c.id)) {
            this.unlockedCards.add(c.id);
            this.addXP(20, `Examined ${c.name}! (+20 XP)`);
            if (this.sound) {
              this.sound.playXP();
              this.sound.speak(c.ttsPrompt);
            }

            if (this.unlockedCards.size >= cards.length) {
              const actRow = document.getElementById('stage1-action-row');
              if (actRow) {
                actRow.innerHTML = `<button class="btn-3d btn-green" id="btn-to-stage2">Enter Stage 2: Viral Showdown ➔</button>`;
                document.getElementById('btn-to-stage2').addEventListener('click', () => {
                  this.stage = 2;
                  if (this.sound) this.sound.playFanfare();
                  this.renderStage();
                });
              }
            }
          }
        });
      });

      const nextBtn = document.getElementById('btn-to-stage2');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.stage = 2;
          if (this.sound) this.sound.playFanfare();
          this.renderStage();
        });
      }
    }

    // ==========================================================================
    // STAGE 2: VIRAL SHOWDOWN (TRADING CARDS & RUBBER STAMPS)
    // ==========================================================================
    renderStage2(container) {
      this.updateMeter(2, 'Stage 2: Viral Trend Showdown', 66);
      const scenarios = this.data.phase2Scenarios || [];
      const current = scenarios[this.scenarioIndex];

      if (!current) {
        this.stage = 3;
        this.renderStage();
        return;
      }

      container.innerHTML = `
        <div class="stage-prompt">
          <h2>Stage 2: Viral Trend Showdown</h2>
          <p>Evaluate internet trends: Harmful wild captivity, or safe eco-friendly toy?</p>
          <div class="pill-target">Rule: Keep wild animals in nature!</div>
        </div>

        <div class="arena-showdown">
          <div class="trading-card" id="active-trading-card">
            <div class="trading-card-img">
              <div style="width: 140px; height: 120px;">
                ${current.svg}
              </div>
              <div class="rubber-stamp" id="rubber-stamp"></div>
            </div>
            <div class="trading-card-caption">
              <h4>${current.title}</h4>
              <p>${current.description}</p>
            </div>
          </div>

          <div class="showdown-actions" id="showdown-actions">
            <button class="btn-3d btn-coral" id="btn-choice-harm">🚨 HARMFUL CAPTIVITY</button>
            <button class="btn-3d btn-green" id="btn-choice-safe">✅ SAFE ECO TOY</button>
          </div>
        </div>
      `;

      if (this.sound) {
        this.sound.speak(current.title + '. ' + current.description);
      }

      const harmBtn = document.getElementById('btn-choice-harm');
      const safeBtn = document.getElementById('btn-choice-safe');

      if (harmBtn) harmBtn.addEventListener('click', () => this._handleShowdownChoice(true, current));
      if (safeBtn) safeBtn.addEventListener('click', () => this._handleShowdownChoice(false, current));
    }

    _handleShowdownChoice(choseHarmful, scenario) {
      const card = document.getElementById('active-trading-card');
      const stamp = document.getElementById('rubber-stamp');
      const actions = document.getElementById('showdown-actions');
      const isCorrect = (choseHarmful === scenario.isWildHarm);

      if (isCorrect) {
        if (this.sound) this.sound.playXP();
        this.addXP(30, '🎯 Perfect Ranger Judgment! (+30 XP)');

        if (stamp) {
          stamp.textContent = scenario.isWildHarm ? 'KEEP IT WILD!' : 'ECO APPROVED!';
          stamp.className = `rubber-stamp ${scenario.isWildHarm ? 'stamp-dont' : 'stamp-do'}`;
        }

        if (actions) actions.style.pointerEvents = 'none';

        if (this.sound) {
          this.sound.speak(scenario.ruleSpeech);
        }

        setTimeout(() => {
          this.scenarioIndex++;
          const scenarios = this.data.phase2Scenarios || [];
          if (this.scenarioIndex < scenarios.length) {
            this.renderStage2(document.getElementById('stage'));
          } else {
            this.stage = 3;
            if (this.sound) this.sound.playFanfare();
            this.renderStage();
          }
        }, 2200);

      } else {
        if (this.sound) this.sound.playSoftFail();
        this.showToast('⚠️ Check again! Remember: Wild animals need wetlands & herds!');
        if (card) {
          card.classList.remove('wobble');
          void card.offsetWidth; // re-flow
          card.classList.add('wobble');
        }
      }
    }

    // ==========================================================================
    // STAGE 3: CAPYBARA WETLAND RIG & TELEPROMPTER
    // ==========================================================================
    renderStage3(container) {
      this.updateMeter(3, 'Stage 3: Teleprompter Studio', 100);
      const scriptWords = this.data.teleprompterScript || [];

      container.innerHTML = `
        <div class="stage-prompt">
          <h2>Stage 3: Capybara Wetland & Broadcast Studio</h2>
          <p>Inspect the capybara's wild adaptations, then lead the official Ranger broadcast!</p>
          <div class="pill-target">Keep it wild! Buy the toy lamp!</div>
        </div>

        <div class="habitat-viewport">
          <div class="water-ripples"></div>
          <div class="capy-rig" id="capy-rig">
            <svg viewBox="0 0 160 120" width="160" height="120">
              <!-- Capybara swimming rig -->
              <ellipse cx="80" cy="70" rx="55" ry="38" fill="#92400e"/>
              <ellipse cx="120" cy="50" rx="28" ry="22" fill="#a16207"/>
              <!-- Snorkel face elements: high eyes, nostrils & ears -->
              <circle cx="128" cy="42" r="4.5" fill="#1c1917"/>
              <ellipse cx="136" cy="46" rx="3" ry="2" fill="#451a03"/>
              <ellipse cx="110" cy="34" rx="6" ry="8" fill="#78350f"/>
              <!-- Webbed paws in water -->
              <ellipse cx="50" cy="98" rx="14" ry="6" fill="#78350f"/>
              <ellipse cx="105" cy="98" rx="14" ry="6" fill="#78350f"/>
            </svg>
          </div>
        </div>

        <div class="adaptation-tray">
          <button class="adapt-btn ${this.unlockedAdaptations.has('feet') ? 'unlocked' : ''}" id="adapt-feet">
            <span style="font-size:1.2rem;">🌊 Webbed Feet</span>
            <span style="font-size:0.75rem; color:#94a3b8;">For swimming in wetlands</span>
          </button>
          <button class="adapt-btn ${this.unlockedAdaptations.has('face') ? 'unlocked' : ''}" id="adapt-face">
            <span style="font-size:1.2rem;">🤿 Snorkel Face</span>
            <span style="font-size:0.75rem; color:#94a3b8;">Eyes & nose stay above water</span>
          </button>
          <button class="adapt-btn ${this.unlockedAdaptations.has('teeth') ? 'unlocked' : ''}" id="adapt-teeth">
            <span style="font-size:1.2rem;">🦷 Ever-Growing Teeth</span>
            <span style="font-size:0.75rem; color:#94a3b8;">Chews wetland grass all day</span>
          </button>
        </div>

        <div class="teleprompter-box" id="teleprompter-box">
          <div class="teleprompter-text" id="teleprompter-text">
            ${scriptWords.map((w, i) => `<span class="word" id="word-${i}">${w}</span>`).join(' ')}
          </div>
        </div>

        <div style="margin-top: 18px;">
          <button class="btn-3d btn-green" id="btn-broadcast">
            🎙️ START LIVE RANGER BROADCAST
          </button>
        </div>
      `;

      // Adaptation triggers
      this._bindAdaptation('adapt-feet', 'feet', 'The capybara has webbed feet for swimming quickly in rivers!');
      this._bindAdaptation('adapt-face', 'face', 'The capybara has eyes and ears high on its head like a snorkel!');
      this._bindAdaptation('adapt-teeth', 'teeth', 'The capybara has sharp teeth that grow forever to chew grass!');

      const broadcastBtn = document.getElementById('btn-broadcast');
      if (broadcastBtn) {
        broadcastBtn.addEventListener('click', () => this._startLiveBroadcast());
      }
    }

    _bindAdaptation(btnId, key, speech) {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (this.sound) this.sound.playSnap();
        if (!this.unlockedAdaptations.has(key)) {
          this.unlockedAdaptations.add(key);
          btn.classList.add('unlocked');
          this.addXP(15, `Discovered adaptation! (+15 XP)`);
          if (this.sound) {
            this.sound.playXP();
            this.sound.speak(speech);
          }
        }
      });
    }

    _startLiveBroadcast() {
      if (this.isBroadcasting) return;
      this.isBroadcasting = true;

      const broadcastBtn = document.getElementById('btn-broadcast');
      if (broadcastBtn) {
        broadcastBtn.style.opacity = '0.5';
        broadcastBtn.textContent = '🔴 ON AIR: BROADCASTING LIVE...';
      }

      const scriptWords = this.data.teleprompterScript || [];
      const wordEls = scriptWords.map((_, i) => document.getElementById(`word-${i}`)).filter(Boolean);
      wordEls.forEach(el => el.classList.remove('glow'));

      let wordIndex = 0;
      const fullText = scriptWords.join(' ');

      if (this.sound) {
        this.sound.speak(
          fullText,
          () => {
            // on boundary / completion fallback
            this._celebrateVictory();
          }
        );
      }

      // Smooth step highlight fallback
      const interval = setInterval(() => {
        wordEls.forEach(el => el.classList.remove('glow'));
        if (wordEls[wordIndex]) {
          wordEls[wordIndex].classList.add('glow');
          wordIndex++;
        } else {
          clearInterval(interval);
          this._celebrateVictory();
        }
      }, 340);
    }

    _celebrateVictory() {
      if (!this.isBroadcasting) return;
      this.isBroadcasting = false;

      this.addXP(50, '🎉 Ranger Certification Earned! (+50 XP)');
      if (this.sound) this.sound.playFanfare();
      this.triggerConfetti();

      const stageEl = document.getElementById('stage');
      if (!stageEl) return;

      const modal = document.createElement('div');
      modal.className = 'victory-modal';
      modal.innerHTML = `
        <div class="victory-badge">🏆🐾</div>
        <h2 style="font-size:2.2rem; color:#fff; margin-bottom:8px;">MASTER WILDLIFE RANGER</h2>
        <p style="font-size:1.1rem; color:#cbd5e1; max-width:540px; margin-bottom:20px;">
          You protected wild animals, identified adaptations, and proved that real animals belong in wetlands, not bedrooms!
        </p>
        <div style="font-size:1.4rem; font-weight:800; color:#f59e0b; margin-bottom:24px;">
          FINAL SCORE: ${this.xp} XP
        </div>
        <div style="display:flex; gap:16px; flex-wrap:wrap; justify-content:center;">
          <a href="worksheet.html" target="_blank" class="btn-3d btn-amber">📄 PRINT RANGER LOG & CERTIFICATE</a>
          <button class="btn-3d btn-green" id="btn-replay">🔄 PLAY AGAIN</button>
        </div>
      `;

      stageEl.appendChild(modal);

      const replayBtn = modal.querySelector('#btn-replay');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          modal.remove();
          this.stage = 1;
          this.unlockedCards.clear();
          this.scenarioIndex = 0;
          this.unlockedAdaptations.clear();
          this.renderStage();
        });
      }
    }

    // ==========================================================================
    // CONFETTI ENGINE
    // ==========================================================================
    _setupConfetti() {
      this.canvas = document.getElementById('confetti-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      const resize = () => {
        const arena = document.getElementById('game-arena');
        if (arena && this.canvas) {
          this.canvas.width = arena.clientWidth;
          this.canvas.height = arena.clientHeight;
        }
      };
      window.addEventListener('resize', resize);
      resize();
    }

    triggerConfetti() {
      if (!this.canvas || !this.ctx) return;
      this.confettiParticles = [];
      const colors = ['#10b981', '#38bdf8', '#f59e0b', '#ec4899', '#a855f7', '#facc15'];

      for (let i = 0; i < 90; i++) {
        this.confettiParticles.push({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.7) * 16,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 10,
          opacity: 1
        });
      }

      if (!this.confettiActive) {
        this.confettiActive = true;
        this._animateConfetti();
      }
    }

    _animateConfetti() {
      if (!this.confettiActive || !this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.confettiParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.vRot;
        p.opacity -= 0.009;

        if (p.opacity > 0) {
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.fillStyle = p.color;
          this.ctx.globalAlpha = Math.max(0, p.opacity);
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          this.ctx.restore();
        }
      });

      this.confettiParticles = this.confettiParticles.filter(p => p.opacity > 0);

      if (this.confettiParticles.length > 0) {
        requestAnimationFrame(() => this._animateConfetti());
      } else {
        this.confettiActive = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    showToast(message) {
      let toast = document.getElementById('ranger-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'ranger-toast';
        toast.id = 'ranger-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('visible');
      setTimeout(() => {
        toast.classList.remove('visible');
      }, 2200);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    root.WildlifeApp = new WildlifeDetectiveApp();
    root.WildlifeApp.init();
  });

})(typeof window !== 'undefined' ? window : this);
