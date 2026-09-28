/**
 * CHUSEOK FESTIVAL: KOREA'S HARVEST FESTIVAL
 * Interactive Slide Engine, Micro-Task Controller, and Gamified Arcade Loop
 * Pure Vanilla ES6+ | Zero external framework dependencies
 */

(function(root) {
  'use strict';

  const DATA = root.CHUSEOK_DATA;
  const AUDIO = root.ChuseokAudio;

  class ChuseokApp {
    constructor() {
      this.currentSlideIndex = 0;
      this.totalSlides = DATA.slides.length;
      this.xpEarned = 0;
      this.streak = 0;
      
      // Interactive State per Slide
      this.stampedItems = new Set();
      this.crackedChests = new Set();
      this.teamBlueRolls = 5;
      this.teamRedRolls = 6;
      this.tfAnswers = {};
      this.gratitudeNotes = [
        { name: "Maya", thankfulFor: "family", reason: "they always smile and help me" },
        { name: "Leo", thankfulFor: "home", reason: "it keeps me warm and safe" }
      ];
      this.isSpinningWheel = false;
      this.wheelAngle = 0;
      this.jangguInterval = null;
      this.danceDirection = 'clockwise';
      this.vennPlacements = {};
      this.quizCurrentQuestion = 0;
      this.quizScore = 0;
      this.quizTimer = null;
      this.quizTimeLeft = 15;

      this.initDOMElements();
      this.bindEvents();
      this.renderSlide(0);
    }

    initDOMElements() {
      this.dom = {
        viewport: document.getElementById('slide-viewport'),
        slideBadge: document.getElementById('slide-badge-num'),
        timingBadge: document.getElementById('slide-timing-badge'),
        modalityBadge: document.getElementById('slide-modality-badge'),
        slideTitle: document.getElementById('slide-title-text'),
        audioBar: document.getElementById('audio-narration-bar'),
        audioScript: document.getElementById('audio-script-text'),
        audioPersona: document.getElementById('audio-persona-label'),
        btnAudioPlay: document.getElementById('btn-audio-play'),
        stageContent: document.getElementById('slide-stage-content'),
        teacherDrawer: document.getElementById('teacher-prompt-text'),
        xpCounter: document.getElementById('hud-xp-val'),
        dotsRail: document.getElementById('slide-dots-rail'),
        btnPrev: document.getElementById('btn-nav-prev'),
        btnNext: document.getElementById('btn-nav-next'),
        tabLesson1: document.getElementById('tab-lesson-1'),
        tabLesson2: document.getElementById('tab-lesson-2'),
        btnMute: document.getElementById('btn-audio-mute'),
        btnFullscreen: document.getElementById('btn-fullscreen')
      };

      this.buildDotsRail();
    }

    buildDotsRail() {
      if (!this.dom.dotsRail) return;
      this.dom.dotsRail.innerHTML = '';
      DATA.slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `slide-dot ${idx === 0 ? 'active' : ''}`;
        dot.title = `Slide ${idx + 1}`;
        dot.addEventListener('click', () => this.goToSlide(idx));
        this.dom.dotsRail.appendChild(dot);
      });
    }

    bindEvents() {
      if (this.dom.btnPrev) {
        this.dom.btnPrev.addEventListener('click', () => this.prevSlide());
      }
      if (this.dom.btnNext) {
        this.dom.btnNext.addEventListener('click', () => this.nextSlide());
      }
      if (this.dom.tabLesson1) {
        this.dom.tabLesson1.addEventListener('click', () => this.goToSlide(0));
      }
      if (this.dom.tabLesson2) {
        this.dom.tabLesson2.addEventListener('click', () => this.goToSlide(8));
      }
      if (this.dom.btnAudioPlay) {
        this.dom.btnAudioPlay.addEventListener('click', () => this.playCurrentSlideAudio());
      }
      if (this.dom.btnMute) {
        this.dom.btnMute.addEventListener('click', () => {
          const isMuted = AUDIO.toggleMute();
          this.dom.btnMute.textContent = isMuted ? '🔇 Unmute' : '🔊 Audio';
        });
      }
      if (this.dom.btnFullscreen) {
        this.dom.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
      }

      // Keyboard Hotkeys
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          this.nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          this.prevSlide();
        } else if (e.key === 'f' || e.key === 'F') {
          this.toggleFullscreen();
        }
      });
    }

    addXP(amount) {
      this.xpEarned += amount;
      if (this.dom.xpCounter) {
        this.dom.xpCounter.textContent = this.xpEarned;
      }
      AUDIO.playCorrect();

      // Route to platform-wide store if present
      if (root.AdventureAcademy && typeof root.AdventureAcademy.awardXP === 'function') {
        root.AdventureAcademy.awardXP(amount);
      } else if (root.schoolStore && typeof root.schoolStore.awardStudentXP === 'function') {
        const student = root.schoolStore.getCurrentStudent ? root.schoolStore.getCurrentStudent() : null;
        if (student) root.schoolStore.awardStudentXP(student.id, amount);
      }
    }

    goToSlide(index) {
      if (index < 0 || index >= this.totalSlides) return;
      this.cleanupPreviousSlide();
      this.currentSlideIndex = index;
      this.renderSlide(index);
    }

    nextSlide() {
      if (this.currentSlideIndex < this.totalSlides - 1) {
        this.goToSlide(this.currentSlideIndex + 1);
      }
    }

    prevSlide() {
      if (this.currentSlideIndex > 0) {
        this.goToSlide(this.currentSlideIndex - 1);
      }
    }

    cleanupPreviousSlide() {
      AUDIO.stopSpeech();
      if (this.jangguInterval) {
        clearInterval(this.jangguInterval);
        this.jangguInterval = null;
      }
      if (this.quizTimer) {
        clearInterval(this.quizTimer);
        this.quizTimer = null;
      }
    }

    playCurrentSlideAudio() {
      const slide = DATA.slides[this.currentSlideIndex];
      if (slide && slide.tts) {
        AUDIO.speakText(slide.tts.script, slide.tts.persona);
      }
    }

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    // ==========================================
    // SLIDE RENDERER ROUTER
    // ==========================================
    renderSlide(index) {
      const slide = DATA.slides[index];
      if (!slide) return;

      // Update Navigation & HUD State
      const currentLesson = slide.lessonId;
      if (this.dom.tabLesson1 && this.dom.tabLesson2) {
        this.dom.tabLesson1.classList.toggle('active', currentLesson === 1);
        this.dom.tabLesson2.classList.toggle('active', currentLesson === 2);
      }

      if (this.dom.slideBadge) this.dom.slideBadge.textContent = `Slide ${index + 1} of ${this.totalSlides}`;
      if (this.dom.timingBadge) this.dom.timingBadge.textContent = slide.timing;
      if (this.dom.modalityBadge) this.dom.modalityBadge.textContent = slide.modality;
      if (this.dom.slideTitle) this.dom.slideTitle.textContent = slide.title;
      if (this.dom.teacherDrawer) this.dom.teacherDrawer.textContent = slide.teacherPrompt || slide.summary;

      // Narration audio bar
      if (slide.tts) {
        if (this.dom.audioScript) this.dom.audioScript.textContent = `"${slide.tts.script}"`;
        if (this.dom.audioPersona) this.dom.audioPersona.textContent = slide.tts.persona;
        if (this.dom.audioBar) this.dom.audioBar.style.display = 'flex';
      } else {
        if (this.dom.audioBar) this.dom.audioBar.style.display = 'none';
      }

      // Update Dot Indicators
      if (this.dom.dotsRail) {
        const dots = this.dom.dotsRail.querySelectorAll('.slide-dot');
        dots.forEach((dot, dIdx) => dot.classList.toggle('active', dIdx === index));
      }

      // Route to slide-specific renderer
      const stage = this.dom.stageContent;
      stage.innerHTML = '';

      switch (slide.type) {
        case 'schema_activation':
          this.renderSlide1Holding(stage, slide);
          break;
        case 'vocab_reveal':
          this.renderSlide2Loom(stage, slide);
          break;
        case 'mystery_chests':
          this.renderSlide3Chests(stage, slide);
          break;
        case 'story_contest':
          this.renderSlide4Contest(stage, slide);
          break;
        case 'story_climax':
          this.renderSlide5KingFeast(stage, slide);
          break;
        case 'true_false_quiz':
          this.renderSlide6TrueFalse(stage, slide);
          break;
        case 'gratitude_board':
          this.renderSlide7GratitudeBoard(stage, slide);
          break;
        case 'milestone_badge':
          this.renderSlide8Milestones(stage, slide);
          break;
        case 'spin_wheel':
          this.renderSlide9SpinWheel(stage, slide);
          break;
        case 'tradition_spotlight':
          this.renderSlide10Hanbok(stage, slide);
          break;
        case 'food_cutaway':
          this.renderSlide11Songpyeon(stage, slide);
          break;
        case 'circle_dance':
          this.renderSlide12CircleDance(stage, slide);
          break;
        case 'ancestor_table':
          this.renderSlide13AncestorTable(stage, slide);
          break;
        case 'venn_diagram':
          this.renderSlide14Venn(stage, slide);
          break;
        case 'blooket_quiz':
          this.renderSlide15SpeedQuiz(stage, slide);
          break;
        case 'exit_ticket':
          this.renderSlide16ExitTicket(stage, slide);
          break;
        default:
          stage.innerHTML = `<p>${slide.summary}</p>`;
      }
    }

    // ==========================================
    // SLIDE 1: WHAT ARE YOU HOLDING?
    // ==========================================
    renderSlide1Holding(container, slide) {
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 12px;">
          <h3 style="color: var(--accent-cyan); font-size: 1.15rem; font-weight: 800;">
            🌟 Tap an item to stamp your gratitude!
          </h3>
          <p style="color: var(--text-muted); font-size: 0.88rem;">What makes your heart happy today?</p>
        </div>

        <div class="holding-items-grid">
          ${slide.items.map(item => `
            <div class="holding-item-card ${this.stampedItems.has(item.id) ? 'is-stamped' : ''}" data-item="${item.id}">
              <div class="holding-card-icon">${item.icon}</div>
              <h4 style="color:#ffffff; font-size: 1.05rem; font-weight:800; margin-bottom: 4px;">${item.name}</h4>
              <p style="color: var(--text-muted); font-size: 0.8rem;">${item.label}</p>
              ${this.stampedItems.has(item.id) ? `<span class="holding-stamp-badge">⭐</span>` : ''}
            </div>
          `).join('')}
        </div>

        <div class="sentence-scaffold-tray">
          <div>
            <span style="font-size:0.75rem; text-transform:uppercase; color: var(--accent-cyan); font-weight:800;">Speaking Scaffold</span>
            <div class="sentence-frame-text" id="slide1-sentence-preview">"I am thankful for my ______."</div>
          </div>
          <button type="button" class="btn-3d btn-3d-amber" id="btn-slide1-speak">
            🎤 Speak Sentence
          </button>
        </div>
      `;

      container.querySelectorAll('.holding-item-card').forEach(card => {
        card.addEventListener('click', () => {
          const itemId = card.dataset.item;
          const isStamped = this.stampedItems.has(itemId);
          if (isStamped) {
            this.stampedItems.delete(itemId);
          } else {
            this.stampedItems.add(itemId);
            AUDIO.playCorrect();
            this.addXP(10);
          }
          this.renderSlide1Holding(container, slide);
        });
      });

      const speakBtn = container.querySelector('#btn-slide1-speak');
      if (speakBtn) {
        speakBtn.addEventListener('click', () => {
          const firstStamped = slide.items.find(i => this.stampedItems.has(i.id)) || slide.items[0];
          AUDIO.speakText(`I am thankful for my ${firstStamped.label}.`);
        });
      }
    }

    // ==========================================
    // SLIDE 2: WEAVE & CLOTH (TPR & LOOM)
    // ==========================================
    renderSlide2Loom(container, slide) {
      container.innerHTML = `
        <div class="vocab-loom-stage">
          <div class="loom-interactive-box">
            <span style="font-size: 0.76rem; text-transform:uppercase; color: var(--accent-cyan); font-weight:800;">Action Verb</span>
            <h3 style="font-size: 1.8rem; font-weight: 900; color: #ffffff; margin: 4px 0;">🧵 WEAVE</h3>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 12px;">Move threads back and forth over and under.</p>
            
            <div class="loom-shuttle-track" id="shuttle-track">
              <div class="loom-shuttle-widget" id="loom-shuttle">🪵</div>
            </div>

            <button type="button" class="btn-3d btn-3d-cyan" id="btn-loom-slide">
              ⚡ Slide Shuttle (Clack Clack!)
            </button>
          </div>

          <div class="cloth-texture-box">
            <span style="font-size: 0.76rem; text-transform:uppercase; color: var(--accent-amber); font-weight:800;">Target Noun</span>
            <h3 style="font-size: 1.8rem; font-weight: 900; color: #ffffff; margin: 4px 0;">🧣 CLOTH</h3>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 12px;">The soft silk material woven on the loom.</p>
            
            <div style="background: linear-gradient(135deg, #0284c7, #f43f5e, #f59e0b); height: 90px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.5);">
              <span style="color:#ffffff; font-weight:900; letter-spacing: 0.05em; font-size: 1.1rem; text-shadow: 0 2px 6px rgba(0,0,0,0.6);">
                RICH WOVEN SILK
              </span>
            </div>

            <div style="margin-top: 14px; text-align: center;">
              <span style="font-size: 0.82rem; color: var(--accent-amber); font-weight: 800;">
                🙌 Physical TPR: Wave your hands side-to-side on camera!
              </span>
            </div>
          </div>
        </div>

        <div class="sentence-scaffold-tray">
          <div class="sentence-frame-text">"They <u>weave</u> <u>cloth</u> together."</div>
          <button type="button" class="btn-3d btn-3d-emerald" id="btn-loom-listen">
            🔊 Listen &amp; Repeat
          </button>
        </div>
      `;

      const shuttle = container.querySelector('#loom-shuttle');
      const slideBtn = container.querySelector('#btn-loom-slide');
      let dir = true;

      const triggerShuttle = () => {
        AUDIO.playLoomClack();
        shuttle.classList.remove('slide-right', 'slide-left');
        shuttle.classList.add(dir ? 'slide-right' : 'slide-left');
        dir = !dir;
        this.addXP(5);
      };

      if (slideBtn) slideBtn.addEventListener('click', triggerShuttle);
      if (shuttle) shuttle.addEventListener('click', triggerShuttle);

      const listenBtn = container.querySelector('#btn-loom-listen');
      if (listenBtn) {
        listenBtn.addEventListener('click', () => {
          AUDIO.speakText("They weave cloth together. Weave. Cloth.");
        });
      }
    }

    // ==========================================
    // SLIDE 3: MYSTERY WORD CRACKER (4 CHESTS)
    // ==========================================
    renderSlide3Chests(container, slide) {
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 8px;">
          <h3 style="color: var(--accent-amber); font-size: 1.15rem; font-weight: 800;">
            📦 Tap Each Korean Mystery Chest to Crack the Word!
          </h3>
          <p style="color: var(--text-muted); font-size: 0.86rem;">Match the clues to festival celebrations.</p>
        </div>

        <div class="mystery-chests-grid">
          ${slide.chests.map(chest => `
            <div class="mystery-chest-card ${this.crackedChests.has(chest.id) ? 'is-cracked' : ''}" data-chest="${chest.id}">
              <div class="chest-inner">
                <div class="chest-front">
                  <div class="chest-number">#${chest.id}</div>
                  <div class="chest-icon">🎁</div>
                  <p style="color: var(--accent-amber); font-size: 0.78rem; font-weight: 800; margin-top: 8px;">TAP TO UNLOCK</p>
                </div>
                <div class="chest-back">
                  <div style="font-size: 2.2rem; margin-bottom: 4px;">${chest.icon}</div>
                  <h3>${chest.word}</h3>
                  <p>${chest.def}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="sentence-scaffold-tray">
          <div style="color: var(--accent-cyan); font-weight: 800; font-size: 0.95rem;">
            Unlocked: ${this.crackedChests.size} of 4 Chests
          </div>
          <button type="button" class="btn-3d btn-3d-cyan" id="btn-chests-pronounce">
            🔊 Review Unlocked Words
          </button>
        </div>
      `;

      container.querySelectorAll('.mystery-chest-card').forEach(card => {
        card.addEventListener('click', () => {
          const cId = parseInt(card.dataset.chest, 10);
          if (!this.crackedChests.has(cId)) {
            this.crackedChests.add(cId);
            AUDIO.playChestUnlock();
            this.addXP(15);
            card.classList.add('is-cracked');
            const chestObj = slide.chests.find(c => c.id === cId);
            if (chestObj) AUDIO.speakText(`${chestObj.word}. ${chestObj.def}`);
          }
        });
      });

      const reviewBtn = container.querySelector('#btn-chests-pronounce');
      if (reviewBtn) {
        reviewBtn.addEventListener('click', () => {
          AUDIO.speakText("Contest. Harvest. Festival. Feast.");
        });
      }
    }

    // ==========================================
    // SLIDE 4: THE WEAVING CHALLENGE
    // ==========================================
    renderSlide4Contest(container, slide) {
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
          <div>
            <h3 style="color: #ffffff; font-size: 1.15rem; font-weight: 800;">
              👥 Team Blue vs Team Red: Who Can Weave More Cloth?
            </h3>
            <p style="color: var(--text-muted); font-size: 0.86rem;">They weave day and night for one whole month!</p>
          </div>
          <div style="background: rgba(245, 158, 11, 0.2); border: 1px solid var(--accent-amber); padding: 4px 12px; border-radius: 999px; font-weight: 800; font-size: 0.82rem; color: var(--text-gold);">
            ⏳ Duration: 1 Whole Month!
          </div>
        </div>

        <div class="teams-contest-stage">
          <div class="team-contest-box team-blue">
            <h4 style="color: var(--accent-cyan); font-size: 1.25rem; font-weight: 900;">💙 TEAM BLUE</h4>
            <div class="cloth-rolls-rack" id="blue-rack">
              ${Array.from({ length: this.teamBlueRolls }).map(() => `<span class="cloth-roll-icon">🧵</span>`).join('')}
            </div>
            <p style="font-weight: 800; font-size: 1.1rem; color: var(--accent-cyan);">Total Rolls: <span id="blue-count">${this.teamBlueRolls}</span></p>
            <button type="button" class="btn-3d btn-3d-cyan" id="btn-add-blue" style="margin-top: 10px;">
              + Weave Roll
            </button>
          </div>

          <div class="team-contest-box team-red">
            <h4 style="color: var(--accent-coral); font-size: 1.25rem; font-weight: 900;">❤️ TEAM RED</h4>
            <div class="cloth-rolls-rack" id="red-rack">
              ${Array.from({ length: this.teamRedRolls }).map(() => `<span class="cloth-roll-icon">🧵</span>`).join('')}
            </div>
            <p style="font-weight: 800; font-size: 1.1rem; color: var(--accent-coral);">Total Rolls: <span id="red-count">${this.teamRedRolls}</span></p>
            <button type="button" class="btn-3d btn-3d-amber" id="btn-add-red" style="margin-top: 10px;">
              + Weave Roll
            </button>
          </div>
        </div>

        <div class="sentence-scaffold-tray">
          <div class="sentence-frame-text">"Two teams have a <u>contest</u> to see who makes more cloth."</div>
          <button type="button" class="btn-3d btn-3d-emerald" id="btn-contest-narration">
            📖 Story Voice
          </button>
        </div>
      `;

      container.querySelector('#btn-add-blue').addEventListener('click', () => {
        this.teamBlueRolls++;
        container.querySelector('#blue-count').textContent = this.teamBlueRolls;
        const icon = document.createElement('span');
        icon.className = 'cloth-roll-icon';
        icon.textContent = '🧵';
        container.querySelector('#blue-rack').appendChild(icon);
        AUDIO.playLoomClack();
        this.addXP(5);
      });

      container.querySelector('#btn-add-red').addEventListener('click', () => {
        this.teamRedRolls++;
        container.querySelector('#red-count').textContent = this.teamRedRolls;
        const icon = document.createElement('span');
        icon.className = 'cloth-roll-icon';
        icon.textContent = '🧵';
        container.querySelector('#red-rack').appendChild(icon);
        AUDIO.playLoomClack();
        this.addXP(5);
      });

      container.querySelector('#btn-contest-narration').addEventListener('click', () => {
        AUDIO.speakText("Who can weave the most cloth? Two teams have a contest to find out. They weave and weave for a whole month!");
      });
    }

    // ==========================================
    // SLIDE 5: STORY CLIMAX (THE KING & THE FULL MOON)
    // ==========================================
    renderSlide5KingFeast(container, slide) {
      container.innerHTML = `
        <div style="background: radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.25) 0%, rgba(6, 9, 17, 0.95) 75%); border-radius: 20px; padding: 24px; text-align: center; border: 2px solid var(--accent-amber); margin: 12px 0;">
          <div style="font-size: 4rem; filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.6)); animation: floatBob 3s ease-in-out infinite;">
            🌕
          </div>
          <h3 style="font-size: 1.6rem; font-weight: 900; color: #ffffff; margin: 8px 0;">
            👑 The King's Royal Decree Under The Full Moon
          </h3>
          <p style="font-size: 1.1rem; color: var(--text-gold); font-weight: 800; max-width: 600px; margin: 0 auto 16px auto;">
            "The prize is a big feast for BOTH teams!"
          </p>

          <button type="button" class="btn-3d btn-3d-amber" id="btn-royal-voice" style="font-size: 1.05rem; padding: 12px 28px;">
            📢 Hear the King's Royal Voice
          </button>
        </div>

        <div class="sentence-scaffold-tray">
          <div style="display:flex; align-items:center; gap: 10px;">
            <span style="font-weight: 800; font-size: 1rem; color: #ffffff;">The Prize: A giant</span>
            <select id="select-king-prize" style="background:#1e293b; color:var(--text-gold); font-size:1rem; font-weight:800; padding:6px 12px; border-radius:8px; border:1px solid var(--accent-amber);">
              <option value="">-- Choose Word --</option>
              <option value="feast">FEAST 🍲</option>
              <option value="cloth">Cloth 🧣</option>
            </select>
            <span style="font-weight: 800; font-size: 1rem; color: #ffffff;">for everyone!</span>
          </div>
          <button type="button" class="btn-3d btn-3d-emerald" id="btn-check-king-prize">
            ✓ Check Answer
          </button>
        </div>
      `;

      container.querySelector('#btn-royal-voice').addEventListener('click', () => {
        AUDIO.playVictoryFanfare();
        AUDIO.speakText("It is the night of the full moon! This team wins! The prize is a big feast for both teams!", "marcus");
      });

      container.querySelector('#btn-check-king-prize').addEventListener('click', () => {
        const val = container.querySelector('#select-king-prize').value;
        if (val === 'feast') {
          AUDIO.playCorrect();
          this.addXP(20);
          alert("🎉 Correct! The King awarded a delicious feast to celebrate unity and hard work!");
        } else {
          AUDIO.playSoftFail();
          alert("Hint: They shared a giant, delicious meal together!");
        }
      });
    }

    // ==========================================
    // SLIDE 6: TRUE OR FALSE CARDS
    // ==========================================
    renderSlide6TrueFalse(container, slide) {
      container.innerHTML = `
        <div style="text-align:center; margin-bottom: 12px;">
          <h3 style="color: var(--accent-cyan); font-size: 1.15rem; font-weight: 800;">
            ⚡ Quick Recall Challenge: True or False?
          </h3>
          <p style="color: var(--text-muted); font-size: 0.86rem;">Select True (T) or False (F) for each reading fact.</p>
        </div>

        <div class="tf-cards-container">
          ${slide.questions.map((q, idx) => `
            <div class="tf-question-card" id="tf-card-${q.id}">
              <div style="display:flex; align-items:center; gap: 12px;">
                <span style="font-weight: 900; color: var(--accent-cyan); font-size: 1.1rem;">#${idx + 1}</span>
                <span style="font-size: 1rem; font-weight: 700; color: #f8fafc;">${q.text}</span>
              </div>
              <div class="tf-btn-group">
                <button type="button" class="btn-3d btn-3d-ghost btn-tf-choice" data-id="${q.id}" data-choice="true">
                  🟢 True
                </button>
                <button type="button" class="btn-3d btn-3d-ghost btn-tf-choice" data-id="${q.id}" data-choice="false">
                  🔴 False
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="sentence-scaffold-tray">
          <div style="color: var(--text-gold); font-weight: 800;" id="tf-feedback-banner">
            Choose your answers above to test your comprehension!
          </div>
          <button type="button" class="btn-3d btn-3d-cyan" id="btn-tf-readall">
            🔊 Read Questions
          </button>
        </div>
      `;

      container.querySelectorAll('.btn-tf-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          const qId = parseInt(btn.dataset.id, 10);
          const choice = btn.dataset.choice === 'true';
          const question = slide.questions.find(q => q.id === qId);
          const card = container.querySelector(`#tf-card-${qId}`);

          if (choice === question.correct) {
            card.classList.remove('incorrect');
            card.classList.add('correct');
            AUDIO.playCorrect();
            this.addXP(15);
            container.querySelector('#tf-feedback-banner').textContent = `✓ Question ${qId}: ${question.feedback}`;
          } else {
            card.classList.remove('correct');
            card.classList.add('incorrect');
            AUDIO.playSoftFail();
            container.querySelector('#tf-feedback-banner').textContent = `Try again: ${question.feedback}`;
          }
        });
      });

      container.querySelector('#btn-tf-readall').addEventListener('click', () => {
        AUDIO.speakText("One: The contest lasted for two days. Two: The king came on the night of the full moon. Three: Only the winning team got to eat the feast.");
      });
    }

    // ==========================================
    // SLIDE 7: GRATITUDE HARVEST SCROLL & WALL
    // ==========================================
    renderSlide7GratitudeBoard(container, slide) {
      container.innerHTML = `
        <div style="text-align:center; margin-bottom: 12px;">
          <h3 style="color: var(--accent-amber); font-size: 1.15rem; font-weight: 800;">
            🍁 The Class Gratitude Harvest Board
          </h3>
          <p style="color: var(--text-muted); font-size: 0.86rem;">What are you thankful for during harvest time?</p>
        </div>

        <div class="gratitude-composer-box">
          <input type="text" id="input-student-name" placeholder="Your Name" style="width: 140px;" />
          <span style="display:flex; align-items:center; font-weight:800; color:#cbd5e1;">I am thankful for my</span>
          <select id="select-thankful-target">
            ${slide.template.options1.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>
          <span style="display:flex; align-items:center; font-weight:800; color:#cbd5e1;">because they make me feel</span>
          <select id="select-thankful-reason">
            ${slide.template.options2.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>
          <button type="button" class="btn-3d btn-3d-amber" id="btn-pin-note">
            📌 Pin Card
          </button>
        </div>

        <div class="gratitude-cards-wall" id="gratitude-wall">
          ${this.gratitudeNotes.map(n => `
            <div class="pinned-gratitude-note">
              <h4>${n.name}'s Gratitude Card 🌾</h4>
              <p>"I am thankful for my <strong>${n.thankfulFor}</strong> because they make me feel <strong>${n.reason}</strong>."</p>
            </div>
          `).join('')}
        </div>
      `;

      const pinBtn = container.querySelector('#btn-pin-note');
      pinBtn.addEventListener('click', () => {
        const name = container.querySelector('#input-student-name').value.trim() || "Young Scholar";
        const target = container.querySelector('#select-thankful-target').value;
        const reason = container.querySelector('#select-thankful-reason').value;

        this.gratitudeNotes.unshift({ name, thankfulFor: target, reason });
        AUDIO.playCorrect();
        this.addXP(25);
        this.renderSlide7GratitudeBoard(container, slide);
        AUDIO.speakText(`${name} is thankful for ${target} because it makes them feel ${reason}!`);
      });
    }

    // ==========================================
    // SLIDE 8: LESSON 1 WRAP-UP BADGES
    // ==========================================
    renderSlide8Milestones(container, slide) {
      container.innerHTML = `
        <div style="text-align:center; padding: 24px;">
          <div style="font-size: 4rem; margin-bottom: 8px;">🏆</div>
          <h2 style="font-size: 2rem; font-weight: 900; color: #ffffff; margin-bottom: 6px;">
            LESSON 1 CLEARED!
          </h2>
          <p style="color: var(--accent-cyan); font-weight: 800; font-size: 1rem; margin-bottom: 24px;">
            Ancient Legend Master • The Weaving Mystery &amp; King's Feast
          </p>

          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 720px; margin: 0 auto 28px auto;">
            ${slide.badges.map(b => `
              <div style="background: rgba(30, 41, 59, 0.7); border: 2px solid var(--accent-amber); border-radius: 18px; padding: 18px; text-align: center;">
                <div style="font-size: 2.8rem; margin-bottom: 8px;">${b.icon}</div>
                <h4 style="color: var(--text-gold); font-size: 1.05rem; font-weight: 900;">${b.title}</h4>
                <p style="color: var(--text-muted); font-size: 0.78rem; margin-top: 4px;">${b.desc}</p>
              </div>
            `).join('')}
          </div>

          <div style="display:flex; justify-content:center; gap: 16px;">
            <button type="button" class="btn-3d btn-3d-amber" id="btn-claim-l1-xp">
              ⭐ Claim +100 Platform XP
            </button>
            <button type="button" class="btn-3d btn-3d-cyan" id="btn-goto-l2">
              🚀 Proceed to Lesson 2
            </button>
          </div>
        </div>
      `;

      container.querySelector('#btn-claim-l1-xp').addEventListener('click', () => {
        AUDIO.playVictoryFanfare();
        this.addXP(100);
        alert("🎉 +100 XP claimed! You are an Ancient Chuseok Legend Master!");
      });

      container.querySelector('#btn-goto-l2').addEventListener('click', () => {
        this.goToSlide(8);
      });
    }

    // ==========================================
    // LESSON 2: SLIDE 1 (SPIN THE WHEEL)
    // ==========================================
    renderSlide9SpinWheel(container, slide) {
      container.innerHTML = `
        <div class="wheel-stage-container">
          <div class="wheel-canvas-wrapper">
            <div class="wheel-needle"></div>
            <canvas id="prize-wheel-canvas" width="320" height="320"></canvas>
          </div>

          <div class="wheel-result-panel">
            <span style="font-size: 0.78rem; text-transform:uppercase; color: var(--accent-cyan); font-weight:800;">Fast Vocabulary Recall</span>
            <h3 id="wheel-selected-word" style="font-size: 2rem; font-weight: 900; color: #ffffff; margin: 10px 0;">
              SPIN TO PLAY
            </h3>
            <p id="wheel-selected-def" style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px;">
              Tap the button to spin the wheel and challenge your memory!
            </p>

            <button type="button" class="btn-3d btn-3d-amber" id="btn-spin-wheel" style="font-size: 1.1rem; padding: 12px 28px;">
              🎡 Spin the Wheel!
            </button>
          </div>
        </div>

        <div class="sentence-scaffold-tray">
          <div class="sentence-frame-text">Task: "Say the definition or make a sentence with the landed word!"</div>
          <button type="button" class="btn-3d btn-3d-cyan" id="btn-wheel-audio">
            🔊 Announce Word
          </button>
        </div>
      `;

      this.initWheelCanvas(container, slide);
    }

    initWheelCanvas(container, slide) {
      const canvas = container.querySelector('#prize-wheel-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const numItems = slide.wheelItems.length;
      const arc = (2 * Math.PI) / numItems;

      const drawWheel = (rotation) => {
        ctx.clearRect(0, 0, 320, 320);
        ctx.save();
        ctx.translate(160, 160);
        ctx.rotate(rotation);

        slide.wheelItems.forEach((item, i) => {
          const angle = i * arc;
          ctx.beginPath();
          ctx.fillStyle = item.color;
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, 150, angle, angle + arc);
          ctx.lineTo(0, 0);
          ctx.fill();
          ctx.stroke();

          // Text
          ctx.save();
          ctx.rotate(angle + arc / 2);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign = 'right';
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 4;
          ctx.fillText(item.word, 135, 6);
          ctx.restore();
        });

        // Center hub
        ctx.beginPath();
        ctx.arc(0, 0, 28, 0, 2 * Math.PI);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.restore();
      };

      drawWheel(this.wheelAngle);

      const spinBtn = container.querySelector('#btn-spin-wheel');
      spinBtn.addEventListener('click', () => {
        if (this.isSpinningWheel) return;
        this.isSpinningWheel = true;
        spinBtn.disabled = true;

        const extraRounds = 4 + Math.random() * 4;
        const targetOffset = Math.random() * 2 * Math.PI;
        const totalRotation = extraRounds * 2 * Math.PI + targetOffset;
        let start = null;
        const duration = 3200;
        const initialAngle = this.wheelAngle;

        let lastTick = 0;

        const animate = (time) => {
          if (!start) start = time;
          const elapsed = time - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          this.wheelAngle = initialAngle + totalRotation * ease;

          if (Math.floor(this.wheelAngle / (Math.PI / 6)) !== lastTick) {
            lastTick = Math.floor(this.wheelAngle / (Math.PI / 6));
            AUDIO.playWheelTick();
          }

          drawWheel(this.wheelAngle);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            this.isSpinningWheel = false;
            spinBtn.disabled = false;
            AUDIO.playCorrect();
            this.addXP(10);

            // Compute landed word (top needle is at -PI/2)
            const normalized = (2 * Math.PI - (this.wheelAngle % (2 * Math.PI)) - (Math.PI / 2) + 2 * Math.PI) % (2 * Math.PI);
            const index = Math.floor(normalized / arc) % numItems;
            const chosen = slide.wheelItems[index];

            container.querySelector('#wheel-selected-word').textContent = chosen.word;
            container.querySelector('#wheel-selected-def').textContent = chosen.def;
            AUDIO.speakText(`${chosen.word}. ${chosen.def}`);
          }
        };

        requestAnimationFrame(animate);
      });

      container.querySelector('#btn-wheel-audio').addEventListener('click', () => {
        const word = container.querySelector('#wheel-selected-word').textContent;
        const def = container.querySelector('#wheel-selected-def').textContent;
        AUDIO.speakText(`${word}. ${def}`);
      });
    }

    // ==========================================
    // LESSON 2: SLIDE 2 (HANBOK & MODERN FAMILY)
    // ==========================================
    renderSlide10Hanbok(container, slide) {
      container.innerHTML = `
        <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap: 20px; margin: 12px 0;">
          <div style="background: radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.2) 0%, rgba(6, 9, 17, 0.95) 75%); border: 2px solid var(--accent-cyan); border-radius: 20px; padding: 24px; text-align: center;">
            <div style="font-size: 5rem; margin-bottom: 8px;">👘</div>
            <h4 style="font-size: 1.5rem; font-weight: 900; color: #ffffff;">TRADITIONAL HANBOK</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">Bright silk clothes worn for celebration</p>
            <div style="margin-top: 14px; background: rgba(30, 41, 59, 0.8); padding: 10px; border-radius: 12px; border: 1px dashed var(--accent-amber);">
              <span style="font-size: 0.85rem; color: var(--text-gold); font-weight: 800;">
                ❤️ Tap to stamp a heart of respect on the family!
              </span>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap: 10px;">
            ${slide.facts.map(f => `
              <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 12px 16px; display:flex; align-items:center; gap: 12px;">
                <span style="font-size: 1.8rem;">${f.icon}</span>
                <div>
                  <div style="font-size: 0.74rem; text-transform:uppercase; color: var(--accent-cyan); font-weight: 800;">${f.label}</div>
                  <div style="font-size: 0.95rem; font-weight: 800; color: #ffffff;">${f.value}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="sentence-scaffold-tray">
          <div class="sentence-frame-text">"They travel home to see their <u>grandparents</u>."</div>
          <button type="button" class="btn-3d btn-3d-emerald" id="btn-hanbok-listen">
            🔊 Read Tradition
          </button>
        </div>
      `;

      container.querySelector('#btn-hanbok-listen').addEventListener('click', () => {
        AUDIO.speakText("Today, Chuseok lasts three days at the end of summer. Families travel home to celebrate and give thanks for the harvest.");
      });
    }

    // ==========================================
    // LESSON 2: SLIDE 3 (SONGPYEON RICE CAKES)
    // ==========================================
    renderSlide11Songpyeon(container, slide) {
      container.innerHTML = `
        <div class="songpyeon-showcase-box">
          <div class="songpyeon-hero-render">
            <div class="songpyeon-ricecake-icon" id="cake-interactive">🍡</div>
            <h4 style="font-size: 1.4rem; font-weight: 900; color: #ffffff; margin-top: 8px;">SONGPYEON (송편)</h4>
            <p style="color: var(--accent-emerald); font-weight: 800; font-size: 0.88rem;">Half-Moon Shaped Rice Cake</p>
            <button type="button" class="btn-3d btn-3d-amber" id="btn-cutaway-cake" style="margin-top: 14px;">
              🔪 Cut Open to Reveal Filling!
            </button>
            <div class="songpyeon-filling-reveal" id="cake-filling-box">
              🍯 Inside: Sweet Honey, Sesame Seeds &amp; Red Beans!
            </div>
          </div>

          <div style="display:flex; flex-direction:column; justify-content:center; gap: 14px;">
            <div style="background: rgba(15, 23, 42, 0.8); border: 1.5px solid var(--accent-emerald); border-radius: 18px; padding: 20px;">
              <h4 style="color: var(--text-gold); font-size: 1.1rem; font-weight: 800; margin-bottom: 8px;">
                ${slide.pollQuestion}
              </h4>
              <div style="display:flex; flex-direction:column; gap: 10px;">
                ${slide.pollOptions.map((opt, oIdx) => `
                  <button type="button" class="btn-3d btn-3d-ghost btn-poll-opt" data-idx="${oIdx}" style="text-align:left; justify-content:flex-start;">
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="sentence-scaffold-tray">
          <div class="sentence-frame-text">"Songpyeon tastes <u>sweet</u>, <u>chewy</u>, and <u>soft</u>!"</div>
          <button type="button" class="btn-3d btn-3d-cyan" id="btn-songpyeon-audio">
            🔊 Sensory Adjectives
          </button>
        </div>
      `;

      const cutawayBtn = container.querySelector('#btn-cutaway-cake');
      const cakeIcon = container.querySelector('#cake-interactive');
      const revealBox = container.querySelector('#cake-filling-box');

      const triggerCutaway = () => {
        revealBox.classList.add('is-active');
        AUDIO.playCorrect();
        this.addXP(15);
        AUDIO.speakText("Songpyeon! Inside, they are sweet, filled with honey, sesame, and beans!");
      };

      cutawayBtn.addEventListener('click', triggerCutaway);
      cakeIcon.addEventListener('click', triggerCutaway);

      container.querySelectorAll('.btn-poll-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          AUDIO.playCorrect();
          this.addXP(10);
          btn.style.borderColor = 'var(--accent-emerald)';
          btn.style.background = 'rgba(16, 185, 129, 0.25)';
        });
      });

      container.querySelector('#btn-songpyeon-audio').addEventListener('click', () => {
        AUDIO.speakText("Songpyeon tastes sweet, chewy, warm, and soft!");
      });
    }

    // ==========================================
    // LESSON 2: SLIDE 4 (GANGGANGSULLAE CIRCLE DANCE)
    // ==========================================
    renderSlide12CircleDance(container, slide) {
      container.innerHTML = `
        <div style="background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(6, 9, 17, 0.95) 75%); border: 2px solid var(--accent-violet); border-radius: 20px; padding: 24px; text-align: center; margin: 12px 0;">
          <div id="dance-circle-display" style="font-size: 3.8rem; letter-spacing: 0.2em; display: inline-block; transition: transform 0.5s ease;">
            💃 🌕 💃 🌕 💃
          </div>
          <h3 style="font-size: 1.6rem; font-weight: 900; color: #ffffff; margin: 10px 0;">
            GANGGANGSULLAE (강강술래)
          </h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 560px; margin: 0 auto 16px auto;">
            Under the full harvest moon, women and girls join hands to sing and dance in a giant circle.
          </p>

          <div style="display:flex; justify-content:center; gap: 14px;">
            <button type="button" class="btn-3d btn-3d-amber" id="btn-toggle-janggu">
              🥁 Start Janggu Drum Beat
            </button>
            <button type="button" class="btn-3d btn-3d-ghost" id="btn-toggle-dance-dir">
              🔄 Reverse Direction (<span id="dir-label">${this.danceDirection}</span>)
            </button>
          </div>
        </div>

        <div class="sentence-scaffold-tray">
          <div class="sentence-frame-text">"Under the full moon, they dance and sing in a circle."</div>
          <button type="button" class="btn-3d btn-3d-emerald" id="btn-dance-listen">
            🔊 Narrative Voice
          </button>
        </div>
      `;

      const drumBtn = container.querySelector('#btn-toggle-janggu');
      const circleDisplay = container.querySelector('#dance-circle-display');

      drumBtn.addEventListener('click', () => {
        if (this.jangguInterval) {
          clearInterval(this.jangguInterval);
          this.jangguInterval = null;
          drumBtn.textContent = '🥁 Start Janggu Drum Beat';
        } else {
          drumBtn.textContent = '⏸ Pause Drum Beat';
          let beat = 0;
          this.jangguInterval = setInterval(() => {
            AUDIO.playJangguDrum(beat % 2 === 1);
            circleDisplay.style.transform = `rotate(${beat * (this.danceDirection === 'clockwise' ? 12 : -12)}deg)`;
            beat++;
          }, 450);
          this.addXP(10);
        }
      });

      const dirBtn = container.querySelector('#btn-toggle-dance-dir');
      dirBtn.addEventListener('click', () => {
        this.danceDirection = this.danceDirection === 'clockwise' ? 'counter-clockwise' : 'clockwise';
        container.querySelector('#dir-label').textContent = this.danceDirection;
        AUDIO.playCorrect();
      });

      container.querySelector('#btn-dance-listen').addEventListener('click', () => {
        AUDIO.speakText("Under the full moon, women and girls join hands. They dance and sing together in a giant circle.");
      });
    }

    // ==========================================
    // LESSON 2: SLIDE 5 (ANCESTOR CEREMONY)
    // ==========================================
    renderSlide13AncestorTable(container, slide) {
      container.innerHTML = `
        <div style="text-align:center; margin-bottom: 12px;">
          <h3 style="color: var(--accent-amber); font-size: 1.15rem; font-weight: 800;">
            🍱 Honoring Ancestors: The Charye Memorial Table
          </h3>
          <p style="color: var(--text-muted); font-size: 0.86rem;">Match the ceremonial elements to their cultural meaning.</p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 16px 0;">
          ${slide.tableElements.map(el => `
            <div style="background: rgba(30, 41, 59, 0.7); border: 2px solid var(--accent-amber); border-radius: 18px; padding: 20px; text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 8px;">${el.icon}</div>
              <h4 style="color: var(--text-gold); font-size: 1.15rem; font-weight: 900;">${el.term}</h4>
              <p style="color: #e2e8f0; font-size: 0.85rem; margin-top: 6px;">${el.match}</p>
              <button type="button" class="btn-3d btn-3d-cyan btn-learn-ancestor" data-term="${el.term}" data-def="${el.match}" style="margin-top: 12px; font-size: 0.8rem; padding: 6px 14px;">
                Learn Respect
              </button>
            </div>
          `).join('')}
        </div>

        <div class="sentence-scaffold-tray">
          <div class="sentence-frame-text">"This shows they care about their <u>ancestors</u> and <u>family</u>."</div>
          <button type="button" class="btn-3d btn-3d-emerald" id="btn-ancestors-listen">
            🔊 Ceremony Narration
          </button>
        </div>
      `;

      container.querySelectorAll('.btn-learn-ancestor').forEach(b => {
        b.addEventListener('click', () => {
          AUDIO.playCorrect();
          this.addXP(15);
          AUDIO.speakText(`${b.dataset.term}. ${b.dataset.def}.`);
        });
      });

      container.querySelector('#btn-ancestors-listen').addEventListener('click', () => {
        AUDIO.speakText("Chuseok is also a time to remember ancestors. Ancestors are family members who lived long ago. Families bow and share harvest food to show love and respect.");
      });
    }

    // ==========================================
    // LESSON 2: SLIDE 6 (GLOBAL VENN DIAGRAM)
    // ==========================================
    renderSlide14Venn(container, slide) {
      container.innerHTML = `
        <div style="text-align:center; margin-bottom: 8px;">
          <h3 style="color: var(--accent-cyan); font-size: 1.15rem; font-weight: 800;">
            🌐 Harvest Around the World: Interactive Venn Diagram
          </h3>
          <p style="color: var(--text-muted); font-size: 0.86rem;">Click any tag below to place it into the correct category!</p>
        </div>

        <div class="venn-zones-container">
          <div class="venn-zone-box chuseok-zone" id="zone-chuseok">
            <h4 style="color: var(--accent-cyan); font-size: 1rem; font-weight: 900; margin-bottom: 8px;">
              🇰🇷 CHUSEOK ONLY
            </h4>
            <div class="zone-tag-slot" id="slot-chuseok"></div>
          </div>

          <div class="venn-zone-box both-zone" id="zone-both">
            <h4 style="color: var(--accent-amber); font-size: 1rem; font-weight: 900; margin-bottom: 8px;">
              🤝 BOTH / SHARED
            </h4>
            <div class="zone-tag-slot" id="slot-both"></div>
          </div>

          <div class="venn-zone-box world-zone" id="zone-world">
            <h4 style="color: var(--accent-emerald); font-size: 1rem; font-weight: 900; margin-bottom: 8px;">
              🌎 OUR HOLIDAY
            </h4>
            <div class="zone-tag-slot" id="slot-world"></div>
          </div>
        </div>

        <div style="margin-top: 10px;">
          <span style="font-size: 0.78rem; text-transform:uppercase; color: var(--text-muted); font-weight:800;">Available Tiles:</span>
          <div class="venn-draggable-tags" id="available-venn-tags">
            ${slide.tiles.map(tile => `
              <div class="draggable-tag-pill" data-id="${tile.id}" data-cat="${tile.category}">
                ${tile.text}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="sentence-scaffold-tray" style="margin-top: 14px;">
          <div class="sentence-frame-text">"Both holidays celebrate by <u>eating food together</u>."</div>
          <button type="button" class="btn-3d btn-3d-cyan" id="btn-venn-speak">
            🔊 Read Comparison
          </button>
        </div>
      `;

      container.querySelectorAll('.draggable-tag-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const cat = pill.dataset.cat;
          const slot = container.querySelector(cat === 'both' ? '#slot-both' : '#slot-chuseok');
          if (slot && !slot.contains(pill)) {
            slot.appendChild(pill);
            AUDIO.playCorrect();
            this.addXP(10);
          }
        });
      });

      container.querySelector('#btn-venn-speak').addEventListener('click', () => {
        AUDIO.speakText("People all around the world celebrate the harvest! Both holidays celebrate by eating together and giving thanks.");
      });
    }

    // ==========================================
    // LESSON 2: SLIDE 7 (SPEED QUIZ DASH)
    // ==========================================
    renderSlide15SpeedQuiz(container, slide) {
      const q = slide.quizQuestions[this.quizCurrentQuestion];

      container.innerHTML = `
        <div class="speed-quiz-hud">
          <div style="font-weight: 800; font-size: 1rem; color: #ffffff;">
            Question ${this.quizCurrentQuestion + 1} of ${slide.quizQuestions.length}
          </div>
          <div class="quiz-timer-pill" id="quiz-countdown">
            ⏱️ ${this.quizTimeLeft}s
          </div>
          <div class="quiz-streak-pill">
            🔥 Score: ${this.quizScore} pts
          </div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.85); border: 2px solid var(--accent-cyan); border-radius: 20px; padding: 24px; margin: 12px 0;">
          <h3 style="font-size: 1.45rem; font-weight: 900; color: #ffffff; text-align: center; margin-bottom: 20px;">
            ${q.q}
          </h3>

          <div class="speed-quiz-options-grid">
            ${q.options.map((opt, idx) => `
              <button type="button" class="quiz-option-button btn-quiz-opt" data-idx="${idx}">
                <span style="color: var(--accent-cyan); margin-right: 8px;">#${idx + 1}</span> ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      this.startQuizTimer(container, slide);

      container.querySelectorAll('.btn-quiz-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.quizTimer) clearInterval(this.quizTimer);
          const chosen = parseInt(btn.dataset.idx, 10);
          if (chosen === q.correct) {
            btn.classList.add('correct');
            AUDIO.playCorrect();
            this.quizScore += 25;
            this.addXP(25);
          } else {
            btn.classList.add('incorrect');
            AUDIO.playSoftFail();
          }

          setTimeout(() => {
            if (this.quizCurrentQuestion < slide.quizQuestions.length - 1) {
              this.quizCurrentQuestion++;
              this.quizTimeLeft = 15;
              this.renderSlide15SpeedQuiz(container, slide);
            } else {
              AUDIO.playVictoryFanfare();
              alert(`🏆 Final Harvest Quest Finished! Score: ${this.quizScore} pts!`);
            }
          }, 900);
        });
      });
    }

    startQuizTimer(container, slide) {
      if (this.quizTimer) clearInterval(this.quizTimer);
      const timerEl = container.querySelector('#quiz-countdown');

      this.quizTimer = setInterval(() => {
        this.quizTimeLeft--;
        if (timerEl) timerEl.textContent = `⏱️ ${this.quizTimeLeft}s`;
        if (this.quizTimeLeft <= 0) {
          clearInterval(this.quizTimer);
          AUDIO.playSoftFail();
          if (this.quizCurrentQuestion < slide.quizQuestions.length - 1) {
            this.quizCurrentQuestion++;
            this.quizTimeLeft = 15;
            this.renderSlide15SpeedQuiz(container, slide);
          }
        }
      }, 1000);
    }

    // ==========================================
    // LESSON 2: SLIDE 8 (EXIT TICKET)
    // ==========================================
    renderSlide16ExitTicket(container, slide) {
      container.innerHTML = `
        <div style="background: radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.25) 0%, rgba(6, 9, 17, 0.95) 75%); border-radius: 20px; padding: 28px; text-align: center; border: 2px solid var(--accent-amber); margin: 12px 0;">
          <div style="font-size: 4.5rem; margin-bottom: 6px;">✋</div>
          <h2 style="font-size: 1.8rem; font-weight: 900; color: #ffffff; margin-bottom: 6px;">
            THE GRATITUDE HANDPRINT EXIT TICKET
          </h2>
          <p style="color: var(--text-gold); font-weight: 800; font-size: 1rem; margin-bottom: 20px;">
            "Today I will say thank you to ______ for ______."
          </p>

          <div style="display:flex; justify-content:center; gap: 12px; max-width: 580px; margin: 0 auto 16px auto;">
            <input type="text" id="exit-person" placeholder="Person (e.g. Mom, my teacher)" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:10px; padding:10px 14px; font-weight:700; flex:1;" />
            <input type="text" id="exit-reason" placeholder="Reason (e.g. making delicious dinner)" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:10px; padding:10px 14px; font-weight:700; flex:1.5;" />
            <button type="button" class="btn-3d btn-3d-amber" id="btn-submit-exit">
              Send Ticket 🚀
            </button>
          </div>

          <div id="exit-ticket-success" style="display:none; color: var(--accent-emerald); font-weight: 900; font-size: 1.15rem; margin-top: 14px;">
            🎉 Exit Ticket Accepted! Graduation Certificate Cleared (+150 XP)!
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap: 16px; margin-top: 16px;">
          <a href="worksheet.html" target="_blank" class="btn-3d btn-3d-cyan" style="text-decoration:none;">
            📄 Open Companion Worksheet
          </a>
          <a href="../index.html" class="btn-3d btn-3d-ghost" style="text-decoration:none;">
            🏠 Return to Main LMS
          </a>
        </div>
      `;

      container.querySelector('#btn-submit-exit').addEventListener('click', () => {
        const person = container.querySelector('#exit-person').value.trim() || "my family";
        const reason = container.querySelector('#exit-reason').value.trim() || "all their love and support";

        AUDIO.playVictoryFanfare();
        this.addXP(150);
        container.querySelector('#exit-ticket-success').style.display = 'block';
        AUDIO.speakText(`Today I will say thank you to ${person} for ${reason}. Thank you for an amazing lesson!`);
      });
    }
  }

  root.ChuseokApp = ChuseokApp;

  // Auto-init upon DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    root.chuseokAppInstance = new ChuseokApp();
  });
})(typeof window !== 'undefined' ? window : global);
