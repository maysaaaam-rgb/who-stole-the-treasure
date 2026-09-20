/**
 * INVENTOR LAB — PROCEDURAL AUDIO & SPEECH SYNTHESIS ENGINE
 * High-fidelity Web Audio API sound effects and Web Speech API TTS.
 * Zero external audio files required.
 */

(function(root) {
  'use strict';

  class InventorAudioEngine {
    constructor() {
      this.ctx = null;
      this.sfxEnabled = true;
      this.speechEnabled = true;
      this.voice = null;
      this.speechRate = 0.92;

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

    playIdeaPing() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (idea arpeggio!)
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.2, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.38);
        });
      } catch (e) {}
    }

    playGearClick() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        // Mechanical ratchet double-click
        [0, 0.04].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(420, now + offset);
          osc.frequency.exponentialRampToValueAtTime(120, now + offset + 0.03);
          gain.gain.setValueAtTime(0.15, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.035);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.04);
        });
      } catch (e) {}
    }

    playMachineStart() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      } catch (e) {}
    }

    playBuildTinker() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        [880, 1174.66, 1318.51].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.18, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.18);
        });
      } catch (e) {}
    }

    playSuccess() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major
        chords.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.22, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.5);
        });
      } catch (e) {}
    }

    playTryAgain() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        // Bouncy encouraging wobble: low then cheerful bounce up!
        const freqs = [330, 293.66, 440];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.15, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.25);
        });
      } catch (e) {}
    }

    playFanfare() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const notes = [
          { f: 523.25, t: 0, d: 0.12 },
          { f: 523.25, t: 0.12, d: 0.12 },
          { f: 523.25, t: 0.24, d: 0.12 },
          { f: 659.25, t: 0.36, d: 0.32 },
          { f: 587.33, t: 0.68, d: 0.14 },
          { f: 783.99, t: 0.82, d: 0.5 }
        ];
        notes.forEach(n => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.f, now + n.t);
          gain.gain.setValueAtTime(0.24, now + n.t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + n.t);
          osc.stop(now + n.t + n.d + 0.05);
        });
      } catch (e) {}
    }

    // --- Web Speech API TTS ---

    speak(text, onEnd) {
      if (!this.speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
        if (onEnd) onEnd();
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*_#`]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        if (this.voice) utterance.voice = this.voice;
        utterance.rate = this.speechRate;
        utterance.pitch = 1.05; // Slightly friendly, child-suited pitch
        if (onEnd) {
          utterance.onend = onEnd;
          utterance.onerror = onEnd;
        }
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        if (onEnd) onEnd();
      }
    }

    stopSpeech() {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }

    toggleSfx() {
      this.sfxEnabled = !this.sfxEnabled;
      return this.sfxEnabled;
    }

    toggleSpeech() {
      this.speechEnabled = !this.speechEnabled;
      if (!this.speechEnabled) this.stopSpeech();
      return this.speechEnabled;
    }
  }

  root.InventorAudioEngine = InventorAudioEngine;
  root.inventorAudio = new InventorAudioEngine();

})(typeof window !== 'undefined' ? window : this);
