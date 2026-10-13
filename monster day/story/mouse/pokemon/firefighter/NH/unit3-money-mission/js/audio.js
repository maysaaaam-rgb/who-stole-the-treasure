/**
 * UNIT 3 SMARTBOARD REVISION MISSION — POLYPHONIC WEB AUDIO & TTS ENGINE
 * Conforms strictly to English Adventure Academy Audio Synthesis Laws:
 * - Dual-oscillator polyphonic ADSR chords
 * - Ascending C-Major pentatonic chord (C5 -> E5 -> G5 -> C6)
 * - Soft-fail warm descending sine chime (246.94 Hz -> 220 Hz)
 * - SpeechSynthesis calibrated to rate: 0.88, pitch: 1.05, lang: 'en-US'
 * - Autoplay guard: initializes only upon first user gesture
 */

(function(root) {
  'use strict';

  class MissionAudioEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.ttsEnabled = true;
      this._unlocked = false;
      this._bindGestureUnlock();
    }

    _bindGestureUnlock() {
      if (typeof window === 'undefined') return;
      const unlock = () => {
        if (!this._unlocked) {
          this._unlocked = true;
          this._ensureContext();
        }
      };
      window.addEventListener('pointerdown', unlock, { once: true, passive: true });
      window.addEventListener('click', unlock, { once: true, passive: true });
      window.addEventListener('keydown', unlock, { once: true, passive: true });
    }

    _ensureContext() {
      if (this.muted) return null;
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

    toggleMute() {
      this.muted = !this.muted;
      if (this.muted && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return this.muted;
    }

    // Dual-oscillator harmonic note helper
    _playDualNote(freq, startTime, duration, peakGain = 0.14, detuneCents = 6) {
      const ctx = this._ensureContext();
      if (!ctx) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(freq, startTime);
      osc2.frequency.setValueAtTime(freq * 1.5, startTime); // Perfect fifth harmonic overtone
      osc2.detune.setValueAtTime(detuneCents, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration + 0.02);
      osc2.stop(startTime + duration + 0.02);
    }

    // Correct / XP: Ascending C-Major pentatonic chord (C5 -> E5 -> G5 -> C6)
    playCorrect() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((f, idx) => {
        this._playDualNote(f, now + idx * 0.065, 0.36, 0.14);
      });
    }

    // Soft-Fail: Warm descending two-tone sine chime (246.94 Hz -> 220 Hz)
    playSoftFail() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const tones = [246.94, 220.00]; // B3 -> A3 warm gentle hint
      tones.forEach((f, idx) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(f, now + idx * 0.14);
        osc2.frequency.setValueAtTime(f * 2, now + idx * 0.14);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.11, now + idx * 0.14 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 0.28);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now + idx * 0.14);
        osc2.start(now + idx * 0.14);
        osc1.stop(now + idx * 0.14 + 0.3);
        osc2.stop(now + idx * 0.14 + 0.3);
      });
    }

    // Card Flip / Wire Snap: Low-pass filtered noise burst + harmonic click
    playCardFlip() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 0.055);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);

      this._playDualNote(587.33, now, 0.09, 0.08);
    }

    // Laser Zap for Clear Asteroids (polyphonic harmonic sweep + chord burst)
    playLaserHit() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now);
      osc1.frequency.exponentialRampToValueAtTime(329.63, now + 0.18);
      osc2.frequency.setValueAtTime(1318.51, now);
      osc2.frequency.exponentialRampToValueAtTime(440.00, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.24);
      osc2.stop(now + 0.24);

      this.playCorrect();
    }

    // Boss Unlock & Victory Fanfare
    playFanfare() {
      const ctx = this._ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chord.forEach((f, i) => {
        this._playDualNote(f, now + i * 0.09, 0.55, 0.16);
      });
    }

    // TTS Narration calibrated strictly to rate: 0.88, pitch: 1.05, lang: 'en-US'
    speak(text) {
      if (this.muted || !this.ttsEnabled || !text) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(String(text));
        utter.lang = 'en-US';
        utter.rate = 0.88;
        utter.pitch = 1.05;
        window.speechSynthesis.speak(utter);
      } catch (e) {}
    }
  }

  root.missionAudio = new MissionAudioEngine();
})(typeof window !== 'undefined' ? window : this);
