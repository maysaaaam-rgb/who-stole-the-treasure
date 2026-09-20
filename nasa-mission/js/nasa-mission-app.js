/**
 * NASA MISSION: FIND A NEW PLANET — REACTIVE ENGINE & SCENE CONTROLLER
 * Visual-First, Low-Text Architecture for Primary Learners (Ages 6–9)
 * Pure Vanilla JavaScript • Zero Browser Alert Blocking Popups
 */
(function(root) {
  'use strict';

  class NasaMissionApp {
    constructor() {
      this.data = root.NASA_MISSION_DATA;
      this.audio = root.spaceAudio;

      // Reactive Player Session State
      this.session = {
        learnerId: "cadet-" + Math.floor(1000 + Math.random() * 9000),
        astronautName: "Cadet Alex",
        currentStage: 1,
        stageProgress: { 1: "active", 2: "locked", 3: "locked", 4: "locked", 5: "locked", 6: "locked" },
        scoreXP: 0,
        
        // Stage 1
        fuelLevel: 0,
        currentPhonicsIndex: 0,

        // Stage 2
        discoveredPlanet: {
          name: "Planet Cryo-Gliese",
          type: "Glacial World",
          adjectives: [],
          scannedLandmarks: []
        },

        // Stage 3
        cargoIndex: 0,
        cargoBay: {
          essential: [],
          nonEssential: []
        },

        // Stage 4
        selectedChassis: null,
        selectedPower: null,
        selectedTool: null,

        // Stage 5
        selectedPeer: null,
        conjunctionConnected: false,

        // Stage 6
        isBroadcasting: false
      };
    }

    init() {
      this.initStarfield();
      this.bindHudEvents();
      this.renderTracker();
      this.renderStage(1);
    }

    // =========================================================================
    // STARFIELD CANVAS
    // =========================================================================
    initStarfield() {
      const canvas = document.getElementById("starfieldCanvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      const stars = Array.from({ length: 130 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005
      }));

      function animate() {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(s => {
          s.alpha += s.speed;
          if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.alpha)})`;
          ctx.fill();
        });
        requestAnimationFrame(animate);
      }
      animate();
    }

    // =========================================================================
    // HUD & TRACKER
    // =========================================================================
    bindHudEvents() {
      const soundBtn = document.getElementById("nasaSoundBtn");
      if (soundBtn) {
        soundBtn.addEventListener("click", () => {
          const muted = this.audio.toggleMute();
          soundBtn.innerHTML = muted ? "🔇 <span>Sound: OFF</span>" : "🔊 <span>Sound: ON</span>";
        });
      }
    }

    updateHud() {
      const xpDisplay = document.getElementById("nasaXpDisplay");
      if (xpDisplay) xpDisplay.textContent = `${this.session.scoreXP} XP`;

      const fuelDisplay = document.getElementById("nasaFuelDisplay");
      if (fuelDisplay) fuelDisplay.textContent = `Fuel: ${this.session.fuelLevel}%`;
    }

    renderTracker() {
      const tracker = document.getElementById("nasaStageTracker");
      if (!tracker) return;

      const stageLabels = [
        "1. Phonics",
        "2. Scanner",
        "3. Cargo",
        "4. Rover",
        "5. Upgrades",
        "6. Broadcast"
      ];

      tracker.innerHTML = stageLabels.map((lbl, idx) => {
        const stageNum = idx + 1;
        const status = this.session.stageProgress[stageNum] || "locked";
        const isActive = this.session.currentStage === stageNum ? "active" : "";
        const isCompleted = status === "completed" ? "completed" : "";
        return `
          <button type="button" class="stage-step-chip ${isActive} ${isCompleted}" onclick="window.NasaMission.goToStage(${stageNum})">
            ${status === 'completed' ? '✅' : '🚀'} ${lbl}
          </button>
        `;
      }).join("");
    }

    goToStage(stageNum) {
      if (this.session.stageProgress[stageNum] === "locked" && stageNum > this.session.currentStage) {
        this.audio.playSoftThud();
        this.showCelebration({
          icon: "🔒",
          title: "STAGE LOCKED",
          subtitle: "Complete current mission first!",
          duration: 1200
        });
        return;
      }
      this.session.currentStage = stageNum;
      this.renderTracker();
      this.renderStage(stageNum);
    }

    // Non-blocking in-game celebration toast
    showCelebration({ icon, title, subtitle, duration = 1600, onComplete }) {
      const overlay = document.getElementById("nasaCelebrationOverlay");
      if (!overlay) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      overlay.innerHTML = `
        <div class="celebration-box">
          <div class="celebration-icon">${icon || '🌟'}</div>
          <div class="celebration-title">${title}</div>
          <div class="celebration-sub">${subtitle}</div>
        </div>
      `;
      overlay.classList.add("active");

      setTimeout(() => {
        overlay.classList.remove("active");
        if (typeof onComplete === 'function') onComplete();
      }, duration);
    }

    // =========================================================================
    // SCENE ROUTER
    // =========================================================================
    renderStage(stageNum) {
      const container = document.getElementById("nasaStageContainer");
      if (!container) return;

      switch (stageNum) {
        case 1: this.renderStage1(container); break;
        case 2: this.renderStage2(container); break;
        case 3: this.renderStage3(container); break;
        case 4: this.renderStage4(container); break;
        case 5: this.renderStage5(container); break;
        case 6: this.renderStage6(container); break;
        default: this.renderStage1(container); break;
      }

      this.updateHud();
      this.renderTracker();
    }

    // =========================================================================
    // STAGE 1: PRE-FLIGHT BOOSTER (PHONICS)
    // =========================================================================
    renderStage1(container) {
      const s1Data = this.data.stage1_phonics;
      const drill = s1Data.drills[this.session.currentPhonicsIndex] || s1Data.drills[0];

      container.innerHTML = `
        <div class="nasa-stage-hero">
          <span class="nasa-stage-badge">STAGE 1 • PRE-FLIGHT BOOSTER</span>
          <h1 class="nasa-stage-title">Fuel Thrusters to 100%</h1>
          <p class="nasa-stage-instruction">Add Magic 'E' to make long vowel fuel!</p>
          <button type="button" class="btn-speaker-listen" onclick="window.NasaMission.speakPrompt('${drill.promptAudio}')">
            🔊 Listen to Word
          </button>
        </div>

        <div class="booster-grid">
          <!-- Rocket Status -->
          <div class="rocket-column">
            <div class="rocket-avatar" id="rocketAvatar">🚀</div>
            <h3 style="font-weight: 800; color: #fff;">Saturn Rocket</h3>
            <div class="fuel-gauge-container">
              <div class="fuel-gauge-fill" id="fuelGaugeFill" style="width: ${this.session.fuelLevel}%;"></div>
              <span class="fuel-gauge-label" id="fuelGaugeLabel">${this.session.fuelLevel}% FUEL</span>
            </div>
            <p style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">
              ${this.session.fuelLevel >= 100 ? 'READY FOR BLAST OFF! 🌟' : 'Fueling Engine...'}
            </p>
          </div>

          <!-- Tactile Word Cards -->
          <div class="phonics-workbench">
            <div style="font-size: 0.95rem; font-weight: 900; color: var(--cyan); letter-spacing: 1px;">
              CARD ${this.session.currentPhonicsIndex + 1} OF ${s1Data.drills.length}
            </div>

            <div class="word-cards-pair">
              <div class="word-card-tactile">
                <span class="word-card-icon">${drill.baseIcon}</span>
                <span class="word-card-text">${drill.baseWord}</span>
              </div>
              <div style="font-size: 2.2rem; color: var(--cyan);">➔</div>
              <div class="word-card-tactile magic" id="magicWordPod">
                <span class="word-card-icon">${drill.magicIcon}</span>
                <span class="word-card-text">${drill.baseWord} + <strong style="color: #fbbf24;">E</strong></span>
              </div>
            </div>

            <button type="button" class="btn-magic-e" id="btnMagicE" onclick="window.NasaMission.applyMagicE()">
              ✨ INJECT MAGIC 'E' (+25%)
            </button>
          </div>
        </div>
      `;
    }

    applyMagicE() {
      const s1Data = this.data.stage1_phonics;
      const drill = s1Data.drills[this.session.currentPhonicsIndex];

      this.audio.playMagicEChime();

      const magicPod = document.getElementById("magicWordPod");
      if (magicPod) {
        magicPod.innerHTML = `
          <span class="word-card-icon">${drill.magicIcon}</span>
          <span class="word-card-text" style="color: #38bdf8;">${drill.magicWord}</span>
        `;
        magicPod.style.transform = "scale(1.1)";
        setTimeout(() => { magicPod.style.transform = "scale(1)"; }, 250);
      }

      this.session.fuelLevel = Math.min(100, this.session.fuelLevel + 25);
      this.session.scoreXP += 25;

      const fill = document.getElementById("fuelGaugeFill");
      const label = document.getElementById("fuelGaugeLabel");
      if (fill && label) {
        fill.style.width = `${this.session.fuelLevel}%`;
        label.textContent = `${this.session.fuelLevel}% FUEL`;
      }

      this.audio.speak(drill.sentence);

      if (this.session.fuelLevel >= 100) {
        this.session.stageProgress[1] = "completed";
        this.session.stageProgress[2] = "active";

        const rocket = document.getElementById("rocketAvatar");
        if (rocket) {
          rocket.classList.add("launching");
          this.audio.playThrusterBlast();
        }

        setTimeout(() => {
          this.showCelebration({
            icon: "🚀",
            title: "100% FUEL REACHED!",
            subtitle: "3... 2... 1... BLAST OFF!",
            duration: 1800,
            onComplete: () => {
              this.session.currentStage = 2;
              this.renderTracker();
              this.renderStage(2);
            }
          });
        }, 1200);
      } else {
        this.session.currentPhonicsIndex = (this.session.currentPhonicsIndex + 1) % s1Data.drills.length;
        setTimeout(() => {
          this.renderStage(1);
        }, 1200);
      }
    }

    // =========================================================================
    // STAGE 2: PLANET PROBE SCANNER (VISUAL ADJECTIVES)
    // =========================================================================
    renderStage2(container) {
      const p = this.data.stage2_probe.planet;

      container.innerHTML = `
        <div class="nasa-stage-hero">
          <span class="nasa-stage-badge">STAGE 2 • SURFACE SCANNER</span>
          <h1 class="nasa-stage-title">${p.name}</h1>
          <p class="nasa-stage-instruction">Tap all 3 radar beacons to discover adjectives!</p>
        </div>

        <div class="scanner-viewport">
          <div class="radar-sweep-line"></div>

          ${p.landmarks.map((lm) => {
            const isScanned = this.session.discoveredPlanet.scannedLandmarks.includes(lm.id);
            return `
              <div class="planet-landmark-beacon ${isScanned ? 'scanned' : ''}" 
                   style="left: ${lm.x}%; top: ${lm.y}%;"
                   onclick="window.NasaMission.scanLandmark('${lm.id}')">
                ${isScanned ? '✅' : lm.icon}
              </div>
            `;
          }).join("")}

          <div class="adjective-tags-bar">
            <span class="adj-chip-large ${this.session.discoveredPlanet.adjectives.includes("COLD") ? 'discovered' : ''}">❄️ It is COLD</span>
            <span class="adj-chip-large ${this.session.discoveredPlanet.adjectives.includes("ROCKY") ? 'discovered' : ''}">🪨 It is ROCKY</span>
            <span class="adj-chip-large ${this.session.discoveredPlanet.adjectives.includes("DARK") ? 'discovered' : ''}">🌑 It is DARK</span>
          </div>
        </div>
      `;
    }

    scanLandmark(landmarkId) {
      const p = this.data.stage2_probe.planet;
      const lm = p.landmarks.find(l => l.id === landmarkId);
      if (!lm) return;

      this.audio.playSonarPing();

      if (!this.session.discoveredPlanet.scannedLandmarks.includes(lm.id)) {
        this.session.discoveredPlanet.scannedLandmarks.push(lm.id);
        this.session.discoveredPlanet.adjectives.push(lm.adjective);
        this.session.scoreXP += 30;
      }

      this.audio.speak(lm.audioText);

      if (this.session.discoveredPlanet.scannedLandmarks.length >= 3) {
        this.session.stageProgress[2] = "completed";
        this.session.stageProgress[3] = "active";

        setTimeout(() => {
          this.showCelebration({
            icon: "📡",
            title: "SURFACE SCAN COMPLETE!",
            subtitle: "It is COLD, ROCKY, and DARK!",
            duration: 1800,
            onComplete: () => {
              this.session.currentStage = 3;
              this.renderTracker();
              this.renderStage(3);
            }
          });
        }, 1000);
      } else {
        this.renderStage(2);
      }
    }

    // =========================================================================
    // STAGE 3: SURVIVAL CARGO SORTER (GIANT ICONS)
    // =========================================================================
    renderStage3(container) {
      const cData = this.data.stage3_cargo;
      const item = cData.items[this.session.cargoIndex];

      container.innerHTML = `
        <div class="nasa-stage-hero">
          <span class="nasa-stage-badge">STAGE 3 • CARGO SORTER</span>
          <h1 class="nasa-stage-title">Load Survival Gear</h1>
          <p class="nasa-stage-instruction">Tap the matching cargo bay!</p>
        </div>

        <div class="cargo-sorter-layout">
          <!-- Giant Item Card -->
          <div class="current-cargo-card">
            <span class="current-cargo-icon">${item.icon}</span>
            <span class="current-cargo-name">${item.name}</span>
            <button type="button" class="btn-speaker-listen" onclick="window.NasaMission.speakPrompt('${item.sentence}')">
              🔊 Listen: ${item.sentence}
            </button>
          </div>

          <!-- Giant Touch Bays -->
          <div class="cargo-drop-bays">
            <div class="cargo-bay bay-essential" onclick="window.NasaMission.sortCargo('essential')">
              <div class="bay-header" style="color: var(--emerald);">🛡️ NEED TO LIVE</div>
              <div class="bay-sub">Humans must have this to survive!</div>
              <div class="bay-items-list">
                ${this.session.cargoBay.essential.map(i => `<span class="stored-cargo-chip">✅ ${i}</span>`).join("")}
              </div>
            </div>

            <div class="cargo-bay bay-luxury" onclick="window.NasaMission.sortCargo('non-essential')">
              <div class="bay-header" style="color: var(--indigo);">🎮 FUN TO HAVE</div>
              <div class="bay-sub">Toys & treats, not essential!</div>
              <div class="bay-items-list">
                ${this.session.cargoBay.nonEssential.map(i => `<span class="stored-cargo-chip">📦 ${i}</span>`).join("")}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    sortCargo(chosenCategory) {
      const cData = this.data.stage3_cargo;
      const item = cData.items[this.session.cargoIndex];

      if (chosenCategory === item.category) {
        this.audio.playMechanicalSnap();
        if (chosenCategory === "essential") {
          this.session.cargoBay.essential.push(item.name);
        } else {
          this.session.cargoBay.nonEssential.push(item.name);
        }
        this.session.scoreXP += 15;
        this.audio.speak(item.sentence);

        this.session.cargoIndex += 1;
        if (this.session.cargoIndex >= cData.items.length) {
          this.session.stageProgress[3] = "completed";
          this.session.stageProgress[4] = "active";

          setTimeout(() => {
            this.showCelebration({
              icon: "✅",
              title: "ALL CARGO LOADED!",
              subtitle: "Life Support: 100%",
              duration: 1800,
              onComplete: () => {
                this.session.currentStage = 4;
                this.renderTracker();
                this.renderStage(4);
              }
            });
          }, 1000);
        } else {
          this.renderStage(3);
        }
      } else {
        this.audio.playSoftThud();
        this.showCelebration({
          icon: "💡",
          title: "HINT",
          subtitle: `${item.name} is ${item.category.toUpperCase()}!`,
          duration: 1200
        });
      }
    }

    // =========================================================================
    // STAGE 4: EMERGENCY ALERT & INVENTION LAB
    // =========================================================================
    renderStage4(container) {
      const inv = this.data.stage4_invention;

      container.innerHTML = `
        <div class="nasa-stage-hero">
          <span class="nasa-stage-badge">STAGE 4 • INVENTION LAB</span>
          <h1 class="nasa-stage-title">Build a Rover Machine</h1>
          <p class="nasa-stage-instruction">Select 3 parts to melt the ice!</p>
        </div>

        <div class="alert-banner">
          <span class="alert-icon">🚨</span>
          <div>
            <div class="alert-title">${inv.crisis.alertTitle} (${inv.crisis.temperature})</div>
            <div class="alert-desc">${inv.crisis.problemText}</div>
          </div>
        </div>

        <div class="workbench-slots">
          <!-- 1. Chassis -->
          <div class="part-selector-box">
            <div class="box-title">1. Rover Chassis</div>
            ${inv.chassis.map(c => `
              <div class="part-option-card ${this.session.selectedChassis === c.id ? 'selected' : ''}" onclick="window.NasaMission.selectPart('chassis', '${c.id}')">
                <span class="part-icon">${c.icon}</span>
                <div>
                  <div class="part-name">${c.name}</div>
                  <div class="part-desc">${c.label}</div>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- 2. Power Core -->
          <div class="part-selector-box">
            <div class="box-title">2. Power Core</div>
            ${inv.power.map(p => `
              <div class="part-option-card ${this.session.selectedPower === p.id ? 'selected' : ''}" onclick="window.NasaMission.selectPart('power', '${p.id}')">
                <span class="part-icon">${p.icon}</span>
                <div>
                  <div class="part-name">${p.name}</div>
                  <div class="part-desc">${p.label}</div>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- 3. Tool -->
          <div class="part-selector-box">
            <div class="box-title">3. Action Tool</div>
            ${inv.tools.map(t => `
              <div class="part-option-card ${this.session.selectedTool === t.id ? 'selected' : ''}" onclick="window.NasaMission.selectPart('tool', '${t.id}')">
                <span class="part-icon">${t.icon}</span>
                <div>
                  <div class="part-name">${t.name}</div>
                  <div class="part-desc">${t.action}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div style="text-align: center;">
          <button type="button" class="btn-activate-machine" onclick="window.NasaMission.activateInvention()">
            ⚡ TEST &amp; ACTIVATE ROVER!
          </button>
        </div>
      `;
    }

    selectPart(type, id) {
      this.audio.playMechanicalSnap();
      if (type === "chassis") this.session.selectedChassis = id;
      if (type === "power") this.session.selectedPower = id;
      if (type === "tool") this.session.selectedTool = id;
      this.renderStage(4);
    }

    activateInvention() {
      if (!this.session.selectedChassis || !this.session.selectedPower || !this.session.selectedTool) {
        this.audio.playSoftThud();
        this.showCelebration({
          icon: "⚙️",
          title: "CHOOSE 3 PARTS",
          subtitle: "Select Chassis, Power, and Tool!",
          duration: 1200
        });
        return;
      }

      if (this.session.selectedTool === "tool-heatray") {
        this.audio.playThermalBeam();
        setTimeout(() => { this.audio.playWaterSplash(); }, 400);

        this.session.scoreXP += 40;
        this.session.stageProgress[4] = "completed";
        this.session.stageProgress[5] = "active";

        setTimeout(() => {
          this.showCelebration({
            icon: "💧",
            title: "ICE MELTED!",
            subtitle: "10,000 Liters of Fresh Water!",
            duration: 1800,
            onComplete: () => {
              this.session.currentStage = 5;
              this.renderTracker();
              this.renderStage(5);
            }
          });
        }, 1200);
      } else {
        this.audio.playSoftThud();
        this.showCelebration({
          icon: "❄️",
          title: "STILL FROZEN",
          subtitle: "Choose the tool that melts ice!",
          duration: 1400
        });
      }
    }

    // =========================================================================
    // STAGE 5: GLOBAL UPGRADE EXCHANGE (CONJUNCTIONS)
    // =========================================================================
    renderStage5(container) {
      const ex = this.data.stage5_exchange;

      container.innerHTML = `
        <div class="nasa-stage-hero">
          <span class="nasa-stage-badge">STAGE 5 • UPGRADE EXCHANGE</span>
          <h1 class="nasa-stage-title">Team Up with Astronauts</h1>
          <p class="nasa-stage-instruction">Select a teammate. Join tools with 'AND'!</p>
        </div>

        <div class="peers-grid">
          ${ex.peers.map(peer => `
            <div class="peer-card ${this.session.selectedPeer === peer.id ? 'selected' : ''}" onclick="window.NasaMission.selectPeer('${peer.id}')">
              <span class="peer-avatar">${peer.avatar}</span>
              <div class="peer-name">${peer.name} ${peer.flag}</div>
              <div class="peer-tool-badge">${peer.icon} ${peer.toolName}</div>
            </div>
          `).join("")}
        </div>

        <div class="conjunction-bridge-box">
          <div class="bridge-formula">
            <div class="formula-clause">My machine can MELT ICE</div>
            <button type="button" class="btn-conjunction-and" onclick="window.NasaMission.connectConjunction()">
              🤝 CONNECT WITH 'AND'
            </button>
            <div class="formula-clause">
              ${this.session.selectedPeer ? `It can ${ex.peers.find(p => p.id === this.session.selectedPeer).phrase}` : 'Pick a teammate above'}
            </div>
          </div>
        </div>
      `;
    }

    selectPeer(peerId) {
      this.audio.playMechanicalSnap();
      this.session.selectedPeer = peerId;
      const peer = this.data.stage5_exchange.peers.find(p => p.id === peerId);
      if (peer) {
        this.audio.speak(`${peer.name}: Our tool can ${peer.verb}!`);
      }
      this.renderStage(5);
    }

    connectConjunction() {
      if (!this.session.selectedPeer) {
        this.audio.playSoftThud();
        this.showCelebration({
          icon: "🧑‍🚀",
          title: "SELECT TEAMMATE",
          subtitle: "Pick an astronaut partner above!",
          duration: 1200
        });
        return;
      }

      this.audio.playMagicEChime();
      const peer = this.data.stage5_exchange.peers.find(p => p.id === this.session.selectedPeer);
      const sentence = `My machine can melt ice AND ${peer.verb}!`;

      this.audio.speak(sentence);
      this.session.scoreXP += 35;
      this.session.stageProgress[5] = "completed";
      this.session.stageProgress[6] = "active";

      setTimeout(() => {
        this.showCelebration({
          icon: "🤝",
          title: "UPGRADE COMPLETE!",
          subtitle: sentence,
          duration: 1800,
          onComplete: () => {
            this.session.currentStage = 6;
            this.renderTracker();
            this.renderStage(6);
          }
        });
      }, 1000);
    }

    // =========================================================================
    // STAGE 6: NASA LIVE BROADCAST (TELEPROMPTER)
    // =========================================================================
    renderStage6(container) {
      const lines = this.data.stage6_broadcast.lines;

      container.innerHTML = `
        <div class="nasa-stage-hero">
          <span class="nasa-stage-badge">STAGE 6 • LIVE BROADCAST</span>
          <h1 class="nasa-stage-title">Mission Report to Earth</h1>
          <p class="nasa-stage-instruction">Tap BROADCAST to deliver your report!</p>
        </div>

        <div class="teleprompter-shell">
          <div class="teleprompter-lines">
            ${lines.map((item, idx) => `
              <div class="prompter-line-card" id="prompterLine${idx + 1}">
                <span>${idx + 1}. "${item.text}"</span>
                <button type="button" class="btn-speaker-listen" onclick="window.NasaMission.speakPrompt('${item.text}')">🔊</button>
              </div>
            `).join("")}
          </div>

          <div style="text-align: center;">
            <button type="button" class="btn-broadcast-earth" id="btnBroadcast" onclick="window.NasaMission.startBroadcast()">
              📡 BROADCAST TO EARTH!
            </button>
          </div>
        </div>
      `;
    }

    startBroadcast() {
      const btn = document.getElementById("btnBroadcast");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = "🎙️ BROADCASTING LIVE...";
      }

      const lines = this.data.stage6_broadcast.lines;
      let current = 0;

      const playNext = () => {
        if (current >= lines.length) {
          this.audio.playVictoryFanfare();
          this.session.scoreXP += 50;
          this.session.stageProgress[6] = "completed";
          this.updateHud();
          this.renderTracker();
          setTimeout(() => {
            this.openDiplomaModal();
          }, 600);
          return;
        }

        const item = lines[current];
        document.querySelectorAll(".prompter-line-card").forEach(c => c.classList.remove("speaking"));
        const card = document.getElementById(`prompterLine${current + 1}`);
        if (card) {
          card.classList.add("speaking");
        }

        this.audio.speak(item.text, () => {
          if (card) {
            card.classList.remove("speaking");
            card.classList.add("verified");
          }
          current++;
          setTimeout(playNext, 350);
        });
      };

      playNext();
    }

    // =========================================================================
    // MODALS: DIPLOMA, DOSSIER & TEACHER HUD
    // =========================================================================
    openDiplomaModal() {
      const modal = document.getElementById("nasaDiplomaModal");
      if (modal) modal.classList.add("open");
    }

    closeDiplomaModal() {
      const modal = document.getElementById("nasaDiplomaModal");
      if (modal) modal.classList.remove("open");
    }

    openDossierModal() {
      const modal = document.getElementById("nasaDossierModal");
      if (modal) modal.classList.add("open");
    }

    closeDossierModal() {
      const modal = document.getElementById("nasaDossierModal");
      if (modal) modal.classList.remove("open");
    }

    openTeacherModal() {
      const modal = document.getElementById("nasaTeacherModal");
      if (modal) modal.classList.add("open");
    }

    closeTeacherModal() {
      const modal = document.getElementById("nasaTeacherModal");
      if (modal) modal.classList.remove("open");
    }

    speakPrompt(text) {
      this.audio.speak(text);
    }
  }

  root.NasaMissionApp = NasaMissionApp;
  root.NasaMission = new NasaMissionApp();

  document.addEventListener("DOMContentLoaded", () => {
    root.NasaMission.init();
  });
})(typeof window !== 'undefined' ? window : global);
