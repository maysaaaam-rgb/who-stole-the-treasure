/**
 * NASA MISSION: FIND A NEW PLANET — ZERO-DEPENDENCY AUDIO & TTS ENGINE
 * Web Audio API synthesized procedural SFX + SpeechSynthesis Narrator
 */
(function(root) {
  'use strict';

  class SpaceAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.isSpeaking = false;
    }

    _getAudioContext() {
      if (!this.ctx) {
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
      this.isMuted = !this.isMuted;
      if (this.isMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return this.isMuted;
    }

    // =========================================================================
    // PROCEDURAL SYNTHESIZED SFX (Pure Math & Web Audio)
    // =========================================================================

    // Stage 1: Phonics Magic "e" chime (Ascending major arpeggio with shimmer)
    playMagicEChime() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.38);
      });
    }

    // Stage 2: Sonar Radar Ping for surface probe
    playSonarPing() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1760, now); // A6
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.45);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);
    }

    // Stage 3 & 4: Hydraulic Snap for Cargo & Machine Parts
    playMechanicalSnap() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // 1. High click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.07);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.085);

      // 2. Low mechanical lock thud
      const thud = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thud.type = "sine";
      thud.frequency.setValueAtTime(160, now + 0.03);
      thud.frequency.exponentialRampToValueAtTime(50, now + 0.18);

      thudGain.gain.setValueAtTime(0.35, now + 0.03);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      thud.connect(thudGain);
      thudGain.connect(ctx.destination);
      thud.start(now + 0.03);
      thud.stop(now + 0.22);
    }

    // Stage 4: Alert Klaxon Warning Beep
    playAlertSiren() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      [0, 0.22].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(480, now + offset);
        osc.frequency.exponentialRampToValueAtTime(640, now + offset + 0.15);

        gain.gain.setValueAtTime(0.12, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      });
    }

    // Stage 4: Laser / Thermal Beam
    playThermalBeam() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.4);
      osc.frequency.linearRampToValueAtTime(440, now + 0.8);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    }

    // Stage 4: Water Flow / Splash
    playWaterSplash() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    }

    // Rocket Thruster Ignition Blast
    playThrusterBlast() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const duration = 1.2;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.4);
      filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    }

    // Positive Fanfare for Mission Completion
    playVictoryFanfare() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // C Major triumphant arpeggio: C4, G4, C5, E5, G5
      const chords = [
        { f: 261.63, t: 0.00, d: 0.15 },
        { f: 392.00, t: 0.15, d: 0.15 },
        { f: 523.25, t: 0.30, d: 0.20 },
        { f: 659.25, t: 0.50, d: 0.25 },
        { f: 783.99, t: 0.75, d: 0.70 }
      ];

      chords.forEach(c => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(c.f, now + c.t);

        gain.gain.setValueAtTime(0, now + c.t);
        gain.gain.linearRampToValueAtTime(0.25, now + c.t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + c.d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + c.t);
        osc.stop(now + c.t + c.d + 0.05);
      });
    }

    // Soft-fail gentle wobble bounce
    playSoftThud() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    }

    // =========================================================================
    // TTS SPEECH SYNTHESIS NARRATOR
    // =========================================================================

    speak(text, onComplete) {
      if (this.isMuted || !window.speechSynthesis) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88; // Gentle, clear delivery for A1 ESL learners
      utterance.pitch = 1.08; // Friendly, encouraging tone
      utterance.lang = "en-US";

      // Select high quality English voice if present
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      this.isSpeaking = true;
      let completed = false;
      const finish = () => {
        if (completed) return;
        completed = true;
        this.isSpeaking = false;
        if (typeof onComplete === 'function') onComplete();
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      // Safe fallback timer for headless/restricted audio environments
      const wordCount = (text || "").split(/\s+/).length;
      setTimeout(finish, Math.max(1000, wordCount * 220 + 500));

      window.speechSynthesis.speak(utterance);
    }
  }

  root.SpaceAudioEngine = SpaceAudioEngine;
  root.spaceAudio = new SpaceAudioEngine();
})(typeof window !== 'undefined' ? window : global);
