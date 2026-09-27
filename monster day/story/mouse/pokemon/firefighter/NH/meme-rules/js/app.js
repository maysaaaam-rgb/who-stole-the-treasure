/**
 * MEME RULES ARENA: THE CLASSROOM IMPERATIVES CLASH
 * Central Reactive playerSession State Machine, Showdown Sorting Arena & Teleprompter Studio
 * Zero external runtime dependencies • Web Audio API & Calibrated Natural TTS
 */

(function(root) {
  'use strict';

  // --- REACTIVE PLAYER SESSION STATE ---
  const playerSession = {
    xp: 0,
    energy: 20,
    streak: 0,
    currentPhase: 1,
    inventory: [],
    relayQueue: [],
    greenLaneItems: [],
    redLaneItems: [],
    activeStudioMeme: null,
    isSpeaking: false,
    isSortingBlocked: false
  };

  // --- ZERO-DEPENDENCY CONFETTI CELEBRATION ENGINE ---
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
      const colors = ['#10b981', '#38bdf8', '#f59e0b', '#f43f5e', '#a855f7', '#facc15'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 220,
          y: window.innerHeight * 0.4 + (Math.random() - 0.5) * 120,
          vx: (Math.random() - 0.5) * 18,
          vy: (Math.random() - 1.2) * 16,
          size: Math.random() * 8 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
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
    const data = root.MEME_RULES_DATA;
    if (!data || !data.memes) {
      console.error('[MemeRulesApp] MEME_RULES_DATA not found.');
      return;
    }

    playerSession.relayQueue = [...data.memes];
    playerSession.activeStudioMeme = data.memes[0];

    ConfettiEngine.init();
    renderPhase1Scanner();
    renderPhase2Workbench();
    renderPhase3Studio();
    updateHUD();
    setupKeyboardShortcuts();
  }

  // --- HUD CONTROLLER ---
  function updateHUD() {
    const xpEl = document.getElementById('hudXP');
    if (xpEl) xpEl.textContent = `⭐ +${playerSession.xp} XP`;

    const streakEl = document.getElementById('hudStreak');
    if (streakEl) streakEl.textContent = `🔥 ${playerSession.streak} Streak`;

    const fillEl = document.getElementById('hudEnergyFill');
    if (fillEl) fillEl.style.width = `${Math.min(100, Math.max(10, playerSession.energy))}%`;

    const meterNumEl = document.getElementById('hudEnergyNumber');
    if (meterNumEl) meterNumEl.textContent = `${Math.round(playerSession.energy)}%`;
  }

  function addXP(amount) {
    playerSession.xp += amount;
    playerSession.energy = Math.min(100, playerSession.energy + (amount * 0.45));
    updateHUD();

    const xpEl = document.getElementById('hudXP');
    if (xpEl) {
      xpEl.classList.remove('bounce');
      void xpEl.offsetWidth;
      xpEl.classList.add('bounce');
    }

    // Academy Master Bridge
    try {
      if (window.AdventureAcademy && typeof window.AdventureAcademy.awardXP === 'function') {
        window.AdventureAcademy.awardXP(amount, 'Meme Rules Arena');
      } else if (window.parent && window.parent.store && typeof window.parent.store.giveXP === 'function') {
        window.parent.store.giveXP('student-3a-224', amount, 'Meme Rules Arena');
      }
    } catch (e) {}
  }

  // Floating comic +XP burst animation
  function triggerScoreBurst(parentEl, text = '+20 XP!') {
    if (!parentEl) return;
    const burst = document.createElement('div');
    burst.className = 'floating-xp-burst';
    burst.textContent = text;
    parentEl.appendChild(burst);
    setTimeout(() => {
      if (burst.parentNode) burst.parentNode.removeChild(burst);
    }, 900);
  }

  // Audio mute toggle
  window.toggleMuteAudio = function() {
    if (!root.MemeAudio) return;
    const isMuted = root.MemeAudio.toggleMute();
    const btn = document.getElementById('btnMuteToggle');
    if (btn) {
      btn.textContent = isMuted ? '🔇 Muted' : '🔊 Sound';
      btn.style.color = isMuted ? '#f87171' : '#cbd5e1';
    }
  };

  // --- STAGE NAVIGATION ---
  window.switchPhase = function(phaseNum) {
    if (phaseNum === 2 && playerSession.inventory.length < 3) {
      alert('🔒 Scan at least 3 meme reactions in Phase 1 to unlock Phase 2!');
      return;
    }
    if (phaseNum === 3 && playerSession.relayQueue.length > 20) {
      alert('🔒 Sort at least 5 crisis scenarios into Green and Red lanes in Phase 2 before the oral teleprompter!');
      return;
    }

    playerSession.currentPhase = phaseNum;

    // Update Stage Stepper UI
    document.querySelectorAll('.step-tab').forEach((tab, idx) => {
      const p = idx + 1;
      tab.classList.toggle('is-active', p === phaseNum);
      if (p < phaseNum) tab.classList.add('is-completed');
    });

    // Toggle Stage Views
    document.querySelectorAll('.stage-view').forEach(view => view.classList.remove('is-visible'));
    const targetView = document.getElementById(`stagePhase${phaseNum}`);
    if (targetView) targetView.classList.add('is-visible');

    if (root.MemeAudio) root.MemeAudio.playSnap();
  };

  // =========================================================================
  // PHASE 1: HOLOGRAPHIC MEME SCANNER (3D FLIPPING TRADING CARDS)
  // =========================================================================
  function renderPhase1Scanner() {
    const container = document.getElementById('scannerCardsGrid');
    if (!container) return;

    // Feature top 8 archetypes for the scanner
    const memes = root.MEME_RULES_DATA.scannerMemes || root.MEME_RULES_DATA.memes.slice(0, 8);

    container.innerHTML = memes.map(m => {
      const isCollected = playerSession.inventory.includes(m.id);
      const isDo = m.type === 'DO';
      return `
        <div class="scanner-card-wrap" id="scanCardWrap-${m.id}" onclick="handleScanMeme('${m.id}')">
          <div class="scanner-card-flipper" id="cardFlipper-${m.id}">

            <!-- FRONT FACE (65% Full-Bleed Artwork Stage) -->
            <div class="card-face-front">
              <div class="card-hero-stage">
                <div class="isometric-pedestal ${isDo ? 'pedestal-green' : 'pedestal-red'}"></div>
                <div class="hero-character-sprite">
                  ${m.graphic}
                </div>
              </div>
              <div class="card-caption-tray">
                <h3 class="scanner-card-title">${m.name}</h3>
                <span class="scanner-mood-tag">${m.mood}</span>
                <div class="scanner-verb-pill">
                  <span>⚡</span> <span>VERB: <strong>${m.coreVerb.toUpperCase()}</strong></span>
                </div>
                <div class="scanner-tap-hint">
                  <span>🔄</span> <span>Tap to Scan &amp; Flip</span>
                </div>
              </div>
            </div>

            <!-- BACK FACE (Rule Reveal & Audio Pronunciation) -->
            <div class="card-face-back ${isDo ? 'is-do' : 'is-dont'}">
              <span class="rule-badge-pill ${isDo ? 'do' : 'dont'}">
                ${isDo ? '🟢 GREEN LIGHT: DO' : "🔴 RED LIGHT: DON'T"}
              </span>
              <div class="scanner-revealed-rule">
                &ldquo;${m.ruleText}&rdquo;
              </div>
              <p style="font-size:0.86rem; color:#cbd5e1; line-height:1.45; padding:0 6px;">
                ${m.explanation || m.scenario}
              </p>
              <div style="display:flex; flex-direction:column; gap:8px; width:100%;">
                <div class="rule-badge-pill" style="background:#0f172a; border-color:#38bdf8; color:#38bdf8; font-size:0.82rem;">
                  ⭐ ${m.badge || 'Explorer Badge'}
                </div>
                <button type="button" class="btn-3d btn-game-action" onclick="event.stopPropagation(); replayMemeAudio('${m.id}')" style="padding:8px 16px; font-size:0.88rem;">
                  <span>🔊 Replay Audio</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      `;
    }).join('');
  }

  window.replayMemeAudio = function(memeId) {
    const meme = root.MEME_RULES_DATA.memes.find(m => m.id === memeId);
    if (!meme || !root.MemeAudio) return;
    root.MemeAudio.speak(meme.ruleText);
  };

  window.handleScanMeme = function(memeId) {
    const meme = root.MEME_RULES_DATA.memes.find(m => m.id === memeId);
    if (!meme) return;

    const wrapEl = document.getElementById(`scanCardWrap-${memeId}`);
    if (wrapEl) {
      wrapEl.classList.toggle('is-flipped');
    }

    if (root.MemeAudio) {
      root.MemeAudio.playSnap();
      root.MemeAudio.speak(`${meme.coreVerb}! ${meme.ruleText}`);
    }

    if (!playerSession.inventory.includes(memeId)) {
      playerSession.inventory.push(memeId);
      addXP(10);

      if (root.MemeAudio) root.MemeAudio.playXP();
      if (wrapEl) triggerScoreBurst(wrapEl, '+10 Discovery XP!');

      // Check if scanner goal reached (at least 5 scanned)
      const scannerList = root.MEME_RULES_DATA.scannerMemes || root.MEME_RULES_DATA.memes.slice(0, 8);
      if (playerSession.inventory.length >= Math.min(5, scannerList.length)) {
        const notice = document.getElementById('phase1SuccessNotice');
        if (notice && notice.style.display !== 'flex') {
          notice.style.display = 'flex';
          ConfettiEngine.burst(80);
          if (root.MemeAudio) root.MemeAudio.playFanfare();
        }
      }
    }
  };

  // =========================================================================
  // PHASE 2: TACTICAL SORTING & CRISIS ARENA
  // =========================================================================
  function renderPhase2Workbench() {
    renderRelayQueue();
    setupDropzoneListeners();
  }

  function renderRelayQueue() {
    const activeContainer = document.getElementById('relayActiveCardContainer');
    const upcomingContainer = document.getElementById('relayUpcomingCarousel');
    const queueCounter = document.getElementById('queueRemainingCount');
    const greenCount = document.getElementById('greenCountChip');
    const redCount = document.getElementById('redCountChip');

    if (greenCount) greenCount.textContent = `${playerSession.greenLaneItems.length} Sorted`;
    if (redCount) redCount.textContent = `${playerSession.redLaneItems.length} Sorted`;

    if (!activeContainer) return;

    if (queueCounter) {
      queueCounter.textContent = `${playerSession.relayQueue.length} Memes Remaining`;
    }

    // ALL CARDS COMPLETED CELEBRATION
    if (playerSession.relayQueue.length === 0) {
      activeContainer.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(16,185,129,0.22), #0f172a); border:3.5px solid #10b981; border-bottom:8px solid #047857; border-radius:28px; padding:36px 24px; text-align:center;">
          <div style="font-size:3.8rem; margin-bottom:8px;">🏆</div>
          <h3 style="font-size:1.65rem; font-weight:900; color:#34d399; margin-bottom:8px;">
            ALL 25 MEME RULES SORTED PERFECTLY!
          </h3>
          <p style="font-size:0.95rem; color:#f0fdf4; margin-bottom:22px;">
            You mastered positive Base Verbs and negative Don't imperatives with a ${playerSession.streak} streak!
          </p>
          <button class="btn-3d btn-game-do" onclick="switchPhase(3)" style="font-size:1.2rem; padding:16px 36px;">
            🚀 Step onto the Live Teleprompter Stage →
          </button>
        </div>
      `;
      if (upcomingContainer) upcomingContainer.innerHTML = '';
      ConfettiEngine.burst(90);
      return;
    }

    // Lead Showdown Card
    const currentMeme = playerSession.relayQueue[0];
    const isDo = currentMeme.type === 'DO';

    activeContainer.innerHTML = `
      <div class="showdown-active-card" id="showdownActiveCard" draggable="true" ondragstart="handleDragStart(event, '${currentMeme.id}')">
        <!-- 65% Full-Bleed Media Stage -->
        <div class="card-hero-stage">
          <div class="isometric-pedestal ${isDo ? 'pedestal-green' : 'pedestal-red'}"></div>
          <div class="hero-character-sprite">
            ${currentMeme.graphic}
          </div>
        </div>

        <h3 class="showdown-card-title">${currentMeme.name}</h3>

        <div class="showdown-scenario-banner">
          🚨 <strong>Scenario:</strong> &ldquo;${currentMeme.scenario || 'Classroom situation'}&rdquo;
        </div>

        <div class="showdown-verb-tag">
          <span>⚡</span> <span>ACTION VERB: <strong>${currentMeme.coreVerb.toUpperCase()}</strong></span>
        </div>

        <div class="showdown-rule-bubble">
          &ldquo;${currentMeme.ruleText}&rdquo;
        </div>
        
        <!-- TWO GIANT TACTILE 3D PUSH BUTTONS -->
        <div class="relay-action-buttons-row">
          <button type="button" class="btn-3d btn-game-do" id="btnRelayDo" onclick="handleActiveSort('DO')" title="Shortcut: Press 'D'">
            <span style="font-size:1.4rem;">🟢</span>
            <span>DO! (Base Verb)</span>
          </button>
          <button type="button" class="btn-3d btn-game-dont" id="btnRelayDont" onclick="handleActiveSort('DONT')" title="Shortcut: Press 'N'">
            <span style="font-size:1.4rem;">🔴</span>
            <span>DON'T! (Don't + Verb)</span>
          </button>
        </div>

        <div class="keyboard-shortcut-hint">
          ⌨️ Quick Keys: Press <kbd style="background:#334155; padding:2px 6px; border-radius:4px; color:#fff;">[D]</kbd> for DO • <kbd style="background:#334155; padding:2px 6px; border-radius:4px; color:#fff;">[N]</kbd> for DON'T • Or Drag Card
        </div>
      </div>
    `;

    // Render Upcoming Mini Queue
    if (upcomingContainer) {
      const upcoming = playerSession.relayQueue.slice(1, 6);
      if (upcoming.length === 0) {
        upcomingContainer.innerHTML = '<span style="color:#64748b; font-size:0.82rem; font-style:italic;">Final meme on conveyor!</span>';
      } else {
        upcomingContainer.innerHTML = upcoming.map((m, idx) => `
          <div style="width:48px; height:48px; border-radius:12px; overflow:hidden; border:2px solid #334155; flex-shrink:0; opacity:${1 - (idx * 0.16)};" title="${m.name}: ${m.ruleText}">
            ${m.graphic}
          </div>
        `).join('');
      }
    }
  }

  window.handleActiveSort = function(chosenType) {
    if (playerSession.isSortingBlocked || playerSession.relayQueue.length === 0) return;
    const currentMeme = playerSession.relayQueue[0];
    handleLaneSort(currentMeme.id, chosenType);
  };

  // Drag and Drop handlers
  let draggedMemeId = null;

  window.handleDragStart = function(e, memeId) {
    draggedMemeId = memeId;
    e.dataTransfer.setData('text/plain', memeId);
    e.currentTarget.classList.add('is-dragging');
    if (root.MemeAudio) root.MemeAudio.playSnap();
  };

  function setupDropzoneListeners() {
    const greenLane = document.getElementById('greenLightDropzone');
    const redLane = document.getElementById('redLightDropzone');

    [greenLane, redLane].forEach(lane => {
      if (!lane) return;

      lane.addEventListener('dragover', e => {
        e.preventDefault();
        lane.classList.add('drag-over');
      });

      lane.addEventListener('dragleave', () => {
        lane.classList.remove('drag-over');
      });

      lane.addEventListener('drop', e => {
        e.preventDefault();
        lane.classList.remove('drag-over');
        const memeId = e.dataTransfer.getData('text/plain') || draggedMemeId;
        const targetType = lane.dataset.laneType;
        if (memeId && targetType) {
          handleLaneSort(memeId, targetType);
        }
      });
    });
  }

  window.handleLaneSort = function(memeId, chosenType) {
    if (playerSession.isSortingBlocked) return;
    const meme = playerSession.relayQueue.find(m => m.id === memeId);
    if (!meme) return;

    const cardEl = document.getElementById('showdownActiveCard');

    // Standardize comparison: "DO" vs "DONT" / "DON'T"
    const actualType = meme.type.replace("'", "");
    const targetType = chosenType.replace("'", "");

    if (actualType === targetType) {
      // SUCCESS: SLAM ANIMATED RUBBER STAMP
      playerSession.isSortingBlocked = true;

      if (root.MemeAudio) {
        root.MemeAudio.playStampSlam();
        root.MemeAudio.playXP();
      }

      playerSession.streak++;
      addXP(meme.xp || 20);
      ConfettiEngine.burst(55);

      if (cardEl) {
        // Stamp Element creation
        const stamp = document.createElement('div');
        stamp.className = `rubber-stamp ${actualType === 'DONT' ? 'stamp-dont' : 'stamp-do'}`;
        stamp.innerHTML = `STAMP: APPROVED! ⭐`;
        cardEl.appendChild(stamp);

        triggerScoreBurst(cardEl, `+${meme.xp || 20} XP!`);
      }

      // Hide coach hint if open
      const hintBox = document.getElementById('relayHintMessage');
      if (hintBox) hintBox.style.display = 'none';

      // Read rule encouragement with TTS
      if (root.MemeAudio) root.MemeAudio.speak(meme.ruleText);

      // Brief cinematic delay before advancing conveyor
      setTimeout(() => {
        // Remove from queue
        playerSession.relayQueue = playerSession.relayQueue.filter(m => m.id !== memeId);

        // Add to sorted lane
        if (actualType === 'DO') {
          playerSession.greenLaneItems.unshift(meme);
          renderLaneCards('greenLaneSlot', playerSession.greenLaneItems, 'DO');
        } else {
          playerSession.redLaneItems.unshift(meme);
          renderLaneCards('redLaneSlot', playerSession.redLaneItems, 'DONT');
        }

        playerSession.isSortingBlocked = false;
        renderRelayQueue();
      }, 750);

    } else {
      // SOFT FAIL PROTOCOL (Zero point deduction, streak reset, elastic card wobble & coach hint)
      playerSession.streak = 0;
      updateHUD();

      if (root.MemeAudio) root.MemeAudio.playSoftFail();

      if (cardEl) {
        cardEl.classList.remove('wobble-fail');
        void cardEl.offsetWidth; // Trigger reflow
        cardEl.classList.add('wobble-fail');
      }

      // Display supportive educational coach clue
      const hintBox = document.getElementById('relayHintMessage');
      if (hintBox) {
        hintBox.innerHTML = `💡 <strong>Coach Clue:</strong> ${meme.hint || (actualType === 'DO' ? 'Good actions begin with a Base Verb!' : 'Forbidden actions begin with Don\'t!')}`;
        hintBox.style.display = 'block';
      }

      if (root.MemeAudio) {
        root.MemeAudio.speak(meme.hint || "Remember: use base verbs for do, and don't plus verb for negative rules!");
      }
    }
  };

  function renderLaneCards(containerId, items, type) {
    const slot = document.getElementById(containerId);
    if (!slot) return;

    slot.innerHTML = items.map(m => `
      <div class="sorted-trophy-badge" style="border-left: 4px solid ${type === 'DO' ? '#10b981' : '#ef4444'};">
        <div style="width:42px; height:42px; border-radius:10px; overflow:hidden; flex-shrink:0;">
          ${m.graphic}
        </div>
        <div style="flex:1;">
          <strong style="font-size:0.9rem; color:#ffffff;">${m.name}</strong>
          <p style="font-size:0.8rem; color:${type === 'DO' ? '#a7f3d0' : '#fca5a5'}; margin-top:2px;">&ldquo;${m.ruleText}&rdquo;</p>
        </div>
        <span style="font-size:0.8rem; color:#facc15; font-weight:900;">+20 XP</span>
      </div>
    `).join('');
  }

  // Keyboard controls for Phase 2: 'D' for DO, 'N' for DON'T
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', e => {
      if (playerSession.currentPhase !== 2) return;
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

      if (e.key === 'd' || e.key === 'D') {
        const btnDo = document.getElementById('btnRelayDo');
        if (btnDo) {
          btnDo.click();
          btnDo.classList.add('btn-active-key');
          setTimeout(() => btnDo.classList.remove('btn-active-key'), 140);
        }
      } else if (e.key === 'n' || e.key === 'N') {
        const btnDont = document.getElementById('btnRelayDont');
        if (btnDont) {
          btnDont.click();
          btnDont.classList.add('btn-active-key');
          setTimeout(() => btnDont.classList.remove('btn-active-key'), 140);
        }
      }
    });
  }

  // =========================================================================
  // PHASE 3: LIVE TELEPROMPTER STUDIO (Oral Showcase & Podium)
  // =========================================================================
  function renderPhase3Studio() {
    const listContainer = document.getElementById('teleprompterMemesList');
    if (!listContainer) return;

    const studioMemes = root.MEME_RULES_DATA.teleprompterMemes || root.MEME_RULES_DATA.memes.slice(0, 6);
    listContainer.innerHTML = studioMemes.map(m => {
      const isSelected = playerSession.activeStudioMeme && playerSession.activeStudioMeme.id === m.id;
      return `
        <div class="teleprompter-choice-card ${isSelected ? 'is-selected' : ''}" onclick="selectStudioMeme('${m.id}')">
          <div style="width:46px; height:46px; border-radius:12px; overflow:hidden; flex-shrink:0;">
            ${m.graphic}
          </div>
          <div style="flex:1;">
            <div style="font-size:0.95rem; font-weight:900; color:#fff;">${m.name}</div>
            <div style="font-size:0.78rem; color:#94a3b8; font-weight:600;">${m.ruleText}</div>
          </div>
          <span style="font-size:1.3rem;">${isSelected ? '🎙️' : '⚪'}</span>
        </div>
      `;
    }).join('');

    renderTeleprompterScript();
  }

  window.selectStudioMeme = function(memeId) {
    const found = root.MEME_RULES_DATA.memes.find(m => m.id === memeId);
    if (!found) return;

    playerSession.activeStudioMeme = found;
    if (root.MemeAudio) root.MemeAudio.playSnap();
    renderPhase3Studio();
  };

  function renderTeleprompterScript() {
    const m = playerSession.activeStudioMeme;
    if (!m) return;

    const screenTitle = document.getElementById('teleprompterActiveMemeName');
    if (screenTitle) screenTitle.textContent = m.name;

    // Render Central Podium with character on isometric reflection pedestal
    const podium = document.getElementById('teleprompterPodiumStage');
    if (podium) {
      const isDo = m.type === 'DO';
      podium.innerHTML = `
        <div class="isometric-pedestal ${isDo ? 'pedestal-green' : 'pedestal-red'}" style="bottom:22px; width:150px; height:42px;"></div>
        <div class="hero-character-sprite" style="width:130px; height:130px;">
          ${m.graphic}
        </div>
      `;
    }

    const line1 = document.getElementById('tpLine1');
    const line2 = document.getElementById('tpLine2');
    const line3 = document.getElementById('tpLine3');

    const s1 = m.sentence1 || "Welcome to Adventure Academy! This is our classroom rule.";
    const s2 = m.sentence2 || `When you are in class, ${m.ruleText.replace(/!$/, '')}!`;
    const s3 = m.sentence3 || "Follow the rules and earn XP!";

    if (line1) line1.innerHTML = wrapWordsInSpans(s1, 'l1');
    if (line2) line2.innerHTML = wrapWordsInSpans(s2, 'l2');
    if (line3) line3.innerHTML = wrapWordsInSpans(s3, 'l3');
  }

  function wrapWordsInSpans(text, prefix) {
    return text.split(' ').map((word, i) => `<span class="speech-word" id="${prefix}-w-${i}">${word}</span>`).join(' ');
  }

  window.readTeleprompterAloud = function() {
    if (playerSession.isSpeaking) return;
    const m = playerSession.activeStudioMeme;
    if (!m || !root.MemeAudio) return;

    playerSession.isSpeaking = true;
    const btn = document.getElementById('btnReadAloud');
    if (btn) btn.innerHTML = '<span>🔊</span> <span>Speaking Broadcast...</span>';

    const s1 = m.sentence1 || "Welcome to Adventure Academy! This is our classroom rule.";
    const s2 = m.sentence2 || `When you are in class, ${m.ruleText.replace(/!$/, '')}!`;
    const s3 = m.sentence3 || "Follow the rules and earn XP!";
    const fullText = `${s1} ${s2} ${s3}`;

    const allWords = Array.from(document.querySelectorAll('.speech-word'));
    allWords.forEach(w => w.classList.remove('highlight-karaoke'));

    let currentWordIndex = 0;

    root.MemeAudio.speak(
      fullText,
      function(charIndex) {
        // Karaoke word highlight boundary
        if (currentWordIndex < allWords.length) {
          allWords.forEach(w => w.classList.remove('highlight-karaoke'));
          allWords[currentWordIndex].classList.add('highlight-karaoke');
          currentWordIndex++;
        }
      },
      function() {
        playerSession.isSpeaking = false;
        allWords.forEach(w => w.classList.remove('highlight-karaoke'));
        if (btn) btn.innerHTML = '<span>🎙️</span> <span>Replay Presentation</span>';
        if (root.MemeAudio) root.MemeAudio.playXP();
        addXP(30);
      }
    );
  };

  window.finishLessonQuest = function() {
    if (root.MemeAudio) root.MemeAudio.playFanfare();
    addXP(150);
    ConfettiEngine.burst(130);

    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.add('is-active');

    const totalXpEl = document.getElementById('diplomaTotalXP');
    if (totalXpEl) totalXpEl.textContent = `⭐ +${playerSession.xp} XP`;
  };

  window.closeCompletionModal = function() {
    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.remove('is-active');
  };

  // Run initialization on load
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initGame);
  }

  root.playerSession = playerSession;

})(typeof window !== 'undefined' ? window : global);
