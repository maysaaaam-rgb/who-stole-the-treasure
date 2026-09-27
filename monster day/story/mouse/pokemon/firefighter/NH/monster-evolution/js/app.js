/**
 * MONSTER EVOLUTION: ELEMENTAL GROWTH CYCLES — GAME CONTROLLER & STATE MACHINE
 * 3-Phase Interactive Loop • 60-30-10 Cyber-Glassmorphism • Tactile 3D Physics
 */
(function() {
  'use strict';

  const DATA = window.MONSTER_EVOLUTION_DATA;
  const audio = window.monsterEvolutionAudio;

  if (!DATA) {
    console.error('MONSTER_EVOLUTION_DATA not found. Ensure js/data.js is loaded.');
    return;
  }

  // Reactive playerSession State Architecture
  const playerSession = {
    currentPhase: 1,
    selectedMonsterIdx: 0,
    discoveredMonsters: new Set(),
    caredMonsters: {}, // { 'emberwing': { currentTask: 0, energy: 20, completed: false } }
    broadcastedMonsters: new Set(),
    totalXP: 0,
    streak: 0,
    isBroadcasting: false
  };

  // Initialize monster care states
  DATA.monsters.forEach(m => {
    playerSession.caredMonsters[m.id] = {
      currentTask: 0,
      energy: 20,
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
      const colors = ['#ef4444', '#38bdf8', '#10b981', '#a855f7', '#f59e0b', '#fbbf24'];
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
    wbMonsterBtns: document.getElementById('wb-monster-btns'),
    focalStage: document.getElementById('focal-stage'),
    wbEnergyFill: document.getElementById('wb-energy-fill'),
    wbEnergyVal: document.getElementById('wb-energy-val'),
    wbTaskStep: document.getElementById('wb-task-step'),
    wbPromptBox: document.getElementById('wb-prompt-box'),
    wbSentenceDisplay: document.getElementById('wb-sentence-display'),
    wbOptionsGrid: document.getElementById('wb-options-grid'),
    wbClueBox: document.getElementById('wb-clue-box'),
    // Phase 3 Teleprompter
    tpMonsterBtns: document.getElementById('tp-monster-btns'),
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
        store.addXP(amount, 'Monster Evolution');
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
     PHASE 1: RADAR SCANNER (3D FLIP CARDS)
     65% Full-Bleed 3D Asset Rule • Isometric Pedestal • idleBob
     ========================================================================== */
  function renderRadarScanner() {
    if (!el.radarGrid) return;
    el.radarGrid.innerHTML = '';

    DATA.monsters.forEach((monster, idx) => {
      const cardWrap = document.createElement('div');
      cardWrap.className = 'monster-card-wrap radar-card specimen-card';
      cardWrap.dataset.id = monster.id;

      const ultimateStage = monster.stages.find(s => s.stageId === 'ultimate') || monster.stages[0];

      cardWrap.innerHTML = `
        <div class="monster-card-inner card-inner">
          <!-- FRONT FACE (65/35 Full-Bleed Rule) -->
          <div class="card-face card-front" style="border-color: ${monster.borderColor};">
            <div class="card-badge-top" style="background: ${monster.elementBg}; color: ${monster.accentColor};">
              <span>${monster.elementBadge}</span>
            </div>
            <div class="card-xp-tag">+10 XP</div>
            <!-- Transparent 3D Character Model -->
            <div class="card-hero-stage">
              <img src="${monster.defaultImage}" alt="${monster.name}" class="monster-3d-model hero-3d-sprite" onerror="this.onerror=null; this.src=this.src.replace('.webp','.png');" loading="eager" />
              <div class="isometric-pedestal pedestal-disk" style="background: radial-gradient(ellipse at center, ${monster.accentColor}70 0%, ${monster.accentColor}20 45%, transparent 70%);"></div>
            </div>
            <div class="card-caption-tray">
              <div class="card-monster-name">
                <span>${monster.name}</span>
                <span style="font-size: 1.25rem;">${monster.habitatIcon}</span>
              </div>
              <div class="card-formula-snippet">
                "It lives in the ${monster.habitat}."
              </div>
              <button class="btn-3d btn-astral action-chamber-btn" type="button">
                <span>Send to Evolution Chamber ⚡</span>
              </button>
            </div>
          </div>

          <!-- BACK FACE (Life Cycle & Adaptations) -->
          <div class="card-face card-back">
            <div>
              <div class="back-header">
                <div class="back-title" style="color: ${monster.accentColor};">${monster.name}</div>
                <div style="font-size: 0.85rem; color: #94a3b8; font-weight: 600;">Elemental Habitat: ${monster.habitat} ${monster.habitatIcon}</div>
              </div>
              <div class="back-stages-list">
                ${monster.stages.map(s => `
                  <div class="back-stage-item">
                    <img src="${s.imageSrc}" style="width: 32px; height: 32px; object-fit: contain;" onerror="this.onerror=null; this.src=this.src.replace('.webp','.png');" />
                    <div>
                      <strong style="color: #ffffff;">${s.level}:</strong> ${s.stageName} (${s.weight})
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            <button class="btn-3d btn-astral back-footer-btn action-chamber-btn" style="padding: 10px; font-size: 0.85rem;">
              <span>⚡ Send to Evolution Chamber</span>
            </button>
          </div>
        </div>
      `;

      cardWrap.addEventListener('click', (e) => {
        // If clicking action button
        if (e.target.closest('.action-chamber-btn') || e.target.closest('.back-footer-btn')) {
          e.stopPropagation();
          audio.playSnap();
          playerSession.selectedMonsterIdx = idx;
          switchPhase(2);
          return;
        }

        // Card flip interaction
        audio.playSnap();
        const isFlipped = cardWrap.classList.toggle('flipped');

        if (!playerSession.discoveredMonsters.has(monster.id)) {
          playerSession.discoveredMonsters.add(monster.id);
          awardXP(10);
          audio.playXP();
          confetti.burst(e.clientX, e.clientY, 35);

          // Mark phase tab if all discovered
          if (playerSession.discoveredMonsters.size === DATA.monsters.length) {
            const p1Tab = document.querySelector('.phase-tab[data-phase="1"]');
            if (p1Tab) p1Tab.classList.add('completed');
          }
        }

        if (isFlipped) {
          audio.speakText(monster.speechIntro);
        }
      });

      el.radarGrid.appendChild(cardWrap);
    });
  }

  /* ==========================================================================
     PHASE 2: EVOLUTION WORKBENCH
     ========================================================================== */
  function renderWorkbench() {
    const monster = DATA.monsters[playerSession.selectedMonsterIdx];
    const careState = playerSession.caredMonsters[monster.id];

    // Render selector mini-buttons
    if (el.wbMonsterBtns) {
      el.wbMonsterBtns.innerHTML = '';
      DATA.monsters.forEach((m, idx) => {
        const btn = document.createElement('button');
        btn.className = `selector-mini-btn ${idx === playerSession.selectedMonsterIdx ? 'active' : ''}`;
        const doneBadge = playerSession.caredMonsters[m.id].completed ? ' ⭐' : '';
        btn.innerHTML = `
          <span style="font-size: 1.25rem;">${m.elementIcon}</span>
          <span>${m.name}${doneBadge}</span>
        `;
        btn.addEventListener('click', () => {
          audio.playSnap();
          playerSession.selectedMonsterIdx = idx;
          renderWorkbench();
        });
        el.wbMonsterBtns.appendChild(btn);
      });
    }

    // Focal stage with real transparent 3D raster asset & comparative stat bars
    const currentStageObj = monster.stages[Math.min(careState.currentTask + 1, monster.stages.length - 1)];

    if (el.focalStage) {
      el.focalStage.innerHTML = `
        <div class="focal-sprite-wrap">
          <img src="${currentStageObj.imageSrc}" alt="${monster.name}" class="monster-raster-img" onerror="this.onerror=null; this.src=this.src.replace('.webp','.png');" />
        </div>
        <div class="pedestal-disk" style="background: radial-gradient(ellipse at center, ${monster.accentColor}70 0%, ${monster.accentColor}20 45%, transparent 70%);"></div>
        <div class="stamp-overlay" id="stamp-overlay">
          <div class="rubber-stamp">STAMP: EVOLVED! ⭐</div>
        </div>
        <div class="comparative-stat-bars">
          <div class="stat-bar-row">
            <span class="stat-name">Power</span>
            <div class="stat-track"><div class="stat-fill" style="width: ${monster.stats.power}%; background: var(--ember-primary);"></div></div>
            <span class="stat-num">${monster.stats.power}</span>
          </div>
          <div class="stat-bar-row">
            <span class="stat-name">Agility</span>
            <div class="stat-track"><div class="stat-fill" style="width: ${monster.stats.agility}%; background: var(--aqua-primary);"></div></div>
            <span class="stat-num">${monster.stats.agility}</span>
          </div>
          <div class="stat-bar-row">
            <span class="stat-name">Affinity</span>
            <div class="stat-track"><div class="stat-fill" style="width: ${monster.stats.affinity}%; background: var(--astral-primary);"></div></div>
            <span class="stat-num">${monster.stats.affinity}</span>
          </div>
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
    const currentTask = monster.workbenchTasks[careState.currentTask];

    if (!currentTask || careState.completed) {
      if (el.wbTaskStep) el.wbTaskStep.textContent = 'EVOLUTION COMPLETE • 100% ENERGY';
      if (el.wbPromptBox) {
        el.wbPromptBox.innerHTML = `
          <div style="color: var(--verdant-primary); font-size: 1.4rem; font-weight: 800; text-align: center; padding: 10px;">
            🎉 ${monster.name} has reached its ultimate sovereign form!
          </div>
        `;
      }
      if (el.wbSentenceDisplay) {
        el.wbSentenceDisplay.innerHTML = `
          <div class="socket-dock-container docked-success">
            <span class="socket-prefix">${monster.teleprompter[1]}</span>
          </div>
        `;
      }
      if (el.wbOptionsGrid) {
        el.wbOptionsGrid.innerHTML = `
          <button class="btn-3d btn-astral" id="btn-next-to-teleprompter" style="padding: 16px;">
            🎙️ Go to Teleprompter Studio to Broadcast Evolution Debrief
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
      el.wbTaskStep.textContent = `MISSION ${careState.currentTask + 1} OF ${monster.workbenchTasks.length} • TARGET: ${monster.name.toUpperCase()}`;
    }

    if (el.wbPromptBox) {
      el.wbPromptBox.textContent = currentTask.prompt;
    }

    if (el.wbSentenceDisplay) {
      el.wbSentenceDisplay.innerHTML = `
        <div class="socket-dock-container">
          <span class="socket-prefix">${currentTask.sentencePre}</span>
          <span class="sentence-blank-slot socket-target" data-socket="evolution">⚡ [DOCK EVOLUTION TRAIT]</span>
          <span class="socket-postfix">${currentTask.sentencePost}</span>
        </div>
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
          <span class="option-hint">Dock to Socket ➔</span>
        `;

        btn.addEventListener('click', () => {
          handleWorkbenchChoice(opt, currentTask, monster, careState, btn);
        });

        el.wbOptionsGrid.appendChild(btn);
      });
    }
  }

  function handleWorkbenchChoice(option, task, monster, careState, btnElement) {
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
      confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 55);

      if (el.wbSentenceDisplay) {
        el.wbSentenceDisplay.innerHTML = `
          <div class="socket-dock-container docked-success">
            <span class="socket-prefix">${task.sentencePre}</span>
            <span class="sentence-blank-slot socket-target docked" style="background: rgba(16, 185, 129, 0.25); color: var(--verdant-primary); border-color: var(--verdant-primary); box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);">${option.text}</span>
            <span class="socket-postfix">${task.sentencePost}</span>
          </div>
        `;
      }

      // State updates
      awardXP(15);
      setStreak(playerSession.streak + 1);
      careState.energy = Math.min(100, careState.energy + 40);
      careState.currentTask += 1;

      audio.speakText(task.explanation);

      setTimeout(() => {
        if (careState.currentTask >= monster.workbenchTasks.length) {
          careState.completed = true;
          const allDone = DATA.monsters.every(m => playerSession.caredMonsters[m.id].completed);
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
          <span class="spoken-clue-icon" style="font-size: 1.25rem;">💡</span>
          <div>
            <strong>Evolutionist Clue:</strong> ${option.hint}
          </div>
        `;
      }
      audio.speakText(option.hint);
    }
  }

  /* ==========================================================================
     PHASE 3: TELEPROMPTER STUDIO
     ========================================================================== */
  function renderTeleprompter() {
    const monster = DATA.monsters[playerSession.selectedMonsterIdx];
    const ultimateStage = monster.stages.find(s => s.stageId === 'ultimate') || monster.stages[0];

    if (el.tpMonsterBtns) {
      el.tpMonsterBtns.innerHTML = '';
      DATA.monsters.forEach((m, idx) => {
        const btn = document.createElement('button');
        btn.className = `selector-mini-btn ${idx === playerSession.selectedMonsterIdx ? 'active' : ''}`;
        const isDone = playerSession.broadcastedMonsters.has(m.id);
        btn.innerHTML = `
          <span style="font-size: 1.25rem;">${m.elementIcon}</span>
          <span>${m.name}${isDone ? ' 🏆' : ''}</span>
        `;
        btn.addEventListener('click', () => {
          if (playerSession.isBroadcasting) return;
          audio.playSnap();
          playerSession.selectedMonsterIdx = idx;
          renderTeleprompter();
        });
        el.tpMonsterBtns.appendChild(btn);
      });
    }

    if (el.tpFocalStage) {
      el.tpFocalStage.innerHTML = `
        <div class="focal-sprite-wrap" style="width: 170px; height: 170px;">
          <img src="${ultimateStage.imageSrc}" alt="${monster.name}" class="monster-raster-img" onerror="this.onerror=null; this.src=this.src.replace('.webp','.png');" />
        </div>
        <div class="pedestal-disk" style="background: radial-gradient(ellipse at center, ${monster.accentColor}70 0%, ${monster.accentColor}20 45%, transparent 70%);"></div>
      `;
    }

    if (el.tpTeleprompterBox) {
      el.tpTeleprompterBox.innerHTML = '';
      monster.teleprompter.forEach((sentence, lineIdx) => {
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
      const isDone = playerSession.broadcastedMonsters.has(monster.id);
      el.tpBroadcastBtn.innerHTML = isDone ? '<span>🎙️ Broadcast Again (+10 XP)</span>' : '<span>🎙️ Start Live Karaoke Broadcast (+30 XP)</span>';
      el.tpBroadcastBtn.onclick = () => runTeleprompterBroadcast(monster);
    }
  }

  function runTeleprompterBroadcast(monster) {
    if (playerSession.isBroadcasting) return;
    audio.initCtx();
    playerSession.isBroadcasting = true;

    if (el.tpBroadcastBtn) el.tpBroadcastBtn.disabled = true;
    if (el.tpOnAirBadge) {
      el.tpOnAirBadge.classList.add('broadcasting');
      el.tpOnAirBadge.innerHTML = '<span>📡</span><span>ON AIR • EVOLUTION BROADCAST</span>';
    }

    const sentences = monster.teleprompter;
    let currentLine = 0;

    function playLine() {
      if (currentLine >= sentences.length) {
        finishBroadcast(monster);
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

  function finishBroadcast(monster) {
    playerSession.isBroadcasting = false;
    audio.playFanfare();
    confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);

    const isFirstTime = !playerSession.broadcastedMonsters.has(monster.id);
    playerSession.broadcastedMonsters.add(monster.id);
    awardXP(isFirstTime ? 30 : 10);

    const p3Tab = document.querySelector('.phase-tab[data-phase="3"]');
    if (p3Tab && playerSession.broadcastedMonsters.size === DATA.monsters.length) {
      p3Tab.classList.add('completed');
    }

    renderTeleprompter();

    // Check if entire module mastered
    const allCared = DATA.monsters.every(m => playerSession.caredMonsters[m.id].completed);
    const allBroadcast = playerSession.broadcastedMonsters.size === DATA.monsters.length;

    if (allCared && allBroadcast) {
      setTimeout(() => {
        if (el.victoryModal) {
          if (el.modalFinalXP) el.modalFinalXP.textContent = playerSession.totalXP;
          el.victoryModal.classList.add('active-modal');
        }
      }, 1000);
    }
  }

  // Global Setup & Event Listeners
  function init() {
    confetti = new ConfettiEngine('confetti-canvas');

    // Phase tab switches
    el.phaseTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const phaseNum = parseInt(tab.dataset.phase, 10);
        switchPhase(phaseNum);
      });
    });

    // Sound toggle
    if (el.btnMute) {
      el.btnMute.addEventListener('click', () => {
        audio.initCtx();
        const muted = audio.toggleMute();
        el.btnMute.innerHTML = muted ? '<span>🔇</span> Unmute' : '<span>🔊</span> Sound';
      });
    }

    // Fullscreen toggle
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

    // Modal controls
    if (el.btnModalClose) {
      el.btnModalClose.addEventListener('click', () => {
        el.victoryModal.classList.remove('active-modal');
      });
    }

    if (el.btnReplay) {
      el.btnReplay.addEventListener('click', () => {
        el.victoryModal.classList.remove('active-modal');
        switchPhase(1);
      });
    }

    // Render initial Phase 1
    renderRadarScanner();
  }

  window.addEventListener('DOMContentLoaded', init);
})();
