/**
 * INVENTOR'S FORGE — HARMONIC SOUND ENGINE & TTS PIPELINE
 * Pure Web Audio API Oscillators | Zero External Dependencies
 */
(function(root) {
  'use strict';

  class InventorAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.isSpeechEnabled = true;
      this.isInitialized = false;
    }

    /**
     * Autoplay Guard: Unlock AudioContext on first user gesture
     */
    init() {
      if (this.isInitialized && this.ctx && this.ctx.state === 'running') {
        return Promise.resolve();
      }

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn('[InventorAudio] AudioContext not supported.');
        return Promise.resolve();
      }

      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === 'suspended') {
        return this.ctx.resume().then(() => {
          this.isInitialized = true;
        }).catch(err => {
          console.warn('[InventorAudio] Resume failed:', err);
        });
      }

      this.isInitialized = true;
      return Promise.resolve();
    }

    /**
     * 1. playCardSnap(): Crisp hydraulic click/snap when socketing puzzle parts
     */
    playCardSnap() {
      this.init().then(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Sharp high attack click (snap)
        const snapOsc = this.ctx.createOscillator();
        const snapFilter = this.ctx.createBiquadFilter();
        const snapGain = this.ctx.createGain();

        snapOsc.type = 'triangle';
        snapOsc.frequency.setValueAtTime(1400, now);
        snapOsc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

        snapFilter.type = 'bandpass';
        snapFilter.frequency.setValueAtTime(1800, now);
        snapFilter.Q.setValueAtTime(2.5, now);

        snapGain.gain.setValueAtTime(0.001, now);
        snapGain.gain.linearRampToValueAtTime(0.28, now + 0.005);
        snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        snapOsc.connect(snapFilter);
        snapFilter.connect(snapGain);
        snapGain.connect(this.ctx.destination);

        snapOsc.start(now);
        snapOsc.stop(now + 0.06);

        // Low hydraulic thud
        const thudOsc = this.ctx.createOscillator();
        const thudGain = this.ctx.createGain();
        thudOsc.type = 'sine';
        thudOsc.frequency.setValueAtTime(160, now + 0.01);
        thudOsc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

        thudGain.gain.setValueAtTime(0.001, now + 0.01);
        thudGain.gain.linearRampToValueAtTime(0.18, now + 0.015);
        thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        thudOsc.connect(thudGain);
        thudGain.connect(this.ctx.destination);
        thudOsc.start(now + 0.01);
        thudOsc.stop(now + 0.1);
      });
    }

    /**
     * 2. playTryAgainBuff(): Encouraging warm rising two-tone chime for bugs/retries (+10 Insight XP)
     */
    playTryAgainBuff() {
      this.init().then(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Two warm ascending notes (F4: 349.23Hz -> A4: 440Hz -> C5: 523.25Hz)
        const notes = [
          { freq: 349.23, time: 0.00, dur: 0.16 },
          { freq: 440.00, time: 0.12, dur: 0.18 },
          { freq: 523.25, time: 0.24, dur: 0.40 }
        ];

        notes.forEach(n => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(n.freq, now + n.time);

          gain.gain.setValueAtTime(0.001, now + n.time);
          gain.gain.linearRampToValueAtTime(0.20, now + n.time + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + n.time);
          osc.stop(now + n.time + n.dur + 0.05);
        });
      });
    }

    /**
     * 3. playInventionForge(): Polyphonic energetic chord when combining two relics
     */
    playInventionForge() {
      this.init().then(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Anvil strike transient
        const anvilOsc = this.ctx.createOscillator();
        const anvilGain = this.ctx.createGain();
        anvilOsc.type = 'triangle';
        anvilOsc.frequency.setValueAtTime(1864, now);
        anvilOsc.frequency.exponentialRampToValueAtTime(420, now + 0.1);

        anvilGain.gain.setValueAtTime(0.001, now);
        anvilGain.gain.linearRampToValueAtTime(0.35, now + 0.008);
        anvilGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        anvilOsc.connect(anvilGain);
        anvilGain.connect(this.ctx.destination);
        anvilOsc.start(now);
        anvilOsc.stop(now + 0.26);

        // Power chord resonance (G major triad: G3, B3, D4, G4)
        const chord = [196.00, 246.94, 293.66, 392.00, 783.99];
        chord.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + 0.04);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, now + 0.04);
          filter.frequency.exponentialRampToValueAtTime(3200, now + 0.15);
          filter.frequency.exponentialRampToValueAtTime(800, now + 0.8);

          gain.gain.setValueAtTime(0.001, now + 0.04);
          gain.gain.linearRampToValueAtTime(0.14, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + 0.04);
          osc.stop(now + 0.9);
        });
      });
    }

    /**
     * 4. playFanfare(): Multi-note victory arpeggio on pitch completion
     */
    playFanfare() {
      this.init().then(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const melody = [
          { freq: 523.25, time: 0.00, dur: 0.16 }, // C5
          { freq: 659.25, time: 0.13, dur: 0.16 }, // E5
          { freq: 783.99, time: 0.26, dur: 0.20 }, // G5
          { freq: 1046.50, time: 0.40, dur: 0.80 } // C6
        ];

        melody.forEach(m => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(m.freq, now + m.time);

          gain.gain.setValueAtTime(0.001, now + m.time);
          gain.gain.linearRampToValueAtTime(0.26, now + m.time + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + m.time + m.dur);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + m.time);
          osc.stop(now + m.time + m.dur + 0.05);
        });

        // Add a sparkling shimmer bell on the top note
        const shimmer = this.ctx.createOscillator();
        const sGain = this.ctx.createGain();
        shimmer.type = 'sine';
        shimmer.frequency.setValueAtTime(2093.00, now + 0.40);
        sGain.gain.setValueAtTime(0.001, now + 0.40);
        sGain.gain.linearRampToValueAtTime(0.12, now + 0.42);
        sGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

        shimmer.connect(sGain);
        sGain.connect(this.ctx.destination);
        shimmer.start(now + 0.40);
        shimmer.stop(now + 1.15);
      });
    }

    /**
     * 5. playTimerTick(): Gentle mechanical clock tick for the 60s pitch timer
     */
    playTimerTick() {
      this.init().then(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(3.0, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.09, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.03);
      });
    }

    /**
     * Web Speech API pipeline calibrated for primary learners
     */
    speakPrompt(text, onStart, onEnd) {
      if (!('speechSynthesis' in window) || !this.isSpeechEnabled) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }

      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.88;
      utter.pitch = 1.05;
      utter.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (engVoice) utter.voice = engVoice;

      if (typeof onStart === 'function') utter.onstart = onStart;
      utter.onend = () => { if (typeof onEnd === 'function') onEnd(); };
      utter.onerror = () => { if (typeof onEnd === 'function') onEnd(); };

      window.speechSynthesis.speak(utter);
    }

    stopSpeech() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }

    toggleSfx() {
      this.isMuted = !this.isMuted;
      return !this.isMuted;
    }

    toggleSpeech() {
      this.isSpeechEnabled = !this.isSpeechEnabled;
      if (!this.isSpeechEnabled) this.stopSpeech();
      return this.isSpeechEnabled;
    }
  }

  root.inventorAudio = new InventorAudioEngine();
})(typeof window !== 'undefined' ? window : global);
