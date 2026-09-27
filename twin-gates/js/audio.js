/**
 * TWIN GATES: ESCAPE THE SKY CASTLE
 * Studio Harmonic Web Audio API Synthesizer & Speech Engine
 * Zero external MP3 dependencies • Polyphonic procedural audio
 */

(function(root) {
  'use strict';

  class TwinGatesAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.hasUserInteracted = false;

      const unlockAudio = () => {
        if (!this.hasUserInteracted) {
          this.hasUserInteracted = true;
          this.initContext();
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
          }
        }
      };

      ['click', 'touchstart', 'keydown'].forEach(evt => {
        window.addEventListener(evt, unlockAudio, { once: true, passive: true });
      });
    }

    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return this.isMuted;
    }

    // 1. Torch Light: Soft whoosh sweep with crackling fire noise
    playTorchLight() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Soft whoosh
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.6);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);

      // Crackling fire pops
      [0.08, 0.18, 0.28, 0.4, 0.55].forEach(delay => {
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(1100 + Math.random() * 400, now + delay);
        popOsc.frequency.exponentialRampToValueAtTime(200, now + delay + 0.04);

        popGain.gain.setValueAtTime(0.2, now + delay);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);

        popOsc.connect(popGain);
        popGain.connect(this.ctx.destination);
        popOsc.start(now + delay);
        popOsc.stop(now + delay + 0.06);
      });
    }

    // 2. Beast Snore: Low modulated sine vibration (80 Hz -> 60 Hz)
    playBeastSnore() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.8);
      osc.frequency.exponentialRampToValueAtTime(75, now + 1.4);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.5);
    }

    // 3. Heavy Stone/Wood Friction Door Creak (160 Hz -> 80 Hz)
    playDoorCreak() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.65);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.65);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.38, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.72);
    }

    // 4. Mechanical Snap / Key Unlock (1200 Hz -> 280 Hz)
    playSnap() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.09);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    }

    // 5. Dual-Tone XP Chime (B5 987.77 Hz -> E6 1318.51 Hz)
    playXP() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [987.77, 1318.51].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.35, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.48);
      });
    }

    // 6. Warm Descending Sine Soft-Fail (246.94 Hz -> 220 Hz)
    playSoftFail() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [246.94, 220.0].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.3, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.28);
      });
    }

    // 7. Rising 4-Note Major Victory Fanfare
    playVictoryFanfare() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const fanfare = [
        { f: 523.25, t: 0 },
        { f: 659.25, t: 0.12 },
        { f: 783.99, t: 0.24 },
        { f: 1046.50, t: 0.38 },
        { f: 1318.51, t: 0.54 }
      ];

      fanfare.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + note.t);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.4, now + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + note.t);
        osc.stop(now + note.t + 0.6);
      });
    }

    // 8. Calibrated Speech Narration (rate: 0.82, pitch: 1.05, en-US)
    speak(text, onComplete) {
      if (this.isMuted || !('speechSynthesis' in window)) {
        if (typeof onComplete === 'function') onComplete();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.82;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')) &&
        v.lang.startsWith('en')
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onend = () => {
        if (typeof onComplete === 'function') onComplete();
      };
      utterance.onerror = () => {
        if (typeof onComplete === 'function') onComplete();
      };

      window.speechSynthesis.speak(utterance);
    }
  }

  root.TwinGatesAudio = new TwinGatesAudioEngine();
})(typeof window !== 'undefined' ? window : global);
