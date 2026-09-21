/**
 * ALICE IN WONDERLAND XP QUEST DECK — SOUND ENGINE & TTS NARRATION PIPELINE
 * Pure Web Audio API Oscillators | Zero External Dependencies
 */
(function(root) {
  'use strict';

  class AliceQuestAudio {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.isSpeechEnabled = true;
      this.isInitialized = false;
      this.currentUtterance = null;
    }

    /**
     * Autoplay Guard: Initialize audio context only after user gesture
     */
    init() {
      if (this.isInitialized && this.ctx && this.ctx.state === 'running') {
        return Promise.resolve();
      }

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn('[AliceQuestAudio] Web Audio API not supported.');
        return Promise.resolve();
      }

      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === 'suspended') {
        return this.ctx.resume().then(() => {
          this.isInitialized = true;
        }).catch(err => {
          console.warn('[AliceQuestAudio] AudioContext resume failed:', err);
        });
      }

      this.isInitialized = true;
      return Promise.resolve();
    }

    /**
     * Helper to create master gain and ensure clean cleanup
     */
    _createMaster(duration, startGain = 0.25) {
      if (!this.ctx || this.isMuted) return null;
      const now = this.ctx.currentTime;
      const master = this.ctx.createGain();
      master.gain.setValueAtTime(startGain, now);
      master.gain.linearRampToValueAtTime(0.001, now + duration);
      master.connect(this.ctx.destination);
      return { master, now };
    }

    /**
     * Gentle paper/card slide sweep
     */
    playPageTurn() {
      this.init().then(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Dual filtered sweep (soft friction + low air whoosh)
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(320, now + 0.16);
        filter.Q.setValueAtTime(1.8, now);

        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
      });
    }

    /**
     * High-register sparkly chime on card inspect and tier switch
     */
    playChime() {
      this.init().then(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Sparkle bell dual frequencies (G6: ~1568Hz, C7: ~2093Hz)
        const freqs = [1568, 2093];
        freqs.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0.001, now + idx * 0.05);
          gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.05 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.45);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.5);
        });
      });
    }

    /**
     * Multi-note ascending major arpeggio (C5 - E5 - G5 - C6) for XP award
     */
    playAwardFanfare() {
      this.init().then(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Notes: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
        const notes = [
          { freq: 523.25, time: 0.00, dur: 0.18 },
          { freq: 659.25, time: 0.11, dur: 0.18 },
          { freq: 783.99, time: 0.22, dur: 0.22 },
          { freq: 1046.50, time: 0.35, dur: 0.70 }
        ];

        notes.forEach(note => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.freq, now + note.time);

          gain.gain.setValueAtTime(0.001, now + note.time);
          gain.gain.linearRampToValueAtTime(0.25, now + note.time + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + note.time);
          osc.stop(now + note.time + note.dur + 0.05);
        });

        // Add a sparkling shimmer bell on the top note
        const shimmer = this.ctx.createOscillator();
        const sGain = this.ctx.createGain();
        shimmer.type = 'sine';
        shimmer.frequency.setValueAtTime(2093, now + 0.35);
        sGain.gain.setValueAtTime(0.001, now + 0.35);
        sGain.gain.linearRampToValueAtTime(0.12, now + 0.37);
        sGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

        shimmer.connect(sGain);
        sGain.connect(this.ctx.destination);
        shimmer.start(now + 0.35);
        shimmer.stop(now + 0.9);
      });
    }

    /**
     * Warm descending tone when trying to award without selecting a student
     */
    playSoftFail() {
      this.init().then(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(329.63, now); // E4
        osc.frequency.exponentialRampToValueAtTime(220.00, now + 0.32); // A3

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.20, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      });
    }

    /**
     * Speech Synthesis Engine calibrated for primary ESL learners
     * Pitch: 1.05, Rate: 0.88
     */
    speakChallenge(text, onStart, onEnd) {
      if (!('speechSynthesis' in window) || !this.isSpeechEnabled) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }

      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.88; // Friendly, articulate tempo
      utter.pitch = 1.05; // Slightly buoyant, friendly tone
      utter.lang = 'en-US';

      // Pick a clean English voice if available
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen')));
      if (engVoice) {
        utter.voice = engVoice;
      }

      if (typeof onStart === 'function') {
        utter.onstart = onStart;
      }

      utter.onend = () => {
        this.currentUtterance = null;
        if (typeof onEnd === 'function') onEnd();
      };

      utter.onerror = () => {
        this.currentUtterance = null;
        if (typeof onEnd === 'function') onEnd();
      };

      this.currentUtterance = utter;
      window.speechSynthesis.speak(utter);
    }

    stopSpeech() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.currentUtterance = null;
    }

    toggleSfx() {
      this.isMuted = !this.isMuted;
      return !this.isMuted;
    }

    toggleSpeech() {
      this.isSpeechEnabled = !this.isSpeechEnabled;
      if (!this.isSpeechEnabled) {
        this.stopSpeech();
      }
      return this.isSpeechEnabled;
    }
  }

  root.aliceAudio = new AliceQuestAudio();
})(typeof window !== 'undefined' ? window : global);
