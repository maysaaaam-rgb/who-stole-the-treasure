/**
 * DINO DIG: PREHISTORIC PAST TENSE LAB — AUDIO ENGINE
 * Dual-oscillator Web Audio API Harmonic Sound Synthesis & Calibrated Speech Synthesis
 * Zero external audio files or remote dependencies.
 */
(function(root) {
  'use strict';

  class DinoAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.currentUtterance = null;
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
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.stopSpeech();
      }
      return this.isMuted;
    }

    /**
     * Dual-oscillator harmonic chime with exponential ADSR decay
     * Fundamental sine + overtone harmonic fifth (1.5x root) on triangle
     */
    playChime(rootFreq = 523.25, duration = 0.45) {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [rootFreq, rootFreq * 1.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Instant attack -> Exponential decay
        const peakGain = idx === 0 ? 0.22 : 0.12;
        gain.gain.setValueAtTime(peakGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      });
    }

    /**
     * Multi-stage C-Major Victory Fanfare
     * Ascending arpeggio [C5, E5, G5, C6] followed by a resonant chord
     */
    playFanfare() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playChime(freq, 0.55);
        }, i * 110);
      });

      // Final resonant sustained chord
      setTimeout(() => {
        [523.25, 659.25, 1046.50].forEach(f => this.playChime(f, 0.9));
      }, 480);
    }

    /**
     * Non-punitive Soft-Fail Protocol
     * Warm low-register sine drop (260Hz -> 180Hz) with zero harsh buzzers
     */
    playSoftFail() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.32);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    }

    /**
     * Tactile Stamp Impact Slam
     * Deep physical thud with rapid pitch dive for rubber stamp animation
     */
    playSlam() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.22);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);
    }

    /**
     * Card Whoosh / Slide Sound
     */
    playWhoosh() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.14);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.17);
    }

    /**
     * Streak Surge / Powerup Chime
     */
    playStreakChime(multiplier = 1) {
      if (this.isMuted) return;
      const base = 587.33; // D5
      const note = base * Math.pow(1.122, Math.min(multiplier, 6));
      this.playChime(note, 0.4);
      setTimeout(() => {
        this.playChime(note * 1.25, 0.35);
      }, 70);
    }

    /**
     * Calibrated Web Speech API TTS Engine
     * Pitch: 1.08, Rate: 0.86 (Calibrated for young learners CEFR A1-A2)
     * Supports onBoundary callback for real-time word teleprompter karaoke
     */
    speakPhrase(text, onBoundary = null, onEnd = null) {
      if (this.isMuted || !('speechSynthesis' in window)) {
        if (onEnd) setTimeout(onEnd, 1200);
        return;
      }

      this.stopSpeech();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.86;
      utterance.pitch = 1.08;
      utterance.lang = 'en-US';

      // Pick preferred English voice if available
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

  root.DinoAudio = new DinoAudioEngine();
})(typeof window !== 'undefined' ? window : global);
