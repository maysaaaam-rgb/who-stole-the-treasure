/**
 * YOUNG INVENTOR ACADEMY — AUDIO & WEB SPEECH ENGINE
 * Grade 4 A1+ • Laboratory & Machine Sound Effects + CEFR A1+ Narration
 */

(function(root) {
  'use strict';

  class YoungInventorAudio {
    constructor() {
      this.ctx = null;
      this.sfxEnabled = true;
      this.speechEnabled = true;
      this.synth = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis : null;
      this.voices = [];
      this.humOsc = null;

      if (typeof window !== 'undefined') {
        const initCtx = () => {
          if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
          }
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        };
        window.addEventListener('click', initCtx, { once: true });
        window.addEventListener('touchstart', initCtx, { once: true });
        window.addEventListener('keydown', initCtx, { once: true });

        if (this.synth) {
          this.loadVoices();
          if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
          }
        }
      }
    }

    loadVoices() {
      if (!this.synth) return;
      this.voices = this.synth.getVoices();
    }

    getAudioContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    }

    toggleSfx() {
      this.sfxEnabled = !this.sfxEnabled;
      return this.sfxEnabled;
    }

    toggleSpeech() {
      this.speechEnabled = !this.speechEnabled;
      if (!this.speechEnabled && this.synth) {
        this.synth.cancel();
      }
      return this.speechEnabled;
    }

    // =========================================================================
    // PROCEDURAL LAB & MACHINE SFX
    // =========================================================================

    // Lightbulb "Ding!" / Idea Sparkle
    playIdeaDing() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // High bell tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2093, now); // C7
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);

      // Sparkle harmonics
      [2637, 3135].forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + 0.05 + idx * 0.06);
        g.gain.setValueAtTime(0.12, now + 0.05 + idx * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.05 + idx * 0.06 + 0.4);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + 0.05 + idx * 0.06);
        o.stop(now + 0.05 + idx * 0.06 + 0.4);
      });
    }

    // Gear Rotation / Ratchet Sound
    playGearClick() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const clicks = 4;
      for (let i = 0; i < clicks; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350 + i * 40, now + i * 0.04);
        gain.gain.setValueAtTime(0.15, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.03);
      }
    }

    // Component Magnetic Snap / Lock
    playComponentSnap() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Low solid thud + high metallic latch
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      g1.gain.setValueAtTime(0.25, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(g1);
      g1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1200, now + 0.02);
      osc2.frequency.exponentialRampToValueAtTime(600, now + 0.07);
      g2.gain.setValueAtTime(0.18, now + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(now + 0.02);
      osc2.stop(now + 0.07);
    }

    // Testing Machine Power-Up / Servo Hum
    playMachineHum() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.6);
      osc.frequency.linearRampToValueAtTime(130, now + 1.2);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.linearRampToValueAtTime(1000, now + 0.6);
      filter.frequency.linearRampToValueAtTime(400, now + 1.2);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    }

    // Success Chime / Correct Match
    playCorrect() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Upbeat cheerful arpeggio: C5, E5, G5, C6
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.2, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    }

    // Incorrect / Try Again Bonk
    playWrong() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    // Button Click UI
    playClick() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }

    // Mission Unlock / Fanfare
    playFanfare() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.15 }, // G5
        { f: 1046.50, d: 0.5 }  // C6
      ];

      let t = now;
      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + n.d);
        t += n.d * 0.8;
      });
    }

    // Audience Applause / Expo Cheering
    playApplause() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 2.0);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.35 ? 1 : 0.2);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.26, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 2.0);

      setTimeout(() => this.playFanfare(), 300);
    }

    // =========================================================================
    // SPEECH SYNTHESIS ENGINE (Grade 4 A1+ Calibrated)
    // =========================================================================

    speak(text, rate = 0.90, pitch = 1.05) {
      if (!this.speechEnabled || !this.synth) return;
      this.synth.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = rate;
      utter.pitch = pitch;

      if (this.voices.length === 0) {
        this.loadVoices();
      }

      const preferred = this.voices.find(v =>
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David')) &&
        v.lang.startsWith('en')
      );
      if (preferred) utter.voice = preferred;

      this.synth.speak(utter);
    }

    // Robot Assistant Voice ("Robo-Idea")
    speakRobot(text) {
      this.speak(text, 0.88, 1.28);
    }
  }

  root.youngInventorAudio = new YoungInventorAudio();

})(typeof window !== 'undefined' ? window : global);
