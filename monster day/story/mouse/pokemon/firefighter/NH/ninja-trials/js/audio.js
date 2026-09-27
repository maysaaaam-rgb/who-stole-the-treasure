/**
 * NINJA TRIALS: HARMONIC AUDIO & CALIBRATED SPEECH ENGINE
 * Zero-dependency Web Audio API synthesizer + calibrated Web Speech TTS
 * Dual-oscillator ADSR musical curves • Referee whistle synthesizer • Natural TTS voices
 */

(function(root) {
  'use strict';

  class NinjaAudioEngine {
    constructor() {
      this.ctx = null;
      this.voice = null;
      this.isMuted = false;
      this.currentUtterance = null;
      this.initVoiceSelector();
    }

    init() {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    initCtx() {
      this.init();
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.stopSpeech();
      }
      return this.isMuted;
    }

    initVoiceSelector() {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        this.voice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Ava'))
        ) || voices.find(v => v.lang.startsWith('en')) || null;
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    /**
     * playSnap(): Filtered tactile noise transient (1200 Hz -> 280 Hz) for card snapping
     */
    playSnap() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.05);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.linearRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    }

    /**
     * playXP(): Ascending dual-frequency chord chime (B5 987.77 Hz -> E6 1318.51 Hz)
     */
    playXP() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { f: 987.77, delay: 0 },
        { f: 1318.51, delay: 0.08 }
      ];

      notes.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, now + note.delay);

        gain.gain.setValueAtTime(0.22, now + note.delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.delay + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + note.delay);
        osc.stop(now + note.delay + 0.35);
      });
    }

    /**
     * playSoftFail(): Warm descending sine chime (246.94 Hz -> 220 Hz) with zero point deduction
     */
    playSoftFail() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chords = [
        { f: 246.94, delay: 0 },
        { f: 220.00, delay: 0.1 }
      ];

      chords.forEach(c => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(c.f, now + c.delay);
        osc.frequency.exponentialRampToValueAtTime(c.f * 0.9, now + c.delay + 0.22);

        gain.gain.setValueAtTime(0.18, now + c.delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.delay + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + c.delay);
        osc.stop(now + c.delay + 0.22);
      });
    }

    /**
     * playWhistle(): Crisp dual-frequency referee/ninja whistle cue for sudden FREEZE stops
     */
    playWhistle() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 0.55;

      // Two high resonant frequencies typical of sports pea whistles (2450 Hz & 2880 Hz)
      const f1 = 2450;
      const f2 = 2880;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator(); // 18Hz flutter modulation
      const lfoGain = this.ctx.createGain();
      const masterGain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(f1, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(f2, now);

      // Flutter LFO (creates the authentic pea whistle trill)
      lfo.frequency.setValueAtTime(18, now);
      lfoGain.gain.setValueAtTime(45, now);
      lfo.connect(osc1.frequency);
      lfo.connect(osc2.frequency);

      // Sharp attack, sustained whistle body, crisp cutoff
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.32, now + 0.04);
      masterGain.gain.setValueAtTime(0.32, now + duration - 0.08);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(masterGain);
      osc2.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      lfo.start(now);
      osc1.start(now);
      osc2.start(now);

      lfo.stop(now + duration);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    }

    /**
     * playTick(): Crisp digital stopwatch tick transient
     */
    playTick() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    }

    /**
     * playStampSlam(): Animated rubber stamp slam thud impact
     */
    playStampSlam() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    }

    /**
     * playFanfare(): Rising 4-note major arpeggio (C5 -> E5 -> G5 -> C6) with octave sparkle
     */
    playFanfare() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.11;
        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(freq * 2, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        overtone.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        overtone.start(now);
        osc.stop(now + 0.35);
        overtone.stop(now + 0.35);
      });
    }

    /**
     * speak(): Calibrated SpeechSynthesis (rate: 0.88, pitch: 1.05, lang: "en-US")
     */
    speak(text, onBoundary = null, onEnd = null) {
      if (typeof window === 'undefined' || this.isMuted || !('speechSynthesis' in window)) {
        if (typeof onEnd === 'function') setTimeout(onEnd, 1000);
        return;
      }

      this.stopSpeech();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      if (this.voice) {
        utterance.voice = this.voice;
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
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.currentUtterance = null;
    }
  }

  const ninjaAudioInstance = new NinjaAudioEngine();
  root.NinjaAudio = ninjaAudioInstance;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NinjaAudioEngine;
  }
})(typeof window !== 'undefined' ? window : global);
