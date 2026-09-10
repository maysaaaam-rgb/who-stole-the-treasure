/**
 * "AMAZING ROBOTS AROUND THE WORLD" — Audio Engine
 * Web Audio API Synthesizer + Web Speech API
 * 100% offline, zero external audio dependencies.
 */

class RobotsAudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.speechEnabled = true;
    this.synth = window.speechSynthesis || null;
    this.selectedVoice = null;
    this.initSpeech();
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initSpeech() {
    if (!this.synth) return;
    const updateVoices = () => {
      const voices = this.synth.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('George') || v.name.includes('Daniel') || v.name.includes('Samantha'))) ||
                        voices.find(v => v.lang.startsWith('en')) ||
                        voices[0];
      if (preferred) {
        this.selectedVoice = preferred;
      }
    };
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
    updateVoices();
  }

  speak(text, onEnd = null) {
    if (!this.speechEnabled || !this.synth) {
      if (onEnd) setTimeout(onEnd, 800);
      return;
    }
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) utterance.voice = this.selectedVoice;
    utterance.lang = 'en-GB';
    utterance.rate = 0.88; // Clear, friendly cadence for A1-A2 young learners
    utterance.pitch = 1.05;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    this.synth.speak(utterance);
  }

  stopSpeech() {
    if (this.synth) this.synth.cancel();
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleSpeech() {
    this.speechEnabled = !this.speechEnabled;
    if (!this.speechEnabled) this.stopSpeech();
    return this.speechEnabled;
  }

  // SFX: Sci-Fi Scanner Sweep
  playScan() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.3);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.33);
  }

  // SFX: Correct / Success Chime
  playCorrect() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.24, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.32);
    });
  }

  // SFX: Gentle retry tone
  playGentle() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  // SFX: Mechanical Page Turn / Click
  playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // SFX: Discovery Boing
  playBoing() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';

    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.32);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  // SFX: Victory Fanfare
  playFanfare() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 0.12 },
      { f: 783.99, t: 0.24 },
      { f: 1046.50, t: 0.38 }
    ];

    chords.forEach(c => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(c.f, now + c.t);

      gain.gain.setValueAtTime(0.28, now + c.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + c.t);
      osc.stop(now + c.t + 0.55);
    });
  }
}

if (typeof window !== 'undefined') {
  window.RobotsAudioEngine = RobotsAudioEngine;
  window.robotsSound = new RobotsAudioEngine();
}
