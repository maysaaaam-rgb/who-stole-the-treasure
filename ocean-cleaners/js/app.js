/**
 * ECO-ENGINEERS: OCEAN CLEANERS & REEF RESCUE — GAME CONTROLLER
 * 3-Phase Interactive Loop • 60-30-10 Cyber-Glassmorphism • Tactile 3D Physics
 */
(function() {
  'use strict';

  const DATA = window.OCEAN_DATA;
  const audio = window.oceanAudio;

  if (!DATA) {
    console.error('OCEAN_DATA not found. Ensure js/data.js is loaded.');
    return;
  }

  // State Management
  const state = {
    currentPhase: 1,
    selectedMachineIdx: 0,
    discoveredMachines: new Set(),
    caredMachines: {}, // { 'solar-skimmer': { currentTask: 0, battery: 20, completed: false } }
    broadcastedMachines: new Set(),
    totalXP: 0,
    streak: 0,
    isBroadcasting: false
  };

  // Initialize machine care states
  DATA.machines.forEach(m => {
    state.caredMachines[m.id] = {
      currentTask: 0,
      battery: 20,
      completed: false
    };
  });

  // Confetti Particle Engine (Zero external dependencies)
  class ConfettiEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.animId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 55) {
      if (!this.ctx) return;
      const colors = ['#38bdf8', '#10b981', '#f59e0b', '#f43f5e', '#a855f7', '#34d399'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 12,
          gravity: 0.22,
          opacity: 1
        });
      }
      if (!this.animId) {
        this.loop();
      }
    }

    loop() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.014;

        if (p.opacity <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = p.opacity;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.loop());
      } else {
        this.animId = null;
      }
    }
  }

  let confetti = null;

  // DOM Elements
  const el = {
    xpDisplay: document.getElementById('hud-xp-val'),
    streakDisplay: document.getElementById('hud-streak-val'),
    batteryDisplay: document.getElementById('hud-battery-val'),
    btnMute: document.getElementById('btn-mute-toggle'),
    btnFullscreen: document.getElementById('btn-fullscreen-toggle'),
    phaseTabs: document.querySelectorAll('.phase-tab'),
    phaseViews: document.querySelectorAll('.phase-view'),
    radarGrid: document.getElementById('radar-grid'),
    // Phase 2 Workbench
    wbMachineBtns: document.getElementById('wb-machine-btns'),
    focalStage: document.getElementById('focal-stage'),
    wbBatteryFill: document.getElementById('wb-battery-fill'),
    wbBatteryVal: document.getElementById('wb-battery-val'),
    wbTaskStep: document.getElementById('wb-task-step'),
    wbPromptBox: document.getElementById('wb-prompt-box'),
    wbSentenceDisplay: document.getElementById('wb-sentence-display'),
    wbOptionsGrid: document.getElementById('wb-options-grid'),
    wbClueBox: document.getElementById('wb-clue-box'),
    // Phase 3 Teleprompter
    tpMachineBtns: document.getElementById('tp-machine-btns'),
    tpFocalStage: document.getElementById('tp-focal-stage'),
    tpBroadcastBtn: document.getElementById('tp-broadcast-btn'),
    tpTeleprompterBox: document.getElementById('tp-teleprompter-box'),
    tpOnAirBadge: document.getElementById('tp-on-air-badge'),
    // Modal
    victoryModal: document.getElementById('victory-modal'),
    modalFinalXP: document.getElementById('modal-final-xp'),
    btnReplay: document.getElementById('btn-replay-game'),
    btnModalClose: document.getElementById('btn-modal-close')
  };

  // Bridge XP to school store if available
  function awardXP(amount) {
    state.totalXP += amount;
    if (el.xpDisplay) {
      el.xpDisplay.textContent = state.totalXP;
    }
    try {
      const store = window.schoolStore || (window.parent && window.parent.schoolStore);
      if (store && typeof store.addXP === 'function') {
        store.addXP(amount, 'Eco-Engineers Ocean Lab');
      }
    } catch (e) {
      // safe fallback
    }
  }

  function setStreak(num) {
    state.streak = num;
    if (el.streakDisplay) {
      el.streakDisplay.textContent = state.streak;
    }
  }

  // Switch Phase Tab
  function switchPhase(phaseNum) {
    if (state.isBroadcasting) return;
    audio.initCtx();
    state.currentPhase = phaseNum;

    el.phaseTabs.forEach(tab => {
      const p = parseInt(tab.dataset.phase, 10);
      tab.classList.toggle('active', p === phaseNum);
    });

    el.phaseViews.forEach(view => {
      const p = parseInt(view.dataset.phase, 10);
      view.classList.toggle('active-view', p === phaseNum);
    });

    if (phaseNum === 2) {
      renderWorkbench();
    } else if (phaseNum === 3) {
      renderTeleprompter();
    }
  }

  /* ==========================================================================
     PHASE 1: INPUT & DISCOVERY RADAR SCANNER
     ========================================================================== */
  function renderRadarScanner() {
    if (!el.radarGrid) return;
    el.radarGrid.innerHTML = '';

    DATA.machines.forEach((machine, idx) => {
      const cardWrap = document.createElement('div');
      cardWrap.className = 'machine-card-wrap';
      cardWrap.dataset.id = machine.id;

      cardWrap.innerHTML = `
        <div class="machine-card-inner">
          <!-- FRONT FACE (65/35 Full-Bleed Rule) -->
          <div class="card-face card-front" style="border-color: ${machine.borderColor};">
            <div class="card-art-hero">
              <div class="card-badge-top" style="background: ${machine.badgeBg}; color: ${machine.accentColor};">
                <span>${machine.habitatIcon}</span>
                <span>${machine.element}</span>
              </div>
              <div class="card-xp-tag">+10 XP</div>
              <div class="machine-sprite-container">
                ${machine.svg}
              </div>
              <div class="pedestal-disk" style="background: radial-gradient(ellipse at center, ${machine.accentColor}70 0%, ${machine.accentColor}20 45%, transparent 70%);"></div>
            </div>
            <div class="card-caption-tray">
              <div class="card-machine-name">
                <span>${machine.name}</span>
                <span style="font-size: 1.1rem;">${machine.habitatIcon}</span>
              </div>
              <div class="card-formula-snippet">
                "The ${machine.name} helps to ${machine.action}."
              </div>
              <div class="card-flip-prompt">
                <span>🔄 Click to Inspect Radar</span>
              </div>
            </div>
          </div>

          <!-- BACK FACE (Technical Dossier) -->
          <div class="card-face card-back">
            <div>
              <div class="back-header">
                <div class="back-title" style="color: ${machine.accentColor};">${machine.name}</div>
                <div class="back-species">${machine.type} • Target: ${machine.habitatName}</div>
              </div>
              <div class="back-fact-list">
                <div class="back-fact-item">
                  <strong>Engineering:</strong>
                  <span>${machine.discoveryFacts.featureFact}</span>
                </div>
                <div class="back-fact-item">
                  <strong>Mission:</strong>
                  <span>${machine.discoveryFacts.missionFact}</span>
                </div>
                <div class="back-fact-item">
                  <strong>Habitat:</strong>
                  <span>${machine.discoveryFacts.habitatFact}</span>
                </div>
              </div>
            </div>
            <button class="btn-3d btn-cyan back-footer-btn" data-target="${idx}">
              <span>🛠️ Enter Mission Workbench</span>
            </button>
          </div>
        </div>
      `;

      cardWrap.addEventListener('click', (e) => {
        if (e.target.closest('.back-footer-btn')) {
          e.stopPropagation();
          state.selectedMachineIdx = idx;
          switchPhase(2);
          return;
        }

        audio.initCtx();
        audio.playSnap();
        cardWrap.classList.toggle('flipped');

        if (!state.discoveredMachines.has(machine.id)) {
          state.discoveredMachines.add(machine.id);
          awardXP(10);
          audio.playXP();
          confetti.burst(e.clientX, e.clientY, 35);
          audio.speakText(machine.speechIntro);

          if (state.discoveredMachines.size === DATA.machines.length) {
            const p1Tab = document.querySelector('.phase-tab[data-phase="1"]');
            if (p1Tab) p1Tab.classList.add('completed');
          }
        }
      });

      el.radarGrid.appendChild(cardWrap);
    });
  }

  /* ==========================================================================
     PHASE 2: TACTILE WORKBENCH & CHALLENGE LAB
     ========================================================================== */
  function renderWorkbench() {
    const machine = DATA.machines[state.selectedMachineIdx];
    const careState = state.caredMachines[machine.id];

    // Render machine selector buttons
    if (el.wbMachineBtns) {
      el.wbMachineBtns.innerHTML = '';
      DATA.machines.forEach((m, idx) => {
        const btn = document.createElement('button');
        btn.className = `selector-mini-btn ${idx === state.selectedMachineIdx ? 'active' : ''}`;
        const doneBadge = state.caredMachines[m.id].completed ? ' ⭐' : '';
        btn.innerHTML = `
          <span style="font-size: 1.3rem;">${m.habitatIcon}</span>
          <span>${m.name.split(' ')[0]}${doneBadge}</span>
        `;
        btn.addEventListener('click', () => {
          audio.playSnap();
          state.selectedMachineIdx = idx;
          renderWorkbench();
        });
        el.wbMachineBtns.appendChild(btn);
      });
    }

    // Focal machine stage
    if (el.focalStage) {
      el.focalStage.innerHTML = `
        <div class="focal-sprite-wrap">
          ${machine.svg}
        </div>
        <div class="pedestal-disk" style="background: radial-gradient(ellipse at center, ${machine.accentColor}70 0%, ${machine.accentColor}20 45%, transparent 70%);"></div>
        <div class="stamp-overlay" id="stamp-overlay">
          <div class="rubber-stamp">APPROVED! ⭐</div>
        </div>
      `;
    }

    // Update Battery Meter
    if (el.wbBatteryFill && el.wbBatteryVal) {
      el.wbBatteryFill.style.width = `${careState.battery}%`;
      el.wbBatteryVal.textContent = `${careState.battery}%`;
      if (el.batteryDisplay) {
        el.batteryDisplay.textContent = `${careState.battery}%`;
      }
    }

    // Check if tasks are completed for this machine
    const currentTask = machine.workbenchTasks[careState.currentTask];

    if (!currentTask || careState.completed) {
      if (el.wbTaskStep) el.wbTaskStep.textContent = 'SYSTEMS ONLINE • 100% BATTERY CHARGE';
      if (el.wbPromptBox) {
        el.wbPromptBox.innerHTML = `
          <div style="color: var(--emerald-primary); font-size: 1.4rem; font-weight: 800; text-align: center; padding: 10px;">
            🎉 The ${machine.name} is fully powered and ready to protect the ${machine.habitatName}!
          </div>
        `;
      }
      if (el.wbSentenceDisplay) {
        el.wbSentenceDisplay.innerHTML = `
          <span>"The ${machine.name} helps to ${machine.action}."</span><br>
          <span style="color: var(--cyan-primary); font-size: 1.15rem;">"We must protect the ${machine.habitatName}."</span>
        `;
      }
      if (el.wbOptionsGrid) {
        el.wbOptionsGrid.innerHTML = `
          <button class="btn-3d btn-cyan" id="btn-next-to-teleprompter" style="padding: 16px;">
            🎙️ Go to Teleprompter Studio to Broadcast Report
          </button>
        `;
        document.getElementById('btn-next-to-teleprompter').addEventListener('click', () => {
          switchPhase(3);
        });
      }
      if (el.wbClueBox) el.wbClueBox.style.display = 'none';
      return;
    }

    // Render active question
    if (el.wbTaskStep) {
      el.wbTaskStep.textContent = `MISSION ${careState.currentTask + 1} OF ${machine.workbenchTasks.length} • TARGET: ${machine.name.toUpperCase()}`;
    }

    if (el.wbPromptBox) {
      el.wbPromptBox.textContent = currentTask.prompt;
    }

    if (el.wbSentenceDisplay) {
      el.wbSentenceDisplay.innerHTML = `
        ${currentTask.sentencePre}<span class="sentence-blank-slot">? ? ?</span>${currentTask.sentencePost}
      `;
    }

    if (el.wbClueBox) {
      el.wbClueBox.style.display = 'none';
    }

    // Render 3D option buttons
    if (el.wbOptionsGrid) {
      el.wbOptionsGrid.innerHTML = '';
      currentTask.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'btn-3d btn-ghost workbench-option-btn';
        btn.innerHTML = `
          <span>${opt.text}</span>
          <span class="option-hint">Tactile Action ➔</span>
        `;

        btn.addEventListener('click', () => {
          handleWorkbenchChoice(opt, currentTask, machine, careState, btn);
        });

        el.wbOptionsGrid.appendChild(btn);
      });
    }
  }

  function handleWorkbenchChoice(option, task, machine, careState, btnElement) {
    audio.initCtx();

    if (option.correct) {
      const allBtns = el.wbOptionsGrid.querySelectorAll('button');
      allBtns.forEach(b => b.disabled = true);

      // Rubber stamp slam animation
      const stampOverlay = document.getElementById('stamp-overlay');
      if (stampOverlay) {
        stampOverlay.classList.remove('active-stamp');
        void stampOverlay.offsetWidth;
        stampOverlay.classList.add('active-stamp');
      }

      audio.playStampSlam();
      audio.playXP();
      confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 45);

      if (el.wbSentenceDisplay) {
        el.wbSentenceDisplay.innerHTML = `
          ${task.sentencePre}<span class="sentence-blank-slot" style="background: rgba(16, 185, 129, 0.2); color: var(--emerald-primary); border-color: var(--emerald-primary);">${option.text}</span>${task.sentencePost}
        `;
      }

      // State updates
      awardXP(15);
      setStreak(state.streak + 1);
      careState.battery = Math.min(100, careState.battery + 27);
      if (careState.currentTask === 2) careState.battery = 100;
      careState.currentTask += 1;

      audio.speakText(task.explanation);

      setTimeout(() => {
        if (careState.currentTask >= machine.workbenchTasks.length) {
          careState.completed = true;
          const allDone = DATA.machines.every(m => state.caredMachines[m.id].completed);
          if (allDone) {
            const p2Tab = document.querySelector('.phase-tab[data-phase="2"]');
            if (p2Tab) p2Tab.classList.add('completed');
          }
        }
        renderWorkbench();
      }, 1600);

    } else {
      // Soft-Fail Architecture
      btnElement.classList.add('elastic-wobble');
      setTimeout(() => btnElement.classList.remove('elastic-wobble'), 400);

      audio.playSoftFail();

      if (el.wbClueBox) {
        el.wbClueBox.style.display = 'flex';
        el.wbClueBox.innerHTML = `
          <span class="spoken-clue-icon">💡</span>
          <div>
            <strong>Eco-Clue:</strong> ${option.hint}
          </div>
        `;
      }
      audio.speakText(option.hint);
    }
  }

  /* ==========================================================================
     PHASE 3: LIVE TELEPROMPTER STUDIO
     ========================================================================== */
  function renderTeleprompter() {
    const machine = DATA.machines[state.selectedMachineIdx];

    if (el.tpMachineBtns) {
      el.tpMachineBtns.innerHTML = '';
      DATA.machines.forEach((m, idx) => {
        const btn = document.createElement('button');
        btn.className = `selector-mini-btn ${idx === state.selectedMachineIdx ? 'active' : ''}`;
        const isDone = state.broadcastedMachines.has(m.id);
        btn.innerHTML = `
          <span style="font-size: 1.3rem;">${m.habitatIcon}</span>
          <span>${m.name.split(' ')[0]}${isDone ? ' 🏆' : ''}</span>
        `;
        btn.addEventListener('click', () => {
          if (state.isBroadcasting) return;
          audio.playSnap();
          state.selectedMachineIdx = idx;
          renderTeleprompter();
        });
        el.tpMachineBtns.appendChild(btn);
      });
    }

    if (el.tpFocalStage) {
      el.tpFocalStage.innerHTML = `
        <div class="focal-sprite-wrap" style="width: 170px; height: 170px;">
          ${machine.svg}
        </div>
        <div class="pedestal-disk" style="background: radial-gradient(ellipse at center, ${machine.accentColor}70 0%, ${machine.accentColor}20 45%, transparent 70%);"></div>
      `;
    }

    if (el.tpTeleprompterBox) {
      el.tpTeleprompterBox.innerHTML = '';
      machine.teleprompter.forEach((sentence, lineIdx) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'teleprompter-line';
        lineDiv.id = `tp-line-${lineIdx}`;

        const words = sentence.split(' ');
        const wordSpans = words.map((w, wIdx) => `<span class="karaoke-word" id="kw-${lineIdx}-${wIdx}">${w}</span>`).join(' ');
        lineDiv.innerHTML = wordSpans;

        el.tpTeleprompterBox.appendChild(lineDiv);
      });
    }

    if (el.tpOnAirBadge) {
      el.tpOnAirBadge.classList.remove('broadcasting');
      el.tpOnAirBadge.innerHTML = '<span>🔴</span><span>OFF AIR • READY</span>';
    }

    if (el.tpBroadcastBtn) {
      el.tpBroadcastBtn.disabled = false;
      const isDone = state.broadcastedMachines.has(machine.id);
      el.tpBroadcastBtn.innerHTML = isDone ? '<span>🎙️ Broadcast Again (+10 XP)</span>' : '<span>🎙️ Start Live Karaoke Broadcast (+30 XP)</span>';
      el.tpBroadcastBtn.onclick = () => runTeleprompterBroadcast(machine);
    }
  }

  function runTeleprompterBroadcast(machine) {
    if (state.isBroadcasting) return;
    audio.initCtx();
    state.isBroadcasting = true;

    if (el.tpBroadcastBtn) el.tpBroadcastBtn.disabled = true;
    if (el.tpOnAirBadge) {
      el.tpOnAirBadge.classList.add('broadcasting');
      el.tpOnAirBadge.innerHTML = '<span>📡</span><span>ON AIR • LIVE BROADCAST</span>';
    }

    const sentences = machine.teleprompter;
    let currentLine = 0;

    function playLine() {
      if (currentLine >= sentences.length) {
        finishBroadcast(machine);
        return;
      }

      document.querySelectorAll('.teleprompter-line').forEach((l, idx) => {
        l.classList.toggle('active-sentence', idx === currentLine);
      });

      const lineText = sentences[currentLine];
      const words = lineText.split(' ');
      let currentWordIdx = 0;

      audio.speakText(
        lineText,
        () => {
          document.querySelectorAll(`#tp-line-${currentLine} .karaoke-word`).forEach((w, idx) => {
            w.classList.toggle('highlight-word', idx === currentWordIdx);
          });
          currentWordIdx++;
        },
        () => {
          setTimeout(() => {
            document.querySelectorAll(`#tp-line-${currentLine} .karaoke-word`).forEach(w => {
              w.classList.remove('highlight-word');
            });
            currentLine++;
            playLine();
          }, 350);
        }
      );
    }

    playLine();
  }

  function finishBroadcast(machine) {
    state.isBroadcasting = false;
    audio.playFanfare();
    confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);

    const isFirstTime = !state.broadcastedMachines.has(machine.id);
    state.broadcastedMachines.add(machine.id);
    awardXP(isFirstTime ? 30 : 10);
    setStreak(state.streak + 1);

    if (el.tpOnAirBadge) {
      el.tpOnAirBadge.classList.remove('broadcasting');
      el.tpOnAirBadge.innerHTML = '<span>🏆</span><span>BROADCAST SUCCESSFUL!</span>';
    }

    if (el.tpBroadcastBtn) {
      el.tpBroadcastBtn.disabled = false;
      el.tpBroadcastBtn.innerHTML = '<span>✅ Broadcast Completed</span>';
    }

    if (state.broadcastedMachines.size === DATA.machines.length) {
      const p3Tab = document.querySelector('.phase-tab[data-phase="3"]');
      if (p3Tab) p3Tab.classList.add('completed');
      setTimeout(() => {
        showVictoryModal();
      }, 1400);
    } else {
      renderTeleprompter();
    }
  }

  /* ==========================================================================
     VICTORY MODAL
     ========================================================================== */
  function showVictoryModal() {
    if (el.modalFinalXP) {
      el.modalFinalXP.textContent = `${state.totalXP} XP`;
    }
    if (el.victoryModal) {
      el.victoryModal.classList.add('active-modal');
    }
    audio.playFanfare();
    confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 100);
  }

  function hideVictoryModal() {
    if (el.victoryModal) {
      el.victoryModal.classList.remove('active-modal');
    }
  }

  /* ==========================================================================
     INITIALIZATION & EVENT BINDINGS
     ========================================================================== */
  function init() {
    confetti = new ConfettiEngine('confetti-canvas');

    if (el.btnMute) {
      el.btnMute.addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        el.btnMute.innerHTML = isMuted ? '<span>🔇</span> Unmute' : '<span>🔊</span> Sound';
      });
    }

    if (el.btnFullscreen) {
      el.btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          el.btnFullscreen.innerHTML = '<span>🗗</span> Exit';
        } else {
          document.exitFullscreen().catch(() => {});
          el.btnFullscreen.innerHTML = '<span>📺</span> Screen';
        }
      });
    }

    el.phaseTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const phase = parseInt(tab.dataset.phase, 10);
        switchPhase(phase);
      });
    });

    if (el.btnModalClose) {
      el.btnModalClose.addEventListener('click', hideVictoryModal);
    }

    if (el.btnReplay) {
      el.btnReplay.addEventListener('click', () => {
        hideVictoryModal();
        switchPhase(1);
      });
    }

    renderRadarScanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
