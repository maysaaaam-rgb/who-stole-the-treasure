/**
 * THE MYSTERY OF YESTERDAY — PROCEDURAL AUDIO & SPEECH SYNTHESIS ENGINE
 * High-fidelity, self-contained Web Audio API sounds & Web Speech API TTS.
 * Zero external audio files or broken links.
 */

(function(root) {
  'use strict';

  class DetectivesSoundEngine {
    constructor() {
      this.ctx = null;
      this.sfxEnabled = true;
      this.speechEnabled = true;
      this.voice = null;
      this.speechRate = 0.90; // Clear, child-friendly pace for A1/A1+

      this.initVoices();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }

    getAudioContext() {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    initVoices() {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const voices = window.speechSynthesis.getVoices();
      if (!voices || !voices.length) return;
      const enVoice = voices.find(v => v.lang && v.lang.startsWith('en') && (
        v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')
      )) || voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0];
      this.voice = enVoice;
    }

    // --- Procedural Sound Effects ---

    playBoxRumble() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        // Low oscillating rumble with filtered noise
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(65, now);
        osc1.frequency.linearRampToValueAtTime(85, now + 0.2);
        osc1.frequency.linearRampToValueAtTime(55, now + 0.45);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(130, now);
        osc2.frequency.linearRampToValueAtTime(160, now + 0.2);
        osc2.frequency.linearRampToValueAtTime(110, now + 0.45);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.52);
        osc2.stop(now + 0.52);
      } catch (e) {}
    }

    playSuspenseDrum() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        // Rhythmic accelerating suspense ticks
        const times = [0, 0.22, 0.40, 0.55, 0.68, 0.78, 0.86, 0.93, 1.0];
        times.forEach((t, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(120 + i * 25, now + t);
          gain.gain.setValueAtTime(0.12 + i * 0.02, now + t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.07);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + 0.08);
        });
      } catch (e) {}
    }

    playStampThud() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        // Impact thud (low punch + wood knock)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) {}
    }

    playCorrectChime() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.18, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.32);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.35);
        });
      } catch (e) {}
    }

    playWrongBuzzer() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.26);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } catch (e) {}
    }

    playUnlockFanfare() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        // Ascending triumphant fanfare + golden sparkle
        const fanfareNotes = [
          { f: 440.00, d: 0.12, t: 0 },
          { f: 554.37, d: 0.12, t: 0.12 },
          { f: 659.25, d: 0.12, t: 0.24 },
          { f: 880.00, d: 0.50, t: 0.36 }
        ];
        fanfareNotes.forEach(item => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(item.f, now + item.t);
          gain.gain.setValueAtTime(0.26, now + item.t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + item.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + item.t);
          osc.stop(now + item.t + item.d + 0.05);
        });

        // High shimmer sparkle
        for (let i = 0; i < 6; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200 + i * 220, now + 0.4 + i * 0.06);
          gain.gain.setValueAtTime(0.08, now + 0.4 + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + i * 0.06 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + 0.4 + i * 0.06);
          osc.stop(now + 0.4 + i * 0.06 + 0.2);
        }
      } catch (e) {}
    }

    playFootstep() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } catch (e) {}
    }

    playClick() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } catch (e) {}
    }

    // --- Web Speech API TTS ---

    speak(text, options = {}) {
      if (!this.speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || this.speechRate;
        utterance.pitch = options.pitch !== undefined ? options.pitch : 1.0;
        if (this.voice) utterance.voice = this.voice;
        if (options.onEnd) utterance.onend = options.onEnd;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('SpeechSynthesis error:', e);
      }
    }

    speakTeacher(text, onEnd) {
      this.speak(text, { pitch: 1.05, rate: 0.88, onEnd });
    }

    speakMonster(text, onEnd) {
      this.speak(text, { pitch: 0.72, rate: 0.82, onEnd });
    }

    toggleSpeech() {
      this.speechEnabled = !this.speechEnabled;
      if (!this.speechEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return this.speechEnabled;
    }

    toggleSfx() {
      this.sfxEnabled = !this.sfxEnabled;
      return this.sfxEnabled;
    }
  }

  root.detectivesSound = new DetectivesSoundEngine();

})(typeof window !== 'undefined' ? window : global);
