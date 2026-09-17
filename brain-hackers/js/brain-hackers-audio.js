/**
 * 🧠 THE BRAIN HACKERS: PROCEDURAL AUDIO ENGINE
 * Self-contained Web Audio API synthesizer for futuristic neural laboratory sound effects.
 * 100% dependency-free, zero external audio asset requests, guaranteed instant playback.
 */

(function(window) {
  'use strict';

  class BrainHackersAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this._initialized = false;
    }

    init() {
      if (this._initialized) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
          this._initialized = true;
        }
      } catch (e) {
        console.warn('[BHAudio] Web Audio not supported:', e);
      }
    }

    _resume() {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      return this.isMuted;
    }

    // 1. Heartbeat / Electronic Pulse (Opening sequence)
    playHeartbeat() {
      if (this.isMuted) return;
      this._resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // Pulse 1
      this._createSubThump(now, 75, 40, 0.22, 0.45);
      // Pulse 2 (shorter, quieter)
      this._createSubThump(now + 0.28, 90, 45, 0.18, 0.3);
    }

    _createSubThump(startTime, startFreq, endFreq, duration, gainVal) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

      gain.gain.setValueAtTime(gainVal, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    }

    // 2. Neural Electric Zap / Connection
    playNeuralZap() {
      if (this.isMuted) return;
      this._resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.24);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    }

    // 3. Message Synapse Chime (Step harmonic: 1, 2, 3...)
    playConnectionChime(step = 1) {
      if (this.isMuted) return;
      this._resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      const freq = baseFreqs[(step - 1) % baseFreqs.length] || 659.25;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    }

    // 4. Success / Correct Ding
    playSuccessDing() {
      if (this.isMuted) return;
      this._resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [880, 1320, 1760].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    }

    // 5. Gentle Retry Tone
    playGentleRetry() {
      if (this.isMuted) return;
      this._resume();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(240, now + 0.25);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    }

    // 6. Victory Fanfare (Celebration)
    playVictoryFanfare() {
      if (this.isMuted) return;
      this._resume();
      if (!this.ctx) return;

      const notes = [
        { f: 523.25, d: 0.15 }, // C5
        { f: 659.25, d: 0.15 }, // E5
        { f: 783.99, d: 0.15 }, // G5
        { f: 1046.50, d: 0.5 }  // C6
      ];

      let t = this.ctx.currentTime;
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + n.d);

        t += n.d * 0.9;
      });
    }

    // 7. Speech Synthesis for Accessible English Delivery
    speakText(text, onComplete) {
      if (!window.speechSynthesis) {
        if (onComplete) onComplete();
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9; // clear, steady rate for young learners
        utterance.pitch = 1.05;

        // Try selecting an English voice if available
        const voices = window.speechSynthesis.getVoices();
        const engVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel')));
        if (engVoice) utterance.voice = engVoice;

        if (onComplete) {
          utterance.onend = onComplete;
          utterance.onerror = onComplete;
        }

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('[BHAudio] Speech synthesis error:', e);
        if (onComplete) onComplete();
      }
    }
  }

  window.BrainHackersAudio = new BrainHackersAudioEngine();
})(typeof window !== 'undefined' ? window : global);
