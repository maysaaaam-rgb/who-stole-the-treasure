/**
 * CLARA'S INVENTOR MYSTERY & THE INVENTOR CHALLENGE
 * Audio Engine: Web Audio API Procedural Synthesizer & Web Speech API TTS
 */

(function(root) {
  'use strict';

  class ClaraAudioEngine {
    constructor() {
      this.audioCtx = null;
      this.sfxEnabled = true;
      this.speechEnabled = true;
      this.selectedVoice = null;
      this.isSpeaking = false;

      this.initVoices();
    }

    getAudioContext() {
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

    initVoices() {
      if (!('speechSynthesis' in window)) return;
      const load = () => {
        const voices = window.speechSynthesis.getVoices();
        // Look for warm, clear English child/teacher friendly voices
        this.selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English'))) 
          || voices.find(v => v.lang.startsWith('en')) 
          || null;
      };
      load();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = load;
      }
    }

    toggleSfx() {
      this.sfxEnabled = !this.sfxEnabled;
      return this.sfxEnabled;
    }

    toggleSpeech() {
      this.speechEnabled = !this.speechEnabled;
      if (!this.speechEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return this.speechEnabled;
    }

    speak(text, onEnd) {
      if (!this.speechEnabled || !('speechSynthesis' in window)) {
        if (onEnd) onEnd();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) utterance.voice = this.selectedVoice;
      utterance.rate = 0.88; // Slightly slower for A1+ young learners
      utterance.pitch = 1.05;
      utterance.volume = 1.0;
      utterance.onstart = () => { this.isSpeaking = true; };
      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };
      window.speechSynthesis.speak(utterance);
    }

    stopSpeech() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.isSpeaking = false;
    }

    // Procedural Sound Effects (Web Audio API)
    playSuccess() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.24); // G5
      osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.36); // C6

      osc2.frequency.setValueAtTime(261.63, now);
      osc2.frequency.setValueAtTime(329.63, now + 0.12);
      osc2.frequency.setValueAtTime(392.00, now + 0.24);
      osc2.frequency.setValueAtTime(523.25, now + 0.36);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    }

    playChime() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    }

    playError() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    }

    playGear() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(300 + i * 80, now + i * 0.06);
        gain.gain.setValueAtTime(0.08, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.05);
      }
    }

    playPower() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.5);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    }

    playFanfare() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.15, t: 0 },    // C5
        { f: 659.25, d: 0.15, t: 0.15 }, // E5
        { f: 783.99, d: 0.15, t: 0.30 }, // G5
        { f: 1046.50, d: 0.45, t: 0.45 } // C6
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.2, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    }

    playClick() {
      if (!this.sfxEnabled) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    }
  }

  root.claraAudio = new ClaraAudioEngine();
})(window);
