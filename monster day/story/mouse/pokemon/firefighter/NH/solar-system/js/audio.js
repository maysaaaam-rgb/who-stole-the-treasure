/**
 * SOLAR SYSTEM EXPLORER: PLANETARY COMPARATIVES LAB — AUDIO ENGINE
 * Zero-Dependency Harmonic Web Audio API Synthesizers & Calibrated SpeechSynthesis
 * Zero external audio files or remote dependencies.
 */
(function(root) {
  'use strict';

  class SolarAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.currentUtterance = null;
      this.hasInteracted = false;
    }

    /**
     * Autoplay Guard: Initialize or resume AudioContext strictly on user gesture
     */
    initCtx() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.hasInteracted = true;
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.stopSpeech();
      }
      return this.isMuted;
    }

    /**
     * Clean mechanical triangle-wave click (1200 Hz -> 300 Hz) for card docking and flips
     */
    playSnap() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    }

    /**
     * Ascending chime arpeggio (B5 987.77 Hz to E6 1318.51 Hz) for XP collection
     */
    playXP(streak = 1) {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const baseFreq = 987.77; // B5
      const targetFreq = 1318.51; // E6
      const midFreq = 1174.66; // D6

      const notes = [baseFreq, midFreq, targetFreq];
      notes.forEach((freq, idx) => {
        const noteTime = this.ctx.currentTime + (idx * 0.065);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * Math.pow(1.05, Math.min(streak - 1, 5)), noteTime);

        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.35);
      });
    }

    /**
     * Descending two-tone sine bounce (246.94 Hz -> 220 Hz) for soft-fails
     */
    playSoftFail() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(246.94, now); // B3
      osc.frequency.setValueAtTime(220.00, now + 0.12); // A3
      osc.frequency.exponentialRampToValueAtTime(180.00, now + 0.32);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    }

    /**
     * 4-note major victory arpeggio (C5, E5, G5, C6)
     */
    playFanfare() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          if (this.isMuted) return;
          this.initCtx();
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.5);
        }, i * 110);
      });

      // Final sustained harmonic chord
      setTimeout(() => {
        if (this.isMuted) return;
        this.initCtx();
        const now = this.ctx.currentTime;
        [523.25, 659.25, 1046.50].forEach(f => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);

          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.95);
        });
      }, 480);
    }

    /**
     * Physical Stamp Slam Thud
     */
    playSlam() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.2);

      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);
    }

    /**
     * Card Whoosh Transition
     */
    playWhoosh() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.17);
    }

    /**
     * Calibrated Web Speech API TTS Engine
     * Strict rate: 0.88, pitch: 1.05, lang: "en-US"
     */
    speak(text, onBoundary = null, onEnd = null) {
      if (this.isMuted || !('speechSynthesis' in window)) {
        if (onEnd) setTimeout(onEnd, 1200);
        return;
      }

      this.stopSpeech();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      // Select high quality English voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')));
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      if (onBoundary) {
        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            onBoundary(event.charIndex, event.charLength || 0);
          }
        };
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
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

  root.SolarAudio = new SolarAudioEngine();
})(typeof window !== 'undefined' ? window : global);
