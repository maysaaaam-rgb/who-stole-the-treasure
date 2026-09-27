/**
 * ECO-ENGINEERS: OCEAN CLEANERS & REEF RESCUE — AUDIO ENGINE
 * Dual-oscillator Web Audio API Harmonic Synthesis & Calibrated Speech Engine
 * Zero external MP3s or network dependencies.
 */
(function(root) {
  'use strict';

  class OceanAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.currentUtterance = null;
      this.hasUserGesture = false;
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
      this.hasUserGesture = true;
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.stopSpeech();
      }
      return this.isMuted;
    }

    /**
     * Card flip snap effect (880Hz -> 1760Hz rapid click)
     */
    playSnap() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.04);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    }

    /**
     * XP Gain chime: Dual-oscillator ascending harmonic fifth (B5 987.77Hz -> E6 1318.51Hz)
     */
    playXP() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { freq: 987.77, start: now, dur: 0.18 },
        { freq: 1318.51, start: now + 0.08, dur: 0.35 }
      ];

      notes.forEach((n) => {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(n.freq, n.start);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(n.freq * 1.5, n.start); // Perfect fifth harmonic overtone

        gain.gain.setValueAtTime(0.2, n.start);
        gain.gain.exponentialRampToValueAtTime(0.0001, n.start + n.dur);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(n.start);
        osc1.stop(n.start + n.dur);
        osc2.start(n.start);
        osc2.stop(n.start + n.dur);
      });
    }

    /**
     * Rubber stamp slam sound (low frequency thud)
     */
    playStampSlam() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    }

    /**
     * Soft-fail tone: Gentle descending warm sine tone (260Hz -> 180Hz)
     * Never harsh buzzers, red penalty screens, or punitive alarms
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
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    }

    /**
     * Multi-stage ascending C-Major Victory Fanfare
     * [C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)] at 100ms intervals
     */
    playFanfare() {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.1;
        const dur = idx === 3 ? 0.6 : 0.25;

        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, start);

        gain.gain.setValueAtTime(idx === 3 ? 0.24 : 0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

        osc.connect(gain);
        overtone.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + dur);
        overtone.start(start);
        overtone.stop(start + dur);
      });
    }

    /**
     * Calibrated Speech Synthesis
     * Calibrate to rate: 0.88, pitch: 1.05, lang: 'en-US'
     * Provides real-time word boundary callback for teleprompter karaoke highlight
     */
    speakText(text, onBoundary = null, onEnd = null) {
      if (this.isMuted) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }
      this.stopSpeech();

      if (!('speechSynthesis' in window)) {
        if (typeof onEnd === 'function') onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      // Pick preferred clear English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Ava')) && v.lang.startsWith('en'));
      if (preferred) {
        utterance.voice = preferred;
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
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.currentUtterance = null;
    }
  }

  root.OceanAudioEngine = OceanAudioEngine;
  root.oceanAudio = new OceanAudioEngine();
})(typeof window !== 'undefined' ? window : global);
