/**
 * THE SMART FARM — INTERACTIVE MINI-GAMES CONTROLLER
 * 1. Pipe Puzzle (Thirsty Cow)
 * 2. Climate Control (Warm Chicken)
 * 3. Robot Block Sequencer (Carry Box)
 * 4. Modular Inventor Lab & Teleprompter Studio
 */
(function(root) {
  'use strict';

  const MiniGames = {
    // -----------------------------------------------------------------------
    // MISSION 1: PIPE PUZZLE MINI-GAME
    // -----------------------------------------------------------------------
    pipeState: {
      grid: [],
      isSolved: false,
      isFlowing: false
    },

    initPipePuzzle: function() {
      const pData = root.SMART_FARM_DATA.pipePuzzle;
      this.pipeState.isSolved = false;
      this.pipeState.isFlowing = false;

      // Deep clone puzzle cells
      this.pipeState.grid = pData.cells.map(c => ({
        ...c,
        rotation: c.rotation
      }));

      this.renderPipeGrid();
    },

    renderPipeGrid: function() {
      const container = document.getElementById('pipeGridContainer');
      if (!container) return;

      container.innerHTML = this.pipeState.grid.map((cell, idx) => {
        return `
          <div class="pipe-cell-wrap" onclick="MiniGames.rotatePipe(${idx})">
            <div class="pipe-tile ${this.pipeState.isFlowing ? 'is-flowing' : ''}" id="pipeTile-${cell.id}" style="transform: rotate(${cell.rotation}deg);">
              ${this.getPipeSvg(cell.type)}
            </div>
            <div class="pipe-touch-indicator">🔄</div>
          </div>
        `;
      }).join('');
    },

    rotatePipe: function(idx) {
      if (this.pipeState.isSolved || this.pipeState.isFlowing) return;

      const cell = this.pipeState.grid[idx];
      cell.rotation = (cell.rotation + 90) % 360;

      root.FarmAudio.playPipeTurn();

      const tileEl = document.getElementById(`pipeTile-${cell.id}`);
      if (tileEl) {
        tileEl.style.transform = `rotate(${cell.rotation}deg)`;
      }

      this.checkPipeSolution();
    },

    getPipeSvg: function(type) {
      // High-fidelity 3D metallic pipe with glossy highlights and fluid core
      if (type.startsWith('straight')) {
        return `
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <!-- Outer Metallic Pipe Collar -->
            <rect x="0" y="28" width="100" height="44" rx="10" fill="#334155" stroke="#1e293b" stroke-width="3"/>
            <!-- Pipe Barrel with 3D cylindrical shine -->
            <rect x="4" y="32" width="92" height="36" fill="url(#metalGradStraight)"/>
            <!-- Interior Fluid Channel -->
            <rect x="0" y="42" width="100" height="16" class="pipe-fluid-channel" fill="#38bdf8" opacity="0.4"/>
            <circle cx="16" cy="50" r="4" fill="#ffffff" opacity="0.8"/>
            <circle cx="84" cy="50" r="4" fill="#ffffff" opacity="0.8"/>
          </svg>
        `;
      } else {
        // Corner pipe (quarter circle bend)
        return `
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <path d="M 0,50 Q 50,50 50,100" stroke="#334155" stroke-width="44" fill="none" stroke-linecap="round"/>
            <path d="M 0,50 Q 50,50 50,100" stroke="url(#metalGradCorner)" stroke-width="36" fill="none"/>
            <path d="M 0,50 Q 50,50 50,100" class="pipe-fluid-channel" stroke="#38bdf8" stroke-width="16" fill="none" opacity="0.4"/>
            <!-- Joint Bolt Ring -->
            <circle cx="50" cy="50" r="8" fill="#475569" stroke="#1e293b" stroke-width="2"/>
            <circle cx="50" cy="50" r="4" fill="#38bdf8"/>
          </svg>
        `;
      }
    },

    checkPipeSolution: function() {
      // Check if all active path pipes match targetRotation
      const allAligned = this.pipeState.grid.every(c => (c.rotation % 180) === (c.targetRotation % 180));

      if (allAligned && !this.pipeState.isSolved) {
        this.pipeState.isSolved = true;
        this.pipeState.isFlowing = true;

        root.FarmAudio.playWaterFlow();

        // Animate flowing water in pipes
        document.querySelectorAll('.pipe-fluid-channel').forEach(el => {
          el.classList.add('water-active');
        });

        // Trigger Cow drinking reaction
        const cowStatus = document.getElementById('cowReactionBox');
        if (cowStatus) {
          cowStatus.innerHTML = `
            <div class="animal-speech-bubble bounce-in">
              "Moooo! Thank you! Fresh clean water is so delicious!" 💧💖
            </div>
            <div class="cow-avatar is-drinking">
              <span style="font-size: 5rem;">🐄</span>
              <div class="water-splash-particles">💦 💧 💦</div>
            </div>
          `;
        }

        root.FarmAudio.playCowMoo();
        root.FarmAudio.speakPhrase("The cow needs water. It gives water to the cow. It helps the cow!");

        setTimeout(() => {
          root.FarmEngine.completeMission(1);
        }, 1600);
      }
    },

    // -----------------------------------------------------------------------
    // MISSION 2: SMART CHICKEN HOUSE (CLIMATE CONTROL)
    // -----------------------------------------------------------------------
    climateState: {
      temp: 12,
      heater: false,
      light: false,
      fan: false,
      door: false,
      comfortTimer: null,
      isSolved: false
    },

    initClimateGame: function() {
      this.climateState.temp = 12;
      this.climateState.heater = false;
      this.climateState.light = false;
      this.climateState.fan = false;
      this.climateState.door = false;
      this.climateState.isSolved = false;

      this.updateClimateUI();
    },

    toggleClimateDevice: function(device) {
      if (this.climateState.isSolved) return;

      this.climateState[device] = !this.climateState[device];
      root.FarmAudio.playTap();

      // Recalculate temperature based on active smart devices:
      // Base: 12°C (chilly night)
      // + Heater: +10°C
      // + Heat Light: +5°C
      // - Fan: -6°C
      // - Open Door: -3°C (cool night draft)
      let calculatedTemp = 12;
      if (this.climateState.heater) calculatedTemp += 10;
      if (this.climateState.light) calculatedTemp += 5;
      if (this.climateState.fan) calculatedTemp -= 6;
      if (this.climateState.door) calculatedTemp -= 3;

      this.climateState.temp = calculatedTemp;
      this.updateClimateUI();
      this.checkClimateComfort();
    },

    updateClimateUI: function() {
      const tempDisplay = document.getElementById('coopTempDisplay');
      const gaugeBar = document.getElementById('coopTempGaugeBar');
      const chickenReact = document.getElementById('coopChickenDisplay');
      const statusText = document.getElementById('coopClimateStatus');

      // Update button toggles
      ['heater', 'light', 'fan', 'door'].forEach(d => {
        const btn = document.getElementById(`btnClimate-${d}`);
        if (btn) {
          btn.classList.toggle('device-active', this.climateState[d]);
          const stateSpan = btn.querySelector('.toggle-state');
          if (stateSpan) {
            stateSpan.textContent = this.climateState[d] ? 'ON' : 'OFF';
          }
        }
      });

      const t = this.climateState.temp;
      if (tempDisplay) tempDisplay.textContent = `${t}°C`;

      if (gaugeBar) {
        // Map 0°C - 40°C to 0% - 100%
        const pct = Math.min(100, Math.max(5, (t / 40) * 100));
        gaugeBar.style.width = `${pct}%`;
        gaugeBar.style.background = t < 19 ? '#38bdf8' : (t > 26 ? '#ef4444' : '#10b981');
      }

      // Check Chicken Reaction State
      if (t < 19) {
        // Cold state
        if (statusText) statusText.innerHTML = `<span style="color:#38bdf8;">❄️ It is too COLD! (${t}°C)</span> — The chicken is shivering!`;
        if (chickenReact) {
          chickenReact.innerHTML = `
            <div class="chicken-avatar is-shivering">
              <span style="font-size: 5rem;">🐔</span>
              <div class="cold-ice-particles">🧊 ❄️ 🥶</div>
            </div>
            <div class="coop-speech-bubble">"Brrr! Too cold! Please turn on the heater!"</div>
          `;
        }
      } else if (t > 26) {
        // Hot state
        if (statusText) statusText.innerHTML = `<span style="color:#ef4444;">🔥 It is too HOT! (${t}°C)</span> — The chicken is overheating!`;
        if (chickenReact) {
          chickenReact.innerHTML = `
            <div class="chicken-avatar is-sweating">
              <span style="font-size: 5rem;">🐔</span>
              <div class="hot-sweat-particles">🥵 💦 🔥</div>
            </div>
            <div class="coop-speech-bubble">"Phew! Too hot! Turn on the fan or open the door!"</div>
          `;
        }
      } else {
        // Ideal state (21°C - 25°C)
        if (statusText) statusText.innerHTML = `<span style="color:#10b981;">☀️ Perfect Temperature! (${t}°C)</span> — The chicken is warm and cozy!`;
        if (chickenReact) {
          chickenReact.innerHTML = `
            <div class="chicken-avatar is-happy">
              <span style="font-size: 5.5rem;">🐔</span>
              <div class="happy-heart-particles">💖 ✨ 🌾</div>
            </div>
            <div class="coop-speech-bubble bounce-in">"Cluck-cluck! Wonderful! Warm and comfortable!"</div>
          `;
        }
      }
    },

    checkClimateComfort: function() {
      const t = this.climateState.temp;
      if (t >= 21 && t <= 25 && !this.climateState.isSolved) {
        this.climateState.isSolved = true;
        root.FarmAudio.playChickenCluck();
        root.FarmAudio.speakPhrase("The chicken is warm. It is not cold. Great job!");

        setTimeout(() => {
          root.FarmEngine.completeMission(2);
        }, 1500);
      }
    },

    // -----------------------------------------------------------------------
    // MISSION 3: ROBOT BOX SEQUENCER
    // -----------------------------------------------------------------------
    robotState: {
      program: [], // array of actions: 'go', 'pickup', 'carry', 'stop'
      isRunning: false,
      robotCol: 0,
      hasBox: false,
      boxCol: 2,
      isSolved: false
    },

    initRobotGame: function() {
      this.robotState.program = [];
      this.robotState.isRunning = false;
      this.robotState.robotCol = 0;
      this.robotState.hasBox = false;
      this.robotState.boxCol = 2;
      this.robotState.isSolved = false;

      this.renderRobotTrack();
      this.renderProgramSlots();
    },

    renderRobotTrack: function() {
      const track = document.getElementById('robotRunwayTrack');
      if (!track) return;

      const cells = [
        { col: 0, label: 'START 🚩' },
        { col: 1, label: 'TRACK 🛣️' },
        { col: 2, label: 'GRAIN BOX 📦' },
        { col: 3, label: 'TRACK 🛣️' },
        { col: 4, label: 'BARN DEPOT 🏠' }
      ];

      track.innerHTML = cells.map(c => {
        const isRobotHere = this.robotState.robotCol === c.col;
        const isBoxHere = !this.robotState.hasBox && this.robotState.boxCol === c.col;
        const isTarget = c.col === 4;

        return `
          <div class="runway-cell ${isTarget ? 'target-cell' : ''}" id="cell-${c.col}">
            <div class="cell-label">${c.label}</div>
            <div class="cell-entity-layer">
              ${isRobotHere ? `
                <div class="robot-sprite ${this.robotState.hasBox ? 'carrying' : ''}">
                  <span style="font-size:3.5rem;">🤖</span>
                  ${this.robotState.hasBox ? '<span class="robot-carried-box">📦</span>' : ''}
                </div>
              ` : ''}
              ${isBoxHere ? `
                <div class="box-sprite">📦</div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    },

    addCommandToProgram: function(action) {
      if (this.robotState.isRunning || this.robotState.program.length >= 4) return;
      this.robotState.program.push(action);
      root.FarmAudio.playTap();
      this.renderProgramSlots();
    },

    clearProgram: function() {
      if (this.robotState.isRunning) return;
      this.robotState.program = [];
      root.FarmAudio.playTap();
      this.renderProgramSlots();
      this.renderRobotTrack();
    },

    renderProgramSlots: function() {
      const slots = document.getElementById('programSlotsRow');
      if (!slots) return;

      const maxSlots = 4;
      let html = '';
      for (let i = 0; i < maxSlots; i++) {
        const action = this.robotState.program[i];
        if (action) {
          const info = root.SMART_FARM_DATA.robotGame.availableBlocks.find(b => b.action === action);
          html += `
            <div class="program-block is-filled" id="progSlot-${i}">
              <span class="block-icon">${info ? info.icon : '⚙️'}</span>
              <span class="block-text">${info ? info.label : action}</span>
            </div>
          `;
        } else {
          html += `
            <div class="program-block is-empty" id="progSlot-${i}">
              <span>Step ${i + 1}</span>
            </div>
          `;
        }
      }
      slots.innerHTML = html;
    },

    executeProgram: function() {
      if (this.robotState.isRunning) return;
      if (this.robotState.program.length < 4) {
        alert("Please add 4 command blocks in order: GO ➔ PICK UP ➔ CARRY ➔ STOP!");
        return;
      }

      this.robotState.isRunning = true;
      this.robotState.robotCol = 0;
      this.robotState.hasBox = false;
      this.renderRobotTrack();

      const sequence = [...this.robotState.program];
      let stepIndex = 0;

      const runNextStep = () => {
        if (stepIndex >= sequence.length) {
          // Check outcome
          if (this.robotState.robotCol === 4 && this.robotState.hasBox === false && this.robotState.boxCol === 4) {
            // Victory
            this.robotState.isSolved = true;
            this.robotState.isRunning = false;
            root.FarmAudio.playVictoryFanfare();
            root.FarmAudio.speakPhrase("The robot carries the box. Great programming!");
            setTimeout(() => {
              root.FarmEngine.completeMission(3);
            }, 1200);
          } else {
            // Soft fail
            this.robotState.isRunning = false;
            root.FarmAudio.speakPhrase("Remember: Go to the box, pick up, carry to the barn, and stop!");
            const hint = document.getElementById('robotProgramHint');
            if (hint) {
              hint.innerHTML = "💡 <strong>Hint:</strong> 1. GO ➔ 2. PICK UP ➔ 3. CARRY ➔ 4. STOP";
              hint.style.display = 'block';
            }
          }
          return;
        }

        const action = sequence[stepIndex];

        // Highlight active block
        document.querySelectorAll('.program-block').forEach((el, idx) => {
          el.classList.toggle('is-executing', idx === stepIndex);
        });

        // Execute action
        if (action === 'go') {
          root.FarmAudio.playRobotServo();
          this.robotState.robotCol = 2; // move to box
          this.renderRobotTrack();
        } else if (action === 'pickup') {
          if (this.robotState.robotCol === 2) {
            root.FarmAudio.playBoxThud();
            this.robotState.hasBox = true;
            this.renderRobotTrack();
          }
        } else if (action === 'carry') {
          if (this.robotState.hasBox) {
            root.FarmAudio.playRobotServo();
            this.robotState.robotCol = 4; // move to barn
            this.renderRobotTrack();
          }
        } else if (action === 'stop') {
          root.FarmAudio.playBoxThud();
          if (this.robotState.hasBox && this.robotState.robotCol === 4) {
            this.robotState.hasBox = false;
            this.robotState.boxCol = 4;
            this.renderRobotTrack();
          }
        }

        stepIndex++;
        setTimeout(runNextStep, 900);
      };

      runNextStep();
    },

    // -----------------------------------------------------------------------
    // MISSION 4: INVENTOR LAB WORKBENCH & TELEPROMPTER
    // -----------------------------------------------------------------------
    labState: {
      selectedBody: 'b-crawler',
      selectedPower: 'p-solar',
      selectedTool: 't-water',
      selectedRecipient: 'r-cow',
      isSpeaking: false
    },

    initInventorLab: function() {
      this.renderPartPickers();
      this.updateAssembledPreview();
      this.updateTeleprompterScript();
    },

    renderPartPickers: function() {
      const catalog = root.SMART_FARM_DATA.inventionCatalog;

      // Bodies
      const bodiesEl = document.getElementById('pickerBodiesList');
      if (bodiesEl) {
        bodiesEl.innerHTML = catalog.bodies.map(b => `
          <button type="button" class="part-select-btn ${this.labState.selectedBody === b.id ? 'is-selected' : ''}" onclick="MiniGames.selectPart('selectedBody', '${b.id}')">
            <span class="part-icon">${b.icon}</span>
            <span class="part-name">${b.name}</span>
          </button>
        `).join('');
      }

      // Powers
      const powersEl = document.getElementById('pickerPowersList');
      if (powersEl) {
        powersEl.innerHTML = catalog.powers.map(p => `
          <button type="button" class="part-select-btn ${this.labState.selectedPower === p.id ? 'is-selected' : ''}" onclick="MiniGames.selectPart('selectedPower', '${p.id}')">
            <span class="part-icon">${p.icon}</span>
            <span class="part-name">${p.name}</span>
          </button>
        `).join('');
      }

      // Tools
      const toolsEl = document.getElementById('pickerToolsList');
      if (toolsEl) {
        toolsEl.innerHTML = catalog.tools.map(t => `
          <button type="button" class="part-select-btn ${this.labState.selectedTool === t.id ? 'is-selected' : ''}" onclick="MiniGames.selectPart('selectedTool', '${t.id}')">
            <span class="part-icon">${t.icon}</span>
            <span class="part-name">${t.name}</span>
          </button>
        `).join('');
      }

      // Recipients
      const recsEl = document.getElementById('pickerRecipientsList');
      if (recsEl) {
        recsEl.innerHTML = catalog.recipients.map(r => `
          <button type="button" class="part-select-btn ${this.labState.selectedRecipient === r.id ? 'is-selected' : ''}" onclick="MiniGames.selectPart('selectedRecipient', '${r.id}')">
            <span class="part-icon">${r.icon}</span>
            <span class="part-name">${r.name}</span>
          </button>
        `).join('');
      }
    },

    selectPart: function(category, partId) {
      this.labState[category] = partId;
      root.FarmAudio.playPartEquipped();
      this.renderPartPickers();
      this.updateAssembledPreview();
      this.updateTeleprompterScript();
    },

    updateAssembledPreview: function() {
      const catalog = root.SMART_FARM_DATA.inventionCatalog;
      const body = catalog.bodies.find(b => b.id === this.labState.selectedBody);
      const power = catalog.powers.find(p => p.id === this.labState.selectedPower);
      const tool = catalog.tools.find(t => t.id === this.labState.selectedTool);
      const animal = catalog.recipients.find(r => r.id === this.labState.selectedRecipient);

      const previewBox = document.getElementById('assembledMachineDisplay');
      if (!previewBox) return;

      previewBox.innerHTML = `
        <div class="assembled-stage">
          <!-- Power Aura Glow -->
          <div class="power-aura" style="background: ${power ? power.color : '#38bdf8'};"></div>
          
          <!-- Assembled 3D Composite Illustration -->
          <div class="machine-chassis-model">
            <div class="power-attachment bounce-slow">${power ? power.icon : '☀️'}</div>
            <div class="chassis-core">${body ? body.icon : '🚜'}</div>
            <div class="tool-arm wiggle-slow">${tool ? tool.icon : '💧'}</div>
          </div>

          <!-- Animal Friend Recipient Next to Machine -->
          <div class="recipient-companion">
            <span style="font-size: 3.5rem;">${animal ? animal.icon : '🐄'}</span>
            <span class="heart-pulse">💖</span>
          </div>

          <!-- Machine Name Badge -->
          <div class="machine-identity-badge">
            <h4>${body ? body.name : 'Super Invertor'} 3000</h4>
            <span class="badge-power">${power ? power.name : 'Solar'} • ${tool ? tool.actionWord : 'Helps'}</span>
          </div>
        </div>
      `;
    },

    updateTeleprompterScript: function() {
      const catalog = root.SMART_FARM_DATA.inventionCatalog;
      const body = catalog.bodies.find(b => b.id === this.labState.selectedBody);
      const power = catalog.powers.find(p => p.id === this.labState.selectedPower);
      const tool = catalog.tools.find(t => t.id === this.labState.selectedTool);
      const animal = catalog.recipients.find(r => r.id === this.labState.selectedRecipient);

      const s1 = `This is my invention.`;
      const s2 = `It is a ${body ? body.name : 'smart machine'} with ${power ? power.name : 'clean power'}.`;
      const s3 = `It ${tool ? tool.actionWord : 'helps'}.`;
      const s4 = `It helps ${animal ? animal.name : 'the farm'}!`;

      const line1 = document.getElementById('tpLine1');
      const line2 = document.getElementById('tpLine2');
      const line3 = document.getElementById('tpLine3');
      const line4 = document.getElementById('tpLine4');

      if (line1) line1.innerHTML = this.wrapWords(s1);
      if (line2) line2.innerHTML = this.wrapWords(s2);
      if (line3) line3.innerHTML = this.wrapWords(s3);
      if (line4) line4.innerHTML = this.wrapWords(s4);
    },

    wrapWords: function(sentence) {
      return sentence.split(' ').map(w => `<span class="tele-word">${w}</span>`).join(' ');
    },

    readPresentationKaraoke: function() {
      if (this.labState.isSpeaking) return;

      const words = Array.from(document.querySelectorAll('.tele-word'));
      if (words.length === 0) return;

      this.labState.isSpeaking = true;
      const fullText = words.map(w => w.textContent).join(' ');

      const btn = document.getElementById('btnPresentSpeech');
      if (btn) btn.innerHTML = '<span>🔊</span> <span>Speaking Speech...</span>';

      let currentWordIndex = 0;
      root.FarmAudio.speakPhrase(
        fullText,
        () => {
          if (currentWordIndex < words.length) {
            words.forEach(w => w.classList.remove('word-glow'));
            words[currentWordIndex].classList.add('word-glow');
            currentWordIndex++;
          }
        },
        () => {
          this.labState.isSpeaking = false;
          words.forEach(w => w.classList.remove('word-glow'));
          if (btn) btn.innerHTML = '<span>🎙️</span> <span>Replay Presentation</span>';
          root.FarmAudio.playVictoryFanfare();
        }
      );
    }
  };

  root.MiniGames = MiniGames;

})(typeof window !== 'undefined' ? window : global);
