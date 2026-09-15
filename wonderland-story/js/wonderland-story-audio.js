/**
 * WONDERLAND THEATRE AUDIO & WEB SPEECH ENGINE
 * Grade 3 A1 Mini-Unit • Lesson 3: We Are the Wonderland Story!
 */

(function(root) {
  'use strict';

  class WonderlandStoryAudio {
    constructor() {
      this.ctx = null;
      this.sfxEnabled = true;
      this.speechEnabled = true;
      this.synth = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis : null;
      this.voices = [];
      this.carnivalTimer = null;
      this.isMusicPlaying = false;

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
    // PROCEDURAL THEATRICAL SFX
    // =========================================================================

    playCurtainChime() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [698.46, 880.00, 1046.50]; // F5, A5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);
        gain.gain.setValueAtTime(0.2, now + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 0.6);
      });
    }

    playCurtain() {
      this.playCurtainChime();
    }

    playDoorUnlock() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Key turn click + chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.setValueAtTime(880, now + 0.05);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      setTimeout(() => this.playSparkle(), 120);
    }

    playCorrect() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Cheerful ascending major triad: E5, G#5, B5, E6
      const triad = [659.25, 830.61, 987.77, 1318.51];
      triad.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    }

    playWrong() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Gentle downward bonk
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    playCardSnap() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    }

    playClick() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }

    playChime() {
      this.playSparkle();
    }

    playSparkle() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const pitches = [1300, 1600, 1900, 2200];
      pitches.forEach((p, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(p, now + idx * 0.05);
        gain.gain.setValueAtTime(0.15, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.25);
      });
    }

    startCarnivalMusic() {
      if (!this.sfxEnabled) return;
      this.stopCarnivalMusic();
      this.isMusicPlaying = true;

      const ctx = this.getAudioContext();
      if (!ctx) return;

      const rootFreqs = [261.63, 329.63, 392.00, 523.25];
      let step = 0;

      this.carnivalTimer = setInterval(() => {
        if (!this.isMusicPlaying || !this.sfxEnabled) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(rootFreqs[step % rootFreqs.length], now);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        step++;
      }, 230);
    }

    stopCarnivalMusic() {
      this.isMusicPlaying = false;
      if (this.carnivalTimer) {
        clearInterval(this.carnivalTimer);
        this.carnivalTimer = null;
      }
    }

    playFreezeWhistle() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.linearRampToValueAtTime(1750, now + 0.08);
      osc.frequency.linearRampToValueAtTime(1350, now + 0.18);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }

    playApplause() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 1.8);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.3 ? 1 : 0.2);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(2, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 1.8);
    }

    playCheer() {
      this.playApplause();
    }

    playFanfare() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.1 + idx * 0.08);
        g.gain.setValueAtTime(0.18, now + 0.1 + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + 0.1 + idx * 0.08);
        osc.stop(now + 1.3);
      });
    }

    // =========================================================================
    // SPEECH SYNTHESIS ENGINE (CEFR A1 Pacing)
    // =========================================================================

    speak(text, rate = 0.88, pitch = 1.05) {
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
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')) && v.lang.startsWith('en')
      );
      if (preferred) utter.voice = preferred;

      this.synth.speak(utter);
    }

    speakCharacter(text, pitch = 1.2, rate = 0.90) {
      if (!this.speechEnabled || !this.synth) return;
      this.synth.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = rate;
      utter.pitch = pitch;

      this.synth.speak(utter);
    }
  }

  root.wonderlandStoryAudio = new WonderlandStoryAudio();

})(typeof window !== 'undefined' ? window : global);
