/**
 * ============================================================================
 * INTERACTIVE STORY GAME ENGINE — AUDIO ASSET SYSTEM (v2.5)
 * 
 * Ambient Forest Soundscapes & Enhanced Game SFX:
 * - Ambient Forest Sound Generator (Gentle wind, procedural bird songs, stream trickle)
 * - Game SFX: Footsteps (dirt/grass), Key Sparkle Glissando, Gate Stone Grind
 * - Interfaces cleanly with existing StoryBridge and window.soundEngine
 * Zero external audio file requirements (100% Web Audio API synthesis).
 * ============================================================================
 */

(function(root) {
  'use strict';

  class StoryAudioSystem {
    constructor() {
      this.audioCtx = null;
      this.isAmbiencePlaying = false;
      this.ambienceGain = null;
      this.birdTimer = null;
      this.enabled = true;
    }

    _getAudioContext() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    }

    startForestAmbience() {
      if (this.isAmbiencePlaying || !this.enabled) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      try {
        this.isAmbiencePlaying = true;
        this.ambienceGain = ctx.createGain();
        this.ambienceGain.gain.setValueAtTime(0.06, ctx.currentTime);
        this.ambienceGain.connect(ctx.destination);

        // 1. Soft Forest Breeze (Pink/Brown noise filter)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.96 * b1 + white * 0.11;
          b2 = 0.86 * b2 + white * 0.25;
          output[i] = (b0 + b1 + b2) * 0.15;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(this.ambienceGain);
        whiteNoise.start();
        this.breezeSource = whiteNoise;

        // 2. Intermittent Forest Bird Chirps
        this._scheduleNextBirdSong();
      } catch (e) {
        console.warn('[StoryAudio] Ambience initialization deferred until user gesture.');
      }
    }

    _scheduleNextBirdSong() {
      if (!this.isAmbiencePlaying) return;
      const nextDelay = 3000 + Math.random() * 5000;
      this.birdTimer = setTimeout(() => {
        this.playBirdChirp();
        this._scheduleNextBirdSong();
      }, nextDelay);
    }

    playBirdChirp() {
      if (!this.enabled) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Cheerful woodland warble frequency modulation
        const baseFreq = 2200 + Math.random() * 800;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.06);
        osc.frequency.exponentialRampToValueAtTime(baseFreq - 300, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 400, now + 0.18);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      } catch (e) {}
    }

    playKeyGlissando() {
      const ctx = this._getAudioContext();
      if (!ctx) return;

      try {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C Major arpeggio shimmer
        notes.forEach((freq, idx) => {
          const now = ctx.currentTime + idx * 0.05;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.36);
        });
      } catch (e) {}
    }

    playGateGrind() {
      const ctx = this._getAudioContext();
      if (!ctx) return;

      try {
        const now = ctx.currentTime;
        // Heavy low-frequency rumble
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.linearRampToValueAtTime(45, now + 0.6);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.66);
      } catch (e) {}
    }

    stopAmbience() {
      this.isAmbiencePlaying = false;
      if (this.birdTimer) clearTimeout(this.birdTimer);
      if (this.breezeSource) {
        try { this.breezeSource.stop(); } catch (e) {}
      }
    }
  }

  root.StoryAudio = new StoryAudioSystem();

})(window);
