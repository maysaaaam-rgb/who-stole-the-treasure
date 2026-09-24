/**
 * SOUND DETECTIVE: HARMONIC WEB AUDIO SFX & SPEECH SYNTHESIS ENGINE
 * Zero-dependency procedural synthesis using HTML5 AudioContext & SpeechSynthesis.
 */
(function(root) {
  'use strict';

  class SoundAudioEngine {
    constructor() {
      this.ctx = null;
      this.isInitialized = false;
      this.visualizerCallback = null;
      this._bindAutoplayGuard();
    }

    _bindAutoplayGuard() {
      const unlock = () => {
        this.init();
        document.removeEventListener('click', unlock);
        document.removeEventListener('keydown', unlock);
        document.removeEventListener('touchstart', unlock);
      };
      document.addEventListener('click', unlock, { once: true });
      document.addEventListener('keydown', unlock, { once: true });
      document.addEventListener('touchstart', unlock, { once: true });
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isInitialized = true;
    }

    setVisualizer(cb) {
      this.visualizerCallback = cb;
    }

    _pulseVisualizer(duration = 0.5, intensity = 1.0) {
      if (typeof this.visualizerCallback === 'function') {
        this.visualizerCallback(intensity, duration);
      }
    }

    _now() {
      this.init();
      return this.ctx ? this.ctx.currentTime : 0;
    }

    // Helper: Buffer Noise Generator (Pink / Bandpass Filtered)
    _createNoiseBuffer(seconds = 0.5) {
      if (!this.ctx) return null;
      const bufferSize = this.ctx.sampleRate * seconds;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
      return buffer;
    }

    // ==========================================
    // 12 TARGET HOUSEHOLD SOUND SYNTHESIZERS
    // ==========================================

    // 1. Clock Tick: Sharp 900 Hz -> 400 Hz sine click
    playClockTick() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(0.8, 1.2);
      const now = this._now();
      [0, 0.28, 0.56, 0.84].forEach((tOff, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startFreq = idx % 2 === 0 ? 950 : 820;
        osc.frequency.setValueAtTime(startFreq, now + tOff);
        osc.frequency.exponentialRampToValueAtTime(380, now + tOff + 0.045);

        gain.gain.setValueAtTime(0.28, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.055);
      });
    }

    // 2. Bell Ring: Resonant dual chime (783.99 Hz + 659.25 Hz)
    playBellRing() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(1.4, 1.5);
      const now = this._now();

      // Ding (783.99 Hz G5)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.75);

      // Dong (659.25 Hz E5)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.3);
      gain2.gain.setValueAtTime(0.4, now + 0.3);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.3);
      osc2.stop(now + 1.35);
    }

    // 3. Water Tap: Rapid 3-droplet pitch drop (750 Hz -> 250 Hz)
    playWaterTap() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(0.9, 1.1);
      const now = this._now();
      [0, 0.22, 0.45].forEach((tOff, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startF = 750 + idx * 80;
        osc.frequency.setValueAtTime(startF, now + tOff);
        osc.frequency.exponentialRampToValueAtTime(250, now + tOff + 0.08);

        gain.gain.setValueAtTime(0.3, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.085);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.09);
      });
    }

    // 4. Light Switch: High-frequency square wave snap (1600 Hz -> 300 Hz)
    playSwitchClick() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(0.3, 1.3);
      const now = this._now();
      [0, 0.05].forEach((tOff, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(i === 0 ? 1600 : 800, now + tOff);
        osc.frequency.exponentialRampToValueAtTime(300, now + tOff + 0.025);

        gain.gain.setValueAtTime(0.22, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.028);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.03);
      });
    }

    // 5. Kettle Boil: Soft pink noise sweeping into an 1850 Hz whistle
    playKettleBoil() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(1.4, 1.6);
      const now = this._now();

      // Steam hiss (pink noise with lowpass filter sweep)
      const noiseBuff = this._createNoiseBuffer(1.0);
      if (noiseBuff) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = noiseBuff;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.linearRampToValueAtTime(2200, now + 0.8);
        filter.Q.value = 3.0;

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.05, now);
        noiseGain.gain.linearRampToValueAtTime(0.2, now + 0.4);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

        noiseSource.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noiseSource.start(now);
        noiseSource.stop(now + 1.0);
      }

      // Steam whistle rising into 1850 Hz
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, now + 0.2);
      osc.frequency.linearRampToValueAtTime(1850, now + 0.85);

      gain.gain.setValueAtTime(0.01, now + 0.2);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + 0.2);
      osc.stop(now + 1.3);
    }

    // 6. Door Knock: Heavy double wood thud (130 Hz triangle)
    playDoorKnock() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(0.7, 1.4);
      const now = this._now();
      [0, 0.16, 0.34].forEach(tOff => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(130, now + tOff);
        osc.frequency.exponentialRampToValueAtTime(45, now + tOff + 0.08);

        gain.gain.setValueAtTime(0.4, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.085);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.09);
      });
    }

    // 7. Computer Keyboard: Quick mechanical keyboard transients (1200 Hz)
    playComputerType() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(0.6, 1.1);
      const now = this._now();
      [0, 0.07, 0.15, 0.23, 0.32, 0.40].forEach((tOff, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const freq = 1200 + (Math.sin(i * 3.7) * 280);
        osc.frequency.setValueAtTime(freq, now + tOff);
        osc.frequency.exponentialRampToValueAtTime(400, now + tOff + 0.03);

        gain.gain.setValueAtTime(0.24, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.04);
      });
    }

    // 8. Card Shuffle: Fluttering bandpass pink noise burst (1800 Hz)
    playCardShuffle() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(0.9, 1.2);
      const now = this._now();
      for (let i = 0; i < 15; i++) {
        const tOff = i * 0.038;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400 + Math.random() * 800, now + tOff);
        osc.frequency.exponentialRampToValueAtTime(600, now + tOff + 0.02);

        gain.gain.setValueAtTime(0.15, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.022);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.025);
      }
    }

    // 9. Dice Roll: Triple tumbling percussion thuds (240 Hz -> 90 Hz)
    playDiceRoll() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(0.8, 1.2);
      const now = this._now();
      [0, 0.09, 0.18, 0.29, 0.42, 0.58].forEach((tOff, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240 - idx * 25, now + tOff);
        osc.frequency.exponentialRampToValueAtTime(90, now + tOff + 0.045);

        gain.gain.setValueAtTime(0.3 / (1 + idx * 0.25), now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.048);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.05);
      });
    }

    // 10. Cup Clink: Crystalline ceramic ting at 2637 Hz
    playCupClink() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(0.6, 1.4);
      const now = this._now();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2637.02, now); // E7
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    }

    // 11. Spoon Ding: Dual metallic resonance (1975 Hz + 3136 Hz)
    playSpoonDing() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(0.6, 1.3);
      const now = this._now();
      [1975.53, 3135.96].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.24, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.42);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.45);
      });
    }

    // 12. Backpack Zip: Ascending sawtooth zip (450 Hz -> 1200 Hz)
    playBackpackZip() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(0.5, 1.3);
      const now = this._now();
      for (let i = 0; i < 18; i++) {
        const tOff = i * 0.024;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        const freq = 450 + (i / 18) * (1200 - 450);
        osc.frequency.setValueAtTime(freq, now + tOff);

        gain.gain.setValueAtTime(0.14, now + tOff);
        gain.gain.exponentialRampToValueAtTime(0.001, now + tOff + 0.02);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + tOff);
        osc.stop(now + tOff + 0.022);
      }
    }

    // ==========================================
    // PLATFORM CUES: XP, SOFT FAIL & FANFARE
    // ==========================================

    playXP() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(0.4, 1.5);
      const now = this._now();
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.22, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    }

    playSoftFail() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(0.3, 0.8);
      const now = this._now();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(170, now + 0.22);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    }

    playFanfare() {
      this.init(); if (!this.ctx) return;
      this._pulseVisualizer(1.5, 2.0);
      const now = this._now();
      const notes = [
        { f: 523.25, d: 0.12, t: 0.00 },
        { f: 659.25, d: 0.12, t: 0.12 },
        { f: 783.99, d: 0.12, t: 0.24 },
        { f: 1046.5, d: 0.40, t: 0.36 },
        { f: 880.00, d: 0.14, t: 0.80 },
        { f: 1046.5, d: 0.65, t: 0.96 }
      ];
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.3, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.02);
      });
    }

    // ==========================================
    // SPEECH SYNTHESIS
    // ==========================================

    speak(text, onComplete) {
      if (!('speechSynthesis' in window)) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';
      if (typeof onComplete === 'function') {
        utterance.onend = onComplete;
      }
      window.speechSynthesis.speak(utterance);
    }
  }

  root.SoundAudio = new SoundAudioEngine();
})(typeof window !== 'undefined' ? window : this);
