/**
 * NASA MISSION: FIND A NEW PLANET — WARM HARMONIC WEB AUDIO ENGINE
 * Zero-dependency Web Audio API procedural synthesis + SpeechSynthesis Narrator
 * Calibrated for young primary learners: warm chords, soft pings, safe autoplay unlock.
 */
(function(root) {
  'use strict';

  class WarmAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.isSpeaking = false;
      this._unlocked = false;

      // Safe autoplay unlock on first user interaction anywhere on the page
      const unlockAudio = () => {
        if (!this._unlocked) {
          this._getAudioContext();
          this._unlocked = true;
          window.removeEventListener('pointerdown', unlockAudio);
          window.removeEventListener('keydown', unlockAudio);
        }
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
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
    // WARM HARMONIC PROCEDURAL SOUND EFFECTS (Web Audio API)
    // =========================================================================

    // Stage 1: Magic "e" Pentatonic Crystal Arpeggio (C5 -> D5 -> E5 -> G5 -> C6)
    playMagicEChime() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 587.33, 659.25, 783.99, 1046.50]; // C5, D5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.16, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.42);
      });
    }

    // Stage 2: Gentle Tibetan Bell / Sonar Ping (Warm G5 harmonic chime)
    playSonarPing() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Fundamental + gentle octave overtone
      [783.99, 1567.98].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        const vol = i === 0 ? 0.22 : 0.08;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      });
    }

    // Stage 3 & 4: Warm Soft Snap / Tactile Wooden Pop
    playMechanicalSnap() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }

    // Stage 4: Gentle Alert Chime (Minor 3rd warning, warm and friendly)
    playAlertSiren() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      [440, 523.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        gain.gain.setValueAtTime(0.14, now + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 0.24);
      });
    }

    // Stage 4: Thermal Beam Warm Harmonic Shimmer (F Major 7th)
    playThermalBeam() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const chord = [349.23, 440.00, 523.25, 659.25]; // F4, A4, C5, E5
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        osc.frequency.linearRampToValueAtTime(freq * 1.5, now + 0.5);

        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + 0.65);
      });
    }

    // Stage 4: Water Splash / Fresh Stream
    playWaterSplash() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }

    // Rocket Ignition Blast (Low rumble + ascending harmonic swell)
    playThrusterBlast() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Low warm swell
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(70, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.8);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.15);
    }

    // Victory Fanfare (Radiant C Major 9th Arpeggio)
    playVictoryFanfare() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [
        { f: 261.63, t: 0.00, d: 0.18 }, // C4
        { f: 329.63, t: 0.14, d: 0.18 }, // E4
        { f: 392.00, t: 0.28, d: 0.18 }, // G4
        { f: 493.88, t: 0.42, d: 0.24 }, // B4
        { f: 587.33, t: 0.58, d: 0.35 }, // D5
        { f: 1046.5, t: 0.82, d: 0.75 }  // C6
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0, now + n.t);
        gain.gain.linearRampToValueAtTime(0.24, now + n.t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.05);
      });
    }

    // Soft gentle bubble bounce (non-punitive fail)
    playSoftThud() {
      if (this.isMuted) return;
      const ctx = this._getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    }

    // =========================================================================
    // TTS SPEECH SYNTHESIS NARRATOR (Rate 0.88, Friendly Pitch 1.1)
    // =========================================================================
    speak(text, onComplete) {
      if (this.isMuted || !window.speechSynthesis) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88; // Gentle, supportive pace for 6-9 year olds
      utterance.pitch = 1.1; // Warm, friendly pitch
      utterance.lang = "en-US";

      // Select high quality voice if available
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

      // Safe fallback timer for audio restrictions or headless environments
      const wordCount = (text || "").split(/\s+/).length;
      setTimeout(finish, Math.max(1000, wordCount * 220 + 500));

      window.speechSynthesis.speak(utterance);
    }
  }

  root.WarmAudioEngine = WarmAudioEngine;
  root.spaceAudio = new WarmAudioEngine();
})(typeof window !== 'undefined' ? window : global);
