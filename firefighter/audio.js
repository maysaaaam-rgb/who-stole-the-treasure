/**
 * audio.js - Fire Station Adventure Web Audio & Speech Narration Engine
 * Zero external sound files - 100% offline, smartboard-optimized Web Audio API
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.speechEnabled = true;
    this.synth = window.speechSynthesis || null;
    this.preferredVoice = null;
    this.speechRate = 0.88; // Ideal pacing for A1+ young learners
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
      // Look for natural English voice
      this.preferredVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('George') || v.name.includes('Daniel') || v.name.includes('Serena')) && v.lang.startsWith('en'))
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
      } catch (e) {}
    }, delay * 1000);
  }

  // Friendly button tap / pop
  playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Success chime (Major chord C5 -> E5 -> G5 -> C6)
  playSuccess() {
    if (this.isMuted) return;
    this.playTone(523.25, 'triangle', 0.15, 0.25, 0);      // C5
    this.playTone(659.25, 'triangle', 0.15, 0.25, 0.08);   // E5
    this.playTone(783.99, 'triangle', 0.25, 0.25, 0.16);   // G5
    this.playTone(1046.50, 'sine', 0.45, 0.22, 0.24);      // C6
  }

  // Gentle, encouraging sound
  playTryAgain() {
    if (this.isMuted) return;
    this.playTone(392.00, 'sine', 0.15, 0.18, 0);     // G4
    this.playTone(329.63, 'sine', 0.25, 0.18, 0.12);  // E4
  }

  // Mystery object reveal fanfare
  playMystery() {
    if (this.isMuted) return;
    this.playTone(440, 'triangle', 0.1, 0.2, 0);
    this.playTone(554.37, 'triangle', 0.1, 0.2, 0.08);
    this.playTone(659.25, 'triangle', 0.15, 0.2, 0.16);
    this.playTone(880, 'sine', 0.35, 0.25, 0.24);
  }

  // Fire Engine Siren (Classic two-tone emergency wail)
  playSiren() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      // Modulate frequency between 650Hz and 950Hz
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.linearRampToValueAtTime(920, now + 0.3);
      osc.frequency.linearRampToValueAtTime(650, now + 0.6);
      osc.frequency.linearRampToValueAtTime(920, now + 0.9);
      osc.frequency.linearRampToValueAtTime(650, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 1.2);
    } catch (e) {}
  }

  // High-pressure water spray rushing sound
  playWaterSpray(duration = 1.0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      // White noise buffer for water rush
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.8));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to sound like water whoosh
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // Fire extinguished (Steam hiss + positive completion chime)
  playExtinguish() {
    if (this.isMuted) return;
    this.playWaterSpray(0.6);
    setTimeout(() => {
      this.playSuccess();
    }, 400);
  }

  // Grand celebration / Graduation fanfare
  playFanfare() {
    if (this.isMuted) return;
    const chords = [
      { f: 523.25, d: 0.15, t: 0 },
      { f: 659.25, d: 0.15, t: 0.1 },
      { f: 783.99, d: 0.2, t: 0.2 },
      { f: 1046.50, d: 0.45, t: 0.35 },
      { f: 880.00, d: 0.15, t: 0.6 },
      { f: 1046.50, d: 0.6, t: 0.75 },
    ];
    chords.forEach(c => {
      this.playTone(c.f, 'triangle', c.d, 0.25, c.t);
    });
  }

  // Humorous boing/buzz for incorrect silly choices (like pizza in engine)
  playBoing() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }

  // Speech Narration via Web Speech API
  speak(text, onStart = null, onEnd = null) {
    if (!this.synth || !this.speechEnabled) {
      if (onEnd) onEnd();
      return;
    }
    this.stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }
    utterance.rate = this.speechRate;
    utterance.pitch = 1.05; // Slightly warm/friendly pitch for kids

    if (onStart) utterance.onstart = onStart;
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  stopSpeech() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  toggleSpeech() {
    this.speechEnabled = !this.speechEnabled;
    if (!this.speechEnabled) {
      this.stopSpeech();
    }
    return this.speechEnabled;
  }
}

window.soundEngine = new SoundEngine();
