/**
 * CHUSEOK FESTIVAL: KOREA'S HARVEST FESTIVAL (REVISED ARCHITECTURE)
 * Photorealistic Image Layer Controller • ElevenLabs v2 SSML Speech Dispatcher • Distraction-Free UI
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

      // State per interactive slide
      this.stampedItems = new Set();
      this.crackedChests = new Set();
      this.teamBlueRolls = 5;
      this.teamRedRolls = 6;
      this.tfAnswers = {};
      this.gratitudeNotes = [
        { name: "Maya", person: "my mom", reason: "she always helps me learn and smile" },
        { name: "Leo", person: "my teacher", reason: "she is patient and kind" }
      ];
      this.frostedTilesUnlocked = new Set();
      this.jangguInterval = null;
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
      if (slide && slide.ssml) {
        AUDIO.speakSSML(slide.ssml, slide.voicePersona || 'sarah');
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
    // SLIDE DISPATCHER
    // ==========================================
    renderSlide(index) {
      const slide = DATA.slides[index];
      if (!slide) return;

      const currentLesson = slide.lessonId;
      if (this.dom.tabLesson1 && this.dom.tabLesson2) {
        this.dom.tabLesson1.classList.toggle('active', currentLesson === 1);
        this.dom.tabLesson2.classList.toggle('active', currentLesson === 2);
      }

      if (this.dom.slideBadge) this.dom.slideBadge.textContent = `Slide ${index + 1} of ${this.totalSlides}`;
      if (this.dom.timingBadge) this.dom.timingBadge.textContent = slide.timing;
      if (this.dom.modalityBadge) this.dom.modalityBadge.textContent = slide.modality;
      if (this.dom.slideTitle) this.dom.slideTitle.textContent = slide.title;
      if (this.dom.teacherDrawer) this.dom.teacherDrawer.textContent = slide.teacherProtocol || slide.summary;

      if (slide.ssml) {
        const cleanScript = slide.ssml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (this.dom.audioScript) this.dom.audioScript.textContent = `"${cleanScript}"`;
        if (this.dom.audioPersona) this.dom.audioPersona.textContent = `${slide.voicePersona} (ElevenLabs v2)`;
        if (this.dom.audioBar) this.dom.audioBar.style.display = 'flex';
      } else {
        if (this.dom.audioBar) this.dom.audioBar.style.display = 'none';
      }

      if (this.dom.dotsRail) {
        const dots = this.dom.dotsRail.querySelectorAll('.slide-dot');
        dots.forEach((dot, dIdx) => dot.classList.toggle('active', dIdx === index));
      }

      const stage = this.dom.stageContent;
      stage.innerHTML = '';

      switch (slide.type) {
        case 'photorealistic_opener':
          this.renderSlide1Opener(stage, slide);
          break;
        case 'photorealistic_loom':
          this.renderSlide2Loom(stage, slide);
          break;
        case 'lacquered_chests':
          this.renderSlide3Chests(stage, slide);
          break;
        case 'weaving_battle':
          this.renderSlide4Battle(stage, slide);
          break;
        case 'king_climax':
          this.renderSlide5King(stage, slide);
          break;
        case 'photorealistic_tf':
          this.renderSlide6TrueFalse(stage, slide);
          break;
        case 'digital_scroll':
          this.renderSlide7Scroll(stage, slide);
          break;
        case 'milestone_badge':
          this.renderSlide8Milestone(stage, slide);
          break;
        case 'frosted_reveal':
          this.renderSlide9Frosted(stage, slide);
          break;
        case 'photorealistic_songpyeon':
          this.renderSlide10Songpyeon(stage, slide);
          break;
        case 'ganggangsullae_view':
          this.renderSlide11Dance(stage, slide);
          break;
        case 'ancestor_charye_view':
          this.renderSlide12Ancestors(stage, slide);
          break;
        case 'venn_comparison':
          this.renderSlide13Venn(stage, slide);
          break;
        case 'arcade_dash':
          this.renderSlide14Arcade(stage, slide);
          break;
        case 'gratitude_tree':
          this.renderSlide15Tree(stage, slide);
          break;
        case 'unit_certificate':
          this.renderSlide16Certificate(stage, slide);
          break;
        default:
          stage.innerHTML = `<p>${slide.summary}</p>`;
      }
    }

    // ==========================================
    // SLIDE 1: PHOTOREALISTIC GRATITUDE OPENER
    // ==========================================
    renderSlide1Opener(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 20px; align-items: center; margin: 10px 0;">
          <div style="position: relative; border-radius: 20px; overflow: hidden; border: 2px solid var(--accent-cyan); box-shadow: var(--shadow-glass);">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(6,9,17,0.95), transparent); padding: 16px 20px;">
              <span style="font-size: 0.76rem; text-transform: uppercase; color: var(--accent-cyan); font-weight: 800;">4K Macro Composite</span>
              <p style="font-size: 0.9rem; color: #ffffff; font-weight: 700;">Hands holding treasured gifts with care</p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <h3 style="font-size: 1.25rem; font-weight: 900; color: #ffffff;">
              ${slide.headerText}
            </h3>
            <p style="color: var(--text-muted); font-size: 0.88rem;">Select your favorite item to stamp your star ⭐:</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              ${slide.items.map(item => `
                <div class="holding-item-card ${this.stampedItems.has(item.id) ? 'is-stamped' : ''}" data-item="${item.id}" style="padding: 14px 10px;">
                  <h4 style="color:#ffffff; font-size: 0.95rem; font-weight:800;">${item.label}</h4>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${item.name}</span>
                  ${this.stampedItems.has(item.id) ? `<span class="holding-stamp-badge">⭐</span>` : ''}
                </div>
              `).join('')}
            </div>

            <div style="background: rgba(6, 9, 17, 0.8); border: 1.5px solid var(--accent-amber); border-radius: 14px; padding: 12px 16px; margin-top: 6px;">
              <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--accent-amber); font-weight: 800;">Speaking Frame:</span>
              <div style="font-size: 1.1rem; font-weight: 900; color: var(--text-gold); margin-top: 4px;">
                "${slide.sentenceFrame}"
              </div>
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll('.holding-item-card').forEach(card => {
        card.addEventListener('click', () => {
          const itemId = card.dataset.item;
          if (this.stampedItems.has(itemId)) {
            this.stampedItems.delete(itemId);
          } else {
            this.stampedItems.add(itemId);
            AUDIO.playCorrect();
            this.addXP(10);
          }
          this.renderSlide1Opener(container, slide);
        });
      });
    }

    // ==========================================
    // SLIDE 2: WEAVE & CLOTH (MACRO LOOM)
    // ==========================================
    renderSlide2Loom(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 20px; align-items: center; margin: 10px 0;">
          <div style="position: relative; border-radius: 20px; overflow: hidden; border: 2px solid var(--accent-cyan); box-shadow: var(--shadow-glass); cursor: pointer;" id="loom-photo-box">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
            <div style="position: absolute; top: 12px; right: 12px; background: rgba(6,9,17,0.85); border: 1px solid var(--accent-cyan); padding: 4px 10px; border-radius: 8px; font-size: 0.76rem; font-weight: 800; color: var(--accent-cyan);">
              🔊 Click Image to Hear Shuttle Clack
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${slide.vocabCards.map(c => `
              <div style="background: rgba(30, 41, 59, 0.7); border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 14px 18px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 1.8rem;">${c.icon}</span>
                  <div>
                    <h4 style="font-size: 1.25rem; font-weight: 900; color: #ffffff;">${c.word}</h4>
                    <p style="font-size: 0.82rem; color: var(--accent-cyan); font-weight: 700;">${c.def}</p>
                  </div>
                </div>
                <div style="margin-top: 8px; font-size: 0.8rem; color: var(--text-gold); font-weight: 700;">
                  👉 ${c.tip}
                </div>
              </div>
            `).join('')}

            <div style="background: rgba(6, 9, 17, 0.8); border: 1px solid var(--accent-emerald); border-radius: 14px; padding: 12px 16px;">
              <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--accent-emerald); font-weight: 800;">Target Sentence:</span>
              <div style="font-size: 1.05rem; font-weight: 900; color: #ffffff; margin-top: 4px;">
                "${slide.sentenceFrame}"
              </div>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#loom-photo-box').addEventListener('click', () => {
        AUDIO.playLoomClack();
        this.addXP(5);
      });
    }

    // ==========================================
    // SLIDE 3: LACQUERED CHESTS (MARCUS PROMPT)
    // ==========================================
    renderSlide3Chests(container, slide) {
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 8px;">
          <h3 style="color: var(--accent-amber); font-size: 1.2rem; font-weight: 900;">
            📦 Four Vintage Lacquered Korean Treasure Chests
          </h3>
          <p style="color: var(--text-muted); font-size: 0.86rem;">Vote 1, 2, 3, or 4 in the chat! Tap to unlock mother-of-pearl latch.</p>
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
      `;

      container.querySelectorAll('.mystery-chest-card').forEach(card => {
        card.addEventListener('click', () => {
          const cId = parseInt(card.dataset.chest, 10);
          if (!this.crackedChests.has(cId)) {
            this.crackedChests.add(cId);
            AUDIO.playChestUnlock();
            this.addXP(15);
            card.classList.add('is-cracked');
          }
        });
      });
    }

    // ==========================================
    // SLIDE 4: THE 30-DAY WEAVING BATTLE
    // ==========================================
    renderSlide4Battle(container, slide) {
      container.innerHTML = `
        <div style="background: rgba(15, 23, 42, 0.8); border: 2px solid var(--accent-cyan); border-radius: 18px; padding: 20px; margin-bottom: 14px;">
          <span style="font-size: 0.74rem; text-transform: uppercase; color: var(--accent-cyan); font-weight: 800;">Authentic Reading Passage</span>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin: 6px 0; line-height: 1.4;">
            "${slide.passage}"
          </h3>
          <div style="display: flex; gap: 20px; margin-top: 8px;">
            ${slide.prompts.map(p => `
              <div style="font-size: 0.88rem; color: var(--text-gold); font-weight: 700;">
                ❓ ${p.q} ➔ <span style="color: #ffffff;">${p.a}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="teams-contest-stage">
          <div class="team-contest-box team-blue">
            <h4 style="color: var(--accent-cyan); font-size: 1.25rem; font-weight: 900;">💙 TEAM BLUE</h4>
            <div class="cloth-rolls-rack" id="blue-rack">
              ${Array.from({ length: this.teamBlueRolls }).map(() => `<span class="cloth-roll-icon">🧵</span>`).join('')}
            </div>
            <p style="font-weight: 800; font-size: 1.1rem; color: var(--accent-cyan);">Total Rolls: <span id="blue-count">${this.teamBlueRolls}</span></p>
            <button type="button" class="btn-3d btn-3d-cyan" id="btn-add-blue" style="margin-top: 8px;">
              + Weave Roll
            </button>
          </div>

          <div class="team-contest-box team-red">
            <h4 style="color: var(--accent-coral); font-size: 1.25rem; font-weight: 900;">❤️ TEAM RED</h4>
            <div class="cloth-rolls-rack" id="red-rack">
              ${Array.from({ length: this.teamRedRolls }).map(() => `<span class="cloth-roll-icon">🧵</span>`).join('')}
            </div>
            <p style="font-weight: 800; font-size: 1.1rem; color: var(--accent-coral);">Total Rolls: <span id="red-count">${this.teamRedRolls}</span></p>
            <button type="button" class="btn-3d btn-3d-amber" id="btn-add-red" style="margin-top: 8px;">
              + Weave Roll
            </button>
          </div>
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
    }

    // ==========================================
    // SLIDE 5: STORY CLIMAX (KING & FULL MOON)
    // ==========================================
    renderSlide5King(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 20px; align-items: center; margin: 10px 0;">
          <div style="position: relative; border-radius: 20px; overflow: hidden; border: 2px solid var(--accent-amber); box-shadow: var(--shadow-glass);">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(6,9,17,0.95), transparent); padding: 14px 20px;">
              <span style="font-size: 0.74rem; text-transform: uppercase; color: var(--accent-amber); font-weight: 800;">The Joseon King</span>
              <p style="font-size: 0.88rem; color: #ffffff; font-weight: 700;">Embroidered crimson dragon robe under harvest full moon</p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="background: rgba(6, 9, 17, 0.85); border: 2px solid var(--accent-amber); border-radius: 18px; padding: 20px;">
              <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--accent-amber); font-weight: 800;">Monarch's Decree:</span>
              <h3 style="font-size: 1.35rem; font-weight: 900; color: #ffffff; margin: 8px 0; line-height: 1.4;">
                "${slide.quote}"
              </h3>
              <button type="button" class="btn-3d btn-3d-amber" id="btn-king-audio" style="margin-top: 10px;">
                👑 Callum Monarch Voice (With Royal Gong)
              </button>
            </div>

            <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 16px;">
              <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-gold); margin-bottom: 6px;">
                ${slide.choiceQuestion}
              </div>
              <div style="font-size: 1.05rem; font-weight: 900; color: var(--accent-emerald);">
                ➔ ${slide.choiceAnswer}
              </div>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-king-audio').addEventListener('click', () => {
        AUDIO.speakSSML(slide.ssml, 'callum');
      });
    }

    // ==========================================
    // SLIDE 6: PHOTOREALISTIC TRUE OR FALSE
    // ==========================================
    renderSlide6TrueFalse(container, slide) {
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 12px;">
          <h3 style="color: var(--accent-cyan); font-size: 1.15rem; font-weight: 800;">
            👍 Thumbs Up (True) or 👎 Thumbs Down (False)?
          </h3>
          <p style="color: var(--text-muted); font-size: 0.86rem;">Show your thumbs on camera or click below!</p>
        </div>

        <div class="tf-cards-container">
          ${slide.questions.map((q, idx) => `
            <div class="tf-question-card" id="tf-card-${q.id}">
              <div style="display:flex; align-items:center; gap: 12px;">
                <span style="font-size: 1.8rem;">${q.icon}</span>
                <div>
                  <span style="font-weight: 900; color: var(--accent-cyan); font-size: 0.85rem;">#${idx + 1}</span>
                  <div style="font-size: 1rem; font-weight: 700; color: #f8fafc;">${q.text}</div>
                </div>
              </div>
              <div class="tf-btn-group">
                <button type="button" class="btn-3d btn-3d-ghost btn-tf-choice" data-id="${q.id}" data-choice="true">
                  👍 True
                </button>
                <button type="button" class="btn-3d btn-3d-ghost btn-tf-choice" data-id="${q.id}" data-choice="false">
                  👎 False
                </button>
              </div>
            </div>
          `).join('')}
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
          } else {
            card.classList.remove('correct');
            card.classList.add('incorrect');
            AUDIO.playSoftFail();
          }
        });
      });
    }

    // ==========================================
    // SLIDE 7: DIGITAL GRATITUDE SCROLL
    // ==========================================
    renderSlide7Scroll(container, slide) {
      container.innerHTML = `
        <div style="background: radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.2) 0%, rgba(6, 9, 17, 0.9) 75%); border: 2px solid var(--accent-amber); border-radius: 20px; padding: 22px; margin-bottom: 14px;">
          <h3 style="color: var(--text-gold); font-size: 1.25rem; font-weight: 900; margin-bottom: 4px;">
            📜 The Digital Gratitude Scroll
          </h3>
          <p style="color: #cbd5e1; font-size: 0.9rem; margin-bottom: 14px;">
            "I am thankful for my ____________ because ____________."
          </p>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <input type="text" id="input-scroll-name" placeholder="Student Name" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:10px; padding:8px 14px; font-weight:700;" />
            <input type="text" id="input-scroll-person" placeholder="Who/What (e.g. my family, my home)" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:10px; padding:8px 14px; font-weight:700; flex:1;" />
            <input type="text" id="input-scroll-reason" placeholder="Why (e.g. they make me smile)" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:10px; padding:8px 14px; font-weight:700; flex:1.5;" />
            <button type="button" class="btn-3d btn-3d-amber" id="btn-pin-scroll">
              📌 Pin to Scroll
            </button>
          </div>
        </div>

        <div class="gratitude-cards-wall" id="scroll-wall">
          ${this.gratitudeNotes.map(n => `
            <div class="pinned-gratitude-note">
              <h4>${n.name}'s Gratitude Note 🌾</h4>
              <p>"I am thankful for <strong>${n.person}</strong> because <strong>${n.reason}</strong>."</p>
            </div>
          `).join('')}
        </div>
      `;

      container.querySelector('#btn-pin-scroll').addEventListener('click', () => {
        const name = container.querySelector('#input-scroll-name').value.trim() || "Young Scholar";
        const person = container.querySelector('#input-scroll-person').value.trim() || "my family";
        const reason = container.querySelector('#input-scroll-reason').value.trim() || "they care for me";

        this.gratitudeNotes.unshift({ name, person, reason });
        AUDIO.playCorrect();
        this.addXP(25);
        this.renderSlide7Scroll(container, slide);
      });
    }

    // ==========================================
    // SLIDE 8: LESSON 1 MILESTONE (MASTER WEAVER)
    // ==========================================
    renderSlide8Milestone(container, slide) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px;">
          <div style="font-size: 5rem; margin-bottom: 8px;">${slide.badge.icon}</div>
          <h2 style="font-size: 2rem; font-weight: 900; color: #ffffff; margin-bottom: 4px;">
            ${slide.badge.title}
          </h2>
          <p style="color: var(--accent-amber); font-weight: 800; font-size: 1.05rem; margin-bottom: 16px;">
            ${slide.badge.desc}
          </p>
          <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 500px; margin: 0 auto 24px auto;">
            ${slide.teaser}
          </p>

          <div style="display: flex; justify-content: center; gap: 16px;">
            <button type="button" class="btn-3d btn-3d-amber" id="btn-claim-l1">
              ⭐ Claim +100 XP
            </button>
            <button type="button" class="btn-3d btn-3d-cyan" id="btn-go-l2">
              🚀 Start Lesson 2
            </button>
          </div>
        </div>
      `;

      container.querySelector('#btn-claim-l1').addEventListener('click', () => {
        AUDIO.playVictoryFanfare();
        this.addXP(100);
        alert("🎉 +100 XP added! You are officially an Ancient Master Weaver!");
      });

      container.querySelector('#btn-go-l2').addEventListener('click', () => {
        this.goToSlide(8);
      });
    }

    // ==========================================
    // SLIDE 9 (L2S1): FROSTED GLASS REVEAL
    // ==========================================
    renderSlide9Frosted(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 20px; align-items: center; margin: 10px 0;">
          <div style="position: relative; border-radius: 20px; overflow: hidden; border: 2px solid var(--accent-cyan); height: 320px;">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
            
            <div id="frosted-glass-overlay" style="position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 4px; padding: 4px; pointer-events: none;">
              ${[1, 2, 3, 4].map(tile => `
                <div class="frosted-tile" id="tile-${tile}" style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--accent-cyan); font-weight: 900; font-size: 1.4rem; transition: opacity 0.5s ease; ${this.frostedTilesUnlocked.has(tile) ? 'opacity: 0;' : 'opacity: 1;'}">
                  🔒 #${tile}
                </div>
              `).join('')}
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <h3 style="font-size: 1.25rem; font-weight: 900; color: #ffffff;">
              ❄️ Mystery Frosted Glass Challenge
            </h3>
            <p style="color: var(--text-muted); font-size: 0.88rem;">
              What did the two teams weave on their looms?
            </p>

            <div style="display: flex; gap: 10px; align-items: center;">
              <span style="font-size: 1.3rem; font-weight: 900; letter-spacing: 0.15em; color: var(--text-gold);">${slide.puzzleClue}</span>
              <input type="text" id="input-cloth-guess" placeholder="Type word" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:8px; padding:8px 12px; font-weight:800; width:130px;" />
              <button type="button" class="btn-3d btn-3d-cyan" id="btn-unlock-tile">
                🔓 Unlock Tile
              </button>
            </div>

            <div style="background: rgba(6, 9, 17, 0.8); border: 1.5px solid var(--accent-emerald); border-radius: 14px; padding: 12px 16px; margin-top: 6px;">
              <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--accent-emerald); font-weight: 800;">Revealed Story Fact:</span>
              <div style="font-size: 0.98rem; font-weight: 800; color: #ffffff; margin-top: 4px;">
                "${slide.revealedText}"
              </div>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-unlock-tile').addEventListener('click', () => {
        const val = container.querySelector('#input-cloth-guess').value.trim().toUpperCase();
        if (val === 'CLOTH') {
          AUDIO.playCorrect();
          this.addXP(20);
          for (let i = 1; i <= 4; i++) this.frostedTilesUnlocked.add(i);
          this.renderSlide9Frosted(container, slide);
        } else {
          AUDIO.playSoftFail();
          alert("Hint: Starts with C and ends with H (5 letters)!");
        }
      });
    }

    // ==========================================
    // SLIDE 10 (L2S2): PHOTOREALISTIC SONGPYEON
    // ==========================================
    renderSlide10Songpyeon(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 20px; align-items: center; margin: 10px 0;">
          <div style="position: relative; border-radius: 20px; overflow: hidden; border: 2px solid var(--accent-emerald); box-shadow: var(--shadow-glass); cursor: pointer;" id="songpyeon-photo-box">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(6,9,17,0.95), transparent); padding: 14px 20px;">
              <span style="font-size: 0.74rem; text-transform: uppercase; color: var(--accent-emerald); font-weight: 800;">4K Macro Culinary View</span>
              <p style="font-size: 0.88rem; color: #ffffff; font-weight: 700;">Steaming Songpyeon half-moon cakes on pine needles</p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${slide.facts.map(f => `
              <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.4rem;">${f.icon}</span>
                <span style="font-size: 0.9rem; font-weight: 700; color: #ffffff;">${f.label}</span>
              </div>
            `).join('')}

            <div style="background: rgba(6, 9, 17, 0.8); border: 1.5px solid var(--accent-amber); border-radius: 14px; padding: 12px 16px;">
              <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--accent-amber); font-weight: 800;">Poll: ${slide.pollQuestion}</span>
              <div style="display: flex; gap: 10px; margin-top: 8px;">
                <button type="button" class="btn-3d btn-3d-emerald" id="btn-poll-yes" style="flex:1;">
                  🟢 YES! Looks delicious!
                </button>
                <button type="button" class="btn-3d btn-3d-ghost" id="btn-poll-no" style="flex:1;">
                  🔴 Not for me
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#songpyeon-photo-box').addEventListener('click', () => {
        AUDIO.playCorrect();
        this.addXP(10);
      });

      container.querySelector('#btn-poll-yes').addEventListener('click', () => {
        AUDIO.playCorrect();
        this.addXP(15);
        alert("😋 Songpyeon is sweet, warm, chewy, and smells like fresh pine needles!");
      });

      container.querySelector('#btn-poll-no').addEventListener('click', () => {
        AUDIO.playSoftFail();
      });
    }

    // ==========================================
    // SLIDE 11 (L2S3): CIRCLE DANCE (GANGGANGSULLAE)
    // ==========================================
    renderSlide11Dance(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 20px; align-items: center; margin: 10px 0;">
          <div style="position: relative; border-radius: 20px; overflow: hidden; border: 2px solid var(--accent-violet); box-shadow: var(--shadow-glass);">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(6,9,17,0.95), transparent); padding: 14px 20px;">
              <span style="font-size: 0.74rem; text-transform: uppercase; color: var(--accent-violet); font-weight: 800;">Atmospheric Wide View</span>
              <p style="font-size: 0.88rem; color: #ffffff; font-weight: 700;">Dozens of women in Hanbok dancing in a circle under the full moon</p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${slide.keyPoints.map(p => `
              <div style="background: rgba(30, 41, 59, 0.7); border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 14px; padding: 14px;">
                <span style="font-size: 1.6rem;">${p.icon}</span>
                <p style="font-size: 0.95rem; font-weight: 800; color: #ffffff; margin-top: 4px;">${p.text}</p>
              </div>
            `).join('')}

            <button type="button" class="btn-3d btn-3d-amber" id="btn-play-drum-tempo">
              🥁 Start Traditional Drum Tempo
            </button>
          </div>
        </div>
      `;

      const drumBtn = container.querySelector('#btn-play-drum-tempo');
      drumBtn.addEventListener('click', () => {
        if (this.jangguInterval) {
          clearInterval(this.jangguInterval);
          this.jangguInterval = null;
          drumBtn.textContent = '🥁 Start Traditional Drum Tempo';
        } else {
          drumBtn.textContent = '⏸ Pause Drum Tempo';
          let beat = 0;
          this.jangguInterval = setInterval(() => {
            AUDIO.playJangguDrum(beat % 2 === 1);
            beat++;
          }, 450);
          this.addXP(10);
        }
      });
    }

    // ==========================================
    // SLIDE 12 (L2S4): REMEMBERING ANCESTORS (CHARYE)
    // ==========================================
    renderSlide12Ancestors(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 20px; align-items: center; margin: 10px 0;">
          <div style="position: relative; border-radius: 20px; overflow: hidden; border: 2px solid var(--accent-amber); box-shadow: var(--shadow-glass);">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(6,9,17,0.95), transparent); padding: 14px 20px;">
              <span style="font-size: 0.74rem; text-transform: uppercase; color: var(--accent-amber); font-weight: 800;">Charye Memorial Ceremony</span>
              <p style="font-size: 0.88rem; color: #ffffff; font-weight: 700;">Scholar bowing before table arranged with fresh harvest offerings</p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${slide.vocabDefinitions.map(d => `
              <div style="background: rgba(30, 41, 59, 0.7); border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 14px; padding: 14px;">
                <div style="font-size: 1.4rem;">${d.icon}</div>
                <h4 style="font-size: 1.15rem; font-weight: 900; color: var(--text-gold); margin: 4px 0;">${d.term}</h4>
                <p style="font-size: 0.85rem; color: #cbd5e1; font-weight: 700;">${d.def}</p>
              </div>
            `).join('')}

            <div style="background: rgba(6, 9, 17, 0.8); border: 1.5px solid var(--accent-cyan); border-radius: 14px; padding: 12px 16px;">
              <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--accent-cyan); font-weight: 800;">Target Sentence:</span>
              <div style="font-size: 1.05rem; font-weight: 900; color: #ffffff; margin-top: 4px;">
                "${slide.targetSentence}"
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // ==========================================
    // SLIDE 13 (L2S5): VENN COMPARISON
    // ==========================================
    renderSlide13Venn(container, slide) {
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 8px;">
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
          <div class="venn-draggable-tags" id="available-venn-tags">
            ${slide.vennTiles.map(tile => `
              <div class="draggable-tag-pill" data-id="${tile.id}" data-zone="${tile.defaultZone}">
                ${tile.text}
              </div>
            `).join('')}
          </div>
        </div>
      `;

      container.querySelectorAll('.draggable-tag-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const zone = pill.dataset.zone;
          const slot = container.querySelector(zone === 'both' ? '#slot-both' : '#slot-chuseok');
          if (slot && !slot.contains(pill)) {
            slot.appendChild(pill);
            AUDIO.playCorrect();
            this.addXP(10);
          }
        });
      });
    }

    // ==========================================
    // SLIDE 14 (L2S6): ARCADE SPRINT
    // ==========================================
    renderSlide14Arcade(container, slide) {
      const q = slide.questions[this.quizCurrentQuestion];

      container.innerHTML = `
        <div class="speed-quiz-hud">
          <div style="font-weight: 800; font-size: 1rem; color: #ffffff;">
            Question ${this.quizCurrentQuestion + 1} of ${slide.questions.length}
          </div>
          <div class="quiz-timer-pill" id="quiz-countdown">
            ⏱️ ${this.quizTimeLeft}s
          </div>
          <div class="quiz-streak-pill">
            🔥 Score: ${this.quizScore} pts
          </div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.85); border: 2px solid var(--accent-cyan); border-radius: 20px; padding: 24px; margin: 12px 0;">
          <h3 style="font-size: 1.4rem; font-weight: 900; color: #ffffff; text-align: center; margin-bottom: 20px;">
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
            if (this.quizCurrentQuestion < slide.questions.length - 1) {
              this.quizCurrentQuestion++;
              this.quizTimeLeft = 15;
              this.renderSlide14Arcade(container, slide);
            } else {
              AUDIO.playVictoryFanfare();
              alert(`🏆 Harvest Sprint Complete! Final Score: ${this.quizScore} pts!`);
            }
          }, 800);
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
          if (this.quizCurrentQuestion < slide.questions.length - 1) {
            this.quizCurrentQuestion++;
            this.quizTimeLeft = 15;
            this.renderSlide14Arcade(container, slide);
          }
        }
      }, 1000);
    }

    // ==========================================
    // SLIDE 15 (L2S7): GRATITUDE TREE
    // ==========================================
    renderSlide15Tree(container, slide) {
      container.innerHTML = `
        <div style="background: radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.25) 0%, rgba(6, 9, 17, 0.95) 75%); border: 2px solid var(--accent-amber); border-radius: 20px; padding: 24px; text-align: center; margin-bottom: 14px;">
          <h2 style="font-size: 1.6rem; font-weight: 900; color: #ffffff; margin-bottom: 4px;">
            🍁 The Personal Gratitude Tree
          </h2>
          <p style="color: var(--text-gold); font-weight: 800; font-size: 1.05rem; margin-bottom: 16px;">
            "${slide.sentenceFrame}"
          </p>

          <div style="display: flex; gap: 12px; justify-content: center; max-width: 600px; margin: 0 auto;">
            <input type="text" id="tree-person" placeholder="Person to thank (e.g. Mom, Dad)" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:10px; padding:8px 14px; font-weight:700; flex:1;" />
            <input type="text" id="tree-reason" placeholder="Reason (e.g. making breakfast)" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:10px; padding:8px 14px; font-weight:700; flex:1.5;" />
            <button type="button" class="btn-3d btn-3d-amber" id="btn-tree-submit">
              🍂 Hang Leaf
            </button>
          </div>
        </div>

        <div class="gratitude-cards-wall" id="tree-wall">
          ${this.gratitudeNotes.map(n => `
            <div class="pinned-gratitude-note">
              <h4>${n.name}'s Gratitude Leaf 🍂</h4>
              <p>"I want to say thank you to <strong>${n.person}</strong> because <strong>${n.reason}</strong>."</p>
            </div>
          `).join('')}
        </div>
      `;

      container.querySelector('#btn-tree-submit').addEventListener('click', () => {
        const person = container.querySelector('#tree-person').value.trim() || "my family";
        const reason = container.querySelector('#tree-reason').value.trim() || "all their love";

        this.gratitudeNotes.unshift({ name: "Young Explorer", person, reason });
        AUDIO.playCorrect();
        this.addXP(25);
        this.renderSlide15Tree(container, slide);
      });
    }

    // ==========================================
    // SLIDE 16 (L2S8): CERTIFICATE
    // ==========================================
    renderSlide16Certificate(container, slide) {
      container.innerHTML = `
        <div style="background: radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.25) 0%, rgba(6, 9, 17, 0.95) 75%); border: 3px solid var(--accent-amber); border-radius: 24px; padding: 32px; text-align: center; margin: 10px 0; box-shadow: 0 0 35px rgba(245, 158, 11, 0.3);">
          <div style="font-size: 4.5rem; margin-bottom: 6px;">🏅</div>
          <span style="font-size: 0.82rem; text-transform: uppercase; color: var(--accent-amber); font-weight: 900; letter-spacing: 0.1em;">Official Graduation</span>
          <h2 style="font-size: 2.2rem; font-weight: 900; color: #ffffff; margin: 6px 0;">
            CHUSEOK CULTURAL EXPLORER
          </h2>
          <p style="color: var(--text-gold); font-size: 1.1rem; font-weight: 800; margin-bottom: 18px;">
            Unit 2: "Thank You" Mastered • Global Readings 2
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-width: 600px; margin: 0 auto 24px auto;">
            ${slide.vocabMastered.map(v => `
              <span style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--accent-cyan); color: #ffffff; font-weight: 800; font-size: 0.85rem; padding: 4px 12px; border-radius: 999px;">
                ${v}
              </span>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: center; gap: 16px;">
            <button type="button" class="btn-3d btn-3d-amber" id="btn-final-xp">
              ⭐ Claim +150 Final XP
            </button>
            <a href="worksheet.html" target="_blank" class="btn-3d btn-3d-cyan" style="text-decoration:none;">
              📄 Print Worksheet
            </a>
          </div>
        </div>
      `;

      container.querySelector('#btn-final-xp').addEventListener('click', () => {
        AUDIO.playVictoryFanfare();
        this.addXP(150);
        alert("🎉 Congratulations! You earned +150 XP and graduated as a Chuseok Cultural Explorer!");
      });
    }
  }

  root.ChuseokApp = ChuseokApp;

  document.addEventListener('DOMContentLoaded', () => {
    root.chuseokAppInstance = new ChuseokApp();
  });
})(typeof window !== 'undefined' ? window : global);
