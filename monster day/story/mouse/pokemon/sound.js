/**
 * POKÉMON TRAINER BATTLE - SOUND SYNTHESIS & SPEECH ENGINE
 * Uses Web Audio API for 100% reliable zero-dependency SFX
 * Uses Web Speech API for native English pronunciation
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.speechAvailable = ('speechSynthesis' in window);
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

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Helper to create basic synth tone
  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.2, pitchSlide = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (pitchSlide) {
      osc.frequency.exponentialRampToValueAtTime(pitchSlide, this.ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClick() {
    this.playTone(800, 'triangle', 0.06, 0.15, 400);
  }

  playSelect() {
    this.playTone(523.25, 'sine', 0.08, 0.15);
    setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.18), 70);
  }

  playCorrect() {
    if (this.muted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.14, 0.2);
      }, i * 75);
    });
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    this.playTone(300, 'sawtooth', 0.25, 0.2, 180);
    setTimeout(() => {
      this.playTone(240, 'sawtooth', 0.35, 0.2, 120);
    }, 150);
  }

  playCountdown(count) {
    if (this.muted) return;
    this.init();
    const freqs = { 3: 440, 2: 554.37, 1: 659.25 };
    const freq = freqs[count] || 440;
    this.playTone(freq, 'sine', 0.25, 0.25);
  }

  playReveal() {
    if (this.muted) return;
    this.init();
    const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
    arpeggio.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.35, 0.25);
      }, idx * 60);
    });
  }

  playPoint() {
    this.playTone(880, 'sine', 0.1, 0.2, 1320);
  }

  playSuper() {
    if (this.muted) return;
    this.init();
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.18, 0.25), i * 60);
    });
  }

  playHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // White noise explosion burst
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
    this.playTone(120, 'triangle', 0.25, 0.35, 40);
  }

  playAttackSound(type) {
    if (this.muted) return;
    this.init();

    switch (type) {
      case 'fire':
        this.playHit();
        this.playTone(350, 'sawtooth', 0.45, 0.28, 120);
        setTimeout(() => this.playTone(280, 'triangle', 0.35, 0.3, 80), 80);
        break;

      case 'ice':
        const iceNotes = [1200, 1500, 1800, 2400];
        iceNotes.forEach((n, idx) => {
          setTimeout(() => this.playTone(n, 'sine', 0.2, 0.18), idx * 50);
        });
        break;

      case 'electric':
        for (let i = 0; i < 6; i++) {
          setTimeout(() => {
            this.playTone(Math.random() * 1000 + 500, 'square', 0.05, 0.15);
          }, i * 40);
        }
        break;

      case 'swim':
        this.playTone(400, 'sine', 0.3, 0.25, 800);
        setTimeout(() => this.playTone(600, 'triangle', 0.25, 0.2, 300), 100);
        break;

      case 'fly':
        this.playTone(300, 'triangle', 0.35, 0.25, 900);
        setTimeout(() => this.playTone(700, 'sine', 0.25, 0.2, 300), 120);
        break;

      case 'jump':
        this.playTone(200, 'sine', 0.3, 0.3, 750);
        break;

      case 'dig':
        this.playTone(160, 'triangle', 0.4, 0.35, 50);
        setTimeout(() => this.playHit(), 100);
        break;

      case 'invisible':
        this.playTone(880, 'sine', 0.4, 0.18, 440);
        setTimeout(() => this.playTone(550, 'sine', 0.4, 0.18, 880), 150);
        break;

      default:
        this.playHit();
    }
  }

  playVictory() {
    if (this.muted) return;
    this.init();

    // Classic Pokémon fanfare sequence
    const fanfare = [
      { f: 523.25, d: 0.15, pause: 140 }, // C5
      { f: 523.25, d: 0.15, pause: 140 }, // C5
      { f: 523.25, d: 0.15, pause: 140 }, // C5
      { f: 523.25, d: 0.35, pause: 300 }, // C5
      { f: 415.30, d: 0.35, pause: 300 }, // G#4
      { f: 466.16, d: 0.35, pause: 300 }, // A#4
      { f: 523.25, d: 0.25, pause: 200 }, // C5
      { f: 466.16, d: 0.15, pause: 120 }, // A#4
      { f: 523.25, d: 0.70, pause: 600 }  // C5 (long hold)
    ];

    let delay = 0;
    fanfare.forEach(note => {
      setTimeout(() => {
        this.playTone(note.f, 'triangle', note.d, 0.3);
      }, delay);
      delay += note.pause;
    });
  }

  // Native Speech Synthesis for clear English audio
  speak(text) {
    if (this.muted || !this.speechAvailable) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.88; // slightly slower, clear for young ESL learners
      utterance.pitch = 1.05; // warm, energetic

      // Prefer high quality English voices if available
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')))) || voices.find(v => v.lang.startsWith('en'));
      if (enVoice) {
        utterance.voice = enVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }
}

const sounds = new SoundEngine();
