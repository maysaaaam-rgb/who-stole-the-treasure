/**
 * POKÉMON TRAINER CHALLENGE - ZERO-DEPENDENCY AUDIO ENGINE
 * Uses Web Audio API for synthesized game sounds & Web Speech API for pronunciation
 */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.hasSpoken = false;
  }

  // Lazy-initialize AudioContext on first user touch/click
  initCtx() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }

  // Play a synthesized tone with frequency, type, duration, and volume
  playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.2, detune = 0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      if (detune) osc.detune.setValueAtTime(detune, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio tone error", e);
    }
  }

  // Synthesize white noise (for wind, fire, splash, thuds)
  playNoise(duration = 0.3, filterFreq = 1000, gainVal = 0.2) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const bufferSize = this.audioCtx.sampleRate * duration;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, this.audioCtx.currentTime);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start();
    } catch (e) {
      console.warn("Audio noise error", e);
    }
  }

  // --- STANDARD GAME SOUNDS ---

  playClick() {
    this.playTone(800, 'sine', 0.08, 0.15);
  }

  playSelect() {
    this.playTone(587.33, 'triangle', 0.12, 0.2);
    setTimeout(() => this.playTone(880, 'sine', 0.15, 0.2), 60);
  }

  playCorrect() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.18, 0.25), idx * 80);
    });
  }

  playWrong() {
    if (this.isMuted) return;
    this.playTone(220, 'sawtooth', 0.2, 0.25);
    setTimeout(() => this.playTone(164.81, 'sawtooth', 0.35, 0.3), 120);
  }

  playCelebration() {
    if (this.isMuted) return;
    const fanfare = [
      { f: 523.25, d: 100 },
      { f: 523.25, d: 100 },
      { f: 523.25, d: 100 },
      { f: 659.25, d: 300 },
      { f: 783.99, d: 200 },
      { f: 1046.50, d: 500 }
    ];
    let elapsed = 0;
    fanfare.forEach(note => {
      setTimeout(() => this.playTone(note.f, 'triangle', note.d / 1000 + 0.1, 0.3), elapsed);
      elapsed += note.d;
    });
  }

  playCountdown(count) {
    if (count > 0) {
      this.playTone(440, 'triangle', 0.15, 0.3);
    } else {
      this.playTone(880, 'sine', 0.5, 0.4);
    }
  }

  playRevealBoom() {
    this.playNoise(0.6, 500, 0.4);
    this.playTone(150, 'sawtooth', 0.5, 0.3);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.4, 0.3), 150);
    setTimeout(() => this.playTone(987.77, 'sine', 0.6, 0.35), 300);
  }

  playStarPowerup() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.15, 0.25), i * 60);
    });
  }

  playBossHit() {
    this.playNoise(0.4, 400, 0.35);
    this.playTone(120, 'square', 0.3, 0.3);
  }

  // --- ABILITY SPECIFIC SOUND EFFECTS ---
  playAbilityEffect(abilityId) {
    if (this.isMuted) return;

    switch (abilityId) {
      case 'breathe fire':
        this.playNoise(0.8, 1200, 0.35);
        this.playTone(180, 'sawtooth', 0.6, 0.2);
        break;
      case 'make electricity':
        for (let i = 0; i < 4; i++) {
          setTimeout(() => this.playTone(1200 + Math.random() * 800, 'sawtooth', 0.08, 0.25), i * 60);
        }
        break;
      case 'freeze things':
        this.playTone(1200, 'sine', 0.3, 0.2);
        setTimeout(() => this.playTone(1600, 'sine', 0.4, 0.25), 100);
        setTimeout(() => this.playTone(2100, 'sine', 0.5, 0.2), 200);
        break;
      case 'create wind':
      case 'fly':
        this.playNoise(0.7, 700, 0.3);
        this.playTone(350, 'sine', 0.5, 0.2);
        break;
      case 'swim':
      case 'control water':
        this.playNoise(0.4, 900, 0.25);
        setTimeout(() => this.playTone(400, 'sine', 0.2, 0.2), 100);
        setTimeout(() => this.playTone(550, 'sine', 0.25, 0.2), 200);
        break;
      case 'jump high':
        if (this.audioCtx) {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start();
          osc.stop(this.audioCtx.currentTime + 0.3);
        }
        break;
      case 'dig':
      case 'move rocks':
        this.playNoise(0.5, 350, 0.4);
        this.playTone(90, 'square', 0.4, 0.3);
        break;
      case 'run fast':
        this.playNoise(0.3, 1400, 0.3);
        break;
      case 'become invisible':
        this.playTone(600, 'sine', 0.4, 0.2);
        setTimeout(() => this.playTone(400, 'sine', 0.4, 0.15), 150);
        break;
      case 'make light':
        this.playTone(880, 'triangle', 0.3, 0.25);
        setTimeout(() => this.playTone(1320, 'sine', 0.4, 0.25), 100);
        break;
      case 'control plants':
        this.playTone(523.25, 'sine', 0.2, 0.2);
        setTimeout(() => this.playTone(659.25, 'triangle', 0.25, 0.2), 90);
        setTimeout(() => this.playTone(783.99, 'sine', 0.3, 0.2), 180);
        break;
      case 'see in the dark':
        this.playTone(300, 'sine', 0.5, 0.2);
        setTimeout(() => this.playTone(450, 'sine', 0.5, 0.2), 200);
        break;
      default:
        this.playTone(500, 'sine', 0.2, 0.2);
    }
  }

  // --- NATIVE WEB SPEECH API TTS ---
  speak(text, onEndCallback = null) {
    if (this.isMuted) return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // cancel previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Clear, classroom pacing for Grade 4 ESL
      utterance.pitch = 1.05; // Friendly tone
      utterance.lang = 'en-US';

      // Pick English voice if available
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira')));
      if (engVoice) {
        utterance.voice = engVoice;
      }

      if (onEndCallback) {
        utterance.onend = onEndCallback;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  }
}

const sounds = new SoundEngine();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SoundEngine;
}
