/**
 * NASA MISSION: FIND A NEW PLANET — REACTIVE ENGINE & SCENE CONTROLLER
 * State Machine, Dynamic Viewports, Interaction Handlers & Modals
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
          type: "Glacial Ice World",
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
        isBroadcasting: false,
        broadcastComplete: false
      };
    }

    init() {
      this.initStarfield();
      this.bindHudEvents();
      this.renderTracker();
      this.renderStage(1);
    }

    // =========================================================================
    // STARFIELD CANVAS BACKGROUND
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

      const stars = Array.from({ length: 140 }, () => ({
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
        "1. Phonics Booster",
        "2. Surface Scanner",
        "3. Cargo Sorter",
        "4. Invention Lab",
        "5. Upgrade Exchange",
        "6. Live Broadcast"
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
        alert("Complete the current mission stage first to unlock this section!");
        return;
      }
      this.session.currentStage = stageNum;
      this.renderTracker();
      this.renderStage(stageNum);
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
          <span class="nasa-stage-badge">STAGE 1 / 6 • PRE-FLIGHT PHONICS</span>
          <h1 class="nasa-stage-title">Fuel Rocket Thrusters to 100%</h1>
          <p class="nasa-stage-instruction">Listen to the word. Click the Magic 'E' power crystal to transform the sound and fuel your rocket!</p>
          <button type="button" class="btn-speaker-listen" onclick="window.NasaMission.speakPrompt('${drill.promptAudio}')">
            🔊 Listen to Target Word
          </button>
        </div>

        <div class="booster-grid">
          <!-- Rocket Canister Column -->
          <div class="rocket-column">
            <div class="rocket-avatar" id="rocketAvatar">🚀</div>
            <h3 style="font-weight: 800; color: #fff;">Saturn-V Thruster</h3>
            <div class="fuel-gauge-container">
              <div class="fuel-gauge-fill" id="fuelGaugeFill" style="width: ${this.session.fuelLevel}%;"></div>
              <span class="fuel-gauge-label" id="fuelGaugeLabel">${this.session.fuelLevel}% FUEL</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Engine Status: ${this.session.fuelLevel >= 100 ? 'READY FOR LAUNCH! 🌟' : 'Charging Fuel Pods...'}</p>
          </div>

          <!-- Phonics Transformation Workbench -->
          <div class="phonics-workbench">
            <div style="font-size: 0.9rem; font-weight: 800; color: var(--cyan); letter-spacing: 1px;">
              WORD DRILL ${this.session.currentPhonicsIndex + 1} OF ${s1Data.drills.length}
            </div>

            <div class="word-transformation-display">
              <div class="word-pod" id="baseWordPod">${drill.baseWord}</div>
              <div style="font-size: 2rem; color: var(--text-muted);">➔</div>
              <div class="word-pod magic-e-slot" id="magicWordPod">
                ${drill.baseWord} + <span style="color: #fbbf24;">E</span>
              </div>
            </div>

            <button type="button" class="btn-magic-e" id="btnMagicE" onclick="window.NasaMission.applyMagicE()">
              ✨ INJECT MAGIC 'E' (+25% FUEL)
            </button>

            <div class="phonics-hint-card">
              <div style="font-weight: 800; color: #fff; margin-bottom: 4px;">Phonics Sound Rule:</div>
              Short Vowel: <strong>${drill.phoneticShort}</strong> ➔ Magic Vowel: <strong>${drill.phoneticLong}</strong>
              <div style="margin-top: 6px; font-style: italic; color: var(--cyan);">${drill.meaning}</div>
            </div>
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
        magicPod.innerHTML = `<span style="color: #38bdf8;">${drill.magicWord}</span>`;
        magicPod.style.transform = "scale(1.1)";
        setTimeout(() => { magicPod.style.transform = "scale(1)"; }, 300);
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
          alert("🎉 100% FUEL REACHED! T-minus 3... 2... 1... BLAST OFF to the unknown planet!");
          this.session.currentStage = 2;
          this.renderTracker();
          this.renderStage(2);
        }, 1600);
      } else {
        this.session.currentPhonicsIndex = (this.session.currentPhonicsIndex + 1) % s1Data.drills.length;
        setTimeout(() => {
          this.renderStage(1);
        }, 1400);
      }
    }

    // =========================================================================
    // STAGE 2: PLANET PROBE SCANNER (ADJECTIVES)
    // =========================================================================
    renderStage2(container) {
      const pData = this.data.stage2_probe.planetPresets[0];

      container.innerHTML = `
        <div class="nasa-stage-hero">
          <span class="nasa-stage-badge">STAGE 2 / 6 • SURFACE PROBE SCANNER</span>
          <h1 class="nasa-stage-title">${pData.name} Surface Analysis</h1>
          <p class="nasa-stage-instruction">Click the 3 pulsing radar beacons on the terrain to scan sensory adjectives and geological features!</p>
        </div>

        <div class="scanner-viewport">
          <div class="radar-canvas-layer"></div>
          <div class="radar-sweep-line"></div>

          ${pData.landmarks.map((lm) => {
            const isScanned = this.session.discoveredPlanet.scannedLandmarks.includes(lm.id);
            return `
              <div class="planet-landmark-beacon ${isScanned ? 'scanned' : ''}" 
                   style="left: ${lm.x}%; top: ${lm.y}%;"
                   title="${lm.title}"
                   onclick="window.NasaMission.scanLandmark('${lm.id}')">
                ${isScanned ? '✅' : lm.icon}
              </div>
            `;
          }).join("")}

          <div class="scanner-dossier-drawer">
            <div>
              <div style="font-size: 0.8rem; font-weight: 800; color: var(--cyan); text-transform: uppercase;">
                DISCOVERED PLANETARY ADJECTIVES (${this.session.discoveredPlanet.adjectives.length} / 3)
              </div>
              <div class="adjective-tag-chips" style="margin-top: 6px;">
                <span class="adj-chip ${this.session.discoveredPlanet.adjectives.includes("COLD") ? 'discovered' : ''}">❄️ It is COLD</span>
                <span class="adj-chip ${this.session.discoveredPlanet.adjectives.includes("ROCKY") ? 'discovered' : ''}">🪨 It is ROCKY</span>
                <span class="adj-chip ${this.session.discoveredPlanet.adjectives.includes("DARK") ? 'discovered' : ''}">🌑 It is DARK</span>
              </div>
            </div>

            <div style="text-align: right;">
              <div style="font-size: 0.82rem; color: var(--text-muted);">Atmospheric Status</div>
              <div style="font-size: 1rem; font-weight: 800; color: #fff;">${pData.atmosphere}</div>
            </div>
          </div>
        </div>
      `;
    }

    scanLandmark(landmarkId) {
      const pData = this.data.stage2_probe.planetPresets[0];
      const lm = pData.landmarks.find(l => l.id === landmarkId);
      if (!lm) return;

      this.audio.playSonarPing();

      if (!this.session.discoveredPlanet.scannedLandmarks.includes(lm.id)) {
        this.session.discoveredPlanet.scannedLandmarks.push(lm.id);
        this.session.discoveredPlanet.adjectives.push(lm.adjective);
        this.session.scoreXP += 30;
      }

      this.audio.speak(`${lm.sensorySentence} ${lm.description}`);

      if (this.session.discoveredPlanet.scannedLandmarks.length >= 3) {
        this.session.stageProgress[2] = "completed";
        this.session.stageProgress[3] = "active";

        setTimeout(() => {
          alert(`📡 SURFACE SCAN COMPLETE!\nThe planet is COLD, ROCKY, and DARK!\nProceeding to Cargo Bay Airlock...`);
          this.session.currentStage = 3;
          this.renderTracker();
          this.renderStage(3);
        }, 1500);
      } else {
        this.renderStage(2);
      }
    }

    // =========================================================================
    // STAGE 3: SURVIVAL CARGO SORTER
    // =========================================================================
    renderStage3(container) {
      const cData = this.data.stage3_cargo;
      const currentItem = cData.items[this.session.cargoIndex];

      container.innerHTML = `
        <div class="nasa-stage-hero">
          <span class="nasa-stage-badge">STAGE 3 / 6 • SURVIVAL CARGO SORTER</span>
          <h1 class="nasa-stage-title">Load Essential Survival Gear</h1>
          <p class="nasa-stage-instruction">Sort each item: Is it ESSENTIAL FOR SURVIVAL or a NON-ESSENTIAL luxury item?</p>
        </div>

        <div class="cargo-sorter-layout">
          <div class="cargo-conveyor-belt">
            <div style="font-size: 0.82rem; font-weight: 800; color: var(--cyan); margin-bottom: 8px;">
              INCOMING CARGO CAPSULE (${this.session.cargoIndex + 1} OF ${cData.items.length})
            </div>

            <div class="current-cargo-card">
              <div class="current-cargo-icon">${currentItem.icon}</div>
              <div class="current-cargo-name">${currentItem.name}</div>
              <div style="font-size: 0.9rem; color: var(--text-muted); max-width: 480px;">${currentItem.explanation}</div>
              <button type="button" class="btn-speaker-listen" onclick="window.NasaMission.speakPrompt('${currentItem.sentence}')">
                🔊 Listen: Why do we need this?
              </button>
            </div>
          </div>

          <div class="cargo-drop-bays">
            <!-- Essential Bay -->
            <div class="cargo-bay bay-essential" onclick="window.NasaMission.sortCargo('essential')">
              <div class="bay-header" style="color: var(--emerald);">🛡️ ESSENTIAL FOR SURVIVAL</div>
              <div class="bay-sub">Humans CANNOT live without this in space!</div>
              <div class="bay-items-list">
                ${this.session.cargoBay.essential.map(i => `<span class="stored-cargo-chip" style="border-color: var(--emerald);">✅ ${i}</span>`).join("")}
              </div>
            </div>

            <!-- Non-Essential Bay -->
            <div class="cargo-bay bay-luxury" onclick="window.NasaMission.sortCargo('non-essential')">
              <div class="bay-header" style="color: var(--indigo);">🎮 NON-ESSENTIAL / LUXURY</div>
              <div class="bay-sub">Fun to have, but not needed to breathe or survive!</div>
              <div class="bay-items-list">
                ${this.session.cargoBay.nonEssential.map(i => `<span class="stored-cargo-chip" style="border-color: var(--indigo);">📦 ${i}</span>`).join("")}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    sortCargo(chosenCategory) {
      const cData = this.data.stage3_cargo;
      const currentItem = cData.items[this.session.cargoIndex];

      if (chosenCategory === currentItem.category) {
        this.audio.playMechanicalSnap();
        if (chosenCategory === "essential") {
          this.session.cargoBay.essential.push(currentItem.name);
        } else {
          this.session.cargoBay.nonEssential.push(currentItem.name);
        }
        this.session.scoreXP += 15;
        this.audio.speak(currentItem.sentence);

        this.session.cargoIndex += 1;
        if (this.session.cargoIndex >= cData.items.length) {
          this.session.stageProgress[3] = "completed";
          this.session.stageProgress[4] = "active";

          setTimeout(() => {
            alert("✅ ALL CARGO SORTED!\nLife support reserves: 100%!\nApproaching planetary orbit...");
            this.session.currentStage = 4;
            this.renderTracker();
            this.renderStage(4);
          }, 1400);
        } else {
          this.renderStage(3);
        }
      } else {
        this.audio.playSoftThud();
        alert(`Soft Fail Hint:\n${currentItem.name} is ${currentItem.category.toUpperCase()}! ${currentItem.explanation}`);
      }
    }

    // =========================================================================
    // STAGE 4: EMERGENCY ALERT & INVENTION LAB
    // =========================================================================
    renderStage4(container) {
      const invData = this.data.stage4_invention;

      container.innerHTML = `
        <div class="nasa-stage-hero">
          <span class="nasa-stage-badge">STAGE 4 / 6 • MODULAR INVENTION LAB</span>
          <h1 class="nasa-stage-title">Emergency Hazard & Custom Robot Builder</h1>
          <p class="nasa-stage-instruction">An environmental hazard threatens our mission! Snap together the right machine parts to solve the crisis.</p>
        </div>

        <!-- Flashing Red Alert -->
        <div class="alert-banner">
          <div class="alert-icon">🚨</div>
          <div>
            <div class="alert-title">${invData.crisis.alertTitle} — ${invData.crisis.hazardName} (${invData.crisis.temperature})</div>
            <div class="alert-desc">${invData.crisis.problemStatement}</div>
          </div>
        </div>

        <div class="workbench-slots">
          <!-- 1. Chassis -->
          <div class="part-selector-box">
            <div class="box-title">1. Rover Chassis</div>
            ${invData.modularParts.chassis.map(c => `
              <div class="part-option-card ${this.session.selectedChassis === c.id ? 'selected' : ''}" onclick="window.NasaMission.selectPart('chassis', '${c.id}')">
                <div class="part-icon">${c.icon}</div>
                <div>
                  <div class="part-name">${c.name}</div>
                  <div class="part-desc">${c.advantage}</div>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- 2. Power Core -->
          <div class="part-selector-box">
            <div class="box-title">2. Power Core</div>
            ${invData.modularParts.powerCores.map(p => `
              <div class="part-option-card ${this.session.selectedPower === p.id ? 'selected' : ''}" onclick="window.NasaMission.selectPart('power', '${p.id}')">
                <div class="part-icon">${p.icon}</div>
                <div>
                  <div class="part-name">${p.name}</div>
                  <div class="part-desc">${p.advantage}</div>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- 3. Tool -->
          <div class="part-selector-box">
            <div class="box-title">3. Action Tool</div>
            ${invData.modularParts.tools.map(t => `
              <div class="part-option-card ${this.session.selectedTool === t.id ? 'selected' : ''}" onclick="window.NasaMission.selectPart('tool', '${t.id}')">
                <div class="part-icon">${t.icon}</div>
                <div>
                  <div class="part-name">${t.name}</div>
                  <div class="part-desc">Can ${t.verb} ${t.target}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="test-field-box">
          <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">
            Machine Blueprint: 
            ${this.session.selectedChassis ? '🚜 ' : '⬜ '} + 
            ${this.session.selectedPower ? '⚛️ ' : '⬜ '} + 
            ${this.session.selectedTool ? '🔥 ' : '⬜ '}
          </div>
          <button type="button" class="btn-activate-machine" onclick="window.NasaMission.activateInvention()">
            ⚡ TEST & ACTIVATE INVENTION!
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
        alert("Please select all 3 components: Chassis, Power Core, and Action Tool!");
        return;
      }

      if (this.session.selectedTool === "tool-heatray") {
        this.audio.playThermalBeam();
        setTimeout(() => {
          this.audio.playWaterSplash();
        }, 500);

        this.session.scoreXP += 40;
        this.session.stageProgress[4] = "completed";
        this.session.stageProgress[5] = "active";

        setTimeout(() => {
          alert("🎉 SUCCESS! The Thermal Heat Ray melted the glacier ice into 10,000 Liters of fresh drinkable water!");
          this.session.currentStage = 5;
          this.renderTracker();
          this.renderStage(5);
        }, 1400);
      } else {
        this.audio.playSoftThud();
        alert("CRISIS NOT RESOLVED: That tool cannot melt ice into water! Choose the tool that produces high heat!");
      }
    }

    // =========================================================================
    // STAGE 5: GLOBAL UPGRADE EXCHANGE (CONJUNCTIONS)
    // =========================================================================
    renderStage5(container) {
      const exData = this.data.stage5_exchange;

      container.innerHTML = `
        <div class="nasa-stage-hero">
          <span class="nasa-stage-badge">STAGE 5 / 6 • GLOBAL UPGRADE EXCHANGE</span>
          <h1 class="nasa-stage-title">International Peer Upgrade Bay</h1>
          <p class="nasa-stage-instruction">Select a teammate's upgrade module. Connect both machine actions using the magic conjunction word 'AND'!</p>
        </div>

        <div class="peers-grid">
          ${exData.peers.map(peer => `
            <div class="peer-card ${this.session.selectedPeer === peer.id ? 'selected' : ''}" onclick="window.NasaMission.selectPeer('${peer.id}')">
              <div class="peer-avatar">${peer.avatar}</div>
              <div class="peer-name">${peer.name}</div>
              <div class="peer-station">${peer.station}</div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #fff; margin: 6px 0;">Tool: ${peer.toolName}</div>
              <div class="peer-dialogue">"${peer.dialogue}"</div>
            </div>
          `).join("")}
        </div>

        <div class="conjunction-bridge-box">
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--cyan); letter-spacing: 1px;">
            EXPANDED COMPOUND SENTENCE BUILDER
          </div>

          <div class="bridge-formula">
            <div class="formula-clause">My machine can MELT ICE</div>
            <button type="button" class="btn-conjunction-and" onclick="window.NasaMission.connectConjunction()">
              🤝 CONNECT WITH 'AND'
            </button>
            <div class="formula-clause">
              ${this.session.selectedPeer ? `It can ${exData.peers.find(p => p.id === this.session.selectedPeer).verb.toUpperCase()} ${exData.peers.find(p => p.id === this.session.selectedPeer).noun.toUpperCase()}` : 'Select a peer upgrade above'}
            </div>
          </div>

          <p style="font-size: 0.9rem; color: var(--text-muted);">Conjunction Rule: We use <strong>'AND'</strong> to join two complete actions together into one super machine sentence!</p>
        </div>
      `;
    }

    selectPeer(peerId) {
      this.audio.playMechanicalSnap();
      this.session.selectedPeer = peerId;
      const peer = this.data.stage5_exchange.peers.find(p => p.id === peerId);
      if (peer) {
        this.audio.speak(`Teammate ${peer.name} says: Our tool can ${peer.actionSentence}!`);
      }
      this.renderStage(5);
    }

    connectConjunction() {
      if (!this.session.selectedPeer) {
        this.audio.playSoftThud();
        alert("Please choose an astronaut partner first!");
        return;
      }

      this.audio.playMagicEChime();
      const peer = this.data.stage5_exchange.peers.find(p => p.id === this.session.selectedPeer);
      const sentence = `My machine can melt ice AND ${peer.verb} ${peer.noun}!`;

      this.audio.speak(sentence);
      this.session.scoreXP += 35;
      this.session.conjunctionConnected = true;
      this.session.stageProgress[5] = "completed";
      this.session.stageProgress[6] = "active";

      setTimeout(() => {
        alert(`🤝 UPGRADE COMPLETE!\n"${sentence}"\nProceeding to live NASA broadcast stage!`);
        this.session.currentStage = 6;
        this.renderTracker();
        this.renderStage(6);
      }, 1600);
    }

    // =========================================================================
    // STAGE 6: NASA LIVE BROADCAST (TELEPROMPTER)
    // =========================================================================
    renderStage6(container) {
      const peer = this.data.stage5_exchange.peers.find(p => p.id === this.session.selectedPeer) || this.data.stage5_exchange.peers[0];

      container.innerHTML = `
        <div class="nasa-stage-hero">
          <span class="nasa-stage-badge">STAGE 6 / 6 • NASA LIVE BROADCAST</span>
          <h1 class="nasa-stage-title">Official Mission Teleprompter Report</h1>
          <p class="nasa-stage-instruction">Review your 5-line mission speech. Tap the speaker to rehearse, then click BROADCAST TO EARTH!</p>
        </div>

        <div class="teleprompter-shell">
          <div class="broadcast-rec-indicator">
            <span class="rec-dot"></span> LIVE TRANSMISSION FEED
          </div>

          <div class="teleprompter-lines">
            <div class="prompter-line-card" id="prompterLine1">
              <span>1. "Hello Earth! We found a new planet."</span>
              <button type="button" class="btn-speaker-listen" onclick="window.NasaMission.speakPrompt('Hello Earth! We found a new planet.')">🔊 Listen</button>
            </div>
            <div class="prompter-line-card" id="prompterLine2">
              <span>2. "It is <strong>COLD</strong> and <strong>ROCKY</strong>."</span>
              <button type="button" class="btn-speaker-listen" onclick="window.NasaMission.speakPrompt('It is cold and rocky.')">🔊 Listen</button>
            </div>
            <div class="prompter-line-card" id="prompterLine3">
              <span>3. "People need <strong>OXYGEN</strong> and <strong>WATER</strong> to survive here."</span>
              <button type="button" class="btn-speaker-listen" onclick="window.NasaMission.speakPrompt('People need oxygen and water to survive here.')">🔊 Listen</button>
            </div>
            <div class="prompter-line-card" id="prompterLine4">
              <span>4. "My machine can <strong>MELT ICE</strong> AND <strong>${peer.verb.toUpperCase()} ${peer.noun.toUpperCase()}</strong>!"</span>
              <button type="button" class="btn-speaker-listen" onclick="window.NasaMission.speakPrompt('My machine can melt ice and ${peer.verb} ${peer.noun}!')">🔊 Listen</button>
            </div>
            <div class="prompter-line-card" id="prompterLine5">
              <span>5. "Mission accomplished! Over and out!"</span>
              <button type="button" class="btn-speaker-listen" onclick="window.NasaMission.speakPrompt('Mission accomplished! Over and out!')">🔊 Listen</button>
            </div>
          </div>

          <div class="broadcast-controls">
            <button type="button" class="btn-broadcast-earth" id="btnBroadcast" onclick="window.NasaMission.startBroadcast()">
              📡 BROADCAST REPORT TO MISSION CONTROL!
            </button>
          </div>
        </div>
      `;
    }

    startBroadcast() {
      const btn = document.getElementById("btnBroadcast");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = "🎙️ BROADCASTING LIVE TO EARTH...";
      }

      const lines = [
        { id: "prompterLine1", text: "Hello Earth! We found a new planet." },
        { id: "prompterLine2", text: "It is cold and rocky." },
        { id: "prompterLine3", text: "People need oxygen and water to survive here." },
        { id: "prompterLine4", text: "My machine can melt ice and filter water!" },
        { id: "prompterLine5", text: "Mission accomplished! Over and out!" }
      ];

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
          }, 800);
          return;
        }

        const item = lines[current];
        document.querySelectorAll(".prompter-line-card").forEach(c => c.classList.remove("speaking"));
        const card = document.getElementById(item.id);
        if (card) {
          card.classList.add("speaking");
        }

        this.audio.speak(item.text, () => {
          if (card) {
            card.classList.remove("speaking");
            card.classList.add("verified");
          }
          current++;
          setTimeout(playNext, 400);
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
