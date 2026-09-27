/**
 * DINO EXPEDITION: PREHISTORIC HABITATS — GAME CONTROLLER & STATE MACHINE
 * 3-Phase Interactive Loop • 60-30-10 Cyber-Glassmorphism • Tactile 3D Physics
 */
(function() {
  'use strict';

  const DATA = window.DINO_EXPEDITION_DATA;
  const audio = window.dinoExpeditionAudio;

  if (!DATA) {
    console.error('DINO_EXPEDITION_DATA not found. Ensure js/data.js is loaded.');
    return;
  }

  // Reactive playerSession State Architecture
  const playerSession = {
    currentPhase: 1,
    selectedDinoIdx: 0,
    discoveredDinos: new Set(),
    caredDinos: {}, // { 'trex': { currentTask: 0, energy: 25, completed: false } }
    broadcastedDinos: new Set(),
    totalXP: 0,
    streak: 0,
    isBroadcasting: false
  };

  // Initialize dinosaur care states
  DATA.dinosaurs.forEach(d => {
    playerSession.caredDinos[d.id] = {
      currentTask: 0,
      energy: 25,
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
      const colors = ['#10b981', '#34d399', '#f59e0b', '#38bdf8', '#ef4444', '#a855f7'];
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
    energyDisplay: document.getElementById('hud-energy-val'),
    btnMute: document.getElementById('btn-mute-toggle'),
    btnFullscreen: document.getElementById('btn-fullscreen-toggle'),
    phaseTabs: document.querySelectorAll('.phase-tab'),
    phaseViews: document.querySelectorAll('.phase-view'),
    radarGrid: document.getElementById('radar-grid'),
    // Phase 2 Workbench
    wbDinoBtns: document.getElementById('wb-dino-btns'),
    focalStage: document.getElementById('focal-stage'),
    wbEnergyFill: document.getElementById('wb-energy-fill'),
    wbEnergyVal: document.getElementById('wb-energy-val'),
    wbTaskStep: document.getElementById('wb-task-step'),
    wbPromptBox: document.getElementById('wb-prompt-box'),
    wbSentenceDisplay: document.getElementById('wb-sentence-display'),
    wbOptionsGrid: document.getElementById('wb-options-grid'),
    wbClueBox: document.getElementById('wb-clue-box'),
    // Phase 3 Teleprompter
    tpDinoBtns: document.getElementById('tp-dino-btns'),
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

  // Platform XP Routing
  function awardXP(amount) {
    playerSession.totalXP += amount;
    if (el.xpDisplay) {
      el.xpDisplay.textContent = playerSession.totalXP;
    }
    try {
      const store = window.schoolStore || (window.parent && window.parent.schoolStore);
      if (store && typeof store.addXP === 'function') {
        store.addXP(amount, 'Dino Expedition');
      }
    } catch (e) {
      // safe fallback
    }
  }

  function setStreak(num) {
    playerSession.streak = num;
    if (el.streakDisplay) {
      el.streakDisplay.textContent = playerSession.streak;
    }
  }

  // Switch Phase Tab
  function switchPhase(phaseNum) {
    if (playerSession.isBroadcasting) return;
    audio.initCtx();
    playerSession.currentPhase = phaseNum;

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
     PHASE 1: PREHISTORIC FIELD SCANNER (3D FLIP CARDS)
     65% Full-Bleed 3D Asset Rule • Isometric Pedestal • idleBob
     ========================================================================== */
  function renderRadarScanner() {
    if (!el.radarGrid) return;
    el.radarGrid.innerHTML = '';

    DATA.dinosaurs.forEach((dino, idx) => {
      const cardWrap = document.createElement('div');
      cardWrap.className = 'dino-card-wrap';
      cardWrap.dataset.id = dino.id;

      cardWrap.innerHTML = `
        <div class="dino-card-inner">
          <!-- FRONT FACE (65/35 Full-Bleed Rule) -->
          <div class="card-face card-front" style="border-color: ${dino.borderColor};">
            <div class="card-art-hero">
              <div class="card-badge-top" style="background: ${dino.dietBg}; color: ${dino.accentColor};">
                <span>${dino.dietBadge}</span>
              </div>
              <div class="card-xp-tag">+10 XP</div>
              <!-- Transparent 3D Character Model -->
              <div class="dino-sprite-container">
                <img src="${dino.imageSrc}" alt="${dino.name}" class="dino-raster-img" loading="eager" />
              </div>
              <div class="pedestal-disk" style="background: radial-gradient(ellipse at center, ${dino.accentColor}70 0%, ${dino.accentColor}20 45%, transparent 70%);"></div>
            </div>
            <div class="card-caption-tray">
              <div class="card-dino-name">
                <span>${dino.shortName}</span>
                <span style="font-size: 1.1rem;">${dino.habitatIcon}</span>
              </div>
              <div class="card-formula-snippet">
                "It lived in the ${dino.habitatName}."
              </div>
              <div class="card-flip-prompt">
                <span>🔄 Click to Inspect Dossier</span>
              </div>
            </div>
          </div>

          <!-- BACK FACE (Paleontologist Data Dossier) -->
          <div class="card-face card-back">
            <div>
              <div class="back-header">
                <div class="back-title" style="color: ${dino.accentColor};">${dino.name}</div>
                <div class="back-species">Weight: ${dino.weight} • Speed: ${dino.speed}</div>
              </div>
              <div class="back-fact-list">
                <div class="back-fact-item">
                  <strong>Anatomy:</strong>
                  <span>${dino.discoveryFacts.teethFact}</span>
                </div>
                <div class="back-fact-item">
                  <strong>Scale:</strong>
                  <span>${dino.discoveryFacts.weightFact}</span>
                </div>
                <div class="back-fact-item">
                  <strong>Mobility:</strong>
                  <span>${dino.discoveryFacts.speedFact}</span>
                </div>
              </div>
            </div>
            <button class="btn-3d btn-emerald back-footer-btn" data-target="${idx}">
              <span>⚡ Enter Adaptation Workbench</span>
            </button>
          </div>
        </div>
      `;

      cardWrap.addEventListener('click', (e) => {
        if (e.target.closest('.back-footer-btn')) {
          e.stopPropagation();
          playerSession.selectedDinoIdx = idx;
          switchPhase(2);
          return;
        }

        audio.initCtx();
        audio.playSnap();
        cardWrap.classList.toggle('flipped');

        if (!playerSession.discoveredDinos.has(dino.id)) {
          playerSession.discoveredDinos.add(dino.id);
          awardXP(10);
          audio.playXP();
          confetti.burst(e.clientX, e.clientY, 35);
          audio.speakText(dino.speechIntro);

          if (playerSession.discoveredDinos.size === DATA.dinosaurs.length) {
            const p1Tab = document.querySelector('.phase-tab[data-phase="1"]');
            if (p1Tab) p1Tab.classList.add('completed');
          }
        }
      });

      el.radarGrid.appendChild(cardWrap);
    });
  }

  /* ==========================================================================
     PHASE 2: HABITAT & ADAPTATION WORKBENCH
     ========================================================================== */
  function renderWorkbench() {
    const dino = DATA.dinosaurs[playerSession.selectedDinoIdx];
    const careState = playerSession.caredDinos[dino.id];

    // Render selector mini-buttons
    if (el.wbDinoBtns) {
      el.wbDinoBtns.innerHTML = '';
      DATA.dinosaurs.forEach((d, idx) => {
        const btn = document.createElement('button');
        btn.className = `selector-mini-btn ${idx === playerSession.selectedDinoIdx ? 'active' : ''}`;
        const doneBadge = playerSession.caredDinos[d.id].completed ? ' ⭐' : '';
        btn.innerHTML = `
          <span style="font-size: 1.25rem;">${d.habitatIcon}</span>
          <span>${d.shortName}${doneBadge}</span>
        `;
        btn.addEventListener('click', () => {
          audio.playSnap();
          playerSession.selectedDinoIdx = idx;
          renderWorkbench();
        });
        el.wbDinoBtns.appendChild(btn);
      });
    }

    // Focal stage with real transparent 3D raster asset
    if (el.focalStage) {
      el.focalStage.innerHTML = `
        <div class="focal-sprite-wrap">
          <img src="${dino.imageSrc}" alt="${dino.name}" class="dino-raster-img" />
        </div>
        <div class="pedestal-disk" style="background: radial-gradient(ellipse at center, ${dino.accentColor}70 0%, ${dino.accentColor}20 45%, transparent 70%);"></div>
        <div class="stamp-overlay" id="stamp-overlay">
          <div class="rubber-stamp">APPROVED! ⭐</div>
        </div>
      `;
    }

    // Update Energy Gauge
    if (el.wbEnergyFill && el.wbEnergyVal) {
      el.wbEnergyFill.style.width = `${careState.energy}%`;
      el.wbEnergyVal.textContent = `${careState.energy}%`;
      if (el.energyDisplay) {
        el.energyDisplay.textContent = `${careState.energy}%`;
      }
    }

    // Check if tasks completed
    const currentTask = dino.workbenchTasks[careState.currentTask];

    if (!currentTask || careState.completed) {
      if (el.wbTaskStep) el.wbTaskStep.textContent = 'EXCAVATION COMPLETE • 100% ENERGY';
      if (el.wbPromptBox) {
        el.wbPromptBox.innerHTML = `
          <div style="color: var(--emerald-primary); font-size: 1.4rem; font-weight: 800; text-align: center; padding: 10px;">
            🎉 ${dino.name} has been fully documented and analyzed!
          </div>
        `;
      }
      if (el.wbSentenceDisplay) {
        el.wbSentenceDisplay.innerHTML = `
          <span>"${dino.teleprompter[1]}"</span><br>
          <span style="color: var(--emerald-primary); font-size: 1.15rem;">"${dino.teleprompter[2]}"</span>
        `;
      }
      if (el.wbOptionsGrid) {
        el.wbOptionsGrid.innerHTML = `
          <button class="btn-3d btn-emerald" id="btn-next-to-teleprompter" style="padding: 16px;">
            🎙️ Go to Teleprompter Studio to Broadcast Paleontology Debrief
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
      el.wbTaskStep.textContent = `MISSION ${careState.currentTask + 1} OF ${dino.workbenchTasks.length} • TARGET: ${dino.name.toUpperCase()}`;
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
          handleWorkbenchChoice(opt, currentTask, dino, careState, btn);
        });

        el.wbOptionsGrid.appendChild(btn);
      });
    }
  }

  function handleWorkbenchChoice(option, task, dino, careState, btnElement) {
    audio.initCtx();

    if (option.correct) {
      const allBtns = el.wbOptionsGrid.querySelectorAll('button');
      allBtns.forEach(b => b.disabled = true);

      // Angled rubber stamp slam
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
      setStreak(playerSession.streak + 1);
      careState.energy = Math.min(100, careState.energy + 25);
      careState.currentTask += 1;

      audio.speakText(task.explanation);

      setTimeout(() => {
        if (careState.currentTask >= dino.workbenchTasks.length) {
          careState.completed = true;
          const allDone = DATA.dinosaurs.every(d => playerSession.caredDinos[d.id].completed);
          if (allDone) {
            const p2Tab = document.querySelector('.phase-tab[data-phase="2"]');
            if (p2Tab) p2Tab.classList.add('completed');
          }
        }
        renderWorkbench();
      }, 1600);

    } else {
      // Soft-fail architecture: elastic wobble & supportive audio clue, zero point deductions
      btnElement.classList.add('elastic-wobble');
      setTimeout(() => btnElement.classList.remove('elastic-wobble'), 400);

      audio.playSoftFail();

      if (el.wbClueBox) {
        el.wbClueBox.style.display = 'flex';
        el.wbClueBox.innerHTML = `
          <span class="spoken-clue-icon">💡</span>
          <div>
            <strong>Paleontologist Clue:</strong> ${option.hint}
          </div>
        `;
      }
      audio.speakText(option.hint);
    }
  }

  /* ==========================================================================
     PHASE 3: PALEONTOLOGIST TELEPROMPTER STUDIO
     ========================================================================== */
  function renderTeleprompter() {
    const dino = DATA.dinosaurs[playerSession.selectedDinoIdx];

    if (el.tpDinoBtns) {
      el.tpDinoBtns.innerHTML = '';
      DATA.dinosaurs.forEach((d, idx) => {
        const btn = document.createElement('button');
        btn.className = `selector-mini-btn ${idx === playerSession.selectedDinoIdx ? 'active' : ''}`;
        const isDone = playerSession.broadcastedDinos.has(d.id);
        btn.innerHTML = `
          <span style="font-size: 1.25rem;">${d.habitatIcon}</span>
          <span>${d.shortName}${isDone ? ' 🏆' : ''}</span>
        `;
        btn.addEventListener('click', () => {
          if (playerSession.isBroadcasting) return;
          audio.playSnap();
          playerSession.selectedDinoIdx = idx;
          renderTeleprompter();
        });
        el.tpDinoBtns.appendChild(btn);
      });
    }

    if (el.tpFocalStage) {
      el.tpFocalStage.innerHTML = `
        <div class="focal-sprite-wrap" style="width: 170px; height: 170px;">
          <img src="${dino.imageSrc}" alt="${dino.name}" class="dino-raster-img" />
        </div>
        <div class="pedestal-disk" style="background: radial-gradient(ellipse at center, ${dino.accentColor}70 0%, ${dino.accentColor}20 45%, transparent 70%);"></div>
      `;
    }

    if (el.tpTeleprompterBox) {
      el.tpTeleprompterBox.innerHTML = '';
      dino.teleprompter.forEach((sentence, lineIdx) => {
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
      const isDone = playerSession.broadcastedDinos.has(dino.id);
      el.tpBroadcastBtn.innerHTML = isDone ? '<span>🎙️ Broadcast Again (+10 XP)</span>' : '<span>🎙️ Start Live Karaoke Broadcast (+30 XP)</span>';
      el.tpBroadcastBtn.onclick = () => runTeleprompterBroadcast(dino);
    }
  }

  function runTeleprompterBroadcast(dino) {
    if (playerSession.isBroadcasting) return;
    audio.initCtx();
    playerSession.isBroadcasting = true;

    if (el.tpBroadcastBtn) el.tpBroadcastBtn.disabled = true;
    if (el.tpOnAirBadge) {
      el.tpOnAirBadge.classList.add('broadcasting');
      el.tpOnAirBadge.innerHTML = '<span>📡</span><span>ON AIR • EXPEDITION BROADCAST</span>';
    }

    const sentences = dino.teleprompter;
    let currentLine = 0;

    function playLine() {
      if (currentLine >= sentences.length) {
        finishBroadcast(dino);
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

  function finishBroadcast(dino) {
    playerSession.isBroadcasting = false;
    audio.playFanfare();
    confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);

    const isFirstTime = !playerSession.broadcastedDinos.has(dino.id);
    playerSession.broadcastedDinos.add(dino.id);
    awardXP(isFirstTime ? 30 : 10);
    setStreak(playerSession.streak + 1);

    if (el.tpOnAirBadge) {
      el.tpOnAirBadge.classList.remove('broadcasting');
      el.tpOnAirBadge.innerHTML = '<span>🏆</span><span>BROADCAST SUCCESSFUL!</span>';
    }

    if (el.tpBroadcastBtn) {
      el.tpBroadcastBtn.disabled = false;
      el.tpBroadcastBtn.innerHTML = '<span>✅ Broadcast Completed</span>';
    }

    if (playerSession.broadcastedDinos.size === DATA.dinosaurs.length) {
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
      el.modalFinalXP.textContent = `${playerSession.totalXP} XP`;
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
