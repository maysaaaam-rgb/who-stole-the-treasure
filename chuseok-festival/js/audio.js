/**
 * CHUSEOK FESTIVAL: KOREA'S HARVEST FESTIVAL
 * Web Audio API Procedural Synthesizer & Calibrated Speech Narration Engine
 * Polyphonic musical chords, traditional Korean Janggu drum, wooden loom clacks,
 * mystery chest reveals, spinning wheel ticks, and calibrated TTS narration.
 * Zero external audio file dependencies.
 */

(function(root) {
  'use strict';

  class ChuseokAudio {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.hasUserInteracted = false;
      this.currentUtterance = null;

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

    // 1. Correct / XP Pentatonic Ascending Chord (C5 -> E5 -> G5 -> C6)
    playCorrect() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    }

    // 2. Soft-Fail Warm Descending Sine Chime (246.94 Hz -> 220 Hz)
    playSoftFail() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(246.94, now); // B3
      osc.frequency.linearRampToValueAtTime(220.00, now + 0.28); // A3

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    }

    // 3. Wooden Loom Shuttle Clack (Dual resonant click)
    playLoomClack() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [0, 0.09].forEach((offset, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(idx === 0 ? 380 : 310, now + offset);
        osc.frequency.exponentialRampToValueAtTime(110, now + offset + 0.06);

        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.24, now + offset + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.08);
      });
    }

    // 4. Mystery Chest Unlock & Latch Creak
    playChestUnlock() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Metallic latch click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);

      // Shimmer chord
      [587.33, 880, 1174.66].forEach((f, i) => { // D5, A5, D6
        const chime = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(f, now + 0.08 + i * 0.05);

        cGain.gain.setValueAtTime(0.001, now + 0.08 + i * 0.05);
        cGain.gain.linearRampToValueAtTime(0.15, now + 0.1 + i * 0.05);
        cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45 + i * 0.05);

        chime.connect(cGain);
        cGain.connect(this.ctx.destination);
        chime.start(now + 0.08 + i * 0.05);
        chime.stop(now + 0.5 + i * 0.05);
      });
    }

    // 5. Traditional Korean Janggu Drum Thud & Rim Snap
    playJangguDrum(isHigh = false) {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseFreq = isHigh ? 220 : 130;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isHigh ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.65, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    }

    // 6. Spinning Prize Wheel Tick
    playWheelTick() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }

    // 7. Resonant Harvest Victory Fanfare & Gong
    playVictoryFanfare() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Resonant deep gong
      const gong = this.ctx.createOscillator();
      const gongGain = this.ctx.createGain();
      gong.type = 'sine';
      gong.frequency.setValueAtTime(146.83, now); // D3
      gong.frequency.linearRampToValueAtTime(138.59, now + 1.2);

      gongGain.gain.setValueAtTime(0.001, now);
      gongGain.gain.linearRampToValueAtTime(0.35, now + 0.03);
      gongGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      gong.connect(gongGain);
      gongGain.connect(this.ctx.destination);
      gong.start(now);
      gong.stop(now + 1.85);

      // Ascending triumphant fanfare
      const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      melody.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.2 + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + 0.2 + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.22 + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + idx * 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + 0.2 + idx * 0.12);
        osc.stop(now + 0.65 + idx * 0.12);
      });
    }

    // 8. Calibrated Web Speech API TTS Narration
    speakText(text, persona = 'rachel') {
      if (this.isMuted || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();

      // Clean brackets and pause annotations for speech
      const cleaned = text
        .replace(/\[pause[^\]]*\]/gi, ', ')
        .replace(/\[emphasis:\s*([^\]]+)\]/gi, '$1')
        .replace(/\[[^\]]+\]/g, '');

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'en-US';

      // Persona calibration
      const lower = String(persona || '').toLowerCase();
      if (lower.includes('marcus') || lower.includes('king') || lower.includes('monarch')) {
        utterance.rate = 0.82;
        utterance.pitch = 0.85; // Deep royal voice
      } else if (lower.includes('antony') || lower.includes('game') || lower.includes('master')) {
        utterance.rate = 1.0;
        utterance.pitch = 1.1; // High energy
      } else if (lower.includes('adam') || lower.includes('story')) {
        utterance.rate = 0.88;
        utterance.pitch = 0.98; // Warm narrative
      } else {
        // Default Rachel educator
        utterance.rate = 0.88;
        utterance.pitch = 1.05;
      }

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }

    stopSpeech() {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }

  root.ChuseokAudio = new ChuseokAudio();
})(typeof window !== 'undefined' ? window : global);
