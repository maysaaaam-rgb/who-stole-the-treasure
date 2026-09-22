/**
 * DINO ARENA: TOP TRUMPS PALEONTOLOGY CLASH — AUDIO ENGINE
 * Zero-Dependency Harmonic Web Audio API Synthesizers & Calibrated SpeechSynthesis
 * Zero external audio files or remote dependencies.
 */
(function(root) {
  'use strict';

  class DinoArenaAudio {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.currentUtterance = null;
      this.hasInteracted = false;
    }

    /**
     * Autoplay Guard: Initialize or resume AudioContext strictly on user gesture
     */
    initCtx() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.hasInteracted = true;
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.stopSpeech();
      }
      return this.isMuted;
    }

    /**
     * playCardSnap(): Clean mechanical click (1200 Hz -> 300 Hz) for card draws and flips
     */
    playCardSnap() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    }

    /**
     * playClashImpact(): Heavy low-pass thud (150 Hz -> 50 Hz) with subtle white-noise crunch for collision
     */
    playClashImpact() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Low Thud Oscillator
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

      oscGain.gain.setValueAtTime(0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);

      // 2. White-Noise Crunch Burst
      try {
        const bufferSize = this.ctx.sampleRate * 0.08;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.08);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.09);
      } catch (e) {
        // Fallback gracefully
      }
    }

    /**
     * playXP(): Ascending dual-oscillator arpeggio (B5 987.77 Hz to E6 1318.51 Hz)
     */
    playXP(multiplier = 1) {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const pitchScale = Math.pow(1.04, Math.min(multiplier - 1, 6));
      const notes = [987.77 * pitchScale, 1174.66 * pitchScale, 1318.51 * pitchScale];

      notes.forEach((freq, idx) => {
        const noteTime = this.ctx.currentTime + (idx * 0.065);
        [freq, freq * 1.5].forEach((hFreq, hIdx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = hIdx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(hFreq, noteTime);

          const peak = hIdx === 0 ? 0.2 : 0.08;
          gain.gain.setValueAtTime(peak, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.3);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 0.32);
        });
      });
    }

    /**
     * playSoftFail(): Warm descending sine drop (246.94 Hz -> 220 Hz)
     */
    playSoftFail() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(246.94, now); // B3
      osc.frequency.setValueAtTime(220.00, now + 0.12); // A3
      osc.frequency.exponentialRampToValueAtTime(180.00, now + 0.32);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    }

    /**
     * playVictory(): Majestic 4-note major fanfare (C5, E5, G5, C6)
     */
    playVictory() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          if (this.isMuted) return;
          this.initCtx();
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.5);
        }, i * 110);
      });

      // Final sustained harmonic resonance
      setTimeout(() => {
        if (this.isMuted) return;
        this.initCtx();
        const now = this.ctx.currentTime;
        [523.25, 659.25, 1046.50].forEach(f => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);

          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 1.0);
        });
      }, 480);
    }

    /**
     * playRoar(): Fearsome synthesized prehistoric dinosaur roar
     * Uses FM modulation and resonant bandpass noise sweeps
     */
    playRoar() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Guttural sub-bass sweep
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.55);

      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      // Lowpass filter for deep beast resonance
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(160, now + 0.6);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.68);

      // 2. Modulated breath/roar crunch noise
      try {
        const bufferSize = this.ctx.sampleRate * 0.45;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.8;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.Q.value = 2.5;
        noiseFilter.frequency.setValueAtTime(800, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(220, now + 0.45);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.46);
      } catch (e) {}
    }

    /**
     * playFootsteps(): Heavy prehistoric ground stomps
     */
    playFootsteps() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      [0, 0.28].forEach((offset) => {
        const t = this.ctx.currentTime + offset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(95, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.16);

        gain.gain.setValueAtTime(0.32, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.19);
      });
    }

    /**
     * playThud(): Deep physical scale impact when dinosaurs drop onto the balance
     */
    playThud() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.26);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.29);
    }

    /**
     * speak(text, onBoundary, onEnd): Calibrated native speech synthesis
     * rate: 0.88, pitch: 1.05, lang: "en-US"
     */
    speak(text, onBoundary = null, onEnd = null) {
      if (this.isMuted || !('speechSynthesis' in window)) {
        if (onEnd) setTimeout(onEnd, 1200);
        return;
      }

      this.stopSpeech();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      // Pick high quality English voice
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')));
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      if (onBoundary) {
        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            onBoundary(event.charIndex, event.charLength || 0);
          }
        };
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }

    stopSpeech() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.currentUtterance = null;
    }
  }

  root.DinoArenaAudio = new DinoArenaAudio();
})(typeof window !== 'undefined' ? window : global);
