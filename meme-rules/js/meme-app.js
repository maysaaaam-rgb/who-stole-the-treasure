/**
 * ADVENTURE ACADEMY: MEME RULES GAME CONTROLLER
 * Reactive playerSession State Machine, Drag-Drop Sorting & Teleprompter Studio
 */
(function(root) {
  'use strict';

  const playerSession = {
    xp: 0,
    energy: 20,
    currentPhase: 1,
    inventory: [],
    relayQueue: [],
    greenLaneItems: [],
    redLaneItems: [],
    activeStudioMeme: null,
    isSpeaking: false
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

    renderPhase1Scanner();
    renderPhase2Workbench();
    renderPhase3Studio();
    updateHUD();
  }

  // --- HUD UPDATES ---
  function updateHUD() {
    const xpEl = document.getElementById('hudXP');
    if (xpEl) xpEl.textContent = `⭐ +${playerSession.xp} XP`;

    const fillEl = document.getElementById('hudEnergyFill');
    if (fillEl) fillEl.style.width = `${Math.min(100, Math.max(10, playerSession.energy))}%`;

    const meterNumEl = document.getElementById('hudEnergyNumber');
    if (meterNumEl) meterNumEl.textContent = `${Math.round(playerSession.energy)}%`;
  }

  function addXP(amount) {
    playerSession.xp += amount;
    playerSession.energy = Math.min(100, playerSession.energy + (amount * 0.4));
    updateHUD();

    // Synchronize to Adventure Academy master school store if embedded
    try {
      if (window.parent && window.parent.store && typeof window.parent.store.giveXP === 'function') {
        window.parent.store.giveXP('student-3a-224', amount, 'Meme Rules Quest');
      }
    } catch (e) {}
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
            <span>🔤</span> <span>Verb: <strong>${m.coreVerb}</strong></span>
          </div>
          <p class="scanner-sentence">&ldquo;${m.sentence}&rdquo;</p>
          <div class="scanner-badge-status ${isCollected ? 'collected' : 'locked'}" id="badgeStatus-${m.id}">
            ${isCollected ? `✓ ${m.badge}` : `🔒 Tap to Scan &amp; Collect`}
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
      if (cardEl) cardEl.classList.add('is-scanned');

      const badgeEl = document.getElementById(`badgeStatus-${memeId}`);
      if (badgeEl) {
        badgeEl.className = 'scanner-badge-status collected';
        badgeEl.textContent = `✓ ${meme.badge} (+20 XP)`;
      }

      // Check if all 5 scanned
      if (playerSession.inventory.length === root.MEME_RULES_DATA.scannerMemes.length) {
        document.getElementById('phase1SuccessNotice').style.display = 'flex';
        root.MemeAudio.playVictoryFanfare();
      }
    }
  };

  // =========================================================================
  // PHASE 2: GREEN LIGHT / RED LIGHT WORKBENCH
  // =========================================================================
  function renderPhase2Workbench() {
    renderRelayQueue();
    setupDropzoneListeners();
  }

  function renderRelayQueue() {
    const queueContainer = document.getElementById('relayQueueCarousel');
    const queueCounter = document.getElementById('queueRemainingCount');
    if (!queueContainer) return;

    if (queueCounter) {
      queueCounter.textContent = `${playerSession.relayQueue.length} Memes Remaining`;
    }

    if (playerSession.relayQueue.length === 0) {
      queueContainer.innerHTML = `
        <div style="width:100%; text-align:center; padding:24px; color:#10b981; font-weight:800; font-size:1.05rem;">
          🎉 ALL 15 MEME RULES SORTED PERFECTLY!
          <div style="margin-top:10px;">
            <button class="btn-teleprompter btn-claim-mastery" onclick="switchPhase(3)">
              🚀 Advance to Phase 3: Teleprompter Studio →
            </button>
          </div>
        </div>
      `;
      return;
    }

    queueContainer.innerHTML = playerSession.relayQueue.map(m => {
      return `
        <div class="relay-meme-card" id="relayCard-${m.id}" draggable="true" ondragstart="handleDragStart(event, '${m.id}')">
          <div class="relay-card-top">
            <div class="relay-mini-avatar">${m.svg}</div>
            <div class="relay-card-info">
              <h4>${m.name}</h4>
              <span class="relay-verb-badge">Key Verb: ${m.verb}</span>
            </div>
          </div>
          <div class="relay-rule-text">&ldquo;${m.ruleText}&rdquo;</div>
          <div class="relay-card-buttons">
            <button type="button" class="btn-send-lane btn-send-green" onclick="handleLaneSort('${m.id}', 'DO')">
              🟢 DO
            </button>
            <button type="button" class="btn-send-lane btn-send-red" onclick="handleLaneSort('${m.id}', 'DONT')">
              🔴 DON'T
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Drag and Drop listeners
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

    if (meme.type === chosenType) {
      // SUCCESS SNAP
      root.MemeAudio.playCorrectChime();
      addXP(meme.xp || 15);

      // Remove from queue
      playerSession.relayQueue = playerSession.relayQueue.filter(m => m.id !== memeId);

      // Add to corresponding lane
      if (chosenType === 'DO') {
        playerSession.greenLaneItems.push(meme);
        renderLaneCards('greenLaneSlot', playerSession.greenLaneItems, 'DO');
      } else {
        playerSession.redLaneItems.push(meme);
        renderLaneCards('redLaneSlot', playerSession.redLaneItems, 'DONT');
      }

      renderRelayQueue();

      // Read rule encouragement
      root.MemeAudio.speakPhrase(meme.ruleText);

    } else {
      // SOFT FAIL PROTOCOL (Elastic wobble + audio hint, zero point penalty)
      root.MemeAudio.playSoftFail();
      const cardEl = document.getElementById(`relayCard-${memeId}`);
      if (cardEl) {
        cardEl.classList.remove('wobble-fail');
        void cardEl.offsetWidth; // Trigger reflow
        cardEl.classList.add('wobble-fail');
      }

      // Display hint
      const hintBox = document.getElementById('relayHintMessage');
      if (hintBox) {
        hintBox.innerHTML = `💡 <strong>Hint:</strong> ${meme.hint}`;
        hintBox.style.display = 'block';
      }

      root.MemeAudio.speakPhrase(meme.hint);
    }
  };

  function renderLaneCards(containerId, items, type) {
    const slot = document.getElementById(containerId);
    if (!slot) return;

    slot.innerHTML = items.map(m => `
      <div style="background:rgba(15,23,42,0.85); border:1px solid ${type === 'DO' ? '#10b981' : '#f43f5e'}; border-radius:10px; padding:10px; display:flex; align-items:center; gap:10px;">
        <div style="width:34px; height:34px; border-radius:8px; overflow:hidden; flex-shrink:0;">${m.svg}</div>
        <div style="flex:1;">
          <strong style="font-size:0.84rem; color:#ffffff;">${m.name}</strong>
          <p style="font-size:0.78rem; color:${type === 'DO' ? '#a7f3d0' : '#fbcfe8'}; margin-top:2px;">&ldquo;${m.ruleText}&rdquo;</p>
        </div>
        <span style="font-size:0.75rem; color:#fbbf24; font-weight:800;">+15 XP</span>
      </div>
    `).join('');
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
        <div class="choice-item ${isSelected ? 'is-selected' : ''}" onclick="selectStudioMeme('${m.id}')" style="cursor:pointer; padding:10px; border-radius:10px;">
          <div style="width:38px; height:38px; border-radius:8px; overflow:hidden; flex-shrink:0;">${m.svg}</div>
          <div style="flex:1;">
            <div style="font-size:0.86rem; font-weight:800; color:#fff;">${m.name}</div>
            <div style="font-size:0.74rem; color:#94a3b8;">${m.rule}</div>
          </div>
          <span style="font-size:1.1rem;">${isSelected ? '🎙️' : '⚪'}</span>
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

    const modal = document.getElementById('completionModal');
    if (modal) modal.classList.add('is-active');

    const totalXpEl = document.getElementById('diplomaTotalXP');
    if (totalXpEl) totalXpEl.textContent = `${playerSession.xp} XP`;
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
