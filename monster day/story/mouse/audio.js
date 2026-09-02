/**
 * audio.js - Web Audio API Sound Generator & Web Speech API Narrator
 * Zero external audio files required — 100% reliable, offline-capable, and responsive.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.speechEnabled = true;
    this.synth = window.speechSynthesis || null;
    this.preferredVoice = null;
    this.initVoices();
  }

  init() {
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

  initVoices() {
    if (!this.synth) return;
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      this.preferredVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Daniel')) && v.lang.startsWith('en'))
        || voices.find(v => v.lang.startsWith('en'))
        || voices[0];
    };
    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  playTone(freq, type = 'sine', duration = 0.2, gainValue = 0.2, delay = 0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    setTimeout(() => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio tone error:', e);
      }
    }, delay * 1000);
  }

  // Friendly UI click / pop
  playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Positive correct answer chime (Major 3rd + 5th + octave)
  playSuccess() {
    if (this.isMuted) return;
    this.playTone(523.25, 'triangle', 0.15, 0.25, 0);      // C5
    this.playTone(659.25, 'triangle', 0.15, 0.25, 0.08);   // E5
    this.playTone(783.99, 'triangle', 0.25, 0.25, 0.16);   // G5
    this.playTone(1046.50, 'sine', 0.4, 0.2, 0.24);        // C6
  }

  // Gentle, encouraging "try again" sound (never harsh)
  playEncouragement() {
    if (this.isMuted) return;
    this.playTone(440, 'sine', 0.18, 0.15, 0);     // A4
    this.playTone(392, 'sine', 0.25, 0.15, 0.12);  // G4
  }

  // Suspense sound for when cat is near / prediction
  playSuspense() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch (e) {}
  }

  // Playful cartoon cat meow
  playMeow() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(750, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.5);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      filter.Q.setValueAtTime(3, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  // Mouse scurrying footsteps
  playFootsteps() {
    if (this.isMuted) return;
    for (let i = 0; i < 6; i++) {
      const freq = 1200 + (i % 2 === 0 ? 150 : -100);
      this.playTone(freq, 'sine', 0.04, 0.1, i * 0.09);
    }
  }

  // Triumphant celebration fanfare for completing games/activities
  playFanfare() {
    if (this.isMuted) return;
    const notes = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 523.25, d: 0.12, t: 0.12 },
      { f: 523.25, d: 0.12, t: 0.24 },
      { f: 659.25, d: 0.35, t: 0.36 },
      { f: 587.33, d: 0.15, t: 0.72 },
      { f: 659.25, d: 0.15, t: 0.88 },
      { f: 783.99, d: 0.6,  t: 1.04 },
      { f: 1046.5, d: 0.8,  t: 1.40 }
    ];
    notes.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, 0.22, n.t);
    });
  }

  // Web Speech API for reading A1 English model sentences
  speak(text, onEndCallback = null) {
    if (!this.speechEnabled || !this.synth) {
      if (onEndCallback) onEndCallback();
      return;
    }
    try {
      this.synth.cancel();
      const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }
      if (onEndCallback) {
        utterance.onend = onEndCallback;
        utterance.onerror = onEndCallback;
      }
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech error:', e);
      if (onEndCallback) onEndCallback();
    }
  }

  stopSpeech() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeech();
    }
    return this.isMuted;
  }
}

window.soundEngine = new SoundEngine();
