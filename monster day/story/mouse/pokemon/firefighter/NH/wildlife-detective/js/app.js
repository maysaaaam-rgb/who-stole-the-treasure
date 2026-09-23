/**
 * WILDLIFE DETECTIVE: APP ENGINE & REACTIVE STATE MACHINE
 * Powered by GAME_DATA: "Keep It Wild! Buy the Toy Lamp!"
 * English Adventure Academy | Grade 4 ESL / CEFR A1+ CLIL
 */

(function(root) {
  'use strict';

  class WildlifeDetectiveApp {
    constructor() {
      this.currentPhase = 1; // 1: Scanner, 2: Viral Lab, 3: Studio
      this.scannedAnimals = new Set();
      this.currentScenarioIndex = 0;
      this.earnedXP = 0;
      this.isBroadcasting = false;
      this.audioUnlocked = false;
    }

    init() {
      this._bindHeader();
      this._initPhase1Cards();
      this._initPhase2Scenarios();
      this._initPhase3Studio();
      this._setupAudioAutoUnlock();

      // Start on Phase 1
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
          const data = root.GAME_DATA || root.WILDLIFE_DATA;
          const totalCards = (data.phase1Cards || []).length;
          const totalScenarios = (data.phase2Scenarios || []).length;

          if (targetPhase === 1 ||
             (targetPhase === 2 && this.scannedAnimals.size >= totalCards) ||
             (targetPhase === 3 && this.currentScenarioIndex >= totalScenarios)) {
            this.goToPhase(targetPhase);
          } else {
            this.showToast('🔒 Complete current phase requirements first!');
          }
        });
      });

      // BGM Toggle
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

      // Update Stepper Navigation
      document.querySelectorAll('.phase-pill').forEach(pill => {
        const p = parseInt(pill.dataset.phase, 10);
        pill.classList.remove('active');
        if (p === phaseNum) pill.classList.add('active');
      });

      // Update Viewports
      document.querySelectorAll('.phase-viewport').forEach(vp => {
        vp.classList.remove('active');
      });
      const currentVp = document.getElementById(`phase-${phaseNum}-viewport`);
      if (currentVp) currentVp.classList.add('active');

      if (phaseNum === 2) {
        this._renderCurrentScenario();
      }

      if (phaseNum === 3) {
        this._setupTeleprompter();
      }
    }

    // ==========================================================================
    // PHASE 1: WILD HABITAT & ANIMAL NEEDS SCANNER
    // ==========================================================================
    _initPhase1Cards() {
      const container = document.getElementById('animals-grid');
      if (!container) return;

      const data = root.GAME_DATA || root.WILDLIFE_DATA;
      container.innerHTML = '';

      data.phase1Cards.forEach(cardData => {
        const card = document.createElement('div');
        card.className = 'animal-card';
        card.id = `card-${cardData.id}`;
        card.innerHTML = `
          <div class="radar-sweep-line"></div>
          <div class="animal-art-box">
            ${cardData.svg}
          </div>
          <div class="animal-meta">
            <span class="animal-name">${cardData.name}</span>
            <span class="threat-badge">Wild Animal 🌿</span>
          </div>
          <p class="animal-habitat">📌 <strong>Need:</strong> ${cardData.requirement}</p>
          <div class="clues-list">
            <div class="clue-item"><strong>Formula:</strong> The ${cardData.name.toLowerCase()} needs ${cardData.requirement.toLowerCase()}</div>
          </div>
          <button class="btn-3d btn-emerald" style="width:100%; margin-top:auto;" id="btn-scan-${cardData.id}">
            🔍 INVESTIGATE HABITAT
          </button>
        `;

        const scanBtn = card.querySelector(`#btn-scan-${cardData.id}`);
        scanBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._examineCard(cardData, card, scanBtn);
        });

        container.appendChild(card);
      });

      // Continue to Phase 2 Button
      const contBtn = document.getElementById('btn-scanner-continue');
      if (contBtn) {
        contBtn.addEventListener('click', () => {
          const total = data.phase1Cards.length;
          if (this.scannedAnimals.size >= total) {
            this.goToPhase(2);
          } else {
            this.showToast(`Investigate all ${total} animals first! (${this.scannedAnimals.size}/${total})`);
          }
        });
      }
    }

    _examineCard(cardData, cardEl, btnEl) {
      if (root.WildlifeAudio) {
        root.WildlifeAudio.playScannerBeep();
      }

      cardEl.classList.add('scanning');
      btnEl.textContent = 'ANALYZING...';

      setTimeout(() => {
        cardEl.classList.remove('scanning');
        cardEl.classList.add('scanned');
        btnEl.textContent = '✅ VERIFIED WILD';
        btnEl.classList.remove('btn-emerald');
        btnEl.classList.add('btn-cyan');

        this.scannedAnimals.add(cardData.id);

        if (root.WildlifeAudio) {
          root.WildlifeAudio.playCameraShutter();
          root.WildlifeAudio.speak(cardData.ttsPrompt);
        }

        this.earnedXP += 15;
        this.showToast(`✨ Verified: ${cardData.name}! (+15 XP)`);

        const total = (root.GAME_DATA || root.WILDLIFE_DATA).phase1Cards.length;
        if (this.scannedAnimals.size >= total) {
          const pill1 = document.querySelector('.phase-pill[data-phase="1"]');
          if (pill1) pill1.classList.add('completed');

          const contBtn = document.getElementById('btn-scanner-continue');
          if (contBtn) {
            contBtn.classList.remove('btn-cyan');
            contBtn.classList.add('btn-emerald');
            contBtn.innerHTML = '✨ Phase 2 Unlocked: Enter Viral Trend Lab ➔';
          }
        }
      }, 750);
    }

    // ==========================================================================
    // PHASE 2: VIRAL TRENDS VS WILD NATURE LAB
    // ==========================================================================
    _initPhase2Scenarios() {
      const btnReal = document.getElementById('btn-vote-real');
      const btnFake = document.getElementById('btn-vote-fake');
      const btnNext = document.getElementById('btn-next-post');

      if (btnReal) {
        btnReal.textContent = '🚨 HARMFUL WILD CAPTIVITY';
        btnReal.addEventListener('click', () => this._handleScenarioChoice(true));
      }
      if (btnFake) {
        btnFake.textContent = '✅ SAFE ECO-FRIENDLY TOY';
        btnFake.addEventListener('click', () => this._handleScenarioChoice(false));
      }
      if (btnNext) {
        btnNext.addEventListener('click', () => {
          const data = root.GAME_DATA || root.WILDLIFE_DATA;
          this.currentScenarioIndex++;
          if (this.currentScenarioIndex < data.phase2Scenarios.length) {
            this._renderCurrentScenario();
          } else {
            // Lab Complete
            const pill2 = document.querySelector('.phase-pill[data-phase="2"]');
            if (pill2) pill2.classList.add('completed');

            this.showToast('🎉 Investigation Complete! Advancing to Teleprompter Studio...');
            if (root.WildlifeAudio) root.WildlifeAudio.playPromotionFanfare();
            setTimeout(() => {
              this.goToPhase(3);
            }, 1800);
          }
        });
      }
    }

    _renderCurrentScenario() {
      const data = root.GAME_DATA || root.WILDLIFE_DATA;
      if (this.currentScenarioIndex >= data.phase2Scenarios.length) return;

      const sc = data.phase2Scenarios[this.currentScenarioIndex];

      const authorEl = document.getElementById('post-author');
      const avatarEl = document.getElementById('post-avatar');
      const captionEl = document.getElementById('post-caption');
      const previewTextEl = document.getElementById('video-preview-text');
      const progressLabel = document.getElementById('lab-progress-label');
      const feedbackBox = document.getElementById('feedback-box');
      const nextBtn = document.getElementById('btn-next-post');
      const previewCard = document.querySelector('.video-simulation-card');

      if (authorEl) authorEl.textContent = sc.title;
      if (avatarEl) avatarEl.textContent = sc.isWildHarm ? '🛁' : '💡';
      if (captionEl) captionEl.textContent = sc.description;
      if (previewTextEl) previewTextEl.textContent = sc.description;
      if (progressLabel) progressLabel.textContent = `Scenario ${this.currentScenarioIndex + 1} of ${data.phase2Scenarios.length}`;

      if (previewCard && sc.svg) {
        previewCard.innerHTML = `<div style="width:130px; height:110px;">${sc.svg}</div>`;
      }

      if (feedbackBox) feedbackBox.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      document.getElementById('decision-buttons').style.display = 'grid';

      if (root.WildlifeAudio) {
        root.WildlifeAudio.speak(sc.title + '. ' + sc.description);
      }
    }

    _handleScenarioChoice(choseHarmful) {
      const data = root.GAME_DATA || root.WILDLIFE_DATA;
      const sc = data.phase2Scenarios[this.currentScenarioIndex];
      const isCorrect = (choseHarmful === sc.isWildHarm);

      const feedbackBox = document.getElementById('feedback-box');
      const tagEl = document.getElementById('feedback-tag');
      const textEl = document.getElementById('feedback-text');
      const adviceEl = document.getElementById('feedback-advice');
      const nextBtn = document.getElementById('btn-next-post');
      const decisionBtns = document.getElementById('decision-buttons');

      decisionBtns.style.display = 'none';

      if (feedbackBox && tagEl && textEl && adviceEl) {
        tagEl.textContent = isCorrect ? '🎯 EXCELLENT WILDLIFE RANGER JUDGMENT!' : '⚠️ WATCH OUT!';
        tagEl.style.color = isCorrect ? '#34d399' : '#f59e0b';
        textEl.textContent = sc.ruleSpeech;
        adviceEl.textContent = sc.isWildHarm 
          ? 'Rule: Keep it wild! Animals need their natural wetland & herd.'
          : 'Rule: Buy the toy nightlight and leave real animals in nature!';
        feedbackBox.style.display = 'flex';
      }

      if (isCorrect) {
        if (root.WildlifeAudio) root.WildlifeAudio.playTruthChime();
        this.earnedXP += 25;
        this.showToast('✅ Correct Ranger Decision! (+25 XP)');
      } else {
        if (root.WildlifeAudio) root.WildlifeAudio.playBuzzer();
        this.showToast('Learn the rule: Keep wild animals in nature!');
      }

      if (root.WildlifeAudio) {
        root.WildlifeAudio.speak(sc.ruleSpeech);
      }

      if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.textContent = (this.currentScenarioIndex + 1 < data.phase2Scenarios.length)
          ? 'Next Scenario ➔'
          : 'Proceed to Ranger Teleprompter Studio ➔';
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

      const restartBtn = document.getElementById('btn-restart-mission');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          this.scannedAnimals.clear();
          this.currentScenarioIndex = 0;
          this.goToPhase(1);
          this._initPhase1Cards();
        });
      }
    }

    _setupTeleprompter() {
      const scriptBox = document.getElementById('teleprompter-script');
      if (!scriptBox) return;

      const data = root.GAME_DATA || root.WILDLIFE_DATA;
      scriptBox.innerHTML = '';

      const p = document.createElement('div');
      p.className = 'script-sentence-block';

      data.teleprompterScript.forEach((word, wIdx) => {
        const span = document.createElement('span');
        span.className = 'tele-word';
        span.id = `tele-word-${wIdx}`;
        span.textContent = word + ' ';
        if (['wild', 'capybara.', 'wetland', 'herd!'].includes(word.toLowerCase())) {
          span.classList.add('keyword');
        }
        p.appendChild(span);
      });

      scriptBox.appendChild(p);

      const totalXpEl = document.getElementById('total-earned-xp');
      if (totalXpEl) totalXpEl.textContent = `Total XP Earned: ${this.earnedXP} XP • Master Conservationist`;
    }

    _startOralBroadcast() {
      if (this.isBroadcasting) return;
      this.isBroadcasting = true;

      const data = root.GAME_DATA || root.WILDLIFE_DATA;
      const fullText = data.teleprompterScript.join(' ');
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
            this.showToast('🎙️ Live Broadcast Complete! Excellent Speaking!');
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
