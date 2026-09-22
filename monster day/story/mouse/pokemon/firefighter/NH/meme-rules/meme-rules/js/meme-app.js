/**
 * ADVENTURE ACADEMY: MEME RULES GAME CONTROLLER (ARCADE EDITION)
 * Reactive playerSession State Machine, Showdown Sorting Arena & Teleprompter Studio
 * Zero external dependencies.
 */
(function(root) {
  'use strict';

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
    isSpeaking: false
  };

  // --- ZERO-DEPENDENCY CONFETTI ENGINE ---
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
          x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 200,
          y: window.innerHeight * 0.4 + (Math.random() - 0.5) * 100,
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
    if (!data) {
      console.error('[MemeApp] MEME_RULES_DATA not found.');
      return;
    }

    playerSession.relayQueue = [...data.relayMemes];
    playerSession.activeStudioMeme = data.teleprompterMemes[0];

    ConfettiEngine.init();
    renderPhase1Scanner();
    renderPhase2Workbench();
    renderPhase3Studio();
    updateHUD();
    setupKeyboardShortcuts();
  }

  // --- HUD UPDATES ---
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
    playerSession.energy = Math.min(100, playerSession.energy + (amount * 0.4));
    updateHUD();

    const xpEl = document.getElementById('hudXP');
    if (xpEl) {
      xpEl.classList.remove('bounce');
      void xpEl.offsetWidth;
      xpEl.classList.add('bounce');
    }

    // Synchronize to Adventure Academy master school store if embedded
    try {
      if (window.parent && window.parent.store && typeof window.parent.store.giveXP === 'function') {
        window.parent.store.giveXP('student-3a-224', amount, 'Meme Rules Quest');
      }
    } catch (e) {}
  }

  // Floating comic +15 XP burst helper
  function triggerScoreBurst(parentEl, text = '+15 XP!') {
    if (!parentEl) return;
    const burst = document.createElement('div');
    burst.className = 'floating-xp-burst';
    burst.textContent = text;
    parentEl.appendChild(burst);
    setTimeout(() => {
      if (burst.parentNode) burst.parentNode.removeChild(burst);
    }, 900);
  }

  // --- STAGE NAVIGATION ---
  window.switchPhase = function(phaseNum) {
    if (phaseNum === 2 && playerSession.inventory.length < 3) {
      alert('🔒 Scan at least 3 meme reactions in Phase 1 to unlock Phase 2!');
      return;
    }
    if (phaseNum === 3 && playerSession.relayQueue.length > 5) {
      alert('🔒 Sort more meme rules into Green and Red lanes in Phase 2 to unlock Phase 3!');
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

    root.MemeAudio.playCardSnap();
  };

  // =========================================================================
  // PHASE 1: MEME REACTION SCANNER
  // =========================================================================
  function renderPhase1Scanner() {
    const container = document.getElementById('scannerCardsGrid');
    if (!container) return;

    const memes = root.MEME_RULES_DATA.scannerMemes;
    container.innerHTML = memes.map(m => {
      const isCollected = playerSession.inventory.includes(m.id);
      return `
        <div class="scanner-card ${isCollected ? 'is-scanned' : ''}" id="scanCard-${m.id}" onclick="handleScanMeme('${m.id}')">
          <div class="meme-avatar-box">
            ${m.svg}
          </div>
          <h3 class="scanner-card-title">${m.name}</h3>
          <span class="scanner-mood-tag">${m.moodEmoji} Mood: ${m.mood}</span>
          <div class="scanner-verb-pill">
            <span>⚡</span> <span>VERB: <strong>${m.coreVerb.toUpperCase()}</strong></span>
          </div>
          <p class="scanner-sentence">&ldquo;${m.sentence}&rdquo;</p>
          <div class="scanner-badge-status ${isCollected ? 'collected' : 'locked'}" id="badgeStatus-${m.id}">
            ${isCollected ? `✓ ${m.badge}` : `🔊 Tap to Scan &amp; Hear`}
          </div>
        </div>
      `;
    }).join('');
  }

  window.handleScanMeme = function(memeId) {
    const meme = root.MEME_RULES_DATA.scannerMemes.find(m => m.id === memeId);
    if (!meme) return;

    root.MemeAudio.playCardSnap();

    // Web Speech pronunciation of the imperative sentence
    root.MemeAudio.speakPhrase(`${meme.coreVerb}! ${meme.soundPhrase}`);

    if (!playerSession.inventory.includes(memeId)) {
      playerSession.inventory.push(memeId);
      addXP(20);
      root.MemeAudio.playBadgeUnlock();

      const cardEl = document.getElementById(`scanCard-${memeId}`);
      if (cardEl) {
        cardEl.classList.add('is-scanned');
        triggerScoreBurst(cardEl, '+20 XP!');
      }

      const badgeEl = document.getElementById(`badgeStatus-${memeId}`);
      if (badgeEl) {
        badgeEl.className = 'scanner-badge-status collected';
        badgeEl.textContent = `✓ ${meme.badge} (+20 XP)`;
      }

      // Check if all 5 scanned
      if (playerSession.inventory.length === root.MEME_RULES_DATA.scannerMemes.length) {
        document.getElementById('phase1SuccessNotice').style.display = 'flex';
        ConfettiEngine.burst(80);
        root.MemeAudio.playVictoryFanfare();
      }
    }
  };

  // =========================================================================
  // PHASE 2: GREEN LIGHT / RED LIGHT RELAY SHOWDOWN ARENA
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
        <div style="background:linear-gradient(135deg, rgba(16,185,129,0.2), #0f172a); border:3.5px solid #10b981; border-bottom:8px solid #047857; border-radius:28px; padding:36px 24px; text-align:center;">
          <div style="font-size:3.5rem; margin-bottom:8px;">🏆</div>
          <h3 style="font-size:1.6rem; font-weight:900; color:#34d399; margin-bottom:8px;">
            ALL 15 RULES SORTED PERFECTLY!
          </h3>
          <p style="font-size:0.95rem; color:#f0fdf4; margin-bottom:20px;">
            You mastered positive Base Verbs and negative Don't imperatives with a ${playerSession.streak} streak!
          </p>
          <button class="btn-game-do" onclick="switchPhase(3)" style="font-size:1.2rem; padding:16px 36px;">
            🚀 Advance to Teleprompter Studio →
          </button>
        </div>
      `;
      if (upcomingContainer) upcomingContainer.innerHTML = '';
      ConfettiEngine.burst(90);
      return;
    }

    // Current Lead Showdown Card
    const currentMeme = playerSession.relayQueue[0];

    activeContainer.innerHTML = `
      <div class="showdown-active-card" id="showdownActiveCard" draggable="true" ondragstart="handleDragStart(event, '${currentMeme.id}')">
        <div class="showdown-avatar-box">
          ${currentMeme.svg}
        </div>
        <h3 class="showdown-card-title">${currentMeme.name}</h3>
        <div class="showdown-verb-tag">
          <span>⚡</span> <span>ACTION VERB: <strong>${currentMeme.verb.toUpperCase()}</strong></span>
        </div>
        <div class="showdown-rule-bubble">
          &ldquo;${currentMeme.ruleText}&rdquo;
        </div>
        
        <!-- TWO GIANT 3D ARCADE PUSH BUTTONS -->
        <div class="relay-action-buttons-row">
          <button type="button" class="btn-game-do" id="btnRelayDo" onclick="handleActiveSort('DO')" title="Shortcut: Press 'D'">
            <span style="font-size:1.4rem;">🟢</span>
            <span>DO! (Base Verb)</span>
          </button>
          <button type="button" class="btn-game-dont" id="btnRelayDont" onclick="handleActiveSort('DONT')" title="Shortcut: Press 'N'">
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
        upcomingContainer.innerHTML = '<span style="color:#64748b; font-size:0.82rem; font-style:italic;">Last meme in queue!</span>';
      } else {
        upcomingContainer.innerHTML = upcoming.map((m, idx) => `
          <div style="width:48px; height:48px; border-radius:12px; overflow:hidden; border:2px solid #334155; flex-shrink:0; opacity:${1 - (idx * 0.15)};" title="${m.name}: ${m.ruleText}">
            ${m.svg}
          </div>
        `).join('');
      }
    }
  }

  // Active Sorting Button Handler (for Lead Card)
  window.handleActiveSort = function(chosenType) {
    if (playerSession.relayQueue.length === 0) return;
    const currentMeme = playerSession.relayQueue[0];
    handleLaneSort(currentMeme.id, chosenType);
  };

  // Drag and Drop handlers
  let draggedMemeId = null;

  window.handleDragStart = function(e, memeId) {
    draggedMemeId = memeId;
    e.dataTransfer.setData('text/plain', memeId);
    e.currentTarget.classList.add('is-dragging');
    root.MemeAudio.playCardSnap();
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
    const meme = playerSession.relayQueue.find(m => m.id === memeId);
    if (!meme) return;

    const cardEl = document.getElementById('showdownActiveCard');

    if (meme.type === chosenType) {
      // SUCCESS SNAP
      root.MemeAudio.playCorrectChime();
      playerSession.streak++;
      addXP(meme.xp || 15);

      if (cardEl) {
        triggerScoreBurst(cardEl, `+${meme.xp || 15} XP!`);
      }

      // Remove from queue
      playerSession.relayQueue = playerSession.relayQueue.filter(m => m.id !== memeId);

      // Add to corresponding lane
      if (chosenType === 'DO') {
        playerSession.greenLaneItems.unshift(meme);
        renderLaneCards('greenLaneSlot', playerSession.greenLaneItems, 'DO');
      } else {
        playerSession.redLaneItems.unshift(meme);
        renderLaneCards('redLaneSlot', playerSession.redLaneItems, 'DONT');
      }

      // Hide hint if visible
      const hintBox = document.getElementById('relayHintMessage');
      if (hintBox) hintBox.style.display = 'none';

      // Read rule encouragement
      root.MemeAudio.speakPhrase(meme.ruleText);

      // Re-render showdown deck
      renderRelayQueue();

    } else {
      // SOFT FAIL PROTOCOL (Zero point penalty, streak reset, elastic wobble & hint)
      playerSession.streak = 0;
      updateHUD();
      root.MemeAudio.playSoftFail();

      if (cardEl) {
        cardEl.classList.remove('wobble-fail');
        void cardEl.offsetWidth; // Trigger reflow
        cardEl.classList.add('wobble-fail');
      }

      // Display supportive educational hint
      const hintBox = document.getElementById('relayHintMessage');
      if (hintBox) {
        hintBox.innerHTML = `💡 <strong>Coach Hint:</strong> ${meme.hint}`;
        hintBox.style.display = 'block';
      }

      root.MemeAudio.speakPhrase(meme.hint);
    }
  };

  function renderLaneCards(containerId, items, type) {
    const slot = document.getElementById(containerId);
    if (!slot) return;

    slot.innerHTML = items.map(m => `
      <div class="sorted-trophy-badge" style="border-left: 4px solid ${type === 'DO' ? '#10b981' : '#ef4444'};">
        <div style="width:40px; height:40px; border-radius:10px; overflow:hidden; flex-shrink:0;">${m.svg}</div>
        <div style="flex:1;">
          <strong style="font-size:0.9rem; color:#ffffff;">${m.name}</strong>
          <p style="font-size:0.8rem; color:${type === 'DO' ? '#a7f3d0' : '#fca5a5'}; margin-top:2px;">&ldquo;${m.ruleText}&rdquo;</p>
        </div>
        <span style="font-size:0.8rem; color:#facc15; font-weight:900;">+15 XP</span>
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
          setTimeout(() => btnDo.classList.remove('btn-active-key'), 150);
        }
      } else if (e.key === 'n' || e.key === 'N') {
        const btnDont = document.getElementById('btnRelayDont');
        if (btnDont) {
          btnDont.click();
          btnDont.classList.add('btn-active-key');
          setTimeout(() => btnDont.classList.remove('btn-active-key'), 150);
        }
      }
    });
  }

  // =========================================================================
  // PHASE 3: TELEPROMPTER STUDIO
  // =========================================================================
  function renderPhase3Studio() {
    const listContainer = document.getElementById('teleprompterMemesList');
    if (!listContainer) return;

    const studioMemes = root.MEME_RULES_DATA.teleprompterMemes;
    listContainer.innerHTML = studioMemes.map(m => {
      const isSelected = playerSession.activeStudioMeme.id === m.id;
      return `
        <div class="teleprompter-choice-card ${isSelected ? 'is-selected' : ''}" onclick="selectStudioMeme('${m.id}')">
          <div style="width:46px; height:46px; border-radius:12px; overflow:hidden; flex-shrink:0;">${m.svg}</div>
          <div style="flex:1;">
            <div style="font-size:0.95rem; font-weight:900; color:#fff;">${m.name}</div>
            <div style="font-size:0.78rem; color:#94a3b8; font-weight:600;">${m.rule}</div>
          </div>
          <span style="font-size:1.3rem;">${isSelected ? '🎙️' : '⚪'}</span>
        </div>
      `;
    }).join('');

    renderTeleprompterScript();
  }

  window.selectStudioMeme = function(memeId) {
    const found = root.MEME_RULES_DATA.teleprompterMemes.find(m => m.id === memeId);
    if (!found) return;

    playerSession.activeStudioMeme = found;
    root.MemeAudio.playCardSnap();
    renderPhase3Studio();
  };

  function renderTeleprompterScript() {
    const m = playerSession.activeStudioMeme;
    if (!m) return;

    const screenTitle = document.getElementById('teleprompterActiveMemeName');
    if (screenTitle) screenTitle.textContent = m.name;

    const line1 = document.getElementById('tpLine1');
    const line2 = document.getElementById('tpLine2');
    const line3 = document.getElementById('tpLine3');

    if (line1) line1.innerHTML = wrapWordsInSpans(m.sentence1);
    if (line2) line2.innerHTML = wrapWordsInSpans(m.sentence2);
    if (line3) line3.innerHTML = wrapWordsInSpans(m.sentence3);
  }

  function wrapWordsInSpans(text) {
    return text.split(' ').map((word, i) => `<span class="speech-word" id="word-${i}">${word}</span>`).join(' ');
  }

  window.readTeleprompterAloud = function() {
    if (playerSession.isSpeaking) return;
    const m = playerSession.activeStudioMeme;
    if (!m) return;

    playerSession.isSpeaking = true;
    const btn = document.getElementById('btnReadAloud');
    if (btn) btn.innerHTML = '<span>🔊</span> <span>Speaking Speech...</span>';

    const fullText = `${m.sentence1} ${m.sentence2} ${m.sentence3}`;
    const allWords = document.querySelectorAll('.speech-word');
    allWords.forEach(w => w.classList.remove('highlight-karaoke'));

    let currentWordIndex = 0;
    root.MemeAudio.speakPhrase(
      fullText,
      function(charIndex) {
        // Karaoke word highlight step
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
        root.MemeAudio.playCorrectChime();
        addXP(30);
      }
    );
  };

  window.finishLessonQuest = function() {
    root.MemeAudio.playVictoryFanfare();
    addXP(50);
    ConfettiEngine.burst(120);

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
