/**
 * DINO EXPEDITION: PREHISTORIC HABITATS — AUDIO ENGINE
 * Polyphonic Dual-Oscillator ADSR Chords & Calibrated Speech Engine
 * Conforms strictly to AGENTS.md Audio Synthesis Laws (No raw beeps).
 */
(function(root) {
  'use strict';

  class DinoExpeditionAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.currentUtterance = null;
      this.hasUserGesture = false;
    }

    initCtx() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.hasUserGesture = true;
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.stopSpeech();
      }
      return this.isMuted;
    }

    /**
     * Card Flip: Low-pass filtered noise burst (1200 Hz -> 300 Hz) simulating a physical card snap
     */
    playSnap() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.04; // 40ms buffer
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Low-pass filter from 1200 Hz to 300 Hz
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    }

    /**
     * XP Gain: Ascending dual-tone chime (B5 987.77 Hz -> E6 1318.51 Hz)
     * Dual-oscillator ADSR exponential decay ramps
     */
    playXP() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const tones = [
        { freq: 987.77, start: now, dur: 0.18 },       // B5
        { freq: 1318.51, start: now + 0.08, dur: 0.32 } // E6
      ];

      tones.forEach(t => {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(t.freq, t.start);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(t.freq * 2, t.start); // Octave overtone for shimmer

        gain.gain.setValueAtTime(0.22, t.start);
        gain.gain.exponentialRampToValueAtTime(0.0001, t.start + t.dur);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(t.start);
        osc1.stop(t.start + t.dur);
        osc2.start(t.start);
        osc2.stop(t.start + t.dur);
      });
    }

    /**
     * Rubber stamp slam sound (punchy low-frequency thud with spring friction)
     */
    playStampSlam() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    }

    /**
     * Soft-Fail: Warm descending two-tone sine chime (246.94 Hz B3 -> 220 Hz A3)
     * Accompanied by encouraging voice clue. Zero buzzers or red penalty screens.
     */
    playSoftFail() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const tones = [
        { freq: 246.94, start: now, dur: 0.18 },
        { freq: 220.00, start: now + 0.14, dur: 0.28 }
      ];

      tones.forEach(t => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(t.freq, t.start);

        gain.gain.setValueAtTime(0.18, t.start);
        gain.gain.exponentialRampToValueAtTime(0.0001, t.start + t.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t.start);
        osc.stop(t.start + t.dur);
      });
    }

    /**
     * Ascending C-Major Victory Fanfare
     * [C5, E5, G5, C6] arpeggio concluding in a resonant polyphonic chord
     */
    playFanfare() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.1;
        const dur = idx === 3 ? 0.65 : 0.25;

        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, start);

        gain.gain.setValueAtTime(idx === 3 ? 0.24 : 0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        overtone.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
        overtone.start(start);
        overtone.stop(start + dur);
      });
    }

    /**
     * Calibrated Speech Synthesis
     * Strictly calibrated to rate: 0.88, pitch: 1.05, lang: "en-US"
     */
    speakText(text, onBoundary = null, onEnd = null) {
      if (this.isMuted) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }
      this.stopSpeech();

      if (!('speechSynthesis' in window)) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Ava')) && v.lang.startsWith('en'));
      if (preferred) {
        utterance.voice = preferred;
      }

      if (typeof onBoundary === 'function') {
        utterance.onboundary = (e) => {
          if (e.name === 'word') {
            onBoundary(e.charIndex, e.charLength || 0);
          }
        };
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        if (typeof onEnd === 'function') onEnd();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        if (typeof onEnd === 'function') onEnd();
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

  root.DinoExpeditionAudioEngine = DinoExpeditionAudioEngine;
  root.dinoExpeditionAudio = new DinoExpeditionAudioEngine();
})(typeof window !== 'undefined' ? window : global);
