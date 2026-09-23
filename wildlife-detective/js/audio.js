/**
 * WILDLIFE DETECTIVE — WEB AUDIO API SYNTHESIZER & SPEECH TTS ENGINE
 * 100% Native Browser Audio Synthesis — Zero external sound files.
 */

(function(root) {
  'use strict';

  class WildlifeAudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.bgmGain = null;
      this.sfxGain = null;
      this.isMuted = false;
      this.bgmActive = false;
      this.bgmInterval = null;
      this.unlocked = false;

      // Speech Synthesis
      this.ttsVoice = null;
      this.ttsRate = 0.88;
      this.ttsPitch = 1.05;
      this.ttsLang = 'en-US';

      this._initVoices();
    }

    ensureAudio() {
      if (this.ctx && this.ctx.state === 'running') return true;

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;

        if (!this.ctx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.bgmGain = this.ctx.createGain();
          this.sfxGain = this.ctx.createGain();

          this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
          this.bgmGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
          this.sfxGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

          this.bgmGain.connect(this.masterGain);
          this.sfxGain.connect(this.masterGain);
          this.masterGain.connect(this.ctx.destination);
        }

        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }

        this.unlocked = true;
        return true;
      } catch (e) {
        console.warn('AudioContext deferred:', e);
        return false;
      }
    }

    _initVoices() {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const pick = () => {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return;
        const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Karen')));
        this.ttsVoice = preferred || voices.find(v => v.lang.startsWith('en')) || voices[0];
      };
      pick();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = pick;
      }
    }

    speak(text, onWordBoundary, onEnd) {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.ttsRate;
        utterance.pitch = this.ttsPitch;
        utterance.lang = this.ttsLang;
        if (this.ttsVoice) utterance.voice = this.ttsVoice;

        if (onWordBoundary) {
          utterance.onboundary = (e) => {
            if (e.name === 'word') {
              onWordBoundary(e.charIndex, e.charLength || 5);
            }
          };
        }

        if (onEnd) utterance.onend = onEnd;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('TTS error:', err);
      }
    }

    stopSpeech() {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
      }
      return this.isMuted;
    }

    // Toggle Nature Ranger Ambient Drone (Peaceful savanna/rainforest canopy vibe)
    toggleBGM() {
      if (!this.ensureAudio()) return false;
      if (this.bgmActive) {
        this.bgmActive = false;
        if (this.bgmInterval) {
          clearInterval(this.bgmInterval);
          this.bgmInterval = null;
        }
        return false;
      }

      this.bgmActive = true;
      const droneProgression = [174.61, 220.00, 261.63, 329.63, 261.63, 220.00]; // F3, A3, C4, E4
      let step = 0;

      const playChordStep = () => {
        if (!this.bgmActive || !this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const freq = droneProgression[step % droneProgression.length];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + 3.4);

        step++;
      };

      playChordStep();
      this.bgmInterval = setInterval(playChordStep, 1800);
      return true;
    }

    // Scanner Telemetry Beep (Biometric Scanning Feedback)
    playScannerBeep() {
      if (!this.ensureAudio() || this.isMuted) return;
      const now = this.ctx.currentTime;
      const freqs = [880, 1174, 1760];

      freqs.forEach((f, i) => {
        const t = now + (i * 0.05);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.1);
      });
    }

    // Camera Shutter Snap (Photo Verification)
    playCameraShutter() {
      if (!this.ensureAudio() || this.isMuted) return;
      const now = this.ctx.currentTime;

      // 1. Mechanical click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.05);

      // 2. White noise burst (mirror reflex)
      const bSize = Math.floor(this.ctx.sampleRate * 0.035);
      const buffer = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
      const d = buffer.getChannelData(0);
      for (let i = 0; i < bSize; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bSize * 0.2));

      const n = this.ctx.createBufferSource();
      n.buffer = buffer;
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.3, now + 0.02);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
      n.connect(nGain);
      nGain.connect(this.sfxGain);
      n.start(now + 0.02);
    }

    // Verified Truth Chime (Ascending Pentatonic Major)
    playTruthChime() {
      if (!this.ensureAudio() || this.isMuted) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + (idx * 0.07);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.24, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.5);
      });
    }

    // Clickbait Alert Buzzer (Harsh Two-Tone Square Wave Warning)
    playBuzzer() {
      if (!this.ensureAudio() || this.isMuted) return;
      [140, 115].forEach((freq, i) => {
        const t = this.ctx.currentTime + (i * 0.12);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.11);
      });
    }

    // Ranger Badge Promotion Fanfare
    playPromotionFanfare() {
      if (!this.ensureAudio() || this.isMuted) return;
      const chords = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
      chords.forEach((freq, idx) => {
        const t = this.ctx.currentTime + (idx * 0.12);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.75);
      });
    }

    // Procedural Animal Vocalization Synth
    playAnimalVocal(type) {
      if (!this.ensureAudio() || this.isMuted) return;
      const now = this.ctx.currentTime;

      if (type === 'elephant_trumpet') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.25);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.55);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.65);
      } else if (type === 'frog_croak') {
        for (let i = 0; i < 3; i++) {
          const t = now + (i * 0.08);
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(160, t);
          osc.frequency.exponentialRampToValueAtTime(95, t + 0.06);
          gain.gain.setValueAtTime(0.28, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t);
          osc.stop(t + 0.08);
        }
      } else if (type === 'owl_screech') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(920, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.35);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.45);
      } else {
        // Generic crisp camera snap
        this.playCameraShutter();
      }
    }
  }

  root.WildlifeAudio = new WildlifeAudioEngine();

})(typeof window !== 'undefined' ? window : this);
