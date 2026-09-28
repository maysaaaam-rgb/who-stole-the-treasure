/**
 * FOREST RANGER PET SAFARI: APP CONTROLLER
 * Pure Vanilla ES6+ | Zero external framework dependencies
 */

(function(root) {
  'use strict';

  const DATA = root.FOREST_SAFARI_DATA;
  const AUDIO = root.ForestSafariAudio;

  class ForestSafariApp {
    constructor() {
      this.currentSlideIndex = 0;
      this.totalSlides = DATA.slides.length;
      this.xpEarned = 0;

      // Backpack Badges Inventory
      this.backpack = new Set();

      // Slide states
      this.bearStamped = false;
      this.clapProgress = 0;
      this.leafEnergy = 35;
      this.flippedAnimals = new Set();
      this.bearBlanketCovered = false;
      this.deerFound = false;
      this.dressedItems = new Set();
      this.pineConeStamped = false;
      this.bunnyHops = 0;
      this.wearingWolfHat = false;
      this.sortedItems = {};
      this.quizScores = { leaf: 0, freeze: 0 };

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
        backpackIcons: document.getElementById('hud-backpack-icons'),
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
        this.dom.tabLesson2.addEventListener('click', () => this.goToSlide(6));
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
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
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

      if (root.AdventureAcademy && typeof root.AdventureAcademy.awardXP === 'function') {
        root.AdventureAcademy.awardXP(amount);
      } else if (root.schoolStore && typeof root.schoolStore.awardStudentXP === 'function') {
        const student = root.schoolStore.getCurrentStudent ? root.schoolStore.getCurrentStudent() : null;
        if (student) root.schoolStore.awardStudentXP(student.id, amount);
      }
    }

    awardBadge(badge) {
      if (!badge || this.backpack.has(badge.id)) return;
      this.backpack.add(badge.id);
      if (this.dom.backpackIcons) {
        const span = document.createElement('span');
        span.className = 'backpack-badge-icon';
        span.title = `${badge.name}: ${badge.desc}`;
        span.textContent = badge.icon;
        span.style.animation = 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        this.dom.backpackIcons.appendChild(span);
      }
      AUDIO.playCorrect();
      this.addXP(25);
    }

    goToSlide(index) {
      if (index < 0 || index >= this.totalSlides) return;
      AUDIO.stopSpeech();
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

    playCurrentSlideAudio() {
      const slide = DATA.slides[this.currentSlideIndex];
      if (slide && slide.ssml) {
        AUDIO.speakSSML(slide.ssml, slide.voicePersona || 'Sarah');
      }
    }

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    renderSlide(index) {
      const slide = DATA.slides[index];
      if (!slide) return;

      const currentLesson = slide.lessonId;
      if (this.dom.tabLesson1 && this.dom.tabLesson2) {
        this.dom.tabLesson1.classList.toggle('active', currentLesson === 1);
        this.dom.tabLesson2.classList.toggle('active', currentLesson === 2);
      }

      if (this.dom.slideBadge) this.dom.slideBadge.textContent = `${slide.lessonTitle} • Slide ${slide.slideNum} of ${currentLesson === 1 ? 6 : 8}`;
      if (this.dom.timingBadge) this.dom.timingBadge.textContent = slide.timing;
      if (this.dom.modalityBadge) this.dom.modalityBadge.textContent = slide.modality;
      if (this.dom.slideTitle) this.dom.slideTitle.textContent = slide.title;
      if (this.dom.teacherDrawer) this.dom.teacherDrawer.textContent = slide.teacherPrompt;

      if (slide.ssml) {
        const cleanScript = slide.ssml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (this.dom.audioScript) this.dom.audioScript.textContent = `"${cleanScript}"`;
        if (this.dom.audioPersona) this.dom.audioPersona.textContent = `${slide.voicePersona} (${slide.voiceStyle})`;
        if (this.dom.audioBar) this.dom.audioBar.style.display = 'flex';
      }

      if (this.dom.dotsRail) {
        const dots = this.dom.dotsRail.querySelectorAll('.slide-dot');
        dots.forEach((dot, dIdx) => dot.classList.toggle('active', dIdx === index));
      }

      const stage = this.dom.stageContent;
      stage.innerHTML = '';

      switch (slide.type) {
        case 'river_ride_opener':
          this.renderSlide1River(stage, slide);
          break;
        case 'leaf_clapper':
          this.renderSlide2Clapper(stage, slide);
          break;
        case 'animal_cards_whack':
          this.renderSlide3AnimalCards(stage, slide);
          break;
        case 'hibernate_snooze':
          this.renderSlide4Hibernate(stage, slide);
          break;
        case 'camouflage_hunt':
          this.renderSlide5Camouflage(stage, slide);
          break;
        case 'leaf_arcade_quiz':
          this.renderSlide6Arcade(stage, slide);
          break;
        case 'freeze_thermometer':
          this.renderSlide7Freeze(stage, slide);
          break;
        case 'pine_vs_apple':
          this.renderSlide8PineApple(stage, slide);
          break;
        case 'snow_bunny_trick':
          this.renderSlide9Bunny(stage, slide);
          break;
        case 'winter_predators_hunt':
          this.renderSlide10Predators(stage, slide);
          break;
        case 'forest_sorter_baskets':
          this.renderSlide11Sorter(stage, slide);
          break;
        case 'frozen_sprint_quiz':
          this.renderSlide12FrozenSprint(stage, slide);
          break;
        case 'favorite_pet_wheel':
          this.renderSlide13FavoritePet(stage, slide);
          break;
        case 'ranger_graduation':
          this.renderSlide14Graduation(stage, slide);
          break;
        default:
          stage.innerHTML = `<p>${slide.title}</p>`;
      }
    }

    // ==========================================
    // SLIDE 1: RIVER RIDE OPENER
    // ==========================================
    renderSlide1River(container, slide) {
      container.innerHTML = `
        <div class="river-ride-stage">
          <div class="interactive-photo-frame" id="river-photo-target">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" />
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(6,9,17,0.95), transparent); padding: 14px 18px;">
              <span style="font-size: 0.76rem; text-transform: uppercase; color: var(--accent-emerald); font-weight: 800;">4K Safari Camera View</span>
              <p style="font-size: 0.88rem; color: #ffffff; font-weight: 700;">Tap the swimming bear to stamp your Ranger Star ⭐!</p>
            </div>
            ${this.bearStamped ? `<span class="star-stamp-overlay" style="top: 60%; left: 24%;">⭐</span>` : ''}
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div class="a1-sentence-box">
              <span style="font-size: 0.74rem; text-transform: uppercase; color: var(--accent-amber); font-weight: 800;">A1+ Sentence Scaffold</span>
              ${slide.scaffoldLines.map(s => `
                <div class="a1-sentence-line">${s.icon} <span>"${s.text}"</span></div>
              `).join('')}
            </div>

            <div style="background: rgba(30, 41, 59, 0.7); border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 16px;">
              <h4 style="color: var(--accent-cyan); font-size: 1rem; font-weight: 800; margin-bottom: 6px;">
                🎯 Physical Action (TPR)
              </h4>
              <p style="color: #cbd5e1; font-size: 0.9rem; margin-bottom: 12px;">
                Roar like a big brown bear into your webcam! 🐻
              </p>
              <button type="button" class="btn-3d btn-3d-amber" id="btn-stamp-bear">
                ⭐ Stamp Bear &amp; Get Boat Badge!
              </button>
            </div>
          </div>
        </div>
      `;

      const target = container.querySelector('#river-photo-target');
      const btn = container.querySelector('#btn-stamp-bear');

      const doStamp = () => {
        if (!this.bearStamped) {
          this.bearStamped = true;
          this.awardBadge(slide.badgeEarned);
          AUDIO.playCorrect();
          this.renderSlide1River(container, slide);
        }
      };

      if (target) target.addEventListener('click', doStamp);
      if (btn) btn.addEventListener('click', doStamp);
    }

    // ==========================================
    // SLIDE 2: LEAF CLAPPER & SOUND METER
    // ==========================================
    renderSlide2Clapper(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; align-items: center;">
          <div style="border-radius: 20px; overflow: hidden; border: 2px solid var(--accent-amber); box-shadow: var(--shadow-glass);">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <h3 style="font-size: 1.25rem; font-weight: 900; color: #ffffff;">
              👏 Clap the Big Word!
            </h3>
            <p style="color: var(--text-muted); font-size: 0.88rem;">Tap each syllable to hear the rhythm:</p>

            <div class="syllable-clapper-rack">
              ${slide.syllables.map((syl, i) => `
                <div class="syllable-clap-pill ${this.clapProgress > i ? 'active' : ''}" data-idx="${i}">
                  ${syl}
                </div>
              `).join('')}
            </div>

            <div class="a1-sentence-box">
              ${slide.scaffoldLines.map(s => `
                <div class="a1-sentence-line">${s.icon} <span>"${s.text}"</span></div>
              `).join('')}
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 800; color: var(--text-gold);">
                <span>CLASS SOUND METER</span>
                <span>${this.leafEnergy}%</span>
              </div>
              <div class="energy-meter-track">
                <div class="energy-meter-fill" style="width: ${this.leafEnergy}%;"></div>
              </div>
            </div>

            <button type="button" class="btn-3d btn-3d-emerald" id="btn-leaf-drop" style="margin-top: 6px;">
              🍂 Leaf Drop Action ("Whoosh!")
            </button>
          </div>
        </div>
      `;

      container.querySelectorAll('.syllable-clap-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          AUDIO.playWoodClap();
          this.clapProgress = parseInt(pill.dataset.idx, 10) + 1;
          this.leafEnergy = Math.min(100, this.leafEnergy + 15);
          this.addXP(5);
          this.renderSlide2Clapper(container, slide);
        });
      });

      container.querySelector('#btn-leaf-drop').addEventListener('click', () => {
        AUDIO.playLeafCrunch();
        this.leafEnergy = Math.min(100, this.leafEnergy + 20);
        this.addXP(10);
        this.renderSlide2Clapper(container, slide);
      });
    }

    // ==========================================
    // SLIDE 3: WHACK-A-PET (WORDWALL QUICK ROUND)
    // ==========================================
    renderSlide3AnimalCards(container, slide) {
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 8px;">
          <h3 style="font-size: 1.3rem; font-weight: 900; color: var(--accent-amber);">
            ❓ ${slide.targetQuestion}
          </h3>
          <p style="color: var(--text-muted); font-size: 0.88rem;">
            Tap the correct card to flip it into your Safari Sticker Album!
          </p>
        </div>

        <div class="animal-cards-grid">
          ${slide.animals.map(a => `
            <div class="safari-animal-card ${this.flippedAnimals.has(a.id) ? 'is-correct' : ''}" data-id="${a.id}">
              <div style="font-size: 3rem; margin-bottom: 6px;">${a.icon}</div>
              <h4 style="font-size: 1.15rem; font-weight: 900; color: #ffffff;">${a.name}</h4>
              <p style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700; margin: 4px 0;">${a.fact}</p>
              <div style="background: rgba(6,9,17,0.8); border-radius: 8px; padding: 6px; font-size: 0.85rem; font-weight: 800; color: var(--text-gold); margin-top: 6px;">
                "${a.sentence}"
              </div>
              ${this.flippedAnimals.has(a.id) ? `<div style="margin-top:6px; font-size: 0.8rem; font-weight:900; color: var(--accent-emerald);">✔ IN ALBUM</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;

      container.querySelectorAll('.safari-animal-card').forEach(card => {
        card.addEventListener('click', () => {
          const aId = parseInt(card.dataset.id, 10);
          if (aId === slide.correctId) {
            this.flippedAnimals.add(aId);
            AUDIO.playArcadeDing();
            this.addXP(20);
            this.renderSlide3AnimalCards(container, slide);
          } else {
            AUDIO.playSoftFail();
          }
        });
      });
    }

    // ==========================================
    // SLIDE 4: SNOOZE QUEST & BLANKET PULL
    // ==========================================
    renderSlide4Hibernate(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; align-items: center;">
          <div class="bear-den-container">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
            <div class="bear-cozy-blanket ${this.bearBlanketCovered ? 'is-covered' : ''}">
              <span style="font-size: 3rem; margin-bottom: 8px;">🛌💤</span>
              <p>Bear Blanket Unlocked!</p>
              <span style="font-size: 0.85rem; color: var(--text-gold);">Sleeping soundly all winter!</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div class="a1-sentence-box">
              ${slide.scaffoldLines.map(s => `
                <div class="a1-sentence-line">${s.icon} <span>"${s.text}"</span></div>
              `).join('')}
            </div>

            <div style="background: rgba(30, 41, 59, 0.7); border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 16px;">
              <h4 style="color: var(--accent-cyan); font-size: 1rem; font-weight: 800; margin-bottom: 6px;">
                💤 Tilt Head &amp; Snore on Webcam!
              </h4>
              <p style="color: #cbd5e1; font-size: 0.88rem; margin-bottom: 12px;">
                "Zzz... hibernate!" Keep sleeping for 5 seconds to pull the blanket!
              </p>
              <button type="button" class="btn-3d btn-3d-amber" id="btn-pull-blanket">
                🛌 Pull Digital Blanket Over Bear!
              </button>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-pull-blanket').addEventListener('click', () => {
        this.bearBlanketCovered = true;
        this.awardBadge(slide.badgeEarned);
        AUDIO.playWinterWind();
        this.renderSlide4Hibernate(container, slide);
      });
    }

    // ==========================================
    // SLIDE 5: CAMOUFLAGE DETECTIVE (FLASHLIGHT HUNT)
    // ==========================================
    renderSlide5Camouflage(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.25fr 1fr; gap: 20px; align-items: center;">
          <div style="position: relative; border-radius: 20px; overflow: hidden; border: 2.5px solid var(--accent-amber); box-shadow: var(--shadow-glass); cursor: pointer;" id="cam-photo-stage">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(6,9,17,0.95), transparent); padding: 12px 18px;">
              <span style="font-size: 0.76rem; text-transform: uppercase; color: var(--accent-amber); font-weight: 800;">Flashlight Hunt Tool</span>
              <p style="font-size: 0.88rem; color: #ffffff; font-weight: 700;">Find the brown deer camouflaged between the tree trunks!</p>
            </div>
            ${this.deerFound ? `<div class="flashlight-lens-ring" style="top: 36%; left: 52%;"></div>` : ''}
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div class="a1-sentence-box">
              <span style="font-size: 0.74rem; text-transform: uppercase; color: var(--accent-amber); font-weight: 800;">Camouflage Rule</span>
              ${slide.scaffoldLines.map(s => `
                <div class="a1-sentence-line">${s.icon} <span>"${s.text}"</span></div>
              `).join('')}
            </div>

            <button type="button" class="btn-3d btn-3d-cyan" id="btn-reveal-deer">
              🔦 Turn on Flashlight (+50 Safari Coins)
            </button>
          </div>
        </div>
      `;

      const reveal = () => {
        if (!this.deerFound) {
          this.deerFound = true;
          AUDIO.playCorrect();
          this.addXP(50);
          this.renderSlide5Camouflage(container, slide);
        }
      };

      container.querySelector('#cam-photo-stage').addEventListener('click', reveal);
      container.querySelector('#btn-reveal-deer').addEventListener('click', reveal);
    }

    // ==========================================
    // SLIDE 6: LEAF FOREST ARCADE (QUIZ)
    // ==========================================
    renderSlide6Arcade(container, slide) {
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 12px;">
          <h3 style="font-size: 1.3rem; font-weight: 900; color: var(--accent-emerald);">
            🏆 Leaf Forest Arcade Challenge
          </h3>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Win 3 stars to clear Forest One!</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${slide.questions.map((q, qIdx) => `
            <div style="background: rgba(15, 23, 42, 0.85); border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 14px 20px;">
              <h4 style="color: #ffffff; font-size: 1.05rem; font-weight: 800; margin-bottom: 10px;">
                #${qIdx + 1}. ${q.q}
              </h4>
              <div style="display: flex; gap: 12px;">
                ${q.options.map((opt, optIdx) => `
                  <button type="button" class="quiz-opt-btn btn-leaf-quiz" data-qid="${q.id}" data-opt="${optIdx}" style="flex:1;">
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;

      container.querySelectorAll('.btn-leaf-quiz').forEach(btn => {
        btn.addEventListener('click', () => {
          const qId = parseInt(btn.dataset.qid, 10);
          const opt = parseInt(btn.dataset.opt, 10);
          const q = slide.questions.find(item => item.id === qId);

          if (opt === q.correct) {
            btn.classList.add('correct');
            AUDIO.playCorrect();
            this.addXP(20);
          } else {
            btn.classList.add('incorrect');
            AUDIO.playSoftFail();
          }
        });
      });
    }

    // ==========================================
    // SLIDE 7: ICE THERMOMETER & FREEZE CHECK
    // ==========================================
    renderSlide7Freeze(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; align-items: center;">
          <div style="border-radius: 20px; overflow: hidden; border: 2.5px solid var(--accent-cyan); box-shadow: var(--shadow-glass);">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div class="freeze-statue-box">
              <span style="font-size: 2.5rem;">🥶 ❄️ 🧤</span>
              <div class="a1-sentence-line" style="justify-content: center; font-size: 1.6rem; color: var(--accent-cyan);">
                -50°C! VERY COLD!
              </div>
              <p style="color: #cbd5e1; font-size: 0.88rem; margin: 8px 0;">Pretend to zip your coat: "Zzzzt!"</p>
              
              <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                <button type="button" class="btn-3d btn-3d-cyan" id="btn-coat">
                  🧥 Coat ${this.dressedItems.has('coat') ? '✔' : ''}
                </button>
                <button type="button" class="btn-3d btn-3d-cyan" id="btn-gloves">
                  🧤 Gloves ${this.dressedItems.has('gloves') ? '✔' : ''}
                </button>
              </div>
            </div>

            <button type="button" class="btn-3d btn-3d-amber" id="btn-freeze-game">
              🧊 Play "FREEZE!" Statue Game
            </button>
          </div>
        </div>
      `;

      container.querySelector('#btn-coat').addEventListener('click', () => {
        this.dressedItems.add('coat');
        AUDIO.playCorrect();
        this.addXP(10);
        this.renderSlide7Freeze(container, slide);
      });

      container.querySelector('#btn-gloves').addEventListener('click', () => {
        this.dressedItems.add('gloves');
        AUDIO.playCorrect();
        this.addXP(10);
        this.renderSlide7Freeze(container, slide);
      });

      container.querySelector('#btn-freeze-game').addEventListener('click', () => {
        AUDIO.playWinterWind();
        alert("🧊 FREEZE! Stay completely still like an ice statue on your webcam! 5... 4... 3... 2... 1... You made it without giggling!");
        this.addXP(20);
      });
    }

    // ==========================================
    // SLIDE 8: PINE CONE VS APPLE
    // ==========================================
    renderSlide8PineApple(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.25fr 1fr; gap: 20px; align-items: center;">
          <div style="position: relative; border-radius: 20px; overflow: hidden; border: 2.5px solid var(--accent-emerald); box-shadow: var(--shadow-glass); cursor: pointer;" id="pine-apple-frame">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
            ${this.pineConeStamped ? `<span class="star-stamp-overlay" style="top: 35%; right: 20%;">✔</span>` : ''}
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div class="a1-sentence-box">
              ${slide.scaffoldLines.map(s => `
                <div class="a1-sentence-line">${s.icon} <span>"${s.text}"</span></div>
              `).join('')}
            </div>

            <div style="background: rgba(30, 41, 59, 0.7); border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 16px;">
              <h4 style="color: var(--accent-emerald); font-size: 1rem; font-weight: 800; margin-bottom: 6px;">
                🌲 Needle Finger Action (TPR)
              </h4>
              <p style="color: #cbd5e1; font-size: 0.88rem; margin-bottom: 12px;">
                Spread your fingers wide like prickly pine needles! Say: "Ever-green!"
              </p>
              <button type="button" class="btn-3d btn-3d-emerald" id="btn-stamp-pine">
                ✔ Stamp Pine Cone &amp; Needle Fingers
              </button>
            </div>
          </div>
        </div>
      `;

      const stampPine = () => {
        if (!this.pineConeStamped) {
          this.pineConeStamped = true;
          AUDIO.playCorrect();
          this.addXP(15);
          this.renderSlide8PineApple(container, slide);
        }
      };

      container.querySelector('#pine-apple-frame').addEventListener('click', stampPine);
      container.querySelector('#btn-stamp-pine').addEventListener('click', stampPine);
    }

    // ==========================================
    // SLIDE 9: SNOW BUNNY TRICK (ADAPT)
    // ==========================================
    renderSlide9Bunny(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; align-items: center;">
          <div style="border-radius: 20px; overflow: hidden; border: 2.5px solid var(--accent-cyan); box-shadow: var(--shadow-glass);">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div class="a1-sentence-box">
              ${slide.scaffoldLines.map(s => `
                <div class="a1-sentence-line">${s.icon} <span>"${s.text}"</span></div>
              `).join('')}
            </div>

            <div style="background: rgba(30, 41, 59, 0.7); border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 16px;">
              <h4 style="color: var(--accent-cyan); font-size: 1rem; font-weight: 800; margin-bottom: 8px;">
                💬 Color Chat: What color is the winter hare?
              </h4>
              <div style="display: flex; gap: 10px;">
                <button type="button" class="btn-3d btn-3d-ghost btn-bunny-color" data-color="white" style="flex:1;">
                  ⚪ W (White)
                </button>
                <button type="button" class="btn-3d btn-3d-ghost btn-bunny-color" data-color="brown" style="flex:1;">
                  🟤 B (Brown)
                </button>
              </div>

              <div style="margin-top: 14px;">
                <button type="button" class="btn-3d btn-3d-emerald" id="btn-bunny-hop" style="width: 100%;">
                  🐰 Bunny Hop TPR! (Hops: ${this.bunnyHops})
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll('.btn-bunny-color').forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.dataset.color === 'white') {
            AUDIO.playCorrect();
            this.addXP(15);
            alert("✔ Correct! The winter snowshoe hare has pure white fur to hide in deep snow!");
          } else {
            AUDIO.playSoftFail();
          }
        });
      });

      container.querySelector('#btn-bunny-hop').addEventListener('click', () => {
        this.bunnyHops += 3;
        AUDIO.playCorrect();
        this.addXP(10);
        this.renderSlide9Bunny(container, slide);
      });
    }

    // ==========================================
    // SLIDE 10: WINTER PREDATORS (WOLF, OWL, LYNX)
    // ==========================================
    renderSlide10Predators(container, slide) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1.25fr 1fr; gap: 20px; align-items: center;">
          <div style="border-radius: 20px; overflow: hidden; border: 2.5px solid var(--accent-violet); box-shadow: var(--shadow-glass);">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; height: 320px; object-fit: cover; display: block;" />
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${slide.predators.map(p => `
              <div style="background: rgba(30, 41, 59, 0.7); border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 14px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <span style="font-size: 1.5rem;">${p.icon}</span>
                  <strong style="color: #ffffff; font-size: 1.1rem; margin-left: 8px;">${p.name}</strong>
                  <div style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 700;">"${p.sentence}"</div>
                </div>
                <button type="button" class="btn-3d btn-3d-cyan btn-play-animal-sound" data-animal="${p.name.toLowerCase()}">
                  🔊 ${p.sound}
                </button>
              </div>
            `).join('')}

            <button type="button" class="btn-3d btn-3d-amber" id="btn-wolf-hat">
              🐺 Put On Wolf Hat Avatar Filter ${this.wearingWolfHat ? '✔' : ''}
            </button>
          </div>
        </div>
      `;

      container.querySelectorAll('.btn-play-animal-sound').forEach(btn => {
        btn.addEventListener('click', () => {
          const animal = btn.dataset.animal;
          if (animal === 'wolf') {
            AUDIO.playWolfHowl();
          } else {
            AUDIO.playCorrect();
          }
          this.addXP(10);
        });
      });

      container.querySelector('#btn-wolf-hat').addEventListener('click', () => {
        this.wearingWolfHat = true;
        this.awardBadge({ id: 'wolf_hat', name: 'Wolf Hat', icon: '🐺', desc: 'Winter Predator Master' });
        AUDIO.playWolfHowl();
        this.renderSlide10Predators(container, slide);
      });
    }

    // ==========================================
    // SLIDE 11: FOREST SORTER BASKETS
    // ==========================================
    renderSlide11Sorter(container, slide) {
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 8px;">
          <h3 style="font-size: 1.3rem; font-weight: 900; color: var(--accent-amber);">
            🧺 The Forest Sorter
          </h3>
          <p style="color: var(--text-muted); font-size: 0.88rem;">
            Click an item to place it in the correct forest basket!
          </p>
        </div>

        <div class="sorter-baskets-stage">
          <div class="sorter-basket basket-leaf" id="basket-leaf">
            <h4 style="color: var(--accent-amber); font-size: 1.15rem; font-weight: 900; margin-bottom: 8px;">
              🍂 Leaf Forest (Deciduous)
            </h4>
            <div id="slot-leaf" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>
          </div>

          <div class="sorter-basket basket-pine" id="basket-pine">
            <h4 style="color: var(--accent-emerald); font-size: 1.15rem; font-weight: 900; margin-bottom: 8px;">
              🌲 Pine Forest (Coniferous)
            </h4>
            <div id="slot-pine" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>
          </div>
        </div>

        <div class="sortable-tray" id="tray-items">
          ${slide.itemsToSort.map(item => `
            <div class="sortable-pill" data-id="${item.id}" data-target="${item.target}">
              ${item.label}
            </div>
          `).join('')}
        </div>
      `;

      container.querySelectorAll('.sortable-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const target = pill.dataset.target;
          const slot = container.querySelector(target === 'leaf' ? '#slot-leaf' : '#slot-pine');
          if (slot && !slot.contains(pill)) {
            slot.appendChild(pill);
            AUDIO.playKaChing();
            this.addXP(15);
          }
        });
      });
    }

    // ==========================================
    // SLIDE 12: FROZEN SPRINT QUIZ
    // ==========================================
    renderSlide12FrozenSprint(container, slide) {
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 12px;">
          <h3 style="font-size: 1.3rem; font-weight: 900; color: var(--accent-cyan);">
            ⚡ Final Boss Round: Frozen Forest Sprint
          </h3>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Score 4 correct answers to win your Ranger Gold Badge!</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${slide.questions.map((q, qIdx) => `
            <div style="background: rgba(15, 23, 42, 0.85); border: 1.5px solid rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 14px 20px;">
              <h4 style="color: #ffffff; font-size: 1.05rem; font-weight: 800; margin-bottom: 10px;">
                #${qIdx + 1}. ${q.q}
              </h4>
              <div style="display: flex; gap: 12px;">
                ${q.options.map((opt, optIdx) => `
                  <button type="button" class="quiz-opt-btn btn-freeze-quiz" data-qid="${q.id}" data-opt="${optIdx}" style="flex:1;">
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;

      container.querySelectorAll('.btn-freeze-quiz').forEach(btn => {
        btn.addEventListener('click', () => {
          const qId = parseInt(btn.dataset.qid, 10);
          const opt = parseInt(btn.dataset.opt, 10);
          const q = slide.questions.find(item => item.id === qId);

          if (opt === q.correct) {
            btn.classList.add('correct');
            AUDIO.playCorrect();
            this.addXP(25);
          } else {
            btn.classList.add('incorrect');
            AUDIO.playSoftFail();
          }
        });
      });
    }

    // ==========================================
    // SLIDE 13: SPEAKING TROPHY (FAVORITE PET)
    // ==========================================
    renderSlide13FavoritePet(container, slide) {
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 12px;">
          <h3 style="font-size: 1.35rem; font-weight: 900; color: var(--accent-amber);">
            🎤 Speaking Trophy: My Favorite Pet
          </h3>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Select your favorite animal and speak your sentences aloud!</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 16px;">
          ${slide.animalOptions.map(a => `
            <button type="button" class="btn-3d btn-3d-ghost btn-select-pet" data-name="${a.name}" data-tag="${a.tag}">
              ${a.icon} ${a.name}
            </button>
          `).join('')}
        </div>

        <div class="a1-sentence-box" id="speaking-pet-box" style="text-align: center; padding: 20px;">
          <div class="a1-sentence-line" style="justify-content: center;" id="pet-line-1">
            "I like the <span style="color:var(--accent-cyan); margin: 0 6px;">[ animal ]</span>."
          </div>
          <div class="a1-sentence-line" style="justify-content: center; color: var(--accent-emerald);" id="pet-line-2">
            "It is <span style="color:var(--text-gold); margin: 0 6px;">[ big / small / white / brown ]</span>!"
          </div>
        </div>
      `;

      container.querySelectorAll('.btn-select-pet').forEach(btn => {
        btn.addEventListener('click', () => {
          const name = btn.dataset.name;
          const tag = btn.dataset.tag;
          container.querySelector('#pet-line-1').innerHTML = `"I like the <strong style="color:var(--accent-cyan); text-decoration: underline;">${name}</strong>."`;
          container.querySelector('#pet-line-2').innerHTML = `"It is <strong style="color:var(--text-gold); text-decoration: underline;">${tag}</strong>!"`;
          AUDIO.playCorrect();
          this.addXP(20);
        });
      });
    }

    // ==========================================
    // SLIDE 14: GRADUATION (CERTIFIED JUNIOR RANGER)
    // ==========================================
    renderSlide14Graduation(container, slide) {
      container.innerHTML = `
        <div style="background: radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.25) 0%, rgba(6, 9, 17, 0.95) 75%); border: 3px solid var(--accent-amber); border-radius: 24px; padding: 32px; text-align: center; box-shadow: 0 0 35px rgba(245, 158, 11, 0.35);">
          <div style="max-width: 220px; margin: 0 auto 12px auto; border-radius: 50%; overflow: hidden; border: 3px solid var(--accent-amber); box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);">
            <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="width: 100%; display: block;" />
          </div>

          <span style="font-size: 0.85rem; text-transform: uppercase; color: var(--accent-amber); font-weight: 900; letter-spacing: 0.1em;">
            Official Ranger Accreditation
          </span>
          <h2 style="font-size: 2.2rem; font-weight: 900; color: #ffffff; margin: 6px 0;">
            CERTIFIED JUNIOR BIOME RANGER
          </h2>
          <p style="color: var(--text-gold); font-size: 1.1rem; font-weight: 800; margin-bottom: 16px;">
            Two Different Forests Mastered!
          </p>

          <div style="display: flex; flex-direction: column; gap: 8px; max-width: 520px; margin: 0 auto 20px auto; text-align: left;">
            ${slide.achievements.map(a => `
              <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--accent-emerald); color: #ffffff; font-weight: 800; font-size: 0.9rem; padding: 8px 16px; border-radius: 12px;">
                ${a}
              </div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: center; gap: 16px;">
            <button type="button" class="btn-3d btn-3d-amber" id="btn-final-ranger-xp">
              ⭐ Claim +150 Final XP
            </button>
            <a href="worksheet.html" target="_blank" class="btn-3d btn-3d-cyan" style="text-decoration:none;">
              📄 Printable Ranger Worksheet
            </a>
          </div>
        </div>
      `;

      container.querySelector('#btn-final-ranger-xp').addEventListener('click', () => {
        AUDIO.playVictoryFanfare();
        this.addXP(150);
        this.awardBadge({ id: 'gold_medal', name: 'Junior Biome Ranger', icon: '🏅', desc: 'Certified Ranger' });
        alert("🎉 Congratulations, Ranger! You earned +150 XP and graduated as an Official Junior Biome Ranger! Give your webcam a high-five! ✋");
      });
    }
  }

  root.ForestSafariApp = ForestSafariApp;

  document.addEventListener('DOMContentLoaded', () => {
    root.forestSafariAppInstance = new ForestSafariApp();
  });
})(typeof window !== 'undefined' ? window : global);
