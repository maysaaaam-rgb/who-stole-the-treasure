/**
 * WILDLIFE DETECTIVE: APP ENGINE & REACTIVE STATE MACHINE
 * English Adventure Academy | Grade 4 ESL / CEFR A1+ CLIL
 */

(function(root) {
  'use strict';

  class WildlifeDetectiveApp {
    constructor() {
      this.currentPhase = 1; // 1: Scanner, 2: Viral Lab, 3: Studio
      this.scannedAnimals = new Set();
      this.currentPostIndex = 0;
      this.verifiedPostsCount = 0;
      this.earnedXP = 0;
      this.isBroadcasting = false;
      this.audioUnlocked = false;
    }

    init() {
      this._bindHeader();
      this._initPhase1Scanner();
      this._initPhase2ViralLab();
      this._initPhase3Studio();
      this._setupAudioAutoUnlock();

      // Show Phase 1 initially
      this.goToPhase(1);
    }

    _setupAudioAutoUnlock() {
      const unlock = () => {
        if (!this.audioUnlocked && root.WildlifeAudio) {
          root.WildlifeAudio.ensureAudio();
          this.audioUnlocked = true;
        }
      };
      window.addEventListener('click', unlock, { once: true });
      window.addEventListener('touchstart', unlock, { once: true });
    }

    _bindHeader() {
      // Stepper Navigation
      document.querySelectorAll('.phase-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const targetPhase = parseInt(pill.dataset.phase, 10);
          if (targetPhase === 1 ||
             (targetPhase === 2 && this.scannedAnimals.size >= 6) ||
             (targetPhase === 3 && this.currentPostIndex >= root.WILDLIFE_DATA.VIRAL_POSTS.length)) {
            this.goToPhase(targetPhase);
          } else {
            this.showToast('🔒 Complete current phase requirements first!');
          }
        });
      });

      // BGM Ambient Drone Toggle
      const bgmBtn = document.getElementById('btn-bgm-toggle');
      if (bgmBtn) {
        bgmBtn.addEventListener('click', () => {
          if (!root.WildlifeAudio) return;
          const active = root.WildlifeAudio.toggleBGM();
          bgmBtn.style.opacity = active ? '1' : '0.5';
          this.showToast(active ? '🎵 Ranger Ambient Audio: ON' : '🔇 Ranger Ambient Audio: OFF');
        });
      }

      // Mute Toggle
      const muteBtn = document.getElementById('btn-mute-toggle');
      if (muteBtn) {
        muteBtn.addEventListener('click', () => {
          if (!root.WildlifeAudio) return;
          const muted = root.WildlifeAudio.toggleMute();
          muteBtn.textContent = muted ? '🔇' : '🔊';
        });
      }
    }

    goToPhase(phaseNum) {
      this.currentPhase = phaseNum;

      // Update Stepper Pills
      document.querySelectorAll('.phase-pill').forEach(pill => {
        const p = parseInt(pill.dataset.phase, 10);
        pill.classList.remove('active');
        if (p === phaseNum) {
          pill.classList.add('active');
        }
      });

      // Switch Viewports
      document.querySelectorAll('.phase-viewport').forEach(vp => {
        vp.classList.remove('active');
      });
      const currentVp = document.getElementById(`phase-${phaseNum}-viewport`);
      if (currentVp) currentVp.classList.add('active');

      if (phaseNum === 2) {
        this._renderCurrentViralPost();
      }

      if (phaseNum === 3) {
        this._setupTeleprompter();
      }
    }

    // ==========================================================================
    // PHASE 1: WILDLIFE ADAPTATION SCANNER
    // ==========================================================================
    _initPhase1Scanner() {
      const container = document.getElementById('animals-grid');
      if (!container) return;

      container.innerHTML = '';
      root.WILDLIFE_DATA.ANIMALS_DATA.forEach(animal => {
        const card = document.createElement('div');
        card.className = 'animal-card';
        card.id = `animal-card-${animal.id}`;
        card.innerHTML = `
          <div class="radar-sweep-line"></div>
          <div class="animal-art-box">
            <img src="${animal.iconSvg}" alt="${animal.name}"/>
          </div>
          <div class="animal-meta">
            <span class="animal-name">${animal.name}</span>
            <span class="threat-badge">${animal.threatLevel}</span>
          </div>
          <div class="adaptation-highlight">⚡ ${animal.keyAdaptation}</div>
          <p class="animal-habitat">📍 <strong>Habitat:</strong> ${animal.habitat}</p>
          <div class="clues-list">
            ${animal.clues.map(c => `
              <div class="clue-item"><strong>${c.label}:</strong> ${c.desc}</div>
            `).join('')}
          </div>
          <button class="btn-3d btn-emerald" style="width:100%; margin-top:auto;" id="scan-btn-${animal.id}">
            🔍 SCAN BIOMETRICS
          </button>
        `;

        const scanBtn = card.querySelector(`#scan-btn-${animal.id}`);
        scanBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._scanAnimal(animal, card, scanBtn);
        });

        container.appendChild(card);
      });

      // Continue to Phase 2 Button
      const contBtn = document.getElementById('btn-scanner-continue');
      if (contBtn) {
        contBtn.addEventListener('click', () => {
          if (this.scannedAnimals.size >= 6) {
            this.goToPhase(2);
          } else {
            this.showToast(`Please scan all 6 animals first! (${this.scannedAnimals.size}/6 scanned)`);
          }
        });
      }
    }

    _scanAnimal(animal, cardEl, btnEl) {
      if (root.WildlifeAudio) {
        root.WildlifeAudio.playScannerBeep();
      }

      cardEl.classList.add('scanning');
      btnEl.textContent = 'SCANNING...';

      setTimeout(() => {
        cardEl.classList.remove('scanning');
        cardEl.classList.add('scanned');
        btnEl.textContent = '✅ VERIFIED';
        btnEl.classList.remove('btn-emerald');
        btnEl.classList.add('btn-cyan');

        this.scannedAnimals.add(animal.id);

        if (root.WildlifeAudio) {
          root.WildlifeAudio.playAnimalVocal(animal.soundType);
          root.WildlifeAudio.speak(animal.ttsAudio);
        }

        this.earnedXP += 10;
        this.showToast(`✨ Scanned ${animal.name}! (+10 XP)`);

        // Check if all 6 are scanned
        if (this.scannedAnimals.size >= 6) {
          const pill1 = document.querySelector('.phase-pill[data-phase="1"]');
          if (pill1) pill1.classList.add('completed');

          const contBtn = document.getElementById('btn-scanner-continue');
          if (contBtn) {
            contBtn.classList.remove('btn-cyan');
            contBtn.classList.add('btn-emerald');
            contBtn.innerHTML = '✨ Phase 2 Unlocked: Enter Viral Lab ➔';
          }
        }
      }, 900);
    }

    // ==========================================================================
    // PHASE 2: SOCIAL MEDIA LITERACY LAB (TIKTOK / REELS DETECTOR)
    // ==========================================================================
    _initPhase2ViralLab() {
      const btnReal = document.getElementById('btn-vote-real');
      const btnFake = document.getElementById('btn-vote-fake');
      const btnNext = document.getElementById('btn-next-post');

      if (btnReal) {
        btnReal.addEventListener('click', () => this._handleViralVote(true));
      }
      if (btnFake) {
        btnFake.addEventListener('click', () => this._handleViralVote(false));
      }
      if (btnNext) {
        btnNext.addEventListener('click', () => {
          this.currentPostIndex++;
          if (this.currentPostIndex < root.WILDLIFE_DATA.VIRAL_POSTS.length) {
            this._renderCurrentViralPost();
          } else {
            // Lab Complete!
            const pill2 = document.querySelector('.phase-pill[data-phase="2"]');
            if (pill2) pill2.classList.add('completed');

            this.showToast('🎉 Social Media Detective Training Complete! Proceeding to Studio...');
            if (root.WildlifeAudio) root.WildlifeAudio.playPromotionFanfare();
            setTimeout(() => {
              this.goToPhase(3);
            }, 1800);
          }
        });
      }
    }

    _renderCurrentViralPost() {
      const posts = root.WILDLIFE_DATA.VIRAL_POSTS;
      if (this.currentPostIndex >= posts.length) return;

      const post = posts[this.currentPostIndex];

      const authorEl = document.getElementById('post-author');
      const avatarEl = document.getElementById('post-avatar');
      const likesEl = document.getElementById('post-likes');
      const sharesEl = document.getElementById('post-shares');
      const captionEl = document.getElementById('post-caption');
      const previewTextEl = document.getElementById('video-preview-text');
      const progressLabel = document.getElementById('lab-progress-label');
      const feedbackBox = document.getElementById('feedback-box');
      const nextBtn = document.getElementById('btn-next-post');

      if (authorEl) authorEl.textContent = post.author;
      if (avatarEl) avatarEl.textContent = post.avatar;
      if (likesEl) likesEl.textContent = `❤️ ${post.likes}`;
      if (sharesEl) sharesEl.textContent = `↗️ ${post.shares}`;
      if (captionEl) captionEl.textContent = post.headline;
      if (previewTextEl) previewTextEl.textContent = `🎬 "${post.videoPreview}"`;
      if (progressLabel) progressLabel.textContent = `Video Investigation ${this.currentPostIndex + 1} of ${posts.length}`;

      if (feedbackBox) feedbackBox.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';

      document.getElementById('decision-buttons').style.display = 'grid';

      if (root.WildlifeAudio) {
        root.WildlifeAudio.speak(post.headline);
      }
    }

    _handleViralVote(isRealVote) {
      const post = root.WILDLIFE_DATA.VIRAL_POSTS[this.currentPostIndex];
      const isCorrect = (isRealVote === post.isRealScience);

      const feedbackBox = document.getElementById('feedback-box');
      const tagEl = document.getElementById('feedback-tag');
      const textEl = document.getElementById('feedback-text');
      const adviceEl = document.getElementById('feedback-advice');
      const nextBtn = document.getElementById('btn-next-post');
      const decisionBtns = document.getElementById('decision-buttons');

      decisionBtns.style.display = 'none';

      if (feedbackBox && tagEl && textEl && adviceEl) {
        tagEl.textContent = isCorrect ? `🎯 EXCELLENT INVESTIGATION! ${post.tag}` : `⚠️ WARNING: MISINFORMATION! ${post.tag}`;
        tagEl.style.color = isCorrect ? '#34d399' : '#ef4444';
        textEl.textContent = post.explanation;
        adviceEl.textContent = `🛡️ Ranger Rule: ${post.rangerAdvice}`;
        feedbackBox.style.display = 'flex';
      }

      if (isCorrect) {
        if (root.WildlifeAudio) root.WildlifeAudio.playTruthChime();
        this.earnedXP += 20;
        this.verifiedPostsCount++;
        this.showToast('✅ Verified correctly! (+20 XP)');
      } else {
        if (root.WildlifeAudio) root.WildlifeAudio.playBuzzer();
        this.showToast('❌ Clickbait trap identified! Learn the science!');
      }

      if (root.WildlifeAudio) {
        root.WildlifeAudio.speak(post.explanation);
      }

      if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.textContent = (this.currentPostIndex + 1 < root.WILDLIFE_DATA.VIRAL_POSTS.length)
          ? 'Next Investigation ➔'
          : 'Finalize Ranger Mission ➔';
      }
    }

    // ==========================================================================
    // PHASE 3: LIVE TELEPROMPTER STUDIO (ORAL PRODUCTION)
    // ==========================================================================
    _initPhase3Studio() {
      const broadcastBtn = document.getElementById('btn-broadcast-report');
      if (broadcastBtn) {
        broadcastBtn.addEventListener('click', () => {
          this._startOralBroadcast();
        });
      }

      const replayBtn = document.getElementById('btn-restart-mission');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          this.scannedAnimals.clear();
          this.currentPostIndex = 0;
          this.verifiedPostsCount = 0;
          this.goToPhase(1);
          this._initPhase1Scanner();
        });
      }
    }

    _setupTeleprompter() {
      const scriptBox = document.getElementById('teleprompter-script');
      if (!scriptBox) return;

      scriptBox.innerHTML = '';
      root.WILDLIFE_DATA.TELEPROMPTER_TEMPLATE.forEach((line, sIdx) => {
        const p = document.createElement('div');
        p.className = 'script-sentence-block';

        const words = line.text.split(' ');
        words.forEach((w, wIdx) => {
          const span = document.createElement('span');
          span.className = 'tele-word';
          span.id = `tele-word-${sIdx}-${wIdx}`;
          span.textContent = w + ' ';
          if (w.toLowerCase().includes(line.highlightKey)) {
            span.classList.add('keyword');
          }
          p.appendChild(span);
        });

        scriptBox.appendChild(p);
      });

      const totalXpEl = document.getElementById('total-earned-xp');
      if (totalXpEl) totalXpEl.textContent = `Total XP Earned: ${this.earnedXP} XP`;
    }

    _startOralBroadcast() {
      if (this.isBroadcasting) return;
      this.isBroadcasting = true;

      const fullText = root.WILDLIFE_DATA.TELEPROMPTER_TEMPLATE.map(s => s.text).join(' ');
      const wordsSpans = Array.from(document.querySelectorAll('.tele-word'));

      wordsSpans.forEach(s => s.classList.remove('active-reading'));

      let wordPointer = 0;
      if (root.WildlifeAudio) {
        root.WildlifeAudio.speak(
          fullText,
          () => {
            wordsSpans.forEach(s => s.classList.remove('active-reading'));
            if (wordsSpans[wordPointer]) {
              wordsSpans[wordPointer].classList.add('active-reading');
              wordPointer++;
            }
          },
          () => {
            wordsSpans.forEach(s => s.classList.remove('active-reading'));
            this.isBroadcasting = false;
            this.showToast('🎙️ Live Ranger Broadcast Complete! Outstanding Speaking!');
            if (root.WildlifeAudio) root.WildlifeAudio.playPromotionFanfare();
          }
        );
      }
    }

    showToast(message) {
      let toast = document.getElementById('ranger-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'ranger-toast';
        toast.id = 'ranger-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('visible');
      setTimeout(() => {
        toast.classList.remove('visible');
      }, 2400);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    root.WildlifeApp = new WildlifeDetectiveApp();
    root.WildlifeApp.init();
  });

})(typeof window !== 'undefined' ? window : this);
