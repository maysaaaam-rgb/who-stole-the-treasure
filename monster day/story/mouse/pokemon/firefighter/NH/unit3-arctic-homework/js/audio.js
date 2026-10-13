/**
 * UNIT 3 ARCTIC RESCUE — PROCEDURAL WEB AUDIO & CALIBRATED TTS ENGINE
 * Strictly follows AGENTS.md Audio Synthesis Laws:
 * - No single-frequency square/sawtooth beeps
 * - Polyphonic dual-oscillator ADSR chords
 * - Calibrated TTS: rate 0.88, pitch 1.05, lang "en-US"
 */

(function () {
  class ArcticAudioEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.unlocked = false;
      this._bindUnlock();
    }

    _bindUnlock() {
      const unlock = () => {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        this.unlocked = true;
      };
      ['pointerdown', 'click', 'touchstart', 'keydown'].forEach((evt) => {
        window.addEventListener(evt, unlock, { once: true, passive: true });
      });
    }

    _ensureCtx() {
      if (this.muted) return null;
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    /**
     * Dual-oscillator musical note helper with ADSR envelope
     */
    _playDualNote(freq, startTime, duration, peakGain = 0.14, typeA = 'triangle', typeB = 'sine') {
      const ctx = this._ensureCtx();
      if (!ctx) return;

      const oscA = ctx.createOscillator();
      const oscB = ctx.createOscillator();
      const gain = ctx.createGain();

      oscA.type = typeA;
      oscB.type = typeB;
      oscA.frequency.setValueAtTime(freq, startTime);
      oscB.frequency.setValueAtTime(freq * 1.003, startTime); // subtle chorus warmth

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      oscA.connect(gain);
      oscB.connect(gain);
      gain.connect(ctx.destination);

      oscA.start(startTime);
      oscB.start(startTime);
      oscA.stop(startTime + duration + 0.03);
      oscB.stop(startTime + duration + 0.03);
    }

    /**
     * Correct / Trail Unlocked: Ascending C-Major pentatonic chord (C5 -> E5 -> G5 -> C6)
     */
    playCorrect() {
      const ctx = this._ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, idx) => {
        this._playDualNote(f, now + idx * 0.075, 0.42, 0.14, 'triangle', 'sine');
      });
    }

    /**
     * Soft-Fail ("Snowy Dead End"): Warm descending two-tone sine chime (246.94 Hz -> 220 Hz)
     */
    playSoftFail() {
      const ctx = this._ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      this._playDualNote(246.94, now, 0.28, 0.12, 'sine', 'triangle');
      this._playDualNote(220.0, now + 0.18, 0.42, 0.12, 'sine', 'triangle');
    }

    /**
     * Card Flip / Trail Step: Low-pass filtered noise burst + soft wood-tap harmonic
     */
    playCardFlip() {
      const ctx = this._ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      const bufferSize = Math.floor(ctx.sampleRate * 0.045);
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
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);

      this._playDualNote(392.0, now, 0.09, 0.07, 'sine', 'triangle');
    }

    /**
     * Tool Unlocked in Explorer Inventory Bar
     */
    playToolUnlock() {
      const ctx = this._ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const chord = [587.33, 739.99, 880.0, 1174.66]; // D major sparkle arpeggio
      chord.forEach((f, idx) => {
        this._playDualNote(f, now + idx * 0.08, 0.55, 0.15, 'triangle', 'sine');
      });
    }

    /**
     * Treasure Gate / Aurora Victory Fanfare
     */
    playAuroraFanfare() {
      const ctx = this._ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const fanfare = [
        { f: 523.25, t: 0.0, d: 0.22 },
        { f: 659.25, t: 0.14, d: 0.22 },
        { f: 783.99, t: 0.28, d: 0.25 },
        { f: 1046.5, t: 0.44, d: 0.65 },
        { f: 783.99, t: 0.62, d: 0.25 },
        { f: 1046.5, t: 0.80, d: 0.90 }
      ];
      fanfare.forEach((n) => {
        this._playDualNote(n.f, now + n.t, n.d, 0.16, 'triangle', 'sine');
      });
      if (window.classSoundboard && typeof window.classSoundboard.playFanfare === 'function') {
        try { window.classSoundboard.playFanfare(); } catch (e) {}
      }
    }

    /**
     * Calibrated TTS Narration (rate: 0.88, pitch: 1.05, lang: "en-US")
     */
    speak(text) {
      if (this.muted || !text || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(String(text));
        utter.lang = 'en-US';
        utter.rate = 0.88;
        utter.pitch = 1.05;
        window.speechSynthesis.speak(utter);
      } catch (e) {}
    }

    toggleMute() {
      this.muted = !this.muted;
      if (this.muted && 'speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
      }
      return this.muted;
    }
  }

  window.arcticAudio = new ArcticAudioEngine();
})();
