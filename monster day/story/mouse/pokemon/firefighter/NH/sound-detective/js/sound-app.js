/**
 * SOUND DETECTIVE: ARCADE CONTROLLER & REACTIVE ENGINE
 * Implements 4 Interactive Stages, Canvas Oscilloscope Visualizer,
 * Soundboard DJ & Karaoke Teleprompter Speech Tracking.
 */
(function(root) {
  'use strict';

  class SoundDetectiveApp {
    constructor() {
      this.data = window.SOUND_DATA;
      this.audio = window.SoundAudio;
      this.xp = 0;
      this.currentStage = 1;

      // Stage 1 State
      this.s1RoundsTotal = 5;
      this.s1CurrentRound = 0;
      this.s1TargetItem = null;
      this.s1Answered = false;

      // Stage 2 State
      this.s2RoundsTotal = 5;
      this.s2CurrentRound = 0;
      this.s2TargetItem = null;
      this.s2TimerInterval = null;
      this.s2TimeRemaining = 6.0;
      this.s2Answered = false;

      // Stage 3 State
      this.s3Locks = [];
      this.s3CurrentLockIdx = 0;
      this.s3TargetItem = null;
      this.s3Answered = false;

      // Stage 4 State
      this.s4FeaturedItem = null;
      this.s4SoundboardChannels = [];
      this.s4IsBroadcasting = false;

      // Oscilloscope state
      this.osciCanvas = null;
      this.osciCtx = null;
      this.osciIntensity = 0.2;
      this.osciDecay = 0.95;
      this.osciFreq = 2.0;
      this.osciPhase = 0;

      this.init();
    }

    init() {
      document.addEventListener('DOMContentLoaded', () => {
        this.cacheDom();
        this.initOscilloscope();
        this.bindEvents();
        this.setupStage1();
        this.setupStage2();
        this.setupStage3();
        this.setupStage4();
        this.updateHUD();
      });
    }

    cacheDom() {
      // Oscilloscope
      this.osciCanvas = document.getElementById('osci-canvas');
      if (this.osciCanvas) {
        this.osciCtx = this.osciCanvas.getContext('2d');
      }

      // HUD
      this.hudXp = document.getElementById('hud-xp-val');

      // Stage 1
      this.chamberCardsGrid = document.getElementById('chamber-cards-grid');
      this.btnPlayChamberSound = document.getElementById('btn-play-chamber-sound');
      this.chamberStatusIndicator = document.getElementById('chamber-status-indicator');
      this.chamberFeedbackText = document.getElementById('chamber-feedback-text');
      this.btnChamberNext = document.getElementById('btn-chamber-next');

      // Stage 2
      this.speedTimerFill = document.getElementById('speed-timer-fill');
      this.slapObjIcon = document.getElementById('slap-obj-icon');
      this.slapObjName = document.getElementById('slap-obj-name');
      this.slapPromptStrip = document.getElementById('slap-prompt-strip');
      this.slapVerbsGrid = document.getElementById('slap-verbs-grid');
      this.slapObjectStage = document.getElementById('slap-object-stage');
      this.slapSentenceSubject = document.getElementById('slap-sentence-subject');
      this.slapSentenceVerb = document.getElementById('slap-sentence-verb');

      // Stage 3
      this.vaultChassis = document.getElementById('vault-chassis');
      this.safePlaySound = document.getElementById('safe-play-sound');
      this.safeClueText = document.getElementById('safe-clue-text');
      this.btnGrammarSingular = document.getElementById('btn-grammar-singular');
      this.btnGrammarPlural = document.getElementById('btn-grammar-plural');
      this.modalSafeVictory = document.getElementById('modal-safe-victory');

      // Stage 4
      this.soundboardChannels = document.getElementById('soundboard-channels');
      this.foleySelectorPills = document.getElementById('foley-selector-pills');
      this.prompterScript = document.getElementById('prompter-script');
      this.btnBroadcastReport = document.getElementById('btn-broadcast-report');
      this.modalBroadcastVictory = document.getElementById('modal-broadcast-victory');
    }

    bindEvents() {
      // Audio Visualizer hook
      this.audio.setVisualizer((intensity, duration) => {
        this.triggerOscilloscopeWave(intensity);
      });

      // Stage 1
      if (this.btnPlayChamberSound) {
        this.btnPlayChamberSound.addEventListener('click', () => this.playCurrentChamberSound());
      }
      if (this.btnChamberNext) {
        this.btnChamberNext.addEventListener('click', () => this.nextChamberRound());
      }

      // Stage 3
      if (this.safePlaySound) {
        this.safePlaySound.addEventListener('click', () => this.playCurrentVaultSound());
      }
      if (this.btnGrammarSingular) {
        this.btnGrammarSingular.addEventListener('click', () => this.handleSafeGrammarChoice('singular'));
      }
      if (this.btnGrammarPlural) {
        this.btnGrammarPlural.addEventListener('click', () => this.handleSafeGrammarChoice('plural'));
      }

      // Stage 4
      if (this.btnBroadcastReport) {
        this.btnBroadcastReport.addEventListener('click', () => this.broadcastTeleprompter());
      }
    }

    addXP(amount) {
      this.xp += amount;
      this.updateHUD();
    }

    updateHUD() {
      if (this.hudXp) {
        this.hudXp.textContent = this.xp;
      }
    }

    goToStage(stageNum) {
      this.currentStage = stageNum;

      // Update Nav Buttons
      for (let i = 1; i <= 4; i++) {
        const btn = document.getElementById(`step-btn-${i}`);
        const panel = document.getElementById(`stage-panel-${i}`);
        if (btn) btn.classList.toggle('active', i === stageNum);
        if (panel) panel.classList.toggle('active', i === stageNum);
      }

      // Pause / resume stage specific loops
      if (stageNum === 2) {
        this.startStage2Round();
      } else {
        clearInterval(this.s2TimerInterval);
      }

      if (stageNum === 3) {
        this.loadVaultLock(this.s3CurrentLockIdx);
      }

      if (stageNum === 4) {
        this.updateTeleprompterScript();
      }
    }

    // ================================================================
    // CENTER STAGE OSCILLOSCOPE CANVAS ANIMATION
    // ================================================================

    initOscilloscope() {
      if (!this.osciCanvas || !this.osciCtx) return;

      const render = () => {
        this.drawOscilloscope();
        requestAnimationFrame(render);
      };
      requestAnimationFrame(render);
    }

    triggerOscilloscopeWave(intensity = 1.0) {
      this.osciIntensity = Math.min(2.5, this.osciIntensity + intensity * 1.5);
      const freqLabel = document.getElementById('osci-frequency-label');
      if (freqLabel) {
        const rndFreq = Math.floor(600 + Math.random() * 1200);
        freqLabel.textContent = `FREQ: ${rndFreq} Hz • BURST`;
      }
    }

    drawOscilloscope() {
      const cvs = this.osciCanvas;
      const ctx = this.osciCtx;
      const width = cvs.width;
      const height = cvs.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Decay intensity back towards baseline 0.15
      this.osciIntensity = Math.max(0.15, this.osciIntensity * this.osciDecay);
      this.osciPhase += 0.08 + (this.osciIntensity * 0.05);

      // Neon Waveform Line
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.osciIntensity > 0.6 ? '#38bdf8' : '#0284c7';
      ctx.shadowBlur = this.osciIntensity > 0.6 ? 16 : 6;
      ctx.shadowColor = '#38bdf8';

      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const normX = x / width;
        const envelope = Math.sin(normX * Math.PI); // Windowing at sides
        const wave1 = Math.sin(normX * 18 + this.osciPhase) * 18 * this.osciIntensity;
        const wave2 = Math.cos(normX * 36 - this.osciPhase * 1.5) * 10 * this.osciIntensity;
        const y = centerY + (wave1 + wave2) * envelope;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary ghost wave
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#a855f7';
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const normX = x / width;
        const envelope = Math.sin(normX * Math.PI);
        const wave = Math.sin(normX * 24 - this.osciPhase * 0.8) * 12 * this.osciIntensity;
        const y = centerY + wave * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // ================================================================
    // STAGE 1: THE BLIND SOUND CHAMBER
    // ================================================================

    setupStage1() {
      this.s1CurrentRound = 0;
      this.loadStage1Round();
    }

    loadStage1Round() {
      this.s1Answered = false;
      if (this.btnChamberNext) this.btnChamberNext.style.display = 'none';
      if (this.chamberFeedbackText) {
        this.chamberFeedbackText.innerHTML = `🎧 <strong>Round ${this.s1CurrentRound + 1} of ${this.s1RoundsTotal}:</strong> Listen to the acoustic clue above, then choose a card!`;
      }

      // Pick target object
      const allItems = [...this.data.items];
      this.s1TargetItem = allItems[Math.floor(Math.random() * allItems.length)];

      // Pick 2 distinct distractors
      const distractors = allItems
        .filter(i => i.id !== this.s1TargetItem.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      const trio = [this.s1TargetItem, ...distractors].sort(() => 0.5 - Math.random());

      // Render 3 Cards
      if (!this.chamberCardsGrid) return;
      this.chamberCardsGrid.innerHTML = '';

      trio.forEach((item, idx) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'flip-card-wrapper';
        wrapper.dataset.itemId = item.id;

        wrapper.innerHTML = `
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <span class="mystery-number">CARD 0${idx + 1}</span>
              <div class="mystery-icon-box">❓</div>
              <div class="mystery-label">Mystery Object</div>
            </div>
            <div class="flip-card-back">
              <div class="card-back-icon">${item.icon}</div>
              <div class="card-back-title">${item.name}</div>
              <div class="card-back-action">It ${item.soundVerb3rd}!</div>
            </div>
          </div>
        `;

        wrapper.addEventListener('click', () => this.handleChamberCardClick(wrapper, item));
        this.chamberCardsGrid.appendChild(wrapper);
      });

      if (this.chamberStatusIndicator) {
        this.chamberStatusIndicator.innerHTML = `👂 Round ${this.s1CurrentRound + 1}: Click <strong>PLAY MYSTERY SOUND</strong> to begin!`;
      }
    }

    playCurrentChamberSound() {
      if (!this.s1TargetItem) return;
      const method = this.s1TargetItem.audioMethod;
      if (typeof this.audio[method] === 'function') {
        this.audio[method]();
      }
      if (this.chamberStatusIndicator) {
        this.chamberStatusIndicator.innerHTML = `🔊 Playing acoustic soundwave: <em>"${this.s1TargetItem.soundLabel}"</em> — Which object is it?`;
      }
    }

    handleChamberCardClick(cardEl, item) {
      if (this.s1Answered) return;

      // Flip card
      cardEl.classList.add('flipped');

      if (item.id === this.s1TargetItem.id) {
        // Correct!
        this.s1Answered = true;
        this.audio.playXP();
        this.addXP(10);

        // Add stamp
        const back = cardEl.querySelector('.flip-card-back');
        if (back && !back.querySelector('.stamp-match')) {
          const stamp = document.createElement('div');
          stamp.className = 'stamp-match';
          stamp.textContent = 'MATCH!';
          back.appendChild(stamp);
        }

        // Feedback Sentence & TTS
        const sentence = item.grammarType === 'plural'
          ? `Listen! They're ${item.name}. They ${item.soundVerb}!`
          : `Listen! It's a ${item.name}. It ${item.soundVerb3rd}!`;

        if (this.chamberFeedbackText) {
          this.chamberFeedbackText.innerHTML = `✅ <span class="highlight">${sentence}</span>`;
        }
        this.audio.speak(sentence);

        if (this.btnChamberNext) {
          this.btnChamberNext.style.display = 'inline-flex';
        }
      } else {
        // Soft fail
        this.audio.playSoftFail();
        cardEl.classList.add('card-wrong');
        if (this.chamberFeedbackText) {
          this.chamberFeedbackText.innerHTML = `❌ That's a <strong>${item.name}</strong>. Listen again! What's that sound?`;
        }
        this.audio.speak("Not that one. Listen again! What's that sound?");
        setTimeout(() => {
          cardEl.classList.remove('flipped');
          cardEl.classList.remove('card-wrong');
        }, 1200);
      }
    }

    nextChamberRound() {
      this.s1CurrentRound++;
      if (this.s1CurrentRound < this.s1RoundsTotal) {
        this.loadStage1Round();
        this.playCurrentChamberSound();
      } else {
        // Stage 1 Complete
        const step1Btn = document.getElementById('step-btn-1');
        if (step1Btn) step1Btn.classList.add('completed');
        this.audio.playFanfare();
        if (this.chamberFeedbackText) {
          this.chamberFeedbackText.innerHTML = `🎉 <strong>Chamber Cleared!</strong> 5/5 Matches Found! Moving to Stage 2: Speed Slap!`;
        }
        setTimeout(() => this.goToStage(2), 1600);
      }
    }

    // ================================================================
    // STAGE 2: SOUND-VERB SPEED SLAP
    // ================================================================

    setupStage2() {
      this.s2CurrentRound = 0;
    }

    startStage2Round() {
      this.s2Answered = false;
      clearInterval(this.s2TimerInterval);

      const allItems = [...this.data.items];
      this.s2TargetItem = allItems[Math.floor(Math.random() * allItems.length)];

      // Populate Object Center Card
      if (this.slapObjIcon) this.slapObjIcon.textContent = this.s2TargetItem.icon;
      if (this.slapObjName) this.slapObjName.textContent = this.s2TargetItem.name;
      if (this.slapSentenceSubject) this.slapSentenceSubject.textContent = this.s2TargetItem.name;
      if (this.slapSentenceVerb) this.slapSentenceVerb.textContent = '__________';

      // Play object sound
      const method = this.s2TargetItem.audioMethod;
      if (typeof this.audio[method] === 'function') {
        this.audio[method]();
      }

      // 4 Verb Options: 1 correct + 3 random from 8 verbs
      const correctVerb = this.s2TargetItem.soundVerb;
      const otherVerbs = this.data.verbs
        .filter(v => v.verb !== correctVerb)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(v => v.verb);

      const options = [correctVerb, ...otherVerbs].sort(() => 0.5 - Math.random());

      // Render 4 3D buttons
      if (!this.slapVerbsGrid) return;
      this.slapVerbsGrid.innerHTML = '';

      const btnStyles = ['btn-cyan', 'btn-amber', 'btn-purple', 'btn-emerald'];

      options.forEach((verb, idx) => {
        const btn = document.createElement('button');
        btn.className = `btn-3d ${btnStyles[idx % btnStyles.length]} btn-verb`;
        btn.textContent = verb.toUpperCase();
        btn.addEventListener('click', () => this.handleVerbSlap(btn, verb));
        this.slapVerbsGrid.appendChild(btn);
      });

      // 6-Second Timer Countdown
      this.s2TimeRemaining = 6.0;
      this.updateTimerBar();

      this.s2TimerInterval = setInterval(() => {
        this.s2TimeRemaining -= 0.05;
        this.updateTimerBar();

        if (this.s2TimeRemaining <= 0) {
          clearInterval(this.s2TimerInterval);
          this.handleVerbSlapTimeout();
        }
      }, 50);
    }

    updateTimerBar() {
      if (!this.speedTimerFill) return;
      const pct = Math.max(0, (this.s2TimeRemaining / 6.0) * 100);
      this.speedTimerFill.style.width = `${pct}%`;
    }

    handleVerbSlap(btnEl, chosenVerb) {
      if (this.s2Answered) return;
      this.s2Answered = true;
      clearInterval(this.s2TimerInterval);

      const isCorrect = chosenVerb === this.s2TargetItem.soundVerb;

      if (isCorrect) {
        this.audio.playXP();
        this.addXP(10);
        if (this.slapObjectStage) this.slapObjectStage.classList.add('pulse-active');

        // Auto-complete sentence strip
        const verb3rd = this.s2TargetItem.soundVerb3rd;
        if (this.slapSentenceVerb) this.slapSentenceVerb.textContent = verb3rd;

        const sentence = `The ${this.s2TargetItem.name} ${verb3rd}!`;
        this.audio.speak(sentence);

        setTimeout(() => {
          if (this.slapObjectStage) this.slapObjectStage.classList.remove('pulse-active');
          this.advanceStage2();
        }, 1500);
      } else {
        this.audio.playSoftFail();
        btnEl.style.opacity = '0.4';
        if (this.slapSentenceVerb) this.slapSentenceVerb.textContent = this.s2TargetItem.soundVerb3rd;
        this.audio.speak(`No, the ${this.s2TargetItem.name} ${this.s2TargetItem.soundVerb3rd}!`);
        setTimeout(() => this.advanceStage2(), 1600);
      }
    }

    handleVerbSlapTimeout() {
      if (this.s2Answered) return;
      this.s2Answered = true;
      this.audio.playSoftFail();
      if (this.slapSentenceVerb) this.slapSentenceVerb.textContent = this.s2TargetItem.soundVerb3rd;
      this.audio.speak(`Time's up! The ${this.s2TargetItem.name} ${this.s2TargetItem.soundVerb3rd}!`);
      setTimeout(() => this.advanceStage2(), 1600);
    }

    advanceStage2() {
      this.s2CurrentRound++;
      if (this.s2CurrentRound < this.s2RoundsTotal) {
        this.startStage2Round();
      } else {
        // Stage 2 Complete
        const step2Btn = document.getElementById('step-btn-2');
        if (step2Btn) step2Btn.classList.add('completed');
        this.audio.playFanfare();
        setTimeout(() => this.goToStage(3), 1200);
      }
    }

    // ================================================================
    // STAGE 3: THE SONIC SAFE CRACKER
    // ================================================================

    setupStage3() {
      // Pick 3 items for locks: 1 plural guaranteed, 2 singulars
      const plurals = this.data.items.filter(i => i.grammarType === 'plural');
      const singulars = this.data.items.filter(i => i.grammarType === 'singular');

      const pluralItem = plurals[Math.floor(Math.random() * plurals.length)];
      const randomSingulars = singulars.sort(() => 0.5 - Math.random()).slice(0, 2);

      this.s3Locks = [randomSingulars[0], pluralItem, randomSingulars[1]].sort(() => 0.5 - Math.random());
      this.s3CurrentLockIdx = 0;
    }

    loadVaultLock(index) {
      if (index >= this.s3Locks.length) {
        this.unlockVaultFull();
        return;
      }

      this.s3CurrentLockIdx = index;
      this.s3TargetItem = this.s3Locks[index];
      this.s3Answered = false;

      // Update LEDs
      for (let i = 1; i <= 3; i++) {
        const led = document.getElementById(`tumbler-${i}`);
        if (led) {
          led.classList.toggle('cracked', i - 1 < index);
          led.classList.toggle('active', i - 1 === index);
        }
      }

      // Update Clue Box
      if (this.safeClueText) {
        this.safeClueText.innerHTML = `
          <span>Lock 0${index + 1} Armed: Analyzing acoustic mystery signature...</span>
          <small>Click 🔊 to hear Lock ${index + 1}'s sound!</small>
        `;
      }

      this.playCurrentVaultSound();
    }

    playCurrentVaultSound() {
      if (!this.s3TargetItem) return;
      const method = this.s3TargetItem.audioMethod;
      if (typeof this.audio[method] === 'function') {
        this.audio[method]();
      }
    }

    handleSafeGrammarChoice(choice) {
      if (this.s3Answered || !this.s3TargetItem) return;
      this.s3Answered = true;

      const isCorrect = choice === this.s3TargetItem.grammarType;

      if (isCorrect) {
        this.audio.playXP();
        this.addXP(15);

        const phrase = choice === 'plural'
          ? `They're ${this.s3TargetItem.name}!`
          : `It's a ${this.s3TargetItem.name}!`;

        if (this.safeClueText) {
          this.safeClueText.innerHTML = `
            <span style="color:var(--emerald);">🔓 Tumbler 0${this.s3CurrentLockIdx + 1} CRACKED: ${phrase}</span>
            <small>Acoustic match confirmed!</small>
          `;
        }
        this.audio.speak(`Correct! ${phrase}`);

        setTimeout(() => {
          this.loadVaultLock(this.s3CurrentLockIdx + 1);
        }, 1600);
      } else {
        this.audio.playSoftFail();
        const correctPhrase = this.s3TargetItem.grammarType === 'plural'
          ? `They're ${this.s3TargetItem.name}! (Plural)`
          : `It's a ${this.s3TargetItem.name}! (Singular)`;

        if (this.safeClueText) {
          this.safeClueText.innerHTML = `
            <span style="color:var(--ruby);">❌ Tumbler jammed! It was: ${correctPhrase}</span>
            <small>Listen again and try the next lock!</small>
          `;
        }
        this.audio.speak(`Incorrect lock combination. It was: ${correctPhrase}`);

        setTimeout(() => {
          this.loadVaultLock(this.s3CurrentLockIdx + 1);
        }, 2000);
      }
    }

    unlockVaultFull() {
      // Rotate vault graphic
      if (this.vaultChassis) this.vaultChassis.classList.add('unlocked');
      const step3Btn = document.getElementById('step-btn-3');
      if (step3Btn) step3Btn.classList.add('completed');

      this.audio.playFanfare();
      this.addXP(50);

      setTimeout(() => {
        if (this.modalSafeVictory) this.modalSafeVictory.style.display = 'flex';
      }, 800);
    }

    onSafeVictoryContinue() {
      if (this.modalSafeVictory) this.modalSafeVictory.style.display = 'none';
      this.goToStage(4);
    }

    // ================================================================
    // STAGE 4: FOLEY DJ STUDIO & TELEPROMPTER
    // ================================================================

    setupStage4() {
      // Setup 4 Initial Channels on Soundboard
      this.s4SoundboardChannels = [
        this.data.items.find(i => i.id === 'clock'),
        this.data.items.find(i => i.id === 'kettle'),
        this.data.items.find(i => i.id === 'door'),
        this.data.items.find(i => i.id === 'cards')
      ];

      this.s4FeaturedItem = this.s4SoundboardChannels[0];
      this.renderSoundboard();
      this.renderSelectorPills();
      this.updateTeleprompterScript();
    }

    renderSoundboard() {
      if (!this.soundboardChannels) return;
      this.soundboardChannels.innerHTML = '';

      this.s4SoundboardChannels.forEach((item, idx) => {
        const pad = document.createElement('div');
        pad.className = 'sound-pad';
        pad.innerHTML = `
          <div class="pad-icon">${item.icon}</div>
          <div class="pad-name">${item.name}</div>
          <div class="pad-verb">CH 0${idx + 1} • ${item.soundVerb}</div>
        `;

        pad.addEventListener('click', () => {
          pad.classList.add('firing');
          const method = item.audioMethod;
          if (typeof this.audio[method] === 'function') {
            this.audio[method]();
          }
          setTimeout(() => pad.classList.remove('firing'), 300);
        });

        this.soundboardChannels.appendChild(pad);
      });
    }

    renderSelectorPills() {
      if (!this.foleySelectorPills) return;
      this.foleySelectorPills.innerHTML = '';

      this.data.items.forEach(item => {
        const pill = document.createElement('div');
        pill.className = `selector-pill ${item.id === this.s4FeaturedItem.id ? 'active' : ''}`;
        pill.innerHTML = `${item.icon} ${item.name}`;

        pill.addEventListener('click', () => {
          this.s4FeaturedItem = item;
          // Update Soundboard Channel 1 to this item
          this.s4SoundboardChannels[0] = item;
          this.renderSoundboard();
          this.renderSelectorPills();
          this.updateTeleprompterScript();

          // Play sound
          const method = item.audioMethod;
          if (typeof this.audio[method] === 'function') {
            this.audio[method]();
          }
        });

        this.foleySelectorPills.appendChild(pill);
      });
    }

    updateTeleprompterScript() {
      if (!this.prompterScript || !this.s4FeaturedItem) return;
      const item = this.s4FeaturedItem;

      const line1 = "Listen to our sound effects!";
      const line2 = `When the ${item.name} moves, it goes ${item.soundVerb}!`;
      const line3 = item.grammarType === 'plural'
        ? `Answer: They're ${item.name}. They ${item.soundVerb}!`
        : `Answer: It's a ${item.name}. It ${item.soundVerb3rd}!`;

      this.prompterScript.innerHTML = `
        <div class="script-line" id="script-line-1">${this.wrapWords(line1)}</div>
        <div class="script-line" id="script-line-2">${this.wrapWords(line2)}</div>
        <div class="script-line" id="script-line-3">${this.wrapWords(line3)}</div>
      `;
    }

    wrapWords(text) {
      return text.split(' ').map(w => `<span class="word">${w}</span>`).join(' ');
    }

    broadcastTeleprompter() {
      if (this.s4IsBroadcasting) return;
      this.s4IsBroadcasting = true;
      if (this.btnBroadcastReport) this.btnBroadcastReport.disabled = true;

      const lines = [
        document.getElementById('script-line-1'),
        document.getElementById('script-line-2'),
        document.getElementById('script-line-3')
      ];

      let lineIdx = 0;

      const speakNextLine = () => {
        if (lineIdx >= lines.length) {
          // Completed broadcast!
          this.s4IsBroadcasting = false;
          if (this.btnBroadcastReport) this.btnBroadcastReport.disabled = false;
          lines.forEach(l => l.classList.remove('active'));

          const step4Btn = document.getElementById('step-btn-4');
          if (step4Btn) step4Btn.classList.add('completed');

          this.audio.playFanfare();
          this.addXP(100);

          setTimeout(() => {
            if (this.modalBroadcastVictory) this.modalBroadcastVictory.style.display = 'flex';
          }, 800);
          return;
        }

        lines.forEach((l, i) => l.classList.toggle('active', i === lineIdx));
        const currentLineEl = lines[lineIdx];
        const lineText = currentLineEl.textContent.trim();

        // Animate words during speech
        const words = currentLineEl.querySelectorAll('.word');
        let wordIdx = 0;
        const wordInterval = setInterval(() => {
          words.forEach((w, wi) => w.classList.toggle('karaoke-glow', wi === wordIdx));
          wordIdx++;
          if (wordIdx >= words.length) clearInterval(wordInterval);
        }, 300);

        this.audio.speak(lineText, () => {
          clearInterval(wordInterval);
          words.forEach(w => w.classList.remove('karaoke-glow'));
          lineIdx++;
          setTimeout(speakNextLine, 400);
        });
      };

      speakNextLine();
    }

    restartGame() {
      if (this.modalBroadcastVictory) this.modalBroadcastVictory.style.display = 'none';
      this.setupStage1();
      this.setupStage2();
      this.setupStage3();
      this.setupStage4();
      this.goToStage(1);
    }
  }

  root.SoundApp = new SoundDetectiveApp();
})(typeof window !== 'undefined' ? window : this);
