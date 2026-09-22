/**
 * CAT VS DOG: PREPOSITION CATAPULT — POLYPHONIC WEB AUDIO ENGINE
 * Zero External Dependencies • Pure Browser Synthesis & Procedural BGM
 * Multi-track synthesis: Walking Bass BGM, Doppler Whistle, Layered Impacts & TTS Narrator
 */
(function(root) {
  'use strict';

  class BattleAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.isBgmPlaying = false;
      this.bgmTimer = null;
      this.bgmStep = 0;
      this.masterGain = null;
      this.sfxGain = null;
      this.bgmGain = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
          
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);

          this.sfxGain = this.ctx.createGain();
          this.sfxGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
          this.sfxGain.connect(this.masterGain);

          this.bgmGain = this.ctx.createGain();
          this.bgmGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
          this.bgmGain.connect(this.masterGain);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.init();
      this.isMuted = !this.isMuted;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
      }
      if (this.isMuted && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return this.isMuted;
    }

    toggleBgm() {
      this.init();
      if (this.isBgmPlaying) {
        this.stopBgm();
        return false;
      } else {
        this.startBgm();
        return true;
      }
    }

    /* =========================================================================
       85 BPM PROCEDURAL ARCADE BASSLINE & ARPEGGIO
       ========================================================================= */
    startBgm() {
      this.init();
      if (!this.ctx || this.isBgmPlaying) return;
      this.isBgmPlaying = true;
      this.bgmStep = 0;
      this.scheduleBgmTick();
    }

    stopBgm() {
      this.isBgmPlaying = false;
      if (this.bgmTimer) {
        clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
    }

    scheduleBgmTick() {
      if (!this.isBgmPlaying || !this.ctx) return;

      // 85 BPM = 1.416 beats/sec = ~353ms per eighth-note
      const stepIntervalMs = 353;
      const now = this.ctx.currentTime;

      // 16-step funk/arcade walking bass progression in C minor / Dorian
      const bassNotes = [
        130.81, 0, 155.56, 174.61,  // C3, rest, Eb3, F3
        196.00, 174.61, 155.56, 0,   // G3, F3, Eb3, rest
        116.54, 0, 146.83, 174.61,  // Bb2, rest, D3, F3
        196.00, 233.08, 196.00, 130.81 // G3, Bb3, G3, C3
      ];

      const currentFreq = bassNotes[this.bgmStep % bassNotes.length];
      if (currentFreq > 0 && !this.isMuted) {
        this.playBassNote(currentFreq, now, 0.28);
      }

      // High-hat / vinyl click syncopation
      if (this.bgmStep % 2 === 1 && !this.isMuted) {
        this.playHiHat(now);
      }

      this.bgmStep++;
      this.bgmTimer = setTimeout(() => this.scheduleBgmTick(), stepIntervalMs);
    }

    playBassNote(freq, startTime, duration) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, startTime);
      filter.frequency.exponentialRampToValueAtTime(180, startTime + duration);

      gain.gain.setValueAtTime(0.24, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    }

    playHiHat(startTime) {
      // Subtle synthesized closed hi-hat noise
      const bufferSize = this.ctx.sampleRate * 0.035;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, startTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      noise.start(startTime);
    }

    /* =========================================================================
       DOPPLER ARTILLERY WHISTLE & CARTOON WHOOSH
       ========================================================================= */
    playWhistle(type = 'fish') {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (type === 'anvil') {
        // Heavy low whoosh
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.7);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      } else {
        // High Doppler artillery whistle
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1550, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.65);

        // Add subtle pitch vibrato via secondary oscillator
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        vibrato.frequency.setValueAtTime(14, now);
        vibratoGain.gain.setValueAtTime(45, now);
        vibrato.connect(osc.frequency);
        vibrato.start(now);
        vibrato.stop(now + 0.7);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      }

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.75);
    }

    /* =========================================================================
       PUNCHY COMIC IMPACT (WHITE NOISE TRANSIENT + RESONANT SINE BOOM)
       ========================================================================= */
    playImpact(isHeavy = false) {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Noise transient crunch (40ms)
      const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
      }
      const noiseSrc = this.ctx.createBufferSource();
      noiseSrc.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(isHeavy ? 1800 : 2600, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(isHeavy ? 0.45 : 0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);
      noiseSrc.start(now);

      // 2. Resonant sub-boom (130Hz -> 45Hz)
      const osc = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isHeavy ? 95 : 135, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.35);

      boomGain.gain.setValueAtTime(isHeavy ? 0.55 : 0.4, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(boomGain);
      boomGain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.4);
    }

    /* =========================================================================
       WOOD SPLINTER CLATTER (FENCE COLLISION)
       ========================================================================= */
    playWoodHit() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // 3 rapid micro-burst clicks (clatter)
      [0, 0.04, 0.09].forEach((offset, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(320 - idx * 60, now + offset);
        osc.frequency.exponentialRampToValueAtTime(75, now + offset + 0.08);

        gain.gain.setValueAtTime(0.22 - idx * 0.04, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
    }

    /* =========================================================================
       SPECIAL WEAPON SFX: WATER SPLASH, BOING & ANVIL CLANG
       ========================================================================= */
    playWaterSplash() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // White noise bandpass sweep for gush/splash
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.25, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.4));
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.25);
      filter.Q.value = 3.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      src.start(now);
    }

    playBoing() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.32);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.36);
    }

    /* =========================================================================
       HARMONIC CHIME & VICTORY FANFARE
       ========================================================================= */
    playChime() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.18, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.45);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.48);
      });
    }

    playFanfare() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          if (this.isMuted || !this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.28, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.58);
        }, i * 130);
      });
    }

    /* =========================================================================
       SPATIAL SPEECH SYNTHESIS ENGINE (CEFR A1 PACING)
       ========================================================================= */
    speak(text, onEnd) {
      if (this.isMuted || !('speechSynthesis' in window)) {
        if (onEnd) onEnd();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';
      if (onEnd) utterance.onend = onEnd;
      window.speechSynthesis.speak(utterance);
    }

    stopSpeech() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }

  root.BattleAudio = new BattleAudioEngine();
})(typeof window !== 'undefined' ? window : global);
