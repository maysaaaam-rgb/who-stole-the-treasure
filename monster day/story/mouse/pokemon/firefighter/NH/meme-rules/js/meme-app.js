/**
 * Adventure Academy - Meme Rules Game Application
 * Reactive playerSession state machine, drag-and-drop arena, stamping engine, & karaoke teleprompter
 */

class MemeApp {
  constructor() {
    this.session = {
      phase: 1,
      xp: 0,
      energy: 20,
      phase1Cards: MEME_TOOLKIT.slice(0, 5),
      phase1Unlocked: new Set(),
      phase2Deck: MEME_TOOLKIT.slice(5, 20), // Memes 6 to 20 (15 cards)
      phase2Index: 0,
      phase2Score: 0,
      streak: 0,
      selectedMemeId: 6, // Default to Success Kid or first unlocked
      isProcessing: false,
      isBroadcasting: false
    };

    // Confetti engine instance
    this.confetti = new ConfettiController('confetti-canvas');

    // Bind methods
    this.init = this.init.bind(this);
    this.renderPhase1 = this.renderPhase1.bind(this);
    this.renderPhase2 = this.renderPhase2.bind(this);
    this.renderPhase3 = this.renderPhase3.bind(this);
  }

  init() {
    // Setup Navigation & Phase Stepper Buttons
    document.querySelectorAll('.phase-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const phase = parseInt(e.currentTarget.dataset.phase, 10);
        this.switchPhase(phase);
      });
    });

    // Sound Toggles
    const sfxBtn = document.getElementById('hud-sfx-toggle');
    if (sfxBtn) {
      sfxBtn.addEventListener('click', () => {
        const on = window.memeAudio.toggleSfx();
        sfxBtn.classList.toggle('muted', !on);
        this.showToast(on ? "🎵 Sound Effects: ON" : "🔇 Sound Effects: OFF");
      });
    }

    const voiceBtn = document.getElementById('hud-voice-toggle');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        const on = window.memeAudio.toggleVoice();
        voiceBtn.classList.toggle('muted', !on);
        this.showToast(on ? "🔊 Voice Narration: ON" : "🔇 Voice Narration: OFF");
      });
    }

    // Teacher menu toggle
    const teacherBtn = document.getElementById('hud-teacher-btn');
    const teacherModal = document.getElementById('teacher-menu-modal');
    if (teacherBtn && teacherModal) {
      teacherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        teacherModal.classList.toggle('show');
      });
      document.addEventListener('click', (e) => {
        if (!teacherModal.contains(e.target) && e.target !== teacherBtn) {
          teacherModal.classList.remove('show');
        }
      });
    }

    // Teacher jump shortcuts
    document.querySelectorAll('[data-jump-phase]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const phase = parseInt(e.currentTarget.dataset.jumpPhase, 10);
        if (teacherModal) teacherModal.classList.remove('show');
        this.switchPhase(phase);
      });
    });

    const resetBtn = document.getElementById('teacher-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (teacherModal) teacherModal.classList.remove('show');
        this.resetGame();
      });
    }

    // Start in Phase 1
    this.switchPhase(1);
    this.updateHUD();
  }

  showToast(msg, duration = 2200) {
    const toast = document.getElementById('game-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  updateHUD() {
    // XP Counter
    const xpEl = document.getElementById('hud-xp-display');
    if (xpEl) xpEl.textContent = `${this.session.xp} XP`;

    // Energy Bar
    const energyEl = document.getElementById('hud-energy-bar');
    if (energyEl) energyEl.style.width = `${Math.min(100, Math.max(10, this.session.energy))}%`;

    // Stepper buttons
    document.querySelectorAll('.phase-step-btn').forEach(btn => {
      const p = parseInt(btn.dataset.phase, 10);
      btn.classList.toggle('active', p === this.session.phase);
      btn.classList.toggle('completed', p < this.session.phase);
    });
  }

  switchPhase(phaseNum) {
    this.session.phase = phaseNum;
    window.memeAudio.playSnap();

    document.querySelectorAll('.game-screen').forEach(screen => screen.classList.remove('active'));

    if (phaseNum === 1) {
      document.getElementById('screen-phase-1').classList.add('active');
      this.renderPhase1();
    } else if (phaseNum === 2) {
      document.getElementById('screen-phase-2').classList.add('active');
      this.renderPhase2();
    } else if (phaseNum === 3) {
      document.getElementById('screen-phase-3').classList.add('active');
      this.renderPhase3();
    }

    this.updateHUD();
  }

  /* ==========================================================================
     PHASE 1: 3D FLIP FLASHCARDS (MEME SCANNER)
     ========================================================================== */
  renderPhase1() {
    const container = document.getElementById('scanner-cards-grid');
    const starsContainer = document.getElementById('scanner-stars-group');
    if (!container) return;

    container.innerHTML = '';
    if (starsContainer) {
      starsContainer.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.className = `scanner-star-slot ${this.session.phase1Unlocked.has(i + 1) ? 'unlocked' : ''}`;
        star.textContent = '⭐';
        starsContainer.appendChild(star);
      }
    }

    this.session.phase1Cards.forEach(meme => {
      const cardWrap = document.createElement('div');
      cardWrap.className = 'trading-card-container';
      cardWrap.dataset.id = meme.id;
      if (this.session.phase1Unlocked.has(meme.id)) {
        cardWrap.classList.add('flipped');
      }

      cardWrap.innerHTML = `
        <div class="trading-card-inner">
          <!-- Card Front -->
          <div class="card-face card-face-front">
            <div class="card-media">
              <span class="card-type-pill ${meme.type.toLowerCase()}">${meme.type}</span>
              <img class="card-img" src="${meme.img}" alt="${meme.name}" onerror="this.onerror=null; this.src='${meme.fallbackSvg}';">
            </div>
            <div class="card-caption-plate">
              <div class="card-caption-text">${meme.name}</div>
              <div class="card-verb-tag">Target Verb: ${meme.verb}</div>
            </div>
            <div class="flip-hint-pill">🔄 Tap to Scan & Flip</div>
          </div>

          <!-- Card Back -->
          <div class="card-face card-face-back">
            <div class="card-back-header">
              <div class="card-back-title">RULE UNLOCKED</div>
              <div class="card-star-badge">⭐</div>
            </div>
            <div class="card-back-body">
              <div class="card-back-rule-type ${meme.type.toLowerCase()}">
                ${meme.type === 'DO' ? '🟢 POSITIVE IMPERATIVE' : '🔴 NEGATIVE IMPERATIVE'}
              </div>
              <div class="card-back-imperative">"${meme.imperative}"</div>
              <div class="card-back-hint">${meme.hint}</div>
            </div>
            <div class="card-back-footer">
              <button class="btn-3d btn-amber-boost" style="padding: 6px 14px; font-size: 13px;" onclick="event.stopPropagation(); window.memeAudio.speak('${meme.speechVoiceText}');">
                🔊 Listen Again
              </button>
            </div>
          </div>
        </div>
      `;

      cardWrap.addEventListener('click', () => {
        this.handleCardFlip(meme, cardWrap);
      });

      container.appendChild(cardWrap);
    });

    // Advance button check
    const advanceBtn = document.getElementById('phase1-advance-btn');
    if (advanceBtn) {
      advanceBtn.style.display = this.session.phase1Unlocked.size === 5 ? 'inline-flex' : 'none';
      advanceBtn.onclick = () => this.switchPhase(2);
    }
  }

  handleCardFlip(meme, cardElement) {
    const isAlreadyUnlocked = this.session.phase1Unlocked.has(meme.id);
    cardElement.classList.toggle('flipped');
    window.memeAudio.playSnap();

    // Pronounce the core verb and rule via calibrated TTS
    window.memeAudio.speak(`${meme.verb}. ${meme.imperative}`);

    if (!isAlreadyUnlocked) {
      this.session.phase1Unlocked.add(meme.id);
      window.memeAudio.playXP();
      this.session.xp += 10;
      this.session.energy = Math.min(40, 20 + this.session.phase1Unlocked.size * 4);
      this.updateHUD();

      // Update Star UI
      const starSlots = document.querySelectorAll('.scanner-star-slot');
      if (starSlots[meme.id - 1]) {
        starSlots[meme.id - 1].classList.add('unlocked');
      }

      // Check if all 5 are scanned
      if (this.session.phase1Unlocked.size === 5) {
        this.session.xp += 50; // Bonus +50 XP
        this.session.energy = 45;
        this.updateHUD();
        window.memeAudio.playFanfare();
        this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 60);
        this.showToast("🎉 All 5 Discovery Memes Scanned! +50 XP Bonus!", 3500);

        const advanceBtn = document.getElementById('phase1-advance-btn');
        if (advanceBtn) {
          advanceBtn.style.display = 'inline-flex';
          advanceBtn.classList.add('card-spring-in');
        }

        setTimeout(() => {
          this.switchPhase(2);
        }, 2600);
      }
    }
  }

  /* ==========================================================================
     PHASE 2: GREEN LIGHT / RED LIGHT ARENA (FOCUS CARD SHOWDOWN)
     ========================================================================== */
  renderPhase2() {
    const dock = document.getElementById('arena-card-dock');
    const counterEl = document.getElementById('arena-card-counter');
    const hintBox = document.getElementById('arena-hint-box');
    if (!dock) return;

    // Check if showdown is completed
    if (this.session.phase2Index >= this.session.phase2Deck.length) {
      this.completePhase2();
      return;
    }

    const currentMeme = this.session.phase2Deck[this.session.phase2Index];
    if (counterEl) {
      counterEl.textContent = `Card ${this.session.phase2Index + 1} of ${this.session.phase2Deck.length}`;
    }
    if (hintBox) {
      hintBox.innerHTML = `<span>💡 Hint: Listen carefully & sort this classroom imperative!</span>`;
    }

    dock.innerHTML = `
      <div id="arena-active-card" class="arena-focus-card card-spring-in" draggable="true">
        <!-- Rubber Stamp Containers -->
        <div id="active-stamp-do" class="rubber-stamp stamp-do">STAMP: DO!</div>
        <div id="active-stamp-dont" class="rubber-stamp stamp-dont">STAMP: DON'T!</div>

        <!-- Top 65% Meme Image -->
        <div class="card-media">
          <img class="card-img" src="${currentMeme.img}" alt="${currentMeme.name}" onerror="this.onerror=null; this.src='${currentMeme.fallbackSvg}';">
        </div>

        <!-- Bottom 35% Chunky Caption Plate -->
        <div class="card-caption-plate">
          <div class="card-caption-text">"${currentMeme.imperative}"</div>
          <div class="card-verb-tag">Verb: ${currentMeme.verb}</div>
        </div>
      </div>
    `;

    // Read the imperative rule out loud automatically
    setTimeout(() => {
      window.memeAudio.speak(currentMeme.speechVoiceText);
    }, 350);

    // Attach Drag & Drop + Pointer handlers
    this.setupArenaInteractions(currentMeme);
  }

  setupArenaInteractions(currentMeme) {
    const card = document.getElementById('arena-active-card');
    const zoneDo = document.getElementById('zone-green-do');
    const zoneDont = document.getElementById('zone-red-dont');
    const btnDo = document.getElementById('arena-btn-do');
    const btnDont = document.getElementById('arena-btn-dont');

    if (!card) return;

    // Button Clicks
    if (btnDo) {
      btnDo.onclick = () => this.handleArenaAnswer('DO', currentMeme);
    }
    if (btnDont) {
      btnDont.onclick = () => this.handleArenaAnswer('DONT', currentMeme);
    }

    // Zone Clicks
    if (zoneDo) {
      zoneDo.onclick = (e) => {
        if (e.target !== btnDo) this.handleArenaAnswer('DO', currentMeme);
      };
    }
    if (zoneDont) {
      zoneDont.onclick = (e) => {
        if (e.target !== btnDont) this.handleArenaAnswer('DONT', currentMeme);
      };
    }

    // Desktop HTML5 Drag & Drop
    card.addEventListener('dragstart', (e) => {
      window.memeAudio.playSnap();
      e.dataTransfer.setData('text/plain', currentMeme.id);
      card.style.opacity = '0.6';
    });

    card.addEventListener('dragend', () => {
      card.style.opacity = '1';
    });

    [zoneDo, zoneDont].forEach(zone => {
      if (!zone) return;
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const chosenType = zone.dataset.type;
        this.handleArenaAnswer(chosenType, currentMeme);
      });
    });

    // Touch & Pointer Drag for Mobile/Tablets
    this.attachPointerSwipe(card, (direction) => {
      if (direction === 'left') {
        this.handleArenaAnswer('DO', currentMeme);
      } else if (direction === 'right') {
        this.handleArenaAnswer('DONT', currentMeme);
      }
    });
  }

  attachPointerSwipe(card, onSwipe) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;

    const onPointerDown = (e) => {
      if (this.session.isProcessing) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      card.style.transition = 'none';
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      currentX = e.clientX - startX;
      const rotate = currentX * 0.05;
      card.style.transform = `translate(${currentX}px, 0) rotate(${rotate}deg)`;

      // Visual feedback on zones
      const zoneDo = document.getElementById('zone-green-do');
      const zoneDont = document.getElementById('zone-red-dont');
      if (currentX < -60 && zoneDo) {
        zoneDo.classList.add('drag-over');
      } else if (zoneDo) {
        zoneDo.classList.remove('drag-over');
      }

      if (currentX > 60 && zoneDont) {
        zoneDont.classList.add('drag-over');
      } else if (zoneDont) {
        zoneDont.classList.remove('drag-over');
      }
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      card.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';

      const zoneDo = document.getElementById('zone-green-do');
      const zoneDont = document.getElementById('zone-red-dont');
      if (zoneDo) zoneDo.classList.remove('drag-over');
      if (zoneDont) zoneDont.classList.remove('drag-over');

      if (currentX < -90) {
        onSwipe('left');
      } else if (currentX > 90) {
        onSwipe('right');
      } else {
        card.style.transform = 'translate(0, 0) rotate(0deg)';
      }
    };

    card.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  handleArenaAnswer(chosenType, meme) {
    if (this.session.isProcessing) return;
    this.session.isProcessing = true;

    const isCorrect = (chosenType === meme.type);
    const card = document.getElementById('arena-active-card');
    const stampDo = document.getElementById('active-stamp-do');
    const stampDont = document.getElementById('active-stamp-dont');
    const hintBox = document.getElementById('arena-hint-box');

    if (isCorrect) {
      // Physical rubber stamp slam!
      window.memeAudio.playStamp();
      if (meme.type === 'DO' && stampDo) {
        stampDo.classList.add('active-stamp-do');
      } else if (stampDont) {
        stampDont.classList.add('active-stamp-dont');
      }

      // Success Sound & Confetti
      setTimeout(() => {
        window.memeAudio.playXP();
        const rect = card ? card.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2 };
        this.confetti.burst(rect.left + 150, rect.top + 200, 35);
      }, 180);

      // Score, Streak & Energy updates
      this.session.xp += 10;
      this.session.streak += 1;
      this.session.phase2Score += 1;
      const progressRatio = (this.session.phase2Index + 1) / this.session.phase2Deck.length;
      this.session.energy = Math.round(45 + progressRatio * 50);
      this.updateHUD();

      // Show positive toast
      const cheer = meme.type === 'DO' ? "✅ Excellent! Base Verb Imperative!" : "✅ Perfect! Negative 'Don't' Imperative!";
      this.showToast(cheer, 1800);

      // Transition to next card with elastic entrance
      setTimeout(() => {
        this.session.phase2Index += 1;
        this.session.isProcessing = false;
        this.renderPhase2();
      }, 850);

    } else {
      // Soft-Fail: Gentle wobble with zero score deductions
      window.memeAudio.playSoftFail();
      if (card) {
        card.classList.remove('card-spring-in');
        card.classList.add('card-soft-wobble');
        setTimeout(() => card.classList.remove('card-soft-wobble'), 500);
      }

      // Supportive ESL hint voiceover
      if (hintBox) {
        hintBox.innerHTML = `<span>💬 ${meme.hint}</span>`;
      }
      this.showToast(`Try again: ${meme.hint}`, 2800);
      window.memeAudio.speak(meme.hint);

      setTimeout(() => {
        this.session.isProcessing = false;
      }, 600);
    }
  }

  completePhase2() {
    window.memeAudio.playFanfare();
    this.session.xp += 40; // Completion reward
    this.session.energy = 95;
    this.updateHUD();
    this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
    this.showToast("🏆 Arena Mastered! Proceeding to Teleprompter Studio!", 3500);

    setTimeout(() => {
      this.switchPhase(3);
    }, 1800);
  }

  /* ==========================================================================
     PHASE 3: LIVE MEME TELEPROMPTER STUDIO (ORAL SHOWCASE)
     ========================================================================== */
  renderPhase3() {
    const posterImg = document.getElementById('studio-poster-img');
    const posterRule = document.getElementById('studio-poster-rule');
    const selector = document.getElementById('studio-meme-select');
    const scriptContainer = document.getElementById('teleprompter-script');
    const broadcastBtn = document.getElementById('studio-broadcast-btn');

    if (!posterImg || !scriptContainer) return;

    // Populate Selector with all 25 memes
    if (selector && selector.options.length === 0) {
      MEME_TOOLKIT.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = `${m.id}. ${m.name} (${m.type})`;
        if (m.id === this.session.selectedMemeId) opt.selected = true;
        selector.appendChild(opt);
      });

      selector.addEventListener('change', (e) => {
        this.session.selectedMemeId = parseInt(e.target.value, 10);
        window.memeAudio.playSnap();
        this.renderPhase3();
      });
    }

    const meme = MEME_TOOLKIT.find(m => m.id === this.session.selectedMemeId) || MEME_TOOLKIT[0];

    // Update Poster
    posterImg.src = meme.img;
    posterImg.onerror = () => { posterImg.src = meme.fallbackSvg; };
    if (posterRule) {
      posterRule.textContent = `"${meme.imperative}"`;
    }

    // 3-Part Structured Oral Speech
    const sentence1 = `This is our classroom meme: ${meme.name}.`;
    const sentence2 = `Our rule is: ${meme.imperative}`;
    const sentence3 = meme.type === 'DO' 
      ? `Remember: Always do this in class!` 
      : `Remember: Never do this in class!`;

    scriptContainer.innerHTML = `
      <div class="teleprompter-line" id="line-1">${this.wrapWordsInSpans(sentence1)}</div>
      <div class="teleprompter-line" id="line-2">${this.wrapWordsInSpans(sentence2)}</div>
      <div class="teleprompter-line" id="line-3">${this.wrapWordsInSpans(sentence3)}</div>
    `;

    // Attach Broadcast Action
    if (broadcastBtn) {
      broadcastBtn.onclick = () => {
        this.startTeleprompterBroadcast([sentence1, sentence2, sentence3]);
      };
    }
  }

  wrapWordsInSpans(sentence) {
    return sentence.split(' ').map(w => `<span class="k-word">${w}</span>`).join(' ');
  }

  startTeleprompterBroadcast(sentences) {
    if (this.session.isBroadcasting) return;
    this.session.isBroadcasting = true;

    const broadcastBtn = document.getElementById('studio-broadcast-btn');
    if (broadcastBtn) {
      broadcastBtn.disabled = true;
      broadcastBtn.textContent = '🎙️ ON AIR: BROADCASTING...';
    }

    let currentLineIndex = 0;

    const speakNextLine = () => {
      if (currentLineIndex >= sentences.length) {
        // Broadcast Finished!
        this.session.isBroadcasting = false;
        if (broadcastBtn) {
          broadcastBtn.disabled = false;
          broadcastBtn.textContent = '📢 BROADCAST TO CLASSROOM';
        }
        this.session.xp += 50;
        this.session.energy = 100;
        this.updateHUD();

        // Celebration Fanfare & Confetti
        window.memeAudio.playFanfare();
        this.confetti.burst(window.innerWidth / 2, window.innerHeight / 3, 100);
        this.showToast("🎉 Mission Accomplished! Master of Classroom Rules!", 4000);

        setTimeout(() => {
          this.showCelebrationModal();
        }, 1200);
        return;
      }

      // Highlight active line
      document.querySelectorAll('.teleprompter-line').forEach((l, idx) => {
        l.classList.toggle('active-line', idx === currentLineIndex);
      });

      const lineEl = document.getElementById(`line-${currentLineIndex + 1}`);
      const words = lineEl ? lineEl.querySelectorAll('.k-word') : [];
      let wordIdx = 0;

      const fullText = sentences[currentLineIndex];

      // Word tracking callback
      const onWord = (charIdx) => {
        if (wordIdx < words.length) {
          words.forEach(w => w.classList.remove('highlight'));
          words[wordIdx].classList.add('highlight');
          wordIdx++;
        }
      };

      // Speak line with TTS
      window.memeAudio.speak(fullText, onWord, () => {
        // Clean up word highlights for this line
        words.forEach(w => w.classList.remove('highlight'));
        currentLineIndex++;
        setTimeout(speakNextLine, 450);
      });
    };

    speakNextLine();
  }

  showCelebrationModal() {
    const modal = document.getElementById('celebration-modal');
    if (!modal) return;

    document.getElementById('modal-final-xp').textContent = `${this.session.xp} XP`;
    document.getElementById('modal-final-rules').textContent = `${this.session.phase2Score + 5}/20`;
    document.getElementById('modal-final-streak').textContent = `${this.session.streak} 🔥`;

    modal.classList.add('show');

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.remove('show');
    }
  }

  resetGame() {
    this.session.xp = 0;
    this.session.energy = 20;
    this.session.phase1Unlocked.clear();
    this.session.phase2Index = 0;
    this.session.phase2Score = 0;
    this.session.streak = 0;
    this.switchPhase(1);
    this.showToast("🔄 Game Progress Reset!");
  }
}

/* ==========================================================================
   PURE ZERO-DEPENDENCY CONFETTI ENGINE
   ========================================================================== */
class ConfettiController {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animating = false;
    this.colors = ['#10b981', '#34d399', '#ef4444', '#f87171', '#f59e0b', '#fbbf24', '#06b6d4', '#a855f7'];

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x, y, count = 40) {
    if (!this.canvas || !this.ctx) return;
    this.resize();

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x: x || window.innerWidth / 2,
        y: y || window.innerHeight / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 6 + Math.random() * 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        life: 1,
        decay: 0.012 + Math.random() * 0.012
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.loop();
    }
  }

  loop() {
    if (!this.particles.length) {
      this.animating = false;
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // Gravity
      p.vx *= 0.98; // Air drag
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.loop());
  }
}

// Global Launcher
window.addEventListener('DOMContentLoaded', () => {
  window.app = new MemeApp();
  window.app.init();
});
