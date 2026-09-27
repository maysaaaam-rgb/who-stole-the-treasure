/**
 * THE WIND AND THE SUN: WEATHER POWERS & THE JACKET CONTEST
 * Interactive Game Engine & Pedagogical Controller
 * YouTube IFrame Sync • Weather Powers Lab • 20s Reaction Drill • Live Teleprompter
 */

(function(root) {
  'use strict';

  class WindAndSunApp {
    constructor() {
      this.data = root.WIND_AND_SUN_DATA;
      this.audio = root.WindAndSunAudio;

      this.currentStage = 1;
      this.xp = 0;
      this.awardedStages = new Set();
      this.clearedCheckpoints = new Set();
      this.activeCheckpoint = null;

      // YouTube State
      this.ytPlayer = null;
      this.ytReady = false;
      this.videoTimer = null;
      this.triggeredTimestamps = new Set();

      // Weather Lab State
      this.windLevel = 1;
      this.sunLevel = 1;

      // Reaction Race State
      this.raceActive = false;
      this.raceTimeLeft = 20;
      this.raceTimerInterval = null;
      this.raceTokens = [];
      this.currentRaceIndex = 0;
      this.raceScore = 0;
      this.raceStreak = 0;

      // Teleprompter State
      this.tpIndex = 0;
      this.tpSpeaking = false;
      this.tpInterval = null;

      // Confetti engine
      this.confettiParticles = [];
      this.confettiAnimId = null;

      this.init();
    }

    init() {
      this.cacheDOMElements();
      this.bindEvents();
      this.setupStageNavigation();
      this.initYouTubePlayer();
      this.setupWeatherLab();
      this.setupTeleprompter();
      this.initConfetti();
    }

    cacheDOMElements() {
      // HUD
      this.xpDisplay = document.getElementById('current-xp');
      this.audioBtn = document.getElementById('audio-toggle-btn');
      this.audioIcon = document.getElementById('audio-icon');

      // Stage Views
      this.stageViews = {
        1: document.getElementById('stage-1-view'),
        2: document.getElementById('stage-2-view'),
        3: document.getElementById('stage-3-view'),
        4: document.getElementById('stage-4-view')
      };

      this.stagePills = {
        1: document.getElementById('pill-stage-1'),
        2: document.getElementById('pill-stage-2'),
        3: document.getElementById('pill-stage-3'),
        4: document.getElementById('pill-stage-4')
      };

      // Stage 1
      this.cinemaFallback = document.getElementById('cinema-fallback');
      this.btnProceedStage2 = document.getElementById('btn-proceed-stage2');
      this.btnSkipToStage2 = document.getElementById('btn-skip-to-stage2');
      this.fallbackReadBtn = document.getElementById('fallback-read-btn');
      this.fallbackCheckpointsBtn = document.getElementById('fallback-checkpoints-btn');

      // Checkpoint Modal
      this.cpModalOverlay = document.getElementById('checkpoint-overlay');
      this.cpModalBadge = document.getElementById('cp-modal-badge');
      this.cpModalQuestion = document.getElementById('cp-modal-question');
      this.cpModalHint = document.getElementById('cp-modal-hint');
      this.cpOptionsGrid = document.getElementById('cp-options-grid');
      this.cpFeedback = document.getElementById('cp-feedback');
      this.btnCpContinue = document.getElementById('btn-cp-continue');

      // Stage 2
      this.windSlider = document.getElementById('wind-slider');
      this.windLevelText = document.getElementById('wind-level-text');
      this.windTitle = document.getElementById('wind-title');
      this.windDesc = document.getElementById('wind-desc');
      this.btnTestWind = document.getElementById('btn-test-wind');

      this.sunSlider = document.getElementById('sun-slider');
      this.sunLevelText = document.getElementById('sun-level-text');
      this.sunTitle = document.getElementById('sun-title');
      this.sunDesc = document.getElementById('sun-desc');
      this.btnTestSun = document.getElementById('btn-test-sun');

      this.simTravelerImg = document.getElementById('sim-traveler-img');
      this.travelerReactionPill = document.getElementById('traveler-reaction-pill');
      this.envBackdrop = document.getElementById('env-backdrop');
      this.btnProceedStage3 = document.getElementById('btn-proceed-stage3');

      // Stage 3
      this.raceTimerBar = document.getElementById('race-timer-bar');
      this.raceTimerText = document.getElementById('race-timer-text');
      this.raceScoreText = document.getElementById('race-score-text');
      this.raceStreakText = document.getElementById('race-streak-text');
      this.raceTokenWord = document.getElementById('race-token-word');
      this.raceTokenPrompt = document.getElementById('race-token-prompt');
      this.btnBinZip = document.getElementById('btn-bin-zip');
      this.btnBinUnzip = document.getElementById('btn-bin-unzip');
      this.btnStartRace = document.getElementById('btn-start-race');
      this.btnProceedStage4 = document.getElementById('btn-proceed-stage4');

      // Stage 4
      this.tpLineText = document.getElementById('tp-line-text');
      this.btnTpPrev = document.getElementById('btn-tp-prev');
      this.btnTpSpeak = document.getElementById('btn-tp-speak');
      this.btnTpNext = document.getElementById('btn-tp-next');
      this.btnCompleteLesson = document.getElementById('btn-complete-lesson');

      // Victory Modal
      this.victoryModal = document.getElementById('victory-modal');
      this.confettiCanvas = document.getElementById('confetti-canvas');
    }

    bindEvents() {
      // Audio Mute Toggle
      this.audioBtn.addEventListener('click', () => {
        const isMuted = this.audio.toggleMute();
        this.audioIcon.textContent = isMuted ? '🔇' : '🔊';
        if (!isMuted) this.audio.playSnap();
      });

      // Stage 1 Proceed / Skip
      this.btnProceedStage2.addEventListener('click', () => this.goToStage(2));
      this.btnSkipToStage2.addEventListener('click', () => {
        this.audio.playSnap();
        if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
          this.ytPlayer.pauseVideo();
        }
        this.goToStage(2);
      });

      // Fallback handlers
      this.fallbackReadBtn.addEventListener('click', () => {
        this.audio.speak("The Wind and the Sun had a contest to make the traveler take off his jacket. The Wind blew cold and freezing storm clouds, but the man zipped his jacket tightly! Then the Sun shone warm and bright, and the man took off his jacket!");
      });

      this.fallbackCheckpointsBtn.addEventListener('click', () => {
        const nextUncleared = this.data.checkpoints.find(cp => !this.clearedCheckpoints.has(cp.id));
        if (nextUncleared) {
          this.triggerCheckpoint(nextUncleared);
        } else {
          this.triggerCheckpoint(this.data.checkpoints[0]);
        }
      });

      // Checkpoint modal continue button
      this.btnCpContinue.addEventListener('click', () => {
        this.audio.playSnap();
        this.cpModalOverlay.classList.remove('active');
        if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
          this.ytPlayer.playVideo();
        }
      });

      // Stage 2 Proceed
      this.btnProceedStage3.addEventListener('click', () => {
        this.awardXP(this.data.weatherLab.xpReward, 'stage2');
        this.goToStage(3);
      });

      // Stage 3 Race Buttons
      this.btnStartRace.addEventListener('click', () => this.startReactionRace());
      this.btnBinZip.addEventListener('click', () => this.handleRaceChoice('zip'));
      this.btnBinUnzip.addEventListener('click', () => this.handleRaceChoice('unzip'));
      this.btnProceedStage4.addEventListener('click', () => {
        this.awardXP(this.data.reactionRace.xpReward, 'stage3');
        this.goToStage(4);
      });

      // Stage 4 Teleprompter
      this.btnTpPrev.addEventListener('click', () => {
        this.audio.playSnap();
        this.tpIndex = Math.max(0, this.tpIndex - 1);
        this.renderTeleprompterLine();
      });

      this.btnTpNext.addEventListener('click', () => {
        this.audio.playSnap();
        this.tpIndex = Math.min(this.data.teleprompter.lines.length - 1, this.tpIndex + 1);
        this.renderTeleprompterLine();
      });

      this.btnTpSpeak.addEventListener('click', () => this.playKaraokeNarration());

      this.btnCompleteLesson.addEventListener('click', () => this.finalizeLesson());
    }

    setupStageNavigation() {
      Object.keys(this.stagePills).forEach(stageNum => {
        const pill = this.stagePills[stageNum];
        pill.addEventListener('click', () => {
          this.audio.playSnap();
          this.goToStage(parseInt(stageNum, 10));
        });
      });
    }

    goToStage(stageNumber) {
      if (this.currentStage === 1 && this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
        try { this.ytPlayer.pauseVideo(); } catch (e) {}
      }

      this.currentStage = stageNumber;

      // Update Views
      Object.keys(this.stageViews).forEach(num => {
        this.stageViews[num].classList.toggle('active-stage', parseInt(num, 10) === stageNumber);
      });

      // Update HUD Pills
      Object.keys(this.stagePills).forEach(num => {
        this.stagePills[num].classList.toggle('active', parseInt(num, 10) === stageNumber);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // =========================================================================
    // STAGE 1: YouTube IFrame & Dynamic Polling
    // =========================================================================
    initYouTubePlayer() {
      const fallbackTimer = setTimeout(() => {
        if (!this.ytReady) {
          console.warn("YouTube API took too long to load. Showing fallback terminal.");
          if (this.cinemaFallback) this.cinemaFallback.classList.add('visible');
          this.btnProceedStage2.disabled = false;
        }
      }, 4000);

      window.onYouTubeIframeAPIReady = () => {
        this.ytReady = true;
        clearTimeout(fallbackTimer);
        try {
          this.ytPlayer = new YT.Player('player', {
            videoId: this.data.meta.videoId,
            playerVars: {
              autoplay: 0,
              modestbranding: 1,
              rel: 0,
              controls: 1,
              origin: window.location.origin
            },
            events: {
              onReady: () => {
                this.startVideoPolling();
              },
              onError: () => {
                if (this.cinemaFallback) this.cinemaFallback.classList.add('visible');
                this.btnProceedStage2.disabled = false;
              }
            }
          });
        } catch (e) {
          if (this.cinemaFallback) this.cinemaFallback.classList.add('visible');
          this.btnProceedStage2.disabled = false;
        }
      };

      // Load YouTube IFrame API script tag dynamically
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else if (window.YT && window.YT.Player) {
        window.onYouTubeIframeAPIReady();
      }
    }

    startVideoPolling() {
      if (this.videoTimer) clearInterval(this.videoTimer);

      this.videoTimer = setInterval(() => {
        if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;

        const state = this.ytPlayer.getPlayerState();
        if (state !== 1) return; // 1 = playing

        const currentTime = Math.floor(this.ytPlayer.getCurrentTime());

        // Check if currentTime hits any checkpoint
        this.data.checkpoints.forEach(cp => {
          if (!this.triggeredTimestamps.has(cp.id) && Math.abs(currentTime - cp.timestamp) <= 1) {
            this.triggeredTimestamps.add(cp.id);
            this.ytPlayer.pauseVideo();
            this.triggerCheckpoint(cp);
          }
        });
      }, 350);
    }

    triggerCheckpoint(checkpoint) {
      this.activeCheckpoint = checkpoint;
      this.cpModalBadge.textContent = checkpoint.badgeText;
      this.cpModalQuestion.textContent = checkpoint.question;
      this.cpModalHint.textContent = "💡 " + checkpoint.hint;
      this.cpFeedback.textContent = '';
      this.cpFeedback.className = 'checkpoint-feedback';
      this.btnCpContinue.style.display = 'none';

      // Render Options
      this.cpOptionsGrid.innerHTML = '';
      checkpoint.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'choice-option-btn';
        btn.innerHTML = `<span class="choice-icon">${opt.icon}</span><span>${opt.label}</span>`;
        btn.addEventListener('click', () => this.handleCheckpointChoice(opt, checkpoint));
        this.cpOptionsGrid.appendChild(btn);
      });

      this.cpModalOverlay.classList.add('active');
      this.audio.speak(checkpoint.question);
    }

    handleCheckpointChoice(option, checkpoint) {
      if (option.isCorrect) {
        this.audio.playXP();
        this.cpFeedback.textContent = option.feedback;
        this.cpFeedback.className = 'checkpoint-feedback success';
        this.audio.speak(option.feedback);

        this.clearedCheckpoints.add(checkpoint.id);
        this.awardXP(checkpoint.xpReward, checkpoint.id);

        // Update checkpoint badge pill in Stage 1
        const markerPill = document.getElementById(`cp-marker-${checkpoint.stage === 1 ? checkpoint.id.replace('cp', '') : '1'}`);
        if (markerPill) {
          markerPill.classList.add('done');
          markerPill.firstElementChild.textContent = '✅';
        }

        // Show continue button
        this.btnCpContinue.style.display = 'inline-flex';
        this.btnProceedStage2.disabled = false;
      } else {
        this.audio.playSoftFail();
        this.cpFeedback.textContent = option.feedback;
        this.cpFeedback.className = 'checkpoint-feedback fail';
        this.audio.speak(option.feedback);
      }
    }

    // =========================================================================
    // STAGE 2: 3D Weather Powers Lab
    // =========================================================================
    setupWeatherLab() {
      // Wind Slider
      this.windSlider.addEventListener('input', (e) => {
        this.windLevel = parseInt(e.target.value, 10);
        this.updateWeatherLab();
        this.audio.playWindSweep(this.windLevel);
      });

      // Sun Slider
      this.sunSlider.addEventListener('input', (e) => {
        this.sunLevel = parseInt(e.target.value, 10);
        this.updateWeatherLab();
        this.audio.playSunChime(this.sunLevel);
      });

      // Test Buttons
      this.btnTestWind.addEventListener('click', () => {
        this.audio.playWindSweep(this.windLevel);
        this.triggerWindBlastAnimation();
      });

      this.btnTestSun.addEventListener('click', () => {
        this.audio.playSunChime(this.sunLevel);
        this.triggerSunGlowAnimation();
      });

      this.updateWeatherLab();
    }

    updateWeatherLab() {
      const windInfo = this.data.weatherLab.windLevels[this.windLevel - 1];
      const sunInfo = this.data.weatherLab.sunLevels[this.sunLevel - 1];

      // Update Labels
      this.windLevelText.textContent = `Level ${this.windLevel}`;
      this.windTitle.textContent = windInfo.name;
      this.windDesc.textContent = windInfo.desc;

      this.sunLevelText.textContent = `Level ${this.sunLevel}`;
      this.sunTitle.textContent = sunInfo.name;
      this.sunDesc.textContent = sunInfo.desc;

      // Determine Dominant Weather & Reaction
      if (this.windLevel > this.sunLevel) {
        // Wind Dominant
        this.envBackdrop.style.background = `radial-gradient(circle at 30% 40%, rgba(56, 189, 248, ${0.1 + this.windLevel * 0.08}) 0%, transparent 70%)`;
        this.simTravelerImg.style.filter = `hue-rotate(${this.windLevel * 12}deg) brightness(${1 - this.windLevel * 0.05})`;
        this.simTravelerImg.style.transform = `translateX(-${this.windLevel * 3}px) rotate(-${this.windLevel}deg)`;

        if (this.windLevel >= 3) {
          this.travelerReactionPill.innerHTML = `<span>🥶 It is freezing cold! Traveler <b>zips up his jacket tightly</b>!</span>`;
          this.travelerReactionPill.style.borderColor = 'var(--accent-cyan)';
        } else {
          this.travelerReactionPill.innerHTML = `<span>🍃 A cool gust blows. Traveler holds his collar.</span>`;
          this.travelerReactionPill.style.borderColor = 'var(--glass-border)';
        }
      } else if (this.sunLevel > this.windLevel) {
        // Sun Dominant
        this.envBackdrop.style.background = `radial-gradient(circle at 70% 40%, rgba(245, 158, 11, ${0.1 + this.sunLevel * 0.08}) 0%, transparent 70%)`;
        this.simTravelerImg.style.filter = `sepia(${this.sunLevel * 0.15}) brightness(${1 + this.sunLevel * 0.08})`;
        this.simTravelerImg.style.transform = `scale(${1 + this.sunLevel * 0.02})`;

        if (this.sunLevel >= 3) {
          this.travelerReactionPill.innerHTML = `<span>☀️ Warm sunshine beams down! Traveler <b>takes off his jacket</b>!</span>`;
          this.travelerReactionPill.style.borderColor = 'var(--accent-amber)';
        } else {
          this.travelerReactionPill.innerHTML = `<span>🌤️ Pleasant light warms the countryside.</span>`;
          this.travelerReactionPill.style.borderColor = 'var(--glass-border)';
        }
      } else {
        // Balanced
        this.envBackdrop.style.background = `transparent`;
        this.simTravelerImg.style.filter = 'none';
        this.simTravelerImg.style.transform = 'none';
        this.travelerReactionPill.innerHTML = `<span>🧥 The weather is balanced. Traveler walks peacefully.</span>`;
        this.travelerReactionPill.style.borderColor = 'var(--glass-border)';
      }
    }

    triggerWindBlastAnimation() {
      this.simTravelerImg.style.transition = 'transform 0.1s ease';
      this.simTravelerImg.style.transform = `translateX(-18px) rotate(-4deg)`;
      setTimeout(() => {
        this.simTravelerImg.style.transition = 'transform 0.4s ease';
        this.updateWeatherLab();
      }, 350);
    }

    triggerSunGlowAnimation() {
      this.simTravelerImg.style.transition = 'filter 0.2s ease, transform 0.2s ease';
      this.simTravelerImg.style.filter = 'brightness(1.4) drop-shadow(0 0 20px #f59e0b)';
      setTimeout(() => {
        this.simTravelerImg.style.transition = 'filter 0.4s ease, transform 0.4s ease';
        this.updateWeatherLab();
      }, 400);
    }

    // =========================================================================
    // STAGE 3: Jacket Reaction Race (20s Sorting Drill)
    // =========================================================================
    startReactionRace() {
      this.audio.playSnap();
      this.raceActive = true;
      this.raceTimeLeft = this.data.reactionRace.durationSeconds;
      this.raceScore = 0;
      this.raceStreak = 0;
      this.currentRaceIndex = 0;

      // Prepare and shuffle tokens
      const zips = this.data.reactionRace.zipTokens.map(w => ({ text: w, type: 'zip' }));
      const unzips = this.data.reactionRace.unzipTokens.map(w => ({ text: w, type: 'unzip' }));
      this.raceTokens = [...zips, ...unzips].sort(() => Math.random() - 0.5);

      this.btnBinZip.disabled = false;
      this.btnBinUnzip.disabled = false;
      this.btnStartRace.style.display = 'none';
      this.btnProceedStage4.style.display = 'none';

      this.updateRaceScoreboard();
      this.showCurrentRaceToken();

      // Countdown loop
      if (this.raceTimerInterval) clearInterval(this.raceTimerInterval);
      this.raceTimerInterval = setInterval(() => {
        this.raceTimeLeft--;
        this.updateRaceTimerUI();

        if (this.raceTimeLeft <= 0 || this.currentRaceIndex >= this.raceTokens.length) {
          this.endReactionRace();
        }
      }, 1000);
    }

    showCurrentRaceToken() {
      if (this.currentRaceIndex >= this.raceTokens.length) {
        this.endReactionRace();
        return;
      }

      const token = this.raceTokens[this.currentRaceIndex];
      this.raceTokenWord.textContent = token.text;
      this.raceTokenPrompt.textContent = "Does the traveler ZIP UP or UNZIP?";
      this.audio.speak(token.text);
    }

    handleRaceChoice(choice) {
      if (!this.raceActive) return;

      const currentToken = this.raceTokens[this.currentRaceIndex];
      if (choice === currentToken.type) {
        // Correct
        this.raceScore++;
        this.raceStreak++;
        if (choice === 'zip') {
          this.audio.playZipSound('up');
        } else {
          this.audio.playZipSound('down');
        }
        this.raceTokenWord.style.color = '#10b981';
      } else {
        // Soft fail
        this.raceStreak = 0;
        this.audio.playSoftFail();
        this.raceTokenWord.style.color = '#f43f5e';
      }

      setTimeout(() => {
        this.raceTokenWord.style.color = '#ffffff';
      }, 200);

      this.currentRaceIndex++;
      this.updateRaceScoreboard();
      this.showCurrentRaceToken();
    }

    updateRaceScoreboard() {
      this.raceScoreText.textContent = this.raceScore;
      this.raceStreakText.textContent = `${this.raceStreak}x`;
    }

    updateRaceTimerUI() {
      this.raceTimerText.textContent = `${this.raceTimeLeft}s`;
      const pct = (this.raceTimeLeft / this.data.reactionRace.durationSeconds) * 100;
      this.raceTimerBar.style.width = `${pct}%`;
    }

    endReactionRace() {
      clearInterval(this.raceTimerInterval);
      this.raceActive = false;
      this.btnBinZip.disabled = true;
      this.btnBinUnzip.disabled = true;

      this.audio.playVictoryFanfare();
      this.raceTokenWord.textContent = `Race Complete! Sorted: ${this.raceScore}`;
      this.raceTokenPrompt.textContent = "Outstanding quick reaction skills!";
      this.btnProceedStage4.style.display = 'inline-flex';
    }

    // =========================================================================
    // STAGE 4: Fable Teleprompter Studio (Oral Graduation)
    // =========================================================================
    setupTeleprompter() {
      this.tpIndex = 0;
      this.renderTeleprompterLine();
    }

    renderTeleprompterLine() {
      const lineObj = this.data.teleprompter.lines[this.tpIndex];
      if (!lineObj) return;

      // Wrap each word in span for karaoke highlight
      const words = lineObj.text.split(' ');
      this.tpLineText.innerHTML = words.map(w => `<span class="karaoke-word">${w}</span>`).join(' ');

      this.btnTpPrev.disabled = this.tpIndex === 0;
      this.btnTpNext.disabled = this.tpIndex === this.data.teleprompter.lines.length - 1;
    }

    playKaraokeNarration() {
      if (this.tpSpeaking) return;
      this.tpSpeaking = true;
      this.btnTpSpeak.disabled = true;

      const lineObj = this.data.teleprompter.lines[this.tpIndex];
      const spans = this.tpLineText.querySelectorAll('.karaoke-word');
      spans.forEach(s => s.classList.remove('highlight'));

      let wordIdx = 0;
      const totalWords = spans.length;
      const estimatedMsPerWord = 340; // calibrated to 0.88 speech rate

      if (this.tpInterval) clearInterval(this.tpInterval);
      this.tpInterval = setInterval(() => {
        if (wordIdx < totalWords) {
          spans.forEach((s, idx) => s.classList.toggle('highlight', idx === wordIdx));
          wordIdx++;
        } else {
          clearInterval(this.tpInterval);
          spans.forEach(s => s.classList.remove('highlight'));
          this.tpSpeaking = false;
          this.btnTpSpeak.disabled = false;
        }
      }, estimatedMsPerWord);

      this.audio.speak(lineObj.text, () => {
        clearInterval(this.tpInterval);
        spans.forEach(s => s.classList.remove('highlight'));
        this.tpSpeaking = false;
        this.btnTpSpeak.disabled = false;
      });
    }

    finalizeLesson() {
      this.awardXP(this.data.teleprompter.xpReward, 'stage4');
      this.audio.playVictoryFanfare();
      this.startConfetti();
      this.victoryModal.classList.add('active');

      // Dispatch platform state to Adventure Academy / schoolStore
      if (root.AdventureAcademy && typeof root.AdventureAcademy.awardXP === 'function') {
        root.AdventureAcademy.awardXP(150);
      } else if (root.schoolStore && typeof root.schoolStore.addXP === 'function') {
        root.schoolStore.addXP(150);
      }
    }

    awardXP(points, stageId) {
      if (this.awardedStages.has(stageId)) return;
      this.awardedStages.add(stageId);

      this.xp = Math.min(150, this.xp + points);
      this.xpDisplay.textContent = this.xp;
    }

    // =========================================================================
    // Confetti Engine
    // =========================================================================
    initConfetti() {
      if (!this.confettiCanvas) return;
      this.ctx = this.confettiCanvas.getContext('2d');
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
      if (!this.confettiCanvas) return;
      this.confettiCanvas.width = window.innerWidth;
      this.confettiCanvas.height = window.innerHeight;
    }

    startConfetti() {
      if (!this.ctx) return;
      this.confettiParticles = [];
      const colors = ['#38bdf8', '#fbbf24', '#10b981', '#f43f5e', '#a855f7'];

      for (let i = 0; i < 120; i++) {
        this.confettiParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight - window.innerHeight,
          w: Math.random() * 9 + 5,
          h: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: Math.random() * 4 - 2,
          vy: Math.random() * 4 + 3,
          rot: Math.random() * 360,
          rotSpeed: Math.random() * 6 - 3
        });
      }

      const animate = () => {
        this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
        this.confettiParticles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.rotSpeed;

          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rot * Math.PI) / 180);
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          this.ctx.restore();
        });

        this.confettiParticles = this.confettiParticles.filter(p => p.y < window.innerHeight + 20);

        if (this.confettiParticles.length > 0) {
          this.confettiAnimId = requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }

  // Auto-boot on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    root.WindAndSunApp = new WindAndSunApp();
  });

})(typeof window !== 'undefined' ? window : global);
